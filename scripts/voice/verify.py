import wave, array, math, sys, io, json, os
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

PROJ = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
HERE = os.path.dirname(os.path.abspath(__file__))
TRACK = os.path.join(PROJ, 'public', 'zhi-guo-xiang', 'tts', 'voice-track-v5.wav')

w = wave.open(TRACK, 'rb')
fr, ch = w.getframerate(), w.getnchannels()
a = array.array('h'); a.frombytes(w.readframes(w.getnframes()))
w.close()
if ch == 2:
    a = array.array('h', [(a[i] + a[i + 1]) // 2 for i in range(0, len(a) - 1, 2)])
print('track: %d ch, %d Hz, %.2fs' % (ch, fr, len(a) / fr))

with open(os.path.join(HERE, 'lines.json'), 'r', encoding='utf-8') as f:
    lines = json.load(f)
POEM = [('p1', 189.00), ('p2', 191.60), ('p3', 196.00), ('p4', 215.00), ('p5', 228.50), ('p6', 235.00)]
WIN = {'p1': 2.32, 'p2': 2.32, 'p3': 4.56, 'p4': 4.72, 'p5': 4.08, 'p6': 2.40}

def rmsdb(seg):
    if not seg: return -99.0
    r = math.sqrt(sum(float(v) * v for v in seg) / len(seg)) / 32768
    return 20 * math.log10(r) if r > 0 else -99.0

def f0(seg):
    n = len(seg)
    if n < 4096: return 0.0
    win = 2048
    step = max(1, (n - win) // 40)
    best, be = None, -1
    for s in range(0, n - win, step):
        e = sum(float(v) * v for v in seg[s:s + win])
        if e > be: be, best = e, seg[s:s + win]
    s = [float(v) for v in best]; m = sum(s) / win; s = [v - m for v in s]
    b, bl = -1e18, 0
    for lag in range(int(fr / 450), int(fr / 65)):
        c = sum(s[i] * s[i + lag] for i in range(0, win - lag))
        if c > b: b, bl = c, lag
    return fr / bl if bl else 0.0

print('\n%-5s %-8s %8s %8s %8s  %s' % ('id', 'role', '起', 'RMS', 'F0', '判定'))
bad = []
for ln in lines:
    s = ln['s']; dur = WIN.get(ln['id'])
    if dur is None:
        dur = 4.0
    seg = a[int(s * fr):int((s + dur) * fr)]
    db, f = rmsdb(seg), f0(seg)
    if db < -55: v = '!! 无声'
    elif f < 150: v = '男声'
    elif f > 185: v = '女声'
    else: v = '偏低 %.0f' % f
    if '!!' in v: bad.append(ln['id'])
    print('%-5s %-8s %8.1f %8.1f %8.1f  %s' % (ln['id'], ln['v'], s, db, f, v))

print('\n-- 诗六行 --')
for pid, s in POEM:
    seg = a[int(s * fr):int((s + WIN[pid]) * fr)]
    print('  %-3s %6.2f  RMS %6.1f  F0 %6.1f' % (pid, s, rmsdb(seg), f0(seg)))

print('\n无声素材:', bad if bad else '无')