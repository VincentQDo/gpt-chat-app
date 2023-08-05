<script lang="ts">
	import { onMount } from 'svelte';
	import ChatInput from '../../components/ChatInput.svelte';
	import ChatMessage from '../../components/ChatMessage.svelte';
	import { processStream } from '../../libs/chatInteractions';
	import { messages, type apiBody as chatMessage } from '../../libs/store';

	const getApiResponse = (messages: chatMessage[]) => {
		header.append('Content-Type', 'application/json');	
		const requestOptions = {
			method: 'POST',
			headers: new Headers(),
			body: JSON.stringify(messages),
		};
		return fetch('/api', requestOptions);
	}
	async function sendMessage(event: { detail: { input: string } }) {
		messages.subscribe(async (messages) => {
			messages.push({ role: 'user', content: event.detail.input });
			messages = [...messages];
			const bodyObj: { role: string; content: string }[] = [];
			messages.forEach((e) => {
				bodyObj.push({ role: e.role, content: e.content });
			});
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
						localmessages = [...newMessages];
					}
				);
			}
		});
	}

	onMount(() => {
		// You may want to fetch the AI's first message from OpenAI's API
	});
</script>

<div class="h-screen bg-gray-800 text-white flex flex-col">
	<div class="overflow-auto p-4 space-y-4">
		{#each localmessages as message, i (i)}
			<ChatMessage {message} />
		{/each}
	</div>
	<ChatInput on:sendMessage={sendMessage} />
</div>
