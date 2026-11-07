#!/usr/bin/env python3
"""鬼帧检测（design-v11 §六 / 2026-11-07 事故）

Chrome 156 + Remotion 并发截图时，shared-memory capture 偶发返回错 surface：
整帧变成「画面缩小到 1/3、平铺成 3×3 九宫格」，成片里就是随机帧闪一下九宫格。

判据：帧按宽度三等分，左/中/右三块几乎逐像素相同（而整帧本身有明暗层次）→ 鬼帧。
纯色/纯空镜的三块也会相同，所以同时要求整帧动态范围 ≥ RANGE_MIN。

实现：一次 ffmpeg 把整片解码成 96×54 灰度 raw 流交给 numpy，**逐帧全扫**（快速、不漏帧）。

用法：
  python3 scripts/check-ghost-frames.py <mp4...> [--step N] [--quiet]
  python3 scripts/check-ghost-frames.py --dir out/shots/zhi-guo-xiang
退出码：0 = 干净；1 = 有鬼帧（stderr 列出文件与帧号）
"""
import subprocess
import sys
from pathlib import Path

import numpy as np

W, H = 96, 54
THIRD_SIM = 1.5  # 相邻三块的平均绝对差（0–255）：鬼帧的三块是同一张图的副本，实测恒为 0.0
SD_MIN = 8.0  # 帧标准差下限：低于此是纯色/近纯色帧（片头字卡、黑场），不做判断


def analyze(path: str, step: int = 1) -> tuple[int, list[int], int]:
    proc = subprocess.run(
        ["ffmpeg", "-nostdin", "-v", "error", "-i", path, "-vf", f"scale={W}:{H}",
         "-f", "rawvideo", "-pix_fmt", "gray", "-"],
        capture_output=True,
    )
    if proc.returncode != 0:
        print(f"! 解码失败：{path}\n{proc.stderr.decode()[:300]}")
        return 0, [], 0
    buf = np.frombuffer(proc.stdout, dtype=np.uint8)
    n = buf.size // (W * H)
    if n == 0:
        return 0, [], 0
    frames = buf[: n * W * H].reshape(n, H, W).astype(np.float32)
    # 鬼帧签名：整帧缩到 1/3 后平铺 3×3，于是相邻三等分**逐像素相同**（实测 d3 = 0.0），
    # 而正常画面 d3 ≈ 20–30。用 d3 < 1.5 且 sd > 8 判定，可避开片头字卡/黑场这类本来就平的帧。
    t = W // 3
    d3 = np.maximum(
        np.abs(frames[:, :, :t] - frames[:, :, t:2 * t]).mean(axis=(1, 2)),
        np.abs(frames[:, :, t:2 * t] - frames[:, :, 2 * t:3 * t]).mean(axis=(1, 2)),
    )
    sd = frames.std(axis=(1, 2))
    ghost = (d3 < THIRD_SIM) & (sd >= SD_MIN)
    idx = [int(i) for i in np.nonzero(ghost)[0] if i % step == 0]
    return n, idx, int(ghost.sum())


def main() -> int:
    args = sys.argv[1:]
    step, quiet = 1, False
    if "--step" in args:
        k = args.index("--step")
        step = int(args[k + 1])
        del args[k:k + 2]
    if "--quiet" in args:
        quiet = True
        args.remove("--quiet")
    targets: list[str] = []
    if "--dir" in args:
        k = args.index("--dir")
        d = Path(args[k + 1])
        del args[k:k + 2]
        targets = sorted(str(p) for p in d.glob("*.mp4"))
    targets += [a for a in args if a.endswith(".mp4")]
    if not targets:
        print("用法: check-ghost-frames.py <mp4...> | --dir <目录> [--step N] [--quiet]")
        return 2

    dirty = 0
    for t in targets:
        n, idx, total = analyze(t, step)
        if total:
            dirty += 1
            print(f"✗ {Path(t).name}: {total} 个鬼帧（{n} 帧中），帧号示例 {idx[:8]}", file=sys.stderr)
        elif not quiet:
            print(f"✓ {Path(t).name}: {n} 帧全扫干净")
    if dirty:
        print(f"\n✗ {dirty}/{len(targets)} 个文件含鬼帧 —— 必须重渲", file=sys.stderr)
        return 1
    print(f"\n✓ {len(targets)} 个文件、逐帧全扫无鬼帧")
    return 0


if __name__ == "__main__":
    sys.exit(main())