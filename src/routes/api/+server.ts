import { error } from '@sveltejs/kit';
import { decodeAiResponse } from '../../libs/chat-interactions';
import type { Message } from '../../models/chat-models';
import { env } from '$env/dynamic/private';

const REQUEST_LIMIT = 3;
async function createOpenAiRequest(body: Message[]) {
	const headers = new Headers();
	const openAiApiKey = env.VITE_OPENAI_KEY;
	headers.append('Content-Type', 'application/json');
	headers.append('Authorization', 'Bearer ' + openAiApiKey);

	const raw: {
		model: string;
		messages: Message[];
		stream: boolean;
	} = {
		model: 'gpt-4',
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
			let requestCounter = 0;
			while (!isDone && requestCounter < REQUEST_LIMIT) {
				requestCounter++;
				console.log(
					'-----------------------------------Creating new api request-----------------------------------'
				);

				const openAiResponse = await createOpenAiRequest(body);
				if (openAiResponse.body) {
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

					// If for some reson openai doesn't return a complete rsponse we add a new user message and make another request
					if (!isDone) {
						body.push(aiResponseObj);
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
