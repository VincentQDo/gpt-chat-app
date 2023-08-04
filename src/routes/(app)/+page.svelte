<script lang="ts">
	import { onMount } from 'svelte';
	import ChatInput from '../../components/ChatInput.svelte';
	import ChatMessage from '../../components/ChatMessage.svelte';
	import { processStream } from '../../libs/chatInteractions';

	let messages: { role: string; content: string; typing?: boolean }[] = [
		{
			role: 'system',
			content: `Hello! You're currently speaking with an expert software engineer specializing in web development. I have a wealth of experience in Angular, C#, Svelte, and JavaScript. My purpose here is not only to assist but also to teach and help you understand better. Feel free to ask me anything!`
		}
	];

	async function sendMessage(event: { detail: { input: string } }) {
		messages.push({ role: 'user', content: event.detail.input });
		messages = [...messages];
		const headers = new Headers();
		headers.append('Content-Type', 'application/json');
		const bodyObj: { role: string; content: string }[] = [];
		messages.forEach((e) => {
			bodyObj.push({ role: e.role, content: e.content });
		});
		const requestOptions = {
			method: 'POST',
			headers: headers,
			body: JSON.stringify(bodyObj)
		};

		const response = await fetch('/api', requestOptions);
		if (response.body) {
			const reader = response.body.getReader();
			await processStream(
				reader,
				messages,
				(
					newMessages: { role: string; content: string; typing?: boolean }[]
				) => {
					console.log('messages callback function here: ', messages);
					messages = [...newMessages];
				}
			);
		}
	}

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
