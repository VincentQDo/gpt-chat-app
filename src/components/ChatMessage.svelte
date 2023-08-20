<script lang="ts">
	import showdown from 'showdown';

	export let message: { role: string; content: string };

	const formatMessage = (msgContent: string) => {
		const converter = new showdown.Converter({ noHeaderId: true });
		const htmlOutput = converter.makeHtml(msgContent);
		return htmlOutput;
	};
</script>

<div class="flex flex-col" class:items-end={message.role === 'user'}>
	<div
		class={`px-4 py-2 rounded-lg ${
			message.role === 'user' ? 'bg-blue-500' : 'bg-gray-600'
		}`}
	>
		{@html formatMessage(message.content)}
	</div>
</div>
