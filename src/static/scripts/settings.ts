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
	const w = window as any;
	const source =
		w.pulsesyncApi?.getSettings?.(metadata.name) ??
		w.nextmusicApi?.getSettings?.(metadata.name);
	if (!source?.onChange) {
		setTimeout(subscribe, 500);
		return;
	}

	source.onChange((settings: AddonSettings) => {
		_settings = settings;
		applyAll();
	});
}

subscribe();

setInterval(applyAll, 1000);
