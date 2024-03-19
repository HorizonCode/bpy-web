<script lang="ts">
	import { goto } from '$app/navigation';
	import { parseModsInt } from '$lib/mods';
	import { getTimeAgo } from '$lib/time';
	import { type PlayerScores } from '$lib/types';

	export let scores: PlayerScores | undefined;
	export let currentMode: string;
	export let currentType: string;
</script>

{#if scores}
	{#each scores.scores as score, idx}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div
			class="relative flex flex-col md:flex-row items-stretch md:items-center justify-between gap-1 p-2 py-1 bg-surface-500 rounded-lg hover:scale-[1.005] active:scale-[0.995] transition-transform cursor-pointer"
			on:click={() => goto(`/beatmaps/${score.beatmap.id}?mode=${currentMode}&type=${currentType}`)}
		>
			<div
				class="absolute h-full w-full top-0 left-0 bg-no-repeat bg-center blur-[3px] opacity-5"
				style="background-image: url('https://assets.ppy.sh/beatmaps/{score.beatmap
					.set_id}/covers/cover@2x.jpg');"
			></div>
			<div class="flex flex-row gap-2 items-center justify-start">
				<div class="w-8 text-center !text-2xl font-bold grade grade-{score.grade.toLowerCase()}">
					{score.grade.replaceAll('XH', 'SS').replaceAll('X', 'SS').replaceAll('SH', 'S')}
				</div>
				<div class="flex flex-col">
					<div>
						<span class="text-sm font-bold">{score.beatmap.title}</span>
						<span class="text-xs font-semibold">by {score.beatmap.artist}</span>
					</div>
					<div class="flex flex-row gap-4">
						<span class="text-xs font-semibold text-yellow-600">{score.beatmap.version}</span>
						<div
							class="text-xs font-semibold text-surface-400 tooltip"
							aria-label={new Date(score.play_time).toUTCString()}
						>
							{getTimeAgo(new Date(score.play_time))}
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
							<img src="/mods/{mod.short_name.toLowerCase()}.png" class="w-8 h-6" alt={mod.name} />
						</div>
					{/each}
				</div>
				<div class="flex flex-col items-center md:items-start ms-3">
					<div class="flex flex-row gap-3">
						<span class="min-w-12 text-sm font-bold text-yellow-500">{score.acc.toFixed(2)}%</span>
						<span class="min-w-12 text-sm font-bold"
							>{Math.round(score.pp * Math.pow(0.95, idx))}pp</span
						>
					</div>
					<span class="text-xs font-semibold">
						weighted {Math.round(Math.pow(0.95, idx) * 100)}%</span
					>
				</div>
				<div
					class="min-w-[80px] flex flex-row items-center justify-center text-primary-400 font-bold"
				>
					{Math.round(score.pp)}<span class="text-primary-300 text-xs">pp</span>
				</div>
			</div>
		</div>
	{/each}
{/if}
