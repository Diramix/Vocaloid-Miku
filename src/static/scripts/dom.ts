import "./chunkPatches";

document.body.appendChild(
	Object.assign(document.createElement("div"), {
		className: "ThemeTitleText",
		textContent: "Vocaloid Miku!",
	}),
);
