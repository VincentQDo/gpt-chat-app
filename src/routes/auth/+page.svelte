<script>
	import { getAuth, createUserWithEmailAndPassword,, signInWithEmailAndPassword } from 'firebase/auth';

	/**
	 * @type {string}
	 */
	let email;
	/**
	 * @type {string}
	 */
	let password;

	const auth = getAuth();

	const signUp = () => {
		createUserWithEmailAndPassword(auth, email, password);
	}

	const signIn = () => {
		const auth = getAuth();
		signInWithEmailAndPassword(auth, email, password);
	}
</script>

<input type="text" bind:value={email} />
<input type="text" bind:value={password} />
<button on:click={() => signUp()}>sign up</button>
<button on:click={() => signIn()}>sign in</button>
