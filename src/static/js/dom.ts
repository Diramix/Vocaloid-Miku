// Inject Diva Cover and Diva Perfect Mark elements
const observer = new MutationObserver(() => {
	["Diva-Cover", "Diva-Perfect-Mark"].forEach((className) => {
		if (
			document.querySelector(`[class*="PlayButtonWithCover_coverImage"`) &&
			!document.querySelector(`.${className}`)
		) {
			document
				.querySelector('[class*="PlayQueue_root"]')
				?.appendChild(
					Object.assign(document.createElement("div"), { className }),
				);
		}
	});
});

observer.observe(document.body, { childList: true, subtree: true });

// Vocaloid Miku! — theme title element
function addThemeTitle() {
	if (!document.querySelector(".ThemeTitleText")) {
		const themeTitleText = document.createElement("div");
		themeTitleText.className = "ThemeTitleText";
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
		themeTitleText.textContent = "Vocaloid Miku!";
		document.body.appendChild(themeTitleText);
		return true;
	}
}

if (!addThemeTitle()) {
	const titleObserver = new MutationObserver(function (_, obs) {
		if (addThemeTitle()) obs.disconnect();
	});
	titleObserver.observe(document.body, { childList: true, subtree: true });
}

// Inject Miku-Run element
const mikuRunObserver = new MutationObserver(() => {
	const target = document.querySelector(
		'[class*="PlayerBarDesktopWithBackgroundProgressBar_sonata"]',
	);
	const already = document.querySelector(".mikuRun");

	if (target && !already) {
		const newElement = document.createElement("div");
		newElement.className = "mikuRun";
		target.insertAdjacentElement("afterend", newElement);
	}
});

mikuRunObserver.observe(document.body, { childList: true, subtree: true });
