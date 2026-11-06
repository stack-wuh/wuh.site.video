"""把 BGM《爱意》铺进 v5：两遍对位 + 逐段 ducking + 混音。

对位依据 assets/bgm-ai-yi-map.md §5；ducking 判据依据 §6.1/§6.3。
压深不照抄 spec 的表（那表按旧稿人声密度算），改为在 v5 实际线上实测反算；
有声区间从人声轨直接检测，所以诗六行 / D01 一并覆盖。
"""
import numpy as np, wave, json, os, sys, io, shutil
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

PROJ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BGM_FLAC = os.path.join(PROJ, 'public', 'zhi-guo-xiang', 'bgm', 'ai-yi.flac')
BGM = os.path.join(PROJ, '.tmp', 'bgm', 'ai-yi.wav')      # 由 FLAC 现转，不入仓
VOICE = os.path.join(PROJ, 'public', 'zhi-guo-xiang', 'tts', 'voice-track-v5.wav')
MIX = os.path.join(PROJ, '.tmp', 'bgm', 'mix-v5.wav')
LINES = os.path.join(PROJ, 'scripts', 'voice', 'lines.json')

if shutil.which('ffmpeg'):
    FF = ['ffmpeg']
else:
    FF = ['npx' if shutil.which('npx') else 'npx.cmd', '--no-install', 'remotion', 'ffmpeg']

SR = 48000
TOTAL = 245.0
N = int(TOTAL * SR)

PASS1_AT, PASS1_END = 4.00, 143.46
PASS2_AT, PASS2_SRC = 151.00, 45.45754
BASE_DB = -11.0
LIFTS = [(4.0, 34.0, 2.0)]                 # 序：人声余量 >11dB，让音乐站出来
FEMALE_DB = 2.0
VOICE_DB = 1.0                             # 全人声 +1dB（留出被床掩蔽的句尾）
DUCK_CAP = 9.0                            # 女独白抬回与男声同一线
SNR_TARGET = 6.5


def read(p):
    w = wave.open(p, 'rb')
    ch, fr = w.getnchannels(), w.getframerate()
    d = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768.0
    w.close()
    assert fr == SR, '%s 采样率 %d' % (p, fr)
    d = d.reshape(-1, 2) if ch == 2 else np.stack([d, d], axis=1)
    return d


def db(x):
    if x.size == 0: return -99.0
    r = float(np.sqrt(np.mean(np.square(x))))
    return 20 * np.log10(r) if r > 1e-12 else -99.0


def p90(x):
    if x.size == 0: return -99.0
    r = float(np.percentile(np.abs(x), 90))
    return 20 * np.log10(r) if r > 1e-12 else -99.0


# 工作用 WAV 直接从 FLAC 转（FLAC 是入仓母版，WAV 26MB 不入仓）
if not os.path.exists(BGM):
    import subprocess
    os.makedirs(os.path.dirname(BGM), exist_ok=True)
    print('转码 FLAC → WAV ...')
    subprocess.run(FF + ['-y', '-loglevel', 'error',
                    '-i', BGM_FLAC, '-ar', str(SR), '-ac', '2', '-c:a', 'pcm_s16le', BGM],
                   check=True, shell=False)

src, voice = read(BGM), read(VOICE)
vm = voice.mean(axis=1)
print('曲 %.3fs ｜ 人声 %.3fs' % (len(src) / SR, len(voice) / SR))

# ---- 1. 铺床 ----
bed = np.zeros((N, 2), dtype=np.float32)
a = int(PASS1_AT * SR); n1 = min(len(src), N - a)
bed[a:a + n1] += src[:n1]
b = int(PASS2_AT * SR); s0 = int(PASS2_SRC * SR); n2 = min(len(src) - s0, N - b)
bed[b:b + n2] += src[s0:s0 + n2]
print('第一遍 4.00–%.2fs ｜ 第二遍 151.00–%.2fs' % (PASS1_AT + n1 / SR, PASS2_AT + n2 / SR))


def edges(sig, s, e, fin=0.010, fout=0.030):
    i0, i1 = int(s * SR), int(e * SR)
    fi, fo = int(fin * SR), int(fout * SR)
    if fi and i0 + fi < len(sig):
        sig[i0:i0 + fi] *= np.linspace(0, 1, fi)[:, None]
    if fo and i1 - fo > 0:
        sig[i1 - fo:i1] *= np.linspace(1, 0, fo)[:, None]


edges(bed, PASS1_AT, PASS1_END, 0.010, 0.030)
edges(bed, PASS2_AT, PASS2_AT + n2 / SR, 0.010, 0.040)

# ---- 2. 从人声轨检测有声区间（诗/独白/旁白全覆盖） ----
k = int(0.05 * SR)
env = np.convolve(np.abs(vm), np.ones(k) / k, mode='same')
act = env > 0.004
d = np.diff(act.astype(np.int8))
starts = list(np.nonzero(d == 1)[0] + 1)
ends = list(np.nonzero(d == -1)[0] + 1)
if act[0]: starts.insert(0, 0)
if act[-1]: ends.append(N)
runs = [[s, e] for s, e in zip(starts, ends)]
mg = []
for s, e in runs:
    if mg and s - mg[-1][1] < 0.45 * SR:
        mg[-1][1] = e
    else:
        mg.append([s, e])
runs = mg
print('有声区间 %d 个' % len(runs))

# ---- 3. 逐段 ducking ----
ducks = []
for s, e in runs:
    ss, ee = s / SR, e / SR
    win = bed[s:e]
    p = p90(win)
    if p < -14.0:                              # 床本来就低，不压（§6.1）
        continue
    depth = round(max(2.5, min(DUCK_CAP, p + 17.0)) * 2) / 2.0
    ducks.append([ss, ee, depth, db(win), p])

ducks.sort()
merged = []
for x in ducks:
    if merged and x[0] - merged[-1][1] < 3.0:
        m = merged[-1]
        m[1] = max(m[1], x[1])
        m[2] = round(((m[2] + x[2]) / 2.0) * 2) / 2.0
    else:
        merged.append(list(x))
print('duck %d 段 → 合并后 %d 段' % (len(ducks), len(merged)))
for s, e, dep, bdb, p in merged:
    print('  %6.2f–%6.2f  床 %6.1f p90 %6.1f  压 %4.1f' % (s, e, bdb, p, dep))

# ---- 4. 增益曲线 ----
GRID = 1000
M = int(TOTAL * GRID) + 2
g = np.zeros(M)
for s, e, dep, _, _ in merged:
    a1, b1 = int((s - 0.15) * GRID), int(s * GRID)
    b2, c2 = int(e * GRID), int((e + 0.35) * GRID)
    a1, b1, b2, c2 = [max(0, min(M - 1, v)) for v in (a1, b1, b2, c2)]
    if b1 > a1: g[a1:b1] = np.minimum(g[a1:b1], np.linspace(0, -dep, b1 - a1))
    if b2 > b1: g[b1:b2] = np.minimum(g[b1:b2], -dep)
    if c2 > b2: g[b2:c2] = np.minimum(g[b2:c2], np.linspace(-dep, 0, c2 - b2))
for s, e, dep in LIFTS:
    g[int(s * GRID):int(e * GRID)] += dep
g = np.convolve(g, np.ones(60) / 60.0, mode='same')
g_db = np.interp(np.arange(N) / SR * GRID, np.arange(M), g)
beds = bed * (10 ** ((BASE_DB + g_db) / 20.0).astype(np.float32))[:, None]

# ---- 5. 角色电平 ----
with open(LINES, 'r', encoding='utf-8') as f:
    lines = json.load(f)
vg = np.ones(N, dtype=np.float32)
fg = 10 ** (FEMALE_DB / 20.0)
r = int(0.03 * SR)
for ln in lines:
    if ln['v'] != 'female': continue
    i0 = int(ln['s'] * SR); i1 = min(N, i0 + int(13.0 * SR))
    idx = np.nonzero(np.abs(vm[i0:i1]) > 0.004)[0]
    if idx.size == 0: continue
    a0 = max(0, i0 + idx[0] - r); b0 = min(N, i0 + idx[-1] + r)
    vg[a0:b0] = fg
    if a0 + r < b0: vg[a0:a0 + r] = np.linspace(1.0, fg, r)
    if b0 - r > a0: vg[b0 - r:b0] = np.linspace(fg, 1.0, r)

mix = beds + voice * (vg * (10 ** (VOICE_DB / 20.0)))[:, None]
pk = float(np.max(np.abs(mix)))
if pk > 0.891:
    k2 = 0.891 / pk
    mix *= k2
    print('\n峰值 %.2f dBFS → 整体衰减 %.2f dB' % (20 * np.log10(pk), 20 * np.log10(k2)))

w = wave.open(MIX, 'wb')
w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
w.writeframes((np.clip(mix, -1, 1) * 32767).astype(np.int16).tobytes())
w.close()
print('写出 %s  %.1f MB' % (MIX, os.path.getsize(MIX) / 1e6))

# ---- 6. 体检：每段人声 vs 床的余量 ----
print('\n%-16s %8s %8s %8s' % ('段', '人声dB', '床dB', '余量'))
worst, bad = 99.0, []
for s, e in runs:
    ss, ee = s / SR, e / SR
    if ee - ss < 0.8: continue
    dv = db(voice[s:e] * (vg[s:e] * (10 ** (VOICE_DB / 20.0)))[:, None])
    dbb = db(beds[s:e])
    m = dv - dbb
    tag = '' if m >= SNR_TARGET else ('  ← 偏薄' if m >= 4.0 else '  ← 埋了')
    if m < 4.0: bad.append('%.1f–%.1f' % (ss, ee))
    worst = min(worst, m)
    print('%6.2f–%6.2f   %8.1f %8.1f %8.1f%s' % (ss, ee, dv, dbb, m, tag))
print('\n最小余量 %.1f dB ｜ 低于 4dB 的段: %s' % (worst, bad if bad else '无'))

