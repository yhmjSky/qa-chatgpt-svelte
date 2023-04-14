import { CollectPrompt } from '$lib/stores/QaEmbedding';
import type { ChatCompletionRequestMessage } from 'openai';
import { SSE } from 'sse.js';
import { get, writable } from 'svelte/store';

import type { Config } from '@sveltejs/adapter-vercel';
export const config: Config = {
  runtime: 'edge'
};


export interface ChatTranscript {
  messages: ChatCompletionRequestMessage[];
  chatState: 'idle' | 'loading' | 'error' | 'message';
}

const { subscribe, update, ...store } = writable<ChatTranscript>({
  messages: [
    { role: 'assistant', content: '您好，我是酒店智能问答助手，请问有需要帮助的吗?' }
  ],
  chatState: 'idle'
});

const set = async (query: string) => {
  updateMessages(query, 'user', 'loading');

  // the function in QaEmbedding.ts
  const prompt = await CollectPrompt(query)
  
  let tempMessage: ChatCompletionRequestMessage[] = [
    { role: 'system', content: prompt},
    { role: 'user', content: query }
  ]

  const eventSource = new SSE('/api/chat', {
    headers: {
      'Content-Type': 'application/json'
    },
    payload: JSON.stringify({ messages: tempMessage })
    // payload: JSON.stringify({ messages: get(chatMessages).messages })
  });

  eventSource.addEventListener('error', handleError);
  eventSource.addEventListener('message', streamMessage);
  eventSource.stream();
};

const replace = (messages: ChatTranscript) => {
  store.set(messages);
};

const reset = () =>
  store.set({
    messages: [
      { role: 'assistant', content: '您好，我是酒店智能问答助手，请问有需要帮助的吗?' }
    ],
    chatState: 'idle'
  });

const updateMessages = (content: any, role: any, state: any) => {
  chatMessages.update((messages: ChatTranscript) => {
    return { messages: [...messages.messages, { role: role, content: content }], chatState: state };
  });
};

const handleError = <T>(err: T) => {
  updateMessages(err, 'system', 'error');
  console.error(err);
};

const streamMessage = (e: MessageEvent) => {
  try {
    if (e.data === '[DONE]') {
      updateMessages(get(answer), 'assistant', 'idle');
      return answer.set('');
    }

    if (get(answer) === '...') answer.set('');

    const completionResponse = JSON.parse(e.data);
    const [{ delta }] = completionResponse.choices;

    if (delta.content) {
      answer.update((_a) => _a + delta.content);
    }
  } catch (err) {
    handleError(err);
  }
};


export const chatMessages = { subscribe, set, update, reset, replace };
export const answer = writable<string>('');
