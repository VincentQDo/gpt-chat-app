export interface NewMesage {
	chatSessionId: string;
	senderType: 'system' | 'user' | 'assistant';
	messageText: string;
	userInitial: string;
}

export interface Message extends NewMesage {
	messageId: string;
	createdAt: number;
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

export interface ChatSession {
	sessionId: string;
	userUuid: string;
	createdAt: Date;
}
