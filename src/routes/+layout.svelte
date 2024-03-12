<script lang="ts">
	import '../app.postcss';
	import {
		AppShell,
		AppBar,
		Avatar,
		type PopupSettings,
		popup,
		Toast,
		getToastStore,
		initializeStores,
		Drawer,
		getDrawerStore
	} from '@skeletonlabs/skeleton';

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
	import { fly, scale } from 'svelte/transition';
	import { page } from '$app/stores';
	import { userData } from '$lib/storage';
	import { onMount } from 'svelte';
	import { appName, avatarUrl } from '$lib/env';
	import { Menu } from 'svelte-feathers';
	import NavItems from '$lib/navItems.svelte';

	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });
	initializeStores();

	const toastStore = getToastStore();
	const drawerStore = getDrawerStore();

	export let data;

	if (data.currentUser) {
		userData.set(data.currentUser);
	}

	const avatarPopup: PopupSettings = {
		event: 'click',
		target: 'avatarPopup',
		placement: 'bottom-end'
	};

	const avatarPopup_sticky: PopupSettings = {
		event: 'click',
		target: 'avatarPopup_sticky',
		placement: 'bottom-end'
	};

	let showStickyNav = false;

	onMount(() => {
		const pageMain = document.getElementById('page');
		if (pageMain) {
			showStickyNav = pageMain.scrollTop > 100;
			pageMain.addEventListener('scroll', () => {
				showStickyNav = pageMain.scrollTop > 100;
			});

			pageMain.addEventListener('resize', () => {
				showStickyNav = pageMain.scrollTop > 100;
			});
		}
	});
</script>

<Toast />

<div class="md:hidden">
	<Drawer>
		<div class="flex flex-col gap-2 p-3">
			<NavItems {drawerStore} />
		</div>
	</Drawer>
</div>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-missing-attribute -->
<AppShell>
	<svelte:fragment slot="header">
		{#if $page.data.url != '/login'}
			<div
				class="fixed w-full"
				in:fly={{ y: -15, duration: 200, delay: 200 }}
				out:fly={{ y: -15, duration: 200 }}
			>
				<div
					class="mx-auto border {showStickyNav
						? 'mt-2 w-[85%] bg-surface-700/95 rounded-lg border-surface-500'
						: 'w-[100%] bg-surface-700 border-surface-700'}  transition-all duration-700"
				>
					<div class="flex p-2 px-4 flex-row justify-between items-center gap-2">
						<a class="text-xl uppercase cursor-pointer mr-12" on:click={() => goto('/')}
							>{appName}</a
						>
						<div class="hidden md:flex flex-row justify-start items-center gap-2 me-auto">
							<NavItems {drawerStore} />
						</div>
						<div class="flex flex-row gap-5 items-center">
							<div use:popup={avatarPopup_sticky}>
								<Avatar
									src="{avatarUrl}/{$userData?.id ?? 0}"
									class="!w-10 select-none cursor-pointer hover:ring hover:ring-surface-600 transition-all"
								/>
							</div>
							<div class="md:hidden">
								<button
									class="btn btn-icon variant-ghost-surface rounded-lg"
									on:click={() =>
										drawerStore.open({
											padding: 'p-4',
											rounded: 'rounded-lg'
										})}
								>
									<Menu class="!outline-none !border-none" />
								</button>
							</div>
						</div>
						<div class="card p-4 variant-filled-surface" data-popup="avatarPopup_sticky">
							<div class="flex flex-col gap-2">
								{#if $userData}
									<button
										class="w-32 btn variant-filled-surface rounded-lg"
										on:click={() => goto(`/u/${$userData?.id}`)}>Profile</button
									>
									<button
										class="w-32 btn variant-filled-surface rounded-lg"
										on:click={() => {
											toastStore.trigger({
												message: `Logged out!`,
												classes: '!bg-surface-800 !text-surface-200 !border-surface-700 !border'
											});
											userData.set(undefined);
											goto('/');
										}}>Logout</button
									>
								{:else}
									<button
										class="w-32 btn variant-filled-surface rounded-lg"
										on:click={() => goto('/login')}>Login</button
									>
									<button
										class="w-32 btn variant-filled-surface rounded-lg"
										on:click={() => goto('/register')}>Register</button
									>
								{/if}
							</div>
							<div
								class="arrow variant-filled-surface border-t border-l border-gray-700 !right-[0px]"
							/>
						</div>
					</div>
				</div>
			</div>
		{/if}
	</svelte:fragment>
	{#key data.url}
		<div
			class="mt-20"
			in:scale={{ start: 0.99, duration: 200, delay: 200 }}
			out:scale={{ start: 0.99, duration: 200 }}
		>
			<slot />
		</div>
	{/key}
</AppShell>
