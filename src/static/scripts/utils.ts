export function getPlayerBarCoverUrl(): string | null {
	const currentModClient = window.getCurrentModClient?.();
	if (!currentModClient) return null;

	if (currentModClient === "nm") {
		const track = window.nextmusicApi?.getCurrentTrack();
		const img = track?.coverUrl;
		return img ? img.replace("/400x400", "/1000x1000") : null;
	}

	if (currentModClient === "ps") {
		const track = window.pulsesyncApi?.getCurrentTrack();
		const coverUri = track?.coverUri?.slice(0, -3);
		return coverUri ? `https://${coverUri}/1000x1000` : null;
	}

	return null;
}

export function getCurrentTrackArtistIds(): string[] {
	const currentModClient = window.getCurrentModClient?.();
	if (!currentModClient) return [];

	const track =
		currentModClient === "nm"
			? window.nextmusicApi?.getCurrentTrack()
			: currentModClient === "ps"
				? window.pulsesyncApi?.getCurrentTrack()
				: null;
	if (!track) return [];

	const ids: unknown[] = Array.isArray(track.artistIds)
		? track.artistIds
		: Array.isArray(track.artists)
			? track.artists.map((artist: any) => artist?.id)
			: [];

	return ids
		.filter((id) => id !== null && id !== undefined && id !== "")
		.map((id) => String(id));
}

const nodeCache = new Map<string, Element>();

export function findCached<T extends Element>(selector: string): T | null {
	const cached = nodeCache.get(selector);
	if (cached?.isConnected) return cached as T;

	const found = document.querySelector<T>(selector);
	if (found) nodeCache.set(selector, found);
	else nodeCache.delete(selector);
	return found;
}

export function getOrCreateStyle(id: string): HTMLStyleElement {
	let el = document.getElementById(id) as HTMLStyleElement | null;
	if (!el) {
		el = document.createElement("style");
		el.id = id;
		document.head.appendChild(el);
	}
	return el;
}
