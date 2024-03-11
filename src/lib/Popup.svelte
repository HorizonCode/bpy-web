<script lang="ts">
	import type { Placement } from '@floating-ui/dom';
	import { popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import { makeid } from './stringUtil';

	let popupUuid = makeid();
	export let event: 'hover' | 'click' | 'focus-blur' | 'focus-click' = 'hover';
	export let placement: Placement = 'top';
	export let text: string;

	const popupSettings: PopupSettings = {
		event,
		placement,
		target: 'popup-' + popupUuid
	};
</script>

<div class="w-fit inline-block" use:popup={popupSettings}>
	<slot />
</div>
<div class="card p-2 px-4 rounded-lg variant-filled-surface" data-popup={popupSettings.target}>
	{text}
	<div class="arrow border-l border-b border-gray-700 variant-filled-surface"></div>
</div>
