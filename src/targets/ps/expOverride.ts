"use strict";

(function () {
	const EXPERIMENT_NAME = "WebNextNewWaveTab";
	const LS_KEY = "overwrittenExperiments";

	// Types
	interface ExperimentStore {
		checkExperiment(name: string, value: string): boolean;
	}

	interface RootStore {
		experiments: ExperimentStore;
	}

	interface CheckExperimentArgs {
		name: string;
		containerStorage: unknown;
		experimentDetail: unknown;
	}

	interface WebpackRequire {
		(id: string): any;
		m: Record<string, unknown>;
	}

	// localStorage
	function persistDefaultToLocalStorage(): void {
		try {
			const raw = localStorage.getItem(LS_KEY);
			const parsed = raw ? JSON.parse(raw) : { value: {} };
			parsed.value ??= {};
			parsed.value[EXPERIMENT_NAME] = { group: "default" };
			localStorage.setItem(LS_KEY, JSON.stringify(parsed));
		} catch {
			console.warn("[patch] Failed to write to localStorage");
		}
	}

	// Webpack
	function getWebpackRequire(): WebpackRequire | null {
		const chunkKey = Object.keys(window).find((k) =>
			k.startsWith("webpackChunk"),
		);
		if (!chunkKey) return null;

		let wr: WebpackRequire | undefined;
		(window as any)[chunkKey].push([
			[Math.random()],
			{},
			(r: WebpackRequire) => {
				wr = r;
			},
		]);

		return wr ?? null;
	}

	// React store
	function findReactStore(): RootStore | null {
		let result: RootStore | null = null;

		document.querySelectorAll("*").forEach((el) => {
			if (result) return;

			const fiberKey = Object.keys(el).find((k) =>
				k.startsWith("__reactFiber"),
			);
			if (!fiberKey) return;

			let fiber = (el as any)[fiberKey];

			for (let i = 0; i < 200 && fiber; i++) {
				if (fiber.memoizedProps?.value?.experiments?.checkExperiment) {
					result = fiber.memoizedProps.value as RootStore;
					return;
				}
				fiber = fiber.return;
			}
		});

		return result;
	}

	// Patch R.i
	function patchCheckExperimentFunction(wr: WebpackRequire): boolean {
		for (const id of Object.keys(wr.m)) {
			try {
				const mod = wr(id);
				if (typeof mod?.i !== "function") continue;

				const source = mod.i.toString();
				const isCheckExperimentFn =
					source.includes("experimentDetail") &&
					source.includes("containerStorage");

				if (!isCheckExperimentFn) continue;
				if (mod.i.__patched) return true;

				const original = mod.i;
				mod.i = function (args: CheckExperimentArgs, config: unknown): boolean {
					if (args?.name === EXPERIMENT_NAME) return false;
					return original.call(this, args, config);
				};
				mod.i.__patched = true;

				return true;
			} catch {}
		}

		return false;
	}

	// Entry point
	function applyPatch(): boolean {
		const wr = getWebpackRequire();
		if (!wr) return false;

		const store = findReactStore();
		if (!store) return false;

		if (!patchCheckExperimentFunction(wr)) return false;

		const result = store.experiments.checkExperiment(EXPERIMENT_NAME, "on");
		console.log(`[patch] ${EXPERIMENT_NAME}:`, result);

		return true;
	}

	persistDefaultToLocalStorage();

	if (!applyPatch()) {
		const observer = new MutationObserver((_, obs) => {
			if (applyPatch()) obs.disconnect();
		});
		observer.observe(document.body, { childList: true, subtree: true });
	}
})();
