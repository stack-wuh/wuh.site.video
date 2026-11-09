#!/usr/bin/env node
// harvest-site-shots.mjs — 站点真实素材采集（wuh-site-intro-v3 资产层）
// 登记表反驱动：videos/preprod-wuh-site-intro-v3/assets/asset-registry.md
//
// 采集方式：系统 Chrome --headless=new 短命进程 + 零依赖 CDP
//（Node 原生 net+crypto 手写最小 WebSocket 客户端——仓内无 ws/puppeteer，不新增依赖）。
// 支持：视口/DPR 覆写、滚动（selector 优先，像素/比例兜底）、页面交互（弹幕展开）、
// document.fonts.ready 静置；采集完 kill 进程并清理临时 profile（清场铁律）。
//
// 用法：
//   node scripts/harvest-site-shots.mjs            # 采集全部缺失（已有 -vN 跳过）
//   node scripts/harvest-site-shots.mjs --only s01-home-hero,s08-about-heatmap
//   node scripts/harvest-site-shots.mjs --force    # 忽略已存在，重采为 -vN+1? 不——覆盖当前版本文件
//   node scripts/harvest-site-shots.mjs --list     # 只打印采集计划
//   node scripts/harvest-site-shots.mjs --check    # 校验登记资产文件齐全（INV-2 观察点）
//
// 输出：public/wuh-site-intro-v3/site/<id>-v1.png（渲染依赖必进 git，staticFile 以 public/ 为根）
// 注意：P 型裁切件（p-hero-wordmark 等）在分镜定稿后按构图需求二次裁切，不在本脚本首轮范围。

import { spawn } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import net from 'node:net';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = path.join(ROOT, 'public/wuh-site-intro-v3/site');
const CHROME_BIN = process.env.CHROME_BIN || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const BASE = 'https://wuh.site';
const VW = 1920, VH = 1080, DPR = 2;

// ---------------------------------------------------------------------------
// 采集清单（登记表 S/P 全集；id 与登记表编号对应）
// scroll: {selector, block} 优先，失败回退 {y} 或 {ratio}
// click: 交互（S07 弹幕）；waitMs: load 后额外静置
// ---------------------------------------------------------------------------
const SHOTS = [
  { id: 's01-home-hero',      url: `${BASE}/`,                        desc: '首页 Hero 题记', waitMs: 3500 },
  { id: 's02-home-timeline',  url: `${BASE}/`,                        desc: '首页墨点时间轴', waitMs: 3500, scroll: { text: '精选博客', y: 800 } },
  { id: 's03-post-165',       url: `${BASE}/post/165`,                desc: '文章页《再读〈坐忘歌〉》', waitMs: 4000 },
  { id: 's04-weread',         url: `${BASE}/weread`,                  desc: '微信读书书架', waitMs: 4500 },
  { id: 's05-music',          url: `${BASE}/music`,                   desc: '音乐年轮/黑胶', waitMs: 4500 },
  { id: 's06-guestbook',      url: `${BASE}/guestbook`,               desc: '留言板', waitMs: 4000 },
  { id: 's07-about-barrage',  url: `${BASE}/about`,                   desc: 'About 弹幕聊天室（交互展开）', waitMs: 4000,
    click: { expr: `(() => { const els = Array.from(document.querySelectorAll('*')).filter(e => e.children.length <= 2 && /见字如面/.test(e.textContent || '')); const el = els[els.length - 1]; if (el) { el.click(); return 'clicked'; } return 'not-found'; })()`, settleMs: 3000 } },
  { id: 's08-about-heatmap',  url: `${BASE}/about`,                   desc: 'About 热力图', waitMs: 4000, scroll: { text: '综合活动热力图', block: 'center' } },
  { id: 's09-footprint',      url: `${BASE}/footprint`,               desc: '足迹地图', waitMs: 4500 },
  { id: 's10-design-color',   url: `${BASE}/design/system-color`,     desc: '设计系统换装', waitMs: 4000 },
  { id: 's11-topics',         url: `${BASE}/topics`,                  desc: '话题聚合', waitMs: 4000 },
  { id: 's12-about-recent',   url: `${BASE}/about`,                   desc: 'About 最近日志（跨平台聚合）', waitMs: 4000, scroll: { text: '最近日志', block: 'start' } },
  { id: 'gh01-init-commit',   url: 'https://github.com/stack-wuh/x.wuh.site/commit/e1b8cdd', desc: '第一行代码提交物证（GitHub）', waitMs: 5000 },
  { id: 'gh02-issues-blog',   url: 'https://github.com/stack-wuh/blog/issues', desc: 'Issues 即 CMS（GitHub）', waitMs: 5000 },
];

// ---------------------------------------------------------------------------
// 最小 WebSocket 客户端（RFC6455 子集：text 帧 / mask / 分片 / ping-pong）
// ---------------------------------------------------------------------------
class MiniWS {
  constructor(socket) {
    this.socket = socket;
    this.buffer = Buffer.alloc(0);
    this.fragments = null;
    this.fragOpcode = 0;
    this.pending = new Map();
    this.listeners = [];
    this.nextId = 1;
    this.onmessage = null; // (obj) => void
    socket.on('data', (chunk) => this._feed(chunk));
  }

  static connect(url) {
    return new Promise((resolve, reject) => {
      const u = new URL(url);
      const key = crypto.randomBytes(16).toString('base64');
      const socket = net.connect(Number(u.port), u.hostname, () => {
        socket.write(
          `GET ${u.pathname} HTTP/1.1\r\n` +
          `Host: ${u.host}\r\n` +
          `Upgrade: websocket\r\n` +
          `Connection: Upgrade\r\n` +
          `Sec-WebSocket-Key: ${key}\r\n` +
          `Sec-WebSocket-Version: 13\r\n\r\n`
        );
      });
      socket.once('error', reject);
      let head = Buffer.alloc(0);
      const onHandshake = (chunk) => {
        head = Buffer.concat([head, chunk]);
        const idx = head.indexOf('\r\n\r\n');
        if (idx === -1) return;
        const headers = head.slice(0, idx).toString();
        if (!/HTTP\/1\.1 101/.test(headers)) return reject(new Error('WS handshake failed: ' + headers.split('\r\n')[0]));
        const rest = head.slice(idx + 4);
        socket.removeListener('data', onHandshake);
        const ws = new MiniWS(socket);
        if (rest.length) ws._feed(rest);
        resolve(ws);
      };
      socket.on('data', onHandshake);
    });
  }

  _feed(chunk) {
    this.buffer = Buffer.concat([this.buffer, chunk]);
    for (;;) {
      const frame = this._readFrame();
      if (!frame) break;
      const { opcode, payload, fin } = frame;
      if (opcode === 9) { this._sendFrame(10, payload); continue; } // ping → pong
      if (opcode === 10) continue;
      if (opcode === 8) { this.socket.end(); continue; }
      if (opcode === 1 || opcode === 2) { this.fragments = Buffer.from(payload); this.fragOpcode = opcode; }
      else if (opcode === 0 && this.fragments) { this.fragments = Buffer.concat([this.fragments, payload]); }
      if (!fin) continue; // 等后续分片
      const full = this.fragments; this.fragments = null;
      if (this.fragOpcode === 1) {
        try { const obj = JSON.parse(full.toString('utf8')); if (this.onmessage) this.onmessage(obj); } catch { /* ignore */ }
      }
    }
  }

  _readFrame() {
    const b = this.buffer;
    if (b.length < 2) return null;
    const fin = (b[0] & 0x80) !== 0;
    const opcode = b[0] & 0x0f;
    const masked = (b[1] & 0x80) !== 0;
    let len = b[1] & 0x7f;
    let off = 2;
    if (len === 126) { if (b.length < off + 2) return null; len = b.readUInt16BE(off); off += 2; }
    else if (len === 127) { if (b.length < off + 8) return null; const big = b.readBigUInt64BE(off); if (big > BigInt(Number.MAX_SAFE_INTEGER)) throw new Error('frame too large'); len = Number(big); off += 8; }
    if (masked) off += 4;
    if (b.length < off + len) return null;
    const payload = masked ? b.slice(off, off + len) : Buffer.from(b.slice(off, off + len));
    this.buffer = b.slice(off + len);
    return { fin, opcode, payload };
  }

  _sendFrame(opcode, payload) {
    const mask = crypto.randomBytes(4);
    const len = payload.length;
    let header;
    if (len < 126) { header = Buffer.from([0x80 | opcode, 0x80 | len]); }
    else if (len < 65536) { header = Buffer.alloc(4); header[0] = 0x80 | opcode; header[1] = 0x80 | 126; header.writeUInt16BE(len, 2); }
    else { header = Buffer.alloc(10); header[0] = 0x80 | opcode; header[1] = 0x80 | 127; header.writeBigUInt64BE(BigInt(len), 2); }
    const masked = Buffer.from(payload);
    for (let i = 0; i < masked.length; i++) masked[i] ^= mask[i % 4];
    this.socket.write(Buffer.concat([header, mask, masked]));
  }

  send(obj) {
    const id = this.nextId++;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => { this.pending.delete(id); reject(new Error(`CDP timeout: ${obj.method}`)); }, 60_000);
      this.pending.set(id, { resolve, reject, timer });
      this._sendFrame(1, Buffer.from(JSON.stringify({ ...obj, id })));
    });
  }

  _dispatch(obj) {
    if (obj.id !== undefined && this.pending.has(obj.id)) {
      const p = this.pending.get(obj.id);
      this.pending.delete(obj.id);
      clearTimeout(p.timer);
      if (obj.error) p.reject(new Error(`${obj.error.message} (code ${obj.error.code})`));
      else p.resolve(obj.result);
      return true;
    }
    return false;
  }
}

// ---------------------------------------------------------------------------
// Chrome 短命进程
// ---------------------------------------------------------------------------
function launchChrome() {
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'harvest-chrome-'));
  const proc = spawn(CHROME_BIN, [
    '--headless=new',
    '--remote-debugging-port=0',
    `--user-data-dir=${profile}`,
    '--no-first-run', '--no-default-browser-check',
    '--disable-extensions', '--disable-background-networking',
    '--hide-scrollbars', '--mute-audio',
    `--window-size=${VW},${VH}`,
    'about:blank',
  ], { stdio: ['ignore', 'pipe', 'pipe'] });
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Chrome devtools endpoint timeout')), 30_000);
    const onData = (buf) => {
      const m = buf.toString().match(/DevTools listening on (ws:\/\/[^\s]+)/);
      if (m) { clearTimeout(timer); resolve({ proc, wsUrl: m[1], profile }); }
    };
    proc.stderr.on('data', onData);
    proc.stdout.on('data', onData);
    proc.once('exit', (code) => { clearTimeout(timer); reject(new Error(`Chrome exited early (code ${code})`)); });
  });
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---------------------------------------------------------------------------
// 单镜采集
// ---------------------------------------------------------------------------
async function harvestShot(ws, shot, outFile) {
  const { targetId } = await ws.send({ method: 'Target.createTarget', params: { url: 'about:blank' } });
  const { sessionId } = await ws.send({ method: 'Target.attachToTarget', params: { targetId, flatten: true } });
  const call = (method, params = {}) => ws.send({ method, params, sessionId });

  const loaded = new Promise((resolve) => {
    const prev = ws.onmessage;
    ws.onmessage = (obj) => {
      if (!ws._dispatch(obj) && obj.method === 'Page.loadEventFired' && obj.sessionId === sessionId) resolve();
      if (prev) prev(obj);
    };
  });

  try {
    await call('Page.enable');
    await call('Runtime.enable');
    await call('Emulation.setDeviceMetricsOverride', { width: VW, height: VH, deviceScaleFactor: DPR, mobile: false });
    await call('Page.navigate', { url: shot.url });
    await Promise.race([loaded, sleep(30_000).then(() => { throw new Error(`load timeout: ${shot.url}`); })]);
    await sleep(shot.waitMs ?? 3000);

    // 字体就绪（10s 上限）
    await call('Runtime.evaluate', {
      expression: `Promise.race([document.fonts.ready.then(() => 'ok'), new Promise(r => setTimeout(() => r('timeout'), 10000))])`,
      awaitPromise: true, returnByValue: true,
    }).catch(() => {});

    // 滚动（text 按段落标签文本定位 > selector > y/ratio 兜底）
    if (shot.scroll) {
      const { selector, text, y, ratio, block = 'start' } = shot.scroll;
      const expr = text
        ? `(() => { const els = Array.from(document.querySelectorAll('*')).filter(e => e.children.length === 0 && e.textContent.trim() === ${JSON.stringify(text)}); if (els.length) { const sec = els[0].closest('section') || els[0].parentElement; (sec || els[0]).scrollIntoView({ block: ${JSON.stringify(block)} }); return 'text'; } return 'fallback'; })()`
        : selector
          ? `(() => { const el = document.querySelector(${JSON.stringify(selector)}); if (el) { el.scrollIntoView({ block: ${JSON.stringify(block)} }); return 'selector'; } return 'fallback'; })()`
          : null;
      let used = expr ? (await call('Runtime.evaluate', { expression: expr, returnByValue: true })).result?.value : 'none';
      if (used === 'fallback' || used === 'none') {
        const abs = y ?? Math.round((ratio ?? 0.5) * (VH * 3));
        await call('Runtime.evaluate', { expression: `window.scrollTo(0, ${abs})` });
      }
      await sleep(1200);
    }

    // 交互
    if (shot.click) {
      const r = await call('Runtime.evaluate', { expression: shot.click.expr, returnByValue: true });
      if (r.result?.value !== 'clicked') console.log(`   ⚠ ${shot.id}: 交互目标未命中（${r.result?.value}），按当前页面采集`);
      await sleep(shot.click.settleMs ?? 2000);
    }

    const { data } = await call('Page.captureScreenshot', { format: 'png', optimizeForSpeed: true });
    fs.mkdirSync(path.dirname(outFile), { recursive: true });
    fs.writeFileSync(outFile, Buffer.from(data, 'base64'));
    const mb = (fs.statSync(outFile).size / 1024 / 1024).toFixed(1);
    console.log(`   ✓ ${shot.id} → ${path.relative(ROOT, outFile)} (${mb}MB) — ${shot.desc}`);
  } finally {
    await call('Runtime.evaluate', { expression: '1' }).catch(() => {});
    await ws.send({ method: 'Target.closeTarget', params: { targetId } }).catch(() => {});
  }
}

// ---------------------------------------------------------------------------
// 主流程
// ---------------------------------------------------------------------------
const argv = process.argv.slice(2);
const mode = argv.find((a) => a.startsWith('--')) ?? '';
const onlyArg = (argv.find((a) => !a.startsWith('--')) ?? '').split(',').filter(Boolean);

const versionedName = (id) => `${id}-v1.png`;
const outFileOf = (id) => path.join(OUT_DIR, versionedName(id));

if (mode === '--list') {
  console.log(`采集计划（${SHOTS.length} 项 → ${path.relative(ROOT, OUT_DIR)}/，${VW}×${VH} @${DPR}x PNG）：`);
  for (const s of SHOTS) console.log(`  ${s.id.padEnd(20)} ${s.desc}`);
  process.exit(0);
}

if (mode === '--check') {
  const missing = [];
  for (const s of SHOTS) {
    const f = outFileOf(s.id);
    if (!fs.existsSync(f) || fs.statSync(f).size < 50 * 1024) missing.push(`${s.id} → ${path.relative(ROOT, f)}`);
  }
  if (missing.length) { console.error(`check 红：${missing.length} 项缺失/过小\n  ` + missing.join('\n  ')); process.exit(1); }
  console.log(`check 绿：${SHOTS.length} 项全部入库`);
  process.exit(0);
}

const targets = onlyArg.length ? SHOTS.filter((s) => onlyArg.includes(s.id)) : SHOTS;
if (!targets.length) { console.error('--only 未命中任何 id'); process.exit(1); }
const pending = targets.filter((s) => mode !== '--force' && fs.existsSync(outFileOf(s.id)));
if (!onlyArg.length && pending.length) {
  console.log(`跳过已存在 ${pending.length} 项（--force 覆盖）：${pending.map((s) => s.id).join(', ')}`);
}
const todo = mode === '--force' ? targets : targets.filter((s) => !pending.includes(s));
if (!todo.length) { console.log('无事可采'); process.exit(0); }

console.log(`采集 ${todo.length} 项：${VW}×${VH} @${DPR}x → ${path.relative(ROOT, OUT_DIR)}/`);
const { proc, wsUrl, profile } = await launchChrome();
let exitCode = 0;
try {
  const ws = await MiniWS.connect(wsUrl);
  ws.onmessage = (obj) => ws._dispatch(obj);
  for (const shot of todo) {
    try { await harvestShot(ws, shot, outFileOf(shot.id)); }
    catch (e) { console.error(`   ✗ ${shot.id}: ${e.message}`); exitCode = 1; }
  }
} catch (e) {
  console.error('采集失败:', e.message);
  exitCode = 1;
} finally {
  proc.kill('SIGTERM');
  await sleep(500);
  if (!proc.killed) proc.kill('SIGKILL');
  fs.rmSync(profile, { recursive: true, force: true });
  console.log('清场完成（Chrome 进程 + 临时 profile）');
}
process.exit(exitCode);
