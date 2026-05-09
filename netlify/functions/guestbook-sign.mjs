import { getStore } from '@netlify/blobs';

const MAX_NAME = 40;
const MAX_MESSAGE = 500;
const RATE_LIMIT_MS = 30 * 1000; // 30 seconds between submissions per IP
const MAX_ENTRIES = 500;

// extremely light banned-word list. case-insensitive.
const BANNED = ['nigger', 'nigga', 'faggot', 'kike', 'tranny', 'retard'];

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function clean(s, max) {
  return String(s || '')
    .replace(/[\u0000-\u001F\u007F]/g, '') // strip control chars
    .trim()
    .slice(0, max);
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default async (req, context) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ ok: false, error: 'method_not_allowed' }), {
      status: 405,
      headers: { 'content-type': 'application/json' },
    });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'bad_request' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }

  // honeypot: if 'website' field has anything, it's a bot
  if (body.website && body.website.trim() !== '') {
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  }

  const name = clean(body.name, MAX_NAME);
  const message = clean(body.message, MAX_MESSAGE);

  if (!name || !message) {
    return new Response(JSON.stringify({ ok: false, error: 'name and message required' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }

  // banned word check
  const combined = (name + ' ' + message).toLowerCase();
  for (const w of BANNED) {
    if (combined.includes(w)) {
      return new Response(JSON.stringify({ ok: false, error: 'be cool.' }), {
        status: 400,
        headers: { 'content-type': 'application/json' },
      });
    }
  }

  // rate limit by IP
  const ip = req.headers.get('x-nf-client-connection-ip') ||
             req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
             'unknown';

  try {
    const rateStore = getStore({ name: 'guestbook-rate', consistency: 'strong' });
    const last = await rateStore.get(`ip:${ip}`);
    if (last) {
      const lastTime = parseInt(last, 10);
      if (!isNaN(lastTime) && Date.now() - lastTime < RATE_LIMIT_MS) {
        return new Response(JSON.stringify({ ok: false, error: 'too fast. wait a bit.' }), {
          status: 429,
          headers: { 'content-type': 'application/json' },
        });
      }
    }
    await rateStore.set(`ip:${ip}`, String(Date.now()));
  } catch {
    // if rate store fails, don't block — just log silently
  }

  // append to entries
  try {
    const store = getStore({ name: 'guestbook', consistency: 'strong' });
    const raw = await store.get('entries', { type: 'json' });
    const entries = Array.isArray(raw) ? raw : [];

    const entry = {
      name: escapeHtml(name),
      message: escapeHtml(message),
      date: todayISO(),
      timestamp: Date.now(),
    };

    entries.push(entry);
    // cap at MAX_ENTRIES, keep newest
    const trimmed = entries.slice(-MAX_ENTRIES);
    await store.set('entries', JSON.stringify(trimmed));

    return new Response(JSON.stringify({ ok: true, entry }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: 'could not save. try again.' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }
};
