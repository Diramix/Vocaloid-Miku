import { myVibeMiku } from "./styleManager";
import {
	getPlayerBarCoverUrl,
	isElementInViewport,
	observeWithRaf,
} from "./utils";

function refreshPlayerVisuals() {
	updateBackgroundImage();
	updateVibeBackgroundImage();
	coverAndAssetsImagesElements();
}

observeWithRaf(document.body, refreshPlayerVisuals, {
	childList: true,
	subtree: true,
	attributes: true,
	attributeFilter: ["src"],
});

refreshPlayerVisuals();

// Change fullscreen player background image script
let lastBgUrl: string | null = null;

function applyBg(imgBackground: string) {
	const withGradient = `linear-gradient(180deg, rgba(0, 0, 0, 0.30) 0%, rgba(0, 0, 0, 0.75) 100%), url(${imgBackground}) center center / cover no-repeat`;
	const plain = `url(${imgBackground}) center center / cover no-repeat`;

	const gradientEl = document.querySelector<HTMLDivElement>(
		`[class*="FullscreenPlayerDesktop_modalContent"]`,
	);
	if (gradientEl && gradientEl.style.background !== withGradient) {
		gradientEl.style.background = withGradient;
	}

	[".Diva-Cover", ".CoverImage"].forEach((selector) => {
		const element = document.querySelector<HTMLDivElement>(selector);
		if (element && element.style.background !== plain) {
			element.style.background = plain;
		}
	});
}

function updateBackgroundImage() {
	const imgBackground = getPlayerBarCoverUrl();
	if (!imgBackground) return;

	if (imgBackground !== lastBgUrl) {
		lastBgUrl = imgBackground;
		const img = new Image();
		img.src = imgBackground;
	}

	applyBg(imgBackground);
}

// Change vibe block background image script
function updateVibeBackgroundImage() {
	const imgBackground = getPlayerBarCoverUrl();

	const dynamicBG = document.querySelector<HTMLDivElement>(
		`[class*="MainPage_vibe"]`,
	);

	if (!dynamicBG || !isElementInViewport(dynamicBG) || !imgBackground) return;

	dynamicBG.style.position = "relative";
	dynamicBG.style.overflow = "hidden";

	let dynamicBG_Blur =
		dynamicBG.querySelector<HTMLDivElement>(".blur-element");
	if (!dynamicBG_Blur) {
		dynamicBG_Blur = document.createElement("div");
		dynamicBG_Blur.classList.add("blur-element");
		Object.assign(dynamicBG_Blur.style, {
			position: "absolute",
			top: "0",
			left: "0",
			width: "100%",
			height: "100%",
			backgroundColor: "#26F4FE",
			filter: "blur(0px) brightness(0.5)",
			zIndex: "0",
		});
		dynamicBG.appendChild(dynamicBG_Blur);
	}

	const nextBackground = `url(${imgBackground}) center center / cover no-repeat`;
	if (dynamicBG_Blur.style.background !== nextBackground) {
		dynamicBG_Blur.style.background = nextBackground;
	}

	let myVibeMikuElement = dynamicBG.querySelector<HTMLDivElement>(
		".additional-image-element",
	);
	if (!myVibeMikuElement) {
		myVibeMikuElement = document.createElement("div");
		myVibeMikuElement.classList.add("additional-image-element");
		Object.assign(myVibeMikuElement.style, {
			position: "absolute",
			top: "0",
			left: "0",
			width: "100%",
			height: "100%",
			background: `url("${myVibeMiku}") center center / cover no-repeat`,
			borderRadius: "10px",
			pointerEvents: "none",
			zIndex: "2",
		});
		dynamicBG.appendChild(myVibeMikuElement);
	}

	dynamicBG
		.querySelectorAll<HTMLDivElement>(
			":scope > *:not(.additional-image-element):not(.blur-element)",
		)
		.forEach((child) => {
			if (child.style.zIndex !== "3") {
				child.style.position = "relative";
				child.style.zIndex = "3";
			}
		});
}

// Inject CoverImage and AssetsImages elements for fullscreen
function coverAndAssetsImagesElements() {
	const container = document.querySelector(
		`[class*="FullscreenPlayerDesktopContent_root"]`,
	);
	if (!container) return;

	if (!container.querySelector(".CoverImage")) {
		const el = document.createElement("div");
		el.classList.add("CoverImage");
		container.appendChild(el);
	}

	if (!container.querySelector(".AssetsImages")) {
		const el = document.createElement("div");
		el.classList.add("AssetsImages");
		container.appendChild(el);
	}
}
