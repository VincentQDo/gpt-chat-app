export async function POST({ request, response }) {
	const headers = new Headers();
	const openAiApiKey = import.meta.env.VITE_OPENAI_KEY;
	headers.append('Content-Type', 'application/json');
	headers.append('Authorization', 'Bearer ' + openAiApiKey);

	const body: { role: string; content: string }[] = await request.json();

	const raw: { model: string; messages: { role: string; content: string }[], stream: boolean } = {
		model: 'gpt-3.5-turbo',
		messages: body,
		stream: true
	};

	const requestOptions = {
		method: 'POST',
		headers: headers,
		body: JSON.stringify(raw),
		redirect: 'follow' as RequestRedirect
	};

	response.writeHead(200, {
		'Content-Type': 'text/event-stream',
		'Cache-Control': 'no-cache',
		'Connection': 'keep-alive'
	});

	const openAiResponse = await fetch('https://api.openai.com/v1/chat/completions', requestOptions);
	if (openAiResponse.body) {
		const reader = openAiResponse.body.getReader();
		let done = false;
		
		while (!done) {
			const { done: chunkDone, value } = await reader.read();
			if (chunkDone) {
				done = true;
			} else {
				response.write('\n\n');
				response.end();
			} else {
				const text = new TextDecoder('utf-8').decode(value);
				const data = JSON.parse(text);
				response.write(`data: ${JSON.stringify(data.choices[0].message)}\n\n`);
			}
		}
	}
}
