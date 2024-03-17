<script lang="ts">
	import { page } from '$app/stores';
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
	Leaderboards
</a>
<a
	href="/donate"
	class="btn {$page.data.url == '/donate'
		? 'variant-ghost-surface '
		: 'hover:variant-outline-surface '}rounded-lg"
	on:click={() => drawerStore.close()}
>
	Donate
</a>
