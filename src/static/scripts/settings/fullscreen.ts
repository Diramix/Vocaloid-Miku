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
	const section = s["Fullscreen"];
	if (!section) return;

	const key = JSON.stringify(section);
	if (key === lastKey) return;
	lastKey = key;

	const style = getOrCreateStyle("fullscreen-style");
	style.textContent = `
		.AssetsImages:after {
			display: ${section.toggleFullscreenMikuXD ? "block" : "none"} !important;
		}
	`;
}

export { update };
