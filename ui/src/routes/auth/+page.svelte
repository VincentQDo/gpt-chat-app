<script>
	import {
		getAuth,
		createUserWithEmailAndPassword,
		signInWithEmailAndPassword
	} from 'firebase/auth';
	import { app } from '../../libs/firebase';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	/**
	 * @type {string}
	 */
	let email;
	/**
	 * @type {string}
	 */
	let password;

	/**
	 * @type {string}
	 */
	let errorText;

	/**
	 * @type {import("firebase/auth").Auth}
	 */
	let auth;

	/**
	 * @type {import("firebase/auth").User}
	 */
	let user;

	onMount(() => {
		auth = getAuth(app);
	});

	const signUp = () => {
		errorText = 'Please contact Vincent Do for access';
		console.log(email, password);
		// createUserWithEmailAndPassword(auth, email, password).catch((error) => {
		// 	errorText = error.code;
		// });
	};

	const signIn = () => {
		signInWithEmailAndPassword(auth, email, password)
			.then((userCredential) => {
				// What do i need to do inside here?
				user = userCredential.user;
				console.log(user);
				goto('/');
			})
			.catch((error) => {
				errorText = error.code;
			});
	};
</script>

<form class="container dark:bg-gray-800 h-full w-screen">
	<label
		for="input-label"
		class="block text-sm font-medium mb-2 dark:text-white">Email</label
	>
	<input
		type="email"
		id="input-label"
		class="py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
		placeholder="you@site.com"
		bind:value={email}
	/>
	<label
		for="input-label"
		class="block text-sm font-medium mb-2 dark:text-white">Password</label
	>
	<input
		type="password"
		id="input-label"
		class="py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
		placeholder="password"
		bind:value={password}
	/>
	<button
		on:click={() => signUp()}
		type="button"
		class="py-2 px-3 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
	>
		Sign Up
	</button>
	<button
		on:click={() => signIn()}
		type="submit"
		class="py-2 px-3 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
	>
		Sign In
	</button>
	<div
		class="max-w-xs bg-white border rounded-md shadow-lg dark:bg-gray-800 dark:border-gray-700"
		role="alert"
	>
		<div class="flex p-4">
			<div class="flex-shrink-0">
				<svg
					class="h-4 w-4 text-red-500 mt-0.5"
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					fill="currentColor"
					viewBox="0 0 16 16"
				>
					<path
						d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"
					/>
				</svg>
			</div>
			<div class="ml-3">
				<p class="text-sm text-gray-700 dark:text-gray-400">
					{errorText}
				</p>
			</div>
		</div>
	</div>
</form>
