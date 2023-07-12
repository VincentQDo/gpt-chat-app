<script lang="ts">
	import { onMount } from 'svelte';

	let input = '';
	let messages = [
		{
			role: 'system',
			content:
				'You are an expert software engineer who specialized in web development. Your area of expertise are Angular, C#, Svelte, and Javascript. You are also a generally knowledgable person who is approachable and always willing to help teach people'
		}
	];

	async function sendMessage(event: { key: string }) {
		if (event.key === 'Enter') {
			messages.push({ role: 'user', content: input });
			const headers = new Headers();
			headers.append('Content-Type', 'application/json');
			const requestOptions = {
				method: 'POST',
				headers: headers,
				body: JSON.stringify(messages)
			};

			const data = await (await fetch('/api', requestOptions)).json();
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
			on:keydown={sendMessage}
		/>
		<button
			class="px-4 py-2 rounded-lg bg-blue-500"
			on:click={() => {
				messages.push({ role: 'user', content: input });
				// getAIResponse(input).then((response) => {
				// 	messages.push({ role: 'ai', content: response });
				// 	messages = [...messages];
				// });
				input = '';
			}}>Send</button
		>
	</div>
</div>
