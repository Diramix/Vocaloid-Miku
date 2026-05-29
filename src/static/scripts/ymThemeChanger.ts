const body = document.body;

let debounceTimer: NodeJS.Timeout;
let isApplying = false;

const applyTheme = () => {
	if (isApplying) return;

	isApplying = true;
	try {
		if (
			!body.classList.contains("ym-light-theme") &&
			!body.classList.contains("ym-dark-theme")
		) {
			body.classList.add("ym-light-theme");
		} else if (body.classList.contains("ym-dark-theme")) {
			body.classList.replace("ym-dark-theme", "ym-light-theme");
		}
	} finally {
		isApplying = false;
	}
};
applyTheme();

const observer = new MutationObserver(() => {
	clearTimeout(debounceTimer);
	debounceTimer = setTimeout(applyTheme, 50);
});
observer.observe(body, { attributes: true, attributeFilter: ["class"] });
