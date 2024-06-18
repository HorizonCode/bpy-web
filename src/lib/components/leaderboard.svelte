<script lang="ts">
	import { goto } from '$app/navigation';
	import { avatarUrl } from '$lib/env';
	import { numberHumanReadable, abbreviateNumber } from '$lib/stringUtil';
	import type { LBUser } from '$lib/types';
	import { scale } from 'svelte/transition';
	import { removeClanTag, removeTrailingZeroes } from '$lib/regex';
	import { getCountryName } from '$lib/country';
	import { __ } from '$lib/language';
	import { userLanguage } from '$lib/storage';
	import Popup from './Popup.svelte';
	import Flag from './Flag.svelte';

	export let leaderboardData: LBUser[];
	export let page: number;
	export let usersPerPage: number;
	export let currentMode: string;
	export let currentType: string;
	export let currentSort: 'acc' | 'pp' | 'plays' | 'tscore' | string;
</script>

<div class="table-container table-extracompact !rounded-none px-5 pb-3">
	<table
		class="table !rounded-none"
		style="border-collapse: separate !important; border-spacing: 0 3px !important;"
	>
		<thead class="!bg-transparent">
			<tr class="text-center">
				<th class="!pb-0"></th>
				<th class="!pb-0"></th>
				<th class="text-center text-sm text-surface-300 !font-semibold !pb-0">{__("Accuracy", $userLanguage)}</th>
				<th
					class="text-center text-sm {currentSort == 'plays'
						? 'text-surface-50'
						: 'text-surface-300'} !font-semibold !pb-0">{__("Play Count", $userLanguage)}</th
				>
				<th
					class="text-center text-sm {currentSort != 'plays'
						? 'text-surface-50'
						: 'text-surface-300'} !font-semibold !pb-0"
				>
					{#if currentSort == 'tscore'}
						{__("Total Score", $userLanguage)}
					{:else}
						{__("PP", $userLanguage)}
					{/if}
				</th>
				<th class="text-center text-sm text-surface-300 !font-semibold !pb-0">SS</th>
				<th class="text-center text-sm text-surface-300 !font-semibold !pb-0">S</th>
				<th class="text-center text-sm text-surface-300 !font-semibold !pb-0">A</th>
			</tr>
		</thead>
		<tbody>
			{#each leaderboardData as user, rank}
				<tr
					class="!bg-surface-700 hover:!bg-surface-600 transition-colors"
					transition:scale={{ delay: 20 * rank, duration: 100, start: 0.99 }}
				>
					<td
						class="!text-xs text-center table-cell-fit content-center w-[1%] whitespace-nowrap !rounded-s-lg"
						>#{rank + (page - 1) * usersPerPage + 1}</td
					>
					<td class="flex flex-row gap-2 items-center content-center">
						<Flag country={user.country} size={15} tooltip={true}></Flag>
						{#if user.clan_tag}
							<a
								class="chip !text-xs p-1.5 py-0.5 min-w-7 variant-soft-primary hover:variant-filled-primary"
								href="/clan/{user.clan_id}"
							>
								{user.clan_tag}
							</a>
						{/if}
						<a
							href="/u/{user.player_id}?mode=${currentMode}&type=${currentType}"
							class="text-xs text-primary-400 font-semibold">{user.name}</a
						>
					</td>
					<td class="!text-xs text-center w-[10%] text-surface-300 whitespace-nowrap content-center"
						>{removeTrailingZeroes(user.acc)}%</td
					>
					{#key user}
						<td
							class="!text-xs text-center w-[10%] {currentSort == 'plays'
								? 'text-surface-50'
								: 'text-surface-300'} whitespace-nowrap content-center"
							>{numberHumanReadable(user.plays)}</td
						>
						<td
							class="!text-xs text-center w-[10%] {currentSort != 'plays'
								? 'text-surface-50'
								: 'text-surface-300'} whitespace-nowrap content-center"
						>
							{#if currentSort == 'tscore'}
								{numberHumanReadable(user.tscore)}
							{:else}
								{numberHumanReadable(user.pp)}
							{/if}
						</td>
					{/key}
					<td class="!text-xs text-center w-[5%] text-surface-300 whitespace-nowrap content-center"
						>{numberHumanReadable(user.x_count + user.xh_count)}</td
					>
					<td class="!text-xs text-center w-[5%] text-surface-300 whitespace-nowrap content-center"
						>{numberHumanReadable(user.s_count + user.sh_count)}</td
					>
					<td
						class="!text-xs text-center w-[5%] text-surface-300 whitespace-nowrap content-center !rounded-e-lg"
						>{numberHumanReadable(user.a_count)}</td
					>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style>
	.table-extracompact tbody td {
		padding-top: 0.35rem !important;
		padding-bottom: 0.35rem !important;
	}
</style>
