#!/usr/bin/env bash
# 《致郭襄》创作历程片 · 真声音色克隆 TTS 批量合成（bailian-gen / bl speech synthesize）
# 用法: ./scripts/voice/gen-mo-bl.sh <clone-voice-id> [only-vo-id]
# 前置: .tmp/mo-tts/lines.json（36 句清单）；音色已在百炼控制台「音色复刻」注册（参考 18s 真声）
# 产出: .tmp/mo-tts/wav/vo-NN.mp3（逐句）；--model cosyvoice-v3.5-flash（克隆音色所在族）
set -euo pipefail
VOICE_ID="${1:?用法: gen-mo-bl.sh <clone-voice-id> [only-vo-id]}"
ONLY="${2:-}"
MODEL="cosyvoice-v3.5-flash"
HERE="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$HERE/../.." && pwd)"
LINES="$ROOT/.tmp/mo-tts/lines.json"
OUT="$ROOT/.tmp/mo-tts/wav"
mkdir -p "$OUT"
export BAILIAN_CALLER_TYPE=agent BAILIAN_CALLER_NAME=zcode BAILIAN_SKILL_NAME=bailian-gen BAILIAN_SKILL_VERSION=2.8.0

count=$(python3 -c "import json;print(len(json.load(open('$LINES'))['lines']))")
ok=0
for i in $(seq 0 $((count - 1))); do
  read -r id text < <(python3 -c "
import json, sys
l = json.load(open('$LINES'))['lines'][$i]
print(l['id'], l['text'].replace(' ', '\\\\ '))")
  if [ -n "$ONLY" ] && [ "$id" != "$ONLY" ]; then continue; fi
  if [ -s "$OUT/$id.mp3" ]; then echo "skip $id（已存在）"; ok=$((ok + 1)); continue; fi
  printf '合成 %s … ' "$id"
  if bl speech synthesize --model "$MODEL" --voice "$VOICE_ID" --text "$text" --out "$OUT/$id.mp3" --quiet; then
    ok=$((ok + 1))
  else
    echo "✗ $id 失败" >&2
  fi
done
echo "完成 $ok/$count → $OUT"
