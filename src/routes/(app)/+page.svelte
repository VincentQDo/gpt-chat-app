<script lang="ts">
	import { onMount } from 'svelte';
	import ChatInput from '../../components/ChatInput.svelte';
	import ChatMessage from '../../components/ChatMessage.svelte';
	import type { AiResponseChunk, Message } from '../../models/chat-models';
	import { getApiResponse } from '../../libs/chat-interactions';

	let messages: Message[] = [
		{
			role: 'system',
			content: `Hello! You're currently speaking with an expert software engineer specializing in web development. I have a wealth of experience in Angular, C#, Svelte, and JavaScript. My purpose here is not only to assist but also to teach and help you understand better. Feel free to ask me anything!`
		}
	];

	// This is here to track incomplete data from the buffer. The bugger could give us half the response in one chunk and the other half in another
	// This is here to help facilitate that partial chunk
	let partialData: string | undefined = '';

	const decodeAiResponse = (value: any) => {
		const decoder = new TextDecoder('utf-8');
		const decodedData = partialData + decoder.decode(value);
		const decodedDataArr = decodedData.split('\n');
		// If the buffer response doesn't end with new line that means the last
		// resposne from the chunk is incomplete. pop that response out and keep that in the running partial data
		// and we will decode that piece with a later chunk
		if (!decodedData.endsWith('\n')) {
			partialData = decodedDataArr.pop();
		} else {
			partialData = '';
		}
		if (!decodedData.includes('[DONE]')) {
			const actualData = decodedDataArr.filter((e) => e.length > 0);
			try {
				const jsonData: AiResponseChunk[] = actualData.map((e) =>
					JSON.parse(e.slice(5))
				);
				const aiResponse = jsonData.flatMap((e) =>
					e.choices.flatMap((d) => d.delta.content)
				);
				return aiResponse;
			} catch (error) {
				console.error(error);
				console.error('Error while parsing buffer response: ', decodedData);
				return '{error}';
			}
		}
	};

	const sendMessage = async (event: { detail: { input: string } }) => {
		const input = event.detail.input;
		messages.push({ role: 'user', content: input });
		messages = [...messages];
		const response: Response = await getApiResponse(messages);
		const reader = response.body?.getReader();
		let value, done;
		let aiResponseFlatten: string[] = [];
		let isAiTyping = false;
		while (!done) {
			({ value, done } = await reader!.read());
			aiResponseFlatten = [
				...aiResponseFlatten.concat(decodeAiResponse(value) as string[])
			];
			const aiReply = aiResponseFlatten.join('');
			if (!isAiTyping) {
				messages.push({ role: 'assistant', content: aiReply });
			} else {
				messages[messages.length - 1].content = aiReply;
			}
			messages = [...messages];
			isAiTyping = true;
		}
	};

	onMount(() => {
		// You may want to fetch the AI's first message from OpenAI's API
	});
</script>

<div class="h-screen bg-gray-800 text-white flex flex-col">
	<div class="overflow-auto p-4 space-y-4">
		{#each messages as message, i (i)}
			{#if i > 0}
				<ChatMessage {message} />
			{/if}
		{/each}
	</div>
	<ChatInput on:sendMessage={sendMessage} />
</div>
