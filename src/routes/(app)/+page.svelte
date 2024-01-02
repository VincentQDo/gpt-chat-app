<script lang="ts">
	import { afterUpdate, onMount } from 'svelte';
	import ChatInput from '../../components/ChatInput.svelte';
	import ChatMessage from '../../components/ChatMessage.svelte';
	import type { Message } from '../../models/chat-models';
	import {
		decodeAiResponse,
		getApiResponse
	} from '../../libs/chat-interactions';
	import { dev } from '$app/environment';

	let messages: Message[] = [];

	let messageContainer: HTMLElement;

	const sendMessage = async (event: { detail: { input: string } }) => {
		const input = event.detail.input;
		messages.push({
			senderType: 'user',
			messageText: input,
			createdAt: new Date()
		});
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

<div class="h-full w-screen text-white flex flex-col">
	<div class="flex">
		<div>
			<ul>
				{#each conversations as conversation, i}
					<li>conversation.title</li>
				{/each}
			</ul>
		</div>
		<div class="overflow-auto p-4 space-y-4" bind:this={messageContainer}>
			<ChatMessage message={{ role: 'user', content: 'test message' }} />
			{#each messages as message, i (i)}
				{#if message.role !== 'system'}
					<ChatMessage {message} />
				{/if}
			{/each}
		</div>
	</div>
	<ChatInput on:sendMessage={sendMessage} />
</div>
