<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';

	let input = '';
	let modelList: string[] = [];

	const dispatch = createEventDispatcher();
	const comboKey = {
		enter: false,
		shift: false
	};

	async function onKeyboardEnter(event: { key: string }) {
		if (event.key === 'Enter') {
			comboKey.enter = true;
		} else if (event.key === 'Shift') {
			comboKey.shift = true;
		}
		if (!comboKey.shift && comboKey.enter) {
			dispatchMessage();
		} else if (comboKey.shift && comboKey.enter) {
			//TODO create new line when shft and enter is pressed
		}
	}

	async function dispatchMessage() {
		dispatch('sendMessage', {
			input
		});
		input = '';
	}

	async function onKeyboardUp(event: { key: string }) {
		if (event.key === 'Enter') {
			comboKey.enter = false;
		} else if (event.key === 'Shift') {
			comboKey.shift = false;
		}
	}

	onMount(() => {});
</script>

<div class="mt-auto p-4 flex items-center space-x-4 bg-gray-900">
	<textarea
		class="py-3 px-5 block w-full border-gray-200 rounded-full text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
		bind:value={input}
		on:keydown={onKeyboardEnter}
		on:keyup={onKeyboardUp}
	/>
	<button class="px-4 py-2 rounded-lg bg-blue-500" on:click={dispatchMessage}
		>Send</button
	>
</div>
