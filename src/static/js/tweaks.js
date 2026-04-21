// Force Yandex Music to use the light theme
function yandexThemeUpdate() {
	const body = document.body;
	if (
		!body.classList.contains("ym-dark-theme") &&
		!body.classList.contains("ym-light-theme")
	) {
		body.classList.add("ym-light-theme");
	} else if (body.classList.contains("ym-dark-theme")) {
		body.classList.replace("ym-dark-theme", "ym-light-theme");
	}
}
yandexThemeUpdate();

// Remove always-expanded player class
(() => {
	const targetClass = "modSettings_alwaysWideBar";

	function removeFrom(el) {
		if (!el || el.nodeType !== 1) return;
		if (el.classList && el.classList.contains(targetClass)) {
			el.classList.remove(targetClass);
			console.log("Class removed from:", el);
		}
	}

	function removeFromTree(root) {
		if (!root) return;
		if (root.nodeType === 1) removeFrom(root);
		root.querySelectorAll &&
			root.querySelectorAll("." + targetClass).forEach(removeFrom);
	}

	document.addEventListener("DOMContentLoaded", () => {
		removeFromTree(document);
	});

	removeFromTree(document);

	const observer = new MutationObserver((mutations) => {
		for (const m of mutations) {
			if (m.type === "childList") {
				m.addedNodes.forEach((node) => {
					if (node.nodeType === 1) removeFromTree(node);
				});
			} else if (m.type === "attributes" && m.attributeName === "class") {
				removeFrom(m.target);
			}
		}
	});

	observer.observe(document.documentElement || document.body, {
		childList: true,
		subtree: true,
		attributes: true,
		attributeFilter: ["class"],
	});

	const interval = setInterval(() => removeFromTree(document), 2000);
})();
