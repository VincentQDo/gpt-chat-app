import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = (async (
	message: string,
	messages: { role: string; content: string }[]
) => {
	const myHeaders = new Headers();
	const openAiApiKey = import.meta.env.VITE_OPENAI_KEY;
	myHeaders.append('Content-Type', 'application/json');
	myHeaders.append('Authorization', 'Bearer ' + openAiApiKey);

	const raw = JSON.stringify({
		model: 'gpt-3.5-turbo',
		messages: [...messages, { role: 'user', content: message }]
	});

	const requestOptions = {
		method: 'POST',
		headers: myHeaders,
		body: raw,
		redirect: 'follow' as RequestRedirect
	};

	const response = await fetch('https://api.openai.com/v1/chat/completions', requestOptions);
	const data = await response.json();
	return data['choices'][0]['message']['content'];
}) satisfies RequestHandler;
