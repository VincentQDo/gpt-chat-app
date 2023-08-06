<script lang="ts">
	export let message: { role: string; content: string; typing?: boolean };
	console.log('Message here: ', message);
</script>

<div class="flex flex-col" class:items-end={message.role === 'user'}>
	<div
		class={`px-4 py-2 rounded-lg ${
			message.role === 'user' ? 'bg-blue-500' : 'bg-gray-600'
		}`}
	>
		{message.content}
		{#if message.typing}
			<span class="animate-pulse">|</span>
		{/if}
	</div>
</div>
