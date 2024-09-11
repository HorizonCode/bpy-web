<script lang="ts">
	import { numberHumanReadable } from '$lib/stringUtil';
	import type { LBUser } from '$lib/types';
	import { scale, fade } from 'svelte/transition';
	import { removeTrailingZeroes } from '$lib/regex';
	import { __ } from '$lib/language';
	import { userLanguage } from '$lib/storage';
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
			<tr>
				<th class="!pb-0"></th>
				<th class="!pb-0"></th>
				<th class="text-center uppercase text-2xs text-surface-300 font-bold !pb-0"
					>{__('Accuracy', $userLanguage)}</th
				>
				<th
					class="text-center uppercase text-2xs {currentSort == 'plays'
						? 'text-surface-50'
						: 'text-surface-300'} font-bold !pb-0">{__('Play Count', $userLanguage)}</th
				>
				<th
					class="text-center text-2xs {currentSort != 'plays'
						? 'text-surface-50'
						: 'text-surface-300'} !font-bold uppercase !pb-0"
				>
					{#if currentSort == 'tscore'}
						{__('Total Score', $userLanguage)}
					{:else}
						{__('PP', $userLanguage)}
					{/if}
				</th>
				<th class="text-center text-2xs font-bold text-surface-300 !pb-0">SS</th>
				<th class="text-center text-2xs font-bold text-surface-300 !pb-0">S</th>
				<th class="text-center text-2xs font-bold text-surface-300 !pb-0">A</th>
			</tr>
		</thead>
		{#key leaderboardData}
			<tbody>
				{#if leaderboardData && leaderboardData.length > 0}
					{#each leaderboardData as user, rank}
						{#key user}
							<tr class="!bg-surface-700 hover:!bg-surface-600 transition-colors h-8">
								<td
									class="!text-xs !font-semibold text-center table-cell-fit content-center w-[1%] whitespace-nowrap !rounded-s-lg"
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
									{#key user}
										<a
											href="/u/{user.player_id}?mode=${currentMode}&type=${currentType}"
											class="text-xs text-primary-400 font-semibold"
										>
											{user.name}
										</a>
									{/key}
								</td>
								<td
									class="!text-xs font-semibold text-center w-[10%] text-surface-300 whitespace-nowrap content-center"
									>{removeTrailingZeroes(user.acc)}%</td
								>
								{#key user}
									<td
										class="!text-xs font-semibold text-center w-[8%] {currentSort == 'plays'
											? 'text-surface-50'
											: 'text-surface-300'} whitespace-nowrap content-center"
										>{numberHumanReadable(user.plays)}</td
									>
									<td
										class="!text-xs font-semibold text-center w-[10%] {currentSort != 'plays'
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
								<td
									class="!text-xs font-semibold text-center w-[5%] text-surface-300 whitespace-nowrap content-center"
									>{numberHumanReadable(user.x_count + user.xh_count)}</td
								>
								<td
									class="!text-xs font-semibold text-center w-[5%] text-surface-300 whitespace-nowrap content-center"
									>{numberHumanReadable(user.s_count + user.sh_count)}</td
								>
								<td
									class="!text-xs font-semibold text-center w-[5%] text-surface-300 whitespace-nowrap content-center !rounded-e-lg"
									>{numberHumanReadable(user.a_count)}</td
								>
							</tr>
						{/key}
					{/each}
				{:else}
					{#each Array(50) as _, i}
						{#key i}
							<tr
								class="!bg-surface-700 hover:!bg-surface-600 transition-colors h-8"
								in:fade={{ duration: 200, delay: 0 }}
								out:fade={{ duration: 200, delay: 0 }}
							>
								<td
									class="!text-xs !font-semibold text-center table-cell-fit content-center w-[1%] whitespace-nowrap !rounded-s-lg"
									>#{i + (page - 1) * usersPerPage + 1}</td
								>
								<td class="flex flex-row gap-2 items-center content-center">
									<div class="h-4 w-6 rounded bg-gray-400 animate-pulse"></div>
									<div class="h-3 w-28 bg-gray-400 animate-pulse rounded"></div>
								</td>
								<td
									class="!text-xs font-semibold text-center w-[10%] text-surface-300 whitespace-nowrap content-center"
								>
									<div class="h-3 w-10 mx-auto bg-gray-400 animate-pulse rounded"></div>
								</td>
								<td
									class="!text-xs font-semibold text-center w-[8%] {currentSort == 'plays'
										? 'text-surface-50'
										: 'text-surface-300'} whitespace-nowrap content-center"
								>
									<div class="h-3 w-8 mx-auto bg-gray-400 animate-pulse rounded"></div>
								</td>
								<td
									class="!text-xs font-semibold text-center w-[10%] {currentSort != 'plays'
										? 'text-surface-50'
										: 'text-surface-300'} whitespace-nowrap content-center"
								>
									<div class="h-3 w-8 mx-auto bg-gray-400 animate-pulse rounded"></div>
								</td>
								<td
									class="!text-xs font-semibold text-center w-[5%] text-surface-300 whitespace-nowrap content-center"
								>
									<div class="h-3 w-6 mx-auto bg-gray-400 animate-pulse rounded"></div>
								</td>
								<td
									class="!text-xs font-semibold text-center w-[5%] text-surface-300 whitespace-nowrap content-center"
									><div class="h-3 w-6 mx-auto bg-gray-400 animate-pulse rounded"></div></td
								>
								<td
									class="!text-xs font-semibold text-center w-[5%] text-surface-300 whitespace-nowrap content-center !rounded-e-lg"
									><div class="h-3 w-6 mx-auto bg-gray-400 animate-pulse rounded"></div></td
								>
							</tr>
						{/key}
					{/each}
				{/if}
			</tbody>
		{/key}
	</table>
</div>

<style>
	.table-extracompact tbody td {
		padding-top: 0.35rem !important;
		padding-bottom: 0.35rem !important;
	}
</style>
