type Callable = (...args: any[]) => any;
type RuntimeRequire = {
	(id: string): any;
	m?: Record<string, Callable>;
	l?: (
		url: string,
		onLoad: (event: { type: string }) => void,
		key?: string,
	) => void;
};
type PageState = {
	ids: Set<unknown>;
	vibe?: any;
	className?: string;
	installed: boolean;
	refreshScheduled?: boolean;
	loading?: boolean;
	loadAttempts?: number;
};

const CACHE_KEY = "vocaloid-miku.vibe-chunk.v1";
const factoryUrls = new WeakMap<Callable, string>();

function mark(stage: string): void {
	performance.mark(`vocaloid-miku:vibe:${stage}`);
}

function buildBase(): string | null {
	for (const script of document.scripts) {
		if (!script.src) continue;
		const url = new URL(script.src);
		const index = url.pathname.indexOf("/_next/static/chunks/");
		if (index >= 0 && /^https?:$/.test(url.protocol))
			return url.origin + url.pathname.slice(0, index);
	}
	return null;
}

function validChunk(url: string, base: string): boolean {
	try {
		const parsed = new URL(url);
		return (
			parsed.href.startsWith(`${base}/_next/static/chunks/`) &&
			!parsed.username &&
			!parsed.password &&
			!parsed.hash
		);
	} catch {
		return false;
	}
}

function cachedChunk(base: string): string | null {
	try {
		const entry = JSON.parse(localStorage.getItem(CACHE_KEY) ?? "null");
		return entry?.base === base &&
			typeof entry.url === "string" &&
			validChunk(entry.url, base)
			? entry.url
			: null;
	} catch {
		return null;
	}
}

function saveChunk(factory: Callable): void {
	const url = factoryUrls.get(factory);
	const base = buildBase();
	if (!url || !base || !validChunk(url, base)) return;
	try {
		localStorage.setItem(CACHE_KEY, JSON.stringify({ base, url }));
	} catch {}
}

export function recordChunkFactories(
	factories: Record<string, Callable>,
	url: string,
): void {
	for (const factory of Object.values(factories)) {
		if (typeof factory === "function") factoryUrls.set(factory, url);
	}
}

const states = new WeakMap<RuntimeRequire, PageState>();
const patched = new WeakSet<object>();
const installing = new WeakSet<RuntimeRequire>();
const factoryKinds = new WeakMap<
	Callable,
	{ ids: boolean; vibe: boolean; landing: boolean; patchedVibe: boolean }
>();

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
		let kinds = factoryKinds.get(factory);
		if (!kinds) {
			const source = Function.prototype.toString.call(factory);
			kinds = {
				ids:
					/\.MAIN_NOLOGIN\s*=/.test(source) &&
					/\.MAIN\s*=/.test(source),
				vibe: /MainPage\s*:\s*\(\s*\)\s*=>/.test(source),
				landing:
					/landing\s*:\s*[\w$]+\s*,\s*headerConcealerComponent\s*:/.test(
						source,
					),
				patchedVibe: source.includes("__VibeBlock"),
			};
			factoryKinds.set(factory, kinds);
		}
		if (kinds.ids) {
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
		if (kinds.vibe) {
			if (state.vibe) continue;
			let exports = require(id);
			if (!exports.__VibeBlock && kinds.patchedVibe) {
				const module = { exports: {} };
				Reflect.apply(factory, undefined, [
					module,
					module.exports,
					require,
				]);
				exports = module.exports;
			}
			if (exports.__VibeBlock) {
				mark("component-found");
				saveChunk(factory);
				state.vibe = exports.__VibeBlock;
				state.className = exports.__css?.().vibe;
			}
		}
		if (kinds.landing) {
			landings.push(...Object.values(require(id)));
		}
	}
	if (!state.vibe || !state.ids.size) {
		if (
			!state.vibe &&
			!state.loading &&
			(state.loadAttempts ?? 0) < 3 &&
			require.l &&
			typeof window !== "undefined"
		) {
			state.loading = true;
			state.loadAttempts = (state.loadAttempts ?? 0) + 1;
			void loadVibeChunks(require, jsx, state);
		}
		return false;
	}
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
		mark("patch-installed");
		const deadline = performance.now() + 15000;
		const checkRendered = () => {
			if (document.querySelector('[class*="VibeBlock_root"]'))
				mark("dom-ready");
			else if (performance.now() < deadline)
				requestAnimationFrame(checkRendered);
		};
		requestAnimationFrame(checkRendered);
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

async function loadVibeChunks(
	require: RuntimeRequire,
	jsx: Callable,
	state: PageState,
): Promise<void> {
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), 10_000);
	mark("preload-start");
	try {
		const base = buildBase();
		const cached = base && cachedChunk(base);
		if (cached) {
			mark("cache-attempt");
			await new Promise<void>((resolve) => {
				const timer = setTimeout(resolve, 1500);
				try {
					require.l!(
						cached,
						() => {
							clearTimeout(timer);
							resolve();
						},
						`vocaloid-miku-vibe:${cached}`,
					);
				} catch {
					clearTimeout(timer);
					resolve();
				}
			});
			installMainPagePatch(require, jsx);
			if (state.vibe) {
				mark("cache-hit");
				if (state.installed) return;
			} else {
				try {
					localStorage.removeItem(CACHE_KEY);
				} catch {}
				mark("cache-miss");
			}
		}
		const response = await fetch(new URL("/", location.href), {
			signal: controller.signal,
		});
		mark("html-response");
		if (!response.ok) throw new Error(`HTTP ${response.status}`);
		let html = "";
		if (response.body) {
			const reader = response.body.getReader();
			const decoder = new TextDecoder();
			try {
				while (!html.includes("</head>")) {
					const { done, value } = await reader.read();
					if (done) break;
					html += decoder.decode(value, { stream: true });
				}
			} finally {
				await reader.cancel();
			}
		} else {
			html = await response.text();
		}
		const present = new Set(
			[...document.scripts]
				.filter((script) => script.src)
				.map((script) => new URL(script.src, location.href).href),
		);
		const urls = new Set<string>();
		for (const match of html.matchAll(
			/<script\b[^>]*\bsrc=["']([^"']+)["']/g,
		)) {
			const url = new URL(match[1], response.url || location.href);
			if (
				!/^https?:$/.test(url.protocol) ||
				!url.pathname.includes("/_next/static/chunks/")
			)
				continue;
			if (!present.has(url.href)) urls.add(url.href);
		}
		const pending = [...urls].sort(
			(left, right) =>
				Number(right.includes("/page-")) -
				Number(left.includes("/page-")),
		);
		let index = 0;
		async function worker(): Promise<void> {
			while (
				index < pending.length &&
				!state.installed &&
				!controller.signal.aborted
			) {
				const url = pending[index++];
				await new Promise<void>((resolve) => {
					const finish = () => {
						controller.signal.removeEventListener("abort", finish);
						resolve();
					};
					controller.signal.addEventListener("abort", finish, {
						once: true,
					});
					try {
						require.l!(url, finish, `vocaloid-miku-vibe:${url}`);
					} catch {
						finish();
					}
				});
				if (!controller.signal.aborted)
					installMainPagePatch(require, jsx);
			}
		}
		await Promise.all(
			Array.from({ length: Math.min(4, pending.length) }, worker),
		);
	} catch (error) {
		console.warn("[Vocaloid Miku] Could not preload Vibe chunks", error);
	} finally {
		clearTimeout(timeout);
		if (!state.installed && !state.vibe && (state.loadAttempts ?? 0) < 3) {
			setTimeout(() => {
				state.loading = false;
				installMainPagePatch(require, jsx);
			}, 2000);
		} else {
			state.loading = false;
		}
	}
}
