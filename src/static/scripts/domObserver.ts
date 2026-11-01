type Subscriber = (records: readonly MutationRecord[] | null) => void;
type Subscription = {
	subscriber: Subscriber;
	records: MutationRecord[];
	initial: boolean;
};

const OPTIONS: MutationObserverInit = {
	childList: true,
	subtree: true,
	attributes: true,
	attributeFilter: ["class", "src"],
};

const subscribers = new Set<Subscription>();

let observer: MutationObserver | null = null;
let scheduled = false;

function flush(): void {
	scheduled = false;
	for (const subscription of subscribers) {
		const records = subscription.initial ? null : subscription.records;
		subscription.initial = false;
		subscription.records = [];
		try {
			subscription.subscriber(records);
		} catch (err) {
			console.error("[Vocaloid Miku] dom subscriber failed:", err);
		}
	}
}

function schedule(records: MutationRecord[] = []): void {
	for (const subscription of subscribers) {
		if (!subscription.initial) subscription.records.push(...records);
	}
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
	const subscription: Subscription = {
		subscriber,
		records: [],
		initial: true,
	};
	subscribers.add(subscription);
	start();
	schedule();

	return () => {
		subscribers.delete(subscription);
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

	let timeoutId: ReturnType<typeof setTimeout>;
	const unsubscribe = onDomChange(() => {
		if (!predicate()) return;
		clearTimeout(timeoutId);
		unsubscribe();
		callback();
	});
	timeoutId = setTimeout(unsubscribe, timeoutMs);
}
