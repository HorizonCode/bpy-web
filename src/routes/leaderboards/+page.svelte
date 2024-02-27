<script lang="ts">
	import { ChevronLeft, ChevronRight } from 'svelte-feathers';

	let currentLeaderboard: unknown[] = [];

	const refreshLeaderboard = async () => {
		const leaderboard = await fetch('https://api.ez-pp.farm/get_leaderboard');
		const leaderboardJSON = await leaderboard.json();
		currentLeaderboard = leaderboardJSON.leaderboard;
	};

	refreshLeaderboard();
</script>

{JSON.stringify(currentLeaderboard, null, 2)}}

<div class="max-w-[1640px] mx-auto w-full p-5">
	<div class="bg-surface-700 flex flex-col justify-center gap-4 p-2 rounded-lg">
		<div class="grid md:grid-cols-[auto_auto] gap-2">
			<div class="w-full justify-center md:justify-start flex rounded-lg">
				<button class="w-[25%] !scale-100 btn bg-surface-500 rounded-lg rounded-r-none">
					Vanilla
				</button>
				<button class="w-[25%] !scale-100 btn bg-surface-600 rounded-none">Relax</button>
				<button class="w-[25%] !scale-100 btn bg-surface-600 rounded-lg rounded-l-none">
					Autopilot
				</button>
			</div>
			<div class="w-full flex rounded-lg">
				<button class="w-[25%] !scale-100 btn bg-surface-500 rounded-lg rounded-r-none">osu!</button
				>
				<button class="w-[25%] !scale-100 btn bg-surface-600 rounded-none">taiko</button>
				<button class="w-[25%] !scale-100 btn bg-surface-600 rounded-none">catch</button>
				<button class="w-[25%] !scale-100 btn bg-surface-600 rounded-lg rounded-l-none"
					>mania</button
				>
			</div>
		</div>
		<div class="w-full flex flex-row justify-between px-2">
			<button class="btn variant-filled-surface rounded-lg">
				<ChevronLeft class="outline-none border-none" />
			</button>
			<button class="btn variant-filled-surface rounded-lg">
				<ChevronRight class="outline-none border-none" />
			</button>
		</div>
	</div>
</div>
