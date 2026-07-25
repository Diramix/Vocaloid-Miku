import { onDomChange } from "./domObserver";
import { onCoverChange } from "./trackCover";
import { findCached } from "./utils";

const VIBE_SELECTOR = '[class*="MainPage_vibe__"], [class*="VibeBlock_root__"]';
const FULLSCREEN_SELECTOR = '[class*="FullscreenPlayerDesktopContent_root"]';

function applyCover(url: string | null): void {
	document.documentElement.style.setProperty(
		"--vm-cover",
		url ? `url("${url}")` : "none",
	);

	if (url) {
		const img = new Image();
		img.src = url;
	}
}

function ensureChild(parent: Element, className: string): void {
	if (parent.querySelector(`:scope > .${className}`)) return;
	parent.appendChild(
		Object.assign(document.createElement("div"), { className }),
	);
}

function syncPlayerElements(): void {
	const vibe = findCached(VIBE_SELECTOR);
	if (vibe) {
		ensureChild(vibe, "blur-element");
		ensureChild(vibe, "additional-image-element");
	}

	const fullscreen = findCached(FULLSCREEN_SELECTOR);
	if (fullscreen) {
		ensureChild(fullscreen, "CoverImage");
		ensureChild(fullscreen, "AssetsImages");
	}
}

onCoverChange(applyCover);
onDomChange(syncPlayerElements);
