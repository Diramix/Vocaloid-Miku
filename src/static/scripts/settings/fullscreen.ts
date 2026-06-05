import { getSettings } from "../settings";
import { getOrCreateStyle } from "../utils";

let lastKey: string | null = null;

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
