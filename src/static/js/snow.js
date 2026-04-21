// Snowflakes (active only for the christmas theme)
(function () {
	const TARGET_SELECTOR = '[class*="DefaultLayout_root"]';
	const SNOW_ID = "___snow_background___";

	function ensureSnow(parentEl) {
		if (getComputedStyle(parentEl).position === "static") {
			parentEl.style.position = "relative";
		}

		let snowContainer = parentEl.querySelector("#" + SNOW_ID);

		if (!snowContainer && window.applyStlTheme === "christmas") {
			snowContainer = document.createElement("div");
			snowContainer.id = SNOW_ID;
			snowContainer.style.position = "absolute";
			snowContainer.style.top = "0";
			snowContainer.style.left = "0";
			snowContainer.style.width = "100%";
			snowContainer.style.height = "100%";
			snowContainer.style.pointerEvents = "none";
			snowContainer.style.zIndex = "0";
			snowContainer.style.overflow = "hidden";

			parentEl.prepend(snowContainer);

			const canvas = document.createElement("canvas");
			snowContainer.appendChild(canvas);

			const ctx = canvas.getContext("2d");

			function resizeCanvas() {
				canvas.width = parentEl.clientWidth;
				canvas.height = parentEl.clientHeight;
			}
			resizeCanvas();

			let flakes = [];
			for (let i = 0; i < 150; i++) {
				flakes.push({
					x: Math.random() * canvas.width,
					y: Math.random() * canvas.height,
					r: Math.random() * 4 + 1,
					vx: Math.random() * 0.7 + 0.3,
					vy: Math.random() * 1.5 + 0.8,
				});
			}

			function drawSnow() {
				if (!parentEl.contains(snowContainer)) return;

				ctx.clearRect(0, 0, canvas.width, canvas.height);
				ctx.fillStyle = "white";
				ctx.beginPath();

				for (let f of flakes) {
					ctx.moveTo(f.x, f.y);
					ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
				}

				ctx.fill();
				updateSnow();
			}

			function updateSnow() {
				for (let f of flakes) {
					f.x += f.vx;
					f.y += f.vy;

					if (f.y > canvas.height || f.x > canvas.width) {
						f.x = Math.random() * canvas.width;
						f.y = -10;
					}
				}
			}

			(function animate() {
				drawSnow();
				requestAnimationFrame(animate);
			})();

			window.addEventListener("resize", resizeCanvas);
		}
	}

	const snowObserver = new MutationObserver(() => {
		const parentEl = document.querySelector(TARGET_SELECTOR);
		if (parentEl) {
			ensureSnow(parentEl);
		}
	});

	snowObserver.observe(document.documentElement, {
		childList: true,
		subtree: true,
	});

	const initial = document.querySelector(TARGET_SELECTOR);
	if (initial) ensureSnow(initial);
})();
