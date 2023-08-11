export interface Message {
	role: 'system' | 'user' | 'assistant';
	content: string;
}

export interface AiResponseChunk {
	id: string;
	created: number;
	model: string;
	choices: {
		delta: { content: string };
		finish_reason: string | null | undefined;
		index: number;
	}[];
}
