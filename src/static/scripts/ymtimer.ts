import { onDomChange } from "./domObserver";

let started = false;

function ymTimerInteger() {
	if (started) return;
	started = true;

	const TIMER_ID = "yandex-music-timer";
	const TARGET_SELECTOR = ".ThemeTitleText";

	const LABELS = new Map<string, string>([
		["Время", "Time"],
		["Дней подряд", "Streak"],
		["За год", "Year"],
		["За месяц", "Month"],
		["За неделю", "Week"],
		["За день", "Day"],
		["Сессия", "Session"],
	]);

	function translateTimerText(text: string) {
		return text
			.replace(
				/Время|Дней подряд|За год|За месяц|За неделю|За день|Сессия/g,
				(label) => LABELS.get(label) ?? label,
			)
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
	return onDomChange((records) => {
		if (
			!records ||
			(trackedTimer && !trackedTimer.isConnected) ||
			records.some(
				(record) =>
					record.type === "childList" &&
					Array.from(record.addedNodes).some(
						(node) =>
							node instanceof Element &&
							(node.id === TIMER_ID ||
								!!node.querySelector(`#${TIMER_ID}`)),
					),
			)
		)
			findTimer();
	});
}

export { ymTimerInteger };
