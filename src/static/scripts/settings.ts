import { Item } from "./types/settings";
import { update as updateSyncLyrics } from "./settings/syncLyrics";
import { update as updateQueue } from "./settings/queue";
import { update as updateFullscreen } from "./settings/fullscreen";

function parseItemValue(item: Item): boolean | string | Record<string, string> {
	if (item.bool !== undefined) return item.bool;
	if (item.input !== undefined) return item.input;
	return Object.fromEntries(item.buttons?.map((b) => [b.name, b.text]) ?? []);
}

function parseSection(
	items: Item[],
): Record<string, ReturnType<typeof parseItemValue>> {
	return Object.fromEntries(
		items.map((item) => [item.id, parseItemValue(item)]),
	);
}

const CACHE_MS = 900;
let _cache: Record<string, any> = {};
let _cacheTime = 0;

export async function getSettings(): Promise<Record<string, any>> {
	if (Date.now() - _cacheTime < CACHE_MS) return _cache;

	try {
		const response = await fetch(
			"http://127.0.0.1:2007/get_handle?name=Vocaloid Miku!",
		);
		if (!response.ok) throw new Error(`Network error: ${response.status}`);

		const data = await response.json();
		if (!data?.data?.sections) {
			console.warn("Unexpected data structure.");
			return {};
		}

		_cache = Object.fromEntries(
			data.data.sections.map(
				({ title, items }: { title: string; items: Item[] }) => [
					title,
					parseSection(items),
				],
			),
		);
		_cacheTime = Date.now();
		return _cache;
	} catch (error) {
		console.error("Failed to fetch settings:", error);
		return {};
	}
}

async function tick() {
	await Promise.all([updateSyncLyrics(), updateQueue(), updateFullscreen()]);
}

tick();
setInterval(tick, 1000);
