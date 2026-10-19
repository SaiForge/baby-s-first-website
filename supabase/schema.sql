-- =========================================================================
-- haX.baby Hackathon: CutoBot (Unit-B04) Supabase Database Schema
-- Run this in your Supabase project's SQL Editor (https://app.supabase.com)
-- =========================================================================

-- 1. Create table for permanent sticky notes on the Tactile Workbench
CREATE TABLE IF NOT EXISTS public.sticky_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author TEXT NOT NULL DEFAULT 'Anonymous Tinker',
    text TEXT NOT NULL,
    color TEXT NOT NULL DEFAULT 'yellow' CHECK (color IN ('cream', 'yellow', 'pink', 'mint', 'cyan')),
    rotation FLOAT NOT NULL DEFAULT 0.0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Create table for site statistics (global visitor hit counter)
CREATE TABLE IF NOT EXISTS public.site_stats (
    id TEXT PRIMARY KEY,
    view_count BIGINT NOT NULL DEFAULT 0,
    high_fives BIGINT NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Reset / initialize global counter to 0
INSERT INTO public.site_stats (id, view_count, high_fives)
VALUES ('global', 0, 0)
ON CONFLICT (id) DO UPDATE SET view_count = 0, high_fives = 0;

-- Clear any existing mock notes to start completely fresh at 0
TRUNCATE TABLE public.sticky_notes;

-- 3. Atomic RPC function to increment global view count concurrently
CREATE OR REPLACE FUNCTION public.increment_views()
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_count BIGINT;
BEGIN
    UPDATE public.site_stats
    SET view_count = view_count + 1,
        updated_at = timezone('utc'::text, now())
    WHERE id = 'global'
    RETURNING view_count INTO new_count;

    IF new_count IS NULL THEN
        INSERT INTO public.site_stats (id, view_count, high_fives)
        VALUES ('global', 1, 0)
        RETURNING view_count INTO new_count;
    END IF;

    RETURN new_count;
END;
$$;

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.sticky_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_stats ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies: Allow public read & write for guestbook & counters
DROP POLICY IF EXISTS "Public can view sticky notes" ON public.sticky_notes;
CREATE POLICY "Public can view sticky notes"
ON public.sticky_notes FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Public can insert sticky notes" ON public.sticky_notes;
CREATE POLICY "Public can insert sticky notes"
ON public.sticky_notes FOR INSERT
TO anon, authenticated
WITH CHECK (char_length(text) > 0 AND char_length(text) <= 300);

DROP POLICY IF EXISTS "Public can view site stats" ON public.site_stats;
CREATE POLICY "Public can view site stats"
ON public.site_stats FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Public can update site stats" ON public.site_stats;
CREATE POLICY "Public can update site stats"
ON public.site_stats FOR UPDATE
TO anon, authenticated
USING (true);

-- 6. Enable Realtime on sticky_notes so notes appear live for all active visitors!
ALTER PUBLICATION supabase_realtime ADD TABLE public.sticky_notes;
