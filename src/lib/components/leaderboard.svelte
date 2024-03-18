<script lang="ts">
	import { goto } from '$app/navigation';
	import { avatarUrl } from '$lib/env';
	import { numberHumanReadable } from '$lib/stringUtil';
	import type { LBUser } from '$lib/types';
	import { scale } from 'svelte/transition';
	import { removeClanTag } from '$lib/regex';
	import { getCountryName } from '$lib/country';

	export let leaderboardData: LBUser[];
	export let page: number;
	export let usersPerPage: number;
	export let currentMode: string;
	export let currentType: string;
</script>

<div class="w-full flex flex-col flex-wrap gap-1 p-3 overflow-auto">
	<div class="flex flex-row items-center justify-between gap-2 py-1 px-2 text-sm">
		<!-- is needed to force the data to update because of the transition -->
		<div class="flex flex-row items-center gap-2"></div>
		<div class="flex flex-row text-center items-center gap-1">
			<!-- right side of the leaderboard entry-->
			<div class="min-w-20 text-center font-bold text-xs text-surface-300">Accuracy</div>
			<div class="min-w-16 text-center font-bold text-xs text-surface-300">Play Count</div>
			<div class="min-w-12 text-center font-bold text-xs text-white">PP</div>
			<div class="min-w-8 text-center font-bold text-xs text-surface-300">SS</div>
			<div class="min-w-8 text-center font-bold text-xs text-surface-300">S</div>
			<div class="min-w-8 text-center font-bold text-xs text-surface-300">A</div>
		</div>
	</div>
	{#each leaderboardData as user, rank}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div
			class="flex flex-row items-center justify-between gap-2 p-2 hover:scale-[1.005] active:scale-[0.995] transition-transform cursor-pointer bg-surface-500 text-sm rounded-lg shadow"
			on:click={() => goto(`/u/${user.player_id}?mode=${currentMode}&type=${currentType}`)}
			transition:scale={{ delay: 20 * rank, duration: 100, start: 0.99 }}
		>
			{#key user}
				<!-- is needed to force the data to update because of the transition -->
				<div class="flex flex-row items-center gap-2">
					<!-- left side of the leaderboard entry-->
					<div class="min-w-10 text-center">#{rank + (page - 1) * usersPerPage + 1}</div>
					<div class="w-7 h-5 tooltip" aria-label={getCountryName(user.country)}>
						<img
							src="/flags/{user.country.toUpperCase()}.png"
							class="w-7 h-5"
							alt="{user.country} Flag"
						/>
					</div>
					<div class="w-10 h-10 rounded-lg overflow-hidden shadow">
						<img src="{avatarUrl}/{user.player_id}" class="w-10 h-10" alt="{user.country} Flag" />
					</div>
					<div
						class="min-w-56 text-primary-400 hover:text-primary-200 font-semibold transition-colors cursor-pointer"
					>
						{#if user.clan_tag}
							<a
								class="chip p-1.5 min-w-7 variant-soft-primary hover:variant-filled-primary"
								href="/clan/{user.clan_id}"
							>
								{user.clan_tag}
							</a>
						{/if}
						{removeClanTag(user.name)}
					</div>
				</div>
				<div class="flex flex-row items-center gap-1">
					<!-- right side of the leaderboard entry-->
					<div class="min-w-20 text-center font-bold text-xs text-surface-300">
						{user.acc.toFixed(2)}%
					</div>
					<div class="min-w-16 text-center font-bold text-xs text-surface-300">
						{numberHumanReadable(user.plays)}
					</div>
					<div class="min-w-12 text-center font-bold text-xs text-white">
						{numberHumanReadable(user.pp)}
					</div>
					<div class="min-w-8 text-center font-bold text-xs text-surface-300">
						{numberHumanReadable(user.xh_count + user.x_count)}
					</div>
					<div class="min-w-8 text-center font-bold text-xs text-surface-300">
						{numberHumanReadable(user.sh_count + user.s_count)}
					</div>
					<div class="min-w-8 text-center font-bold text-xs text-surface-300">
						{numberHumanReadable(user.a_count)}
					</div>
				</div>
			{/key}
		</div>
	{/each}
</div>
