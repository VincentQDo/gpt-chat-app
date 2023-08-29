<script>
	import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
	/**
	 * @type {any}
	 */
	let email;

	/**
	 * @type {any}
	 */
	let password;
	/**
	 * @param {string} email
	 * @param {string} password
	 */
	function signUp(email, password) {
		const auth = getAuth();
		createUserWithEmailAndPassword(auth, email, password);
	}
</script>

<input type="text" bind:value={email} />
<input type="text" bind:value={password} />
<button on:click={() => signUp(email, password)}>Submit</button>
