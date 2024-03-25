<script lang="ts">
	import { page } from '$app/stores';
	import { __ } from '$lib/language';
	import { userLanguage } from '$lib/storage';

	const errorCode = $page.status;
	const errorMessage = $page.error?.message;
</script>

<div class="container mx-auto w-full p-5">
	<div class="mx-auto card p-6 py-12">
		<div
			class="w-full flex flex-col lg:divide-x divide-surface-500 lg:flex-row items-center justify-around gap-5 lg:gap-2"
		>
			<div class="flex flex-col items-center justify-center">
				<p class="text-5xl">{errorCode}</p>
				<p class="text-xl">{errorMessage}</p>
				<a class="mx-auto mt-10 btn variant-filled-surface" href="/"
					>{__('Back to Home', $userLanguage)}</a
				>
			</div>
		</div>
	</div>
</div>
