const observer = new MutationObserver(() => {
	// Diva Cover & Diva Perfect Mark
	if (document.querySelector('[class*="PlayButtonWithCover_coverImage"]')) {
		["Diva-Cover", "Diva-Perfect-Mark"].forEach((className) => {
			if (!document.querySelector(`.${className}`)) {
				document
					.querySelector('[class*="PlayQueue_root"]')
					?.appendChild(
						Object.assign(document.createElement("div"), { className }),
					);
			}
		});
	}

	// Miku Run
	const target = document.querySelector(
		'[class*="PlayerBarDesktopWithBackgroundProgressBar_sonata"]',
	);
	if (target && !document.querySelector(".mikuRun")) {
		const newElement = document.createElement("div");
		newElement.className = "mikuRun";
		target.insertAdjacentElement("afterend", newElement);
	}
});

observer.observe(document.body, { childList: true, subtree: true });

// Vocaloid Miku! - theme title element
const themeTitleText = Object.assign(document.createElement("div"), {
	className: "ThemeTitleText",
	textContent: "Vocaloid Miku!",
});

Object.assign(themeTitleText.style, {
	position: "fixed",
	visibility: "visible",
	fontFamily: '"Vocaloid", sans-serif',
	fontSize: "16px",
	fontWeight: "1000",
	left: "50%",
	marginLeft: "-66px",
	top: "10px",
	color: "var(--main-color)",
	zIndex: "1",
});

document.body.appendChild(themeTitleText);
