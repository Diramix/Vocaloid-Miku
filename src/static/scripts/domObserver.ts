type Subscriber = () => void;

const OPTIONS: MutationObserverInit = {
	childList: true,
	subtree: true,
	attributes: true,
	attributeFilter: ["class", "src"],
};

const subscribers = new Set<Subscriber>();

let observer: MutationObserver | null = null;
let scheduled = false;

function flush(): void {
	scheduled = false;
	for (const subscriber of subscribers) {
		try {
			subscriber();
		} catch (err) {
			console.error("[Vocaloid Miku] dom subscriber failed:", err);
		}
	}
}

function schedule(): void {
	if (scheduled) return;
	scheduled = true;
	requestAnimationFrame(flush);
}

function start(): void {
	if (observer) return;
	const root = document.body ?? document.documentElement;
	if (!root) return;
	observer = new MutationObserver(schedule);
	observer.observe(root, OPTIONS);
}

function stop(): void {
	observer?.disconnect();
	observer = null;
}

export function onDomChange(subscriber: Subscriber): () => void {
	subscribers.add(subscriber);
	start();
	schedule();

	return () => {
		subscribers.delete(subscriber);
		if (!subscribers.size) stop();
	};
}

export function waitFor(
	predicate: () => boolean,
	callback: () => void,
	timeoutMs = 30000,
): void {
	if (predicate()) {
		callback();
		return;
	}

	const deadline = Date.now() + timeoutMs;
	const unsubscribe = onDomChange(() => {
		if (Date.now() > deadline) {
			unsubscribe();
			return;
		}
		if (!predicate()) return;
		unsubscribe();
		callback();
	});
}
