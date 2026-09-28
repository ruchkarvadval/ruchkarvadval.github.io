/*
# Create recipes and recipe_imports tables with auth-gated write access

## Purpose
Store Vadval community recipes in the database (replacing static JSON file) and
maintain a staging queue for YouTube-sourced recipe transcripts awaiting review.

## New Tables

### 1. recipes
- `id` (uuid, primary key, default gen_random_uuid())
- `title` (text, not null) — English recipe title
- `title_marathi` (text, not null) — Marathi recipe title (Devanagari)
- `category` (text, not null) — e.g. Breakfast, Seafood, Main Dishes, Festive, etc.
- `ingredients` (jsonb, not null, default '[]') — array of ingredient strings
- `prep_time` (text, nullable) — e.g. "15 mins"
- `cook_time` (text, nullable) — e.g. "20 mins"
- `total_time` (text, nullable) — e.g. "35 mins"
- `serves` (text, nullable) — e.g. "4"
- `procedure` (jsonb, not null, default '[]') — array of step strings
- `serving_suggestions` (text, nullable) — free-text serving suggestions
- `context_tips` (text, nullable) — free-text cultural context and cooking tips
- `source_url` (text, nullable) — internal-only YouTube source URL (not displayed publicly)
- `source_video_title` (text, nullable) — internal-only YouTube video title
- `source_channel` (text, nullable) — internal-only channel name
- `created_at` (timestamptz, default now())
- `updated_at` (timestamptz, default now())

### 2. recipe_imports
- `id` (uuid, primary key, default gen_random_uuid())
- `video_url` (text, not null) — YouTube video URL
- `video_title` (text, not null) — YouTube video title
- `channel_name` (text, not null) — YouTube channel name
- `transcript` (text, not null) — cleaned plain-text transcript
- `subtitle_lang` (text, nullable) — which subtitle language was extracted (e.g. "en", "mr")
- `status` (text, not null, default 'transcript_ready') — one of: transcript_ready, in_review, completed, skipped
- `created_at` (timestamptz, default now())
- `updated_at` (timestamptz, default now())

## Security (RLS)

### recipes table
- SELECT: public (anon + authenticated) — all visitors can browse recipes
- INSERT/UPDATE/DELETE: authenticated only — only logged-in admins can add/edit/delete recipes

### recipe_imports table
- SELECT: authenticated only — only logged-in admins can see the import queue
- INSERT/UPDATE/DELETE: authenticated only — only logged-in admins can manage imports

## Indexes
- recipes: index on `category` for filtering
- recipe_imports: index on `status` for filtering the work queue
*/

CREATE TABLE IF NOT EXISTS recipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  title_marathi text NOT NULL,
  category text NOT NULL,
  ingredients jsonb NOT NULL DEFAULT '[]'::jsonb,
  prep_time text,
  cook_time text,
  total_time text,
  serves text,
  procedure jsonb NOT NULL DEFAULT '[]'::jsonb,
  serving_suggestions text,
  context_tips text,
  source_url text,
  source_video_title text,
  source_channel text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_recipes_category ON recipes(category);

ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_recipes" ON recipes;
CREATE POLICY "public_read_recipes"
  ON recipes FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "auth_insert_recipes" ON recipes;
CREATE POLICY "auth_insert_recipes"
  ON recipes FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_recipes" ON recipes;
CREATE POLICY "auth_update_recipes"
  ON recipes FOR UPDATE
  TO authenticated
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_recipes" ON recipes;
CREATE POLICY "auth_delete_recipes"
  ON recipes FOR DELETE
  TO authenticated
  USING (true);

CREATE TABLE IF NOT EXISTS recipe_imports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  video_url text NOT NULL,
  video_title text NOT NULL,
  channel_name text NOT NULL,
  transcript text NOT NULL,
  subtitle_lang text,
  status text NOT NULL DEFAULT 'transcript_ready',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_recipe_imports_status ON recipe_imports(status);

ALTER TABLE recipe_imports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "auth_read_imports" ON recipe_imports;
CREATE POLICY "auth_read_imports"
  ON recipe_imports FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "auth_insert_imports" ON recipe_imports;
CREATE POLICY "auth_insert_imports"
  ON recipe_imports FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_imports" ON recipe_imports;
CREATE POLICY "auth_update_imports"
  ON recipe_imports FOR UPDATE
  TO authenticated
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_imports" ON recipe_imports;
CREATE POLICY "auth_delete_imports"
  ON recipe_imports FOR DELETE
  TO authenticated
  USING (true);

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS recipes_updated_at ON recipes;
CREATE TRIGGER recipes_updated_at
  BEFORE UPDATE ON recipes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS recipe_imports_updated_at ON recipe_imports;
CREATE TRIGGER recipe_imports_updated_at
  BEFORE UPDATE ON recipe_imports
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();