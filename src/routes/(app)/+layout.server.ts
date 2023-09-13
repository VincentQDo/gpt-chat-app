import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
export const load: LayoutServerLoad = ({ locals }) => {
	if (!locals.user) {
		console.log(locals);
		throw redirect(307, '/auth');
	}
};
