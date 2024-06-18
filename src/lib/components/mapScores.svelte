<script lang="ts">
	import { numberHumanReadable } from '$lib/stringUtil';
	import type { MapScore } from '$lib/types';
	import { scale } from 'svelte/transition';
	import { removeTrailingZeroes } from '$lib/regex';
	import Frown from 'svelte-feathers/Frown.svelte';
	import Loader from 'svelte-feathers/Loader.svelte';
	import { getTimeSince } from '$lib/time';
	import { parseModsInt } from '$lib/mods';
	import { __ } from '$lib/language';
	import { userLanguage } from '$lib/storage';
	import Flag from './Flag.svelte';
	import Mod from './Mod.svelte';
	import Popup from './Popup.svelte';

	export let beatmapScores: MapScore[];
	export let loading: boolean;
	export let currentMode: string;
	export let currentType: string;
</script>

{#if beatmapScores.length > 0}
	{#if !loading}
		<div
			class="table-container table-extracompact !rounded-none px-5 pb-3"
			transition:scale={{ duration: 200, start: 0.99 }}
		>
			<table
				class="table !rounded-none"
				style="border-collapse: separate !important; border-spacing: 0 3px !important;"
			>
				<thead class="!bg-transparent">
					<tr>
						<td class="text-2xs text-surface-300 font-bold uppercase !pb-0 pt-2"
							>{__('Rank', $userLanguage)}</td
						>
						<td class="text-2xs text-surface-300 !pb-0"></td>
						<td class="text-2xs text-surface-300 font-bold uppercase !pb-0 pt-2"
							>{__('Score', $userLanguage)}</td
						>
						<td class="text-2xs text-surface-300 font-bold uppercase !pb-0 pt-2"
							>{__('Accuracy', $userLanguage)}</td
						>
						<td class="text-2xs text-surface-300 !pb-0"></td>
						<td class="text-2xs text-surface-300 font-bold uppercase !pb-0 pt-2"
							>{__('Player', $userLanguage)}</td
						>
						<td class="text-2xs text-surface-300 font-bold uppercase !pb-0 pt-2"
							>{__('Max Combo', $userLanguage)}</td
						>
						<td class="text-2xs text-surface-300 font-bold uppercase !pb-0 pt-2">300</td>
						<td class="text-2xs text-surface-300 font-bold uppercase !pb-0 pt-2">100</td>
						<td class="text-2xs text-surface-300 font-bold uppercase !pb-0 pt-2">50</td>
						<td class="text-2xs text-surface-300 font-bold uppercase !pb-0 pt-2"
							>{__('Miss', $userLanguage)}</td
						>
						<td class="text-2xs text-surface-300 font-bold uppercase !pb-0 pt-2"
							>{__('PP', $userLanguage)}</td
						>
						<td class="text-2xs text-surface-300 font-bold uppercase !pb-0 pt-2"
							>{__('Time', $userLanguage)}</td
						>
						<td class="text-2xs text-surface-300 font-bold uppercase !pb-0 pt-2"
							>{__('Mods', $userLanguage)}</td
						>
					</tr>
				</thead>
				<tbody>
					{#each beatmapScores as score, rank}
						<tr class="!bg-surface-700 hover:!bg-surface-600 transition-colors">
							<td
								class="!text-xs font-bold text-center table-cell-fit content-center w-[1%] whitespace-nowrap !rounded-s-lg"
								>#{rank + 1}</td
							>
							<td
								class="!text-sm !font-semibold w-[3%] whitespace-nowrap content-center text-center grade grade-{score.grade.toLowerCase()}"
								>{score.grade}</td
							>
							<td
								class="w-[1%] whitespace-nowrap !text-xs {rank == 0
									? 'font-bold'
									: 'font-semibold'} content-center">{numberHumanReadable(score.score)}</td
							>
							<td class="w-[1%] whitespace-nowrap !text-xs font-semibold content-center"
								>{removeTrailingZeroes(score.acc)}%</td
							>
							<td class="w-[1%] !px-0 whitespace-nowrap content-center text-end"
								><Flag country={score.country} size={12} tooltip={true}></Flag></td
							>
							<td class="!text-xs content-center"
								><a
									class="text-primary-400 font-semibold"
									href="/u/{score.userid}?mode=${currentMode}&type=${currentType}"
									>{score.player_name}</a
								></td
							>
							<td
								class="w-[10%] whitespace-nowrap !text-xs !font-semibold {score.perfect
									? 'text-lime-400 '
									: ''}content-center">{score.max_combo}x</td
							>
							<td
								class="w-[1%] whitespace-nowrap !text-xs !font-semibold content-center {score.n300 <=
								0
									? 'text-surface-400'
									: ''}">{score.n300}</td
							>
							<td
								class="w-[1%] whitespace-nowrap !text-xs !font-semibold content-center {score.n100 <=
								0
									? 'text-surface-400'
									: ''}">{score.n100}</td
							>
							<td
								class="w-[1%] whitespace-nowrap !text-xs !font-semibold content-center {score.n50 <=
								0
									? 'text-surface-400'
									: ''}">{score.n50}</td
							>
							<td
								class="w-[1%] whitespace-nowrap !text-xs !font-semibold content-center {score.nmiss <=
								0
									? 'text-surface-400'
									: ''}">{score.nmiss}</td
							>
							<td class="w-[1%] whitespace-nowrap !text-xs !font-semibold content-center">
								<Popup>
									{Math.round(score.pp)}
									<svelte:fragment slot="popup">
										<div
											class="flex flex-col gap-2 card variant-filled-surface p-2 rounded-lg text-xs"
										>
											{score.pp}
										</div>
									</svelte:fragment>
								</Popup>
							</td>
							<td class="w-[1%] whitespace-nowrap !text-xs !font-semibold content-center">
								<Popup>
									{getTimeSince(new Date(score.play_time))}
									<svelte:fragment slot="popup">
										<div class="flex flex-col gap-2 card variant-filled-surface p-2 rounded-lg">
											{new Date(score.play_time).toUTCString()}
										</div>
									</svelte:fragment>
								</Popup>
							</td>
							<td class="w-[1%] whitespace-nowrap !rounded-e-lg content-center text-start">
								<div class="flex flex-row gap-0.5">
									{#each parseModsInt(score.mods) as mod}
										<Mod {mod} size={18} tooltip={true}></Mod>
									{/each}
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
{:else}
	<div
		class="p-4 m-2 bg-surface-500 text-lg rounded-lg shadow"
		transition:scale={{ duration: 200, start: 0.99 }}
	>
		{#key loading}
			<div class="flex flex-row items-center justify-center gap-2">
				{#if loading}
					<Loader class="pointer-events-none animate-spin"></Loader>
					{__('Loading Scores...', $userLanguage)}
				{:else}
					<Frown class="pointer-events-none"></Frown>
					{__('No Scores found.', $userLanguage)}
				{/if}
			</div>
		{/key}
	</div>
{/if}

<style>
	.table thead td {
		padding-left: 0.75rem;
		padding-right: 0.75rem;
	}
	.table-extracompact tbody td {
		padding-top: 0.35rem !important;
		padding-bottom: 0.35rem !important;
	}
</style>
