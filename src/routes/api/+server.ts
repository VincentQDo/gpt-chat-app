import { json } from '@sveltejs/kit';

export async function POST({ request }) {
	const headers = new Headers();
	const openAiApiKey = import.meta.env.VITE_OPENAI_KEY;
	headers.append('Content-Type', 'application/json');
	headers.append('Authorization', 'Bearer ' + openAiApiKey);

	const body: { role: string; content: string }[] = await request.json();

	const raw: { model: string; messages: { role: string; content: string }[] } = {
		model: 'gpt-3.5-turbo',
		messages: body
	};

	const requestOptions = {
		method: 'POST',
		headers: headers,
		body: JSON.stringify(raw),
		redirect: 'follow' as RequestRedirect
	};

	const response = await fetch('https://api.openai.com/v1/chat/completions', requestOptions);
	const data = await response.json();
	return new Response(JSON.stringify(data.choices[0].message));
}
