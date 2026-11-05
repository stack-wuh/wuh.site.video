#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""sd-ncm: 网易云 .ncm 解码（标准 ncmdump 算法，纯标准库）

与旧版 .tmp/audition/ncm_decode.py 的关键差异：
  * 旧版用 RC4-KSA + PRGA 生成密钥流（错误），本版用 ncmdump 的 key_box 折叠算法。
  * 旧版 meta 少了 base64 解码这一步（只剥 22 字节就 AES），本版按标准流程。
  * 旧版 magic 判断 OK（b'CTENFDAM'），保留；任务书里写的 b'neteasecloudmusic' 是
    核心密钥解密后的前缀，不是文件头。
"""
import sys, os, struct, json, base64, binascii

# ------------------------------------------------------------------ AES-128 ECB
def _xtime(a):
    a <<= 1
    if a & 0x100:
        a ^= 0x11B
    return a & 0xFF

def _gmul(a, b):
    r = 0
    for _ in range(8):
        if b & 1:
            r ^= a
        b >>= 1
        a = _xtime(a)
    return r

def _rotl8(x, n):
    return ((x << n) | (x >> (8 - n))) & 0xFF

def _build_sbox():
    # 用 _gmul 幂乘求逆元，慢但只跑一次
    inv = [0] * 256
    for x in range(1, 256):
        y = 1
        for _ in range(254):
            y = _gmul(y, x)
        inv[x] = y
    sb = [0] * 256
    for x in range(256):
        v = inv[x]
        sb[x] = v ^ _rotl8(v, 1) ^ _rotl8(v, 2) ^ _rotl8(v, 3) ^ _rotl8(v, 4) ^ 0x63
    return sb

SBOX = _build_sbox()
INV_SBOX = [0] * 256
for _i, _v in enumerate(SBOX):
    INV_SBOX[_v] = _i

RCON = [0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1B, 0x36]

def _expand_key(key):
    w = [list(key[4 * i:4 * i + 4]) for i in range(4)]
    for i in range(4, 44):
        t = list(w[i - 1])
        if i % 4 == 0:
            t = t[1:] + t[:1]
            t = [SBOX[b] for b in t]
            t[0] ^= RCON[i // 4 - 1]
        w.append([w[i - 4][j] ^ t[j] for j in range(4)])
    return [b for word in w for b in word]

def _inv_shift_rows(s):
    out = [0] * 16
    for c in range(4):
        for r in range(4):
            out[4 * c + r] = s[4 * ((c - r) % 4) + r]
    return out

def _inv_mix_columns(s):
    out = [0] * 16
    for c in range(4):
        a = s[4 * c:4 * c + 4]
        out[4 * c + 0] = _gmul(a[0], 14) ^ _gmul(a[1], 11) ^ _gmul(a[2], 13) ^ _gmul(a[3], 9)
        out[4 * c + 1] = _gmul(a[0], 9) ^ _gmul(a[1], 14) ^ _gmul(a[2], 11) ^ _gmul(a[3], 13)
        out[4 * c + 2] = _gmul(a[0], 13) ^ _gmul(a[1], 9) ^ _gmul(a[2], 14) ^ _gmul(a[3], 11)
        out[4 * c + 3] = _gmul(a[0], 11) ^ _gmul(a[1], 13) ^ _gmul(a[2], 9) ^ _gmul(a[3], 14)
    return out

def aes_ecb_decrypt_block(key, blk, rk=None):
    rk = rk or _expand_key(key)
    s = [blk[i] ^ rk[160 + i] for i in range(16)]
    for rnd in range(9, 0, -1):
        s = _inv_shift_rows(s)
        s = [INV_SBOX[b] for b in s]
        s = [s[i] ^ rk[16 * rnd + i] for i in range(16)]
        s = _inv_mix_columns(s)
    s = _inv_shift_rows(s)
    s = [INV_SBOX[b] for b in s]
    return bytes([s[i] ^ rk[i] for i in range(16)])

def aes_ecb_decrypt(key, data):
    rk = _expand_key(key)
    out = bytearray()
    for off in range(0, len(data) - len(data) % 16, 16):
        out += aes_ecb_decrypt_block(key, data[off:off + 16], rk)
    return bytes(out)

def _selftest():
    k = bytes.fromhex('000102030405060708090a0b0c0d0e0f')
    ct = bytes.fromhex('69c4e0d86a7b0430d8cdb78070b4c55a')
    pt = aes_ecb_decrypt(k, ct)
    ok = pt == bytes.fromhex('00112233445566778899aabbccddeeff')
    if not ok:
        raise SystemExit('AES 自检失败: %s' % pt.hex())
    return ok

# ------------------------------------------------------------------ PKCS7
def unpad(b):
    if not b:
        return b
    n = b[-1]
    if 1 <= n <= 16 and b[-n:] == bytes([n]) * n:
        return b[:-n]
    return b

CORE_KEY = bytes.fromhex('687A4852416D736F356B496E62617857')  # b"hzHRAmso5kInbaxW"
META_KEY = bytes.fromhex('2331346C6A6B5F215C5D2630553C2728')

MAGICS = [(b'fLaC', 'flac'), (b'ID3', 'mp3'), (b'\xff\xfb', 'mp3'), (b'\xff\xfa', 'mp3'),
          (b'\xff\xf3', 'mp3'), (b'\xff\xf2', 'mp3'), (b'\xff\xf1', 'mp3'), (b'\xff\xf9', 'mp3'),
          (b'OggS', 'ogg')]

def sniff(buf):
    for m, fmt in MAGICS:
        if buf[:len(m)] == m:
            return fmt
    return None

# ------------------------------------------------------------------ decode
def build_keybox(key_data):
    kb = list(range(256))
    c = last = off = 0
    for i in range(256):
        swap = kb[i]
        c = (swap + last + key_data[off]) & 0xFF
        off = (off + 1) % len(key_data)
        kb[i] = kb[c]
        kb[c] = swap
        last = c
    return kb

def build_stream(kb, n):
    """keystream 周期 256（只依赖 i mod 256），一次生成后切片复用"""
    per = bytearray(256)
    for i in range(256):
        j = (i + 1) & 0xFF
        per[i] = kb[(kb[j] + kb[(kb[j] + j) & 0xFF]) & 0xFF]
    return bytes(per[(k % 256)] for k in range(n)) if n <= 8192 else (per, n)

def decode(path, outdir):
    print('[selftest] AES-128-ECB ...', end=' ')
    _selftest()
    print('OK')

    f = open(path, 'rb')
    magic = f.read(8)
    print('文件头:', magic)
    if magic != b'CTENFDAM':
        raise SystemExit('不是 NCM 容器（文件头 %r）' % magic)

    f.seek(2, 1)
    key_len = struct.unpack('<I', f.read(4))[0]
    print('key_len:', key_len)
    kd = bytearray(f.read(key_len))
    for i in range(len(kd)):
        kd[i] ^= 0x64
    kd = unpad(aes_ecb_decrypt(CORE_KEY, bytes(kd)))
    print('核心密钥明文前 20B:', kd[:20])
    if kd[:17] != b'neteasecloudmusic':
        raise SystemExit('核心密钥解密失败，前缀=%r' % kd[:24])
    key_data = kd[17:]
    print('RC4/box key 长度:', len(key_data))
    kb = build_keybox(key_data)

    meta_len = struct.unpack('<I', f.read(4))[0]
    print('meta_len:', meta_len)
    md = bytearray(f.read(meta_len))
    for i in range(len(md)):
        md[i] ^= 0x63
    meta = {}
    try:
        raw = base64.b64decode(bytes(md[22:]))
        raw = unpad(aes_ecb_decrypt(META_KEY, raw))
        if raw[:6] == b'music:':
            raw = raw[6:]
        meta = json.loads(raw.decode('utf-8'))
    except Exception as e:
        meta = {'_parse_error': '%s: %s' % (type(e).__name__, e)}
    print('meta format:', meta.get('format'), '| name:', meta.get('musicName'),
          '| artist:', meta.get('artist'), '| br:', meta.get('bitrate'), '| dur:', meta.get('duration'))

    f.read(4)                      # crc32
    f.seek(5, 1)                   # 5 字节间隔
    img_size = struct.unpack('<I', f.read(4))[0]
    img = f.read(img_size)
    audio_off = f.tell()
    print('cover_size:', img_size, '| cover JPEG:', img[:4].hex(), '...', img[-2:].hex())
    audio = f.read()
    f.close()
    print('音频流原始字节:', len(audio), '| 起点 file offset:', audio_off)

    per = build_stream(kb, 256)
    buf = bytearray(audio)
    for i in range(len(buf)):
        buf[i] ^= per[i % 256]

    fmt = sniff(buf)
    if fmt is None:
        # 容错：在前 4096 字节里找真起点
        for k in range(0, min(4096, len(buf) - 4)):
            fmt = sniff(buf[k:k + 8])
            if fmt:
                print('!! 结构推算起点未命中，前移到 +%d' % k)
                buf = buf[k:]
                break
    if fmt is None:
        raise SystemExit('解密后仍无合法音频头，前 16B=%s' % buf[:16].hex())
    print('解密成功 | 格式:', fmt, '| 前 16B:', buf[:16].hex())

    os.makedirs(outdir, exist_ok=True)
    out = os.path.join(outdir, 'ai-yi.' + fmt)
    with open(out, 'wb') as g:
        g.write(buf)
    print('输出:', out, '|', len(buf), '字节')
    with open(os.path.join(outdir, 'ai-yi.meta.json'), 'w', encoding='utf-8') as g:
        json.dump(meta, g, ensure_ascii=False, indent=2)
    return out, fmt, meta

if __name__ == '__main__':
    src = sys.argv[1] if len(sys.argv) > 1 else r'D:\CloudMusic\VipSongsDownload\陈致逸 - 爱意 (金风玉露变奏).ncm'
    dst = sys.argv[2] if len(sys.argv) > 2 else r'D:\works\wuh.site.video\.tmp\bgm'
    decode(src, dst)