<script lang="ts">
	import { goto } from '$app/navigation';
	import { env } from '$env/dynamic/public';
	import { appName } from '$lib/env';
	import { userData } from '$lib/storage';
	import {
		ProgressRadial,
		getToastStore,
		type ToastSettings,
		focusTrap
	} from '@skeletonlabs/skeleton';
	import { User, Key } from 'svelte-feathers';
	import { Turnstile } from 'svelte-turnstile';
	import { fly, scale } from 'svelte/transition';

	const turnstileSiteKey = env.PUBLIC_TURNSTILE_SITE_KEY;

	const toastStore = getToastStore();

	const loginData = {
		username: '',
		password: '',
		captchaToken: ''
	};
	let errored = false;
	let passwordMask = false;
	let resetCaptcha: () => void | undefined;

	let loading = false;

	const handleCaptcha = (event: CustomEvent<{ token: string }>) => {
		loginData.captchaToken = event.detail.token;
	};

	const performLogin = async () => {
		if (turnstileSiteKey && loginData.captchaToken.length <= 0) {
			toastStore.trigger({
				message: 'Please complete the captcha!',
				classes: '!bg-red-700 !text-surface-100 !border-red-600 !border'
			});
			return;
		}
		loading = true;
		const loginRequest = await fetch(window.location.href, {
			method: 'POST',
			body: JSON.stringify(loginData),
			headers: {
				'Content-Type': 'application/json'
			}
		});
		const loginResponse = await loginRequest.json();
		if (loginRequest.ok) {
			userData.set(loginResponse.user);
			const t: ToastSettings = {
				message: `Welcome back, ${$userData?.username}`,
				classes: '!bg-surface-800 !text-surface-200 !border-surface-700 !border'
			};
			toastStore.trigger(t);
			goto('/');
		} else {
			const t: ToastSettings = {
				message: loginResponse.message,
				classes: '!bg-red-700 !text-surface-100 !border-red-600 !border'
			};
			toastStore.trigger(t);
			loading = false;
			errored = true;
			passwordMask = false;
			resetCaptcha?.();
		}
	};
</script>

<svelte:head>
	<title>{appName} :: Login</title>
</svelte:head>

<div class="w-screen h-screen flex flex-col justify-center items-center">
	<div class="md:min-w-[450px] h-[500px] p-12 md:border md:border-surface-700 rounded-lg gap-3">
		{#if !passwordMask}
			<div
				class="w-full h-full flex flex-col justify-center items-center"
				in:fly={{ x: -10, duration: 200, delay: 200 }}
				out:fly={{ x: -10, duration: 200 }}
				use:focusTrap={true}
			>
				<div in:scale={{ start: 0.9, delay: 200, duration: 400 }}>
					<User size={45} class="!outline-none !border-none" />
				</div>
				<div class="text-center">
					<p class="text-2xl font-normal">Sign in</p>
					<p class="mb-20">Use your bpy-web Account</p>
				</div>
				<input
					id="username"
					type="text"
					placeholder="Email or Username"
					on:input={() => (errored = false)}
					on:keypress={(e) => {
						if (e.key === 'Enter') {
							if (loginData.username.length <= 3) {
								errored = true;
								return;
							}
							passwordMask = true;
						}
					}}
					class="border border-surface-700 bg-surface-900 rounded-lg !ring-pink-700 focus:!border-pink-700 p-4 text-[17px] mb-2 w-full transition-colors {errored
						? 'input-error'
						: ''}"
					bind:value={loginData.username}
				/>
				<a href="/login" class="text-pink-700 me-auto mb-7">Forgot email?</a>
				<div class="w-full flex flex-row justify-between mt-auto">
					<button
						class="btn variant-ghost-tertiary !bg-transparent hover:!bg-surface-100/5 ring-0"
						on:click={() => goto('/register')}>Create account</button
					>
					<button
						class="btn bg-pink-700"
						on:click={() => {
							if (loginData.username.length <= 3) {
								errored = true;
								return;
							}
							passwordMask = true;
						}}>Next</button
					>
				</div>
			</div>
		{:else}
			<div
				class="w-full h-full flex flex-col justify-center items-center"
				in:fly={{ x: 10, duration: 200, delay: 200 }}
				out:fly={{ x: 10, duration: 200 }}
				use:focusTrap={true}
			>
				<div in:scale={{ start: 0.9, delay: 200, duration: 400 }}>
					<Key size={45} />
				</div>
				<p class="text-2xl font-normal">Welcome</p>
				<p
					class="flex flex-row justify-center items-center gap-2 mt-2 mb-8 rounded-full !border-[1px] p-1 px-2 border-surface-700"
				>
					<User class="border border-white rounded-full" size={12} />
					{loginData.username}
				</p>
				<input
					id="password"
					type="password"
					placeholder="Password"
					class="border border-surface-700 !ring-pink-700 focus:!border-pink-700 bg-surface-900 rounded-lg p-4 text-[17px] w-full mb-2"
					bind:value={loginData.password}
					disabled={loading}
					on:keypress={(e) => {
						if (e.key === 'Enter') {
							performLogin();
						}
					}}
				/>
				<Turnstile
					theme="dark"
					siteKey={turnstileSiteKey}
					on:turnstile-callback={handleCaptcha}
					on:turnstile-error={resetCaptcha}
					on:turnstile-expired={resetCaptcha}
					on:turnstile-timeout={resetCaptcha}
					bind:reset={resetCaptcha}
				/>
				<a href="/login" class="text-pink-700 me-auto mb-7">Forgot password?</a>
				<div class="w-full flex flex-row justify-between mt-auto">
					<button
						class="btn variant-ghost-tertiary !bg-transparent hover:!bg-surface-100/5 ring-0"
						disabled={loading}
						on:click={() => (passwordMask = false)}
					>
						Back
					</button>
					<button class="btn bg-pink-700" on:click={performLogin} disabled={loading}>
						{#if loading}
							<ProgressRadial class="h-5 w-5" />
						{:else}
							Login
						{/if}
					</button>
				</div>
			</div>
		{/if}
	</div>
</div>
