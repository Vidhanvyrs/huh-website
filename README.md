# Huh? Launch Website

A standalone brutalist launch page for Huh? Video Explainer, with a fixed 48-hour countdown and a Supabase-backed waitlist.

## Setup

1. Run `supabase/schema.sql` in the Huh? Supabase project SQL Editor.
2. Copy `.env.example` to `.env.production` and fill in the project URL and public anon key.
3. Install and run:

```bash
npm install
npm run dev
```

## Production

```bash
npm test
npm run build
```

Deploy the generated `dist/` directory to any static host. The browser receives only the Supabase anon key. Row Level Security permits inserts but prevents public reads, updates, and deletes.

Override the built-in launch target with `VITE_LAUNCH_AT` using any valid ISO-8601 timestamp. The countdown and displayed drop date are both derived from that one value.
