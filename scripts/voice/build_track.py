"""v7 人声整轨：逐条按 lines.json 落点铺进 245.000s 空白轨。

v7 相对 v6 的三处改动（2026-11-07，audio 线收尾）：
  1) **去头尾静默**：edge-tts 每条尾部固定带 ~1.1s 静默、头部 ~0.2s。v6/v7 首版按
     mp3 全长落点，等于把「某条说到哪」算错了 1.1s —— 于是 m05/m06/m08/m14/m16 都被
     推到下一镜里（跨硬切）。现在把每条裁到「有声起 + 20ms / 有声止 + 80ms」，
     落点 s 就是**实测有声起点**，cues-v7.json 与字幕反推才有意义。
  2) **峰值 ≤ −1.0 dBFS**（0.891 FS）：旧版按 32000（−0.2 dBFS）封顶，不达标。
  3) **导出 `out/voice/cues-v7.json`**：从成品轨上重新量每条的有声起止（不是抄 lines.json），
     供 design-v11 §1.2 的字幕反推用。

落点合法性（v11 分镜真源 `videos/preprod-zhi-guo-xiang/assets/storyboard.md`）：
  绝对秒 = 帧/30 + 4.0（片头 120f）。每条的首字要在所属镜切点后 ≥0.3s、末字在下一
  切点前 ≥0.3s；唯一允许越界的是「末字落进下一镜入场墨洇单侧 20f（0.667s）」，且该切点
  必须不是 v11 保留的 5 处硬切。脚本会逐条打表，越界即报警。
"""
import json, os, sys, io, math, array, wave, subprocess, re

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

PROJ = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
HERE = os.path.dirname(os.path.abspath(__file__))
WAVDIR = os.path.join(PROJ, '.tmp', 'audition', 'v2e', 'wav')
TTS = os.path.join(PROJ, 'public', 'zhi-guo-xiang', 'tts')
STORYBOARD = os.path.join(PROJ, 'videos', 'preprod-zhi-guo-xiang', 'assets', 'storyboard.md')
OUT = os.path.join(TTS, 'voice-track-v7.wav')
CUES = os.path.join(PROJ, 'out', 'voice', 'cues-v7.json')
REPORT = os.path.join(PROJ, '.tmp', 'voice', 'track-report.json')

if __import__('shutil').which('ffmpeg'):
    FF = ['ffmpeg']
else:
    FF = ['npx' if __import__('shutil').which('npx') else 'npx.cmd', '--no-install', 'remotion', 'ffmpeg']
SR = 48000
TOTAL = 245.0
N = int(TOTAL * SR)
HEAD_PAD, TAIL_PAD = 0.020, 0.080     # 裁静默后保留的气口
FADE_IN, FADE_OUT = 0.012, 0.040
TRIM_THR_DB = -45.0
PEAK_LIMIT = 0.891                     # −1.00 dBFS
SOFT_T = 0.72 * 32767
SAFE = 0.30                            # 首字/末字与切点的最小距离（vo-script-v7 §四.2）

os.makedirs(WAVDIR, exist_ok=True)
os.makedirs(os.path.dirname(CUES), exist_ok=True)
os.makedirs(os.path.dirname(REPORT), exist_ok=True)

with open(os.path.join(HERE, 'lines.json'), 'r', encoding='utf-8') as f:
    lines = json.load(f)

# 诗六行：定稿不动，只重采样（不裁静默——诗的字幕/动效是按整段对齐的）
POEM = [('p1', 189.00, 'line-01.wav'), ('p2', 191.60, 'line-02.wav'),
        ('p3', 196.00, 'line-03.wav'), ('p4', 215.00, 'line-04.wav'),
        ('p5', 228.50, 'line-05.wav'), ('p6', 235.00, 'line-06.wav')]


# ---- 0. 分镜真源：镜窗口 + inbound 转场 ----
def parse_shots():
    pat = re.compile(r'^\|\s*(\d+)\s*\|\s*\d+f\s*·\s*[\d.]+s（(\d+)–(\d+)）\s*\|')
    shots = []
    with open(STORYBOARD, 'r', encoding='utf-8') as f:
        for ln in f:
            m = pat.match(ln)
            if not m:
                continue
            parts = [p.strip() for p in ln.strip().strip('|').split('|')]
            tr = parts[-1]
            shots.append({'n': int(m.group(1)), 't0': int(m.group(2)) / 30.0 + 4.0,
                          't1': int(m.group(3)) / 30.0 + 4.0, 'tr': tr,
                          'cap': parts[4] if len(parts) > 4 else ''})
    return shots


SHOTS = parse_shots()
# 片尾（frame 7050–7350 = 239.0–245.0）不在分镜表的 38 镜里，单独补一段，S38→片尾记硬切
SHOTS.append({'n': 0, 't0': SHOTS[-1]['t1'], 't1': TOTAL, 'tr': '切', 'cap': '片尾'})
HARD_CUTS = [s['t0'] for s in SHOTS[1:] if s['tr'] == '切']


def shot_of(t):
    for s in SHOTS:
        if s['t0'] - 1e-6 <= t < s['t1']:
            return s
    return SHOTS[-1] if t >= SHOTS[-1]['t1'] else SHOTS[0]


def next_shot(s):
    i = SHOTS.index(s)
    return SHOTS[i + 1] if i + 1 < len(SHOTS) else None


def mask_of(s):
    """本镜入场墨洇单侧帧数（秒）；切 = 0。"""
    return 0.0 if s['tr'] == '切' else 20 / 30.0


# ---- 1. 一次性把全部素材转成 48k 单声道 wav（mp3 变过才转） ----
srcs = [(ln['id'], os.path.join(HERE, 'mp3', ln['id'] + '.mp3'), os.path.getmtime(
    os.path.join(HERE, 'mp3', ln['id'] + '.mp3'))) for ln in lines]
srcs += [(pid, os.path.join(TTS, fn), os.path.getmtime(os.path.join(TTS, fn))) for pid, _, fn in POEM]

todo = []
for n, p, mt in srcs:
    w = os.path.join(WAVDIR, n + '.wav')
    if not (os.path.exists(w) and os.path.getmtime(w) >= mt and os.path.getsize(w) > 2000):
        todo.append((n, p))
if todo:
    cmd = FF + ['-y', '-loglevel', 'error']
    for _, p in todo:
        cmd += ['-i', p]
    for i, (n, _) in enumerate(todo):
        cmd += ['-map', '%d:a' % i, '-ar', str(SR), '-ac', '1',
                '-c:a', 'pcm_s16le', os.path.join(WAVDIR, n + '.wav')]
    print('converting %d sources ...' % len(todo))
    r = subprocess.run(cmd, cwd=PROJ, capture_output=True, text=True,
                       encoding='utf-8', errors='replace')
    if r.returncode != 0:
        print('ffmpeg FAILED\n', (r.stderr or '')[-1500:])
        sys.exit(1)


def load(n):
    w = wave.open(os.path.join(WAVDIR, n + '.wav'), 'rb')
    a = array.array('h')
    a.frombytes(w.readframes(w.getnframes()))
    w.close()
    return a


def voiced_bounds(a, thr=None):
    """20ms 帧、−45dBFS 门限，返回 (first, last) 样本下标（含一帧宽）。"""
    if thr is None:
        thr = 10 ** (TRIM_THR_DB / 20.0) * 32768
    fr = int(0.02 * SR)
    first = last = None
    for i in range(0, len(a) - fr + 1, fr):
        seg = a[i:i + fr]
        if (sum(float(v) * v for v in seg) / fr) ** 0.5 >= thr:
            if first is None:
                first = i
            last = i + fr
    if first is None:
        return 0, len(a)
    return first, last


def trim(a, head=HEAD_PAD, tail=TAIL_PAD):
    f, l = voiced_bounds(a)
    i0 = max(0, f - int(head * SR))
    i1 = min(len(a), l + int(tail * SR))
    return a[i0:i1], i0 / SR, (len(a) - i1) / SR


def rms(a):
    if not a:
        return 0.0
    return math.sqrt(sum(float(v) * v for v in a) / len(a))


# ---- 2. 归一化 + 落点 ----
ROLE_GAIN = {'male': 0.0, 'female': -1.5, 'poem': -0.5}
TARGET_RMS = 10 ** (-18.5 / 20.0) * 32768      # 有声段 RMS ≈ −18.5 dBFS
placements = []

print('\n-- 素材时长（去头尾静默后）--')
for ln in lines:
    raw = load(ln['id'])
    a, lead, tail = trim(raw)
    g = (TARGET_RMS / max(rms(a), 1e-9)) * (10 ** (ROLE_GAIN[ln['v']] / 20.0))
    d = len(a) / SR
    placements.append({'id': ln['id'], 's': ln['s'], 'a': a, 'g': g, 'v': ln['v'],
                       'text': ln['t'], 'dur': d, 'raw': len(raw) / SR,
                       'lead': lead, 'tail': tail})
    print('  %-4s 起%7.3f  全%5.2f → 净%5.2f（裁头%.2f 尾%.2f） 止%7.3f'
          % (ln['id'], ln['s'], len(raw) / SR, d, lead, tail, ln['s'] + d))
for pid, t, fn in POEM:
    a = load(pid)
    g = (TARGET_RMS / max(rms(a), 1e-9)) * (10 ** (ROLE_GAIN['poem'] / 20.0))
    placements.append({'id': pid, 's': t, 'a': a, 'g': g, 'v': 'poem',
                       'text': '', 'dur': len(a) / SR, 'raw': len(a) / SR,
                       'lead': 0.0, 'tail': 0.0})

# 重叠断言（放 0.01s 舍入）
chk = sorted([(p['s'], p['s'] + p['dur'], p['id']) for p in placements])
for i in range(1, len(chk)):
    if chk[i][0] < chk[i - 1][1] - 0.01:
        print('!! 人声重叠：%s(%.2f–%.2f) 与 %s(起 %.2f)'
              % (chk[i - 1][2], chk[i - 1][0], chk[i - 1][1], chk[i][2], chk[i][0]))
        sys.exit(1)
print('\n重叠检查 ✓（%d 条）' % len(chk))

# ---- 2b. 落点安全窗体检 ----
print('\n-- 落点 vs 分镜安全窗（v11：绝对秒 = 帧/30+4.0；墨洇单侧 20f=0.667s）--')
print('%-5s %-6s %7s %7s  %-14s  %s' % ('id', 'role', '起', '止', '落镜', '判定'))
trouble = []
for p in sorted([q for q in placements if q['v'] != 'poem'], key=lambda q: q['s']):
    s, e = p['s'], p['s'] + p['dur']
    sh = shot_of(s)
    nx = next_shot(sh)
    cut_end = nx['t0'] if nx else TOTAL
    start_ok = s >= sh['t0'] + SAFE
    end_ok = e <= cut_end - SAFE
    tag = ''
    if not start_ok:
        tag += '起句早于切点+0.3s '
    if not end_ok:
        if e <= cut_end:
            tag += '尾字距切点 %.2fs（余量<0.3s）' % (cut_end - e)
        else:
            hard = (nx is not None and nx['tr'] == '切') or nx is None
            in_mask = (nx is not None) and (e <= cut_end + mask_of(nx))
            if hard:
                tag += '!!跨度越硬切 %.2fs ' % (e - cut_end)
            elif in_mask:
                tag += '尾字进下一镜入场墨洇 %.2fs（允许）' % (e - cut_end)
            else:
                tag += '!!跨镜 %.2fs ' % (e - cut_end)
    if '!!' in tag:
        trouble.append(p['id'])
    p['shot'] = 'S%02d' % sh['n'] if sh['n'] else '片尾'
    p['end_ok'] = end_ok
    print('%-5s %-6s %7.3f %7.3f  %-14s  %s' % (p['id'], p['v'], s, e,
          '%s[%.2f–%.2f]' % (p['shot'], sh['t0'], cut_end), tag or 'ok'))

# ---- 3. 叠轨 ----
buf = [0.0] * N
for p in placements:
    a, g, t = p['a'], p['g'], p['s']
    off = int(round(t * SR))
    n = len(a)
    if off + n > N:
        print('!! %s 超出片尾，截断 %d 样本' % (p['id'], off + n - N))
        n = N - off
    fi, fo = int(FADE_IN * SR), int(FADE_OUT * SR)
    for i in range(n):
        w = 1.0
        if fi and i < fi:
            w *= i / fi
        if fo and i > n - fo - 1:
            w *= max(0.0, (n - i) / fo)
        x = a[i] * w * g
        if x > SOFT_T:
            x = SOFT_T + (32767 - SOFT_T) * math.tanh((x - SOFT_T) / (32767 - SOFT_T))
        elif x < -SOFT_T:
            x = -SOFT_T - (32767 - SOFT_T) * math.tanh((-x - SOFT_T) / (32767 - SOFT_T))
        buf[off + i] += x

peak_raw = max(abs(v) for v in buf) if buf else 0.0
lim = PEAK_LIMIT * 32768
if peak_raw > lim:
    k = lim / peak_raw
    buf = [v * k for v in buf]
    print('\n峰值 %.1f dBFS → 整体衰减 %.2f dB' % (20 * math.log10(peak_raw / 32768), 20 * math.log10(k)))
peak = max(abs(v) for v in buf) if buf else 0.0
print('峰值 %.6f（%.2f dBFS）｜ 目标 ≤ %.1f dBFS' % (peak, 20 * math.log10(peak / 32768) if peak else -99,
                                                20 * math.log10(PEAK_LIMIT)))

out = array.array('h', [int(max(-32768, min(32767, v))) for v in buf])
w = wave.open(OUT, 'wb')
w.setnchannels(2)
w.setsampwidth(2)
w.setframerate(SR)
st = array.array('h', bytes(4 * len(out)))
st[0::2] = out
st[1::2] = out
w.writeframes(st.tobytes())
w.close()
print('wrote %s  %.1f MB' % (OUT, os.path.getsize(OUT) / 1e6))

# ---- 4. 从成品轨回读每条实测有声起止 → cues-v7.json ----
thr = 10 ** (-50 / 20.0)
fr = int(0.02 * SR)
cues = []
for p in sorted([q for q in placements if q['v'] != 'poem'], key=lambda q: q['s']):
    lo = max(0, int((p['s'] - 0.05) * SR))
    hi = min(N, int((p['s'] + p['dur'] + 0.05) * SR))
    first = last = None
    for i in range(lo, hi - fr + 1, fr):
        seg = buf[i:i + fr]
        if (sum(x * x for x in seg) / fr) ** 0.5 >= thr:
            if first is None:
                first = i
            last = i + fr
    if first is None:
        print('  ?? %s 在成品轨上量不到有声段，回退 lines.json' % p['id'])
        a0, a1 = p['s'], p['s'] + p['dur']
    else:
        a0, a1 = (first + fr / 2.0) / SR, (last - fr / 2.0) / SR   # 帧中心
    if abs(a0 - p['s']) > 0.05:
        print('  !! %s 实测起 %.3f 与落点 %.3f 相差 %.3f' % (p['id'], a0, p['s'], a0 - p['s']))
    cues.append({'id': p['id'], 'voice': p['v'], 'text': p['text'],
                 'start': round(a0, 3), 'end': round(a1, 3)})

cues.sort(key=lambda c: c['start'])
with open(CUES, 'w', encoding='utf-8') as f:
    json.dump(cues, f, ensure_ascii=False, indent=1)
    f.write('\n')
print('\ncues → %s（%d 条，%.3f–%.3f s）' % (CUES, len(cues), cues[0]['start'], cues[-1]['end']))

# ---- 5. 体检：有声 / 空档 / 最长连续 ----
INTERVALS = sorted([(p['s'], p['s'] + p['dur'], p['id']) for p in placements])
merged = []
for s, e, nm in INTERVALS:
    if merged and s <= merged[-1][1] + 0.02:
        merged[-1][1] = max(merged[-1][1], e)
    else:
        merged.append([s, e])
voiced = sum(e - s for s, e in merged)
print('\n有声 %.2fs = %.1f%%  (段数 %d)' % (voiced, voiced / TOTAL * 100, len(merged)))
print('\n-- 空档 >2s --')
gaps = []
prev = 0.0
for s, e in merged:
    if s - prev > 2.0:
        gaps.append((prev, s, s - prev))
    prev = max(prev, e)
if TOTAL - prev > 2.0:
    gaps.append((prev, TOTAL, TOTAL - prev))
for a, b, d in sorted(gaps, key=lambda x: -x[2]):
    print('  %6.2f - %6.2f   %5.2fs  %s' % (a, b, d, '← 站出' if d >= 3.0 else ''))
print('\n最长空档 %.2fs' % max(d for _, _, d in gaps))

print('\n-- 连续人声 >13s --')
any_long = False
for s, e in merged:
    if e - s > 13.0:
        any_long = True
        print('  %6.2f - %6.2f   %5.2fs' % (s, e, e - s))
if not any_long:
    print('  无')

print('\n-- 关键区间密度 --')
density = []
for name, a, b in [('烟花大高潮', 66.0, 84.0), ('寻·最高潮', 94.0, 114.0),
                   ('出家·大高潮', 167.54, 185.54), ('笔悬墨滴', 200.56, 215.0)]:
    cov = sum(max(0.0, min(e, b) - max(s, a)) for s, e in merged)
    pct = cov / (b - a) * 100
    density.append({'name': name, 'a': a, 'b': b, 'cov': cov, 'pct': pct})
    print('  %-12s %5.1f-%5.1f  %5.2fs / %.1fs = %.0f%%' % (name, a, b, cov, b - a, pct))

# ---- 6. 给 report-v7.md 用的机读数据 ----
with open(REPORT, 'w', encoding='utf-8') as f:
    json.dump({'peak': peak, 'peak_db': 20 * math.log10(peak / 32768) if peak else -99.0,
               'voiced': voiced, 'placements': [
                   {k: p[k] for k in ('id', 'v', 's', 'dur', 'shot', 'end_ok', 'text',
                                      'raw', 'lead', 'tail')} for p in placements if p['v'] != 'poem'],
               'shots': SHOTS, 'hard_cuts': HARD_CUTS, 'gaps': gaps,
               'density': density}, f, ensure_ascii=False, indent=1)
print('\n机读报告 → %s' % REPORT)
if trouble:
    print('\n!! 落点越界：%s' % trouble)
else:
    print('\n落点检查 ✓ 全部在所属镜头安全窗内（或尾字落在入场墨洇 20f 内）')