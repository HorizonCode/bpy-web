<script lang="ts">
	import { page } from '$app/stores';
	import { __, languages } from '$lib/language';
	import { userData, userLanguage } from '$lib/storage';
	import { Avatar, type DrawerStore } from '@skeletonlabs/skeleton';
	import Popup from './Popup.svelte';
	import { avatarUrl } from '$lib/env';
	import { goto } from '$app/navigation';

	export let drawerStore: DrawerStore;
</script>

<div class="flex flex-col md:flex-row p-3 md:p-0 h-full w-full">
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

	<div class="h-full w-full flex flex-row justify-between items-end mt-auto">
		<div class="md:hidden">
			<Popup event="click" placement="bottom">
				<button class="btn px-2 py-2 rounded-lg variant-ghost-surface">
					<img
						width="30"
						class="pointer-events-none"
						src="/flags/{$userLanguage}.png"
						alt="language"
					/>
				</button>
				<svelte:fragment slot="popup">
					<div class="flex flex-col gap-2 card variant-filled-surface p-2 rounded-lg">
						{#each languages as lang}
							<button
								class="flex flex-row items-center {$userLanguage == lang.code
									? 'bg-primary-600/30'
									: 'bg-surface-600 hover:bg-surface-700'} hover:scale-[1.005] active:scale-[0.995] transition-all px-6 py-2 rounded-lg cursor-pointer"
								on:click={() => userLanguage.set(lang.code)}
							>
								<img width="30" src="/flags/{lang.code}.png" alt="flag-{lang.code}" class="mr-2" />
								{lang.name}
							</button>
						{/each}
					</div>
				</svelte:fragment>
			</Popup>
		</div>
		<div class="md:hidden">
			<Popup event="click" placement="bottom">
				<Avatar
					src="{avatarUrl}/{$userData?.id ?? 0}"
					class="!w-10 select-none cursor-pointer hover:ring hover:ring-surface-600 transition-all"
				/>
				<svelte:fragment slot="popup">
					<div class="card p-4 variant-filled-surface">
						<div class="flex flex-col gap-2">
							{#if $userData}
								<button
									class="w-32 btn variant-filled-surface rounded-lg"
									on:click={() => goto(`/u/${$userData?.id}`)}
									>{__('Profile', $userLanguage)}</button
								>
								<a class="w-32 btn variant-filled-surface rounded-lg" href="/logout"
									>{__('Logout', $userLanguage)}</a
								>
							{:else}
								<button
									class="w-32 btn variant-filled-surface rounded-lg"
									on:click={() => goto('/signin')}>{__('Sign In', $userLanguage)}</button
								>
								<button
									class="w-32 btn variant-filled-surface rounded-lg"
									on:click={() => goto('/signup')}>{__('Sign Up', $userLanguage)}</button
								>
							{/if}
						</div>
						<div
							class="arrow variant-filled-surface border-b border-r border-gray-700 !right-[0px]"
						/>
					</div>
				</svelte:fragment>
			</Popup>
		</div>
	</div>
</div>
