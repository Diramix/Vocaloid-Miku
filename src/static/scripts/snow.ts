import { onDomChange } from "./domObserver";
import { applyStyleTheme, onThemeChange } from "./styleManager";
import { findCached } from "./utils";
import { Flake } from "./types/snow";

(function () {
	const TARGET_SELECTOR = '[class*="DefaultLayout_root"]';
	const SNOW_ID = "___snow_background___";
	const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
	let parent: HTMLDivElement | null = null;
	let container: HTMLDivElement | null = null;
	let canvas: HTMLCanvasElement | null = null;
	let ctx: CanvasRenderingContext2D | null = null;
	let flakes: Flake[] = [];
	let frame: number | null = null;

	function stopAnimation() {
		if (frame !== null) cancelAnimationFrame(frame);
		frame = null;
	}

	function removeSnow() {
		stopAnimation();
		window.removeEventListener("resize", resizeCanvas);
		container?.remove();
		parent = null;
		container = null;
		canvas = null;
		ctx = null;
		flakes = [];
	}

	function resizeCanvas() {
		if (!canvas || !parent) return;
		canvas.width = parent.clientWidth;
		canvas.height = parent.clientHeight;
	}

	function animate() {
		frame = null;
		if (
			!parent ||
			!container ||
			!canvas ||
			!ctx ||
			!parent.isConnected ||
			!parent.contains(container) ||
			document.hidden ||
			reducedMotion.matches
		)
			return;

		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = "white";
		ctx.beginPath();
		for (const flake of flakes) {
			ctx.moveTo(flake.x, flake.y);
			ctx.arc(flake.x, flake.y, flake.r, 0, Math.PI * 2);
			flake.x += flake.vx;
			flake.y += flake.vy;
			if (flake.y > canvas.height || flake.x > canvas.width) {
				flake.x = Math.random() * canvas.width;
				flake.y = -10;
			}
		}
		ctx.fill();
		frame = requestAnimationFrame(animate);
	}

	function syncSnow(): void {
		const target =
			applyStyleTheme === "christmas" && !reducedMotion.matches
				? findCached<HTMLDivElement>(TARGET_SELECTOR)
				: null;
		if (
			parent &&
			(parent !== target ||
				!parent.isConnected ||
				!container ||
				!parent.contains(container))
		)
			removeSnow();
		if (!target || !target.isConnected) return;

		if (!container) {
			parent = target;
			if (getComputedStyle(parent).position === "static")
				parent.style.position = "relative";
			container = document.createElement("div");
			container.id = SNOW_ID;
			Object.assign(container.style, {
				position: "absolute",
				top: "0",
				left: "0",
				width: "100%",
				height: "100%",
				pointerEvents: "none",
				zIndex: "0",
				overflow: "hidden",
			});
			canvas = document.createElement("canvas");
			ctx = canvas.getContext("2d");
			if (!ctx) {
				removeSnow();
				return;
			}
			container.appendChild(canvas);
			parent.prepend(container);
			resizeCanvas();
			flakes = Array.from({ length: 150 }, () => ({
				x: Math.random() * canvas!.width,
				y: Math.random() * canvas!.height,
				r: Math.random() * 4 + 1,
				vx: Math.random() * 0.7 + 0.3,
				vy: Math.random() * 1.5 + 0.8,
			}));
			window.addEventListener("resize", resizeCanvas);
		}
		if (document.hidden) stopAnimation();
		else if (frame === null) frame = requestAnimationFrame(animate);
	}

	onThemeChange(syncSnow);
	onDomChange(syncSnow);
	document.addEventListener("visibilitychange", syncSnow);
	reducedMotion.addEventListener("change", syncSnow);
	syncSnow();
})();
