# MINDFUL — Supabase Anonymous Feedback Backend Setup

This document explains how to set up and connect your free **Supabase** PostgreSQL database to power the anonymous feedback feature on the **MINDFUL** platform.

---

## 1. Quick Setup (2 Minutes)

### Step 1: Create a Supabase Project
1. Go to [https://supabase.com](https://supabase.com) and log in or create a free account.
2. Click **New Project**.
3. Choose an organization, enter a project name (e.g., `mindful-wellness`), choose a database password, and select a nearby region.
4. Click **Create new project**.

---

### Step 2: Run the Database Schema
1. In your Supabase project dashboard, click on the **SQL Editor** icon in the left navigation sidebar.
2. Click **New query**.
3. Copy and paste the entire contents of [`supabase/schema.sql`](./schema.sql):
   ```sql
   -- Create table for anonymous usability feedback
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

   -- Enable Row Level Security (RLS)
   ALTER TABLE public.anonymous_feedback ENABLE ROW LEVEL SECURITY;

   -- Allow anyone (anonymous public) to insert feedback
   CREATE POLICY "Allow public anonymous submissions"
       ON public.anonymous_feedback
       FOR INSERT
       TO anon, authenticated
       WITH CHECK (true);

   -- Allow anyone to view feedback (read-only for the feed)
   CREATE POLICY "Allow public reading of feedback"
       ON public.anonymous_feedback
       FOR SELECT
       TO anon, authenticated
       USING (true);
   ```
4. Click **Run** (or `Ctrl+Enter`).
5. You should see `Success. No rows returned`.

---

### Step 3: Verified Pre-Configured Credentials

Your project credentials have already been configured in [`js/config/supabase.js`](../js/config/supabase.js):
```javascript
const DEFAULT_SUPABASE_URL = 'https://ufriktmzgvzyurjgznyj.supabase.co';
const DEFAULT_SUPABASE_KEY = 'sb_publishable_5nQp4U21FsQfHlw5ciRlzQ_DOc1sMV5';
```
When you open [`index.html`](../index.html), the platform automatically connects to your Supabase project.

If you ever need to change or test your credentials, you can also use the in-app **Supabase Backend Setup** modal in the feedback section.

---

## 2. Security & Privacy Architecture

- **Row Level Security (RLS)**: The table strictly permits `INSERT` and `SELECT` for anonymous visitors. `UPDATE` and `DELETE` operations are completely disabled from the client, preventing unauthorized modification or tampering.
- **Client-Side Identity Masking**: When the **"Submit Anonymously"** toggle is checked:
  - `is_anonymous` is set to `true`.
  - `student_major` is normalized to `'Anonymous Student'`.
  - No email, phone number, name, or IP address is tracked or stored.
- **Offline & Demo Mode Fallback**: If network requests fail or credentials are not yet configured, the system automatically falls back to browser `localStorage`, ensuring the website remains 100% operational in any environment.
