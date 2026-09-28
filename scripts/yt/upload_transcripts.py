#!/usr/bin/env python3
"""
Upload cleaned transcripts from all_transcripts.json into the Supabase
recipe_imports staging table.

Usage:
    python3 scripts/yt/upload_transcripts.py

Requires: pip install supabase
Environment: Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env or shell.
"""

import json
import os
import sys
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
TRANSCRIPTS_FILE = SCRIPT_DIR / "transcripts" / "all_transcripts.json"
PROJECT_ROOT = SCRIPT_DIR.parent.parent

# Load .env file manually (simple parser)
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

if not SUPABASE_URL or not SUPABASE_KEY:
    print("Error: Missing Supabase credentials. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.", file=sys.stderr)
    sys.exit(1)

def main():
    if not TRANSCRIPTS_FILE.exists():
        print(f"Error: {TRANSCRIPTS_FILE} not found. Run extract_transcripts.py first.", file=sys.stderr)
        sys.exit(1)

    try:
        from supabase import create_client
    except ImportError:
        print("Error: supabase package not installed. Run: pip install supabase", file=sys.stderr)
        sys.exit(1)

    with open(TRANSCRIPTS_FILE, "r", encoding="utf-8") as f:
        transcripts = json.load(f)

    print(f"Uploading {len(transcripts)} transcripts to Supabase...")

    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

    # Get existing video_urls to avoid duplicates
    existing = supabase.table("recipe_imports").select("video_url").execute()
    existing_urls = {r["video_url"] for r in existing.data} if existing.data else set()

    new_count = 0
    skipped = 0
    for t in transcripts:
        if t["video_url"] in existing_urls:
            skipped += 1
            continue

        insert_data = {
            "video_url": t["video_url"],
            "video_title": t["video_title"],
            "channel_name": t["channel_name"],
            "transcript": t["transcript"],
            "subtitle_lang": t.get("subtitle_lang"),
            "status": "transcript_ready",
        }

        result = supabase.table("recipe_imports").insert(insert_data).execute()
        if result.data:
            new_count += 1
        else:
            print(f"  Failed to insert: {t['video_title']}")

    print(f"\nDone! Inserted {new_count} new transcripts, skipped {skipped} duplicates.")

if __name__ == "__main__":
    main()
