<script>
	import { onMount } from 'svelte';
	import '../../app.css';
	import { goto } from '$app/navigation';
	import { getAuth, onAuthStateChanged } from 'firebase/auth';
	import { app } from '../../libs/firebase';

	let uuid = '';
	onMount(() => {
		const auth = getAuth(app);
		onAuthStateChanged(auth, (user) => {
			if (user) {
				console.log(user);
				uuid = user.uid;
			} else {
				goto('/auth');
			}
		});
	});
</script>

<div class="dark:bg-gray-800 h-full w-screen">
	{#if uuid === ''}
		<span>Please login</span>a
	{:else}
		<slot />
	{/if}
</div>
