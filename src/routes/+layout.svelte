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
		initializeStores
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
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });
	initializeStores();

	const toastStore = getToastStore();

	export let data;

	if (data.currentUser) {
		userData.set(data.currentUser);
	}

	const avatarPopup: PopupSettings = {
		event: 'click',
		target: 'avatarPopup',
		placement: 'bottom-end'
	};
</script>

<Toast />

<AppShell>
	<svelte:fragment slot="header">
		{#if $page.data.url != '/login'}
			<div in:fly={{ y: -15, duration: 200, delay: 200 }} out:fly={{ y: -15, duration: 200 }}>
				<AppBar class="!bg-surface-700">
					<svelte:fragment slot="lead">
						<!-- svelte-ignore a11y-no-static-element-interactions -->
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<!-- svelte-ignore a11y-missing-attribute -->
						<div class="flex flex-row items-center gap-2">
							<a class="text-xl uppercase cursor-pointer mr-12" on:click={() => goto('/')}
								>bpy-web</a
							>

							<a
								href="/leaderboards"
								class="btn {$page.data.url == '/leaderboards'
									? 'variant-ghost-surface '
									: ''}rounded-lg"
							>
								Leaderboards
							</a>
							<button class="btn rounded-lg">Donate</button>
						</div>
					</svelte:fragment>
					<svelte:fragment slot="trail">
						<div use:popup={avatarPopup}>
							<Avatar
								src="https://a.ez-pp.farm/{$userData?.id ?? 0}"
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
							<div class="arrow variant-filled-surface !left-[121px]" />
						</div>
					</svelte:fragment>
				</AppBar>
			</div>
		{/if}
	</svelte:fragment>
	{#key data.url}
		<div
			in:scale={{ start: 0.99, duration: 200, delay: 200 }}
			out:scale={{ start: 0.99, duration: 200 }}
		>
			<slot />
		</div>
	{/key}
</AppShell>
