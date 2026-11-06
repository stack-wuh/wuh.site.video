"""把 BGM《爱意》铺进 v7：两遍对位 + 逐段 ducking + BGM「站出」+ 茶棚空间底。

对位依据 assets/bgm-ai-yi-map.md §5；ducking 判据依据 §6.1/§6.3。
v7 新增两件事（vo-script-v7.md §3.3/§3.4）：
  1) 站出：任何 ≥3s 无旁白窗口，BGM 从床（−11dB）抬到 −5dB（+6dB），0.8s 起 / 1.0s 落；
  2) 空间底：133.4–151.2 茶棚静默段垫一层 −40dBFS 的低频空气底（不是音效），
     把「静」和「断」分开。
"""
import numpy as np, wave, json, os, sys, io, shutil
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

PROJ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BGM_FLAC = os.path.join(PROJ, 'public', 'zhi-guo-xiang', 'bgm', 'ai-yi.flac')
BGM = os.path.join(PROJ, '.tmp', 'bgm', 'ai-yi.wav')      # 由 FLAC 现转，不入仓
VOICE = os.path.join(PROJ, 'public', 'zhi-guo-xiang', 'tts', 'voice-track-v7.wav')
MIX = os.path.join(PROJ, '.tmp', 'bgm', 'mix-v7.wav')
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

# v7：BGM 两态（床 / 站出）与茶棚空间底
FG_DB = 6.0           # 站出相对床的抬升
FG_MIN_GAP = 3.0      # 无旁白 ≥ 该秒数才站出
FG_MIN_BED_P90 = -45.0  # 床 p90 低于此值不站出（空床交给空间底）
ROOM_WIN = (133.4, 151.2)
ROOM_RMS_DB = -40.0   # 空间底 RMS（远低于人声与 BGM，只补「空间还在」）


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
# ---- 4b. BGM「站出」：≥3s 无旁白窗口抬 +6dB（0.8s 起 / 1.0s 落） ----
fg = np.zeros(M)
bounds = []
prev = 0.0
for s_i, e_i in runs:
    ss, ee = s_i / SR, e_i / SR
    if ss - prev >= FG_MIN_GAP and prev >= 4.0:
        bounds.append((prev, ss))
    prev = max(prev, ee)
if TOTAL - prev >= FG_MIN_GAP:
    bounds.append((prev, TOTAL))
print('\n站出窗口 %d 个：' % len(bounds))
for a0, b0 in bounds:
    a0 = max(a0, 4.0)
    # 空床不站出：第一遍曲到 133.5 已破到 −50 以下，抬一个已经死了的床没有意义，
    # 那一段按 §3.4 方案 A 交给 −40dBFS 空间底（设计稿 §3.3 的「靠空间底」即此意）。
    if p90(bed[int(a0 * SR):int(b0 * SR)]) < FG_MIN_BED_P90:
        print('  %6.2f–%6.2f  床已静默（p90 < %.0f dBFS）→ 不站出' % (a0, b0, FG_MIN_BED_P90))
        continue
    i0, i1 = int(a0 * GRID), int(b0 * GRID)
    up, dn = int(0.8 * GRID), int(1.0 * GRID)
    if i1 - i0 < up + dn + 1:
        continue
    seg = np.full(i1 - i0, FG_DB)
    seg[:up] = np.linspace(0, FG_DB, up)
    seg[-dn:] = np.linspace(FG_DB, 0, dn)
    fg[i0:i1] = np.maximum(fg[i0:i1], seg)
    print('  %6.2f–%6.2f  %5.1fs  → +%.1fdB' % (a0, b0, b0 - a0, FG_DB))

g = np.convolve(g, np.ones(60) / 60.0, mode='same')
fg = np.convolve(fg, np.ones(80) / 80.0, mode='same')
g_db = np.interp(np.arange(N) / SR * GRID, np.arange(M), g)
fg_db = np.interp(np.arange(N) / SR * GRID, np.arange(M), fg)
beds = bed * (10 ** ((BASE_DB + g_db + fg_db) / 20.0).astype(np.float32))[:, None]

# ---- 4c. 茶棚空间底（−40dBFS 低频空气，只在静默段） ----
room = np.zeros((N, 2), dtype=np.float32)
rs, re = ROOM_WIN
ri0, ri1 = int(rs * SR), int(re * SR)
nr = ri1 - ri0
if nr > 0:
    rng = np.random.default_rng(7)
    noise = rng.standard_normal(nr).astype(np.float32)
    k2 = np.ones(140, dtype=np.float32) / 140.0
    air = np.convolve(noise, k2, mode='same')
    t = np.arange(nr) / SR
    air *= (0.62 + 0.38 * np.sin(2 * np.pi * 0.07 * t)).astype(np.float32)
    target = 10 ** (ROOM_RMS_DB / 20.0)
    air *= target / max(float(np.sqrt(np.mean(air ** 2))), 1e-9)
    fi, fo = int(1.2 * SR), int(1.2 * SR)
    air[:fi] *= np.linspace(0, 1, fi)
    air[-fo:] *= np.linspace(1, 0, fo)
    room[ri0:ri1, 0] = air
    room[ri0:ri1, 1] = air
    print('空间底 %.1f–%.1fs @ %.0f dBFS RMS' % (rs, re, ROOM_RMS_DB))

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

mix = beds + room + voice * (vg * (10 ** (VOICE_DB / 20.0)))[:, None]
pk = float(np.max(np.abs(mix)))
if pk > 0.891:
    k2 = 0.891 / pk
    mix *= k2
    print('\n峰值 %.2f dBFS → 整体衰减 %.2f dB' % (20 * np.log10(pk), 20 * np.log10(k2)))

clip = int(np.count_nonzero(np.abs(mix) >= 0.999))
print('峰值 %.6f（%.2f dBFS）｜ 削波样本 %d ｜ 采样率 %d / 声道 2 / 时长 %.3fs'
      % (float(np.max(np.abs(mix))), 20 * np.log10(float(np.max(np.abs(mix))) + 1e-12), clip, SR, len(mix) / SR))

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

# ---- 7. 五态落表（静 / 托底 / 让位 / 站出 / 收） ----
# 判据直接读本脚本算出的同一条包络（g_db = 逐段 duck 增益，fg_db = 站出增益），
# 所以这张表和实际混出来的东西必然一致，不是另写一套期望值。
print('\n-- 五态时间表 --')
STATE_BIN = 0.25
states = []
for i in range(int(TOTAL / STATE_BIN)):
    t = (i + 0.5) * STATE_BIN
    j = int(t * SR)
    lvl = db(beds[j:j + int(STATE_BIN * SR)])
    if t >= 232.5:
        st = '收'
    elif t < PASS1_AT or lvl < -55.0:
        st = '静'
    elif float(fg_db[j]) > 2.0:
        st = '站出'
    elif float(g_db[j]) <= -7.0:
        st = '让位'
    else:
        st = '托底'
    states.append((t, st, lvl))

merged_st = []
for t, st, lvl in states:
    if merged_st and merged_st[-1][0] == st and abs(merged_st[-1][2] - t) < STATE_BIN * 1.5:
        merged_st[-1][2] = t + STATE_BIN / 2
        merged_st[-1][3].append(lvl)
    else:
        merged_st.append([st, t, t + STATE_BIN / 2, [lvl]])
for st, a, b, lv in merged_st:
    if b - a < 0.5:
        continue
    print('  %-4s %6.2f–%6.2f  %5.1fs  床均 %6.1f dBFS' % (st, a, b, b - a, float(np.mean(lv))))
tot = {}
for _, st, _ in states:
    tot[st] = tot.get(st, 0.0) + STATE_BIN
print('  合计：' + ' ｜ '.join('%s %.1fs' % (k, v) for k, v in sorted(tot.items(), key=lambda x: -x[1])))

# 设计稿 §3.3 手画的站出窗口 → 实测是否兑现（取区间重叠）
DESIGN_FG = [(34.5, 44.5), (64.0, 88.4), (94.0, 106.4), (120.2, 126.3), (133.1, 138.5),
             (148.2, 151.5), (161.4, 163.5), (189.0, 220.0), (224.0, 239.0)]
act = []
prev_end = 0.0
for s_i, e_i in runs:
    ss, ee = s_i / SR, e_i / SR
    if ss - prev_end >= FG_MIN_GAP and prev_end >= 4.0:
        act.append((prev_end, ss))
    prev_end = max(prev_end, ee)
if TOTAL - prev_end >= FG_MIN_GAP:
    act.append((prev_end, TOTAL))
act = [(a, b) for a, b in act if b - a - (0.8 + 1.0) >= 0.0]
print('\n-- 站出窗口：实测 vs 设计稿 §3.3（≥3s 无旁白，+%.0fdB，ramp 0.8s 起 / 1.0s 落）--' % FG_DB)
fg_rows = []
for a0, b0 in act:
    if p90(bed[int(a0 * SR):int(b0 * SR)]) < FG_MIN_BED_P90:
        continue
    ov = max([min(b0, de) - max(a0, ds) for ds, de in DESIGN_FG] + [0.0])
    fg_rows.append({'a': round(a0, 2), 'b': round(b0, 2), 'dur': round(b0 - a0, 2),
                    'design_overlap': round(max(0.0, ov), 2)})
    print('  %6.2f–%6.2f  %5.2fs  设计稿重叠 %4.2fs' % (a0, b0, b0 - a0, max(0.0, ov)))
missing = [(ds, de) for ds, de in DESIGN_FG
           if not any(min(de, r['b']) - max(ds, r['a']) > 1.0 for r in fg_rows)]
print('  设计稿列了但实测不成立（该窗已被旁白占/不足 3s）：%s'
      % (['%.1f–%.1f' % m for m in missing] if missing else '无'))

# ---- 8. 验收 + 机读报告 ----
peak_db = 20 * np.log10(float(np.max(np.abs(mix))) + 1e-12)
ok = (abs(len(mix) / SR - TOTAL) < 1e-6 and peak_db <= -1.0 + 1e-6 and clip == 0 and worst >= 4.0)
print('\n-- 验收 --')
print('  时长 %.3fs / %.3fs  %s' % (len(mix) / SR, TOTAL, '✓' if abs(len(mix) / SR - TOTAL) < 1e-6 else '✗'))
print('  峰值 %.2f dBFS（≤ −1.0）  %s' % (peak_db, '✓' if peak_db <= -1.0 + 1e-6 else '✗'))
print('  削波样本 %d  %s' % (clip, '✓' if clip == 0 else '✗'))
print('  人声对床最小余量 %.1f dB（≥4）  %s' % (worst, '✓' if worst >= 4.0 else '✗'))
print('  总判定 %s' % ('PASS' if ok else 'FAIL'))
with open(os.path.join(os.path.dirname(MIX), 'mix-v7-report.json'), 'w', encoding='utf-8') as f:
    json.dump({'peak_db': peak_db, 'clip': clip, 'duration': len(mix) / SR,
               'min_margin': worst, 'bad_segments': bad, 'snr_target': SNR_TARGET,
               'standout': fg_rows, 'design_standout': DESIGN_FG, 'design_missing': missing,
               'states': [{'state': st, 'a': round(a, 2), 'b': round(b, 2)}
                          for st, a, b, _ in merged_st if b - a >= 0.5],
               'state_totals': {k: round(v, 2) for k, v in tot.items()},
               'duck': [{'a': round(s, 2), 'b': round(e, 2), 'depth': dep,
                         'bed': round(bdb, 1), 'p90': round(p, 1)}
                        for s, e, dep, bdb, p in merged],
               'base_db': BASE_DB, 'fg_db': FG_DB, 'room_win': list(ROOM_WIN),
               'room_db': ROOM_RMS_DB, 'pass2_src': PASS2_SRC, 'ok': bool(ok)},
              f, ensure_ascii=False, indent=1)
print('\n机读报告 → %s' % os.path.join(os.path.dirname(MIX), 'mix-v7-report.json'))

