export const resolvePublicBuildEnv = env => ({
    supabaseUrl: env.SUPABASE_URL || env.VITE_SUPABASE_URL || '',
    supabaseAnonKey: env.SUPABASE_ANON_KEY || env.VITE_SUPABASE_ANON_KEY || '',
});
