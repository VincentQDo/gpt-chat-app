<script lang="ts">
	import { onMount } from 'svelte';
	import ChatInput from '../../components/ChatInput.svelte';
	import ChatMessage from '../../components/ChatMessage.svelte';
	import { processStream } from '../../libs/chatInteractions';

	interface Message {
		role: 'system' | 'user' | 'assistant';
		content: string;
	}

	const messages: Message[] = [
		{
			role: 'system',
			content: `Hello! You're currently speaking with an expert software engineer specializing in web development. I have a wealth of experience in Angular, C#, Svelte, and JavaScript. My purpose here is not only to assist but also to teach and help you understand better. Feel free to ask me anything!`
		}
	];

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
	const sendMessage = async (event: { detail: { input: string } }) => {
		const input = event.detail.input;
		messages.push({ role: 'user', content: input });
		const response: Response = await getApiResponse(messages);
		const reader = response.body?.getReader();
		let value, done;
		while (!done) {
			({ value, done } = await reader!.read());
			const decoder = new TextDecoder('utf-8');
			const decodedData = decoder.decode(value);
			const decodedDataArr = decodedData.split('\n');
			if (!decodedData.includes('[DONE]')) {
				const actualData = decodedDataArr.filter((e) => e.length > 0);
				actualData.forEach((e) => console.log(JSON.parse(JSON.parse(e))));
			}
		}
	};

	onMount(() => {
		// You may want to fetch the AI's first message from OpenAI's API
	});
</script>

<div class="h-screen bg-gray-800 text-white flex flex-col">
	<div class="overflow-auto p-4 space-y-4">
		{#each messages as message, i (i)}
			<ChatMessage {message} />
		{/each}
	</div>
	<ChatInput on:sendMessage={sendMessage} />
</div>
