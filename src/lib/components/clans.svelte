<script lang="ts">
	import { goto } from '$app/navigation';
	import { avatarUrl } from '$lib/env';
	import { userLanguage } from '$lib/storage';
	import { numberHumanReadable } from '$lib/stringUtil';
	import type { DBClan } from '$lib/types';
	import { scale } from 'svelte/transition';

	export let leaderboardData: DBClan[];
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
			<div class="min-w-12 text-center font-bold text-xs text-white">PP</div>
		</div>
	</div>
	{#each leaderboardData as clan, rank}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div
			class="flex flex-row items-center justify-between gap-2 p-2 hover:scale-[1.005] active:scale-[0.995] transition-transform cursor-pointer bg-surface-500 text-sm rounded-lg shadow"
			on:click={() => goto(`/clan/${clan.id}?mode=${currentMode}&type=${currentType}`)}
			transition:scale={{ delay: 20 * rank, duration: 100, start: 0.99 }}
		>
			{#key clan}
				<!-- is needed to force the data to update because of the transition -->
				<div class="flex flex-row items-center gap-2">
					<!-- left side of the leaderboard entry-->
					<div class="min-w-10 text-center">#{rank + (page - 1) * usersPerPage + 1}</div>
					<div class="w-10 h-10 bg-surface-800 rounded-lg overflow-hidden shadow">
						<img src="{avatarUrl}/{clan.owner}" class="w-10 h-10" alt="owner" />
					</div>
					<div
						class="min-w-56 text-primary-400 hover:text-primary-200 font-semibold transition-colors cursor-pointer"
					>
						{clan.name}
					</div>
				</div>
				<div class="flex flex-row items-center gap-1">
					<!-- right side of the leaderboard entry-->
					<div class="min-w-12 text-center font-bold text-xs text-white">
						{numberHumanReadable(clan.total_pp)}
					</div>
				</div>
			{/key}
		</div>
	{/each}
</div>
