#!/usr/bin/env python3
"""
Enumerate all public videos from a YouTube channel (excluding Shorts).

Usage:
    python3 scripts/yt/list_channel_videos.py [CHANNEL_URL]

Defaults to Mom's Kitchen by Shital Patil channel.
Outputs JSON array to scripts/yt/video_list.json with one object per video:
    { "url", "video_id", "title", "duration", "upload_date" }

Requires yt-dlp: pip install yt-dlp
"""

import json
import subprocess
import sys
import os

DEFAULT_CHANNEL = "https://www.youtube.com/@momskitchenbyshitalpatil/videos"

def main():
    channel_url = sys.argv[1] if len(sys.argv) > 1 else DEFAULT_CHANNEL
    output_file = os.path.join(os.path.dirname(__file__), "video_list.json")

    # Use --flat-playlist to list videos without downloading them.
    # The channel /videos page lists uploaded videos (not Shorts or live).
    cmd = [
        "yt-dlp",
        "--flat-playlist",
        "--dump-json",
        "--no-warnings",
        channel_url,
    ]

    print(f"Enumerating videos from: {channel_url}")
    result = subprocess.run(cmd, capture_output=True, text=True)

    if result.returncode != 0:
        print(f"yt-dlp failed (exit {result.returncode}):", file=sys.stderr)
        print(result.stderr, file=sys.stderr)
        sys.exit(1)

    videos = []
    for line in result.stdout.strip().splitlines():
        if not line:
            continue
        entry = json.loads(line)
        video_id = entry.get("id", "")
        url = entry.get("url") or f"https://www.youtube.com/watch?v={video_id}"
        title = entry.get("title", "Untitled")
        duration = entry.get("duration")
        upload_date = entry.get("upload_date")

        # Skip Shorts: YouTube Shorts URLs contain "/shorts/"
        # Also skip entries without a video id
        if "/shorts/" in url or not video_id:
            continue

        videos.append({
            "url": url,
            "video_id": video_id,
            "title": title,
            "duration": duration,
            "upload_date": upload_date,
        })

    # Deduplicate by video_id
    seen = set()
    unique = []
    for v in videos:
        if v["video_id"] not in seen:
            seen.add(v["video_id"])
            unique.append(v)

    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(unique, f, ensure_ascii=False, indent=2)

    print(f"Found {len(unique)} videos (excluding Shorts). Saved to {output_file}")

if __name__ == "__main__":
    main()
