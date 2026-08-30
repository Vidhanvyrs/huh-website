import test from 'node:test';
import assert from 'node:assert/strict';
import { resolvePublicBuildEnv } from '../src/build-env.js';

test('Vercel Supabase variables are mapped into the public build config', () => {
    assert.deepEqual(
        resolvePublicBuildEnv({
            SUPABASE_URL: 'https://vercel-project.supabase.co',
            SUPABASE_ANON_KEY: 'vercel-anon-key',
        }),
        {
            supabaseUrl: 'https://vercel-project.supabase.co',
            supabaseAnonKey: 'vercel-anon-key',
        },
    );
});

test('existing Vite-prefixed local variables remain supported', () => {
    assert.deepEqual(
        resolvePublicBuildEnv({
            VITE_SUPABASE_URL: 'https://local-project.supabase.co',
            VITE_SUPABASE_ANON_KEY: 'local-anon-key',
        }),
        {
            supabaseUrl: 'https://local-project.supabase.co',
            supabaseAnonKey: 'local-anon-key',
        },
    );
});

test('Vercel names take precedence when both naming schemes exist', () => {
    const resolved = resolvePublicBuildEnv({
        SUPABASE_URL: 'https://vercel-project.supabase.co',
        SUPABASE_ANON_KEY: 'vercel-anon-key',
        VITE_SUPABASE_URL: 'https://local-project.supabase.co',
        VITE_SUPABASE_ANON_KEY: 'local-anon-key',
    });

    assert.equal(resolved.supabaseUrl, 'https://vercel-project.supabase.co');
    assert.equal(resolved.supabaseAnonKey, 'vercel-anon-key');
});
