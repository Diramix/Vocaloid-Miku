export {};

declare global {
	interface Window {
		hasRun: boolean;
		getCurrentModClient: () => string;
		nextmusicApi: any;
		pulsesyncApi: any;
	}
}
