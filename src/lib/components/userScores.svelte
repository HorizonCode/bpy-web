<script lang="ts">
	import { goto } from '$app/navigation';
	import { getPlayerScores } from '$lib/api';
	import { parseModsInt } from '$lib/mods';
	import { removeTrailingZeroes } from '$lib/regex';
	import { getTimeAgo } from '$lib/time';
	import { type PlayerScores } from '$lib/types';
	import { ProgressRadial } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import { ChevronDown, Download, MoreVertical } from 'svelte-feathers';
	import Popup from './Popup.svelte';
	import { apiUrl } from '$lib/env';
	import { __ } from '$lib/language';
	import { userLanguage } from '$lib/storage';
	import TimeAgo from './TimeAgo.svelte';
	import { fly, scale } from 'svelte/transition';

	export let title: string;
	export let userId: number;
	export let scoresType: 'best' | 'recent';
	export let scoreAmount: number;
	export let currentMode: string;
	export let currentType: string;

	let scores: PlayerScores | undefined;
	let loading = false;
	let amount = 0;

	const loadMoreScores = async () => {
		if (loading) return;
		loading = true;

		amount += scoreAmount;

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

		const recentScoresRequest = await getPlayerScores({
			userId: userId,
			limit: amount,
			offset: 0,
			mode: mode,
			scope: scoresType
		});
		if (recentScoresRequest) scores = recentScoresRequest;
		loading = false;
	};

	onMount(loadMoreScores);
</script>

<div class="relative flex flex-col gap-1">
	<p
		class="text-sm font-bold w-max ms-2 before:-ms-2 before:content-[''] before:h-[.65em] before:mt-[.45em] before:absolute before:w-[3px] before:rounded-lg before:bg-primary-400"
	>
		{title}
	</p>
	<div class="flex flex-col gap-1">
		<div class="flex flex-col gap-1 transition-all{loading ? ' blur-sm' : ' blur-none'}">
			{#if scores}
				{#each scores.scores as score, idx}
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<!-- svelte-ignore a11y-no-static-element-interactions -->
					<div class="flex flex-row gap-2">
						<div
							class="relative w-full flex flex-col md:flex-row items-stretch md:items-center justify-between gap-1 p-2 py-1 bg-surface-500 rounded-lg hover:scale-[1.005] active:scale-[0.995] transition-transform cursor-pointer"
							on:click={() =>
								goto(`/beatmaps/${score.beatmap.id}?mode=${currentMode}&type=${currentType}`)}
							transition:scale={{ start: 0.99, duration: 200 * (idx - (amount - scoreAmount) + 1) }}
						>
							<div
								class="absolute h-full w-full top-0 left-0 bg-no-repeat bg-center blur-[3px] opacity-5"
								style="background-image: url('https://assets.ppy.sh/beatmaps/{score.beatmap
									.set_id}/covers/cover@2x.jpg');"
							></div>
							<div class="flex flex-row gap-2 items-center justify-start z-10 truncate">
								<div
									class="w-10 md:w-8 text-center !text-4xl md:!text-2xl font-bold grade grade-{score.grade.toLowerCase()}"
								>
									{score.grade.replaceAll('XH', 'SS').replaceAll('X', 'SS').replaceAll('SH', 'S')}
								</div>
								<div class="flex flex-col">
									<div class="flex flex-col md:flex-row md:items-center md:gap-1 mb-1">
										<div class="text-sm font-bold">{score.beatmap.title}</div>
										<div class="text-xs font-semibold">by {score.beatmap.artist}</div>
									</div>
									<div class="flex flex-row gap-4">
										<span class="text-xs font-semibold text-yellow-600"
											>{score.beatmap.version}</span
										>
										<div
											class="text-xs font-semibold text-surface-400 tooltip"
											aria-label={new Date(score.play_time).toUTCString()}
										>
											<TimeAgo language={$userLanguage} date={new Date(score.play_time)} />
										</div>
									</div>
								</div>
							</div>
							<div
								class="flex flex-col md:flex-row gap-1 md:justify-start items-center mt-2 md:mt-0 md:items-center"
							>
								<div class="flex flex-row gap-1 items-center">
									{#each parseModsInt(score.mods) as mod}
										<div class="tooltip" aria-label={mod.name}>
											<img
												src="/mods/{mod.short_name.toLowerCase()}.png"
												class="w-8 h-6"
												alt={mod.name}
											/>
										</div>
									{/each}
								</div>
								<div class="flex flex-col items-center md:items-start ms-3">
									<div class="flex flex-row gap-3">
										<span class="min-w-12 text-sm font-bold text-yellow-500"
											>{removeTrailingZeroes(score.acc)}%</span
										>
										<span class="min-w-12 text-sm font-bold"
											>{Math.round(score.pp * Math.pow(0.95, idx))}pp</span
										>
									</div>
									<span class="text-xs font-semibold">
										{__('weighted {{val}}%', $userLanguage, {
											val: Math.round(Math.pow(0.95, idx) * 100)
										})}
									</span>
								</div>
								<div
									class="min-w-[80px] flex flex-row items-center justify-center text-primary-400 py-1 font-bold bg-black/50 rounded-lg"
								>
									{Math.round(score.pp)}<span class="text-primary-300 text-xs">pp</span>
								</div>
							</div>
						</div>

						<Popup event="click" placement="top">
							<button
								class="hidden md:flex btn variant-soft-surface cursor-pointer rounded-lg p-2 px-3 justify-center items-center"
								disabled={score.status <= 0}
							>
								<MoreVertical class="pointer-events-none" />
							</button>
							<svelte:fragment slot="popup">
								{#if score.status > 0}
									<div
										class="card variant-filled-surface !bg-surface-600 p-2 z-[9999] text-sm rounded-lg"
									>
										<a
											class="btn variant-filled-surface text-sm rounded-lg"
											href="{apiUrl}/get_replay?id={score.id}"
										>
											<Download class="pointer-events-none mr-2" size={16} />
											{__('Download Replay', $userLanguage)}
										</a>
									</div>
									<div class="arrow border-r border-b border-gray-700 !bg-surface-600"></div>
								{/if}
							</svelte:fragment>
						</Popup>
					</div>
				{/each}
			{/if}
		</div>
		<button
			class="flex flex-row text-center justify-center items-center btn w-48 mx-auto variant-filled-surface px-4 py-1 mt-2 text-[0.7rem] leading-5"
			on:click={loadMoreScores}
			disabled={loading || !scores}
		>
			{#if loading || !scores}
				<div>
					<ProgressRadial width="w-5" />
				</div>
			{:else}
				<ChevronDown class="pointer-events-none text-surface-400" size={16} />
				<span class="uppercase font-semibold">{__('show more', $userLanguage)}</span>
				<ChevronDown class="pointer-events-none text-surface-400" size={16} />
			{/if}
		</button>
	</div>
</div>
