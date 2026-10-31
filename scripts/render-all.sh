#!/bin/bash
# 渲染驱动器（shot-spec §5 方案 A）——非 Node 外层循环：逐镜短命 Node 进程。
# 段错误（exit 139）最多损失当前一镜；本驱动器自身不是 Node，是编排层保险丝的本体：
# 每次子进程退出必通知，单镜 3 轮止损，全镜齐后 --assemble 终装。
# 用法：mise exec -- bash scripts/render-all.sh   （CI 上直接 bash scripts/render-all.sh，通知自动降级为日志）
set -u
cd "$(dirname "$0")/.."
OUT=out
BUNDLE_DIR="$OUT/bundle"

notify() {
  osascript -e "display notification \"$1\" with title \"site-film 驱动器\" sound name \"Glass\"" >/dev/null 2>&1 || true
  echo "[driver] $1"
}

notify "[START] bundle + 逐镜渲染"
rm -rf "$BUNDLE_DIR"
if ! npx remotion bundle src/index.ts "$BUNDLE_DIR" --log=error; then
  notify "[FAIL] bundle 失败，停止"
  exit 1
fi

IDS=$(node -e "const m=require('./videos/site-film/shots-manifest.json');console.log(m.shots.map(s=>s.id).join(' '))")
TOTAL=$(echo $IDS | wc -w | tr -d ' ')
DONE=0
for id in $IDS; do
  ok=0
  for attempt in 1 2 3; do
    node scripts/render-film.mjs --only "$id" --bundle-dir "$BUNDLE_DIR"
    code=$?
    if [ "$code" -eq 0 ]; then ok=1; break; fi
    notify "[WARN] $id 第 $attempt/3 次失败 exit=$code，重试"
    sleep 5
  done
  if [ "$ok" -ne 1 ]; then
    notify "[FAIL] $id 三轮全败，驱动器停止（已完成镜在缓存，重跑即续）"
    exit 1
  fi
  DONE=$((DONE + 1))
  echo "[driver] 进度 $DONE/$TOTAL"
done

notify "[STAGE] 45 镜齐 → 终装"
if node scripts/render-film.mjs --assemble --bundle-dir "$BUNDLE_DIR"; then
  notify "[DONE] 出片完成 out/site-film-final.mp4"
else
  notify "[FAIL] 终装失败，查 render-status.txt"
  exit 1
fi
