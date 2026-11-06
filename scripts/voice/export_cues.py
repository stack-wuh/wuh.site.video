"""导出 v7 旁落实测落点 → out/voice/cues-v7.json（caption 反推用）。

格式：[{id, voice, text, start, end}]，秒（绝对），start/end 为真人声的实测首尾（不含句首静音）。
诗六行用 voice="poem" 一并列出（字幕/对位需要时可用）。
"""
import json, os, sys, wave, array

PROJ = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
HERE = os.path.dirname(os.path.abspath(__file__))
WAVDIR = os.path.join(PROJ, '.tmp', 'audition', 'v2e', 'wav')
OUT = os.path.join(PROJ, 'out', 'voice', 'cues-v7.json')
POEM = [('p1', 189.00), ('p2', 191.60), ('p3', 196.00), ('p4', 215.00), ('p5', 228.50), ('p6', 235.00)]

def voiced_window(path, thr=0.006, run=6):
    w = wave.open(path, 'rb'); fr = w.getframerate(); ch = w.getnchannels()
    a = array.array('h'); a.frombytes(w.readframes(w.getnframes())); w.close()
    if ch == 2:
        a = array.array('h', [(a[i] + a[i + 1]) // 2 for i in range(0, len(a) - 1, 2)])
    n = len(a); first = None; last = None; cnt = 0
    for i, v in enumerate(a):
        if abs(v) / 32768 > thr:
            cnt += 1
            if cnt >= run and first is None: first = i - run + 1
            last = i
        else:
            cnt = 0
    if first is None: return 0, n
    return first, last

lines = json.load(open(os.path.join(HERE, 'lines.json'), encoding='utf-8'))
cues = []
for ln in lines:
    p = os.path.join(WAVDIR, ln['id'] + '.wav')
    if not os.path.exists(p):
        print('!! 缺素材', ln['id']); continue
    i0, i1 = voiced_window(p)
    fr = wave.open(p, 'rb').getframerate()
    cues.append({'id': ln['id'], 'voice': ln['v'], 'text': ln['t'],
                 'start': round(ln['s'] + i0 / fr, 3), 'end': round(ln['s'] + i1 / fr, 3)})
for pid, s in POEM:
    p = os.path.join(WAVDIR, pid + '.wav')
    if not os.path.exists(p): continue
    i0, i1 = voiced_window(p); fr = wave.open(p, 'rb').getframerate()
    cues.append({'id': pid, 'voice': 'poem', 'text': '', 'start': round(s + i0 / fr, 3), 'end': round(s + i1 / fr, 3)})
cues.sort(key=lambda c: c['start'])
os.makedirs(os.path.dirname(OUT), exist_ok=True)
json.dump(cues, open(OUT, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('wrote %s  %d cues' % (OUT, len(cues)))
for c in cues: print('  %-4s %-6s %7.2f–%7.2f  %s' % (c['id'], c['voice'], c['start'], c['end'], (c['text'] or '')[:22]))
