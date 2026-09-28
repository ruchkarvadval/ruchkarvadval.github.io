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
