import { getSettings } from "../settings";

let lastPerfectMark: boolean | null = null;
let lastDownloadIcon: boolean | null = null;

function update() {
	const s = getSettings();

	const perfectMark = !!s.togglePerfectMark?.value;
	if (perfectMark !== lastPerfectMark) {
		lastPerfectMark = perfectMark;
		document.body.classList.toggle("vm-perfect-mark", perfectMark);
	}

	const downloadIcon = !!s.toggleDownloadAndVisibleIcon?.value;
	if (downloadIcon !== lastDownloadIcon) {
		lastDownloadIcon = downloadIcon;
		document.body.classList.toggle("vm-queue-download-icon", downloadIcon);
	}
}

export { update };
