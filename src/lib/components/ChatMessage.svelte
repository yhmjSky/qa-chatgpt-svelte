<script lang="ts">
  import { marked } from 'marked';
  import DOMPurify from 'isomorphic-dompurify';
  import type { ChatCompletionRequestMessageRoleEnum } from 'openai';
  import { onMount } from 'svelte';
  import robot_avatar from '$lib/assets/openai.png';
	import julio_avatar from '$lib/assets/ava.jpeg';

  export let type: ChatCompletionRequestMessageRoleEnum;
  export let message: string = '';
  export { classes as class };

  let classes = '';
  let scrollToDiv: HTMLDivElement;

  const classSet = {
    user: 'justify-end text-white-400',
    assistant: 'justify-start text-white-400',
    system: 'justify-center text-white-400'
  };

  const typeEffect = (node: HTMLDivElement, message: string) => {
    return {
      update(message: string) {
        scrollToDiv.scrollIntoView({ behavior: 'auto', block: 'end', inline: 'end' });
      }
    };
  };

  onMount(() => {
    scrollToDiv.scrollIntoView({ behavior: 'auto', block: 'end', inline: 'end' });
  });
</script>

<div class="flex items-center {classSet[type]} ">
  <!-- <p class="text-xs px-2">{type === 'user' ? 'Me' : 'Bot'}</p> -->
  <section class={classSet[type]}>
		{#if type === 'user'}
    <div class="avatext">
      <p class="text-xs px-2">yours</p>
      <img class="avatar" src={julio_avatar} alt="avatar" />
    </div>

		{:else}
    <div class="avatext">    
      <img class="avatar" src={robot_avatar} alt="avatar" />
      <p class="text-xs px-2">assistant</p>
    </div>
		{/if}
	</section>
</div>

<div class="flex {classSet[type]}">
  <div
    use:typeEffect={message}
    class="ans {classes} {classSet[type]}"
  >

    {@html DOMPurify.sanitize(marked.parse(message))}
  </div>
  <div bind:this={scrollToDiv} />
</div>


<style>

  .ans {
    background-color: #808b99;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    padding-left: 1rem;
    padding-right: 1rem;
    max-width: 2xl;
    border-radius: 0.375rem;
    line-height: 1.5;
  }

  .avatext {
    display: flex;
    align-items: center;
  }

  .avatar {
      border-radius: 50%;
      width: 70px;
      height: 70px;
      max-width: 28px;
      max-height: 28px;
      margin: 5px;
    }
	.container {
		display: flex;
	}
	.container.own-container {
		flex-direction: row-reverse;
	}
	.message {
		display: flex;
		box-sizing: border-box;
		padding: 0.5rem 1rem;
		margin: 1rem;
		background: #fff;
		border-radius: 1.125rem 1.125rem 1.125rem 0;
		min-height: 2.25rem;
		width: fit-content;
		max-width: 66%;
		font-size: 1.5rem;
	}

	.message.own-message {
		align-self: flex-end;
		margin: 1rem 1rem 1rem auto;
		border-radius: 1.125rem 1.125rem 0 1.125rem;
		background: #333;
		color: white;
	}

</style>