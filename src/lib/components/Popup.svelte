<script lang="ts">
	import type { Placement } from '@floating-ui/dom';
	import { popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import { makeid } from '../stringUtil';

	let popupUuid = makeid();
	export let event: 'hover' | 'click' | 'focus-blur' | 'focus-click' = 'hover';
	export let placement: Placement = 'top';

	const popupSettings: PopupSettings = {
		event,
		placement,
		target: 'popup-' + popupUuid
	};
</script>

<div class="w-fit inline-block" use:popup={popupSettings}>
	<slot />
</div>

<div data-popup={popupSettings.target}>
	<slot name="popup" />
</div>
