<script lang="ts">
	import { goto } from '$app/navigation';
	import { numberHumanReadable } from '$lib/stringUtil';
	import type { MapScore } from '$lib/types';
	import { scale } from 'svelte/transition';
	import { removeClanTag } from '$lib/regex';
	import { getCountryName } from '$lib/country';
	import { Frown } from 'svelte-feathers';
	import { getTimeSince } from '$lib/time';
	import { parseModsInt } from '$lib/mods';

	export let beatmapScores: MapScore[];
	export let loading = false;
	export let currentMode: string;
	export let currentType: string;
</script>

<div class="w-full flex flex-col flex-wrap gap-1 p-3 overflow-auto">
	{#if beatmapScores.length > 0 || loading}
		<div class="flex flex-row items-center justify-between gap-2 py-1 px-2 text-sm">
			<!-- is needed to force the data to update because of the transition -->
			<div class="flex flex-row items-center gap-2">
				<div class="min-w-10 text-center font-bold text-xs text-surface-300">Rank</div>
				<div class="min-w-10 text-center font-bold text-xs text-surface-300">Grade</div>
				<div class="min-w-20 font-bold text-xs text-surface-300">Score</div>
				<div class="min-w-14 font-bold text-xs text-surface-300">Accuracy</div>
				<div class="min-w-5 font-bold text-xs text-surface-300">Player</div>
			</div>
			<div class="flex flex-row text-center items-center gap-1">
				<!-- right side of the leaderboard entry-->
				<div class="min-w-32 text-center font-bold text-xs text-surface-300">Max Combo</div>
				<div class="min-w-8 text-center font-bold text-xs text-surface-300">300</div>
				<div class="min-w-8 text-center font-bold text-xs text-surface-300">100</div>
				<div class="min-w-8 text-center font-bold text-xs text-surface-300">50</div>
				<div class="min-w-8 text-center font-bold text-xs text-surface-300">Miss</div>
				<div class="min-w-14 text-center font-bold text-xs text-surface-300">PP</div>
				<div class="min-w-10 text-center font-bold text-xs text-surface-300">Time</div>
				<div class="min-w-32 text-start font-bold text-xs text-surface-300">Mods</div>
			</div>
		</div>
	{/if}
	{#each beatmapScores as user, rank}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div
			class="flex flex-row items-center justify-between gap-2 p-2 hover:scale-[1.005] active:scale-[0.995] transition-transform cursor-pointer bg-surface-500 text-sm rounded-lg shadow"
			on:click={() => goto(`/u/${user.userid}?mode=${currentMode}&type=${currentType}`)}
			transition:scale={{ duration: 200, start: 0.99 }}
		>
			{#key user}
				<!-- is needed to force the data to update because of the transition -->
				<div class="flex flex-row items-center gap-2">
					<!-- left side of the leaderboard entry-->
					<div class="min-w-10 text-center">#{rank + 1}</div>
					<div class="min-w-10 text-center font-semibold grade grade-{user.grade.toLowerCase()}">
						{user.grade.replaceAll('XH', 'SS').replaceAll('X', 'SS').replaceAll('SH', 'S')}
					</div>
					<div class="min-w-20 text-xs{rank >= 1 ? ' font-normal' : ' font-bold'}">
						{numberHumanReadable(user.score)}
					</div>
					<div class="min-w-14 text-xs font-semibold {user.acc >= 100 ? ' text-green-300' : ''}">
						{parseFloat(user.acc.toFixed(2))}%
					</div>
					<div
						class="flex text-xs flex-row gap-2 items-center min-w-56 text-primary-400 hover:text-primary-200 font-semibold transition-colors cursor-pointer"
					>
						<div class="w-7 h-5 tooltip" aria-label={getCountryName(user.country)}>
							<img
								src="/flags/{user.country.toUpperCase()}.png"
								class="w-7 h-5"
								alt="{user.country} Flag"
							/>
						</div>
						{#if user.clan_tag}
							<a
								class="chip p-1.5 min-w-7 variant-soft-primary hover:variant-filled-primary"
								href="/clan/{user.clan_id}"
							>
								{user.clan_tag}
							</a>
						{/if}
						{removeClanTag(user.player_name)}
					</div>
				</div>
				<div class="flex flex-row items-center gap-1">
					<!-- right side of the leaderboard entry-->
					<div
						class="min-w-24 font-bold text-xs text-surface-300{user.perfect
							? ' text-green-300'
							: ''}"
					>
						{numberHumanReadable(user.max_combo)}x
					</div>
					<div
						class="min-w-8 text-center font-bold text-xs{user.n300 <= 0
							? ' text-surface-400'
							: ' text-surface-100'}"
					>
						{numberHumanReadable(user.n300)}
					</div>
					<div
						class="min-w-8 text-center font-bold text-xs{user.n100 <= 0
							? ' text-surface-400'
							: ' text-surface-100'}"
					>
						{numberHumanReadable(user.n100)}
					</div>
					<div
						class="min-w-8 text-center font-bold text-xs{user.n50 <= 0
							? ' text-surface-400'
							: ' text-surface-100'}"
					>
						{numberHumanReadable(user.n50)}
					</div>
					<div
						class="min-w-8 text-center font-bold text-xs{user.nmiss <= 0
							? ' text-surface-400'
							: ' text-surface-100'}"
					>
						{numberHumanReadable(user.nmiss)}
					</div>
					<div
						class="min-w-14 text-center font-bold text-xs text-surface-100 tooltip"
						aria-label={user.pp.toFixed(3)}
					>
						{numberHumanReadable(parseFloat(user.pp.toFixed(0)))}
					</div>
					<div
						class="min-w-10 text-center font-bold text-xs text-surface-100 tooltip"
						aria-label={new Date(user.play_time).toUTCString()}
					>
						{getTimeSince(new Date(user.play_time))}
					</div>
					<div class="min-w-32 text-center font-bold text-xs text-surface-100">
						<div class="flex flex-row">
							{#each parseModsInt(user.mods) as mod}
								<div class="tooltip" aria-label={mod.name}>
									<img
										src="/mods/{mod.short_name.toLowerCase()}.png"
										class="w-7 h-5"
										alt={mod.name}
									/>
								</div>
							{/each}
						</div>
					</div>
				</div>
			{/key}
		</div>
	{/each}
	{#if beatmapScores.length <= 0 && !loading}
		<div
			class="flex flex-row items-center justify-center gap-2 p-4 bg-surface-500 text-lg rounded-lg shadow"
			transition:scale={{ duration: 200, start: 0.99 }}
		>
			<Frown class="pointer-events-none"></Frown>
			No Scores found.
		</div>
	{/if}
</div>
