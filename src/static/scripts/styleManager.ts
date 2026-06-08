import { ymTimerInteger } from "./ymtimer";

const themeOverride: string = "";

const FLAGS_URL =
	"https://github.com/Diramix/Vocaloid-Miku/releases/download/feature-flags/flags.json";
const FLAGS_CACHE_KEY = "vocaloid_miku_flags_cache";
const FLAGS_CACHE_TTL = 60 * 60 * 1000; // 1 hour
const FLAGS_FETCH_TIMEOUT = 3000; // 3 seconds

const LOCAL = "http://127.0.0.1:2007/assets/";
const Q = "?name=Vocaloid Miku!";
const TETO_BASE =
	"https://raw.githubusercontent.com/Diramix/Kasane-Teto/refs/heads/main/Kasane%20Teto!/assets";

type Palette = Record<string, string>;
type Assets = {
	mikuRun: string;
	kagamineRin: string;
	fullscreenMikuXD: string;
	myVibe: string;
	syncLyricsBackground: string;
	divaQueueBackground: string;
	perfectMark: string;
};

const DEFAULT_PALETTE: Palette = {
	"--main-color": "#86cecb",
	"--light-main-color": "#AEFFFF",
	"--buttons-color": "#93e2df",
	"--basic-color": "#137a7f",
	"--hatsune-light": "#bec8d1",
	"--font-color": "#373b3e",
	"--miku-color": "#e12885",
};

const DEFAULT_ASSETS: Assets = {
	mikuRun: `${LOCAL}miku-run.png${Q}`,
	kagamineRin: `${LOCAL}Kagamine-Rin.webp${Q}`,
	fullscreenMikuXD: `${LOCAL}fullscreen-miku-XD.png${Q}`,
	myVibe: `${LOCAL}My-vibe.png${Q}`,
	syncLyricsBackground: `${LOCAL}fullscreen-lyrics.jpg${Q}`,
	divaQueueBackground: `${LOCAL}Diva-Queue-Background.jpg${Q}`,
	perfectMark: `${LOCAL}Diva-F-Perfect-Mark.webp${Q}`,
};

type Theme = { title: string; palette: Palette; assets: Assets };

const THEMES: Record<string, Theme> = {
	halloween: {
		title: "Miku-Miku Boo!",
		palette: {
			"--main-color": "#E48742",
			"--light-main-color": "#FFCB63",
			"--buttons-color": "#ff9b4c",
			"--basic-color": "#A75245",
			"--hatsune-light": "#ffae44",
			"--font-color": "#000009",
			"--miku-color": "#B556A6",
		},
		assets: {
			mikuRun: `${LOCAL}miku-run-halloween.png${Q}`,
			kagamineRin: `${LOCAL}Kagamine-Rin-Halloween.webp${Q}`,
			fullscreenMikuXD: `${LOCAL}fullscreen-miku-XD-halloween.png${Q}`,
			myVibe: `${LOCAL}My-vibe-halloween.png${Q}`,
			syncLyricsBackground: DEFAULT_ASSETS.syncLyricsBackground,
			divaQueueBackground: DEFAULT_ASSETS.divaQueueBackground,
			perfectMark: DEFAULT_ASSETS.perfectMark,
		},
	},

	christmas: {
		title: "Happy Miku Year!",
		palette: DEFAULT_PALETTE,
		assets: {
			mikuRun: DEFAULT_ASSETS.mikuRun,
			kagamineRin: `${LOCAL}Kagamine-Rin-Christmas.webp${Q}`,
			fullscreenMikuXD: `${LOCAL}fullscreen-miku-XD-Christmas.png${Q}`,
			myVibe: `${LOCAL}My-vibe-Christmas.png${Q}`,
			syncLyricsBackground: DEFAULT_ASSETS.syncLyricsBackground,
			divaQueueBackground: DEFAULT_ASSETS.divaQueueBackground,
			perfectMark: DEFAULT_ASSETS.perfectMark,
		},
	},

	teto: {
		title: "Kasane Teto!",
		palette: {
			"--main-color": "#D46A83",
			"--light-main-color": "#FF9FC4",
			"--buttons-color": "#f47a97",
			"--basic-color": "#854462",
			"--hatsune-light": "#0b0c0c",
			"--font-color": "#2A2433",
			"--miku-color": "#D46A83",
		},
		assets: {
			mikuRun: `${TETO_BASE}/MainPage/miku-run.png`,
			kagamineRin: DEFAULT_ASSETS.kagamineRin,
			fullscreenMikuXD: `${TETO_BASE}/Fullscreen/fullscreen-miku-XD.png`,
			myVibe: `${TETO_BASE}/MainPage/My-vibe.png`,
			syncLyricsBackground: `${TETO_BASE}/SyncLyrics/fullscreen-lyrics.jpg`,
			divaQueueBackground: `${TETO_BASE}/Queue/Diva-Queue-Background.png`,
			perfectMark: `${TETO_BASE}/Queue/Diva-F-Perfect-Mark.png`,
		},
	},
};

let myVibeMiku: string = DEFAULT_ASSETS.myVibe;
let syncLyricsBackgroundDefault: string = DEFAULT_ASSETS.syncLyricsBackground;
let applyStyleTheme: string;

function applyStyle(palette: Palette, assets: Assets): void {
	const root = document.documentElement;

	for (const [name, value] of Object.entries(palette)) {
		root.style.setProperty(name, value);
	}

	root.style.setProperty("--miku-run-image", `url("${assets.mikuRun}")`);
	root.style.setProperty(
		"--assets-before-image",
		`url("${assets.kagamineRin}")`,
	);
	root.style.setProperty(
		"--assets-after-image",
		`url("${assets.fullscreenMikuXD}")`,
	);
	root.style.setProperty(
		"--queue-background-image",
		`url("${assets.divaQueueBackground}")`,
	);
	root.style.setProperty(
		"--perfect-mark-image",
		`url("${assets.perfectMark}")`,
	);
}

function getCachedFlags(): string | null {
	try {
		const raw = localStorage.getItem(FLAGS_CACHE_KEY);
		if (!raw) return null;
		const { style, ts } = JSON.parse(raw);
		if (Date.now() - ts > FLAGS_CACHE_TTL) return null;
		return typeof style === "string" ? style : null;
	} catch {
		return null;
	}
}

function setCachedFlags(style: string): void {
	try {
		localStorage.setItem(
			FLAGS_CACHE_KEY,
			JSON.stringify({ style, ts: Date.now() }),
		);
	} catch {}
}

async function fetchFlagsStyle(): Promise<string> {
	const cached = getCachedFlags();
	if (cached !== null) return cached;

	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), FLAGS_FETCH_TIMEOUT);
	try {
		const response = await fetch(FLAGS_URL, { signal: controller.signal });
		if (!response.ok) throw new Error("HTTP " + response.status);
		const data = await response.json();
		const style = data.style?.toLowerCase() ?? "";
		setCachedFlags(style);
		return style;
	} finally {
		clearTimeout(timeoutId);
	}
}

async function applyTheme() {
	const themeTitleText = document.querySelector(".ThemeTitleText");
	if (!themeTitleText) return;

	myVibeMiku = DEFAULT_ASSETS.myVibe;
	syncLyricsBackgroundDefault = DEFAULT_ASSETS.syncLyricsBackground;
	applyStyle(DEFAULT_PALETTE, DEFAULT_ASSETS);

	let style = themeOverride.toLowerCase();
	if (!themeOverride) {
		try {
			style = await fetchFlagsStyle();
		} catch (err) {
			console.error("Failed to load theme:", err);
			return;
		}
	}

	applyStyleTheme = style;

	const theme = THEMES[style];
	if (!theme) return;

	themeTitleText.textContent = theme.title;
	myVibeMiku = theme.assets.myVibe;
	syncLyricsBackgroundDefault = theme.assets.syncLyricsBackground;
	applyStyle(theme.palette, theme.assets);
}

function waitForThemeReady() {
	const run = () => {
		applyTheme().then(() => {
			ymTimerInteger?.();
		});
	};

	if (document.querySelector(".ThemeTitleText") && document.head) {
		run();
		return;
	}

	const observer = new MutationObserver(() => {
		if (document.querySelector(".ThemeTitleText") && document.head) {
			observer.disconnect();
			run();
		}
	});
	observer.observe(document.body ?? document.documentElement, {
		childList: true,
		subtree: true,
	});
}

if (document.readyState === "complete") {
	waitForThemeReady();
} else {
	window.addEventListener("load", waitForThemeReady);
}

export { myVibeMiku, syncLyricsBackgroundDefault, applyStyleTheme };
