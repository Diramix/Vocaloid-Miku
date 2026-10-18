export interface Track {
	coverUrl?: string | null;
	artistIds?: (string | number | null | undefined)[];
	artists?: { id?: string | number | null }[];
}

type Listener = (track: Track | null) => void;

interface TrackApi {
	getCurrentTrack(): Track | null;
	onTrackChange(listener: Listener): () => void;
}

const listeners = new Set<Listener>();
const API_RETRY_MS = 250;
const API_WAIT_MS = 30_000;
let current: Track | null = null;
let started = false;

function emit(track: Track | null): void {
	current = track;
	for (const listener of listeners) listener(track);
}

function start(): void {
	const deadline = Date.now() + API_WAIT_MS;

	function connect(): void {
		const api = window.nextmusicApi as TrackApi | undefined;
		if (
			typeof api?.getCurrentTrack === "function" &&
			typeof api.onTrackChange === "function"
		) {
			let receivedEvent = false;
			api.onTrackChange((track) => {
				receivedEvent = true;
				emit(track);
			});
			const initial = api.getCurrentTrack();
			if (!receivedEvent) emit(initial);
			return;
		}

		if (Date.now() < deadline) {
			setTimeout(connect, API_RETRY_MS);
		} else {
			console.warn(
				"[Vocaloid Miku] Track API was not ready within 30 seconds",
			);
		}
	}

	connect();
}

export function onTrackStateChange(listener: Listener): () => void {
	listeners.add(listener);
	listener(current);
	if (!started) {
		started = true;
		start();
	}
	return () => listeners.delete(listener);
}
