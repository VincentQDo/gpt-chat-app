<script lang="ts">
	import ChatMessage from '../../components/ChatMessage.svelte';
	import type { Message } from '../../models/chat-models';
	import {
		decodeAiResponse,
		getApiResponse
	} from '../../libs/chat-interactions';
	import { dev } from '$app/environment';
	import ConversationCard from '../../components/ConversationCard.svelte';
	import Button from '../../components/Button.svelte';

	let messages: Message[] = [];
	let inputText: string = '';
	const sendMessage = async (event: FormDataEvent) => {
		event.preventDefault();
		messages.push({
			senderType: 'user',
			messageText: inputText,
			createdAt: new Date(),
			chatSessionId: '',
			messageId: ''
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
				messages.push({
					senderType: 'assistant',
					messageText: aiReply,
					chatSessionId: '',
					createdAt: new Date(),
					messageId: ''
				});
			} else {
				messages[messages.length - 1].messageText = aiReply;
			}
			messages = [...messages];
			isAiTyping = true;
		}
		if (dev) {
			console.log('Message object: ', messages);
		}
	};

	// Function to handle key down events in the textarea
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			const target = event.target as HTMLTextAreaElement;
			target.form?.requestSubmit();
		}
	}
</script>

<div class="grid h-screen grid-cols-[300px_1fr] dark:bg-gray-900">
	<aside
		class="border-r border-gray-700 bg-gray-800 transition-colors duration-200"
	>
		<div class="p-4">
			<h2 class="text-lg font-semibold text-white">Conversations</h2>
			<ul class="mt-4 space-y-2">
				<ConversationCard chatTitle="Chat 1" timeStamp="09.45 AM" />
			</ul>
		</div>
	</aside>
	<main class="flex flex-col bg-gray-900">
		<div class="flex-1 overflow-y-auto p-4 space-y-4 text-center">
			{#each messages as message}
				<ChatMessage userInitial="U" message={message.messageText} />
			{/each}
		</div>
		<div class="border-t border-gray-700 p-4 bg-gray-800">
			<form
				class="flex items-center space-x-2"
				method="post"
				on:submit={sendMessage}
			>
				<textarea
					bind:value={inputText}
					on:keydown={handleKeydown}
					class="flex w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex-1 min-h-[20px] overflow-auto resize-none text-white bg-gray-700"
					placeholder="Type your message here."
					name="inputText"
				/>
				<Button type="submit">Send</Button>
			</form>
		</div>
	</main>
</div>
