export {};

declare global {
	interface Window {
		getCurrentModClient: () => string;
		nextmusicApi: any;
		pulsesyncApi: any;
		desktopEvents: any;
		next?: { router?: { push?: (url: string) => void } };
	}
}
