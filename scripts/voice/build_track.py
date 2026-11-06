import json, os, sys, io, math, array, wave, subprocess, glob, shutil
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

PROJ = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
# 素材与 lines.json 跟 gen_edge.py 同目录（它写 HERE/mp3），中间 wav 落 .tmp（已 gitignore）
HERE = os.path.dirname(os.path.abspath(__file__))
WAVDIR = os.path.join(PROJ, '.tmp', 'audition', 'v2e', 'wav')
TTS = os.path.join(PROJ, 'public', 'zhi-guo-xiang', 'tts')
OUT = os.path.join(TTS, 'voice-track-v6.wav')

# mac/Linux 用系统 ffmpeg；Windows 借 remotion 自带的那份
if shutil.which('ffmpeg'):
    FF = ['ffmpeg']
else:
    FF = ['npx' if shutil.which('npx') else 'npx.cmd', '--no-install', 'remotion', 'ffmpeg']
SR = 48000
TOTAL = 245.0
os.makedirs(WAVDIR, exist_ok=True)

with open(os.path.join(HERE, 'lines.json'), 'r', encoding='utf-8') as f:
    lines = json.load(f)

# 诗六行：定稿不动，只重采样
POEM = [('p1', 189.00, 'line-01.wav'), ('p2', 191.60, 'line-02.wav'),
        ('p3', 196.00, 'line-03.wav'), ('p4', 215.00, 'line-04.wav'),
        ('p5', 228.50, 'line-05.wav'), ('p6', 235.00, 'line-06.wav')]

# ---- 1. 一次性把全部素材转成 48k 单声道 wav ----
srcs = []
for ln in lines:
    srcs.append((ln['id'], os.path.join(HERE, 'mp3', ln['id'] + '.mp3')))
for pid, _, fn in POEM:
    srcs.append((pid, os.path.join(TTS, fn)))

todo = [(n, p) for n, p in srcs if not (os.path.exists(os.path.join(WAVDIR, n + '.wav'))
                                        and os.path.getsize(os.path.join(WAVDIR, n + '.wav')) > 2000)]
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
        print('ffmpeg FAILED\n', (r.stderr or '')[-1500:]); sys.exit(1)

def load(n):
    p = os.path.join(WAVDIR, n + '.wav')
    w = wave.open(p, 'rb')
    a = array.array('h'); a.frombytes(w.readframes(w.getnframes()))
    w.close()
    return a

def rms(a):
    if not a: return 0.0
    return math.sqrt(sum(float(v) * v for v in a) / len(a))

# ---- 2. 归一化到统一 RMS，再加角色偏移 ----
ROLE_GAIN = {'male': 0.0, 'female': -1.5, 'poem': -0.5}
TARGET_RMS = 0.0944 * 32768   # ≈ -20.5 dBFS
placements = []
print('-- 素材时长 --')
for ln in lines:
    _d = len(load(ln['id'])) / SR
    print('  %-4s 起%6.2f  时长%5.2f  止%6.2f' % (ln['id'], ln['s'], _d, ln['s'] + _d))
for ln in lines:
    a = load(ln['id'])
    g = (TARGET_RMS / max(rms(a), 1e-9)) * (10 ** (ROLE_GAIN[ln['v']] / 20.0))
    placements.append((ln['id'], ln['s'], a, g, ln['v']))
for i, (pid, t, fn) in enumerate(POEM):
    a = load(pid)
    g = (TARGET_RMS / max(rms(a), 1e-9)) * (10 ** (ROLE_GAIN['poem'] / 20.0))
    placements.append((pid, t, a, g, 'poem'))

# ---- 3. 叠轨 ----
N = int(TOTAL * SR)
buf = [0.0] * N
FADE = int(0.010 * SR)
for name, t, a, g, role in placements:
    off = int(round(t * SR))
    n = len(a)
    if off + n > N:
        print('!! %s 超出片尾，截断 %d 样本' % (name, off + n - N))
        n = N - off
    for i in range(n):
        w = 1.0
        if i < FADE: w *= i / FADE
        if i > n - FADE - 1: w *= max(0.0, (n - i) / FADE)
        x = a[i] * w * g
        T = 0.72 * 32767
        if x > T: x = T + (32767 - T) * math.tanh((x - T) / (32767 - T))
        elif x < -T: x = -T - (32767 - T) * math.tanh((-x - T) / (32767 - T))
        buf[off + i] += x

peak = max(abs(v) for v in buf) if buf else 0.0
print('peak %.4f (%.1f dBFS)' % (peak, 20 * math.log10(peak / 32768) if peak else -99))
if peak > 32000:
    k = 32000 / peak
    buf = [v * k for v in buf]
    print('scaled by %.4f' % k)

out = array.array('h', [int(max(-32768, min(32767, v))) for v in buf])
w = wave.open(OUT, 'wb')
w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
st = array.array('h', bytes(4 * len(out)))
st[0::2] = out
st[1::2] = out
w.writeframes(st.tobytes()); w.close()
print('wrote %s  %.1f MB' % (OUT, os.path.getsize(OUT) / 1e6))

# ---- 4. 体检：有声 / 空档 / 最长连续 ----
INTERVALS = sorted([(t, t + len(a) / SR, name) for name, t, a, g, role in placements])
merged = []
for s, e, nm in INTERVALS:
    if merged and s <= merged[-1][1] + 0.02:
        merged[-1][1] = max(merged[-1][1], e)
    else:
        merged.append([s, e])
voiced = sum(e - s for s, e in merged)
print('\n有声 %.2fs = %.1f%%  (段数 %d)' % (voiced, voiced / TOTAL * 100, len(merged)))
print('\n-- 空档 --')
gaps = []
prev = 0.0
for s, e in merged:
    if s - prev > 0.05:
        gaps.append((prev, s, s - prev))
    prev = max(prev, e)
if TOTAL - prev > 0.05:
    gaps.append((prev, TOTAL, TOTAL - prev))
for a, b, d in sorted(gaps, key=lambda x: -x[2]):
    print('  %6.2f - %6.2f   %5.2fs' % (a, b, d))
print('\n最长空档 %.2fs' % max(d for _, _, d in gaps) if gaps else 'no gaps')
print('\n-- 连续人声 >13s --')
for s, e in merged:
    if e - s > 13.0:
        print('  %6.2f - %6.2f   %5.2fs' % (s, e, e - s))

# ---- 5. 高潮区密度 ----
print('\n-- 关键区间密度 --')
for name, a, b in [('烟花大高潮', 66.0, 84.0), ('寻·最高潮', 94.0, 114.0),
                   ('出家·大高潮', 167.54, 185.54), ('笔悬墨滴', 200.56, 215.0)]:
    cov = sum(max(0.0, min(e, b) - max(s, a)) for s, e in merged)
    print('  %-12s %5.1f-%5.1f  %5.2fs / %.1fs = %.0f%%' % (name, a, b, cov, b - a, cov / (b - a) * 100))




