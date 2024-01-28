<!-- src/lib/ButtonWrapper.svelte -->
<script lang="ts">
	export let styles = ''; // Allow passing extra classes
	export let type: 'button' | 'submit' | 'reset' = 'button';
	export let restProps = {}; // Catch-all for other props
</script>

<!-- bind class directive to allow additional classes and $$restProps to forward rest properties -->
<button
	on:click
	{type}
	class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 text-white bg-gray-700 hover:bg-gray-600 transition-colors duration-200 {styles}"
	{...restProps}
>
	<slot />
	<!-- Slot for button content -->
</button>
