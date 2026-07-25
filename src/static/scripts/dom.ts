import { onDomChange } from "./domObserver";
import { findCached } from "./utils";

const COVER_SELECTOR = '[class*="PlayButtonWithCover_coverImage"]';
const QUEUE_SELECTOR = '[class*="PlayQueue_root"]';
const SONATA_SELECTOR =
	'[class*="PlayerBarDesktopWithBackgroundProgressBar_sonata"]';

function syncInjectedElements(): void {
	// Diva Cover & Diva Perfect Mark
	if (findCached(COVER_SELECTOR)) {
		const queue = findCached(QUEUE_SELECTOR);
		if (queue) {
			for (const className of ["Diva-Cover", "Diva-Perfect-Mark"]) {
				if (queue.querySelector(`:scope > .${className}`)) continue;
				queue.appendChild(
					Object.assign(document.createElement("div"), { className }),
				);
			}
		}
	}

	// Miku Run
	const sonata = findCached(SONATA_SELECTOR);
	if (sonata && !sonata.nextElementSibling?.classList.contains("mikuRun")) {
		const mikuRun = document.createElement("div");
		mikuRun.className = "mikuRun";
		sonata.insertAdjacentElement("afterend", mikuRun);
	}
}

onDomChange(syncInjectedElements);

// Vocaloid Miku! - theme title element
document.body.appendChild(
	Object.assign(document.createElement("div"), {
		className: "ThemeTitleText",
		textContent: "Vocaloid Miku!",
	}),
);
