import { myVibeMiku } from "./styleManager";
import { getPlayerBarCoverUrl, isElementInViewport } from "./utils";

let rafPending = false;

const playerObserver = new MutationObserver(() => {
	if (rafPending) return;
	rafPending = true;
	requestAnimationFrame(() => {
		rafPending = false;
		updateBackgroundImage();
		updateVibeBackgroundImage();
		coverAndAssetsImagesElements();
	});
});

playerObserver.observe(document.body, {
	childList: true,
	subtree: true,
	attributes: true,
	attributeFilter: ["src"],
});

updateBackgroundImage();
updateVibeBackgroundImage();
coverAndAssetsImagesElements();

// Change fullscreen player background image script
function updateBackgroundImage() {
	const imgBackground = getPlayerBarCoverUrl();
	if (!imgBackground) return;

	const newBackgroundWithGradient = `linear-gradient(180deg, rgba(0, 0, 0, 0.30) 0%, rgba(0, 0, 0, 0.75) 100%), url(${imgBackground}) center center / cover no-repeat`;
	const normalNewBackground = `url(${imgBackground}) center center / cover no-repeat`;

	const img = new Image();
	img.src = imgBackground;

	img.onload = () => {
		const elementsWithGradient = [
			`[class*="FullscreenPlayerDesktop_modalContent"]`,
		];

		const elementsWithoutGradient = [".Diva-Cover", ".CoverImage"];

		elementsWithGradient.forEach((selector) => {
			const element = document.querySelector<HTMLDivElement>(selector);
			if (element) element.style.background = newBackgroundWithGradient;
		});

		elementsWithoutGradient.forEach((selector) => {
			const element = document.querySelector<HTMLDivElement>(selector);
			if (element) element.style.background = normalNewBackground;
		});
	};
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

	let dynamicBG_Blur = dynamicBG.querySelector<HTMLDivElement>(".blur-element");
	if (!dynamicBG_Blur) {
		dynamicBG_Blur = document.createElement("div");
		dynamicBG_Blur.classList.add("blur-element");
		dynamicBG_Blur.style.position = "absolute";
		dynamicBG_Blur.style.top = "0";
		dynamicBG_Blur.style.left = "0";
		dynamicBG_Blur.style.width = "100%";
		dynamicBG_Blur.style.height = "100%";
		dynamicBG_Blur.style.backgroundColor = "#26F4FE";
		dynamicBG_Blur.style.filter = "blur(0px) brightness(0.5)";
		dynamicBG_Blur.style.zIndex = "0";
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
		myVibeMikuElement.style.position = "absolute";
		myVibeMikuElement.style.top = "0";
		myVibeMikuElement.style.left = "0";
		myVibeMikuElement.style.width = "100%";
		myVibeMikuElement.style.height = "100%";
		myVibeMikuElement.style.background = `url("${myVibeMiku}") center center / cover no-repeat`;
		myVibeMikuElement.style.borderRadius = "10px";
		myVibeMikuElement.style.pointerEvents = "none";
		myVibeMikuElement.style.zIndex = "2";
		myVibeMikuElement.style.imageRendering = "crisp-edges";
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
