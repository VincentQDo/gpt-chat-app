<script lang="ts">
	import { onMount } from 'svelte';

	let input = '';
	let messages = [
		{
			role: 'system',
			content: `Hello! You're currently speaking with an expert software engineer specializing in web development. I have a wealth of experience in Angular, C#, Svelte, and JavaScript. My purpose here is not only to assist but also to teach and help you understand better. Feel free to ask me anything!`
		}
	];

	async function onKeyboardEnter(event: { key: string }) {
		if (event.key === 'Enter') {
			sendMessage();
		}
	}

	async function sendMessage() {
		messages.push({ role: 'user', content: input });
		const headers = new Headers();
		headers.append('Content-Type', 'application/json');
		const requestOptions = {
			method: 'POST',
			headers: headers,
			body: JSON.stringify(messages)
		};

		const response = await fetch('/api', requestOptions);
		if (response.body) {
			const reader = response.body.getReader();
			let chunks = [];
			let done = false;

			while (!done) {
				const { done: chunkDone, value } = await reader.read();
				if (chunkDone) {
					done = true;
				} else {
					chunks.push(value);
				}
			}

			// Concatenate all chunks
			const concatenatedChunks = chunks.reduce((accumulator, chunk) => {
				const tmp = new Uint8Array(accumulator.length + chunk.length);
				tmp.set(accumulator, 0);
				tmp.set(chunk, accumulator.length);
				return tmp;
			}, new Uint8Array());

			const text = new TextDecoder('utf-8').decode(concatenatedChunks);
			const data = JSON.parse(text);

			messages.push({ role: 'assistant', content: data.content });
			messages = [...messages];
			input = '';
		}
	}

	onMount(() => {
		// You may want to fetch the AI's first message from OpenAI's API
	});
</script>

<div class="h-screen bg-gray-800 text-white flex flex-col">
	<div class="overflow-auto p-4 space-y-4">
		{#each messages as message, i (i)}
			<div class="flex flex-col" class:items-end={message.role === 'user'}>
				<div
					class={`px-4 py-2 rounded-lg ${message.role === 'user' ? 'bg-blue-500' : 'bg-gray-600'}`}
				>
					{message.content}
				</div>
			</div>
		{/each}
	</div>

	<div class="mt-auto p-4 flex items-center space-x-4 bg-gray-900">
		<input
			class="flex-grow px-4 py-2 rounded-lg bg-gray-700"
			bind:value={input}
			on:keydown={onKeyboardEnter}
		/>
		<button class="px-4 py-2 rounded-lg bg-blue-500" on:click={sendMessage}>Send</button>
	</div>
</div>
