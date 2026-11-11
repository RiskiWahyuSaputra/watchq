#!/usr/bin/env bash
# Extract the hero video into WebP frames for the canvas image sequence.
# Usage: npm run frames            (defaults: 150 frames from public/videos/watch-hero.mp4)
#        FRAMES=72 npm run frames
set -euo pipefail
cd "$(dirname "$0")/.."

SRC="${SRC:-public/videos/watch-hero.mp4}"
FRAMES="${FRAMES:-150}"
OUT="public/sequence"

command -v ffmpeg >/dev/null || { echo "ffmpeg not found. Install: sudo pacman -S ffmpeg | sudo apt install ffmpeg | brew install ffmpeg"; exit 1; }
[ -f "$SRC" ] || { echo "Video not found: $SRC"; exit 1; }

DURATION=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$SRC")
FPS=$(awk -v f="$FRAMES" -v d="$DURATION" 'BEGIN { printf "%.4f", f / d }')

rm -f "$OUT"/frame_*.webp "$OUT"/mobile/frame_*.webp
mkdir -p "$OUT/mobile"

ffmpeg -v error -i "$SRC" -vf "fps=$FPS,scale=1280:-2:flags=lanczos" -frames:v "$FRAMES" \
  -c:v libwebp -quality 85 -compression_level 6 -an "$OUT/frame_%03d.webp"
ffmpeg -v error -i "$SRC" -vf "fps=$FPS,scale=720:-2:flags=lanczos" -frames:v "$FRAMES" \
  -c:v libwebp -quality 72 -compression_level 6 -an "$OUT/mobile/frame_%03d.webp"

echo "Extracted $(ls "$OUT"/frame_*.webp | wc -l) desktop + $(ls "$OUT"/mobile/frame_*.webp | wc -l) mobile frames."
echo "Update sequence.frameCount in src/data/watch.ts if the count changed."
