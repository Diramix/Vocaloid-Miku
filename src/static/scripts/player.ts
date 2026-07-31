import { onDomChange } from "./domObserver";
import { onArtistCoverChange } from "./trackArtist";
import { onCoverChange } from "./trackCover";
import { findCached } from "./utils";

const VIBE_SELECTOR = '[class*="MainPage_vibe__"], [class*="VibeBlock_root__"]';
const FULLSCREEN_SELECTOR = '[class*="FullscreenPlayerDesktopContent_root"]';

const LOCAL = "http://127.0.0.1:2007/assets/";
const Q = "?name=Vocaloid Miku!";
const FALLBACK_COVER = `${LOCAL}fallback-cover.webp${Q}`;
const FALLBACK_BACKGROUND = `${LOCAL}fallback-bg.webp${Q}`;

let coverUrl: string | null = null;
let artistCoverUrl: string | null = null;

function preload(url: string): void {
	const img = new Image();
	img.src = url;
}

function setImage(name: string, url: string): void {
	document.documentElement.style.setProperty(name, `url("${url}")`);
	preload(url);
}

function applyImages(): void {
	if (coverUrl) {
		setImage("--vm-cover-raw", coverUrl);
	} else {
		document.documentElement.style.setProperty("--vm-cover-raw", "none");
	}

	setImage("--vm-cover", coverUrl ?? FALLBACK_COVER);
	setImage(
		"--vm-background",
		artistCoverUrl ?? coverUrl ?? FALLBACK_BACKGROUND,
	);
}

function applyCover(url: string | null): void {
	coverUrl = url;
	applyImages();
}

function applyArtistCover(url: string | null): void {
	artistCoverUrl = url;
	applyImages();
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
onArtistCoverChange(applyArtistCover);
onDomChange(syncPlayerElements);
