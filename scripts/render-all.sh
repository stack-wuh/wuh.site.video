#!/bin/bash
# 渲染驱动器（shot-spec §5 方案 A·清点式编排）——一镜一任务，互不牵连：
#   bundle 一次 → 逐镜短命 Node 进程（每镜独立 ×3 重试；某镜全败只记账跳过，不绑架其余镜）
#   → 全部跑完后统一清点：全绿才 --assemble 终装；有未过镜则列出清单退出（重跑驱动器只补这些，其余走缓存）。
# 本驱动器自身不是 Node，是编排层保险丝的本体：每次子进程退出必通知。
# 用法：mise exec -- bash scripts/render-all.sh   （CI 上直接 bash scripts/render-all.sh，通知自动降级为日志）
set -u
cd "$(dirname "$0")/.."
OUT=out

notify() {
  osascript -e "display notification \"$1\" with title \"site-film 驱动器\" sound name \"Glass\"" >/dev/null 2>&1 || true
  echo "[driver] $1"
}

notify "[START] bundle + 逐镜渲染"
if ! node scripts/render-film.mjs --bundle-only; then
  notify "[FAIL] bundle 失败，停止"
  exit 1
fi
BUNDLE_DIR=$(cat "$OUT/bundle-path.txt")

IDS=$(node -e "const m=require('./videos/site-film/shots-manifest.json');console.log(m.shots.map(s=>s.id).join(' '))")
TOTAL=$(echo $IDS | wc -w | tr -d ' ')
DONE=0
FAILED=""
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
    FAILED="$FAILED $id"
    notify "[WARN] $id 三轮全败，记账跳过继续（其余镜不受牵连）"
  fi
  DONE=$((DONE + 1))
  echo "[driver] 进度 $DONE/$TOTAL"
done

if [ -n "$FAILED" ]; then
  notify "[FAIL] 清点：$FAILED 未过（重跑驱动器只补这些，其余走缓存）"
  exit 1
fi

notify "[STAGE] $TOTAL 镜全绿 → 终装（concat + 音轨 + 三重终验）"
if node scripts/render-film.mjs --assemble --bundle-dir "$BUNDLE_DIR"; then
  notify "[DONE] 出片完成 out/site-film-final.mp4"
else
  notify "[FAIL] 终装失败，查 render-status.txt"
  exit 1
fi
