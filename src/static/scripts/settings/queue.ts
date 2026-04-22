import { getSettings } from "../settings";

let lastKey: string | null = null;

function getOrCreateStyle(id: string): HTMLStyleElement {
	let el = document.getElementById(id) as HTMLStyleElement | null;
	if (!el) {
		el = document.createElement("style");
		el.id = id;
		document.head.appendChild(el);
	}
	return el;
}

async function update() {
	const s = await getSettings();
	const section = s["Queue"];
	if (!section) return;

	const key = JSON.stringify(section);
	if (key === lastKey) return;
	lastKey = key;

	const style = getOrCreateStyle("queue-style");
	style.textContent = `
		.Diva-Perfect-Mark {
			display: ${section.togglePerfectMark ? "block" : "none"} !important;
		}
		[class*="PlayQueue_content"] * [aria-label="Трек скачан"],
		[class*="PlayQueue_content"] * [aria-label="Этот трек можете слушать только вы"] {
			display: ${section.toggleDownloadAndVisibleIcon ? "block" : "none"} !important;
		}
	`;
}

export { update };
