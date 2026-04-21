// Yandex Music Time integration
function ymTimerInteger() {
	const TIMER_ID = "yandex-music-timer";
	const TARGET_SELECTOR = ".ThemeTitleText";

	function syncText(timerEl) {
		const targetEl = document.querySelector(TARGET_SELECTOR);
		if (targetEl) {
			targetEl.textContent = timerEl.textContent;
		} else {
			setTimeout(() => syncText(timerEl), 100);
		}
	}

	function handleTimerElement(timerEl) {
		timerEl.style.display = "none";
		syncText(timerEl);

		const textObserver = new MutationObserver(() => syncText(timerEl));
		textObserver.observe(timerEl, {
			characterData: true,
			childList: true,
			subtree: true,
		});
	}

	function checkMutations(mutations) {
		for (const mutation of mutations) {
			for (const node of mutation.addedNodes) {
				if (!(node instanceof HTMLElement)) continue;
				if (node.id === TIMER_ID) {
					handleTimerElement(node);
					return;
				}
				const nested = node.querySelector("#" + TIMER_ID);
				if (nested) {
					handleTimerElement(nested);
					return;
				}
			}
		}
	}

	const existing = document.getElementById(TIMER_ID);
	if (existing) {
		handleTimerElement(existing);
	}

	const ymTimerObserver = new MutationObserver(checkMutations);
	ymTimerObserver.observe(document.body, { childList: true, subtree: true });
	return ymTimerObserver;
}

// Expose on window so 01-theme.js can call it after applyTheme
window.ymTimerInteger = ymTimerInteger;
