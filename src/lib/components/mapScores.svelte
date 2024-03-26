<script lang="ts">
	import { goto } from '$app/navigation';
	import { numberHumanReadable } from '$lib/stringUtil';
	import type { MapScore } from '$lib/types';
	import { scale } from 'svelte/transition';
	import { removeClanTag, removeTrailingZeroes } from '$lib/regex';
	import { getCountryName } from '$lib/country';
	import { Frown } from 'svelte-feathers';
	import { getTimeAgo, getTimeSince } from '$lib/time';
	import { parseModsInt } from '$lib/mods';
	import { __ } from '$lib/language';
	import { userLanguage } from '$lib/storage';
	import { avatarUrl } from '$lib/env';

	export let beatmapScores: MapScore[];
	export let loading = false;
	export let currentMode: string;
	export let currentType: string;
</script>

{#if beatmapScores.length > 0}
	<div class="p-3" transition:scale={{ start: 0.99, duration: 200 }}>
		<div
			class="flex flex-col md:flex-row items-center justify-between gap-5 md:gap-0 py-3 px-6 mt-2 bg-surface-500 rounded-lg shadow"
		>
			<div
				class="flex flex-row items-center justify-center md:justify-normal gap-5 w-full md:w-fit"
			>
				<div class="flex flex-col items-center">
					<span class="font-bold text-lg">#1</span>
					<span class="grade grade-{beatmapScores[0].grade.toLowerCase()} !text-2xl !font-bold"
						>{beatmapScores[0].grade
							.replaceAll('XH', 'SS')
							.replaceAll('X', 'SS')
							.replaceAll('SH', 'S')}</span
					>
				</div>
				<img
					class="w-20 h-20 bg-surface-700 rounded-[30%] shadow"
					src="{avatarUrl}/{beatmapScores[0].userid}"
					alt="avatar"
				/>
				<div class="flex flex-col gap-0">
					<a class="font-bold text-primary-400" href="/u/{beatmapScores[0].userid}">
						{#if beatmapScores[0].clan_tag}
							<a
								class="chip p-1.5 py-0.5 min-w-7 variant-soft-primary hover:variant-filled-primary"
								href="/clan/{beatmapScores[0].clan_id}"
							>
								{beatmapScores[0].clan_tag}
							</a>
						{/if}
						{beatmapScores[0].player_name}
					</a>
					<span class="text-xs font-semibold"
						>{__('achieved', $userLanguage)}
						{getTimeAgo(new Date(beatmapScores[0].play_time), $userLanguage)}</span
					>
					<div
						class="w-fit tooltip"
						aria-label={getCountryName(beatmapScores[0].country.toUpperCase())}
					>
						<img
							class="h-4 w-6 mt-1"
							src="/flags/{beatmapScores[0].country.toUpperCase()}.png"
							alt="flag"
						/>
					</div>
				</div>
			</div>
			<div class="flex flex-col gap-2">
				<div class="flex flex-row justify-around md:justify-end gap-10">
					<div class="flex flex-col">
						<span class="text-xs text-surface-300 font-semibold"
							>{__('Total Score', $userLanguage)}</span
						>
						<span class="text-xl font-semibold text-surface-200"
							>{numberHumanReadable(beatmapScores[0].score)}</span
						>
					</div>
					<div class="flex flex-col">
						<span class="text-xs text-surface-300 font-semibold"
							>{__('Accuracy', $userLanguage)}</span
						>
						<span class="text-xl font-semibold text-surface-200"
							>{removeTrailingZeroes(beatmapScores[0].acc)}%</span
						>
					</div>
					<div class="flex flex-col">
						<span class="text-xs text-surface-300 font-semibold"
							>{__('Max Combo', $userLanguage)}</span
						>
						<span
							class="text-xl font-semibold{beatmapScores[0].perfect
								? ' text-lime-400'
								: ' text-surface-200'}">{numberHumanReadable(beatmapScores[0].max_combo)}x</span
						>
					</div>
				</div>
				<div class="flex flex-row justify-center md:justify-end gap-10">
					<div class="flex flex-col gap-1">
						<span class="text-2xs text-surface-300 font-semibold">300</span>
						<span
							class="text-sm font-semibold{beatmapScores[0].n300 <= 0
								? ' text-surface-400'
								: ' text-surface-200'}">{numberHumanReadable(beatmapScores[0].n300)}</span
						>
					</div>
					<div class="flex flex-col gap-1">
						<span class="text-2xs text-surface-300 font-semibold">100</span>
						<span
							class="text-sm font-semibold{beatmapScores[0].n100 <= 0
								? ' text-surface-400'
								: ' text-surface-200'}">{numberHumanReadable(beatmapScores[0].n100)}</span
						>
					</div>
					<div class="flex flex-col gap-1">
						<span class="text-2xs text-surface-300 font-semibold">50</span>
						<span
							class="text-sm font-semibold{beatmapScores[0].n50 <= 0
								? ' text-surface-400'
								: ' text-surface-200'}">{numberHumanReadable(beatmapScores[0].n50)}</span
						>
					</div>
					<div class="flex flex-col gap-1">
						<span class="text-2xs text-surface-300 font-semibold">{__('Miss', $userLanguage)}</span>
						<span
							class="text-sm font-semibold{beatmapScores[0].nmiss <= 0
								? ' text-surface-400'
								: ' text-surface-200'}">{numberHumanReadable(beatmapScores[0].nmiss)}</span
						>
					</div>
					<div class="flex flex-col gap-1">
						<span class="text-2xs text-surface-300 font-semibold">PP</span>
						<span class="text-sm font-semibold text-surface-200"
							>{numberHumanReadable(Math.round(beatmapScores[0].pp))}</span
						>
					</div>
					<div class="flex flex-col gap-1">
						<span class="text-2xs text-surface-300 font-semibold">{__('Time', $userLanguage)}</span>
						<span
							class="text-sm font-semibold text-surface-200 tooltip"
							aria-label={new Date(beatmapScores[0].play_time).toUTCString()}
							>{getTimeSince(new Date(beatmapScores[0].play_time))}</span
						>
					</div>
					<div class="flex flex-col gap-1">
						<span class="text-2xs text-surface-300 font-semibold">{__('Mods', $userLanguage)}</span>
						<div class="flex flex-row">
							{#each parseModsInt(beatmapScores[0].mods) as mod}
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
				<div class="hidden flex-row justify-center md:justify-end gap-10">
					<div class="flex flex-col gap-1">
						<span class="text-xs text-surface-300 font-semibold">PP</span>
						<span class="font-semibold text-surface-200"
							>{numberHumanReadable(Math.round(beatmapScores[0].pp))}</span
						>
					</div>
					<div class="flex flex-col gap-1">
						<span class="text-xs text-surface-300 font-semibold">{__('Time', $userLanguage)}</span>
						<span class="font-semibold text-surface-200"
							>{getTimeSince(new Date(beatmapScores[0].play_time))}</span
						>
					</div>
					<div class="flex flex-col gap-1">
						<span class="text-xs text-surface-300 font-semibold">{__('Mods', $userLanguage)}</span>
						<div class="flex flex-row">
							{#each parseModsInt(beatmapScores[0].mods) as mod}
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
			</div>
		</div>
	</div>
{/if}
<div class="w-full flex flex-col flex-wrap gap-1 p-3 overflow-auto">
	{#if beatmapScores.length > 0 || loading}
		<div class="flex flex-row items-center justify-between gap-2 py-1 px-2 text-sm">
			<!-- is needed to force the data to update because of the transition -->
			<div class="flex flex-row items-center gap-2">
				<div class="min-w-10 text-center font-bold text-xs text-surface-300">
					{__('Rank', $userLanguage)}
				</div>
				<div class="min-w-10 text-center font-bold text-xs text-surface-300"></div>
				<div class="min-w-20 font-bold text-xs text-surface-300">{__('Score', $userLanguage)}</div>
				<div class="min-w-14 font-bold text-xs text-surface-300">
					{__('Accuracy', $userLanguage)}
				</div>
				<div class="min-w-5 font-bold text-xs text-surface-300">{__('Player', $userLanguage)}</div>
			</div>
			<div class="flex flex-row text-center items-center gap-1">
				<!-- right side of the leaderboard entry-->
				<div class="min-w-32 text-center font-bold text-xs text-surface-300">
					{__('Max Combo', $userLanguage)}
				</div>
				<div class="min-w-8 text-center font-bold text-xs text-surface-300">300</div>
				<div class="min-w-8 text-center font-bold text-xs text-surface-300">100</div>
				<div class="min-w-8 text-center font-bold text-xs text-surface-300">50</div>
				<div class="min-w-8 text-center font-bold text-xs text-surface-300">
					{__('Miss', $userLanguage)}
				</div>
				<div class="min-w-14 text-center font-bold text-xs text-surface-300">PP</div>
				<div class="min-w-10 text-center font-bold text-xs text-surface-300">
					{__('Time', $userLanguage)}
				</div>
				<div class="min-w-32 text-start font-bold text-xs text-surface-300">
					{__('Mods', $userLanguage)}
				</div>
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
						{removeTrailingZeroes(user.acc)}%
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
								class="chip p-1.5 py-0.5 min-w-7 variant-soft-primary hover:variant-filled-primary"
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
			{__('No Scores found.', $userLanguage)}
		</div>
	{/if}
</div>
