import { getSettings } from "../settings";
import { getOrCreateStyle } from "../utils";
import { onCoverChange } from "../trackCover";
import { syncLyricsBackgroundDefault } from "../styleManager";

let baseBlur = 0;
let coverUrl: string | null = null;
let useCover = false;
let lastKey: string | null = null;

function applyBackground(url: string) {
	const style = getOrCreateStyle("sync-lyrics-style");
	const imageUrl = url.startsWith("http://127.0.0.1:2007")
		? url
		: `https://images.weserv.nl/?url=${url}`;
	const next = `[class*="SyncLyrics_root"] { background-image: url("${imageUrl}"); }`;
	if (style.textContent !== next) style.textContent = next;
}

function update() {
	const s = getSettings();

	const rawUrl = String(s.backgroundUrl?.value || "default");
	const newUrl = rawUrl === "default" ? syncLyricsBackgroundDefault : rawUrl;
	useCover = !!s.coverImage?.value;
	const newBlur = parseInt(String(s.blurFilter?.value ?? 0), 10) || 0;
	const normalFont = !!s.normalFont?.value;
	const key = JSON.stringify({ newUrl, useCover, newBlur, normalFont });

	// Background
	if (useCover) {
		if (coverUrl) applyBackground(coverUrl);
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
		document.body.classList.toggle("vm-lyrics-normal-font", normalFont);
	}

	lastKey = key;
}

onCoverChange((url) => {
	coverUrl = url;
	if (useCover && url) applyBackground(url);
});

export { update };
