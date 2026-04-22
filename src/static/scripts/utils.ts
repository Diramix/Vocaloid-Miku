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

export function isElementInViewport(el: Element): boolean {
	const rect = el.getBoundingClientRect();
	return (
		rect.top >= 0 &&
		rect.left >= 0 &&
		rect.bottom <=
			(window.innerHeight || document.documentElement.clientHeight) &&
		rect.right <= (window.innerWidth || document.documentElement.clientWidth)
	);
}
