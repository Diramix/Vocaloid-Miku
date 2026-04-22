import { getSettings } from "../settings";
import { getPlayerBarCoverUrl } from "../utils";

const BASE_URL =
	"http://127.0.0.1:2007/assets/fullscreen-lyrics.png?name=Vocaloid Miku!";

let baseBlur = 0;
let lastCoverUrl: string | null = null;
let lastKey: string | null = null;

function getOrCreateStyle(id: string): HTMLStyleElement {
	let el = document.getElementById(id) as HTMLStyleElement | null;
	if (!el) {
		el = document.createElement("style");
		el.id = id;
		document.head.appendChild(el);
	}
	return el;
}

function applyBackground(url: string) {
	const style = getOrCreateStyle("sync-lyrics-style");
	const next = url.startsWith("http://127.0.0.1:2007")
		? `[class*="SyncLyrics_root"] { background-image: url("${url}"); }`
		: `[class*="SyncLyrics_root"] { background-image: url("https://images.weserv.nl/?url=${url}"); }`;
	if (style.textContent !== next) style.textContent = next;
}

async function update() {
	const s = await getSettings();
	const section = s["SyncLyrics"];
	if (!section) return;

	const newUrl = section.backgroundUrl?.text || BASE_URL;
	const useCover = !!section.coverImage;
	const newBlur = parseInt(section.blurFilter?.text, 10) || 0;
	const normalFont = !!section.normalFont;
	const key = JSON.stringify({ newUrl, useCover, newBlur, normalFont });

	// Background
	if (useCover) {
		const coverUrl = getPlayerBarCoverUrl();
		if (coverUrl && coverUrl !== lastCoverUrl) {
			lastCoverUrl = coverUrl;
			applyBackground(coverUrl);
		}
	} else if (key !== lastKey) {
		applyBackground(newUrl);
	}

	// Blur
	if (baseBlur !== newBlur) {
		baseBlur = newBlur;
		const blurStyle = getOrCreateStyle("blur-style");
		blurStyle.textContent = `[class*="SyncLyrics_root"]::after { backdrop-filter: blur(${newBlur}px); content: ''; position: absolute; inset: 0; }`;
	}

	// Font
	if (key !== lastKey) {
		const fontStyle = getOrCreateStyle("sync-lyrics-font-style");
		fontStyle.textContent = `
			@font-face {
				font-family: "Montserrat";
				src: url("http://127.0.0.1:2007/assets/Montserrat.ttf?name=Vocaloid Miku!") format("truetype");
			}
			[class*="SyncLyricsLine_root"] {
				font-family: ${normalFont ? '"Montserrat", sans-serif' : ""};
				font-weight: ${normalFont ? "700" : ""};
				font-size: ${normalFont ? "35px" : ""};
			}
		`;
	}

	lastKey = key;
}

export { update };
