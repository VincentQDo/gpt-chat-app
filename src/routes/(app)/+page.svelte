<script lang="ts">
	import { onMount } from 'svelte';
	import ChatInput from '../../components/ChatInput.svelte';
	import ChatMessage from '../../components/ChatMessage.svelte';
	import { processStream } from '../../libs/chatInteractions';
	import { messages, type Message } from '../../libs/store';

	const getApiResponse = (messages: Message[]) => {
		const header = new Headers();
		header.append('Content-Type', 'application/json');
		const requestOptions = {
			method: 'POST',
			headers: new Headers(),
			body: JSON.stringify(messages)
		};
		return fetch('/api', requestOptions);
	};
	const sendMessage = (event: { detail: { input: string } }) => {};

	onMount(() => {
		// You may want to fetch the AI's first message from OpenAI's API
	});
</script>

<div class="h-screen bg-gray-800 text-white flex flex-col">
	<div class="overflow-auto p-4 space-y-4">
		{#each $messages as message, i (i)}
			<ChatMessage {message} />
		{/each}
	</div>
	<ChatInput on:sendMessage={sendMessage} />
</div>
