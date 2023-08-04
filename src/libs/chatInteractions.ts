export async function processStream(
	reader: ReadableStreamDefaultReader<Uint8Array>,
	messages: { role: string; content: string; typing?: boolean }[],
	callbackFn: (
		arg0: { role: string; content: string; typing?: boolean }[]
	) => void
) {
	const { done, value } = await reader.read();
	if (done) {
		return;
	}
	let partialData: string | undefined = '';
	const decoder = new TextDecoder('utf-8');
	const data = decoder.decode(value) + partialData;
	const lines = data.split('\n');

	if (!data.endsWith('\n')) {
		partialData = lines.pop();
	} else {
		partialData = '';
	}
	let newMessages = [...messages];
	lines.forEach((line) => {
		{
			if (!line.includes('[DONE]')) {
				if (line.startsWith('data: ')) {
					const json = JSON.parse(line.substring(6));
					if (json.choices && json.choices[0].delta.content) {
						console.log('typing messages here:');
						newMessages = typeMessage(
							json.choices[0].delta.content,
							newMessages
						);
					}
				}
			} else {
				// Stream is finished, you could do something here if needed
				console.log('stream is done now');
				const lastMessage = newMessages[newMessages.length - 1];
				if (lastMessage.role === 'ai-typing') {
					setTimeout(() => {
						lastMessage.role = 'assistant';
						lastMessage.typing = false;
						console.log('calling callback function.');
						callbackFn([...newMessages]); // Trigger reactivity
					}, 100);
				}
			}
		}
	});
}

export function typeMessage(
	chunk: string,
	messages: { role: string; content: string; typing?: boolean }[]
) {
	let lastMessage = messages[messages.length - 1];
	if (lastMessage.role !== 'ai-typing') {
		// Create a new AI-typing message
		const typingMessage = { role: 'ai-typing', content: '', typing: true };
		messages = [...messages, typingMessage];
		lastMessage = typingMessage;
	}
	// Append the chunk to the content of the AI-typing message
	lastMessage.content += chunk;
	return messages;
}
