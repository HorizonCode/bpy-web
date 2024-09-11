<script lang="ts">
	import type { Placement } from '@floating-ui/dom';
	import { popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import { makeid } from '../stringUtil';
	import { twMerge } from 'tailwind-merge';

	let popupUuid = makeid();
	export let event: 'hover' | 'click' | 'focus-blur' | 'focus-click' = 'hover';
	export let placement: Placement = 'top';

  $: cssProps = $$props.class;
	$: classList = twMerge(cssProps, [`w-fit inline-block`]);

	const popupSettings: PopupSettings = {
		event,
		placement,
		target: 'popup-' + popupUuid
	};
</script>

<div class="{classList}" use:popup={popupSettings}>
	<slot />
</div>

<div data-popup={popupSettings.target}>
	<slot name="popup" />
</div>
