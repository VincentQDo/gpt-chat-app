<script lang="ts">
	import ChatMessage from '../../components/ChatMessage.svelte';
	import type { Message } from '../../../../shared/models/chat-models';
	import ConversationCard from '../../components/ConversationCard.svelte';
	import Button from '../../components/Button.svelte';

	let messages: Message[] = [];
	let inputText: string = '';

	function onClickHandler(event: MouseEvent) {
		const newMessage = {
			chatSessionId: 'testID',
			createdAt: Date.now(),
			messageId: 'messageId',
			messageText: inputText,
			senderType: 'user',
			userInitial: 'U'
		} as Message;
		messages = [...messages, newMessage];
		inputText = '';
		sendMessage(messages);
	}

	function sendMessage(messages: Message[]) {
		// send message to backend
		// don't want to use sveltekit server methods because we want to perform
		// all these logic on client side so no hosting fee
		// we host frontend on vercel and let backend on separte hosting service
		// handle the long lasting request sicne vercel don't allow requests longer than 10s
		const url = '';
		fetch(url, {
			method: 'post',
			body: JSON.stringify(messages),
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			}
		}).then((e) => console.log('received data: ', e));
		console.log('Messages: ', messages);
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
				<ChatMessage
					userInitial={message.userInitial}
					message={message.messageText}
				/>
			{/each}
		</div>
		<div class="border-t border-gray-700 p-4 bg-gray-800">
			<form class="flex items-center space-x-2" method="post">
				<textarea
					bind:value={inputText}
					class="flex w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex-1 min-h-[20px] overflow-auto resize-none text-white bg-gray-700"
					placeholder="Type your message here."
					name="inputText"
				/>
				<Button type="button" on:click={onClickHandler}>Send</Button>
			</form>
		</div>
	</main>
</div>
