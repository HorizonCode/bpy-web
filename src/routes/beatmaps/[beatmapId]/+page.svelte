<script lang="ts">
	import './style.postcss';
	import Popup from '$lib/components/Popup.svelte';
	import { appName, appUrl } from '$lib/env';
	import { getFormattedTimeFromSeconds } from '$lib/time';
	import { onMount } from 'svelte';
	import ArrowUpRight from 'svelte-feathers/ArrowUpRight.svelte';
	import Check from 'svelte-feathers/Check.svelte';
	import CheckCircle from 'svelte-feathers/CheckCircle.svelte';
	import ChevronsUp from 'svelte-feathers/ChevronsUp.svelte';
	import Clock from 'svelte-feathers/Clock.svelte';
	import Download from 'svelte-feathers/Download.svelte';
	import Heart from 'svelte-feathers/Heart.svelte';
	import HelpCircle from 'svelte-feathers/HelpCircle.svelte';
	import PlayCircle from 'svelte-feathers/PlayCircle.svelte';
	import Star from 'svelte-feathers/Star.svelte';
	import Trash from 'svelte-feathers/Trash.svelte';
	import { queryParam } from 'sveltekit-search-params';
	import { type MapScore } from '$lib/types';
	import { getBeatmapScores } from '$lib/api';
	import MapScores from '$lib/components/mapScores.svelte';
	import { statusIntToString } from '$lib/beatmapStatus';
	import { __ } from '$lib/language';
	import { userLanguage } from '$lib/storage';

	/*TODO: maybe rework this at another time
	 */
	export let data;

	let currentLeaderboard: MapScore[] = [];

	let firstLoad = true;
	let loading = true;
	let failed = false;

	const queryMode = queryParam('mode', undefined, {
		pushHistory: false
	});
	const queryType = queryParam('type', undefined, {
		pushHistory: false
	});

	let currentMode = 'osu';
	let currentType = 'vanilla';

	const modes = ['osu', 'taiko', 'catch', 'mania'];
	const types = ['vanilla', 'relax', 'autopilot'];

	const refreshLeaderboard = async () => {
		if (loading && !firstLoad) return;
		loading = true;
		currentLeaderboard = [];
		let mode = 0;

		if (currentType == 'relax' && currentMode == 'mania') currentMode = 'osu';
		if (currentType == 'autopilot' && currentMode != 'osu') currentMode = 'osu';

		queryMode.set(currentMode);
		queryType.set(currentType);

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

		try {
			const leaderboard = await getBeatmapScores({
				beatmapMd5: data.map!.md5,
				mode,
				scope: 'best'
			});
			currentLeaderboard = leaderboard?.scores ?? [];
			failed = false;
			firstLoad = false;
		} catch {
			failed = true;
		}
		loading = false;
	};

	const setMode = (mode: string) => {
		if (currentMode == mode) return;
		currentMode = mode;
		refreshLeaderboard();
	};

	const setType = (type: string) => {
		if (currentType == type) return;
		currentType = type;
		refreshLeaderboard();
	};

	onMount(() => {
		if (data.map?.id) {
			const selectedMode = $queryMode;
			const selectedType = $queryType;
			if (modes.includes(selectedMode!)) currentMode = selectedMode!;
			if (types.includes(selectedType!)) currentType = selectedType!;

			refreshLeaderboard();
		}
	});
</script>

<svelte:head>
	{#if data.map}
		<title>{appName} :: {data.map.artist} - {data.map.title} - map info</title>
		<meta property="og:type" content="profile" />
		<meta property="og:title" content="{data.map.artist} - {data.map.title} - map info" />
		<meta property="og:url" content="{appUrl}/beatmaps/{data.map.id}" />
		<meta property="profile:username" content="{data.map.artist} - {data.map.title}" />
	{:else}
		<title>{appName} :: beatmap not found</title>
	{/if}
</svelte:head>
<div class="container mx-auto w-full p-5">
	{#if data.map?.id}
		<div class="mx-auto card">
			<div class="w-full flex flex-col">
				<div class="relative p-3 bg-surface-600 rounded-t-lg">
					<div
						class="absolute h-full w-full top-0 left-0 bg-no-repeat bg-top blur opacity-10"
						style="background-image: url('https://assets.ppy.sh/beatmaps/{data.map
							.set_id}/covers/cover@2x.jpg');"
					></div>
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
				</div>
				<!-- <div
					class="relative h-28 md:h-64 bg-center bg-cover bg-no-repeat"
					style="background-image: url('https://assets.ppy.sh/beatmaps/{data.map
						.set_id}/covers/cover@2x.jpg');"
				>
					<div
						class="absolute w-full h-full bg-black/70 flex flex-col justify-center items-center md:gap-1 overflow-hidden"
					>
						<p class="text-white text-xl md:text-2xl truncate">
							{data.map.title}
						</p>
						<p class="text-white md:text-lg truncate text-ellipsis">{data.map.artist}</p>
            <p class="chip variant-filled-primary py-1 mb-1 cursor-default">{data.map.version}</p>
						<div class="flex flex-row gap-5 items-center bg-black/80 rounded-full p-2 py-1 text-sm">
							<Popup placement="top">
								<div class="flex flex-row gap-1 items-center">
									<Star class="pointer-events-none" size={14} />
									{data.map.diff.toFixed(2)}
								</div>
								<svelte:fragment slot="popup">
									<div class="card p-2 px-4 rounded-lg variant-filled-surface text-sm">
										{__('Difficulty Rating', $userLanguage)}
										<div
											class="arrow border-r border-b border-gray-700 variant-filled-surface"
										></div>
									</div>
								</svelte:fragment>
							</Popup>
							<Popup placement="top">
								<div class="flex flex-row gap-1 items-center">
									<Clock class="pointer-events-none" size={14} />
									{getFormattedTimeFromSeconds(data.map.total_length)}
								</div>
								<svelte:fragment slot="popup">
									<div class="card p-2 px-4 rounded-lg variant-filled-surface text-sm">
										{__('Length', $userLanguage)}
										<div
											class="arrow border-r border-b border-gray-700 variant-filled-surface"
										></div>
									</div>
								</svelte:fragment>
							</Popup>
							<Popup placement="top">
								<div class="flex flex-row gap-1 items-center">
									<PlayCircle class="pointer-events-none" size={14} />
									{data.map.plays.toFixed(0)}
								</div>
								<svelte:fragment slot="popup">
									<div class="card p-2 px-4 rounded-lg variant-filled-surface text-sm">
										{__('Play Count', $userLanguage)}
										<div
											class="arrow border-r border-b border-gray-700 variant-filled-surface"
										></div>
									</div>
								</svelte:fragment>
							</Popup>
							<Popup placement="top">
								<div class="flex flex-row gap-1 items-center">
									<CheckCircle class="pointer-events-none" size={14} />
									{data.map.passes.toFixed(0)}
								</div>
								<svelte:fragment slot="popup">
									<div class="card p-2 px-4 rounded-lg variant-filled-surface text-sm">
										{__('Pass Count', $userLanguage)}
										<div
											class="arrow border-r border-b border-gray-700 variant-filled-surface"
										></div>
									</div>
								</svelte:fragment>
							</Popup>
						</div>
					</div>
				</div> -->
				<div class="relative h-60 w-full">
					<div
						class="absolute top-0 left-0 h-full w-full bg-no-repeat bg-cover bg-center opacity-30"
						style="background-image: url('https://assets.ppy.sh/beatmaps/{data.map
							.set_id}/covers/cover@2x.jpg');"
					></div>
					<div
						class="flex flex-col items-center justify-center gap-0 absolute top-0 left-0 h-full w-full z-10 truncate"
					>
						<p class="text-xl md:text-2xl truncate">{data.map.title}</p>
						<p class="text-lg md:text-xl truncate">{data.map.artist}</p>
						<div class="bg-primary-500 text-sm rounded py-0.5 px-2 mt-3">{data.map.version}</div>
						<div
							class="flex flex-row gap-5 items-center bg-black/80 rounded-full p-2 py-1 text-sm mt-3"
						>
							<Popup placement="top">
								<div class="flex flex-row gap-1 items-center">
									<Star class="pointer-events-none" size={14} />
									{data.map.diff.toFixed(2)}
								</div>
								<svelte:fragment slot="popup">
									<div class="card p-2 px-4 rounded-lg variant-filled-surface text-sm">
										{__('Difficulty Rating', $userLanguage)}
										<div
											class="arrow border-r border-b border-gray-700 variant-filled-surface"
										></div>
									</div>
								</svelte:fragment>
							</Popup>
							<Popup placement="top">
								<div class="flex flex-row gap-1 items-center">
									<Clock class="pointer-events-none" size={14} />
									{getFormattedTimeFromSeconds(data.map.total_length)}
								</div>
								<svelte:fragment slot="popup">
									<div class="card p-2 px-4 rounded-lg variant-filled-surface text-sm">
										{__('Length', $userLanguage)}
										<div
											class="arrow border-r border-b border-gray-700 variant-filled-surface"
										></div>
									</div>
								</svelte:fragment>
							</Popup>
							<Popup placement="top">
								<div class="flex flex-row gap-1 items-center">
									<PlayCircle class="pointer-events-none" size={14} />
									{data.map.plays.toFixed(0)}
								</div>
								<svelte:fragment slot="popup">
									<div class="card p-2 px-4 rounded-lg variant-filled-surface text-sm">
										{__('Play Count', $userLanguage)}
										<div
											class="arrow border-r border-b border-gray-700 variant-filled-surface"
										></div>
									</div>
								</svelte:fragment>
							</Popup>
							<Popup placement="top">
								<div class="flex flex-row gap-1 items-center">
									<CheckCircle class="pointer-events-none" size={14} />
									{data.map.passes.toFixed(0)}
								</div>
								<svelte:fragment slot="popup">
									<div class="card p-2 px-4 rounded-lg variant-filled-surface text-sm">
										{__('Pass Count', $userLanguage)}
										<div
											class="arrow border-r border-b border-gray-700 variant-filled-surface"
										></div>
									</div>
								</svelte:fragment>
							</Popup>
						</div>
					</div>
				</div>
				<div class="relative flex flex-row items-center bg-surface-600 md:px-12 p-2">
					<div
						class="absolute h-full w-full top-0 left-0 bg-no-repeat bg-bottom blur opacity-10"
						style="background-image: url('https://assets.ppy.sh/beatmaps/{data.map
							.set_id}/covers/cover@2x.jpg');"
					></div>
					<div
						class="flex flex-row justify-start items-center gap-2 bg-black/50 rounded-lg p-1 px-3 z-10 tooltip"
						aria-label={statusIntToString(data.map.status)}
					>
						<div>
							{#if data.map.status == 5}
								<Heart class="pointer-events-none text-red-400" />
							{:else if data.map.status == 3 || data.map.status == 4}
								<Check class="pointer-events-none text-green-400" />
							{:else if data.map.status == 2}
								<ChevronsUp class="pointer-events-none text-blue-400" />
							{:else if data.map.status == -1}
								<Trash class="pointer-events-none text-gray-400" />
							{:else}
								<HelpCircle class="pointer-events-none text-gray-400" />
							{/if}
						</div>
						<div class="hidden md:block text-sm font-semibold">
							{statusIntToString(data.map.status)}
						</div>
					</div>
					<div class="ms-auto flex flex-row items-center gap-3 z-10">
						<a
							class="btn variant-soft-primary text-sm"
							href="https://osu.direct/api/d/{data.map.set_id}"
						>
							<Download class="pointer-events-none md:mr-2" size={18} />
							<span class="hidden md:block">{__('Download', $userLanguage)}</span>
						</a>
						<a
							class="btn variant-soft-secondary text-sm"
							href="https://osu.ppy.sh/b/{data.map.id}"
							target="_blank"
						>
							<ArrowUpRight class="pointer-events-none md:mr-2" size={18} />
							<span class="hidden md:block">{__('Show on osu.ppy.sh', $userLanguage)}</span>
						</a>
					</div>
				</div>
				<div class="bg-surface-800">
					{#if failed}
						<div class="w-full flex flex-col justify-center items-center gap-2">
							<p class="text-slate-400">{__('Failed to load leaderboard.', $userLanguage)}</p>
							<button class="btn variant-filled-surface rounded-lg" on:click={refreshLeaderboard}>
								{__('Refresh', $userLanguage)}
							</button>
						</div>
					{:else}
						<MapScores beatmapScores={currentLeaderboard} {currentMode} {currentType} {loading} />
					{/if}
				</div>
				<div class="flex flex-row-reverse bg-surface-700 p-7 py-2 rounded-b-lg"></div>
			</div>
		</div>
	{:else}
		<div class="mx-auto card p-6 py-12">
			<div
				class="w-full flex flex-col lg:divide-x divide-surface-500 lg:flex-row items-center justify-around gap-5 lg:gap-2"
			>
				<div class="flex flex-col items-center justify-center">
					<p class="text-4xl">404</p>
					<p class="text-xl">{__('Beatmap not found.', $userLanguage)}</p>
				</div>
				<div class="flex flex-col items-center lg:items-start justify-normal lg:ps-20 gap-2">
					<p class="text-lg font-semibold underline underline-offset-2">
						{__('There are a few possible reasons for this:', $userLanguage)}
					</p>
					<ul class="list-disc ms-5">
						<li>{__('The map was deleted', $userLanguage)}</li>
						<li>{__('The map has not been cached yet', $userLanguage)}</li>
						<li>{__('You may have made a typo!', $userLanguage)}</li>
					</ul>
					<a class="mx-auto mt-10 btn variant-filled-surface" href="/"
						>{__('Back to Home', $userLanguage)}</a
					>
				</div>
			</div>
		</div>
	{/if}
</div>
