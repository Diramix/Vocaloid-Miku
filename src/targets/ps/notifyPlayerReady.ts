function notifyPlayerReady(): void {
	const api = window.pulsesyncApi;
	const send = window.desktopEvents?.send;
	if (!api?._waitForPlayer || !send) {
		setTimeout(notifyPlayerReady, 200);
		return;
	}

	api._waitForPlayer((player: any) => {
		const state = player?.state;
		const track =
			state?.queueState?.currentEntity?.value?.entity?.entityData?.meta;
		const status = state?.playerState?.status?.value ?? "idle";

		send("PLAYER_STATE", {
			status,
			isPlaying: status === "playing",
			track: track ?? { durationMs: 0 },
		});
	});
}

notifyPlayerReady();
