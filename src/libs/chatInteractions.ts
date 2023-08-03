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
