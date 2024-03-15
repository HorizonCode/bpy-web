<script lang="ts">
	import './style.postcss';
	import type { LBUser } from '$lib/types';
	import { onMount } from 'svelte';
	import { ChevronLeft, ChevronRight } from 'svelte-feathers';
	import { goto } from '$app/navigation';
	import { scale } from 'svelte/transition';
	import Popup from '$lib/Popup.svelte';
	import { apiUrl, appName, avatarUrl } from '$lib/env';
	import { queryParam } from 'sveltekit-search-params';
	import { regionNames } from '$lib/stringUtil';
	import { removeClanTag } from '$lib/regex';

	const modes = ['osu', 'taiko', 'catch', 'mania'];
	const types = ['vanilla', 'relax', 'autopilot'];

	let currentLeaderboard: LBUser[] = [];

	let firstLoad = true;
	let loading = false;
	let failed = false;

	const queryMode = queryParam('mode');
	const queryType = queryParam('type');
	const queryPage = queryParam('page');

	let currentType = 'vanilla';
	let currentMode = 'osu';
	let currentPage = 1;
	let hasNextPage = true;

	const selectedMode = $queryMode;
	const selectedType = $queryType;
	if (modes.includes(selectedMode!)) currentMode = selectedMode!;
	if (types.includes(selectedType!)) currentType = selectedType!;
	if (/^\d+$/.test($queryPage!) && parseInt($queryPage!) > 0) currentPage = parseInt($queryPage!);

	const refreshLeaderboard = async () => {
		if (loading) return;
		loading = true;
		currentLeaderboard = [];
		let mode = 0;
		const urlParams = new URLSearchParams();

		if (currentType == 'relax' && currentMode == 'mania') currentMode = 'osu';
		if (currentType == 'autopilot' && currentMode != 'osu') currentMode = 'osu';

		queryMode.set(currentMode);
		queryType.set(currentType);
		queryPage.set(currentPage.toFixed(0));

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

		urlParams.set('limit', '50');
		urlParams.set('offset', ((currentPage - 1) * 50).toFixed(0));

		try {
			const leaderboard = await fetch(`${apiUrl}/get_leaderboard?` + urlParams.toString());
			const leaderboardJSON = await leaderboard.json();
			hasNextPage = leaderboardJSON.leaderboard.length >= 50;
			currentLeaderboard = leaderboardJSON.leaderboard;
			failed = false;
			firstLoad = false;
		} catch {
			failed = true;
		}
		loading = false;
	};

	const setMode = (mode: string) => {
		if (currentMode == mode) return;
		currentPage = 1;
		currentMode = mode;
		refreshLeaderboard();
	};

	const setType = (type: string) => {
		if (currentType == type) return;
		currentPage = 1;
		currentType = type;
		refreshLeaderboard();
	};

	const nextPage = () => {
		currentPage += 1;
		const pageMain = document.getElementById('page');
		if (pageMain) pageMain.scrollTo({ top: 0, behavior: 'smooth' });
		refreshLeaderboard();
	};

	const prevPage = () => {
		if (currentPage <= 1) return;
		currentPage -= 1;
		const pageMain = document.getElementById('page');
		if (pageMain) pageMain.scrollTo({ top: 0, behavior: 'smooth' });
		refreshLeaderboard();
	};

	onMount(() => {
		refreshLeaderboard();
	});
</script>

<svelte:head>
	<title>{appName} :: Leaderboard</title>
</svelte:head>

<div class="container mx-auto w-full p-5">
	<div class="bg-surface-700 flex flex-col justify-center gap-4 p-2 rounded-lg">
		<div class="grid md:grid-cols-[auto_auto] gap-2">
			<div class="w-full justify-center md:justify-start flex rounded-lg">
				<button
					class="w-[100%] md:w-[25%] !scale-100 btn {currentType == 'vanilla'
						? 'bg-surface-500'
						: 'bg-surface-600'} rounded-lg rounded-r-none"
					on:click={() => setType('vanilla')}
					disabled={loading || failed}
				>
					Vanilla
				</button>
				<button
					class="w-[100%] md:w-[25%] !scale-100 btn {currentType == 'relax'
						? 'bg-surface-500'
						: 'bg-surface-600'} rounded-none"
					on:click={() => setType('relax')}
					disabled={currentMode == 'mania' || loading || failed}
				>
					Relax
				</button>
				<button
					class="w-[100%] md:w-[25%] !scale-100 btn {currentType == 'autopilot'
						? 'bg-surface-500'
						: 'bg-surface-600'} rounded-lg rounded-l-none"
					disabled={currentMode == 'taiko' ||
						currentMode == 'catch' ||
						currentMode == 'mania' ||
						loading ||
						failed}
					on:click={() => setType('autopilot')}
				>
					Autopilot
				</button>
			</div>
			<div class="w-full flex rounded-lg">
				<button
					class="w-[25%] !scale-100 btn {currentMode == 'osu'
						? 'bg-surface-500'
						: 'bg-surface-600'} rounded-lg rounded-r-none"
					on:click={() => setMode('osu')}
					disabled={loading || failed}
				>
					osu!
				</button>
				<button
					class="w-[25%] !scale-100 btn {currentMode == 'taiko'
						? 'bg-surface-500'
						: 'bg-surface-600'} rounded-none"
					on:click={() => setMode('taiko')}
					disabled={currentType == 'autopilot' || loading || failed}
				>
					taiko
				</button>
				<button
					class="w-[25%] !scale-100 btn {currentMode == 'catch'
						? 'bg-surface-500'
						: 'bg-surface-600'} rounded-none"
					on:click={() => setMode('catch')}
					disabled={currentType == 'autopilot' || loading || failed}
				>
					catch
				</button>
				<button
					class="w-[25%] !scale-100 btn {currentMode == 'mania'
						? 'bg-surface-500'
						: 'bg-surface-600'} rounded-lg rounded-l-none"
					on:click={() => setMode('mania')}
					disabled={currentType == 'relax' || currentType == 'autopilot' || loading || failed}
				>
					mania
				</button>
			</div>
		</div>
		<div class="w-full flex flex-row justify-between items-center px-2">
			<button
				class="btn variant-filled-surface rounded-lg"
				on:click={prevPage}
				disabled={currentPage <= 1 || loading || failed}
			>
				<ChevronLeft class="outline-none border-none" />
			</button>
			<p class="text-slate-400">Page {currentPage}</p>
			<button
				class="btn variant-filled-surface rounded-lg"
				on:click={nextPage}
				disabled={loading || failed || !hasNextPage}
			>
				<ChevronRight class="outline-none border-none" />
			</button>
		</div>
		{#if failed}
			<div class="w-full flex flex-col justify-center items-center gap-2">
				<p class="text-slate-400">Failed to load leaderboard.</p>
				<button class="btn variant-filled-surface rounded-lg" on:click={refreshLeaderboard}>
					Refresh
				</button>
			</div>
		{:else}
			<div class="w-full p-5 overflow-x-auto">
				<table class="w-full overflow-x-auto">
					<thead class="text-center">
						<td class="w-14"></td>
						<td></td>
						<td class="w-24">Accuracy</td>
						<td class="w-24">Play Count</td>
						<td class="w-24">Performance</td>
						<td class="w-24">SS</td>
						<td class="w-24">S</td>
						<td class="w-24">A</td>
					</thead>
					<tbody>
						{#if firstLoad}
							{#each { length: 50 } as _, i}
								<tr
									class="bg-surface-800 rounded animate-pulse"
									transition:scale={{ duration: 200, delay: 100 * i }}
								>
									<td class="text-center">#{i + (currentPage - 1) * 50 + 1}</td>
									<td>
										<div class="flex flex-row items-center gap-2">
											<div class="h-5 w-7 placeholder rounded-lg"></div>
											<div class="h-10 w-11 placeholder rounded-[30%]"></div>
											<div class="w-full placeholder"></div>
										</div>
									</td>
									<td class="text-center"><div class="placeholder"></div></td>
									<td class="text-center"><div class="placeholder"></div></td>
									<td class="text-center"><div class="placeholder"></div></td>
									<td class="text-center"><div class="placeholder"></div></td>
									<td class="text-center"><div class="placeholder"></div></td>
									<td class="text-center"><div class="placeholder"></div></td>
								</tr>
							{/each}
						{:else}
							{#key failed}
								{#each currentLeaderboard as user, i}
									<tr
										class="bg-surface-800 rounded"
										on:click={() =>
											goto(`u/${user.player_id}?mode=${currentMode}&type=${currentType}`)}
										transition:scale={{ start: 0.995, duration: 200, delay: 50 * (i / 2) }}
									>
										<td class="text-center">#{i + (currentPage - 1) * 50 + 1}</td>
										<td>
											<div class="flex flex-row items-center gap-2">
												<Popup placement="right">
													<img
														src="/flags/{user.country.toUpperCase()}.png"
														alt="{regionNames.of(user.country) ?? user.country.toUpperCase()} Flag"
														class="h-5 w-7 shadow-[0_2px_5px_1px_rgba(0,0,0,0.3)] pointer-events-none"
													/>
													<svelte:fragment slot="popup">
														<div class="card p-2 px-4 rounded-lg variant-filled-surface text-sm">
															{regionNames.of(user.country.toUpperCase()) ??
																user.country.toUpperCase()}
															<div
																class="arrow border-l border-b border-gray-700 variant-filled-surface"
															></div>
														</div>
													</svelte:fragment>
												</Popup>
												<div
													class="h-10 w-10 rounded-[30%] shadow-[0_2px_5px_1px_rgba(0,0,0,0.3)] bg-surface-600 overflow-hidden"
												>
													{#key user}
														<img
															class="h-10 w-10"
															src="{avatarUrl}/{user.player_id}"
															alt="profilePicture"
														/>
													{/key}
												</div>
												{#if user.clan_tag}
													<a
														class="chip p-1.5 min-w-7 variant-soft-primary hover:variant-filled-primary"
														href="/clan/{user.clan_id}"
													>
														{user.clan_tag}
													</a>
												{/if}
												<span class="font-semibold truncate text-ellipsis">
													{removeClanTag(user.name)}
												</span>
											</div>
										</td>
										<td class="text-center">{user.acc.toFixed(2)}%</td>
										<td class="text-center">{user.plays}</td>
										<td class="text-center">{user.pp.toFixed(0)}</td>
										<td class="text-center">{user.x_count + user.xh_count}</td>
										<td class="text-center">{user.s_count + user.sh_count}</td>
										<td class="text-center">{user.a_count}</td>
									</tr>
								{/each}
							{/key}
						{/if}
					</tbody>
				</table>
			</div>
		{/if}
		<div class="w-full flex flex-row justify-between items-center px-2 mb-2">
			<button
				class="btn variant-filled-surface rounded-lg"
				on:click={prevPage}
				disabled={currentPage <= 1 || loading || failed}
			>
				<ChevronLeft class="outline-none border-none" />
			</button>
			<p class="text-slate-400">Page {currentPage}</p>
			<button
				class="btn variant-filled-surface rounded-lg"
				on:click={nextPage}
				disabled={loading || failed || !hasNextPage}
			>
				<ChevronRight class="outline-none border-none" />
			</button>
		</div>
	</div>
</div>
