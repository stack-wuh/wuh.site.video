import wave, array, math, sys, io, json, os
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

PROJ = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
HERE = os.path.dirname(os.path.abspath(__file__))
TRACK = os.path.join(PROJ, 'public', 'zhi-guo-xiang', 'tts', 'voice-track-v6.wav')

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
# v6 每句实测有声窗口（v6 首跑从成品轨回读，见 scripts/voice/README.md）
WIN = {'a01': 4.45, 'a02': 6.20, 'a03': 4.30, 'a04': 2.70, 'a05': 2.85,
       'a06': 8.40, 'a07': 2.70, 'a08': 6.75, 'a10': 6.40, 'a12': 3.65,
       'b01': 2.80, 'b02': 5.25, 'b03': 6.20, 'b05': 4.20, 'b06': 2.10,
       'b07': 1.20, 'b08a': 3.10, 'b08b': 3.25, 'b09': 7.70, 'b11': 5.30,
       'b12': 4.40, 'd01': 4.70,
       'p1': 2.32, 'p2': 2.32, 'p3': 4.56, 'p4': 4.72, 'p5': 4.08, 'p6': 2.40}
# 对照区（v6 里应当全静音：纯音乐/留白段，人声轨为数字静默）
CONTROL = [(0.20, 5.00), (57.50, 73.80), (82.00, 88.60), (132.60, 143.10),
           (145.60, 150.00), (154.40, 157.40), (172.00, 177.40),
           (200.80, 214.80), (220.00, 228.30), (237.60, 238.80)]

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

print('\n-- 对照区（应静音）--')
for a0, b0 in CONTROL:
    db = rmsdb(a[int(a0 * fr):int(b0 * fr)])
    print('  %6.2f - %6.2f  RMS %7.1f  %s' % (a0, b0, db, 'OK' if db < -60 else '!! 有声'))
print('\n注：F0 为自相关单帧回读，个别句会锁到谐波（±倍频伪影，v5 同），判角色以 lines.json 的 v 与 RMS 为准。')
print('\n无声素材:', bad if bad else '无')
