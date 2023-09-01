<script>
	import {
		getAuth,
		createUserWithEmailAndPassword,
		signInWithEmailAndPassword
	} from 'firebase/auth';
	import { app } from '../../libs/firebase';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	/**
	 * @type {string}
	 */
	let email;
	/**
	 * @type {string}
	 */
	let password;

	/**
	 * @type {import("firebase/auth").Auth}
	 */
	let auth;
	onMount(() => {
		auth = getAuth(app);
	});

	const signUp = () => {
		createUserWithEmailAndPassword(auth, email, password)
			.then((userCredential) => {
				// What do i need to do inside here?
				console.log(userCredential);
			})
			.catch((error) => {
				// What to do here?
				console.log(error);
			});
	};

	const signIn = () => {
		signInWithEmailAndPassword(auth, email, password);
	};
</script>

<input type="text" bind:value={email} />
<input type="text" bind:value={password} />
<button class="" on:click={() => signUp()}>sign up</button>
<button class="" on:click={() => signIn()}>sign in</button>
