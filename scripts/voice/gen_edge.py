import asyncio, json, os, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
import edge_tts

HERE = os.path.dirname(os.path.abspath(__file__))
MP3DIR = os.path.join(HERE, 'mp3')
os.makedirs(MP3DIR, exist_ok=True)

# 男声 云健（108Hz，沉稳）；女声 晓晓（214Hz，温润）
CAST = {
    'male':   ('zh-CN-YunjianNeural',  '-26%', '-6Hz'),
    'female': ('zh-CN-XiaoxiaoNeural', '-28%', '-4Hz'),
}
# 备选（只用于 A/B，不参与主轨）
ALT = {
    'male':   ('zh-CN-YunxiNeural',    '-12%', '-4Hz'),
    'female': ('zh-CN-XiaobeiNeural',  '-15%', '-3Hz'),
}

def load():
    with open(os.path.join(HERE, 'lines.json'), 'r', encoding='utf-8') as f:
        return json.load(f)

async def one(text, voice, rate, pitch, path, sem):
    async with sem:
        for attempt in range(3):
            try:
                c = edge_tts.Communicate(text, voice, rate=rate, pitch=pitch)
                await c.save(path)
                if os.path.exists(path) and os.path.getsize(path) > 3000:
                    return True
            except Exception as e:
                err = repr(e)[:160]
                await asyncio.sleep(1.5)
        print('  FAIL %s -> %s' % (os.path.basename(path), err if 'err' in dir() else '?'))
        return False

async def main():
    global _names
    lines = load()
    sem = asyncio.Semaphore(4)
    jobs = []
    for ln in lines:
        voice, rate, pit = CAST[ln['v']]
        jobs.append((one(ln['t'], voice, rate, pit, os.path.join(MP3DIR, ln['id'] + '.mp3'), sem), ln['id']))
    # 备选男声：只做开篇 5 条，供 A/B
    for ln in lines:
        if ln['v'] == 'male' and ln['id'] in ('a01', 'a02', 'a05'):
            voice, rate, pit = ALT['male']
            jobs.append((one(ln['t'], voice, rate, pit, os.path.join(MP3DIR, ln['id'] + '-alt.mp3'), sem), ln['id'] + '-alt'))
    names = [n for _, n in jobs]
    res = await asyncio.gather(*[c for c, _ in jobs])
    res = [(r, names[i]) for i, r in enumerate(res)]
    ok = sum(1 for r, _ in res if r)
    print('ok %d / %d' % (ok, len(res)))
    for r, name in res:
        if not r:
            print('  missing:', name)

asyncio.run(main())


