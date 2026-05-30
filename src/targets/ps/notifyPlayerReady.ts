function notifyPlayerReady(): void {
	const sendPlayerReady = () => {
		window.desktopEvents?.send?.("PLAYER_STATE", {
			status: "idle",
			isPlaying: false,
			track: { durationMs: 0 },
		});
	};

	const startHeartbeat = () => {
		if (!window.desktopEvents?.send) {
			setTimeout(startHeartbeat, 200);
			return;
		}

		sendPlayerReady();
		const interval = window.setInterval(sendPlayerReady, 5000);
		window.setTimeout(() => window.clearInterval(interval), 45000);

		window.desktopEvents.on?.("APP_STALL", () => {
			sendPlayerReady();
			window.desktopEvents?.send?.("APP_STALL_CANCEL_RESTART");
		});
	};

	const setupWaitForPlayer = () => {
		const api = window.pulsesyncApi;
		if (!api?._waitForPlayer) {
			setTimeout(setupWaitForPlayer, 200);
			return;
		}

		api._waitForPlayer((player: any) => {
			const state = player?.state;
			const track =
				state?.queueState?.currentEntity?.value?.entity?.entityData?.meta;
			const status = state?.playerState?.status?.value ?? "idle";

			window.desktopEvents?.send?.("PLAYER_STATE", {
				status,
				isPlaying: status === "playing",
				track: track ?? { durationMs: 0 },
			});
		});
	};

	startHeartbeat();
	setupWaitForPlayer();
}

notifyPlayerReady();
