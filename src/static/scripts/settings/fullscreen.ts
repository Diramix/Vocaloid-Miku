import { getSettings } from "../settings";

let last: boolean | null = null;

function update() {
	const on = !!getSettings().toggleFullscreenMikuXD?.value;
	if (on === last) return;
	last = on;
	document.body.classList.toggle("vm-fullscreen-miku", on);
}

export { update };
