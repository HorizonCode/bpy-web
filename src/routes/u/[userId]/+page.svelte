<script lang="ts">
	import { appName, appUrl, avatarUrl } from '$lib/env.js';
	import { foregroundColors } from 'chalk';

	export let data;
</script>

<svelte:head>
	{#if data.user?.id}
		<title>{appName} :: {data.user.name} - player info</title>
		<meta property="og:type" content="profile" />
		<meta property="og:title" content="{data.user.name} - player info" />
		<meta property="og:url" content="{appUrl}/u/{data.user.id}" />
		<meta property="og:image" content="{avatarUrl}/{data.user.id}" />
		<meta property="profile:username" content={data.user.name} />
	{:else}
		<title>{appName} :: player not found</title>
	{/if}
</svelte:head>

{#if data.user?.id}
	{data.user.name}
{:else}
	User not found.
{/if}
