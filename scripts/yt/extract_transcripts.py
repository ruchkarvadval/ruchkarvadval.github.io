#!/usr/bin/env python3
"""
Extract subtitles/transcripts from YouTube videos without downloading the video.

Reads scripts/yt/video_list.json and downloads subtitle files for each video.
Cleans the raw VTT/SRT into plain text and outputs to scripts/yt/transcripts/.

Usage:
    python3 scripts/yt/extract_transcripts.py

Requires yt-dlp: pip install yt-dlp
"""

import json
import os
import re
import subprocess
import sys
import time

SCRIPT_DIR = os.path.dirname(__file__)
VIDEO_LIST = os.path.join(SCRIPT_DIR, "video_list.json")
TRANSCRIPT_DIR = os.path.join(SCRIPT_DIR, "transcripts")

def clean_vtt(raw_text: str) -> str:
    """Clean raw VTT/SRT subtitle text into readable plain text.

    Removes:
    - WEBVTT/SRT headers and metadata lines
    - Timestamp lines (00:01:23.000 --> 00:01:27.000)
    - Duplicate/overlapping lines (auto-generated subtitle artifact)
    - Blank lines
    """
    lines = raw_text.splitlines()

    cleaned = []
    for line in lines:
        stripped = line.strip()
        # Skip empty lines
        if not stripped:
            continue
        # Skip WEBVTT header
        if stripped == "WEBVTT":
            continue
        # Skip metadata lines (Kind:, Language:, etc.)
        if re.match(r"^(Kind|Language|NOTE|STYLE|REGION):", stripped):
            continue
        # Skip SRT index lines (just a number on its own line)
        if re.match(r"^\d+$", stripped):
            continue
        # Skip timestamp lines (both VTT and SRT formats)
        if re.match(r"^\d{2}:\d{2}:\d{2}[.,]\d{3}\s*-->", stripped):
            continue
        if re.match(r"^\d{2}:\d{2}[.,]\d{3}\s*-->", stripped):
            continue
        # Skip lines that are only timestamps without text
        if re.match(r"^[\d:.,\-\s>]+$", stripped):
            continue
        # Remove inline VTT tags like <c>, <00:01:23.000>, alignment tags
        text = re.sub(r"<[^>]+>", "", stripped)
        text = text.strip()
        if not text:
            continue
        cleaned.append(text)

    # Deduplicate consecutive repeated lines (core auto-sub artifact fix)
    deduped = []
    for i, line in enumerate(cleaned):
        if i == 0 or line != cleaned[i - 1]:
            deduped.append(line)

    # Also handle partial overlaps: auto-subs often repeat the tail of the
    # previous cue plus add new words. If a line fully contains the previous
    # line as a prefix, keep only the longer one.
    merged = []
    for line in deduped:
        if merged and line.lower().startswith(merged[-1].lower()):
            merged[-1] = line
        elif merged and merged[-1].lower().startswith(line.lower()):
            continue
        else:
            merged.append(line)

    return "\n".join(merged)


def extract_one(video: dict, idx: int, total: int) -> dict | None:
    """Extract transcript for a single video. Returns dict with transcript info or None."""
    video_url = video["url"]
    video_id = video["video_id"]
    title = video["title"]

    print(f"[{idx + 1}/{total}] {title}")

    # Download subtitles to a temp directory per video
    tmp_dir = os.path.join(TRANSCRIPT_DIR, "tmp", video_id)
    os.makedirs(tmp_dir, exist_ok=True)

    # Try manually uploaded subs first, then auto-subs.
    # Try Marathi first (videos are in Marathi), then English, then Hindi.
    for lang_priority in [["mr", "en", "hi"], ["en", "hi"]]:
        for use_auto in [False, True]:
            cmd = [
                "yt-dlp",
                "--skip-download",
                "--write-subs" if not use_auto else "--write-auto-subs",
                "--sub-langs", ",".join(lang_priority),
                "--sub-format", "vtt",
                "--convert-subs", "srt",
                "-o", os.path.join(tmp_dir, "%(id)s"),
                "--no-warnings",
                video_url,
            ]

            result = subprocess.run(cmd, capture_output=True, text=True, timeout=60)

            # Find any subtitle files in tmp_dir
            sub_files = [f for f in os.listdir(tmp_dir) if f.endswith((".vtt", ".srt"))]
            if sub_files:
                sub_file = os.path.join(tmp_dir, sub_files[0])
                with open(sub_file, "r", encoding="utf-8", errors="replace") as f:
                    raw = f.read()

                transcript = clean_vtt(raw)
                if transcript.strip():
                    # Detect which language we got
                    lang = "en"
                    for l in lang_priority:
                        if f".{l}." in sub_files[0] or f".{l}-":
                            lang = l
                            break

                    print(f"    -> Got transcript ({lang}, {len(transcript)} chars)")
                    return {
                        "video_url": video_url,
                        "video_id": video_id,
                        "video_title": title,
                        "channel_name": "Mom's Kitchen by Shital Patil",
                        "transcript": transcript,
                        "subtitle_lang": lang,
                    }

            time.sleep(1)

    print(f"    -> No subtitles found, skipping")
    return None


def main():
    if not os.path.exists(VIDEO_LIST):
        print(f"Error: {VIDEO_LIST} not found. Run list_channel_videos.py first.", file=sys.stderr)
        sys.exit(1)

    os.makedirs(TRANSCRIPT_DIR, exist_ok=True)

    with open(VIDEO_LIST, "r", encoding="utf-8") as f:
        videos = json.load(f)

    print(f"Processing {len(videos)} videos...")

    results = []
    for i, video in enumerate(videos):
        result = extract_one(video, i, len(videos))
        if result:
            results.append(result)

    output_file = os.path.join(TRANSCRIPT_DIR, "all_transcripts.json")
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

    print(f"\nDone! Extracted {len(results)} transcripts. Saved to {output_file}")
    print(f"Skipped {len(videos) - len(results)} videos (no subtitles available).")

    # Cleanup tmp dirs
    tmp_root = os.path.join(TRANSCRIPT_DIR, "tmp")
    if os.path.exists(tmp_root):
        import shutil
        shutil.rmtree(tmp_root)


if __name__ == "__main__":
    main()
