import { onDomChange } from "./domObserver";

const applyTheme = () => {
	const body = document.body;
	if (!body) return;

	const classes = body.classList;
	if (classes.contains("ym-light-theme")) return;

	if (classes.contains("ym-dark-theme")) {
		classes.replace("ym-dark-theme", "ym-light-theme");
	} else {
		classes.add("ym-light-theme");
	}
};

applyTheme();
onDomChange(applyTheme);
