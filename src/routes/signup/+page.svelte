<script lang="ts">
	import { goto } from '$app/navigation';
	import { env } from '$env/dynamic/public';
	import { appName } from '$lib/env';
	import { __ } from '$lib/language';
	import { userData, userLanguage } from '$lib/storage';
	import {
		ProgressRadial,
		getToastStore,
		type ToastSettings,
		focusTrap
	} from '@skeletonlabs/skeleton';
	import ChevronLeft from 'svelte-feathers/ChevronLeft.svelte';
	import User from 'svelte-feathers/User.svelte';
	import Key from 'svelte-feathers/Key.svelte';
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
				message: __('Please complete the captcha!', $userLanguage),
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
				message: __('Welcome back, {{val}}!', $userLanguage, {
					val: $userData?.username ?? loginData.username
				}),
				classes: '!bg-surface-800 !text-surface-200 !border-surface-700 !border'
			};
			toastStore.trigger(t);
			goto('/');
		} else {
			const t: ToastSettings = {
				message: __(loginResponse.message, $userLanguage),
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
	<div class="md:min-w-[450px] h-[500px] p-2 md:border md:border-surface-700 rounded-lg gap-3">
		<a
			class="block bg-white/5 hover:bg-white/10 transition-colors cursor-pointer rounded-full p-2 w-fit"
			href="/"
		>
			<ChevronLeft class="pointer-events-none" />
		</a>
		<div class="p-10">
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
						<p class="text-2xl font-normal">{__('Sign In', $userLanguage)}</p>
						<p class="mb-20">{__('Use your {{val}} Account', $userLanguage, { val: appName })}</p>
					</div>
					<input
						id="username"
						type="text"
						placeholder={__('Email or Username', $userLanguage)}
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
					<a href="/login" class="text-pink-700 me-auto mb-7"
						>{__('Forgot email?', $userLanguage)}</a
					>
					<div class="w-full flex flex-row justify-between mt-auto">
						<button
							class="btn variant-ghost-tertiary !bg-transparent hover:!bg-surface-100/5 ring-0"
							on:click={() => goto('/register')}>{__('Create account', $userLanguage)}</button
						>
						<button
							class="btn bg-pink-700"
							on:click={() => {
								if (loginData.username.length <= 3) {
									errored = true;
									return;
								}
								passwordMask = true;
							}}>{__('Next', $userLanguage)}</button
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
					<p class="text-2xl font-normal">{__('Welcome', $userLanguage)}</p>
					<p
						class="flex flex-row justify-center items-center gap-2 mt-2 mb-8 rounded-full !border-[1px] p-1 px-2 border-surface-700"
					>
						<User class="border border-white rounded-full" size={12} />
						{loginData.username}
					</p>
					<input
						id="password"
						type="password"
						placeholder={__('Password', $userLanguage)}
						class="border border-surface-700 !ring-pink-700 focus:!border-pink-700 bg-surface-900 rounded-lg p-4 text-[17px] w-full mb-2"
						bind:value={loginData.password}
						disabled={loading}
						on:keypress={(e) => {
							if (e.key === 'Enter') {
								performLogin();
							}
						}}
					/>
					{#if turnstileSiteKey}
						<Turnstile
							theme="dark"
							siteKey={turnstileSiteKey}
							on:turnstile-callback={handleCaptcha}
							on:turnstile-error={resetCaptcha}
							on:turnstile-expired={resetCaptcha}
							on:turnstile-timeout={resetCaptcha}
							bind:reset={resetCaptcha}
						/>
					{/if}
					<a href="/login" class="text-pink-700 me-auto mb-7"
						>{__('Forgot password?', $userLanguage)}</a
					>
					<div class="w-full flex flex-row justify-between mt-auto">
						<button
							class="btn variant-ghost-tertiary !bg-transparent hover:!bg-surface-100/5 ring-0"
							disabled={loading}
							on:click={() => (passwordMask = false)}
						>
							{__('Back', $userLanguage)}
						</button>
						<button class="btn bg-pink-700" on:click={performLogin} disabled={loading}>
							{#if loading}
								<ProgressRadial class="h-5 w-5" />
							{:else}
								{__('Login', $userLanguage)}
							{/if}
						</button>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>
