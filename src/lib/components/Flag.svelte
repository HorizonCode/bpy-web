<script lang="ts">
	import { getCountryName } from '$lib/country';
	import Popup from './Popup.svelte';

	export let tooltip: boolean = true;
	export let country: string;
	export let size: number = 20;
</script>

{#if tooltip}
	<Popup>
		<span
			class="flag-country"
			style="--height: {size}px; background-image: url(/flags/{country?.toUpperCase() ?? "XX"}.png);"
		></span>
		<svelte:fragment slot="popup">
			<div class="flex flex-col gap-2 card variant-filled-surface p-2 rounded-lg">
				{getCountryName(country)}
			</div>
		</svelte:fragment>
	</Popup>
{:else}
	<span
		class="flag-country"
		style="--height: {size}px; background-image: url(/flags/{country?.toUpperCase() ?? "XX"}.png);"
	></span>
{/if}

<style>
	.flag-country {
		--width-height-ratio: 1.5;
		background-position: 50%;
		background-repeat: no-repeat;
		background-size: cover;
		border-radius: 3px;
		display: block;
		filter: saturate(1.1);
		height: var(--height);
		position: relative;
		transform: translateZ(0);
		width: calc(var(--height) * var(--width-height-ratio));
	}
</style>
