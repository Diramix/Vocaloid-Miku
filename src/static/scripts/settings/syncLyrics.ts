import { getSettings } from "../settings";
import { getPlayerBarCoverUrl, getOrCreateStyle } from "../utils";
import { syncLyricsBackgroundDefault } from "../styleManager";

let baseBlur = 0;
let lastCoverUrl: string | null = null;
let lastKey: string | null = null;

function applyBackground(url: string) {
	const style = getOrCreateStyle("sync-lyrics-style");
	const imageUrl = url.startsWith("http://127.0.0.1:2007")
		? url
		: `https://images.weserv.nl/?url=${url}`;
	const next = `[class*="SyncLyrics_root"] { background-image: url("${imageUrl}"); }`;
	if (style.textContent !== next) style.textContent = next;
}

function syncCoverBackground() {
	const coverUrl = getPlayerBarCoverUrl();
	if (coverUrl && coverUrl !== lastCoverUrl) {
		lastCoverUrl = coverUrl;
		applyBackground(coverUrl);
	}
}

function update() {
	const s = getSettings();

	const rawUrl = String(s.backgroundUrl?.value || "default");
	const newUrl = rawUrl === "default" ? syncLyricsBackgroundDefault : rawUrl;
	const useCover = !!s.coverImage?.value;
	const newBlur = parseInt(String(s.blurFilter?.value ?? 0), 10) || 0;
	const normalFont = !!s.normalFont?.value;
	const key = JSON.stringify({ newUrl, useCover, newBlur, normalFont });

	// Background
	if (useCover) {
		syncCoverBackground();
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

setInterval(() => {
	if (!getSettings().coverImage?.value) return;
	syncCoverBackground();
}, 1000);

export { update };
