<script lang="ts">
	import './style.postcss';
	import type { LBUser } from '$lib/types';
	import { onMount } from 'svelte';
	import { ChevronLeft, ChevronRight } from 'svelte-feathers';
	import { goto } from '$app/navigation';
	import { scale } from 'svelte/transition';

	let currentLeaderboard: LBUser[] = [];

	let currentType = 'vanilla';
	let currentMode = 'osu';
	let currentPage = 1;

	const refreshLeaderboard = async () => {
		currentLeaderboard = [];
		let mode = 0;
		const urlParams = new URLSearchParams();

		switch (currentMode) {
			case 'taiko':
				mode += 1;
				break;
			case 'catch':
				mode += 2;
				break;
			case 'mania':
				mode += 3;
				break;
		}

		switch (currentType) {
			case 'relax':
				mode += 4;
				break;
			case 'autopilot':
				mode += 8;
				break;
		}

		urlParams.set('mode', mode.toFixed(0));

		const leaderboard = await fetch(
			'https://api.ez-pp.farm/get_leaderboard?' + urlParams.toString()
		);
		const leaderboardJSON = await leaderboard.json();
		console.log(leaderboardJSON);
		currentLeaderboard = leaderboardJSON.leaderboard;
	};

	const setMode = (mode: string) => {
		currentMode = mode;
		refreshLeaderboard();
	};

	const setType = (type: string) => {
		currentType = type;
		refreshLeaderboard();
	};

	onMount(() => {
		//refreshLeaderboard();
	});
</script>

<div class="max-w-[1640px] mx-auto w-full p-5">
	<div class="bg-surface-700 flex flex-col justify-center gap-4 p-2 rounded-lg">
		<div class="grid md:grid-cols-[auto_auto] gap-2">
			<div class="w-full justify-center md:justify-start flex rounded-lg">
				<button
					class="w-[25%] !scale-100 btn {currentType == 'vanilla'
						? 'bg-surface-500'
						: 'bg-surface-600'} rounded-lg rounded-r-none"
					on:click={() => setType('vanilla')}
				>
					Vanilla
				</button>
				<button
					class="w-[25%] !scale-100 btn {currentType == 'relax'
						? 'bg-surface-500'
						: 'bg-surface-600'} rounded-none"
					on:click={() => setType('relax')}
				>
					Relax
				</button>
				<button
					class="w-[25%] !scale-100 btn {currentType == 'autopilot'
						? 'bg-surface-500'
						: 'bg-surface-600'} rounded-lg rounded-l-none"
					on:click={() => setType('autopilot')}
				>
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
			<button class="btn variant-filled-surface rounded-lg" disabled={true}>
				<ChevronLeft class="outline-none border-none" />
			</button>
			<button class="btn variant-filled-surface rounded-lg">
				<ChevronRight class="outline-none border-none" />
			</button>
		</div>
		<div class="w-full p-5 overflow-x-auto">
			<table class="w-full overflow-x-auto">
				<thead class="text-center">
					<td></td>
					<td></td>
					<td class="w-24">Accuracy</td>
					<td class="w-24">Play Count</td>
					<td class="w-24">Performance</td>
					<td class="w-24">SS</td>
					<td class="w-24">S</td>
					<td class="w-24">A</td>
				</thead>
				<tbody>
					{#if currentLeaderboard && currentLeaderboard.length > 0}
						{#each currentLeaderboard as user, i}
							<tr
								class="bg-surface-800 rounded"
								on:click={() => goto(`u/${user.player_id}`)}
								transition:scale={{ duration: 200, delay: 100 * i }}
							>
								<td class="text-center">#{i + 1}</td>
								<td>
									<img
										src="https://ez-pp.farm/assets/img/flags/{user.country.toUpperCase()}.png"
										alt="{user.country} Flag"
										class="h-5 inline-block mr-2 pointer-events-none"
									/>{user.name}</td
								>
								<td class="text-center">{user.acc.toFixed(2)}%</td>
								<td class="text-center">{user.plays}</td>
								<td class="text-center">{user.pp.toFixed(0)}</td>
								<td class="text-center">{user.x_count + user.xh_count}</td>
								<td class="text-center">{user.s_count + user.sh_count}</td>
								<td class="text-center">{user.a_count}</td>
							</tr>
						{/each}
					{:else}
						{#each { length: 50 } as _, i}
							<tr class="bg-surface-800 rounded animate-pulse" transition:scale={{ duration: 200, delay: 100 * i }}>
								<td class="text-center">#{i + 1}</td>
								<td><div class="placeholder"></div></td>
								<td class="text-center"><div class="placeholder"></div></td>
								<td class="text-center"><div class="placeholder"></div></td>
								<td class="text-center"><div class="placeholder"></div></td>
								<td class="text-center"><div class="placeholder"></div></td>
								<td class="text-center"><div class="placeholder"></div></td>
								<td class="text-center"><div class="placeholder"></div></td>
							</tr>
						{/each}
					{/if}
				</tbody>
			</table>
		</div>
	</div>
</div>
