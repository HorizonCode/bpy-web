<script lang="ts">
	import { Privileges, privsToGroups } from '$lib/privs';
	import {
		Award,
		BookOpen,
		CheckCircle,
		Code,
		Heart,
		Hexagon,
		Map,
		Server,
		Shield
	} from 'svelte-feathers';

	export let userPriv: number;

	const groups = privsToGroups(7);
</script>

<div class="flex flex-row gap-2 px-3 drop-shadow">
	{#each groups as group}
		{#if group == Privileges.ADMINISTRATOR}
			<div class="tooltip text-red-600" aria-label="Administrator">
				<Shield class="pointer-events-none" />
			</div>
		{/if}
		{#if group == Privileges.MODERATOR}
			<div class="tooltip text-rose-700" aria-label="Moderator">
				<Server class="pointer-events-none" />
			</div>
		{/if}
		{#if group == Privileges.DEVELOPER}
			<div class="tooltip text-blue-500" aria-label="Developer">
				<Code class="pointer-events-none" />
			</div>
		{/if}
		{#if group == Privileges.ALUMNI}
			<div class="tooltip text-blue-500" aria-label="Alumni">
				<BookOpen class="pointer-events-none" />
			</div>
		{/if}
		{#if group == Privileges.NOMINATOR}
			<div class="tooltip text-green-500" aria-label="Nominator">
				<Map class="pointer-events-none" />
			</div>
		{/if}
		{#if group == Privileges.TOURNEY_MANAGER}
			<div class="tooltip text-amber-500" aria-label="Tourney Manager">
				<Award class="pointer-events-none" />
			</div>
		{/if}
		{#if group == Privileges.PREMIUM}
			<div class="tooltip text-amber-600" aria-label="Donator">
				<Hexagon class="pointer-events-none" />
			</div>
		{/if}
		{#if group == Privileges.SUPPORTER}
			<div class="tooltip text-pink-500" aria-label="Donator">
				<Heart class="pointer-events-none" />
			</div>
		{/if}
		{#if group == Privileges.WHITELISTED}
			<div class="tooltip text-green-400" aria-label="Verified">
				<CheckCircle class="pointer-events-none" />
			</div>
		{/if}
	{/each}
</div>
