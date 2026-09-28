#!/usr/bin/env python3
"""
Seed existing recipes from vadval_recipes_full.json into the Supabase recipes table.

Usage:
    python3 scripts/yt/seed_recipes.py

Requires: pip install supabase
"""

import json
import os
import sys
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIR.parent.parent
RECIPES_JSON = PROJECT_ROOT / "src" / "data" / "vadval_recipes_full.json"

def load_env():
    env_path = PROJECT_ROOT / ".env"
    if not env_path.exists():
        return
    with open(env_path) as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                key, _, value = line.partition("=")
                os.environ.setdefault(key.strip(), value.strip())

load_env()

SUPABASE_URL = os.environ.get("VITE_SUPABASE_URL") or os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("VITE_SUPABASE_ANON_KEY") or os.environ.get("SUPABASE_ANON_KEY")

def main():
    if not RECIPES_JSON.exists():
        print(f"Error: {RECIPES_JSON} not found.", file=sys.stderr)
        sys.exit(1)

    if not SUPABASE_URL or not SUPABASE_KEY:
        print("Error: Missing Supabase credentials.", file=sys.stderr)
        sys.exit(1)

    try:
        from supabase import create_client
    except ImportError:
        print("Error: pip install supabase", file=sys.stderr)
        sys.exit(1)

    with open(RECIPES_JSON, "r", encoding="utf-8") as f:
        data = json.load(f)

    recipes = data["recipes"]
    print(f"Seeding {len(recipes)} recipes into Supabase...")

    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

    # Check existing titles to avoid duplicates
    existing = supabase.table("recipes").select("title").execute()
    existing_titles = {r["title"] for r in existing.data} if existing.data else set()

    inserted = 0
    skipped = 0
    for recipe in recipes:
        if recipe["title"] in existing_titles:
            skipped += 1
            continue

        insert_data = {
            "title": recipe["title"],
            "title_marathi": recipe["title_marathi"],
            "category": recipe["category"],
            "ingredients": recipe["ingredients"],
            "prep_time": recipe.get("prep_time"),
            "cook_time": recipe.get("cook_time"),
            "total_time": recipe.get("total_time"),
            "serves": recipe.get("serves"),
            "procedure": recipe["procedure"],
            "serving_suggestions": recipe.get("serving_suggestions"),
            "context_tips": recipe.get("context_tips"),
        }

        result = supabase.table("recipes").insert(insert_data).execute()
        if result.data:
            inserted += 1
        else:
            print(f"  Failed: {recipe['title']}")

    print(f"\nDone! Inserted {inserted} recipes, skipped {skipped} duplicates.")

if __name__ == "__main__":
    main()
