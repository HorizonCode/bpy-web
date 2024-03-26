<script lang="ts">
	import { goto } from '$app/navigation';
	import { __ } from '$lib/language';
	import { userData, userLanguage } from '$lib/storage';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';

	const toastStore = getToastStore();

	onMount(async () => {
		const result = await fetch('/logout', {
			method: 'POST'
		});
		goto('/');
		if (result.ok) {
			toastStore.trigger({
				message: __('Logged out successfully!', $userLanguage),
				classes: '!bg-surface-800 !text-surface-200 !border-surface-700 !border'
			});
			userData.set(undefined);
		}
	});
</script>
