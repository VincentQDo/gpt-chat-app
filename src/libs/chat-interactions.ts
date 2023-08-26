import type { AiResponseChunk, Message } from '../models/chat-models';

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

// This is here to track incomplete data from the buffer. The bugger could give us half the response in one chunk and the other half in another
// This is here to help facilitate that partial chunk
let partialData: string | undefined = '';

export const decodeAiResponse = (value: Uint8Array | undefined) => {
	const decoder = new TextDecoder('utf-8');
	const decodedData = partialData + decoder.decode(value);
	const decodedDataArr = decodedData.split('\n');
	// If the buffer response doesn't end with new line that means the last
	// resposne from the chunk is incomplete. pop that response out and keep that in the running partial data
	// and we will decode that piece with a later chunk
	if (!decodedData.endsWith('\n')) {
		partialData = decodedDataArr.pop();
	} else {
		partialData = '';
	}
	// we need to filter out [DONE] from the array because the last chunk of the stream could include useful data
	// which we would miss if we just do an if condition like so (if (decodedData.includes('[DONE]'))). That if condition
	// would just completely remove all the data from the last chunk of the response because [DONE] was included
	// in that chunk
	let isDone = false;
	const actualData = decodedDataArr.filter((e) => {
		const isNotEmpty = e.length > 0;
		isDone = e.includes('[DONE]');
		return isNotEmpty && !isDone;
	});
	try {
		const jsonData: AiResponseChunk[] = actualData.map((e) =>
			JSON.parse(e.slice(5))
		);
		const aiResponse = jsonData.flatMap((e) =>
			e.choices.flatMap((d) => d.delta.content)
		);
		return { aiResponse: aiResponse, done: isDone };
	} catch (error) {
		console.error(error);
		console.error('Error while parsing buffer response: ', decodedData);
		return { aiResponse: ['{error}'], isDone: true };
	}
};
