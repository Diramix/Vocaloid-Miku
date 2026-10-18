export {};

declare global {
	interface Window {
		nextmusicApi: any;
		desktopEvents: any;
		next?: { router?: { push?: (url: string) => void } };
	}
}
