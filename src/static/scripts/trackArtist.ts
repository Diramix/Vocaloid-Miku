import { onTrackStateChange, type Track } from "./trackState";

type Listener = (url: string | null) => void;

const ARTIST_INFO_URL = "https://api.music.yandex.ru/artists";

const listeners = new Set<Listener>();
const coverCache = new Map<string, string | null>();

let currentKey: string | null = null;
let current: string | null = null;

async function fetchArtistCover(id: string): Promise<string | null> {
	const cached = coverCache.get(id);
	if (cached !== undefined) return cached;

	let url: string | null = null;
	try {
		const response = await fetch(`${ARTIST_INFO_URL}/${id}/info`);
		if (response.ok) {
			const data = await response.json();
			const uri: string | undefined =
				data?.artist?.cover?.uri ?? data?.covers?.[0]?.uri;
			if (uri) url = `https://${uri.replace("%%", "1000x1000")}`;
		}
	} catch (err) {
		console.error("[Vocaloid Miku] artist cover request failed:", err);
	}

	coverCache.set(id, url);
	return url;
}

async function resolveArtistCover(ids: string[]): Promise<string | null> {
	for (const id of ids) {
		const url = await fetchArtistCover(id);
		if (url) return url;
	}
	return null;
}

function emit(url: string | null): void {
	if (url === current) return;
	current = url;
	for (const listener of listeners) listener(url);
}

async function update(track: Track | null): Promise<void> {
	const rawIds =
		track?.artistIds ?? track?.artists?.map((artist) => artist.id) ?? [];
	const ids = rawIds
		.filter((id) => id !== null && id !== undefined && id !== "")
		.map(String);
	const key = ids.join(",");
	if (key === currentKey) return;
	currentKey = key;

	const url = ids.length ? await resolveArtistCover(ids) : null;
	if (currentKey !== key) return;
	emit(url);
}

export function onArtistCoverChange(listener: Listener): () => void {
	listeners.add(listener);
	listener(current);
	return () => listeners.delete(listener);
}

onTrackStateChange((track) => {
	void update(track);
});
