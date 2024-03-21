<script lang="ts">
	import './style.postcss';
	import Popup from '$lib/components/Popup.svelte';
	import { appName, appUrl, avatarUrl } from '$lib/env';
	import { getLevelProgress, getLevel } from '$lib/level';
	import { getPlayerScores } from '$lib/api';
	import { tweened } from 'svelte/motion';
	import { onMount } from 'svelte';
	import { cubicInOut } from 'svelte/easing';
	import { queryParam } from 'sveltekit-search-params';
	import { ChevronDown, Edit2 } from 'svelte-feathers';
	import type { Clan, PlayerScores } from '$lib/types';
	import { getClan } from '$lib/api';
	import { userData } from '$lib/storage';
	import { getCountryName } from '$lib/country';
	import { numberHumanReadable } from '$lib/stringUtil';
	import { getTimeAgo, secondsToDHM } from '$lib/time';
	import UserScores from '$lib/components/userScores.svelte';
	import { ProgressRadial } from '@skeletonlabs/skeleton';
	import { removeTrailingZeroes } from '$lib/regex';

	export let data;
	let clan: Clan | undefined;
	let bestScores: PlayerScores | undefined;
	let recentScores: PlayerScores | undefined;

	let amountBestScores = 5;
	let amountRecentScores = 5;

	const queryMode = queryParam('mode', undefined, {
		pushHistory: false
	});
	const queryType = queryParam('type', undefined, {
		pushHistory: false
	});

	let loading = false;
	let failed = false;
	let currentMode = 'osu';
	let currentType = 'vanilla';
	let currentModeInt: number = 0;

	// NOTE: this is so cursed, please kill me
	let level = tweened(0, {
		duration: 500,
		easing: cubicInOut,
		interpolate: (a, b) => (t) => Math.trunc(a + (b - a) * t)
	});

	let levelProgress = tweened(0, {
		duration: 500,
		easing: cubicInOut,
		interpolate: (a, b) => (t) => Math.trunc(a + (b - a) * t)
	});

	let globalRank = tweened(0, {
		duration: 500,
		easing: cubicInOut,
		interpolate: (a, b) => (t) => Math.trunc(a + (b - a) * t)
	});

	let countryRank = tweened(0, {
		duration: 500,
		easing: cubicInOut,
		interpolate: (a, b) => (t) => Math.trunc(a + (b - a) * t)
	});

	let totalScore = tweened(0, {
		duration: 500,
		easing: cubicInOut,
		interpolate: (a, b) => (t) => Math.trunc(a + (b - a) * t)
	});

	let rankedScore = tweened(0, {
		duration: 500,
		easing: cubicInOut,
		interpolate: (a, b) => (t) => Math.trunc(a + (b - a) * t)
	});

	let hitAccuracy = tweened(0, {
		duration: 500,
		easing: cubicInOut
	});

	let playCount = tweened(0, {
		duration: 500,
		easing: cubicInOut,
		interpolate: (a, b) => (t) => Math.trunc(a + (b - a) * t)
	});

	let maxCombo = tweened(0, {
		duration: 500,
		easing: cubicInOut,
		interpolate: (a, b) => (t) => Math.trunc(a + (b - a) * t)
	});

	let replayViews = tweened(0, {
		duration: 500,
		easing: cubicInOut,
		interpolate: (a, b) => (t) => Math.trunc(a + (b - a) * t)
	});

	let performancePoints = tweened(0, {
		duration: 500,
		easing: cubicInOut,
		interpolate: (a, b) => (t) => Math.trunc(a + (b - a) * t)
	});

	let playTime = tweened(0, {
		duration: 500,
		easing: cubicInOut,
		interpolate: (a, b) => (t) => Math.trunc(a + (b - a) * t)
	});

	let xhGrade = tweened(0, {
		duration: 500,
		easing: cubicInOut,
		interpolate: (a, b) => (t) => Math.trunc(a + (b - a) * t)
	});

	let xGrade = tweened(0, {
		duration: 500,
		easing: cubicInOut,
		interpolate: (a, b) => (t) => Math.trunc(a + (b - a) * t)
	});

	let shGrade = tweened(0, {
		duration: 500,
		easing: cubicInOut,
		interpolate: (a, b) => (t) => Math.trunc(a + (b - a) * t)
	});

	let sGrade = tweened(0, {
		duration: 500,
		easing: cubicInOut,
		interpolate: (a, b) => (t) => Math.trunc(a + (b - a) * t)
	});

	let aGrade = tweened(0, {
		duration: 500,
		easing: cubicInOut,
		interpolate: (a, b) => (t) => Math.trunc(a + (b - a) * t)
	});

	const modes = ['osu', 'taiko', 'catch', 'mania'];
	const types = ['vanilla', 'relax', 'autopilot'];

	const loadBestScores = async (resetLoading?: boolean) => {
		loading = true;
		if (data.user?.info.id) {
			const bestScoresRequest = await getPlayerScores({
				userId: data.user.info.id,
				limit: amountBestScores,
				offset: 0,
				mode: currentModeInt,
				scope: 'best'
			});
			if (bestScoresRequest) {
				bestScores = bestScoresRequest;
			}
		}
		if (resetLoading) loading = false;
	};

	const loadRecentScores = async (resetLoading?: boolean) => {
		loading = true;
		if (data.user?.info.id) {
			const recentScoresRequest = await getPlayerScores({
				userId: data.user.info.id,
				limit: amountRecentScores,
				offset: 0,
				mode: currentModeInt,
				scope: 'recent'
			});
			if (recentScoresRequest) {
				recentScores = recentScoresRequest;
			}
		}
		if (resetLoading) loading = false;
	};

	const updateModeInt = async () => {
		loading = true;
		if (currentType == 'relax' && currentMode == 'mania') currentMode = 'osu';
		if (currentType == 'autopilot' && currentMode != 'osu') currentMode = 'osu';

		amountBestScores = 5;
		amountRecentScores = 5;

		queryMode.set(currentMode);
		queryType.set(currentType);

		let mode = 0;
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
		currentModeInt = mode;

		if (data.user?.info.id) {
			level.set(getLevel(data.user.stats[currentModeInt].tscore));
			levelProgress.set(getLevelProgress(data.user.stats[currentModeInt].tscore));
			globalRank.set(data.user.stats[currentModeInt].rank);
			countryRank.set(data.user.stats[currentModeInt].country_rank);
			rankedScore.set(data.user.stats[currentModeInt].rscore);
			totalScore.set(data.user.stats[currentModeInt].tscore);
			hitAccuracy.set(data.user.stats[currentModeInt].acc);
			playCount.set(data.user.stats[currentModeInt].plays);
			maxCombo.set(data.user.stats[currentModeInt].max_combo);
			replayViews.set(data.user.stats[currentModeInt].replay_views);
			performancePoints.set(data.user.stats[currentModeInt].pp);
			playTime.set(data.user.stats[currentModeInt].playtime);
			xhGrade.set(data.user.stats[currentModeInt].xh_count);
			xGrade.set(data.user.stats[currentModeInt].x_count);
			shGrade.set(data.user.stats[currentModeInt].sh_count);
			sGrade.set(data.user.stats[currentModeInt].s_count);
			aGrade.set(data.user.stats[currentModeInt].a_count);

			//TODO: rework this, maybe a own component for that?
			// fetch best and recent scores from current selected mode
			await loadBestScores();
			await loadRecentScores();
		}
		loading = false;
	};

	const setMode = async (mode: string) => {
		if (currentMode == mode) return;
		currentMode = mode;
		await updateModeInt();
	};

	const setType = async (type: string) => {
		if (currentType == type) return;
		currentType = type;
		await updateModeInt();
	};

	const loadMoreBestScores = async () => {
		if (loading) return;
		amountBestScores += 5;
		await loadBestScores(true);
	};

	const loadMoreRecentScores = async () => {
		if (loading) return;
		amountRecentScores += 5;
		await loadRecentScores(true);
	};

	onMount(async () => {
		if (data.user?.info.id) {
			const selectedMode = $queryMode;
			const selectedType = $queryType;
			if (modes.includes(selectedMode!)) currentMode = selectedMode!;
			if (types.includes(selectedType!)) currentType = selectedType!;

			await updateModeInt();

			if (data.user.info.clan_id) clan = await getClan(data.user.info.clan_id);
		}
	});
</script>

<svelte:head>
	{#if data.user?.info.id}
		<title>{appName} :: {data.user.info.name} - player info</title>
		<meta property="og:type" content="profile" />
		<meta property="og:title" content="{data.user.info.name} - player info" />
		<meta property="og:url" content="{appUrl}/u/{data.user.info.id}" />
		<meta property="og:image" content="{avatarUrl}/{data.user.info.id}" />
		<meta property="profile:username" content={data.user.info.name} />
	{:else}
		<title>{appName} :: player not found</title>
	{/if}
</svelte:head>
<div class="container mx-auto w-full p-5">
	{#if data.user?.info.id}
		<div class="mx-auto card overflow-hidden">
			<div class="w-full flex flex-col">
				<div class="relative p-3 bg-surface-600">
					<div
						class="absolute h-full w-full top-0 left-0 bg-no-repeat bg-top blur opacity-10"
						style="background-image: url('/u/{data.user.info.id}/cover');"
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
				<div
					class="relative h-28 md:h-64 bg-center bg-cover bg-no-repeat"
					style="background-image: url('/u/{data.user.info.id}/cover');"
				>
					{#if $userData?.id == data.user.info.id}
						<a
							class="btn btn-icon variant-filled-surface absolute flex justify-center items-center bottom-2 right-2 h-10 w-10"
							href="/settings/cover"
						>
							<Edit2 class="pointer-events-none" size={20} />
						</a>
					{/if}
				</div>
				<div class="relative flex flex-row bg-surface-600 md:px-12 p-2">
					<div
						class="absolute h-full w-full top-0 left-0 bg-no-repeat bg-bottom blur opacity-10"
						style="background-image: url('/u/{data.user.info.id}/cover');"
					></div>
					<div
						class="md:absolute md:-top-[55px] w-14 h-14 md:w-32 md:h-32 bg-surface-600 rounded-[30%] overflow-hidden shadow-[0_2px_5px_1px_rgba(0,0,0,0.4)]"
					>
						<img
							class="w-14 h-14 md:w-32 md:h-32"
							src="{avatarUrl}/{data.user.info.id}"
							alt="playerProfile"
						/>
					</div>
					<div class="flex flex-col my-auto gap-1 md:gap-2 ms-2 md:ms-36 z-[5]">
						<div class="flex flex-row items-center gap-1 text-xl md:text-2xl">
							{#if clan}
								<a
									class="chip variant-soft-primary hover:variant-filled-primary"
									href="/clan/{clan.id}">{clan.tag}</a
								>
							{/if}

							{data.user.info.name}
						</div>
						<div class="flex flex-row md:gap-2">
							<Popup placement="top">
								<img
									class="w-5 md:w-8"
									src="/flags/{data.user.info.country.toUpperCase()}.png"
									alt="country flag"
								/>
								<svelte:fragment slot="popup">
									<div class="card p-2 px-4 rounded-lg variant-filled-surface text-sm">
										{getCountryName(data.user.info.country)}
										<div
											class="arrow border-r border-b border-gray-700 variant-filled-surface"
										></div>
									</div>
								</svelte:fragment>
							</Popup>
							<span class="hidden md:block">{getCountryName(data.user.info.country)}</span>
						</div>
					</div>
					<div class="ms-auto flex flex-row items-center gap-5">
						<div class="flex flex-col font-semibold text-xs text-end">
							<Popup placement="top">
								<div
									class="hidden md:block relative h-2 w-24 lg:w-52 bg-gray-950 rounded-lg border border-surface-700"
								>
									<div
										class="bg-gradient-to-r from-primary-400 to-primary-600 h-full rounded-lg"
										style="width: {$levelProgress}%;"
									></div>
									<div class="absolute mt-[2px] top-[100%] right-0">
										{Math.trunc($levelProgress)}%
									</div>
								</div>
								<svelte:fragment slot="popup">
									<div class="card p-2 px-4 rounded-lg variant-filled-surface font-normal text-xs">
										progress to next level
										<div
											class="arrow border-r border-b border-gray-700 variant-filled-surface"
										></div>
									</div>
								</svelte:fragment>
							</Popup>
						</div>
						<div class="relative inline-flex items-center justify-center h-[50px] w-[50px]">
							<div
								class="absolute w-full h-full level-icon bg-gradient-to-b from-surface-100 to-surface-400"
							></div>
							<span class="absolute text-[20px] font-semibold">{$level}</span>
						</div>
					</div>
				</div>
				<div class="p-3 md:p-0 bg-surface-800">
					<div class="flex flex-col md:flex-row justify-between gap-10">
						<!-- left side -->
						<div class="w-full flex md:ms-12 flex-col justify-around gap-1">
							<div class="w-full flex flex-row justify-around md:justify-normal gap-10">
								<div class="flex flex-col w-[50%] md:w-fit">
									<span class="text-xs">Global Ranking</span>
									<span class="text-xl md:text-3xl font-semibold text-primary-200"
										>#{$globalRank}</span
									>
								</div>
								<div class="flex flex-col w-[50%] md:w-fit">
									<span class="text-xs">Country Ranking</span>
									<span class="text-xl md:text-3xl font-semibold text-primary-200"
										>#{$countryRank}</span
									>
								</div>
							</div>

							<div
								class="w-full flex flex-col md:flex-row justify-around items-center md:items-end md:justify-normal gap-10"
							>
								<div class="w-full flex flex-row justify-around md:justify-normal gap-10">
									<div class="flex flex-col w-[50%] md:w-fit">
										<span class="text-xs">Performance Points</span>
										<span class="text-normal font-semibold text-primary-200"
											>{numberHumanReadable($performancePoints)}</span
										>
									</div>
									<div class="flex flex-col w-[50%] md:w-fit">
										<span class="text-xs">Total Play Time</span>
										<span class="text-normal font-semibold text-primary-200"
											>{secondsToDHM($playTime)}</span
										>
									</div>
								</div>
								<div class="flex flex-row gap-8 md:ms-auto">
									<div class="flex flex-col items-center justify-center">
										<span class="text-2xl font-semibold grade grade-xh">SS</span>
										<span class="text-xs">{numberHumanReadable($xhGrade)}</span>
									</div>
									<div class="flex flex-col items-center justify-center">
										<span class="text-2xl font-semibold grade grade-x">S</span>
										<span class="text-xs">{numberHumanReadable($xGrade)}</span>
									</div>
									<div class="flex flex-col items-center justify-center">
										<span class="text-2xl font-semibold grade grade-sh">SS</span>
										<span class="text-xs">{numberHumanReadable($shGrade)}</span>
									</div>
									<div class="flex flex-col items-center justify-center">
										<span class="text-2xl font-semibold grade grade-a">A</span>
										<span class="text-xs">{numberHumanReadable($aGrade)}</span>
									</div>
								</div>
							</div>
						</div>

						<!-- right side -->
						<div class="p-3 md:mr-6 grid grid-cols-2 gap-[4px_100px] text-xs font-semibold">
							<dl class="contents drop-shadow-[0_0_2px_rgba(0,0,0,1)]">
								<dt class="w-max">Joined</dt>
								<dd
									class="tooltip"
									aria-label={new Date(data.user.info.creation_time * 1000).toUTCString()}
								>
									{getTimeAgo(new Date(data.user.info.creation_time * 1000))}
								</dd>
							</dl>
							<dl class="contents drop-shadow-[0_0_2px_rgba(0,0,0,1)]">
								<dt class="w-max">Latest Activity</dt>
								<dd
									class="tooltip"
									aria-label={new Date(data.user.info.latest_activity * 1000).toUTCString()}
								>
									{getTimeAgo(new Date(data.user.info.latest_activity * 1000))}
								</dd>
							</dl>
							<dl class="contents drop-shadow-[0_0_2px_rgba(0,0,0,1)]">
								<dt class="w-max">Ranked Score</dt>
								<dd>{numberHumanReadable($rankedScore)}</dd>
							</dl>
							<dl class="contents">
								<dt class="w-max">Hit Accuracy</dt>
								<dd>{removeTrailingZeroes($hitAccuracy)}%</dd>
							</dl>
							<dl class="contents">
								<dt class="w-max">Play Count</dt>
								<dd>{$playCount}</dd>
							</dl>
							<dl class="contents">
								<dt class="w-max">Total Score</dt>
								<dd>{numberHumanReadable($totalScore)}</dd>
							</dl>
							<dl class="contents">
								<dt class="w-max">Maximum Combo</dt>
								<dd>{numberHumanReadable($maxCombo)}</dd>
							</dl>
							<dl class="contents">
								<dt class="w-max">Replays Watched by Others</dt>
								<dd>{numberHumanReadable($replayViews)}</dd>
							</dl>
						</div>
					</div>
				</div>
				<div class="flex flex-row-reverse bg-surface-800 p-7 py-2">
					<div class="card !bg-surface-700 w-full py-3 p-6">
						<div class="flex flex-col gap-5">
							<p
								class="text-lg font-bold underline underline-offset-4 decoration-2 decoration-primary-400"
							>
								Ranks
							</p>
							<div class="relative flex flex-col gap-5">
								<div class="relative flex flex-col gap-1">
									<p
										class="text-sm font-bold w-max ms-2 before:-ms-2 before:content-[''] before:h-[.65em] before:mt-[.45em] before:absolute before:w-[3px] before:rounded-lg before:bg-primary-400"
									>
										Best Performance
									</p>
									<div class="flex flex-col gap-1">
										<div
											class="flex flex-col gap-1 transition-all{loading
												? ' blur-sm'
												: ' blur-none'}"
										>
											<UserScores scores={bestScores} {currentMode} {currentType} />
										</div>
										<button
											class="flex flex-row text-center justify-center items-center btn w-48 mx-auto variant-filled-surface px-4 py-1 mt-2 text-[0.7rem] leading-5"
											on:click={loadMoreBestScores}
											disabled={loading || !bestScores}
										>
											{#if loading || !bestScores}
												<div>
													<ProgressRadial width="w-5" />
												</div>
											{:else}
												<ChevronDown class="pointer-events-none text-surface-400" size={16} />
												<span class="uppercase font-semibold">show more</span>
												<ChevronDown class="pointer-events-none text-surface-400" size={16} />
											{/if}
										</button>
									</div>
								</div>

								<div class="relative flex flex-col gap-1">
									<p
										class="text-sm font-bold w-max ms-2 before:-ms-2 before:content-[''] before:h-[.65em] before:mt-[.45em] before:absolute before:w-[3px] before:rounded-lg before:bg-primary-400"
									>
										Recent
									</p>
									<div class="flex flex-col gap-1">
										<div
											class="flex flex-col gap-1 transition-all{loading
												? ' blur-sm'
												: ' blur-none'}"
										>
											<UserScores scores={recentScores} {currentMode} {currentType} />
										</div>
										<button
											class="flex flex-row text-center justify-center items-center btn w-48 mx-auto variant-filled-surface px-4 py-1 mt-2 text-[0.7rem] leading-5"
											on:click={loadMoreRecentScores}
											disabled={loading || !recentScores}
										>
											{#if loading || !recentScores}
												<div>
													<ProgressRadial width="w-5" />
												</div>
											{:else}
												<ChevronDown class="pointer-events-none text-surface-400" size={16} />
												<span class="uppercase font-semibold">show more</span>
												<ChevronDown class="pointer-events-none text-surface-400" size={16} />
											{/if}
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="p-2 bg-surface-700"></div>
			</div>
		</div>
	{:else}
		<div class="mx-auto card p-6 py-12">
			<div
				class="w-full flex flex-col lg:divide-x divide-surface-500 lg:flex-row items-center justify-around gap-5 lg:gap-2"
			>
				<div class="flex flex-col items-center justify-center">
					<p class="text-4xl">404</p>
					<p class="text-xl">User Profile not found.</p>
				</div>
				<div class="flex flex-col items-center lg:items-start justify-normal lg:ps-20 gap-2">
					<p class="text-lg font-semibold underline underline-offset-2">
						There are a few possible reasons for this:
					</p>
					<ul class="list-disc ms-5">
						<li>They may have changed their username</li>
						<li>The account may be temporarily unavailable due to security or abuse issues</li>
						<li>You may have made a typo!</li>
					</ul>
					<a class="mx-auto mt-10 btn variant-filled-surface" href="/">Back to Home</a>
				</div>
			</div>
		</div>
	{/if}
</div>
