type Props = { className?: unknown; children?: any; [key: string]: any };
type Jsx = (...args: any[]) => any;

const PLAYER = "PlayerBarDesktopWithBackgroundProgressBar_player__";
const SONATA = "PlayerBarDesktopWithBackgroundProgressBar_sonata__";

function hasClassPrefix(value: unknown, prefix: string): boolean {
	return (
		typeof value === "string" &&
		value.split(/\s+/).some((name) => name.startsWith(prefix))
	);
}

export function patchPlayerBarProps(
	type: unknown,
	props: Props,
	jsx: Jsx,
): Props {
	if (type !== "div" || !hasClassPrefix(props.className, PLAYER))
		return props;
	const children = props.children;
	if (!Array.isArray(children)) return props;
	if (
		children.some(
			(child) =>
				typeof child?.props?.className === "string" &&
				child.props.className.split(/\s+/).includes("mikuRun"),
		)
	)
		return props;
	const index = children.findIndex((child) =>
		hasClassPrefix(child?.props?.className, SONATA),
	);
	if (index < 0) return props;
	const runner = jsx(
		"div",
		{ className: "mikuRun", "aria-hidden": true },
		"miku:mikuRun",
	);
	return {
		...props,
		children: [
			...children.slice(0, index + 1),
			runner,
			...children.slice(index + 1),
		],
	};
}
