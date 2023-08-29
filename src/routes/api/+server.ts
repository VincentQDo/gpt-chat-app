import { error } from '@sveltejs/kit';
import { decodeAiResponse } from '../../libs/chat-interactions';
import type { Message } from '../../models/chat-models';

async function createOpenAiRequest(body: Message[]) {
	const headers = new Headers();
	const openAiApiKey = import.meta.env.VITE_OPENAI_KEY;
	headers.append('Content-Type', 'application/json');
	headers.append('Authorization', 'Bearer ' + openAiApiKey);

	const raw: {
		model: string;
		messages: Message[];
		stream: boolean;
	} = {
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

	return await fetch(
		'https://api.openai.com/v1/chat/completions',
		requestOptions
	);
}

/**
 *
 * @param reader
 * @returns
 */
function getSSEResponse(body: Message[]): {
	headers: Headers;
	stream: ReadableStream<Uint8Array>;
} {
	// Set up the SSE response

	const headers = new Headers();
	headers.append('Content-Type', 'text/event-stream');
	headers.append('Cache-Control', 'no-cache');
	headers.append('Connection', 'keep-alive');
	// ... other headers if needed

	// Stream data to the client using SSE
	const stream = new ReadableStream({
		async start(controller) {
			let isDone;
			while (!isDone) {
				const openAiResponse = await createOpenAiRequest(body);
				if (openAiResponse.body) {
					console.log('Craeted another open ai request: ', body);

					const reader = openAiResponse.body.getReader();
					let aiResponseFlatten: string[] = [];
					const aiResponseObj: Message = { role: 'assistant', content: '' };

					let value, done;
					while (!done) {
						({ value, done } = await reader.read());
						if (done) {
							controller.close();
						}

						// Process the value and update the response object
						let aiResponse;
						({ aiResponse, isDone } = decodeAiResponse(value));
						aiResponseFlatten = [...aiResponseFlatten.concat(aiResponse)];
						aiResponseObj.content = aiResponseFlatten.join('');

						// Send data to the client using SSE format
						controller.enqueue(value);
					}
					body.push(aiResponseObj);
					if (!isDone) {
						body.push({ role: 'user', content: 'continue' });
					}
				} else {
					throw error(500, 'Error getting response from openAI');
				}
			}
		}
	});

	return { headers: headers, stream: stream };
}

export async function POST({ request }) {
	const body: Message[] = await request.json();
	const { stream, headers } = getSSEResponse(body);

	// Return the SSE response
	return new Response(stream, { headers });
}
