const body = document.body;

const applyTheme = () => {
	if (
		!body.classList.contains("ym-light-theme") &&
		!body.classList.contains("ym-dark-theme")
	) {
		body.classList.add("ym-light-theme");
	} else if (body.classList.contains("ym-dark-theme")) {
		body.classList.replace("ym-dark-theme", "ym-light-theme");
	}
};
applyTheme();

const observer = new MutationObserver(() => applyTheme());
observer.observe(body, { attributes: true, attributeFilter: ["class"] });
