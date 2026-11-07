#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""out/voice-v8/lay-v8.py — 旁白轨 v8「按镜铺」重建（一次性生成脚本，产物已固化）

为什么重做：旧 `voice-track-v8.wav` 是「按幕铺」——每幕从幕起点 +0.50s 起、句间 0.35s 连续排，
排到幕尾就停。于是句子的实际落点逐幕漂移（最重 −16.17s，m47 落在 s28），s17/s30/s31/s37 全静音，
s26（分镜写「无」）反倒挤进 4 句。详见 `out/voice-v8/lay-v8.md`。

做法（只动音频与 JSON，不碰画面）：
  ① 行 → 镜：script-v10 §六 的 76 句，逐句去分镜第 5 列（字幕列）里找；`／` 切开逐段比，
     允许「分镜里是被压缩/改写的句子」（双向包含 + 标点归一）。分镜没收的句子按「顺序 + 幕归属」
     就近落到相邻镜（见 lay-v8.md §5 非精确匹配表）。
  ② 镜内重铺：首句 镜起点 +0.60s，句间 0.35s；放不下先压句间到 0.15s，再放不下就把整块前移
     （回填，避免旁白压到下一镜的画面上），最后才允许溢出到下一镜。
  ③ 真声段（opening m01–m07 / ending m54–m62）整段不动，只校验落点。
  ④ 响度：逐条增益沿用旧版（从旧 `voice-track-v8.wav` 逐条最小二乘反解出来的 dB 值，硬编码在
     GAIN_DB 里，**不重新按句归一化**），混完整轨按峰值 −6.0 dBFS 收口。
  ⑤ 每条落点 = 「有声起点 −60ms … 有声终点 +70ms」（与旧 cues-v8.json 同一口径），
     写进 `out/voice-v8/cues-v8.json`；波形按同一段裁切后贴进 292.000s 空轨。

用法：python3 out/voice-v8/lay-v8.py        # 覆盖 cues-v8.json / voice-track-v8.wav（首次会留 .bak）
"""
import json, os, subprocess, shutil, sys
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.chdir(ROOT)
SR, TOTAL = 48000, 292.0
N = int(TOTAL * SR)
CLIPDIR = 'out/voice-v8/clips'
TMP = 'out/voice-v8/.lay-tmp'
WAV = 'out/voice-v8/voice-track-v8.wav'
CUES = 'out/voice-v8/cues-v8.json'
OP_OFF, END_OFF, REAL_GAIN_DB = 0.240, 266.580, -3.13
HEAD, TAIL, GAP, MINGAP, LIMIT = 0.60, 0.25, 0.35, 0.15, 266.35

# 旧版逐条增益（dB）——从旧 voice-track-v8.wav 与 clips 逐条最小二乘反解，见 lay-v8.md §7
GAIN_DB = {
    'f01': -0.42, 'f02': -3.67, 'f03': -1.66, 'f04': -3.54, 'f05': -0.86, 'f06': -1.45,
    'f07': -3.81, 'f08': -5.14,
    'm08': -8.70, 'm09': -10.94, 'm10': -8.68, 'm11': -9.78, 'm12': -8.67, 'm13': -8.37,
    'm14': -8.38, 'm15': -8.38, 'm16': -9.57, 'm17': -9.28, 'm18': -9.60, 'm19': -10.35,
    'm20': -7.69, 'm21': -8.55, 'm22': -10.63, 'm23': -8.76, 'm24': -9.20, 'm25': -8.11,
    'm26': -7.80, 'm27': -8.59, 'm28': -9.36, 'm29': -9.42, 'm30': -6.97, 'm31': -7.65,
    'm32': -9.17, 'm33': -8.54, 'm34': -7.66, 'm35': -8.35, 'm36': -7.58, 'm37': -9.49,
    'm38': -9.13, 'm39': -8.25, 'm40': -8.29, 'm41': -7.63, 'm42': -8.42, 'm43': -9.38,
    'm44': -7.16, 'm45': -10.00, 'm46': -10.04, 'm47': -9.68, 'm48': -8.71, 'm49': -8.30,
    'm50': -8.36, 'm51': -8.35, 'm52': -8.93, 'm53': -8.28,
    'poem-1': -1.71, 'poem-2': -2.27, 'poem-3': -5.01, 'poem-4': -4.42, 'poem-5': -0.26,
    'poem-6': -4.07,
}

# 行 → 镜（分镜第 5 列；s01–s04 / s38–s41 为真声段，只校验不铺）
ASSIGN = {
    's01': ['m01'], 's02': ['m02', 'm03'], 's03': ['m04'], 's04': ['m05', 'm06', 'm07'],
    's05': ['m08', 'm09'], 's06': ['m10', 'm11'], 's07': ['m12', 'm13', 'm14'],
    's08': ['m15', 'f01'], 's09': ['m16'], 's10': ['m17', 'm18'],
    's11': ['m19', 'm20', 'm21'], 's12': ['f02', 'm22', 'm23'], 's13': ['m24', 'f03'],
    's14': ['f04'], 's15': ['m25', 'm26'], 's16': ['m27'], 's17': ['m28'],
    's18': ['m29', 'm30'], 's19': ['m31'], 's20': ['m32', 'm33'],
    's21': ['m34', 'm35'], 's22': ['m36', 'f05'], 's23': ['f06', 'm37'],
    's24': ['m38', 'f07', 'm39'], 's25': ['m40'], 's26': [],
    's27': ['m41', 'm42'], 's28': ['m43', 'f08'], 's29': ['m44', 'm45'], 's30': ['m46'],
    's31': ['m47', 'm48', 'm49'], 's32': ['m50'], 's33': ['m51'], 's34': ['m52'],
    's35': ['m53', 'poem-1', 'poem-2'], 's36': ['poem-3', 'poem-4'],
    's37': ['poem-5', 'poem-6'],
    's38': ['m54', 'm55'], 's39': ['m56', 'm57'], 's40': ['m58', 'm59'],
    's41': ['m60', 'm61', 'm62'],
}
REAL = {'m01', 'm02', 'm03', 'm04', 'm05', 'm06', 'm07',
        'm54', 'm55', 'm56', 'm57', 'm58', 'm59', 'm60', 'm61', 'm62'}


def read_wav(path):
    b = open(path, 'rb').read()
    off, fmt, data = 12, None, None
    while off + 8 <= len(b):
        cid, sz = b[off:off + 4], int.from_bytes(b[off + 4:off + 8], 'little')
        body = off + 8
        if cid == b'fmt ':
            fmt = dict(ch=int.from_bytes(b[body + 2:body + 4], 'little'),
                       sr=int.from_bytes(b[body + 4:body + 8], 'little'),
                       bits=int.from_bytes(b[body + 14:body + 16], 'little'))
        if cid == b'data':
            data = b[body:body + (min(sz, len(b) - body) if sz > 0 else len(b) - body)]
            break
        off = body + sz + (sz & 1)
    a = np.frombuffer(data, dtype='<i2').astype(np.float64) / 32768.0
    if fmt['ch'] > 1:
        a = a.reshape(-1, fmt['ch']).mean(axis=1)
    return a, fmt


def write_wav(path, x, sr=SR):
    n = len(x)
    pcm = np.clip(np.round(x * 32767), -32768, 32767).astype('<i2').tobytes()
    hdr = (b'RIFF' + (36 + n * 2).to_bytes(4, 'little') + b'WAVEfmt ' + (16).to_bytes(4, 'little')
           + (1).to_bytes(2, 'little') + (1).to_bytes(2, 'little') + sr.to_bytes(4, 'little')
           + (sr * 2).to_bytes(4, 'little') + (2).to_bytes(2, 'little') + (16).to_bytes(2, 'little')
           + b'data' + (n * 2).to_bytes(4, 'little'))
    open(path, 'wb').write(hdr + pcm)


def db(x):
    return 20 * np.log10(max(float(x), 1e-12))


def load_clips():
    """clips 24k → 48k float（ffmpeg 只做重采样，不改内容）"""
    os.makedirs(TMP, exist_ok=True)
    out = {}
    for fn in sorted(os.listdir(CLIPDIR)):
        if not fn.endswith('.wav'):
            continue
        name = fn[:-4]
        raw = os.path.join(TMP, name + '.raw')
        if not os.path.exists(raw):
            r = subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', os.path.join(CLIPDIR, fn),
                                '-ac', '1', '-ar', str(SR), '-c:a', 'pcm_f32le', '-f', 'f32le', raw],
                               capture_output=True)
            if r.returncode != 0:
                raise SystemExit(r.stderr.decode('utf-8', 'replace'))
        out[name] = np.fromfile(raw, dtype='<f4').astype(np.float64)
    return out


def extent(a):
    """有声段（−42dB / 30ms 平滑）+ 头 60ms / 尾 70ms 气口；与旧 cues 同口径"""
    hop = 480
    n = len(a) // hop
    env = np.sqrt((a[:n * hop].reshape(n, hop) ** 2).mean(axis=1))
    e = 20 * np.log10(np.maximum(env, 1e-12))
    sm = np.convolve(e, np.ones(3) / 3, mode='same')
    on = np.where(sm > -42)[0]
    a0 = max(0, on[0] - 1) * 0.01
    b0 = min(n, on[-1] + 2) * 0.01
    return round(max(0.0, a0 - 0.06), 3), round(min(len(a) / SR, b0 + 0.07), 3)


def main():
    shots = json.load(open('videos/zhi-guo-xiang/shots-manifest.json'))['shots']
    SH = [dict(id=s['id'], t0=s['startFrame'] / 30.0, t1=(s['startFrame'] + s['durationFrames']) / 30.0)
          for s in shots]
    clips = load_clips()
    EXT = {k: extent(v) for k, v in clips.items()}
    DUR = {k: round(v[1] - v[0], 3) for k, v in EXT.items()}

    # ---- 镜内铺 ----
    ev, prev_end = [], 0.0
    for s in SH:
        ids = [i for i in ASSIGN[s['id']] if i not in REAL]
        if not ids:
            continue
        durs = [DUR[i] for i in ids]
        k, total = len(ids), sum(durs)
        span = lambda g: total + g * (k - 1)
        anchor = s['t0'] + HEAD
        t0, g, how = max(anchor, prev_end + GAP), GAP, 'anchor'
        if t0 + span(GAP) > s['t1'] - TAIL + 1e-9:
            g, how = (max(MINGAP, (s['t1'] - TAIL - t0 - total) / (k - 1)) if k > 1 else GAP), 'compress'
            if t0 + span(g) > s['t1'] - TAIL + 1e-9:
                t_g, t_m = s['t1'] - TAIL - span(GAP), s['t1'] - TAIL - span(MINGAP)
                if t_g >= prev_end + GAP:
                    t0, g, how = t_g, GAP, 'backfill'
                elif t_m >= prev_end + MINGAP:
                    t0, g, how = t_m, MINGAP, 'backfill+min'
                else:
                    t0, g, how = prev_end + MINGAP, MINGAP, 'spill'
        for j, lid in enumerate(ids):
            ev.append(dict(id=lid, shot=s['id'], start=t0, dur=DUR[lid], how=how))
            t0 += DUR[lid] + (g if j < k - 1 else 0)
        prev_end = ev[-1]['start'] + ev[-1]['dur']

    # ---- 结尾真声是硬锚点：任何一句不许压到 m54(266.646) 上 ----
    nxt = LIMIT
    for e in reversed(ev):
        latest = nxt - e['dur'] - MINGAP
        if e['start'] > latest + 1e-9:
            e['start'] = round(latest, 4)
        nxt = e['start']

    # ---- 混音 ----
    track = np.zeros(N)
    for e in ev:
        p0, p1 = EXT[e['id']]
        seg = clips[e['id']][int(p0 * SR):int(p1 * SR)] * (10 ** (GAIN_DB[e['id']] / 20.0))
        st = int(round(e['start'] * SR))
        track[st:st + len(seg)] += seg
    rg = 10 ** (REAL_GAIN_DB / 20.0)
    for path, off in (('videos/zhi-guo-xiang/assets/vo-pack/audio/opening-trim.wav', OP_OFF),
                      ('videos/zhi-guo-xiang/assets/vo-pack/audio/ending-trim.wav', END_OFF)):
        a, _ = read_wav(path)
        st = int(round(off * SR))
        track[st:st + len(a)] += a * rg
    peak = float(np.abs(track).max())
    track *= 10 ** (-6.0 / 20.0) / peak

    if not os.path.exists(WAV + '.bak'):
        shutil.copy2(WAV, WAV + '.bak')
    if not os.path.exists(CUES + '.bak'):
        shutil.copy2(CUES, CUES + '.bak')
    write_wav(WAV, track)

    old = json.load(open(CUES + '.bak'))
    cues = {'opening': old['opening']}
    for e in ev:
        cues[e['id']] = {'start': round(e['start'], 3), 'end': round(e['start'] + e['dur'], 3)}
    cues['ending'] = old['ending']
    order = (['opening'] + [f'm{i:02d}' for i in range(1, 54)] + [f'f{i:02d}' for i in range(1, 9)]
             + [f'poem-{i}' for i in range(1, 7)] + ['ending'])
    json.dump({k: cues[k] for k in order if k in cues}, open(CUES, 'w'), ensure_ascii=False, indent=2)

    print('lines %d  dur %.3f  peak %.3f dBFS  rms %.3f dBFS  gain %+.3f dB'
          % (len(ev), len(track) / SR, db(np.abs(track).max()), db(np.sqrt((track ** 2).mean())), db(10 ** (-6.0 / 20.0) / peak)))
    json.dump([dict(id=e['id'], shot=e['shot'], start=round(e['start'], 4), dur=e['dur'], how=e['how']) for e in ev],
              open(os.path.join(TMP, 'schedule.json'), 'w'), ensure_ascii=False, indent=1)


if __name__ == '__main__':
    main()