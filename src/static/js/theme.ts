import { ymTimerInteger } from "./ymtimer";

// Feature Flags Loader
let mikuRun: string,
	kagamineRinStyle: string,
	fullscreenMikuXDStyle: string,
	myVibeMiku: string,
	applyStlTheme: string;

// --- DEFAULT THEME ---
function applyDefaultTheme() {
	const root = document.documentElement;

	root.style.setProperty("--main-color", "#86cecb");
	root.style.setProperty("--light-main-color", "#AEFFFF");
	root.style.setProperty("--buttons-color", "#93e2df");
	root.style.setProperty("--basic-color", "#137a7f");
	root.style.setProperty("--hatsune-light", "#bec8d1");
	root.style.setProperty("--font-color", "#373b3e");
	root.style.setProperty("--miku-color", "#e12885");

	mikuRun = "http://127.0.0.1:2007/assets/miku-run.png?name=Vocaloid Miku!";
	kagamineRinStyle =
		"http://127.0.0.1:2007/assets/Kagamine-Rin.webp?name=Vocaloid Miku!";
	fullscreenMikuXDStyle =
		"http://127.0.0.1:2007/assets/fullscreen-miku-XD.png?name=Vocaloid Miku!";
	myVibeMiku = "http://127.0.0.1:2007/assets/My-vibe.png?name=Vocaloid Miku!";

	let oldStyle = document.getElementById("dynamic-style");
	if (oldStyle) oldStyle.remove();

	const styleTag = document.createElement("style");
	styleTag.id = "dynamic-style";
	styleTag.textContent = `
        :root {
            --main-color: ${getComputedStyle(root).getPropertyValue("--main-color")};
            --light-main-color: ${getComputedStyle(root).getPropertyValue("--light-main-color")};
            --basic-color: ${getComputedStyle(root).getPropertyValue("--basic-color")};
            --hatsune-light: ${getComputedStyle(root).getPropertyValue("--hatsune-light")};
            --font-color: ${getComputedStyle(root).getPropertyValue("--font-color")};
            --miku-color: ${getComputedStyle(root).getPropertyValue("--miku-color")};
        }

        /*.mikuRun {
            background-image: url("${mikuRun}");
        }*/

        .AssetsImages:before {
            content: url("${kagamineRinStyle}");
        }

        .AssetsImages:after {
            background-image: url("${fullscreenMikuXDStyle}");
        }
    `;
	document.head.appendChild(styleTag);
}

// --- APPLY THEME FROM JSON ---
async function applyTheme() {
	const themeTitleText = document.querySelector(".ThemeTitleText");
	if (!themeTitleText) return;

	try {
		const response = await fetch(
			"https://github.com/Diramix/Vocaloid-Miku/releases/download/feature-flags/flags.json",
		);
		if (!response.ok) throw new Error("HTTP " + response.status);
		const data = await response.json();

		applyStlTheme = data.style?.toLowerCase() ?? "";
		const root = document.documentElement;

		// Apply default theme first
		applyDefaultTheme();

		// Override with seasonal theme if set
		if (applyStlTheme === "halloween") {
			themeTitleText.textContent = "Miku-Miku Boo!";
			myVibeMiku =
				"http://127.0.0.1:2007/assets/My-vibe-halloween.png?name=Vocaloid Miku!";
			kagamineRinStyle =
				"http://127.0.0.1:2007/assets/Kagamine-Rin-Halloween.webp?name=Vocaloid Miku!";
			fullscreenMikuXDStyle =
				"http://127.0.0.1:2007/assets/fullscreen-miku-XD-halloween.png?name=Vocaloid Miku!";

			root.style.setProperty("--main-color", "#E48742");
			root.style.setProperty("--light-main-color", "#FFCB63");
			root.style.setProperty("--buttons-color", "#ff9b4c");
			root.style.setProperty("--basic-color", "#A75245");
			root.style.setProperty("--hatsune-light", "#ffae44");
			root.style.setProperty("--font-color", "#000009");
			root.style.setProperty("--miku-color", "#B556A6");
		} else if (applyStlTheme === "christmas") {
			themeTitleText.textContent = "Happy Miku Year!";
			myVibeMiku =
				"http://127.0.0.1:2007/assets/My-vibe-Christmas.png?name=Vocaloid Miku!";
			kagamineRinStyle =
				"http://127.0.0.1:2007/assets/Kagamine-Rin-Christmas.webp?name=Vocaloid Miku!";
			fullscreenMikuXDStyle =
				"http://127.0.0.1:2007/assets/fullscreen-miku-XD-Christmas.png?name=Vocaloid Miku!";
		} else if (applyStlTheme === "teto") {
			themeTitleText.textContent = "Kasane Teto!";
			mikuRun =
				"https://raw.githubusercontent.com/Diramix/Kasane-Teto/refs/heads/main/Kasane%20Teto!/assets/MainPage/miku-run.png";
			fullscreenMikuXDStyle =
				"https://raw.githubusercontent.com/Diramix/Kasane-Teto/refs/heads/main/Kasane%20Teto!/assets/Fullscreen/fullscreen-miku-XD.png";
			myVibeMiku =
				"https://raw.githubusercontent.com/Diramix/Kasane-Teto/refs/heads/main/Kasane%20Teto!/assets/MainPage/My-vibe.png";

			root.style.setProperty("--main-color", "#D46A83");
			root.style.setProperty("--light-main-color", "#FF9FC4");
			root.style.setProperty("--buttons-color", "#f47a97");
			root.style.setProperty("--basic-color", "#854462");
			root.style.setProperty("--hatsune-light", "#0b0c0c");
			root.style.setProperty("--font-color", "#2A2433");
			root.style.setProperty("--miku-color", "#D46A83");
		}

		// Rewrite dynamic CSS after theme changes
		let oldStyle = document.getElementById("dynamic-style");
		if (oldStyle) oldStyle.remove();

		const styleTag = document.createElement("style");
		styleTag.id = "dynamic-style";
		styleTag.textContent = `
            :root {
                --main-color: ${getComputedStyle(root).getPropertyValue("--main-color")};
                --light-main-color: ${getComputedStyle(root).getPropertyValue("--light-main-color")};
                --basic-color: ${getComputedStyle(root).getPropertyValue("--basic-color")};
                --hatsune-light: ${getComputedStyle(root).getPropertyValue("--hatsune-light")};
                --font-color: ${getComputedStyle(root).getPropertyValue("--font-color")};
                --miku-color: ${getComputedStyle(root).getPropertyValue("--miku-color")};
            }

            .mikuRun {
                background-image: url("${mikuRun}");
            }

            .AssetsImages:before {
                content: url("${kagamineRinStyle}");
            }

            .AssetsImages:after {
                background-image: url("${fullscreenMikuXDStyle}");
            }
        `;
		document.head.appendChild(styleTag);
	} catch (err) {
		console.error("Failed to load theme:", err);
		// Fall back to default theme on error
		applyDefaultTheme();
	}
}

// --- Wait for page and required elements to be ready ---
// Consolidates both waitForThemeReady calls: runs applyTheme + ymTimerInteger
function waitForThemeReady() {
	const run = () => {
		applyTheme().then(() => {
			console.log("🎨 The theme is successfully applied!");
			ymTimerInteger?.();
		});
	};

	if (document.querySelector(".ThemeTitleText") && document.head) {
		run();
		return;
	}

	const observer = new MutationObserver(() => {
		if (document.querySelector(".ThemeTitleText") && document.head) {
			observer.disconnect();
			run();
		}
	});
	observer.observe(document.body ?? document.documentElement, {
		childList: true,
		subtree: true,
	});
}

// Entry point
if (document.readyState === "complete") {
	waitForThemeReady();
} else {
	window.addEventListener("load", waitForThemeReady);
}

export { myVibeMiku, applyStlTheme };
