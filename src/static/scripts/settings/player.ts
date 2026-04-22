import { getSettings } from "../settings";

const SETTINGS_BTN_ID = "vocaloid-settings-btn";

const SETTINGS_ICON_SVG = `<svg width="24" height="24" fill="none" viewBox="0 0 24 24" aria-hidden="true" focusable="false" role="img" class="svg-icon"><path fill="currentColor" fill-rule="evenodd" d="M9.172 9.172a4 4 0 1 1 5.656 5.656 4 4 0 0 1-5.656-5.656m1.414 4.242a2 2 0 1 0 2.828-2.828 2 2 0 0 0-2.828 2.828" clip-rule="evenodd"></path><path fill="currentColor" fill-rule="evenodd" d="m20.788 5.276 1.427 2.483v.001a1.4 1.4 0 0 1-.365 1.81l-1.858 1.412.002 2.038 1.854 1.41a1.4 1.4 0 0 1 .365 1.814l-1.425 2.479a1.4 1.4 0 0 1-1.755.593l-2.192-.92-1.72.982-.304 2.398A1.404 1.404 0 0 1 13.427 23h-2.853a1.404 1.404 0 0 1-1.39-1.224l-.308-2.421-1.69-.97-2.22.93a1.4 1.4 0 0 1-1.754-.592l-1.427-2.482a1.4 1.4 0 0 1 .365-1.81l1.86-1.413-.004-2.038-1.855-1.41a1.4 1.4 0 0 1-.364-1.814l1.426-2.479a1.4 1.4 0 0 1 1.756-.593l2.191.92 1.72-.982.303-2.398A1.4 1.4 0 0 1 10.573 1h2.853a1.4 1.4 0 0 1 1.39 1.223l.307 2.422 1.69.97 2.22-.93a1.4 1.4 0 0 1 1.755.591m-2.792 8.739-.007-4.023 2.23-1.694-.9-1.565-2.642 1.109-3.412-1.956L12.898 3h-1.796l-.364 2.864L7.294 7.83 4.682 6.733l-.9 1.565 2.222 1.69.007 4.02-2.229 1.694.9 1.565 2.641-1.109 3.412 1.956.367 2.886h1.796l.364-2.864 3.443-1.966 2.613 1.097.9-1.565z" clip-rule="evenodd"></path></svg>`;

let enabled = false;

function injectSettingsButton(): void {
	if (!enabled) return;
	const container = document.querySelector(
		'[class*="PlayerBarDesktopWithBackgroundProgressBar_meta"]',
	);
	if (!container || document.getElementById(SETTINGS_BTN_ID)) return;

	const btn = document.createElement("button");
	btn.id = SETTINGS_BTN_ID;
	btn.innerHTML = SETTINGS_ICON_SVG;

	btn.addEventListener("click", () => {
		(window as any).next?.router?.push("/settings");
	});

	container.appendChild(btn);
}

function removeSettingsButton(): void {
	document.getElementById(SETTINGS_BTN_ID)?.remove();
}

const observer = new MutationObserver(() => injectSettingsButton());
observer.observe(document.body, { childList: true, subtree: true });

async function update() {
	const s = await getSettings();
	const section = s["Player"];
	const shouldShow = !!section?.toggleVocaloidSettingsButton;

	if (shouldShow === enabled) return;
	enabled = shouldShow;

	if (enabled) {
		injectSettingsButton();
	} else {
		removeSettingsButton();
	}
}

export { update };
