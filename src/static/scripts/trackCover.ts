import { onDomChange } from "./domObserver";
import { getPlayerBarCoverUrl } from "./utils";

type Listener = (url: string | null) => void;

const listeners = new Set<Listener>();
let current: string | null = null;

function poll(): void {
	const next = getPlayerBarCoverUrl();
	if (next === current) return;
	current = next;
	for (const listener of listeners) listener(next);
}

export function onCoverChange(listener: Listener): () => void {
	listeners.add(listener);
	listener(current);
	return () => listeners.delete(listener);
}

poll();
onDomChange(poll);
