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

declare global {
	interface Window {
		__vibeBlockApplied?: boolean;
		next?: { router?: { push?: (url: string) => void } };
	}
}

(() => {
	if (window.__vibeBlockApplied) return;
	window.__vibeBlockApplied = true;

	const isWeb =
		location.protocol === "http:" || location.protocol === "https:";
	const TARGET = isWeb ? "/landing/main" : "/landing?skeleton=main";
	const STYLE_ID = "__vibe-block-style";
	const SLOT = "__vibeFactory";
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

	function getChunks():
		| ({ push(entry: ChunkPush): unknown } & { __vibeHooked?: boolean })
		| null {
		const key = Object.keys(window).find((k) =>
			k.startsWith("webpackChunk"),
		);
		if (!key) return null;
		const value = (window as unknown as Record<string, unknown>)[key];
		if (!value || typeof (value as { push?: unknown }).push !== "function")
			return null;
		return value as { push(entry: ChunkPush): unknown };
	}

	function getRequire(): WebpackRequire | null {
		const chunks = getChunks();
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
		const pageUrl = new URL(page, location.href).href;
		let html: string;
		try {
			html = await fetch(pageUrl).then((r) => r.text());
		} catch {
			return;
		}
		const loaded = new Set(
			[...document.scripts].map((s) => s.src.split("/").pop()),
		);
		const urls = new Set<string>();
		for (const [, raw] of html.matchAll(
			/<script[^>]+src=["']([^"']+)["']/g,
		)) {
			if (!raw.includes("_next/static/chunks/")) continue;
			if (loaded.has(raw.split("?")[0].split("/").pop())) continue;
			try {
				urls.add(new URL(raw, pageUrl).href);
			} catch {}
		}
		for (const url of urls) {
			try {
				await injectScript(url);
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

	function findNonce(): string {
		for (const script of document.scripts) {
			const nonce = script.nonce || script.getAttribute("nonce");
			if (nonce) return nonce;
		}
		return "";
	}

	function compile(source: string): ModuleFactory | null {
		const slot = window as unknown as Record<string, unknown>;
		delete slot[SLOT];
		const el = document.createElement("script");
		const nonce = findNonce();
		if (nonce) {
			el.setAttribute("nonce", nonce);
			el.nonce = nonce;
		}
		el.textContent = `window.${SLOT}=(${source});`;
		try {
			(document.head ?? document.documentElement).appendChild(el);
		} catch {
			return null;
		}
		el.remove();
		const compiled = slot[SLOT];
		delete slot[SLOT];
		return typeof compiled === "function"
			? (compiled as ModuleFactory)
			: null;
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
		const compiled = compile(patched);
		if (!compiled) return false;
		modules[id] = compiled;
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
			const chunks = getChunks();
			if (!chunks) return false;
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

	function readLifted(exports: unknown): Lifted | null {
		const mod = exports as Record<string, unknown> | null | undefined;
		const VibeBlock = mod?.__VibeBlock;
		const css = mod?.__css as CssAccessor | undefined;
		if (!VibeBlock || typeof css !== "function") return null;
		return { VibeBlock, css };
	}

	function liftVibeBlock(wr: WebpackRequire, mainId: string): Lifted | null {
		if (!patchFactory(wr.m, mainId)) return null;

		const cached = wr.c?.[mainId] as
			| { exports?: Record<string, unknown> }
			| undefined;

		if (cached) {
			const fromCache = readLifted(cached.exports);
			if (fromCache) return fromCache;
		} else {
			try {
				const required = readLifted(wr(mainId));
				if (required) return required;
			} catch {}
		}

		const mod = { exports: {} as Record<string, unknown> };
		try {
			wr.m[mainId](mod, mod.exports, wr);
		} catch {
			return null;
		}
		return readLifted(mod.exports);
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
			for (const page of ["/", TARGET.split("?")[0]]) {
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

	function isRootUrl(href: string | null): boolean {
		if (!href) return false;
		let url: URL;
		try {
			url = new URL(href, location.href);
		} catch {
			return false;
		}
		return (
			url.origin === location.origin &&
			(url.pathname === "/" || url.pathname === "/index.html") &&
			!url.search
		);
	}

	function findLandingLink(): HTMLElement | null {
		for (const a of document.querySelectorAll("a[href]")) {
			const href = a.getAttribute("href") ?? "";
			if (
				(href.includes("skeleton=main") ||
					href.includes("/landing/main")) &&
				a instanceof HTMLElement
			)
				return a;
		}
		return null;
	}

	let lastPush = 0;
	function goToLanding(): void {
		if (Date.now() - lastPush < 1500) return;
		lastPush = Date.now();

		const link = findLandingLink();
		const href = link?.getAttribute("href");
		const target = href && !isRootUrl(href) ? href : TARGET;

		const router = window.next?.router;
		if (typeof router?.push === "function") {
			router.push(target);
			return;
		}
		if (link) {
			link.click();
			return;
		}
		history.pushState(null, "", target);
		window.dispatchEvent(new PopStateEvent("popstate"));
	}

	function interceptRootLinks(): void {
		document.addEventListener(
			"click",
			(event) => {
				if (event.defaultPrevented || event.button !== 0) return;
				if (
					event.ctrlKey ||
					event.metaKey ||
					event.shiftKey ||
					event.altKey
				)
					return;
				if (!(event.target instanceof Element)) return;
				const anchor = event.target.closest("a[href]");
				if (!anchor || !isRootUrl(anchor.getAttribute("href"))) return;
				event.preventDefault();
				event.stopPropagation();
				lastPush = 0;
				goToLanding();
			},
			true,
		);
	}

	function watch(): void {
		const check = () => {
			if (atHome()) goToLanding();
		};
		check();
		setInterval(check, 400);
		window.addEventListener("popstate", check);
		interceptRootLinks();
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
