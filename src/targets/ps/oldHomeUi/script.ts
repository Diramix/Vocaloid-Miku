type ModuleFactory = (
	module: { exports: Record<string, unknown> },
	exports: Record<string, unknown>,
	require: WebpackRequire,
) => void;

interface WebpackRequire {
	(id: string): unknown;
	m: Record<string, ModuleFactory>;
	c: Record<string, unknown>;
}

type ChunkPush = [
	ids: unknown[],
	modules: Record<string, ModuleFactory>,
	runtime: (r: WebpackRequire) => void,
];

interface JsxRuntime {
	Fragment?: unknown;
	jsx(type: unknown, props: Record<string, unknown>, key?: string): unknown;
	jsxs(type: unknown, props: Record<string, unknown>, key?: string): unknown;
}

interface LandingProps {
	landing?: { id?: string };
	[key: string]: unknown;
}

interface MemoComponent {
	$$typeof: symbol;
	type: (props: LandingProps) => unknown;
	__vibePatched?: boolean;
}

interface LandingBlocks {
	id: string;
	key: string;
	component: MemoComponent;
}

interface SkeletonIds {
	MAIN: string;
	MAIN_NOLOGIN: string;
}

type CssAccessor = () => Record<string, string>;

interface Lifted {
	VibeBlock: unknown;
	css: CssAccessor;
}

interface Window {
	__vibeBlockApplied?: boolean;
	next?: { router?: { push?: (url: string) => void } };
	[key: string]: unknown;
}

(() => {
	if (window.__vibeBlockApplied) return;
	window.__vibeBlockApplied = true;

	const TARGET = "/landing?skeleton=main";
	const STYLE_ID = "__vibe-block-style";
	const MEMO = Symbol.for("react.memo");
	const MAIN_RE = /\.d\([\w$]+,\{[^{}]*MainPage:\(\)=>[\w$]+/;
	const LB_RE = /\{landing:[\w$]+,headerConcealerComponent:/;
	const JSX_RE =
		/([\w$]+)\.Fragment=Symbol\.for\("react\.fragment"\),\1\.jsx=([\w$]+),\1\.jsxs=\2/;
	const LAZY_RE =
		/([\w$]+)=\(0,[\w$]+\.lazy\)\(async\(\)=>Promise\.all\(\[[\s\S]*?\]\)\.then\([\s\S]*?Vibe\w*Animation\}\)\)\)/g;
	const DYN_RE =
		/([\w$]+)=[\w$]+\.default\.default\(\(\)=>Promise\.all\(\[[\s\S]*?\]\)\.then\([\s\S]*?Vibe\w*Animation\}\)\),\{ssr:!1\}\)/g;

	function injectStyle(): void {
		if (document.getElementById(STYLE_ID)) return;
		const style = document.createElement("style");
		style.id = STYLE_ID;
		style.textContent = '[class*="LandingPage_header"]{display:none}';
		(document.head ?? document.documentElement).appendChild(style);
	}

	function getRequire(): WebpackRequire | null {
		const key = Object.keys(window).find((k) =>
			k.startsWith("webpackChunk"),
		);
		if (!key) return null;
		const chunks = window[key] as
			| { push(entry: ChunkPush): unknown }
			| undefined;
		if (!chunks) return null;
		let wr: WebpackRequire | undefined;
		try {
			chunks.push([
				[Math.random()],
				{},
				(r) => {
					wr = r;
				},
			]);
		} catch {
			return null;
		}
		return wr ?? null;
	}

	function findModule(
		wr: WebpackRequire,
		pred: (src: string) => boolean,
	): string | null {
		return (
			Object.keys(wr.m).find((id) => {
				try {
					return pred(String(wr.m[id]));
				} catch {
					return false;
				}
			}) ?? null
		);
	}

	const findMain = (wr: WebpackRequire): string | null =>
		findModule(wr, (s) => MAIN_RE.test(s));

	function findLandingBlocks(wr: WebpackRequire): LandingBlocks | null {
		const ids = Object.keys(wr.m).filter((id) => {
			try {
				return LB_RE.test(String(wr.m[id]));
			} catch {
				return false;
			}
		});
		for (const id of ids) {
			let mod: unknown;
			try {
				mod = wr(id);
			} catch {
				continue;
			}
			for (const [key, value] of Object.entries(
				(mod ?? {}) as Record<string, unknown>,
			)) {
				if (key === "default") continue;
				const candidate = value as MemoComponent | null;
				if (
					candidate?.$$typeof === MEMO &&
					typeof candidate.type === "function"
				)
					return { id, key, component: candidate };
			}
		}
		return null;
	}

	function findSkeletonIds(wr: WebpackRequire): SkeletonIds | null {
		const id = findModule(
			wr,
			(s) => s.includes('.MAIN_NOLOGIN="') && s.includes('.MAIN="'),
		);
		if (!id) return null;
		let mod: unknown;
		try {
			mod = wr(id);
		} catch {
			return null;
		}
		for (const value of Object.values(
			(mod ?? {}) as Record<string, unknown>,
		))
			if (
				value &&
				typeof value === "object" &&
				"MAIN" in value &&
				"MAIN_NOLOGIN" in value
			)
				return value as SkeletonIds;
		return null;
	}

	const injectScript = (src: string): Promise<void> =>
		new Promise((resolve, reject) => {
			const el = document.createElement("script");
			el.src = src;
			el.onload = () => resolve();
			el.onerror = () => reject(new Error(src));
			document.head.appendChild(el);
		});

	async function loadChunksFrom(
		page: string,
		done: () => boolean,
	): Promise<void> {
		let html: string;
		try {
			html = await fetch(new URL(page, location.origin).href).then((r) =>
				r.text(),
			);
		} catch {
			return;
		}
		const loaded = new Set(
			[...document.scripts].map((s) => s.src.split("/").pop()),
		);
		const files = [
			...new Set(html.match(/static\/chunks\/[\w./()-]+?\.js/g) ?? []),
		].filter((f) => !loaded.has(f.split("/").pop()));
		for (const file of files) {
			try {
				await injectScript(`/_next/${file.replace(/^_next\//, "")}`);
			} catch {
				continue;
			}
			if (done()) return;
		}
	}

	function patchSource(src: string): string | null {
		const vibe = /([\w$]+)\.displayName="VibeBlock"/.exec(src);
		const cssAcc = /([\w$]+)\(\)\.vibeWidgetContainer/.exec(src);
		if (!vibe || !cssAcc) return null;
		return src
			.replace(LAZY_RE, "$1=()=>null")
			.replace(DYN_RE, "$1=()=>null")
			.replace(
				/(\.d\([\w$]+,\{[^{}]*MainPage:\(\)=>[\w$]+)/,
				`$1,__VibeBlock:()=>${vibe[1]},__css:()=>${cssAcc[1]}`,
			);
	}

	function patchFactory(
		modules: Record<string, ModuleFactory>,
		id: string,
	): boolean {
		let src: string;
		try {
			src = String(modules[id]);
		} catch {
			return false;
		}
		if (src.includes("__VibeBlock")) return true;
		const patched = patchSource(src);
		if (!patched) return false;
		try {
			modules[id] = new Function(
				`return (${patched})`,
			)() as ModuleFactory;
		} catch {
			return false;
		}
		return true;
	}

	function patchPending(modules: Record<string, ModuleFactory>): void {
		for (const id of Object.keys(modules)) {
			let src: string;
			try {
				src = String(modules[id]);
			} catch {
				continue;
			}
			if (MAIN_RE.test(src)) patchFactory(modules, id);
		}
	}

	function hookChunks(): void {
		const install = (): boolean => {
			const key = Object.keys(window).find((k) =>
				k.startsWith("webpackChunk"),
			);
			if (!key) return false;
			const chunks = (window as unknown as Record<string, unknown>)[
				key
			] as
				| ({ push(entry: ChunkPush): unknown } & {
						__vibeHooked?: boolean;
				  })
				| undefined;
			if (!chunks || typeof chunks.push !== "function") return false;
			if (chunks.__vibeHooked) return true;
			const origPush = chunks.push.bind(chunks);
			chunks.push = (entry: ChunkPush) => {
				if (entry?.[1]) patchPending(entry[1]);
				return origPush(entry);
			};
			chunks.__vibeHooked = true;
			return true;
		};

		if (install()) return;
		const timer = setInterval(() => {
			if (install()) clearInterval(timer);
		}, 0);
		setTimeout(() => clearInterval(timer), 30000);
	}

	function liftVibeBlock(wr: WebpackRequire, mainId: string): Lifted | null {
		if (!patchFactory(wr.m, mainId)) return null;

		let mod: Record<string, unknown> | null;
		try {
			mod = wr(mainId) as Record<string, unknown> | null;
		} catch {
			return null;
		}
		const VibeBlock = mod?.__VibeBlock;
		const css = mod?.__css as CssAccessor | undefined;
		if (!VibeBlock || typeof css !== "function") return null;
		return { VibeBlock, css };
	}

	function resolveJsx(wr: WebpackRequire): JsxRuntime | null {
		const ids = Object.keys(wr.m).filter((id) => {
			try {
				return JSX_RE.test(String(wr.m[id]));
			} catch {
				return false;
			}
		});
		for (const id of ids) {
			try {
				const mod = wr(id) as JsxRuntime | null;
				if (
					typeof mod?.jsx === "function" &&
					typeof mod.jsxs === "function"
				)
					return mod;
			} catch {}
		}
		return null;
	}

	async function applyPatch(): Promise<boolean> {
		const wr = getRequire();
		if (!wr) return false;

		const ready = () => Boolean(findMain(wr) && findLandingBlocks(wr));
		if (!ready()) {
			for (const page of ["/", "/landing"]) {
				if (ready()) break;
				await loadChunksFrom(page, ready);
			}
		}

		const mainId = findMain(wr);
		const lb = findLandingBlocks(wr);
		if (!mainId || !lb) return false;
		if (lb.component.__vibePatched) return true;

		const runtime = resolveJsx(wr);
		const lifted = liftVibeBlock(wr, mainId);
		if (!runtime || !lifted) return false;

		const Fragment = runtime.Fragment ?? Symbol.for("react.fragment");
		const skeletons = findSkeletonIds(wr);
		const wanted = skeletons
			? [skeletons.MAIN, skeletons.MAIN_NOLOGIN]
			: [];
		const { VibeBlock, css } = lifted;
		const origType = lb.component.type;

		lb.component.type = (props: LandingProps) => {
			const id = props?.landing?.id;
			if (wanted.length && (id === undefined || !wanted.includes(id)))
				return origType(props);
			const tree = origType({
				...props,
				tabWithHeadingTitle: true,
				tabWithCovers: true,
				tabWithSubtitle: true,
			});
			return runtime.jsxs(Fragment, {
				children: [
					runtime.jsx(VibeBlock, { className: css().vibe }, "vibe"),
					tree,
				],
			});
		};
		lb.component.__vibePatched = true;
		return true;
	}

	const atHome = (): boolean =>
		location.pathname === "/" || location.pathname === "/index.html";

	let lastPush = 0;
	function goToLanding(): void {
		if (Date.now() - lastPush < 1500) return;
		lastPush = Date.now();

		const router = window.next?.router;
		if (typeof router?.push === "function") {
			router.push(TARGET);
			return;
		}
		const link = [...document.querySelectorAll("a[href]")].find((a) => {
			const href = a.getAttribute("href") ?? "";
			return (
				href.includes("skeleton=main") || href.includes("/landing/main")
			);
		});
		if (link instanceof HTMLElement) {
			link.click();
			return;
		}
		history.pushState(null, "", TARGET);
		window.dispatchEvent(new PopStateEvent("popstate"));
	}

	function watch(): void {
		const check = () => {
			if (atHome()) goToLanding();
		};
		check();
		setInterval(check, 400);
		window.addEventListener("popstate", check);
	}

	async function boot(): Promise<void> {
		hookChunks();
		injectStyle();
		for (let attempt = 0; attempt < 20; attempt++) {
			if (await applyPatch()) break;
			await new Promise((r) => setTimeout(r, 500));
		}
		watch();
	}

	void boot();
})();
