<script lang="ts">
	import showdown from 'showdown';
	import type { Message } from '../models/chat-models';

	export let message: Message;

	const formatMessage = (msgContent: string) => {
		const converter = new showdown.Converter({
			noHeaderId: true,
			tables: true
		});
		const htmlOutput = converter.makeHtml(msgContent);
		return htmlOutput;
	};
</script>

<div class="flex items-end space-x-2 justify-center">
	<span class="relative flex shrink-0 overflow-hidden rounded-full h-9 w-9"
		><span
			class="flex h-full w-full items-center justify-center rounded-full bg-muted"
		>
			{message.senderType}
		</span></span
	>
	<p class="text-sm text-white">{message.messageText}</p>
</div>
<hr class="my-2 border-gray-700" />
