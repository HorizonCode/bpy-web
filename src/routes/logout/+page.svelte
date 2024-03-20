<script lang="ts">
	import { goto } from '$app/navigation';
	import { userData } from '$lib/storage';
	import { getToastStore } from '@skeletonlabs/skeleton';

	const toastStore = getToastStore();

	(async () => {
		const result = await fetch('/logout', {
			method: 'POST'
		});
		goto('/');
		if (result.ok) {
			toastStore.trigger({
				message: `Logged out!`,
				classes: '!bg-surface-800 !text-surface-200 !border-surface-700 !border'
			});
			userData.set(undefined);
		}
	})();
</script>
