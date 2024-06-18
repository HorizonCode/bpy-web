<script lang="ts">
	import { goto } from '$app/navigation';
	import { getPlayerMostPlayed } from '$lib/api';
	import { type PlayerMostPlayed } from '$lib/types';
	import { ProgressRadial } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import ChevronDown from 'svelte-feathers/ChevronDown.svelte';
	import Play from 'svelte-feathers/Play.svelte';
	import { __ } from '$lib/language';
	import { userLanguage } from '$lib/storage';
	import { scale } from 'svelte/transition';

	export let title: string;
	export let userId: number;
	export let scoreAmount: number;
	export let currentMode: string;
	export let currentType: string;

	let scores: PlayerMostPlayed | undefined;
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

		const mostPlayed = await getPlayerMostPlayed({
			userId: userId,
			limit: amount,
			mode: mode
		});
		if (mostPlayed) scores = mostPlayed;
		loading = false;
	};

	onMount(loadMoreScores);
</script>

<div class="relative flex flex-col gap-1">
	<p
		class="text-sm font-bold w-max ms-2 before:-ms-2 before:content-[''] before:h-[.65em] before:mt-[.45em] before:absolute before:w-[3px] before:rounded-lg before:bg-primary-400"
	>
		{__(title, $userLanguage)}
	</p>
	<div class="flex flex-col gap-1">
		<div class="flex flex-col gap-1 transition-all{loading ? ' blur-sm' : ' blur-none'}">
			{#if scores}
				{#each scores.maps as score, idx}
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<!-- svelte-ignore a11y-no-static-element-interactions -->
					<div class="flex flex-row gap-2">
						<div
							class="relative w-full flex flex-col md:flex-row items-stretch md:items-center justify-between gap-1 p-2 py-1 bg-surface-500 rounded-lg hover:scale-[1.005] active:scale-[0.995] transition-transform cursor-pointer"
							on:click={() => goto(`/beatmaps/${score.id}?mode=${currentMode}&type=${currentType}`)}
							transition:scale={{ start: 0.99, duration: 200 * (idx - (amount - scoreAmount) + 1) }}
						>
							<div
								class="absolute h-full w-full top-0 left-0 bg-no-repeat bg-center blur-[3px] opacity-5"
								style="background-image: url('https://assets.ppy.sh/beatmaps/{score.set_id}/covers/cover@2x.jpg');"
							></div>
							<div class="flex flex-row gap-2 items-center justify-start z-10 truncate">
								<img
									class="h-10 w-14 bg-surface-700 rounded-lg shadow"
									src="https://b.ppy.sh/thumb/{score.set_id}l.jpg?{Date.now() / 1000}"
									alt="beatmap"
								/>
								<div class="flex flex-col">
									<div class="flex flex-col md:flex-row md:items-center md:gap-1 mb-1">
										<div class="text-sm font-bold">{score.title}</div>
										<div class="text-xs font-semibold">by {score.artist}</div>
									</div>
									<div class="flex flex-row gap-4">
										<span class="text-xs font-semibold text-yellow-600">{score.version}</span>
									</div>
								</div>
							</div>
							<div
								class="flex flex-row gap-1 font-xl font-semibold px-3 items-center justify-center mt-2 md:mt-0 text-amber-400 py-2"
							>
								<Play class="pointer-events-none" />
								{score.plays}
							</div>
						</div>
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
