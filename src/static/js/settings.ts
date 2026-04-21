import { Button, Item } from "./types/settings";

let settings = {};
let coverArtObserver: MutationObserver | null = null;

function log(text: any) {
	console.log("[Customizable LOG]: ", text);
}

async function getSettings() {
	try {
		const response = await fetch(
			"http://127.0.0.1:2007/get_handle?name=Vocaloid Miku!",
		);
		if (!response.ok) throw new Error(`Network error: ${response.status}`);

		const data = await response.json();
		if (!data?.data?.sections) {
			console.warn("Unexpected data structure.");
			return {};
		}

		return Object.fromEntries(
			data.data.sections.map(
				({ title, items }: { title: string; items: Item[] }) => [
					title,
					Object.fromEntries(
						items.map(
							(item: {
								id: string;
								bool: boolean;
								input: string;
								buttons: { name: string; text: string }[];
							}) => [
								item.id,
								item.bool ??
									item.input ??
									Object.fromEntries(
										item.buttons?.map((b) => [b.name, b.text]) || [],
									),
							],
						),
					),
				],
			),
		);
	} catch (error) {
		console.error("Failed to fetch settings:", error);
		return {};
	}
}

let baseUrl =
	"http://127.0.0.1:2007/assets/fullscreen-lyrics.png?name=Vocaloid Miku!";
let baseBlur = 0;

function applyBackgroundUrl(url: string) {
	const style = document.getElementById(
		"sync-lyrics-style",
	) as HTMLStyleElement;
	if (!style) return;
	const next = url.startsWith("http://127.0.0.1:2007")
		? `[class*="SyncLyrics_root"] { background-image: url("${url}"); }`
		: `[class*="SyncLyrics_root"] { background-image: url("https://images.weserv.nl/?url=${url}"); }`;
	if (style.textContent !== next) style.textContent = next;
}

async function setSettings(newSettings: { [x: string]: any }) {
	// Custom background image for SyncLyrics
	let style = document.getElementById("sync-lyrics-style") as HTMLStyleElement;
	if (!style) {
		style = document.createElement("style");
		style.id = "sync-lyrics-style";
		document.head.appendChild(style);
	}

	function updateBackground(url: string) {
		if (url.startsWith("http://127.0.0.1:2007")) {
			if (
				style.textContent !==
				`[class*="SyncLyrics_root"] { background-image: url("${url}"); }`
			) {
				style.textContent = `[class*="SyncLyrics_root"] { background-image: url("${url}"); }`;
			}
		} else {
			if (
				style.textContent !==
				`[class*="SyncLyrics_root"] { background-image: url("https://images.weserv.nl/?url=${url}"); }`
			) {
				style.textContent = `[class*="SyncLyrics_root"] { background-image: url("https://images.weserv.nl/?url=${url}"); }`;
			}
		}
	}

	const newUrl = newSettings?.["SyncLyrics"]?.backgroundUrl?.text || baseUrl;
	const applyBackground = !!newSettings["SyncLyrics"].coverImage;

	if (applyBackground) {
		// Persistent observer that updates SyncLyrics background on cover art changes
		if (!coverArtObserver) {
			coverArtObserver = new MutationObserver(() => {
				const img = [
					...document.querySelectorAll<HTMLImageElement>(
						'[class*="FullscreenPlayerDesktopPoster_cover"]',
					),
				].find((img) => img.src?.includes("/400x400"));
				if (img) {
					applyBackgroundUrl(img.src.replace("/400x400", "/1000x1000"));
				}
			});
			coverArtObserver.observe(document.body, {
				subtree: true,
				attributes: true,
				attributeFilter: ["src"],
			});
		}
		// Immediate check
		const img = [
			...document.querySelectorAll<HTMLImageElement>(
				'[class*="FullscreenPlayerDesktopPoster_cover"]',
			),
		].find((img) => img.src?.includes("/400x400"));
		updateBackground(
			img ? img.src.replace("/400x400", "/1000x1000") : newUrl,
		);
	} else {
		coverArtObserver?.disconnect();
		coverArtObserver = null;
		updateBackground(newUrl);
	}

	// Blur Filter
	let blurStyle = document.getElementById("blur-style");
	if (!blurStyle) {
		blurStyle = document.createElement("style");
		blurStyle.id = "blur-style";
		document.head.appendChild(blurStyle);
	}

	const newBlur = parseInt(newSettings["SyncLyrics"].blurFilter.text, 10) || 0;
	if (baseBlur !== newBlur) {
		baseBlur = newBlur;
		blurStyle.textContent = `[class*="SyncLyrics_root"]::after { backdrop-filter: blur(${baseBlur}px); content: ''; position: absolute; inset: 0; }`;
	}

	let combinedStyle = document.getElementById("combined-style");
	if (!combinedStyle) {
		combinedStyle = document.createElement("style");
		combinedStyle.id = "combined-style";
		document.head.appendChild(combinedStyle);
	}

	combinedStyle.textContent = `
        .Diva-Perfect-Mark {
            display: ${newSettings["Queue"].togglePerfectMark ? "block" : "none"} !important;
        }

        [class*="PlayQueue_content"] * [aria-label="Трек скачан"],
        [class*="PlayQueue_content"] * [aria-label="Этот трек можете слушать только вы"] {
            display: ${newSettings["Queue"].toggleDownloadAndVisibleIcon ? "block" : "none"} !important;
        }

        .AssetsImages:after {
            display: ${newSettings["Fullscreen"].toggleFullscreenMikuXD ? "block" : "none"} !important;
        }

        /*Normal Font*/
        @font-face {
            font-family: "Montserrat";
            src: url("http://127.0.0.1:2007/assets/Montserrat.ttf?name=Vocaloid Miku!") format("truetype");
        }
        [class*="SyncLyricsLine_root"] {
            font-family: ${newSettings["SyncLyrics"].normalFont ? '"Montserrat", sans-serif' : ""};
            font-weight: ${newSettings["SyncLyrics"].normalFont ? "700" : ""};
            font-size: ${newSettings["SyncLyrics"].normalFont ? "35px" : ""};
        }
    `;

	// Auto Play
	if (newSettings["Developer"].devAutoPlayOnStart && !window.hasRun) {
		const tryClickPlay = () => {
			const playBtn = document.querySelector<HTMLButtonElement>(
				`section[class*="PlayerBar_root"] * [data-test-id="PLAY_BUTTON"]`,
			);
			const pauseBtn = document.querySelector(
				`section[class*="PlayerBar_root"] * [data-test-id="PAUSE_BUTTON"]`,
			);
			if (pauseBtn) {
				window.hasRun = true;
				return;
			}
			if (playBtn) {
				playBtn.click();
				setTimeout(tryClickPlay, 200);
			}
		};
		tryClickPlay();
	}
}

async function update() {
	const newSettings = await getSettings();
	if (JSON.stringify(newSettings) !== JSON.stringify(settings)) {
		await setSettings(newSettings);
		settings = newSettings;
	}
}

function init() {
	update();
	setInterval(update, 1000);
}

init();
