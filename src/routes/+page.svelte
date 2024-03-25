<script>
	import { appName } from '$lib/env';

	export let data;
</script>

<svelte:head>
	<title>{appName} :: Home</title>
</svelte:head>

<div class="h-full w-screen">
	<div class="bg-primary-500/30 w-screen h-full">
		<div class="h-full flex flex-col justify-center items-center text-center gap-5">
			<div class="flex flex-col gap-10">
				<h1 class="h1 font-bold">{appName}</h1>
				<h4 class="h4">
					bpy-web is a frontend for bancho.py made with modern frameworks for the best user
					experience.
				</h4>
			</div>
			<div class="flex flex-row gap-3">
				<a class="btn variant-filled-surface rounded-lg font-semibold" href="/signup"> Sign Up </a>
				<a class="btn variant-filled-tertiary rounded-lg" href="/signin"> Login </a>
			</div>
			<div class="flex flex-row gap-3">
				<p class="bg-black/50 rounded-full py-1 px-6">
					<span class="font-bold text-green-400">{data.userCounts?.counts.online}</span> online users
				</p>
				<p class="bg-black/50 rounded-full py-1 px-6">
					<span class="font-bold text-primary-400">{data.userCounts?.counts.total}</span> registered
					users
				</p>
			</div>
		</div>
	</div>
</div>
