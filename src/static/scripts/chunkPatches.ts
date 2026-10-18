import { installMainPagePatch } from "./mainPagePatch";
import { patchPlayerBarProps } from "./playerBarPatch";

type Callable = (...args: any[]) => any;
type Factory = Callable;
type RuntimeRequire = {
	(id: string): any;
	m?: Record<string, Factory>;
	c?: Record<string, { exports: any }>;
};
type Chunk = [unknown, Record<string, Factory>?, Callable?];
type ChunkQueue = Chunk[];

const stateKey = Symbol.for("vocaloid-miku.chunk-patches.v1");
const decorations = [
	["PlayQueue_root__", ["Diva-Cover", "Diva-Perfect-Mark"]],
	["MainPage_vibe__", ["blur-element", "additional-image-element"]],
	["VibeBlock_root__", ["blur-element", "additional-image-element"]],
	["FullscreenPlayerDesktopContent_root__", ["CoverImage", "AssetsImages"]],
] as const;

function matchesRuntime(factory: Factory): boolean {
	const source = Function.prototype.toString.call(factory);
	return (
		source.length < 5000 &&
		source.includes("react.transitional.element") &&
		/\.jsx\s*=/.test(source) &&
		/\.jsxs\s*=/.test(source)
	);
}

export function installChunkPatches(): void {
	if (typeof window === "undefined") return;
	const host = window as unknown as Record<PropertyKey, any>;
	if (host[stateKey]) return;
	host[stateKey] = true;
	const wrappedFunctions = new WeakMap<Callable, Callable>();
	const wrappedFactories = new WeakSet<Factory>();
	const queues = new WeakSet<ChunkQueue>();
	const runtimes = new Set<RuntimeRequire>();
	let runtimeJsx: Callable | undefined;

	function wrap(original: Callable): Callable {
		const existing = wrappedFunctions.get(original);
		if (existing) return existing;
		const replacement = function (this: unknown, ...args: any[]) {
			const [type, props] = args;
			const className = props?.className;
			if (
				typeof type !== "string" ||
				typeof className !== "string" ||
				(!className.includes("PlayQueue_root__") &&
					!className.includes("MainPage_vibe__") &&
					!className.includes("VibeBlock_root__") &&
					!className.includes(
						"FullscreenPlayerDesktopContent_root__",
					) &&
					!className.includes(
						"PlayerBarDesktopWithBackgroundProgressBar_player__",
					))
			) {
				return Reflect.apply(original, this, args);
			}
			if (
				className.includes(
					"PlayerBarDesktopWithBackgroundProgressBar_player__",
				)
			) {
				const nextProps = patchPlayerBarProps(
					type,
					props,
					(...values) => Reflect.apply(original, this, values),
				);
				if (nextProps === props)
					return Reflect.apply(original, this, args);
				const nextArgs = [...args];
				nextArgs[1] = nextProps;
				return Reflect.apply(original, this, nextArgs);
			}
			const classes = className.split(/\s+/);
			const hasPrefix = (prefix: string) =>
				classes.some((name: string) => name.startsWith(prefix));
			const wanted = new Set<string>();
			for (const [prefix, names] of decorations) {
				if (hasPrefix(prefix))
					for (const name of names) wanted.add(name);
			}
			const children = props.children;
			const contains = (value: any, name: string): boolean => {
				if (Array.isArray(value))
					return value.some((child) => contains(child, name));
				return (
					value?.type === "div" &&
					typeof value.props?.className === "string" &&
					value.props.className.split(/\s+/).includes(name)
				);
			};
			const additions = [...wanted]
				.filter((name) => !contains(children, name))
				.map((name) =>
					Reflect.apply(original, this, [
						"div",
						{ className: name, "aria-hidden": true },
						`miku:${name}`,
					]),
				);
			let callArgs = args;
			if (additions.length) {
				const nextChildren =
					children === undefined
						? []
						: Array.isArray(children)
							? [...children]
							: [children];
				callArgs = [...args];
				callArgs[1] = {
					...props,
					children: [...nextChildren, ...additions],
				};
			}
			return Reflect.apply(original, this, callArgs);
		};
		wrappedFunctions.set(original, replacement);
		wrappedFunctions.set(replacement, replacement);
		return replacement;
	}

	function patchExports(exports: any, discover: boolean): void {
		if (
			!exports ||
			(typeof exports !== "object" && typeof exports !== "function")
		)
			return;
		for (const name of ["jsx", "jsxs"]) {
			const value = exports[name];
			if (typeof value !== "function") continue;
			const replacement = discover
				? wrap(value)
				: wrappedFunctions.get(value);
			if (!replacement || replacement === value) continue;
			const descriptor = Object.getOwnPropertyDescriptor(exports, name);
			if (descriptor?.writable) exports[name] = replacement;
		}
		if (discover && typeof exports.jsx === "function")
			runtimeJsx = exports.jsx;
	}

	function patchFactories(
		factories: Record<string, Factory>,
		require?: RuntimeRequire,
	): void {
		for (const [id, factory] of Object.entries(factories)) {
			if (typeof factory !== "function") continue;
			if (wrappedFactories.has(factory)) {
				if (require) patchRuntimeExports(require, id);
				continue;
			}
			if (!matchesRuntime(factory)) continue;
			const replacement = function (this: unknown, ...args: any[]) {
				const result = Reflect.apply(factory, this, args);
				patchExports(args[0]?.exports, true);
				return result;
			};
			wrappedFactories.add(replacement);
			factories[id] = replacement;
			if (require) patchRuntimeExports(require, id);
		}
	}

	function patchRuntimeExports(require: RuntimeRequire, id: string): void {
		const cached = require.c?.[id];
		patchExports(cached ? cached.exports : require(id), true);
	}

	function capture(require: RuntimeRequire): void {
		if (runtimes.has(require)) return;
		runtimes.add(require);
		if (require.m) patchFactories(require.m, require);
		if (require.c)
			for (const module of Object.values(require.c))
				patchExports(module.exports, false);
		if (runtimeJsx) installMainPagePatch(require, runtimeJsx);
	}

	function attach(queue: ChunkQueue): void {
		if (queues.has(queue)) return;
		queues.add(queue);
		for (const chunk of queue) if (chunk?.[1]) patchFactories(chunk[1]);
		const intercept = (delegate: Callable): Callable =>
			function (this: unknown, ...chunks: Chunk[]) {
				for (const chunk of chunks)
					if (chunk?.[1]) patchFactories(chunk[1]);
				const result = Reflect.apply(delegate, this, chunks);
				if (runtimeJsx)
					for (const require of runtimes)
						installMainPagePatch(require, runtimeJsx);
				return result;
			};
		let push = intercept(queue.push);
		Object.defineProperty(queue, "push", {
			configurable: true,
			get: () => push,
			set: (delegate: Callable) => {
				push = intercept(delegate);
			},
		});
		queue.push([[`vocaloid-miku-runtime-${Date.now()}`], {}, capture]);
	}

	let attempts = 0;
	const check = (): boolean => {
		const queue = host.webpackChunk_N_E;
		if (!Array.isArray(queue)) return false;
		attach(queue);
		return true;
	};
	if (!check()) {
		const timer = window.setInterval(() => {
			if (check() || ++attempts >= 120) {
				window.clearInterval(timer);
				if (attempts >= 120) delete host[stateKey];
			}
		}, 250);
	}
}

installChunkPatches();
