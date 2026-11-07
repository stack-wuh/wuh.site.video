#!/usr/bin/env bash
# 《风陵 · 致郭襄》终混：CI 无声成片 + 旁白（+4.000s 对齐片头）+ BGM 床（已带避让包络）
# 用法：./mux-v12.sh <film-silent.mp4> <voice-track.wav> <bgm-bed.wav> <out.mp4>
set -euo pipefail
FILM="$1"; VOICE="$2"; BGM="$3"; OUT="$4"
# 旁白整轨 292.0s，正片从全时间线 4.000s 开始 → adelay 4000ms
# BGM 床已是 302.000s 全时间线、自带包络 → 直接相加，两路都不再动电平
ffmpeg -y -hide_banner -loglevel warning \
  -i "$FILM" -i "$VOICE" -i "$BGM" \
  -filter_complex "[1:a]adelay=4000|4000,volume=1.0[v];[2:a]volume=1.0[b];[b][v]amix=inputs=2:duration=first:normalize=0,alimiter=limit=0.95:level=false[a]" \
  -map 0:v:0 -map "[a]" \
  -c:v copy -c:a aac -b:a 256k -ar 48000 -ac 2 \
  -movflags +faststart -shortest \
  "$OUT"
ffprobe -v error -show_entries format=duration,size:stream=codec_name,width,height,r_frame_rate,channels -of default=noprint_wrappers=1 "$OUT"
