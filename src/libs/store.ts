import { writable, type Writable } from 'svelte/store';

export interface apiBody {
	role: 'system' | 'user' | 'assistant';
	content: string;
}
export const messages: Writable<apiBody[]> = writable([
	{
		role: 'system',
		content: `Hello! You're currently speaking with an expert software engineer specializing in web development. I have a wealth of experience in Angular, C#, Svelte, and JavaScript. My purpose here is not only to assist but also to teach and help you understand better. Feel free to ask me anything!`
	}
]);
