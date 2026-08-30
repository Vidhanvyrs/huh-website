CREATE EXTENSION IF NOT EXISTS citext;

CREATE TABLE IF NOT EXISTS public.waitlist_signups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL CHECK (char_length(name) BETWEEN 2 AND 100),
    email CITEXT NOT NULL UNIQUE CHECK (char_length(email) BETWEEN 3 AND 254),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.waitlist_signups ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.waitlist_signups FROM anon, authenticated;
GRANT INSERT ON TABLE public.waitlist_signups TO anon, authenticated;

DROP POLICY IF EXISTS "public can join waitlist" ON public.waitlist_signups;
CREATE POLICY "public can join waitlist"
    ON public.waitlist_signups
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (
        char_length(name) BETWEEN 2 AND 100
        AND char_length(email::TEXT) BETWEEN 3 AND 254
    );

COMMENT ON TABLE public.waitlist_signups IS
    'Launch waitlist signups submitted from the public Huh? website.';
