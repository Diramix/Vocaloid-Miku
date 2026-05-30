import { update as updateSyncLyrics } from "./settings/syncLyrics";
import { update as updateQueue } from "./settings/queue";
import { update as updateFullscreen } from "./settings/fullscreen";
import { update as updatePlayer } from "./settings/player";
import metadata from "../../metadata.json";

export type AddonSettings = Record<
	string,
	{ value: unknown; default: unknown }
>;

let _settings: AddonSettings = {};

export function getSettings(): AddonSettings {
	return _settings;
}

function applyAll() {
	updateSyncLyrics();
	updateFullscreen();
	updatePlayer();
	updateQueue();
}

function subscribe(): void {
	const source = (window as any).pulsesyncApi?.getSettings?.(metadata.name);
	if (!source?.onChange) {
		setTimeout(subscribe, 500);
		return;
	}

	// Fires immediately if settings are already cached,
	// then on every ADDON_SETTINGS_UPDATE from PulseSync.
	source.onChange((settings: AddonSettings) => {
		_settings = settings;
		applyAll();
	});
}

subscribe();

// DOM tick: re-applies settings to elements that appear dynamically on the page.
// Settings themselves are kept up-to-date by onChange above.
setInterval(applyAll, 1000);
