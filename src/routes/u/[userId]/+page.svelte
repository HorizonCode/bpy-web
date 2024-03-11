<script lang="ts">
	import { appName } from '$lib/env.js';

	export let data;
</script>

<svelte:head>
	<title>{appName} :: Profile</title>
</svelte:head>

{JSON.stringify(data)}
