import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export type Recipe = {
  id: string;
  title: string;
  title_marathi: string;
  category: string;
  ingredients: string[];
  prep_time: string | null;
  cook_time: string | null;
  total_time: string | null;
  serves: string | null;
  procedure: string[];
  serving_suggestions: string | null;
  context_tips: string | null;
  created_at: string;
};

export type RecipeImport = {
  id: string;
  video_url: string;
  video_title: string;
  channel_name: string;
  transcript: string;
  subtitle_lang: string | null;
  status: "transcript_ready" | "in_review" | "completed" | "skipped";
  created_at: string;
  updated_at: string;
};
