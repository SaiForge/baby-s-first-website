-- =========================================================================
-- Bulletproof Supabase Setup (Safe to run multiple times, no rollback errors)
-- =========================================================================

-- 1. Create sticky_notes table
CREATE TABLE IF NOT EXISTS public.sticky_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author TEXT NOT NULL DEFAULT 'Anonymous Tinker',
    text TEXT NOT NULL,
    color TEXT NOT NULL DEFAULT 'yellow',
    rotation FLOAT NOT NULL DEFAULT 0.0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Create site_stats table
CREATE TABLE IF NOT EXISTS public.site_stats (
    id TEXT PRIMARY KEY,
    view_count BIGINT NOT NULL DEFAULT 0,
    high_fives BIGINT NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Seed initial 0 counter
INSERT INTO public.site_stats (id, view_count, high_fives)
VALUES ('global', 0, 0)
ON CONFLICT (id) DO NOTHING;

-- 4. Enable RLS
ALTER TABLE public.sticky_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_stats ENABLE ROW LEVEL SECURITY;

-- 5. Open RLS Policies so anonymous users can read & write
DROP POLICY IF EXISTS "allow_all_notes_read" ON public.sticky_notes;
CREATE POLICY "allow_all_notes_read" ON public.sticky_notes FOR SELECT USING (true);

DROP POLICY IF EXISTS "allow_all_notes_insert" ON public.sticky_notes;
CREATE POLICY "allow_all_notes_insert" ON public.sticky_notes FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "allow_all_stats_read" ON public.site_stats;
CREATE POLICY "allow_all_stats_read" ON public.site_stats FOR SELECT USING (true);

DROP POLICY IF EXISTS "allow_all_stats_update" ON public.site_stats;
CREATE POLICY "allow_all_stats_update" ON public.site_stats FOR UPDATE USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "allow_all_stats_insert" ON public.site_stats;
CREATE POLICY "allow_all_stats_insert" ON public.site_stats FOR INSERT WITH CHECK (true);
