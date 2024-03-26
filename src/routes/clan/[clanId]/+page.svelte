<script lang="ts">
	import { appName, appUrl, avatarUrl } from '$lib/env';
	import { __ } from '$lib/language';
	import { userLanguage } from '$lib/storage';

	export let data;
</script>

<svelte:head>
	{#if data.clan?.id}
		<title>{appName} :: {data.clan.name} - clan info</title>
		<meta property="og:type" content="profile" />
		<meta property="og:title" content="{data.clan.name} - clan info" />
		<meta property="og:url" content="{appUrl}/clan/{data.clan.id}" />
		<meta property="profile:username" content={data.clan.name} />
	{:else}
		<title>{appName} :: clan not found</title>
	{/if}
</svelte:head>
<div class="container mx-auto w-full p-5">
	{#if data.clan?.id}
		<div class="mx-auto card overflow-hidden">
			<div class="w-full flex flex-col">
				<div class="relative flex flex-row bg-surface-600 p-3">
					<div class="flex flex-col my-auto gap-1 md:gap-2 ms-2 z-10">
						<div class="flex flex-row items-center gap-1 text-xl md:text-2xl">
							<p class="chip cursor-auto variant-filled-primary">{data.clan.tag}</p>
							{data.clan.name}
						</div>
					</div>
				</div>
				<div class="w-full flex flex-col gap-3 items-center justify-center p-3 bg-surface-800">
					<div class="w-full text-center">
						<p class="text-4xl mb-3">{__('Clan Owner', $userLanguage)}</p>
						<div
							class=" mx-auto w-[50%] flex flex-row items-center gap-3 bg-surface-700 p-3 rounded-lg"
						>
							<img
								class="w-10 h-10 md:w-16 md:h-16 rounded-[30%]"
								src={avatarUrl + '/' + data.clan.owner.id}
								alt="playerProfile"
							/>
							<img
								class="w-7"
								src="/flags/{data.clan.owner.country.toUpperCase()}.png"
								alt="country flag"
							/>
							<a
								class="text-primary-500 hover:text-primary-300 transition-colors"
								href="/u/{data.clan.owner.id}">{data.clan.owner.name}</a
							>
						</div>
					</div>
					<div class="w-full text-center">
						<p class="text-4xl mb-3">{__('Clan Members', $userLanguage)}</p>
						<div class="mx-auto grid grid-cols-2 gap-2">
							{#each data.clan.members as member}
								{#if member.id != data.clan.owner.id}
									<div
										class=" mx-auto flex flex-row items-center gap-3 bg-surface-700 w-full p-3 rounded-lg"
									>
										<img
											class="w-10 h-10 md:w-16 md:h-16 rounded-[30%]"
											src={avatarUrl + '/' + member.id}
											alt="playerProfile"
										/>
										<img
											class="w-7"
											src="/flags/{member.country.toUpperCase()}.png"
											alt="country flag"
										/>
										<a
											class="text-primary-500 hover:text-primary-300 transition-colors"
											href="/u/{member.id}">{member.name}</a
										>
									</div>
								{/if}
							{/each}
						</div>
					</div>
				</div>
				<div class="flex flex-row-reverse bg-surface-700 p-7 py-2"></div>
			</div>
		</div>
	{:else}
		<div class="mx-auto card p-6 py-12">
			<div
				class="w-full flex flex-col lg:divide-x divide-surface-500 lg:flex-row items-center justify-around gap-5 lg:gap-2"
			>
				<div class="flex flex-col items-center justify-center">
					<p class="text-4xl">404</p>
					<p class="text-xl">Clan not found.</p>
				</div>
				<div class="flex flex-col items-center lg:items-start justify-normal lg:ps-20 gap-2">
					<p class="text-lg font-semibold underline underline-offset-2">
						There are a few possible reasons for this:
					</p>
					<ul class="list-disc ms-5">
						<li>They may have deleted the clan</li>
						<li>The clan may be temporarily unavailable due to security or abuse issues</li>
						<li>You may have made a typo!</li>
					</ul>
					<a class="mx-auto mt-10 btn variant-filled-surface" href="/">Back to Home</a>
				</div>
			</div>
		</div>
	{/if}
</div>
