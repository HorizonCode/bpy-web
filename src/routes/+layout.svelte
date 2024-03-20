<script lang="ts">
	import '../app.postcss';
	import {
		AppShell,
		Avatar,
		type PopupSettings,
		popup,
		Toast,
		getToastStore,
		initializeStores,
		Drawer,
		getDrawerStore,
		focusTrap
	} from '@skeletonlabs/skeleton';

	import { BarLoader } from 'svelte-loading-spinners';

	// Highlight JS
	import hljs from 'highlight.js/lib/core';
	import 'highlight.js/styles/github-dark.css';
	import { storeHighlightJs } from '@skeletonlabs/skeleton';
	import xml from 'highlight.js/lib/languages/xml'; // for HTML
	import css from 'highlight.js/lib/languages/css';
	import javascript from 'highlight.js/lib/languages/javascript';
	import typescript from 'highlight.js/lib/languages/typescript';

	hljs.registerLanguage('xml', xml); // for HTML
	hljs.registerLanguage('css', css);
	hljs.registerLanguage('javascript', javascript);
	hljs.registerLanguage('typescript', typescript);
	storeHighlightJs.set(hljs);

	// Floating UI for Popups
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	import { goto } from '$app/navigation';
	import { fade, fly, scale } from 'svelte/transition';
	import { navigating, page } from '$app/stores';
	import { userData } from '$lib/storage';
	import { onMount } from 'svelte';
	import { appName, avatarUrl, apiUrl } from '$lib/env';
	import { Menu, Search } from 'svelte-feathers';
	import NavItems from '$lib/components/navItems.svelte';
	import type { UserData } from '$lib/types';

	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });
	initializeStores();

	const drawerStore = getDrawerStore();

	export let data;

	if ('currentUser' in data) {
		userData.set(data.currentUser as UserData);
	}

	const avatarPopup: PopupSettings = {
		event: 'click',
		target: 'avatarPopup',
		placement: 'bottom-end'
	};

	let showStickyNav = false;

	let userSearchResults: { id: number; name: string }[] = [];
	let userSearchQuery = '';
	let userSearchTimeout: any;

	const searchUsers = async () => {
		if (userSearchTimeout) clearTimeout(userSearchTimeout);

		if (userSearchQuery.length <= 2) {
			userSearchResults = [];
			return;
		}

		userSearchTimeout = setTimeout(async () => {
			try {
				const url = `${apiUrl}/search_players?q=${userSearchQuery}`;
				const response = await fetch(url, {
					method: 'GET'
				});
				if (response.ok) {
					const json = await response.json();
					userSearchResults = json.result;
				} else {
					userSearchResults = [];
				}
			} catch {
				userSearchResults = [];
			}
		}, 500);
	};

	onMount(() => {
		const pageMain = document.getElementById('page');
		if (pageMain) {
			showStickyNav = pageMain.scrollTop > 100;
			pageMain.addEventListener('scroll', () => {
				showStickyNav = pageMain.scrollTop > 100;
			});

			window.addEventListener('resize', () => {
				showStickyNav = pageMain.scrollTop > 100;
				drawerStore.close();
			});
		}
	});
</script>

<Toast />

<Drawer>
	{#if $drawerStore.id == 'nav'}
		<div class="flex flex-col gap-2 p-3">
			<NavItems {drawerStore} />
		</div>
	{:else if $drawerStore.id == 'search'}
		<div class="p-3 pb-0 w-full h-full flex flex-col overflow-hidden">
			<div class="w-fullr" use:focusTrap={true}>
				<input
					class="input mb-3 rounded-lg w-full"
					placeholder="Who are you looking for?"
					bind:value={userSearchQuery}
					on:input={searchUsers}
				/>
			</div>
			<div class="overflow-y-auto">
				<div class="flex flex-col gap-2">
					{#each userSearchResults as user}
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<!-- svelte-ignore a11y-no-static-element-interactions -->
						<div
							class="flex items-center gap-2 rounded-lg cursor-pointer bg-surface-900 hover:bg-surface-700 transition-all"
							transition:scale={{ start: 0.99, duration: 200 }}
							on:click={() => {
								goto(`/u/${user.id}`);
								drawerStore.close();
								userSearchQuery = '';
								userSearchResults = [];
							}}
						>
							<img src="{avatarUrl}/{user.id}" alt={user.name} class="w-10 h-10 rounded-lg" />
							<p>{user.name}</p>
						</div>
					{/each}
				</div>
			</div>
		</div>
	{/if}
</Drawer>

{#if $navigating}
	<div
		class="fixed top-0 right-0 w-screen h-screen z-50 pointer-events-none"
		in:fade={{ delay: 1500 }}
		out:fade={{ duration: 500 }}
	>
		<div class="h-full flex flex-col justify-center items-center gap-2 bg-surface-900/80">
			<BarLoader size="60" color="#fff" unit="px" duration="1s" />
			<p class="text-xs font-light">This is taking longer than expected...</p>
		</div>
	</div>
{/if}

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-missing-attribute -->
<AppShell>
	<svelte:fragment slot="header">
		{#if $page.data.url != '/signin' && $page.data.url != '/signup'}
			<div
				class="fixed w-full"
				in:fly={{ y: -15, duration: 200, delay: 200 }}
				out:fly={{ y: -15, duration: 200 }}
			>
				<div
					class="mx-auto border {showStickyNav
						? 'mt-2 w-[85%] bg-surface-700/95 rounded-lg border-surface-500'
						: 'w-[100%] bg-surface-700 border-surface-700'}  transition-all duration-700 z-[9999]"
				>
					<div class="flex p-2 px-4 flex-row justify-between items-center gap-2">
						<a class="text-xl uppercase cursor-pointer mr-12" on:click={() => goto('/')}
							>{appName}</a
						>
						<div class="hidden md:flex flex-row justify-start items-center gap-2 me-auto">
							<NavItems {drawerStore} />
						</div>
						<div class="flex flex-row gap-5 items-center">
							<button
								class="btn px-5 variant-ghost-surface"
								on:click={() =>
									drawerStore.open({
										id: 'search',
										padding: 'pt-16 p-4',
										bgBackdrop: 'bg-black/50',
										position: 'top',
										width: 'mx-auto w-full md:w-[800px]',
										rounded: 'rounded-lg'
									})}
							>
								<Search class="pointer-events-none" size={18} />
							</button>
							<div use:popup={avatarPopup}>
								<Avatar
									src="{avatarUrl}/{$userData?.id ?? 0}"
									class="!w-10 select-none cursor-pointer hover:ring hover:ring-surface-600 transition-all"
								/>
							</div>
							<div class="card p-4 variant-filled-surface" data-popup="avatarPopup">
								<div class="flex flex-col gap-2">
									{#if $userData}
										<button
											class="w-32 btn variant-filled-surface rounded-lg"
											on:click={() => goto(`/u/${$userData?.id}`)}>Profile</button
										>
										<a class="w-32 btn variant-filled-surface rounded-lg" href="/logout">Logout</a>
									{:else}
										<button
											class="w-32 btn variant-filled-surface rounded-lg"
											on:click={() => goto('/signin')}>Sign In</button
										>
										<button
											class="w-32 btn variant-filled-surface rounded-lg"
											on:click={() => goto('/signup')}>Sign up</button
										>
									{/if}
								</div>
								<div
									class="arrow variant-filled-surface border-t border-l border-gray-700 !right-[0px]"
								/>
							</div>
							<div class="md:hidden">
								<button
									class="btn btn-icon variant-ghost-surface rounded-lg"
									on:click={() =>
										drawerStore.open({
											id: 'nav',
											padding: 'p-4',
											rounded: 'rounded-lg'
										})}
								>
									<Menu class="pointer-events-none" />
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		{/if}
	</svelte:fragment>
	{#key data.url}
		<div
			class="mt-14"
			in:scale={{ start: 0.99, duration: 200, delay: 200 }}
			out:scale={{ start: 0.99, duration: 200 }}
		>
			<slot />
		</div>
	{/key}
</AppShell>
