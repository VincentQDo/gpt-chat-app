<script>
	import '../../app.css';
	import { dev } from '$app/environment';
	import { inject } from '@vercel/analytics';

	inject({ mode: dev ? 'development' : 'production' });
</script>

<div class="dark:bg-slate-900 h-full w-screen">
	<slot />
</div>
