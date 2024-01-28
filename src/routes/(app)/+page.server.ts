import type { Actions, RequestEvent } from './$types';

export const actions = {
	default: async (event: RequestEvent) => {
		console.log(event);
	}
} satisfies Actions;
