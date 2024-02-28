<script lang="ts">
	import type { LBUser } from '$lib/types';
	import { onMount } from 'svelte';
	import { ChevronLeft, ChevronRight } from 'svelte-feathers';

	let currentLeaderboard: LBUser[] = [];

	const refreshLeaderboard = async () => {
		const leaderboard = await fetch('https://api.ez-pp.farm/get_leaderboard');
		const leaderboardJSON = await leaderboard.json();
		console.log(leaderboardJSON);
		currentLeaderboard = leaderboardJSON.leaderboard;
	};

	onMount(() => {
		refreshLeaderboard();
	});
</script>

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
	<div class="w-full p-5">
		<table class="w-full">
			<thead>
				<td></td>
				<td></td>
				<td>Accuracy</td>
				<td>Play Count</td>
				<td>Performance</td>
				<td>SS</td>
				<td>S</td>
				<td>A</td>
			</thead>
			<tbody>
				{#each currentLeaderboard as user, i}
					<tr>
						<td>#{i + 1}</td>
						<td>{user.name}</td>
						<td>{user.acc.toFixed(2)}%</td>
						<td>{user.plays}</td>
						<td>{user.pp.toFixed(0)}</td>
						<td>{user.x_count + user.xh_count}</td>
						<td>{user.s_count + user.sh_count}</td>
						<td>{user.a_count}</td>
					</tr>{/each}
			</tbody>
		</table>
	</div>
</div>
