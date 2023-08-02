<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	let input = '';

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
		console.log(comboKey);
	}
</script>

<div class="mt-auto p-4 flex items-center space-x-4 bg-gray-900">
	<textarea
		class="flex-grow px-4 py-2 rounded-lg bg-gray-700"
		bind:value={input}
		on:keydown={onKeyboardEnter}
		on:keyup={onKeyboardUp}
	/>
	<button class="px-4 py-2 rounded-lg bg-blue-500" on:click={dispatchMessage}>Send</button>
</div>
