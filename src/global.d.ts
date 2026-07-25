export {};

declare global {
	interface Window {
		hasRun: boolean;
		getCurrentModClient: () => string;
		nextmusicApi: any;
		pulsesyncApi: any;
		desktopEvents: any;
		next?: { router?: { push?: (url: string) => void } };
	}
}
