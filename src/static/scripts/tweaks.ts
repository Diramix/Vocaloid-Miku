import { onDomChange } from "./domObserver";

const MOD_SETTINGS_CLASS = "modSettings_alwaysWideBar";

function stripFromTree(root: Element): void {
	if (root.classList.contains(MOD_SETTINGS_CLASS)) {
		root.classList.remove(MOD_SETTINGS_CLASS);
	}
	for (const el of root.querySelectorAll(`.${MOD_SETTINGS_CLASS}`)) {
		el.classList.remove(MOD_SETTINGS_CLASS);
	}
}

const root = document.body ?? document.documentElement;
if (root) stripFromTree(root);

onDomChange((records) => {
	if (!records) {
		const root = document.body ?? document.documentElement;
		if (root) stripFromTree(root);
		return;
	}

	for (const record of records) {
		if (record.type === "attributes") {
			if (
				record.attributeName === "class" &&
				record.target instanceof Element &&
				record.target.classList.contains(MOD_SETTINGS_CLASS)
			) {
				record.target.classList.remove(MOD_SETTINGS_CLASS);
			}
		} else {
			for (const node of record.addedNodes) {
				if (node instanceof Element) stripFromTree(node);
			}
		}
	}
});
