import { onTrackStateChange, type Track } from "./trackState";

type Listener = (url: string | null) => void;

const listeners = new Set<Listener>();
let current: string | null = null;

function update(track: Track | null): void {
	const next = track?.coverUrl
		? track.coverUrl.replace("/400x400", "/1000x1000")
		: null;
	if (next === current) return;
	current = next;
	for (const listener of listeners) listener(next);
}

export function onCoverChange(listener: Listener): () => void {
	listeners.add(listener);
	listener(current);
	return () => listeners.delete(listener);
}

onTrackStateChange(update);
