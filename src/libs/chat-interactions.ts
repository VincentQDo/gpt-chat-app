import type { Message } from '../models/chat-models';

export const getApiResponse = (messages: Message[]) => {
	const header = new Headers();
	header.append('Content-Type', 'application/json');
	const requestOptions = {
		method: 'POST',
		headers: new Headers(),
		body: JSON.stringify(messages)
	};
	return fetch('/api', requestOptions);
};

export const scrollBottom = (element: HTMLElement) => {
	const eleHeight = element.scrollHeight;
	element.scrollTop = eleHeight;
};
