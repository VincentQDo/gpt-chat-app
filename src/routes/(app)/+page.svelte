<script lang="ts">
	import { onMount } from 'svelte';
	import ChatInput from '../../components/ChatInput.svelte';
	import ChatMessage from '../../components/ChatMessage.svelte';
	import type { AiResponseChunk, Message } from '../../models/chat-models';
	import { getApiResponse, scrollBottom } from '../../libs/chat-interactions';
	import { dev } from '$app/environment';

	let messages: Message[] = [
		{
			role: 'system',
			content:
				"Hello! You're currently speaking with an expert software engineer specializing in web development. I have a wealth of experience in Angular, C#, Svelte, and JavaScript. My purpose here is not only to assist but also to teach and help you understand better. Feel free to ask me anything!"
		}
	];

	let testMessaages: Message[] = [
		{
			role: 'user',
			content:
				'I need a long message with line breaks, code blocks, and all kind of markdown for testing purposes.\n\nthis is a test for my rendering of mark down on a web page.'
		},
		{
			role: 'assistant',
			content:
				'Sure! Here\'s a long message with line breaks, code blocks, and various markdown elements:\n\n# Testing Markdown Rendering\n\nHello! This is a test to see how well my web page renders Markdown. Markdown is a lightweight markup language that allows you to easily format text without using HTML tags.\n\n## Line Breaks\n\nThis is a paragraph of text.  \nHere is another line of text.  \nAnd yet another line of text.\n\n## Code Blocks\n\n```\n// This is a code block in JavaScript\nfunction helloWorld() {\n  console.log("Hello, world!");\n}\n```\n\n```python\n# This is a code block in Python\ndef say_hello():\n    print("Hello, world!")\n```\n\n## Headings\n\n### Heading 1\n#### Heading 2\n##### Heading 3\n###### Heading 4\n####### Heading 5 (Invalid, treated as regular text)\n\n## Emphasis and Strong emphasis\n\nThis text is *emphasized* using single asterisks.\nThis text is _emphasized_ using underscores.\n\nThis text is **strongly emphasized** using double asterisks.\nThis text is __strongly emphasized__ using double underscores.\n\n## Lists\n\n### Unordered List\n\n- Item 1\n- Item 2\n- Item 3\n\n### Ordered List\n\n1. First item\n2. Second item\n3. Third item\n\n## Links and Images\n\nHere is a [link](https://www.example.com) to a website.\n\n![Markdown logo](https://upload.wikimedia.org/wikipedia/commons/4/48/Markdown-mark.svg)\n\n## Blockquotes\n\n> This is a blockquote. It is used to highlight text or quote someone.\n\n## Horizontal Rule\n\n---\n\nThat\'s it for now! I hope my Markdown rendering is working properly and this message looks well-formatted on the web page. Let me know if you have any questions or need further assistance!\n\n'
		}
	];

	if (dev) {
		messages = messages.concat(testMessaages);
	}

	// This is here to track incomplete data from the buffer. The bugger could give us half the response in one chunk and the other half in another
	// This is here to help facilitate that partial chunk
	let partialData: string | undefined = '';
	let messageContainer: HTMLElement;

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
		// we need to filter out [DONE] from the array because the last chunk of the stream could include useful data
		// which we would miss if we just do an if condition like so (if (decodedData.includes('[DONE]'))). That if condition
		// would just completely remove all the data from the last chunk of the response because [DONE] was included
		// in that chunk
		const actualData = decodedDataArr.filter(
			(e) => e.length > 0 && !e.includes('[DONE]')
		);
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
			scrollBottom(messageContainer);
			isAiTyping = true;
		}
	};

	onMount(() => {
		// You may want to fetch the AI's first message from OpenAI's API
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
