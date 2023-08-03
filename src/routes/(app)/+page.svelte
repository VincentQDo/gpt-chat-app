<script lang="ts">
	import { onMount } from 'svelte';
	import ChatInput from '../../components/ChatInput.svelte';
	import ChatMessage from '../../components/ChatMessage.svelte';
	import { typeMessage } from '../../libs/chatInteractions';

	let messages: { role: string; content: string; typing?: boolean }[] = [
		{
			role: 'system',
			content: `Hello! You're currently speaking with an expert software engineer specializing in web development. I have a wealth of experience in Angular, C#, Svelte, and JavaScript. My purpose here is not only to assist but also to teach and help you understand better. Feel free to ask me anything!`
		}
	];

	async function sendMessage(event: { detail: { input: string } }) {
		console.log('event dtail', event);
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
			let partialData: string | undefined = '';

			reader
				.read()
				.then(async function process({
					done,
					value
				}): Promise<
					| void
					| ReadableStreamReadValueResult<Uint8Array>
					| ReadableStreamReadDoneResult<Uint8Array>
					| undefined
				> {
					if (done) {
						return;
					}

					const decoder = new TextDecoder('utf-8');
					let data = decoder.decode(value) + partialData;
					let lines = data.split('\n');

					if (!data.endsWith('\n')) {
						partialData = lines.pop();
					} else {
						partialData = '';
					}

					lines.forEach((line) => {
						if (!line.includes('[DONE]')) {
							if (line.startsWith('data: ')) {
								let json = JSON.parse(line.substring(6));
								if (json.choices && json.choices[0].delta.content) {
									messages = typeMessage(
										json.choices[0].delta.content,
										messages
									);
								}
							}
						} else {
							// Stream is finished, you could do something here if needed
							let lastMessage = messages[messages.length - 1];
							if (lastMessage.role === 'ai-typing') {
								setTimeout(() => {
									lastMessage.role = 'assistant';
									lastMessage.typing = false;
									messages = [...messages]; // Trigger reactivity
								}, 100);
							}
						}
					});

					return reader.read().then(process);
				});
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
