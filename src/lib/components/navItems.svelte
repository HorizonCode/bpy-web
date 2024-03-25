<script lang="ts">
	import { page } from '$app/stores';
	import { __ } from '$lib/language';
	import { userLanguage } from '$lib/storage';
	import type { DrawerStore } from '@skeletonlabs/skeleton';

	export let drawerStore: DrawerStore;
</script>

<a
	href="/leaderboards"
	class="btn {$page.data.url == '/leaderboards'
		? 'variant-ghost-surface '
		: 'hover:variant-outline-surface '}rounded-lg"
	on:click={() => drawerStore.close()}
>
	{__('Leaderboards', $userLanguage)}
</a>
<a
	href="/donate"
	class="btn {$page.data.url == '/donate'
		? 'variant-ghost-surface '
		: 'hover:variant-outline-surface '}rounded-lg"
	on:click={() => drawerStore.close()}
>
	{__('Donate', $userLanguage)}
</a>
