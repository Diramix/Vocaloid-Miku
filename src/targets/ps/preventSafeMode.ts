(function () {
	const INIT_FINISHED = "APPLICATION_INIT_FINISHED";
	const APP_STALL = "APP_STALL";
	const STALL_CANCEL = "APP_STALL_CANCEL_RESTART";

	function sendInitFinished(): void {
		window.desktopEvents?.send?.(INIT_FINISHED);
	}

	function cancelSafeModeRestart(): void {
		window.desktopEvents?.send?.(STALL_CANCEL);
		sendInitFinished();
	}

	function setup(): void {
		if (!window.desktopEvents?.send || !window.desktopEvents?.on) {
			setTimeout(setup, 100);
			return;
		}

		sendInitFinished();

		window.desktopEvents.on(APP_STALL, cancelSafeModeRestart);
	}

	setup();
})();
