<script lang="ts">
	import { getTimeAgo, secondsToHours } from '$lib/time';

	export let language: string;
	export let seconds: number;

	$: hours = secondsToHours(seconds, language);
</script>

{hours}
