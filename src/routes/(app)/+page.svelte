<script lang="ts">
	import { onMount } from 'svelte';

	let input = '';
	let messages = [{ role: 'user', content: 'Hello, AI!' }];

	async function getAIResponse(message: string) {
		var myHeaders = new Headers();
		myHeaders.append('Content-Type', 'application/json');
		myHeaders.append('Authorization', 'Bearer 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');

		var raw = JSON.stringify({
			model: 'gpt-3.5-turbo',
			messages: [...messages, { role: 'user', content: message }]
		});

		var requestOptions = {
			method: 'POST',
			headers: myHeaders,
			body: raw,
			redirect: 'follow'
		};

		let response = await fetch('https://api.openai.com/v1/chat/completions', requestOptions);
		let data = await response.json();
		return data['choices'][0]['message']['content'];
	}

	function sendMessage(event: { key: string }) {
		if (event.key === 'Enter') {
			messages.push({ role: 'user', content: input });
			getAIResponse(input).then((response) => {
				messages.push({ role: 'assistant', content: response });
				messages = [...messages];
			});
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
				getAIResponse(input).then((response) => {
					messages.push({ role: 'ai', content: response });
					messages = [...messages];
				});
				input = '';
			}}>Send</button
		>
	</div>
</div>
