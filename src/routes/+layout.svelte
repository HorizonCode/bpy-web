<script lang="ts">
	import '../app.postcss';
	import { AppShell, AppBar, Avatar, type PopupSettings, popup } from '@skeletonlabs/skeleton';

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
	import { scale } from 'svelte/transition';
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

	export let data;

	const avatarPopup: PopupSettings = {
		event: 'click',
		target: 'avatarPopup',
		placement: 'bottom-end'
	};
</script>

<AppShell>
	<svelte:fragment slot="header">
		<AppBar>
			<svelte:fragment slot="lead">
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-missing-attribute -->
				<a class="text-xl uppercase cursor-pointer" on:click={() => goto('/')}>bpy-web</a>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				<div use:popup={avatarPopup}>
					<Avatar
						src="https://a.ez-pp.farm/0"
						class="!w-10 select-none cursor-pointer hover:ring hover:ring-gray-600 transition-all"
					/>
				</div>
				<div class="card p-4 variant-filled-surface" data-popup="avatarPopup">
					<div class="flex flex-col gap-2">
						<button
							class="w-32 btn variant-filled-surface rounded-lg"
							on:click={() => goto('/login')}>Login</button
						>
						<button
							class="w-32 btn variant-filled-surface rounded-lg"
							on:click={() => goto('/register')}>Register</button
						>
					</div>
					<div class="arrow variant-filled-surface !left-[121px]" />
				</div>
			</svelte:fragment>
		</AppBar>
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
