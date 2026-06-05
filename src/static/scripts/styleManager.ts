import { ymTimerInteger } from "./ymtimer";

const themeOverride: string = "";

const FLAGS_URL =
	"https://github.com/Diramix/Vocaloid-Miku/releases/download/feature-flags/flags.json";

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
		},
	},
};

let myVibeMiku: string = DEFAULT_ASSETS.myVibe;
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
}

async function applyTheme() {
	const themeTitleText = document.querySelector(".ThemeTitleText");
	if (!themeTitleText) return;

	myVibeMiku = DEFAULT_ASSETS.myVibe;
	applyStyle(DEFAULT_PALETTE, DEFAULT_ASSETS);

	let style = themeOverride.toLowerCase();
	if (!themeOverride) {
		try {
			const response = await fetch(FLAGS_URL);
			if (!response.ok) throw new Error("HTTP " + response.status);
			const data = await response.json();
			style = data.style?.toLowerCase() ?? "";
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

export { myVibeMiku, applyStyleTheme };
