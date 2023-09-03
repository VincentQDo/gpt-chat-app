<script lang="ts">
	import { afterUpdate, onMount } from 'svelte';
	import ChatInput from '../../components/ChatInput.svelte';
	import ChatMessage from '../../components/ChatMessage.svelte';
	import type { Message } from '../../models/chat-models';
	import {
		decodeAiResponse,
		getApiResponse,
		scrollBottom
	} from '../../libs/chat-interactions';
	import { dev } from '$app/environment';

	let messages: Message[] = [];

	let messageContainer: HTMLElement;

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
				...aiResponseFlatten.concat(decodeAiResponse(value).aiResponse)
			];
			const aiReply = aiResponseFlatten.join('');
			if (!isAiTyping) {
				messages.push({ role: 'assistant', content: aiReply });
			} else {
				messages[messages.length - 1].content = aiReply;
			}
			messages = [...messages];
			scrollBottom(messageContainer);
			isAiTyping = true;
		}
		if (dev) {
			console.log('Message object: ', messages);
		}
	};

	onMount(() => {
		// You may want to fetch the AI's first message from OpenAI's API
	});

	afterUpdate(() => {
		// @ts-ignore
		Prism.highlightAll();
	});
</script>

<div class="h-full w-screen bg-gray-800 text-white flex flex-col">
	<div class="overflow-auto p-4 space-y-4" bind:this={messageContainer}>
		{#each messages as message, i (i)}
			{#if i > 0}
				<ChatMessage {message} />
			{/if}
		{/each}
	</div>
	<ChatInput on:sendMessage={sendMessage} />
</div>
