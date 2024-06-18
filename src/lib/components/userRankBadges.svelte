<script lang="ts">
	import { Privileges, privsToGroups } from '$lib/privs';
	import Award from 'svelte-feathers/Award.svelte';
	import BookOpen from 'svelte-feathers/BookOpen.svelte';
	import CheckCircle from 'svelte-feathers/CheckCircle.svelte';
	import Code from 'svelte-feathers/Code.svelte';
	import Heart from 'svelte-feathers/Heart.svelte';
	import Hexagon from 'svelte-feathers/Hexagon.svelte';
	import Map from 'svelte-feathers/Map.svelte';
	import Server from 'svelte-feathers/Server.svelte';
	import Shield from 'svelte-feathers/Shield.svelte';

	export let userPriv: number;

	const groups = privsToGroups(userPriv);
</script>

<div class="flex flex-row gap-2 px-3 drop-shadow">
	{#each groups as group}
		{#if group == Privileges.ADMINISTRATOR}
			<div class="tooltip text-red-600" aria-label="Administrator">
				<Shield class="w-4 md:w-6 pointer-events-none" />
			</div>
		{/if}
		{#if group == Privileges.MODERATOR}
			<div class="tooltip text-rose-700" aria-label="Moderator">
				<Server class="w-4 md:w-6 pointer-events-none" />
			</div>
		{/if}
		{#if group == Privileges.DEVELOPER}
			<div class="tooltip text-blue-500" aria-label="Developer">
				<Code class="w-4 md:w-6 pointer-events-none" />
			</div>
		{/if}
		{#if group == Privileges.ALUMNI}
			<div class="tooltip text-blue-500" aria-label="Alumni">
				<BookOpen class="w-4 md:w-6 pointer-events-none" />
			</div>
		{/if}
		{#if group == Privileges.NOMINATOR}
			<div class="tooltip text-green-500" aria-label="Nominator">
				<Map class="w-4 md:w-6 pointer-events-none" />
			</div>
		{/if}
		{#if group == Privileges.TOURNEY_MANAGER}
			<div class="tooltip text-amber-500" aria-label="Tourney Manager">
				<Award class="w-4 md:w-6 pointer-events-none" />
			</div>
		{/if}
		{#if group == Privileges.PREMIUM}
			<div class="tooltip text-amber-600" aria-label="Donator">
				<Hexagon class="w-4 md:w-6 pointer-events-none" />
			</div>
		{/if}
		{#if group == Privileges.SUPPORTER}
			<div class="tooltip text-pink-500" aria-label="Donator">
				<Heart class="w-4 md:w-6 pointer-events-none" />
			</div>
		{/if}
		{#if group == Privileges.WHITELISTED}
			<div class="tooltip text-green-400" aria-label="Verified">
				<CheckCircle class="w-4 md:w-6 pointer-events-none" />
			</div>
		{/if}
	{/each}
</div>
