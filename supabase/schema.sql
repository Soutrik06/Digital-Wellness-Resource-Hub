-- ============================================================================
-- MINDFUL — Digital Wellness Resource Hub
-- Supabase Backend Database Schema: Anonymous Feedback
-- ============================================================================
-- Instructions:
-- 1. Open your Supabase Dashboard: https://supabase.com/dashboard
-- 2. Select your Project (or create a new free project).
-- 3. Go to the "SQL Editor" in the left sidebar.
-- 4. Paste this entire script and click "RUN".
-- 5. Go to "Project Settings" -> "API" to copy:
--    - Project URL (e.g., https://your-project-id.supabase.co)
--    - Project API Anon Public Key (anon public)
-- 6. Paste those credentials into `js/config/supabase.js`
-- ============================================================================

-- 1. Create table for storing anonymous usability feedback
CREATE TABLE IF NOT EXISTS public.anonymous_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    is_anonymous BOOLEAN DEFAULT true NOT NULL,
    student_major TEXT DEFAULT 'Anonymous Student',
    resource_tested TEXT NOT NULL,
    task_completed TEXT NOT NULL,
    ease_rating INTEGER NOT NULL CHECK (ease_rating BETWEEN 1 AND 5),
    problems_encountered TEXT,
    suggestions TEXT NOT NULL,
    sentiment TEXT DEFAULT 'neutral'
);

-- 2. Create index for efficient chronological ordering
CREATE INDEX IF NOT EXISTS idx_anonymous_feedback_created_at
    ON public.anonymous_feedback (created_at DESC);

-- 3. Enable Row Level Security (RLS) for data protection
ALTER TABLE public.anonymous_feedback ENABLE ROW LEVEL SECURITY;

-- 4. Policy: Allow anyone (anon public) to insert new feedback
-- This allows college students to submit feedback without requiring an account or login.
CREATE POLICY "Allow public anonymous submissions"
    ON public.anonymous_feedback
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- 5. Policy: Allow public reading of feedback
-- This allows the front-end to display recent student reviews and ratings.
CREATE POLICY "Allow public reading of feedback"
    ON public.anonymous_feedback
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- 6. Disallow public updating or deletion (Only Supabase service_role / dashboard admin can modify or delete)
-- (No UPDATE or DELETE policy granted to anon guarantees submission immutability)

-- 7. Optional Seed Data: Initial verified student tests
INSERT INTO public.anonymous_feedback (
    is_anonymous, student_major, resource_tested, task_completed, ease_rating, problems_encountered, suggestions
) VALUES
(
    false,
    '2nd Year Computer Science',
    'Unhook YouTube Extension',
    'Tested setting up sterile study space for Linear Algebra lectures',
    5,
    'None on Chrome desktop. Noticed extension doesn''t touch mobile app.',
    'Add a clear note that mobile browser extensions (e.g. Orion/Firefox Android) work differently than native desktop.'
),
(
    true,
    'Anonymous Student',
    'Cold Turkey Blocker',
    'Enforced strict 2-hour homework sprint',
    4,
    'Accidentally locked myself out of canvas because login URL matched block keyword.',
    'The whitelist tip on the website saved me. Make sure the whitelist button is highlighted!'
),
(
    true,
    'Anonymous Student',
    'ActivityWatch Local Tracker',
    'Audited weekly screen time distribution without telemetry',
    5,
    'Initial setup took 5 mins to find system tray icon on Linux.',
    'Great privacy. Appreciate that no email or cloud login is required.'
);
