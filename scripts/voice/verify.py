"""v7 人声整轨体检：以 `out/voice/cues-v7.json` 为准，逐条验「该有声的地方有声、该静的地方静」。

v7 相对 v6 的改动：
  - 素材时长不再从 .tmp 里猜（上一版按 mp3 全长算，含 1.1s 尾静默 → 每段判定都偏），
    改为直接读交付给下游的 `cues-v7.json`（其 start/end 由 build_track.py 从成品轨实测回读）。
  - 每条验三件事：① 段内 RMS 有声；② 起点前 0.25s 是静音（不能提前出声）；
    ③ 终点后 0.25s 是静音（不能拖尾）；④ F0 与声部方向一致（男 <150 / 女 >185，仅参考）。
  - 空档（>2s）必须接近数字静默；诗六行按定稿落点单独验。

用法：.tmp/venv/bin/python scripts/voice/verify.py
退出码：0 全过；1 有硬问题（无声 / 提前出声 / 拖尾 / 空档有声）。
"""
import wave, array, math, sys, io, json, os

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

PROJ = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
TRACK = os.path.join(PROJ, 'public', 'zhi-guo-xiang', 'tts', 'voice-track-v7.wav')
CUES = os.path.join(PROJ, 'out', 'voice', 'cues-v7.json')
POEM = [('p1', 189.00, 'line-01.wav'), ('p2', 191.60, 'line-02.wav'),
        ('p3', 196.00, 'line-03.wav'), ('p4', 215.00, 'line-04.wav'),
        ('p5', 228.50, 'line-05.wav'), ('p6', 235.00, 'line-06.wav')]
SR = 48000
TOTAL = 245.0

w = wave.open(TRACK, 'rb')
fr, ch, nfr = w.getframerate(), w.getnchannels(), w.getnframes()
a = array.array('h')
a.frombytes(w.readframes(nfr))
w.close()
if ch == 2:
    a = array.array('h', [(a[i] + a[i + 1]) // 2 for i in range(0, len(a) - 1, 2)])
dur_track = len(a) / fr
print('track: %d ch, %d Hz, %.3fs, 峰值 %.2f dBFS'
      % (ch, fr, dur_track, 20 * math.log10(max(abs(v) for v in a) / 32768)))

with open(CUES, 'r', encoding='utf-8') as f:
    cues = json.load(f)


def rmsdb(seg):
    if not seg:
        return -99.0
    r = math.sqrt(sum(float(v) * v for v in seg) / len(seg)) / 32768
    return 20 * math.log10(r) if r > 0 else -99.0


def f0(seg):
    n = len(seg)
    win = 2048
    if n < win * 2:
        return 0.0
    step = max(1, (n - win) // 40)
    best, be = None, -1
    for s in range(0, n - win, step):
        e = sum(float(v) * v for v in seg[s:s + win])
        if e > be:
            be, best = e, seg[s:s + win]
    s = [float(v) for v in best]
    m = sum(s) / win
    s = [v - m for v in s]
    b, bl = -1e18, 0
    for lag in range(int(fr / 450), int(fr / 65)):
        c = sum(s[i] * s[i + lag] for i in range(0, win - lag))
        if c > b:
            b, bl = c, lag
    return fr / bl if bl else 0.0


def seg(t0, t1):
    return a[max(0, int(t0 * fr)):min(len(a), int(t1 * fr))]


bad = []
print('\n%-5s %-7s %7s %7s %8s %8s %7s  %s'
      % ('id', 'role', 'start', 'end', 'RMS', 'F0', '前0.25s', '判定'))
for c in cues:
    s, e = c['start'], c['end']
    dv = rmsdb(seg(s, e))
    pre = rmsdb(seg(s - 0.25, s - 0.01))
    post = rmsdb(seg(e + 0.01, e + 0.25))
    f = f0(seg(s, e))
    err = []
    if dur_track and e > dur_track:
        err.append('!! 超片长')
    if dv < -45:
        err.append('!! 无声')
    if pre > -55:
        err.append('!! 提前出声')
    if post > -55:
        err.append('!! 拖尾')
    if c['voice'] == 'male' and f > 160:
        err.append('F0偏高(参考)')
    if c['voice'] == 'female' and 0 < f < 170:
        err.append('F0偏低(参考)')
    if any(x.startswith('!!') for x in err):
        bad.append(c['id'])
    print('%-5s %-7s %7.3f %7.3f %8.1f %8.1f %7.1f  %s'
          % (c['id'], c['voice'], s, e, dv, f, pre, ' '.join(err) or 'ok'))

print('\n-- 诗六行（定稿落点不动）--')
POEM_AT = []
for pid, s, fn in POEM:
    p = os.path.join(PROJ, 'public', 'zhi-guo-xiang', 'tts', fn)
    w2 = wave.open(p, 'rb')
    d = w2.getnframes() / w2.getframerate()
    w2.close()
    POEM_AT.append((s, s + d))
    print('  %-3s %6.2f–%6.2f  RMS %6.1f  F0 %6.1f' % (pid, s, s + d, rmsdb(seg(s, s + d)), f0(seg(s, s + d))))

# 空档：cues + 诗六行（按真实文件时长）合成有声区间后的洞
iv = sorted([(c['start'], c['end']) for c in cues] + POEM_AT)
merged = []
for s, e in iv:
    if merged and s <= merged[-1][1] + 0.02:
        merged[-1][1] = max(merged[-1][1], e)
    else:
        merged.append([s, e])
print('\n-- 空档 >2s（应接近数字静默）--')
prev, gap_bad = 0.0, []
for s, e in merged + [[TOTAL, TOTAL]]:
    if s - prev > 2.0:
        d = rmsdb(seg(prev, s))
        ok = d < -60
        if not ok:
            gap_bad.append('%.1f-%.1f' % (prev, s))
        print('  %6.2f - %6.2f  %5.2fs  RMS %7.1f  %s' % (prev, s, s - prev, d, 'OK' if ok else '!! 有声'))
    prev = max(prev, e)

print('\n注：F0 为自相关单帧回读，个别句会锁到谐波（v5/v6/v7 同），判角色以 cues 的 voice 与 RMS 为准。')
print('硬问题：%s ｜ 有声响的空档：%s' % (bad if bad else '无', gap_bad if gap_bad else '无'))
sys.exit(1 if (bad or gap_bad) else 0)