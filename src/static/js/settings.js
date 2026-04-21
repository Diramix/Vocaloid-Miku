// handleEvents.json settings management
let settings = {};

function log(text) {
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
			data.data.sections.map(({ title, items }) => [
				title,
				Object.fromEntries(
					items.map((item) => [
						item.id,
						item.bool ??
							item.input ??
							Object.fromEntries(
								item.buttons?.map((b) => [b.name, b.text]) || [],
							),
					]),
				),
			]),
		);
	} catch (error) {
		console.error("Failed to fetch settings:", error);
		return {};
	}
}

let baseUrl =
	"http://127.0.0.1:2007/assets/fullscreen-lyrics.png?name=Vocaloid Miku!";
let baseBlur = 0;

async function setSettings(newSettings) {
	// Custom background image for SyncLyrics
	const syncLyricsBackground = document.querySelector(
		'[class*="SyncLyrics_root"]',
	);
	let style = document.getElementById("sync-lyrics-style");
	if (!style) {
		style = document.createElement("style");
		style.id = "sync-lyrics-style";
		document.head.appendChild(style);
	}

	function updateBackground(url) {
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
	applyBackground = !!newSettings["SyncLyrics"].coverImage;

	if (applyBackground) {
		const checkBackground = setInterval(() => {
			const img = [
				...document.querySelectorAll(
					'[class*="FullscreenPlayerDesktopPoster_cover"]',
				),
			].find((img) => img.src && img.src.includes("/400x400"));

			if (img) {
				updateBackground(img.src.replace("/400x400", "/1000x1000"));
				clearInterval(checkBackground);
			}
		}, settingsDelay);
	} else {
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
            display: ${newSettings["Очередь"].togglePerfectMark ? "block" : "none"} !important;
        }

        [class*="PlayQueue_content"] * [aria-label="Трек скачан"],
        [class*="PlayQueue_content"] * [aria-label="Этот трек можете слушать только вы"] {
            display: ${newSettings["Очередь"].toggleDownloadAndVisibleIcon ? "block" : "none"} !important;
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
			const playBtn = document.querySelector(
				`section.PlayerBar_root__cXUnU * [data-test-id="PLAY_BUTTON"]`,
			);
			const pauseBtn = document.querySelector(
				`section.PlayerBar_root__cXUnU * [data-test-id="PAUSE_BUTTON"]`,
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
	await setSettings(newSettings);
	settings = newSettings;
}

function init() {
	setInterval(() => {
		update();
	}, 1000);
}

init();
