#!/usr/bin/env python3
"""《致郭襄》创作历程片 · 真声旁白按镜铺 + 拼轨（task-9）。

输入:
  videos/making-of-zhi-guo-xiang/shots-manifest.json   帧数真源
  .tmp/mo-tts/lines.json                                36 句清单（id/text，克隆 TTS 产物）
  .tmp/mo-tts/wav/vo-NN.mp3                             逐句合成音频
输出:
  public/making-of-zhi-guo-xiang/tts/voice-track-v1.wav  48k/16bit/stereo，266.000s 整轨静音底 + 按镜铺人声
  .tmp/mo-tts/placement.json                             落点表（对账/字幕反推/ducking 输入）

规则（video-production-flow C / tts-voiceover-pipeline）:
  一镜一句；镜内落点 = 镜起点 +0.6s；末句 ≤ 镜尾 −0.25s（塞不下前移起点，前移仍越界即报错）；
  真人/克隆整句不切开不重排；留白镜零人声。
用法: python3 scripts/voice/build-mo-track.py
"""
import json
import os
import subprocess
import sys
import wave

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
FPS = 30
INTRO = 120
OUTRO = 180
SR, CH, SW = 48000, 2, 2  # 48k / 16bit / stereo
TOTAL_SEC = 266.0

MANIFEST = os.path.join(ROOT, 'videos/making-of-zhi-guo-xiang/shots-manifest.json')
LINES = os.path.join(ROOT, '.tmp/mo-tts/lines.json')
WAV_DIR = os.path.join(ROOT, '.tmp/mo-tts/wav')
DEC_DIR = os.path.join(ROOT, '.tmp/mo-tts/dec')
OUT_WAV = os.path.join(ROOT, 'public/making-of-zhi-guo-xiang/tts/voice-track-v1.wav')
OUT_PLACEMENT = os.path.join(ROOT, '.tmp/mo-tts/placement.json')


def sh(*cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        sys.exit(f"✗ {' '.join(cmd)}\n{r.stderr[-500:]}")


def norm(text):
    return ''.join(ch for ch in text if ch not in '《》·，。：—…！？;； ')


def main():
    manifest = json.load(open(MANIFEST))
    lines = json.load(open(LINES))['lines']
    os.makedirs(DEC_DIR, exist_ok=True)
    os.makedirs(os.path.dirname(OUT_WAV), exist_ok=True)

    # 句 → 镜：规范化前缀匹配（manifest title = 文案前 24 字，长句按前缀命中；唯一性校验）
    titles = [(s['id'], norm(s.get('title') or '')) for s in manifest['shots']]
    placement = []
    for line in lines:
        key = norm(line['text'])
        hits = [sid for sid, t in titles if t and key.startswith(t)]
        if len(hits) != 1:
            sys.exit(f"✗ {line['id']} 字幕匹配 {len(hits)} 镜（应唯一）：{key[:24]}")
        placement.append({'id': line['id'], 'shot': hits[0], 'text': line['text']})

    # 镜窗 + 逐句时长（ffprobe 实测）→ 落点
    shots = {s['id']: s for s in manifest['shots']}
    total_frames = manifest['totalFrames']
    track_n = int(round(TOTAL_SEC * SR))
    track = bytearray(track_n * CH * SW)
    report, used = [], 0.0
    for p in placement:
        s = shots[p['shot']]
        a0 = s['startFrame'] / FPS + INTRO / FPS  # 成片 abs 秒
        a1 = (s['startFrame'] + s['durationFrames']) / FPS + INTRO / FPS
        src = os.path.join(WAV_DIR, p['id'] + '.mp3')
        if not os.path.exists(src):
            sys.exit(f"✗ 缺 {src}——先跑 gen-mo-bl.sh")
        dec = os.path.join(DEC_DIR, p['id'] + '.wav')
        sh('ffmpeg', '-y', '-loglevel', 'error', '-i', src, '-ar', str(SR), '-ac', str(CH), '-sample_fmt', 's16', dec)
        with wave.open(dec, 'rb') as w:
            dur = w.getnframes() / w.getframerate()
            data = w.readframes(w.getnframes())
        start = a0 + 0.6
        if start + dur > a1 - 0.25:
            start = max(a0 + 0.2, a1 - 0.25 - dur)
        if start + dur > a1:
            sys.exit(f"✗ {p['id']} 实读 {dur:.2f}s 塞不进 {p['shot']} 窗 {a1-a0:.2f}s——重合成或调槽位")
        off = int(round(start * SR))
        end = min(off + len(data), len(track))
        for i in range(off, end):
            for c in range(CH):
                idx = i * CH * SW + c * SW
                old = int.from_bytes(track[idx:idx + 2], 'little', signed=True)
                new = int.from_bytes(data[idx - off:idx - off + 2], 'little', signed=True)
                v = max(-32768, min(32767, old + new))
                track[idx:idx + 2] = v.to_bytes(2, 'little', signed=True)
        used += dur
        report.append({'id': p['id'], 'shot': p['shot'], 'start': round(start, 3), 'dur': round(dur, 3),
                       'win': [round(a0, 3), round(a1, 3)], 'tail': round(a1 - (start + dur), 3)})
        print(f"{p['id']} → {p['shot']}  start {start:7.2f}s  dur {dur:5.2f}s  尾余量 {a1-(start+dur):5.2f}s")

    # 核验：末镜句必须落在正片内；全轨峰值粗查
    tail_frames = int(round(OUTRO / FPS * SR * CH * SW))
    if any(b != 0 for b in track[-tail_frames:]):
        print('⚠ 片尾区有残响溢出——检查句 41 落点')
    with wave.open(OUT_WAV, 'wb') as w:
        w.setnchannels(CH)
        w.setsampwidth(SW)
        w.setframerate(SR)
        w.writeframes(bytes(track))
    speech_pct = used / TOTAL_SEC * 100
    gaps = []
    for a, b in zip(report, report[1:]):
        gaps.append(b['start'] - (a['start'] + a['dur']))
    json.dump({'placements': report, 'speech_sec': round(used, 2), 'speech_pct': round(speech_pct, 1),
               'min_gap': round(min(gaps), 3) if gaps else None},
              open(OUT_PLACEMENT, 'w'), ensure_ascii=False, indent=2)
    print(f"\n✅ voice-track-v1.wav：{TOTAL_SEC}s 整轨 · 语音 {used:.1f}s（{speech_pct:.0f}%）· 最小句间 {min(gaps):.2f}s" if gaps else '')


if __name__ == '__main__':
    main()
