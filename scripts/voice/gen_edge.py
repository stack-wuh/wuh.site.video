import asyncio, json, os, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
import edge_tts

HERE = os.path.dirname(os.path.abspath(__file__))
MP3DIR = os.path.join(HERE, 'mp3')
os.makedirs(MP3DIR, exist_ok=True)

# 男声 云健（108Hz，沉稳）；女声 晓晓（214Hz，温润）
# v7 语速：设计稿 §四.5 写男 −26%，但 §五「样音实测」已实测 −26% 下每条比预算多 0.9–1.6s
#   （S08 44–51 / S10 58–64 / S27 163–170 三个窗口装不下），设计稿自己给了「快」这条路：
#   男 −22% = A/B 样音第二遍，实测快 8–10%。lines.json 每条都带显式 r 覆盖，此处只是兜底。
#   女声分两档年龄：16 岁（f01–f04）−18%，40 岁（f05–f08）−30%（§四.5「同一把嗓子两个年龄」）。
CAST = {
    'male':   ('zh-CN-YunjianNeural',  '-22%', '-6Hz'),
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
        rate = ln.get('r', rate)  # v7：允许逐条覆盖语速（女声 16 岁 −18% / 40 岁 −30%）
        pit = ln.get('p', pit)
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


