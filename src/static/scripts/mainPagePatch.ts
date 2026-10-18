type Callable = (...args: any[]) => any;
type RuntimeRequire = {
	(id: string): any;
	m?: Record<string, Callable>;
};
type PageState = {
	ids: Set<unknown>;
	vibe?: any;
	className?: string;
	installed: boolean;
	refreshScheduled?: boolean;
};

const states = new WeakMap<RuntimeRequire, PageState>();
const patched = new WeakSet<object>();
const installing = new WeakSet<RuntimeRequire>();

export function installMainPagePatch(
	require: RuntimeRequire,
	jsx: Callable,
): boolean {
	if (installing.has(require)) return false;
	installing.add(require);
	try {
		return install(require, jsx);
	} finally {
		installing.delete(require);
	}
}

function install(require: RuntimeRequire, jsx: Callable): boolean {
	let state = states.get(require);
	if (!state) {
		state = { ids: new Set(), installed: false };
		states.set(require, state);
	}
	if (state.installed) return true;
	const landings: any[] = [];
	for (const [id, factory] of Object.entries(require.m ?? {})) {
		const source = Function.prototype.toString.call(factory);
		if (/\.MAIN_NOLOGIN\s*=/.test(source) && /\.MAIN\s*=/.test(source)) {
			const exports = require(id);
			for (const value of Object.values(exports)) {
				const ids = value as Record<string, unknown> | null;
				if (
					typeof ids?.MAIN === "string" &&
					typeof ids.MAIN_NOLOGIN === "string"
				) {
					state.ids.add(ids.MAIN);
					state.ids.add(ids.MAIN_NOLOGIN);
				}
			}
		}
		if (/MainPage\s*:\s*\(\s*\)\s*=>/.test(source)) {
			let exports = require(id);
			if (!exports.__VibeBlock && source.includes("__VibeBlock")) {
				const module = { exports: {} };
				Reflect.apply(factory, undefined, [
					module,
					module.exports,
					require,
				]);
				exports = module.exports;
			}
			if (exports.__VibeBlock) {
				state.vibe = exports.__VibeBlock;
				state.className = exports.__css?.().vibe;
			}
		}
		if (
			/landing\s*:\s*[\w$]+\s*,\s*headerConcealerComponent\s*:/.test(
				source,
			)
		) {
			landings.push(...Object.values(require(id)));
		}
	}
	if (!state.vibe || !state.ids.size) return false;
	const current = state;
	for (const component of landings) {
		if (
			component?.$$typeof !== Symbol.for("react.memo") ||
			typeof component.type !== "function"
		)
			continue;
		if (patched.has(component) || component.__vibePatched) {
			current.installed = true;
			continue;
		}
		if (!Object.getOwnPropertyDescriptor(component, "type")?.writable)
			continue;
		const original = component.type;
		component.type = function (this: unknown, props: any, ...rest: any[]) {
			const isMain = current.ids.has(props?.landing?.id);
			const element = Reflect.apply(original, this, [
				isMain
					? {
							...props,
							tabWithHeadingTitle: true,
							tabWithCovers: true,
							tabWithSubtitle: true,
						}
					: props,
				...rest,
			]);
			if (!isMain) return element;
			return jsx(Symbol.for("react.fragment"), {
				children: [
					jsx(
						current.vibe,
						{ className: current.className },
						"miku:main-vibe",
					),
					element,
				],
			});
		};
		component.__vibePatched = true;
		patched.add(component);
		current.installed = true;
	}
	if (current.installed && !current.refreshScheduled) {
		current.refreshScheduled = true;
		queueMicrotask(() => {
			if (
				typeof window === "undefined" ||
				location.pathname !== "/landing/main"
			)
				return;
			if (document.querySelector('[class*="VibeBlock_root"]')) return;
			const router = (
				window as unknown as {
					next?: { router?: { refresh?: () => void } };
				}
			).next?.router;
			router?.refresh?.();
		});
	}
	return current.installed;
}
