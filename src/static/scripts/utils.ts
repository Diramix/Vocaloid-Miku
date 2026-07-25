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
	if (rect.width <= 0 || rect.height <= 0) return false;

	const height = window.innerHeight || document.documentElement.clientHeight;
	const width = window.innerWidth || document.documentElement.clientWidth;

	return (
		rect.top < height &&
		rect.bottom > 0 &&
		rect.left < width &&
		rect.right > 0
	);
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
