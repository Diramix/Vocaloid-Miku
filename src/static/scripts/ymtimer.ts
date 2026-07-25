import { onDomChange } from "./domObserver";

let started = false;

function ymTimerInteger() {
	if (started) return;
	started = true;

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

	let textObserver: MutationObserver | null = null;
	let trackedTimer: HTMLDivElement | null = null;

	function syncText(timerEl: HTMLDivElement) {
		const targetEl = document.querySelector(TARGET_SELECTOR);
		if (!targetEl) return;

		const text = translateTimerText(timerEl.textContent ?? "");
		if (targetEl.textContent !== text) targetEl.textContent = text;
	}

	function handleTimerElement(timerEl: HTMLDivElement) {
		if (trackedTimer === timerEl) {
			syncText(timerEl);
			return;
		}

		textObserver?.disconnect();
		trackedTimer = timerEl;
		timerEl.style.display = "none";
		syncText(timerEl);

		textObserver = new MutationObserver(() => syncText(timerEl));
		textObserver.observe(timerEl, {
			characterData: true,
			childList: true,
			subtree: true,
		});
	}

	function findTimer() {
		const timerEl = document.getElementById(TIMER_ID);
		if (timerEl instanceof HTMLDivElement) {
			handleTimerElement(timerEl);
		} else if (trackedTimer && !trackedTimer.isConnected) {
			textObserver?.disconnect();
			textObserver = null;
			trackedTimer = null;
		}
	}

	findTimer();
	return onDomChange(findTimer);
}

export { ymTimerInteger };
