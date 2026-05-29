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

function update() {
	const s = getSettings();
	const key = JSON.stringify(s);
	if (key === lastKey) return;
	lastKey = key;

	const style = getOrCreateStyle("fullscreen-style");
	style.textContent = `
		.AssetsImages:after {
			display: ${s.toggleFullscreenMikuXD?.value ? "block" : "none"} !important;
		}
	`;
}

export { update };
