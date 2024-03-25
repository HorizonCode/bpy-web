<script lang="ts">
	import { getTimeAgo } from '$lib/time';

	export let language: string;
	export let date: Date;

	$: ago = getTimeAgo(date, language);
</script>

{ago}
