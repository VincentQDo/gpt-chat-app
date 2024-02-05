<script lang="ts">
	import type { HTMLInputTypeAttribute } from 'svelte/elements';

	export let name = '';
	export let id = '';
	export let type: HTMLInputTypeAttribute | undefined | null = 'text';
	export let userInput = '';
</script>

<input
	{type}
	{name}
	class="flex w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex-1 min-h-[20px] overflow-auto resize-none text-white bg-gray-700"
	{id}
	bind:value={userInput}
/>
