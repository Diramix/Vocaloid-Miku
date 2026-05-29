(() => {
	const modSettingsClass = "modSettings_alwaysWideBar";

	function removeFrom(el: Element): void {
		if (!el || el.nodeType !== 1) return;
		if (el.classList && el.classList.contains(modSettingsClass)) {
			el.classList.remove(modSettingsClass);
			console.log("Class removed from:", el);
		}
	}

	function removeFromTree(root: Node): void {
		if (!root) return;
		if (root.nodeType === 1) removeFrom(root as Element);
		const asEl = root as Element;
		asEl.querySelectorAll &&
			asEl.querySelectorAll("." + modSettingsClass).forEach(removeFrom);
	}

	document.addEventListener("DOMContentLoaded", () => {
		removeFromTree(document);
	});

	removeFromTree(document);

	let debounceTimer: NodeJS.Timeout;
	const observer = new MutationObserver((mutations: MutationRecord[]) => {
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => {
			for (const m of mutations) {
				if (m.type === "childList") {
					m.addedNodes.forEach((node: Node) => {
						if (node.nodeType === 1) removeFromTree(node);
					});
				} else if (
					m.type === "attributes" &&
					m.attributeName === "class" &&
					m.target instanceof Element
				) {
					removeFrom(m.target);
				}
			}
		}, 50);
	});

	observer.observe(document.documentElement || document.body, {
		childList: true,
		subtree: true,
		attributes: true,
		attributeFilter: ["class"],
	});
})();
