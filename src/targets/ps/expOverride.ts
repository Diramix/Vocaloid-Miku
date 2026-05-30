(function () {
	interface WebpackRequire {
		(id: string): unknown;
		m: Record<string, unknown>;
	}
	interface Experiments {
		checkExperiment(name: string, variant: string): unknown;
	}
	interface StoreValue {
		experiments: Experiments;
	}
	interface ReactFiber {
		memoizedProps?: {
			value?: StoreValue & { experiments: Experiments };
		};
		return?: ReactFiber;
	}
	interface MstModule {
		_$(experiments: Experiments): {
			containerStorage: Map<string, Record<string, unknown>>;
		};
		gK: object;
		Zn(): void;
	}
	interface KeysModule {
		c: {
			OverwrittenExperiments: string;
			[key: string]: string;
		};
	}

	function getWr(): WebpackRequire | null {
		const chunkKey = Object.keys(window).find((k) =>
			k.startsWith("webpackChunk"),
		) as keyof Window | undefined;
		if (!chunkKey) return null;
		let wr: WebpackRequire | undefined;
		(window[chunkKey] as unknown[]).push([
			[Math.random()],
			{},
			(r: WebpackRequire) => {
				wr = r;
			},
		]);
		return wr ?? null;
	}

	function findStore(): (StoreValue & { experiments: Experiments }) | null {
		let storeVal: (StoreValue & { experiments: Experiments }) | null = null;
		document.querySelectorAll("*").forEach((el) => {
			if (storeVal) return;
			const fk = Object.keys(el).find((k) => k.startsWith("__reactFiber"));
			if (!fk) return;
			let f: ReactFiber | undefined = (
				el as unknown as Record<string, ReactFiber>
			)[fk];
			for (let i = 0; i < 200 && f; i++) {
				if (f.memoizedProps?.value?.experiments?.checkExperiment) {
					storeVal = f.memoizedProps.value as StoreValue & {
						experiments: Experiments;
					};
					return;
				}
				f = f.return;
			}
		});
		return storeVal;
	}

	function findMst(wr: WebpackRequire): string | undefined {
		return Object.keys(wr.m).find((id) => {
			try {
				const m = wr(id) as Partial<MstModule> | null;
				return (
					typeof m?._$ === "function" &&
					typeof m?.gK === "object" &&
					typeof m?.Zn === "function"
				);
			} catch {
				return false;
			}
		});
	}

	function findKeysModule(wr: WebpackRequire): string | undefined {
		return Object.keys(wr.m).find((id) => {
			try {
				const m = wr(id) as Partial<KeysModule> | null;
				return (
					typeof m?.c === "object" &&
					m.c !== null &&
					"OverwrittenExperiments" in m.c &&
					typeof m.c.OverwrittenExperiments === "string"
				);
			} catch {
				return false;
			}
		});
	}

	function applyPatch(): boolean {
		const wr = getWr();
		if (!wr) return false;

		const storeVal = findStore();
		if (!storeVal) return false;

		const mstId = findMst(wr);
		const keysId = findKeysModule(wr);
		if (!mstId || !keysId) return false;

		const mst = wr(mstId) as MstModule;
		const n = wr(keysId) as KeysModule;
		const { containerStorage } = mst._$(storeVal.experiments);
		const data = containerStorage.get(n.c.OverwrittenExperiments);

		if (!data?.WebNextNewWaveTab) return true;

		const patched = { ...data };
		delete patched.WebNextNewWaveTab;
		containerStorage.set(n.c.OverwrittenExperiments, patched);

		console.log(
			"[patch] WebNextNewWaveTab:",
			storeVal.experiments.checkExperiment("WebNextNewWaveTab", "on"),
		);
		return true;
	}

	if (!applyPatch()) {
		const observer = new MutationObserver((_, obs) => {
			if (applyPatch()) {
				obs.disconnect();
			}
		});
		observer.observe(document.body, {
			childList: true,
			subtree: true,
		});
	}
})();
