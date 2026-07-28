import { onDomChange } from "./domObserver";

const MOD_SETTINGS_CLASS = "modSettings_alwaysWideBar";

function stripWideBarClass(): void {
	const root = document.body ?? document.documentElement;
	if (!root) return;

	if (root.classList.contains(MOD_SETTINGS_CLASS)) {
		root.classList.remove(MOD_SETTINGS_CLASS);
	}
	for (const el of root.querySelectorAll(`.${MOD_SETTINGS_CLASS}`)) {
		el.classList.remove(MOD_SETTINGS_CLASS);
	}
}

stripWideBarClass();
onDomChange(stripWideBarClass);
