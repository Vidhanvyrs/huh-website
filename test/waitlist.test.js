import test from 'node:test';
import assert from 'node:assert/strict';
import { WaitlistError, createWaitlistClient } from '../src/waitlist.js';

test('waitlist sends normalized details with only the anon key', async () => {
    let request;
    const client = createWaitlistClient({
        supabaseUrl: 'https://project.supabase.co/',
        anonKey: 'public-anon-key',
        fetchImpl: async (url, options) => {
            request = { url, options };
            return { ok: true, status: 201 };
        },
    });

    assert.deepEqual(await client.join({ name: '  Ada Lovelace ', email: ' ADA@Example.com ' }), {
        joined: true,
        duplicate: false,
    });
    assert.equal(request.url, 'https://project.supabase.co/rest/v1/waitlist_signups');
    assert.equal(request.options.headers.apikey, 'public-anon-key');
    assert.deepEqual(JSON.parse(request.options.body), {
        name: 'Ada Lovelace',
        email: 'ada@example.com',
    });
});

test('duplicate emails are treated as an existing waitlist signup', async () => {
    const client = createWaitlistClient({
        supabaseUrl: 'https://project.supabase.co',
        anonKey: 'public-anon-key',
        fetchImpl: async () => ({ ok: false, status: 409 }),
    });

    assert.deepEqual(await client.join({ name: 'Ada', email: 'ada@example.com' }), {
        joined: true,
        duplicate: true,
    });
});

test('missing configuration fails before making a request', async () => {
    const client = createWaitlistClient({ supabaseUrl: '', anonKey: '' });

    await assert.rejects(
        client.join({ name: 'Ada', email: 'ada@example.com' }),
        error => error instanceof WaitlistError && error.code === 'CONFIG_MISSING',
    );
});
