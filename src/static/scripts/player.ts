import { onArtistCoverChange } from "./trackArtist";
import { onCoverChange } from "./trackCover";

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

const appliedImages = new Map<string, string>();

function setImage(name: string, url: string | null): void {
	const value = url ? `url("${url}")` : "none";
	if (appliedImages.get(name) === value) return;
	const alreadyLoaded = url && [...appliedImages.values()].includes(value);
	appliedImages.set(name, value);
	document.documentElement.style.setProperty(name, value);
	if (url && !alreadyLoaded) preload(url);
}

function applyImages(): void {
	setImage("--vm-cover-raw", coverUrl);

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

onCoverChange(applyCover);
onArtistCoverChange(applyArtistCover);
