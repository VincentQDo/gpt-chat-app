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
	import Prism from 'prismjs';

	let messages: Message[] = [
		{
			role: 'system',
			content:
				"Hello! You're currently speaking with an expert software engineer specializing in web development. I have a wealth of experience in Angular, C#, Svelte, and JavaScript. My purpose here is not only to assist but also to teach and help you understand better. Feel free to ask me anything!"
		}
	];

	let testMessaages: Message[] = [
		{
			role: 'assistant',
			content:
				'Certainly! Here\'s a long message with different types of markdowns and code blocks in various languages:\n\n# Markdown Testing\n\nHello! This is a test to check the functionality of my markdown processor. Markdown is a simple markup language that allows you to easily format text for web pages and documentation.\n\n## Headings\n\n### Heading 1\n#### Heading 2\n##### Heading 3\n###### Heading 4\n####### Heading 5 (Invalid, treated as regular text)\n\n## Emphasis\n\nThis text is *italic* using single asterisks.\nThis text is _italic_ using single underscores.\n\nThis text is **bold** using double asterisks.\nThis text is __bold__ using double underscores.\n\nThis text is ***bold and italic*** using triple asterisks.\nThis text is ___bold and italic___ using triple underscores.\n\n## Lists\n\n### Unordered List\n\n- Item 1\n- Item 2\n  - Subitem 2.1\n  - Subitem 2.2\n- Item 3\n\n### Ordered List\n\n1. First item\n2. Second item\n   1. Subitem 2.1\n   2. Subitem 2.2\n3. Third item\n\n## Links\n\nHere is a [link](https://www.example.com) to a website.  \nYou can also include links like <https://www.example.com> without displaying the URL.\n\n## Images\n\n![Markdown logo](https://upload.wikimedia.org/wikipedia/commons/4/48/Markdown-mark.svg)\n\n## Code Blocks\n\n```javascript\n// This is a code block in JavaScript\nfunction helloWorld() {\n  console.log("Hello, world!");\n}\n```\n\n```python\n# This is a code block in Python\ndef say_hello():\n    print("Hello, world!")\n```\n\n```bash\n# This is a code block in Bash\necho "Hello, world!"\n```\n\n## Blockquotes\n\n> This is a blockquote. It is used to highlight text or quote someone.\n\n## Tables\n\n| Name   | Age | Gender |\n|--------|-----|--------|\n| John   | 25  | Male   |\n| Mary   | 30  | Female |\n| Andrew | 40  | Male   |\n\n## Horizontal Rule\n\n---\n\nThat\'s all for now! I hope my markdown processor works well for this long message with different markdown elements and code blocks. If you have any questions or need further assistance, feel free to ask!'
		}
	];

	if (dev) {
		messages = messages.concat(testMessaages);
	}

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
