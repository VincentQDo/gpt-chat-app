<script lang="ts">
	export let chatTitle = '';
	export let timeStamp = '';
</script>

<li
	class="p-2 border border-gray-700 rounded-md hover:bg-gray-700 transition-colors duration-100 hover:text-accent-foreground"
>
	<button
		class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 w-full text-left text-white"
	>
		{chatTitle}
		<span class="text-xs text-gray-400"> {timeStamp} </span></button
	>
</li>
