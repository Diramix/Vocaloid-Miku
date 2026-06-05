import { getSettings } from "../settings";
import { getOrCreateStyle } from "../utils";

let lastKey: string | null = null;

function update() {
	const s = getSettings();
	const key = JSON.stringify(s);
	if (key === lastKey) return;
	lastKey = key;

	const style = getOrCreateStyle("queue-style");
	style.textContent = `
		.Diva-Perfect-Mark {
			display: ${s.togglePerfectMark?.value ? "block" : "none"} !important;
		}
		[class*="PlayQueue_content"] * [aria-label="Трек скачан"],
		[class*="PlayQueue_content"] * [aria-label="Этот трек можете слушать только вы"] {
			display: ${s.toggleDownloadAndVisibleIcon?.value ? "block" : "none"} !important;
		}
	`;
}

export { update };
