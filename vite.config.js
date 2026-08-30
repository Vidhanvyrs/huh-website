import { defineConfig, loadEnv } from 'vite';
import { fileURLToPath } from 'node:url';
import { resolvePublicBuildEnv } from './src/build-env.js';

export default defineConfig(({ mode }) => {
    const fileEnv = loadEnv(mode, process.cwd(), '');
    const publicEnv = resolvePublicBuildEnv({ ...fileEnv, ...process.env });

    return {
        // These two values are intentionally public. Never map a service-role key here.
        define: {
            __SUPABASE_URL__: JSON.stringify(publicEnv.supabaseUrl),
            __SUPABASE_ANON_KEY__: JSON.stringify(publicEnv.supabaseAnonKey),
        },
        build: {
            rollupOptions: {
                input: {
                    launch: fileURLToPath(new URL('index.html', import.meta.url)),
                    privacy: fileURLToPath(new URL('privacy.html', import.meta.url)),
                },
            },
        },
    };
});
