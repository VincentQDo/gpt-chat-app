<script>
	export let message = '';
	export let userInitial = '';
</script>

<div class="flex items-end space-x-2 justify-center">
	<span class="relative flex shrink-0 overflow-hidden rounded-full h-9 w-9">
		<span
			class="flex h-full w-full items-center justify-center rounded-full bg-muted bg-slate-200"
			>{userInitial}</span
		>
	</span>
	<p class="text-sm text-white">{message}</p>
</div>
<hr class="my-2 border-gray-700" />
