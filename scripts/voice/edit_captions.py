import os, re, io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

SHOTS = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
                     'videos', 'zhi-guo-xiang', 'shots')
DROP = ['s04', 's16', 's18', 's19', 's25', 's27', 's30']
SHIFT = {'s22': ('14', '34'), 's28': ('16', '56')}

for sid in DROP:
    p = os.path.join(SHOTS, sid + '.tsx')
    with open(p, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    out = [ln for ln in lines if '<Caption' not in ln]
    if not any('<Caption' in ln for ln in out):
        out = [ln for ln in out if 'import { Caption }' not in ln]
    with open(p, 'w', encoding='utf-8', newline='') as f:
        f.writelines(out)
    print('%-5s 删字幕，剩 %d 行' % (sid, len(out)))

for sid, (old, new) in SHIFT.items():
    p = os.path.join(SHOTS, sid + '.tsx')
    with open(p, 'r', encoding='utf-8') as f:
        src = f.read()
    new_src = re.sub(r'(<Caption[^>]*?start=\{)' + old + r'(\})', r'\g<1>' + new + r'\2', src, count=1)
    if new_src == src:
        print('%-5s !! 未匹配 start={%s}' % (sid, old))
    else:
        with open(p, 'w', encoding='utf-8', newline='') as f:
            f.write(new_src)
        print('%-5s start %s -> %s' % (sid, old, new))