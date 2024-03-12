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
<div class="container mx-auto w-full p-5">
	{#if data.user?.id}
		{data.user.name}
	{:else}
		<div class="mx-auto card p-6 py-12">
			<div
				class="w-full flex flex-col lg:divide-x divide-surface-500 lg:flex-row items-center justify-around gap-5 lg:gap-2"
			>
				<div class="flex flex-col items-center justify-center">
					<p class="text-4xl">404</p>
					<p class="text-xl">User Profile not found.</p>
				</div>
				<div class="flex flex-col items-center lg:items-start justify-normal lg:ps-20 gap-2">
					<p class="text-lg font-semibold underline underline-offset-2">
						There are a few possible reasons for this:
					</p>
					<ul class="list-disc ms-5">
						<li>They may have changed their username</li>
						<li>The account may be temporarily unavailable due to security or abuse issues</li>
						<li>You may have made a typo!</li>
					</ul>
					<a class="mx-auto mt-10 btn variant-filled-surface" href="/">Back to Home</a>
				</div>
			</div>
		</div>
	{/if}
</div>
