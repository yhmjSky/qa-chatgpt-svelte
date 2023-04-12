import { OPENAI_API_KEY } from '$env/static/private';
import type { RequestHandler } from '../$types';
import { json } from '@sveltejs/kit';
import type { Config } from '@sveltejs/adapter-vercel';

export const config: Config = {
  runtime: 'edge'
};

export const POST: RequestHandler = async ({ request }) => {
  try {
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_KEY env variable not set');
    }

    const requestData = await request.json();

    if (!requestData) {
      throw new Error('No request data');
    }

    const reqMessages = requestData.messages;

    if (!reqMessages) {
      throw new Error('no messages provided');
    }


    const prompt =
      '你是一个问答助手，请用中文回答我的问题';


    const messages = [
      { role: 'system', content: prompt },
      ...reqMessages
    ];

    const chatRequestOpts = {
      model: 'gpt-3.5-turbo',
      messages,
      temperature: 0.9,
      stream: true
    };

    const chatResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(chatRequestOpts)
    });

    if (!chatResponse.ok) {
      const err = await chatResponse.json();
      throw new Error(err);
    }

    return new Response(chatResponse.body, {
      headers: {
        'Content-Type': 'text/event-stream'
      }
    });
  } catch (err) {
    console.error(err);
    return json({ error: 'There was an error processing your request' }, { status: 500 });
  }
};
