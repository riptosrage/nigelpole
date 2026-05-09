import { getStore } from '@netlify/blobs';

export default async (req, context) => {
  try {
    const store = getStore({ name: 'guestbook', consistency: 'strong' });
    const raw = await store.get('entries', { type: 'json' });
    const entries = Array.isArray(raw) ? raw : [];

    return new Response(JSON.stringify({ entries }), {
      status: 200,
      headers: {
        'content-type': 'application/json',
        'cache-control': 'no-store',
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ entries: [], error: 'read_failed' }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  }
};
