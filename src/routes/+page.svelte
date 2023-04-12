<script lang="ts">
	import ChatMessage from '$lib/components/ChatMessage.svelte';
	import Input from '$lib/components/Input.svelte';
	import { chatMessages, answer } from '$lib/stores/chat-messages';

	let query = '';

	const handleSubmit = async () => {
		answer.set('...');
		await chatMessages.set(query);
		query = '';
	};
</script>

<section class="flex max-w-6xl w-full pt-4 justify-center">
	<div class="flex flex-col w-full px-8 items-center gap-2">
		
		<div
			class="msgbox"
		>
			<div class="flex flex-col gap-2">
				{#each $chatMessages.messages as message}
					<ChatMessage type={message.role} message={message.content} />
				{/each}

				{#if $answer}
					<ChatMessage type="assistant" message={$answer} />
				{/if}
			</div>
		</div>

		<form
			class="flex w-full rounded-md gap-4 bg-black bg-opacity-20 p-2"
			on:submit|preventDefault={handleSubmit}
		>
			<Input type="text" placeholder="enter your question" bind:value={query} class="w-full" />

			<button
				type="submit"
				class="sendbtn"
			>
				Send
			</button>
		</form>
	</div>
</section>

<style>


	.msgbox {
		height: 700px;
		width: 100%;
		background-color: rgba(255, 255, 255, 0.308);
		border-radius: 0.375rem;
		padding: 1rem;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.sendbtn {
		background-color: rgba(59, 63, 58, 0.349);
 		color: #2d97d4de;
 		border: 1px solid rgba(0, 0, 0, 0.4);
  		border-radius: 0.375rem;
  		padding: 0.375rem 2rem;
  		margin-left: -0.5rem;
	}
	.sendbtn:hover {
		background-color: rgba(0, 0, 0, 0.4);
	}



</style>
