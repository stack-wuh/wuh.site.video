#!/usr/bin/env python3
"""《致郭襄》创作历程片 · BGM 床构建（task-10，music.md 方案落地）。

布局（两遍 + 全静默断点，详见 videos/preprod-making-of-zhi-guo-xiang/assets/music.md）:
  pass1  abs 4.000–141.500  ← 曲 0.000–137.500（尾 3s 淡出）      序→四
  断点   abs 141.500–149.000  全静默（s24 留白镜整镜）             删镜后多出来的戏
  pass2  abs 149.000–266.000  ← 曲 0.000–117.000（曲首复奏）      五→终（「重写」的听感隐喻）
  pass2 尾淡出 253.5–265.5（s41 落版）
避让（正片判据，build-bgm-mix.py 同式）:
  人声区间 → 床 p90；p90 < −14 dBFS 不压；depth = clamp(round0.5(p90+17), 2.5, 9.0)；
  包络 −0.15s 起压 / +0.35s 放完；间隔 <3s 合并；60ms 平滑。
电平: BASE_DB −11；序段 4.0–16.0 与 s35 独奏窗 211.0–220.0 各 +2dB。
输入: out/ai-yi.mp3（版权曲工作副本，不入库）+ cues json（placement.json 或计划 cue）
输出: .tmp/mo-bed/bgm-bed-v1.wav（48k/16bit/stereo 266.000s，自带避让包络）+ 余量报告
用法: venv python（需 numpy）—— .tmp/venv/bin/python scripts/voice/build-mo-bed.py <cues.json>
"""
import json
import os
import subprocess
import sys
import wave

import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SR, CH = 48000, 2
TOTAL_SEC = 266.0
BASE_DB = -11.0
BGM = os.path.join(ROOT, 'out/ai-yi.mp3')
OUT = os.path.join(ROOT, '.tmp/mo-bed/bgm-bed-v1.wav')
# 布局常量（music.md）
P1_ABS, P1_LEN = 4.0, 137.5
P2_ABS, P2_LEN = 149.0, 117.0
FADE1_AT, FADE1_LEN = P1_ABS + P1_LEN - 3.0, 3.0
FADE2_AT, FADE2_LEN = 253.5, 12.0
LIFTS = [(4.0, 16.0, 2.0), (211.0, 220.0, 2.0)]  # 序段钩子 / s35 深夜独奏


def decode(path):
    """ffmpeg 解码为 float32 立体声 [-1,1]"""
    raw = subprocess.run(
        ['ffmpeg', '-v', 'error', '-i', path, '-f', 'f32le', '-acodec', 'pcm_f32le', '-ac', '2', '-ar', str(SR), '-'],
        capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32).reshape(-1, 2).copy()


def db(x):
    return 20 * np.log10(np.maximum(x, 1e-10))


def main():
    cues_path = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, '.tmp/mo-tts/placement.json')
    cues = json.load(open(cues_path))
    cues = cues['placements'] if isinstance(cues, dict) else cues

    n = int(round(TOTAL_SEC * SR))
    bed = np.zeros((n, CH), dtype=np.float32)

    # —— 铺两遍（截断 + 定位 + 淡出；pass2 曲首做零交叉对齐防复奏 click）——
    curve = decode(BGM)
    for abs_at, src_len, fade_at, fade_len, zero_cross in [
        (P1_ABS, P1_LEN, FADE1_AT, FADE1_LEN, False),
        (P2_ABS, P2_LEN, FADE2_AT, FADE2_LEN, True),
    ]:
        seg = curve[: int(src_len * SR)].copy()
        if zero_cross:
            zc = int(np.argmin(np.abs(seg[: SR // 10, 0])))
            seg = seg[zc: zc + int(src_len * SR)]
        g = 10 ** (BASE_DB / 20) * np.ones((len(seg), 1), dtype=np.float32)
        if fade_len > 0:
            fa = int((fade_at - abs_at) * SR)
            fl = int(fade_len * SR)
            if fa < len(g):
                ramp = np.linspace(1.0, 0.0, max(1, min(fl, len(g) - fa)), dtype=np.float32).reshape(-1, 1)
                g[fa: fa + len(ramp)] *= ramp
                g[fa + len(ramp):] = 0.0
        for lo, hi, lift in LIFTS:  # 站出/独奏提幅
            a, b = int(max(0, lo - abs_at) * SR), int(min(src_len, hi - abs_at) * SR)
            if b > a:
                g[a:b] *= 10 ** (lift / 20)
        off = int(abs_at * SR)
        end = min(off + len(seg), n)
        bed[off:end] += seg[: end - off] * g[: end - off]

    # —— 避让包络（正片判据）——
    voice_iv = [(c['start'] - 0.15, c['start'] + c['dur'] + 0.35) for c in cues]
    voice_iv.sort()
    merged = []
    for lo, hi in voice_iv:
        if merged and lo - merged[-1][1] < 3.0:
            merged[-1] = (merged[-1][0], max(merged[-1][1], hi))
        else:
            merged.append((lo, hi))
    env_db = np.zeros(n, dtype=np.float32)
    margins = []
    win = int(0.02 * SR)  # 20ms 分窗 RMS 的 p90（正片判据口径）
    # 目标电平标定（2026-11-08 实测）：本曲 BASE_DB −11 下区间床 p90 中位 −24.5 / 最热 −17.8，
    # 正片「p90+17、阈值 −14」的绝对式在本测量口径上不迁移——改为压到目标：
    # bed-in-voice ≈ voice_rms − 8dB（voice_rms 默认 −20，真声到位后由 placement.json 实测值覆盖）。
    voice_rms = cues[0].get('voice_rms', -20.0) if cues else -20.0
    target = voice_rms - 8.0
    for lo, hi in merged:
        a, b = max(0, int(lo * SR)), min(n, int(hi * SR))
        if b <= a:
            continue
        seg = bed[a:b]
        blocks = (b - a) // win
        if blocks == 0:
            continue
        rms = np.sqrt((seg[: blocks * win].reshape(blocks, win, CH) ** 2).mean(axis=(1, 2)))
        p90 = float(np.percentile(db(rms), 90))
        depth = float(np.clip(round((p90 - target) * 2) / 2, 0.0, 9.0))
        env_db[a:b] = -depth
        if depth > 0:
            margins.append({'lo': round(lo, 2), 'hi': round(hi, 2), 'p90': round(p90, 1), 'depth': depth})
    # 包络平滑（60ms 盒滤波）+ 攻/放斜坡由区间端点 −0.15/+0.35 天然承担
    k = int(0.06 * SR)
    kernel = np.ones(k, dtype=np.float32) / k
    env_lin = 10 ** (np.convolve(env_db, kernel, mode='same') / 20).astype(np.float32)
    bed *= env_lin.reshape(-1, 1)

    peak = float(np.abs(bed).max())
    if peak > 0.891:
        bed *= 0.891 / peak
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with wave.open(OUT, 'wb') as w:
        w.setnchannels(CH)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((bed * 32767).astype('<i2').tobytes())

    print(f'✅ bgm-bed-v1.wav：{TOTAL_SEC}s · 峰值 {db(peak):.2f} dBFS（>0.891 已整体衰减）')
    print(f'   避让段 {len(margins)}（合并前 {len(voice_iv)}）· 计划余量最小 {min([m["p90"] + m["depth"] for m in margins], default=0):.1f} dB')
    json.dump(margins, open(os.path.join(ROOT, '.tmp/mo-bed/margins.json'), 'w'), ensure_ascii=False, indent=2)


if __name__ == '__main__':
    main()
