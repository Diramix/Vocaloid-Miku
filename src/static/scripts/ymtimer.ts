function ymTimerInteger() {
	const TIMER_ID = "yandex-music-timer";
	const TARGET_SELECTOR = ".ThemeTitleText";

	const LABELS = new Map<string, string>([
		["Всего", "Total"],
		["За год", "Year"],
		["За месяц", "Month"],
		["За неделю", "Week"],
		["За день", "Day"],
		["Сессия", "Session"],
	]);

	function translateTimerText(text: string) {
		return text
			.replace(/([^:]+):/, (match, label: string) => {
				const translated = LABELS.get(label.trim());
				return translated
					? `${match.slice(0, match.indexOf(label))}${translated}:`
					: match;
			})
			.replace(/(\d+)\s*ч/g, "$1h")
			.replace(/(\d+)\s*м/g, "$1m")
			.replace(/(\d+)\s*с/g, "$1s");
	}

	function syncText(timerEl: HTMLDivElement) {
		const targetEl = document.querySelector(TARGET_SELECTOR);
		if (targetEl) {
			targetEl.textContent = translateTimerText(
				timerEl.textContent ?? "",
			);
		} else {
			setTimeout(() => syncText(timerEl), 100);
		}
	}

	function handleTimerElement(timerEl: HTMLDivElement) {
		timerEl.style.display = "none";
		syncText(timerEl);

		const textObserver = new MutationObserver(() => syncText(timerEl));
		textObserver.observe(timerEl, {
			characterData: true,
			childList: true,
			subtree: true,
		});
	}

	function checkMutations(mutations: MutationRecord[]) {
		for (const mutation of mutations) {
			for (const node of mutation.addedNodes) {
				if (!(node instanceof HTMLDivElement)) continue;
				if (node.id === TIMER_ID) {
					handleTimerElement(node);
					return;
				}
				const nested = node.querySelector<HTMLDivElement>(
					"#" + TIMER_ID,
				);
				if (nested) {
					handleTimerElement(nested);
					return;
				}
			}
		}
	}

	const existing = document.getElementById(TIMER_ID);
	if (existing instanceof HTMLDivElement) {
		handleTimerElement(existing);
	}

	const ymTimerObserver = new MutationObserver(checkMutations);
	ymTimerObserver.observe(document.body, { childList: true, subtree: true });
	return ymTimerObserver;
}

export { ymTimerInteger };
