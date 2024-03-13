<script lang="ts">
	import './style.postcss';
	import Popup from '$lib/Popup.svelte';
	import { appName, appUrl, avatarUrl } from '$lib/env';
	import { regionNames } from '$lib/stringUtil';
	import { type User } from '$lib/types';
	import { getLevelProgress, getLevel } from '$lib/level';

	export let data;
</script>

<svelte:head>
	{#if data.user?.info.id}
		<title>{appName} :: {data.user.info.name} - player info</title>
		<meta property="og:type" content="profile" />
		<meta property="og:title" content="{data.user.info.name} - player info" />
		<meta property="og:url" content="{appUrl}/u/{data.user.info.id}" />
		<meta property="og:image" content="{avatarUrl}/{data.user.info.id}" />
		<meta property="profile:username" content={data.user.info.name} />
	{:else}
		<title>{appName} :: player not found</title>
	{/if}
</svelte:head>
<div class="container mx-auto w-full p-5">
	{#if data.user?.info.id}
		<div class="mx-auto card overflow-hidden">
			<div class="w-full flex flex-col">
				<div
					class="h-28 md:h-64 bg-center bg-cover bg-no-repeat rounded-t-lg"
					style="background-image: url('https://assets.ppy.sh/user-profile-covers/5466785/e205ad5fcedbd036f55781ac7b59af8799f68046e20678d41deeecdd36656ec7.jpeg');"
				></div>
				<div class="relative flex flex-row bg-surface-700 md:px-12 p-2">
					<div
						class="md:absolute md:-top-[55px] w-14 h-14 md:w-32 md:h-32 bg-surface-600 rounded-[30%] overflow-hidden shadow-[0_2px_5px_1px_rgba(0,0,0,0.4)]"
					>
						<img
							class="w-14 h-14 md:w-32 md:h-32 rounded-[30%]"
							src="{avatarUrl}/{data.user.info.id}"
							alt="playerProfile"
						/>
					</div>
					<div class="flex flex-col my-auto gap-1 md:gap-2 ms-2 md:ms-36">
						<div class="text-xl md:text-2xl">
							{data.user.info.name}
						</div>
						<div class="flex flex-row md:gap-2">
							<Popup placement="top">
								<img
									class="w-5 md:w-8"
									src="/flags/{data.user.info.country.toUpperCase()}.png"
									alt="country flag"
								/>
								<svelte:fragment slot="popup">
									<div class="card p-2 px-4 rounded-lg variant-filled-surface text-sm">
										{regionNames.of(data.user.info.country.toUpperCase()) ?? 'Unknown'}
										<div
											class="arrow border-r border-b border-gray-700 variant-filled-surface"
										></div>
									</div>
								</svelte:fragment>
							</Popup>
							<span class="hidden md:block"
								>{regionNames.of(data.user.info.country.toUpperCase()) ?? 'Unknown'}</span
							>
						</div>
					</div>
				</div>
				<div class="h-56 bg-surface-800"></div>
				<div class="flex flex-row-reverse bg-surface-700 p-7 py-2">
					<div class="flex flex-row items-center gap-5">
						<div class="flex flex-col font-semibold text-xs text-end">
							<Popup>
								<div class="relative h-2 w-52 bg-gray-950 rounded-lg border border-surface-700">
									<div
										class="bg-gradient-to-r from-primary-400 to-primary-600 h-full rounded-lg"
										style="width: {getLevelProgress(data.user.stats[0].tscore)}%;"
									></div>
									<div class="absolute mt-[2px] top-[100%] right-0">
										{getLevelProgress(data.user.stats[0].tscore).toFixed(0)}%
									</div>
								</div>
								<svelte:fragment slot="popup">
									<div class="card p-2 px-4 rounded-lg variant-filled-surface font-normal text-xs">
										progress to next level
										<div
											class="arrow border-r border-b border-gray-700 variant-filled-surface"
										></div>
									</div>
								</svelte:fragment>
							</Popup>
						</div>
						<div class="relative inline-flex items-center justify-center h-[50px] w-[50px]">
							<div
								class="absolute w-full h-full level-icon bg-gradient-to-b from-surface-100 to-surface-400"
							></div>
							<span class="absolute text-[20px] font-semibold"
								>{getLevel(data.user.stats[0].tscore)}</span
							>
						</div>
					</div>
				</div>
			</div>
		</div>
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
