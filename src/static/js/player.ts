import { myVibeMiku } from "./theme";

// Main setInterval
setInterval(() => {
	updateBackgroundImage();
	updateVibeBackgroundImage();
	coverAndAssetsImagesElements();
}, 300);

// Change fullscreen player background image script
function updateBackgroundImage() {
	const imgElements = document.querySelectorAll<HTMLImageElement>(
		'[class*="FullscreenPlayerDesktopPoster_cover"]',
	);
	let imgBackground = "";

	imgElements.forEach((img) => {
		if (img.src && img.src.includes("/400x400")) {
			imgBackground = img.src.replace("/400x400", "/1000x1000");
		}
	});

	if (imgBackground) {
		const newBackgroundWithGradient = `linear-gradient(180deg, rgba(0, 0, 0, 0.30) 0%, rgba(0, 0, 0, 0.75) 100%), url(${imgBackground}) center center / cover no-repeat`;
		const normalNewBackground = `url(${imgBackground}) center center / cover no-repeat`;

		const img = new Image();
		img.src = imgBackground;

		img.onload = () => {
			const elementsWithGradient = [
				".FullscreenPlayerDesktop_modalContent__Zs_LC",
			];

			const elementsWithoutGradient = [".Diva-Cover", ".CoverImage"];

			elementsWithGradient.forEach((selector) => {
				const element = document.querySelector<HTMLDivElement>(selector);
				if (element) {
					element.style.background = newBackgroundWithGradient;
				}
			});

			elementsWithoutGradient.forEach((selector) => {
				const element = document.querySelector<HTMLDivElement>(selector);
				if (element) {
					element.style.background = normalNewBackground;
				}
			});
		};
	}
}

// Change vibe block background image script
function updateVibeBackgroundImage() {
	const imgElements = document.querySelectorAll<HTMLImageElement>(
		'[class*="PlayerBarDesktopWithBackgroundProgressBar_cover"]',
	);
	let imgBackground = "";

	imgElements.forEach((img) => {
		if (img.src && img.src.includes("/100x100")) {
			imgBackground = img.src.replace("/100x100", "/1000x1000");
		}
	});

	const targetElement = document.querySelector<HTMLDivElement>(
		`[class*="MainPage_vibe"]`,
	);
	if (targetElement && isElementInViewport(targetElement)) {
		targetElement.style.position = "relative";
		targetElement.style.overflow = "hidden";

		let blurElement =
			targetElement.querySelector<HTMLDivElement>(".blur-element");
		if (!blurElement) {
			blurElement = document.createElement("div");
			blurElement.classList.add("blur-element");
			blurElement.style.position = "absolute";
			blurElement.style.top = "0";
			blurElement.style.left = "0";
			blurElement.style.width = "100%";
			blurElement.style.height = "100%";
			blurElement.style.backgroundColor = "#26F4FE";
			blurElement.style.filter = "blur(0px) brightness(0.5)";
			blurElement.style.zIndex = "0";
			targetElement.appendChild(blurElement);
		}

		if (
			blurElement.style.background !==
			`url(${imgBackground}) center center / cover no-repeat`
		) {
			blurElement.style.background = `url(${imgBackground}) center center / cover no-repeat`;
		}

		let myVibeMikuElement = targetElement.querySelector<HTMLDivElement>(
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
			targetElement.appendChild(myVibeMikuElement);
		}

		const childElements = targetElement.querySelectorAll<HTMLDivElement>(
			":scope > *:not(.additional-image-element):not(.blur-element)",
		);
		childElements.forEach((child) => {
			if (child.style.zIndex !== "3") {
				child.style.position = "relative";
				child.style.zIndex = "3";
			}
		});
	}
}

function isElementInViewport(el: HTMLDivElement) {
	const rect = el.getBoundingClientRect();
	return (
		rect.top >= 0 &&
		rect.left >= 0 &&
		rect.bottom <=
			(window.innerHeight || document.documentElement.clientHeight) &&
		rect.right <= (window.innerWidth || document.documentElement.clientWidth)
	);
}

// Inject CoverImage and AssetsImages elements for fullscreen
function coverAndAssetsImagesElements() {
	let container = document.querySelector(
		".FullscreenPlayerDesktopContent_root__tKNGK",
	);

	if (container) {
		if (!container.querySelector(".CoverImage")) {
			let newElement = document.createElement("div");
			newElement.classList.add("CoverImage");
			container.appendChild(newElement);
		}

		if (!container.querySelector(".AssetsImages")) {
			let newElement = document.createElement("div");
			newElement.classList.add("AssetsImages");
			container.appendChild(newElement);
		}
	}
}
