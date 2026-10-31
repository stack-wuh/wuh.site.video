#!/usr/bin/env node
/**
 * 渲染脚本 v2（shot-spec §5/§5.8）——镜级管线编排：
 *   bundle 一次 → 逐镜 renderMedia（缓存键 = 镜文件 hash + esbuild 依赖闭包 + 时长）→ 逐镜 ffprobe 帧数校验
 *   → concat 滤镜 trim 帧级对齐拼接 → CFR 终装 → SiteFilmAudio 音轨渲染 mux → 三重终验
 * 降级链：整镜 ×4 → 120f 块 → 30f 细块（每块 ×3），全败终败通知。可见性：三层事件 →
 *   out/render-status.json（机器）+ render-status.txt（人读）+ render-progress.html（浏览器 tab 自刷新面板，零端口）
 *   + osascript 通知（开工/每幕/完成/终败；重试静默）。旧分段渲染由 30f 细块梯承接兜底。
 * 用法：node scripts/render-film.mjs [--force] [--only sNN] [--no-audio]
 */
import { spawn, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { bundle } from '@remotion/bundler';
import { makeCancelSignal, renderMedia } from '@remotion/renderer';
import esbuild from 'esbuild';

/* 浏览器与并发可 env 化：本机默认系统 Chrome（headless-shell 本机网络下载卡死，见知识卡）；
   CI（Linux）设 CHROME_EXECUTABLE=none 交由 Remotion 自动下载 headless-shell */
const CHROME_ENV = process.env.CHROME_EXECUTABLE;
const CHROME = CHROME_ENV && CHROME_ENV !== 'none' ? CHROME_ENV : process.platform === 'darwin' ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' : null;
const CONCURRENCY = Number(process.env.RENDER_CONCURRENCY ?? 2);
const STALL_MS = 120_000; // 心跳停更阈值（playbook：无输出 2 分钟即视为卡死）
const MAX_HANGS = 3; // 同镜看门狗击杀止损轮数，超过即终败通知
const root = join(import.meta.dirname, '..');
const outDir = join(root, 'out');
const filmDir = join(root, 'videos', 'site-film');
const shotsCache = join(outDir, 'shots', 'site-film');
const CRF = 16;

const flags = process.argv.slice(2);
const force = flags.includes('--force');
const noAudio = flags.includes('--no-audio');
const assemble = flags.includes('--assemble'); // 跳过渲染，直接用缓存装配：concat + 音轨 + 三重终验
const bundleDirIdx = flags.indexOf('--bundle-dir');
const bundleDir = bundleDirIdx >= 0 ? flags[bundleDirIdx + 1] : null; // 复用预打包 bundle（驱动器逐镜模式必备）
const onlyIdx = flags.indexOf('--only');
const only = onlyIdx >= 0 ? flags[onlyIdx + 1] : null;

function die(msg) { console.error(`✗ ${msg}`); process.exit(1); }

const manifest = JSON.parse(readFileSync(join(filmDir, 'shots-manifest.json'), 'utf8'));
const shots = only ? manifest.shots.filter((s) => s.id === only) : manifest.shots;
if (shots.length === 0) die(`--only ${only} 无匹配镜`);
mkdirSync(shotsCache, { recursive: true });

const log = (...m) => console.log(`[render] ${new Date().toTimeString().slice(0, 8)}`, ...m);

/* ─── 可见性：三层事件 → status.json / status.txt / 面板 HTML ─── */
const status = {
  film: 'site-film', stage: 'init', totalFrames: manifest.totalFrames,
  planFrames: shots.reduce((a, s) => a + s.durationFrames, 0),
  shotsDone: 0, shotsTotal: shots.length, cached: 0, todo: 0,
  currentShot: null, currentShotFrames: 0, degraded: null, bundleProgress: null,
  doneFrames: 0, renderedFrames: 0,
  doneShots: new Set(), actsDone: [], events: [],
  startedAt: new Date().toISOString(), updatedAt: null, final: null,
};
const ev = (text) => {
  status.events.unshift(`${new Date().toTimeString().slice(0, 8)} ${text}`);
  status.events = status.events.slice(0, 12);
};
let lastHtmlAt = 0;
function writeStatus(persistHtml) {
  status.updatedAt = new Date().toISOString();
  writeFileSync(join(outDir, 'render-status.json'), JSON.stringify({ ...status, doneShots: [...status.doneShots] }, null, 2));
  const cur = status.currentShot ? `${status.currentShot.id}（${status.currentShotFrames}/${status.currentShot.durationFrames} 帧）` : '—';
  const lines = [
    `${new Date().toTimeString().slice(0, 8)} [${status.stage}] ${status.shotsDone}/${status.shotsTotal} 镜 · 缓存 ${status.cached} · 当前 ${cur}${status.degraded ? ` · 降级 ${status.degraded}` : ''}`,
    ...status.events.slice(0, 6),
  ];
  writeFileSync(join(outDir, 'render-status.txt'), lines.join('\n') + '\n');
  const now = Date.now();
  if (persistHtml || now - lastHtmlAt > 1000) {
    lastHtmlAt = now;
    const pct = status.planFrames ? Math.round((status.renderedFrames / status.planFrames) * 100) : 0;
    const actRows = manifest.acts.map((a) => {
      const inAct = manifest.shots.filter((s) => s.act === a.act && shots.some((x) => x.id === s.id));
      const done = inAct.filter((s) => status.doneShots.has(s.id)).length;
      return `<div class="act"><span>Act ${a.act} ${a.title}</span><b>${done}/${inAct.length}</b></div>`;
    }).join('');
    writeFileSync(join(outDir, 'render-progress.html'), `<!doctype html><meta charset="utf-8"><meta http-equiv="refresh" content="3"><title>site-film 渲染</title>
<style>body{background:#171512;color:#efe9dc;font-family:ui-monospace,Menlo,monospace;margin:40px;max-width:640px}h1{font-size:18px;color:#c9a86a}.big{font-size:72px;font-weight:700;color:#b03a2e;margin:8px 0}.row{color:#8f867a;margin:4px 0}.act{display:flex;justify-content:space-between;border-bottom:1px solid #2b2620;padding:4px 0;color:#8f867a}.act b{color:#efe9dc}.evt{color:#6f675c;font-size:12px;white-space:pre-wrap;margin:2px 0}</style>
<h1>🎬 site-film · ${status.stage}</h1><div class="big">${pct}%</div>
<div class="row">镜 ${status.shotsDone}/${status.shotsTotal} · 缓存命中 ${status.cached} · 重渲 ${status.todo} · 当前 ${cur}${status.degraded ? ` · <b style="color:#b03a2e">降级 ${status.degraded}</b>` : ''}</div>
<div class="row">帧 ${status.renderedFrames}/${status.planFrames}（成片对账 ${status.totalFrames}）</div>
<div style="margin:16px 0">${actRows}</div>
<div>${status.events.map((e) => `<div class="evt">${e}</div>`).join('')}</div>`);
  }
}

/* ─── 通知（重试静默；开工/每幕/完成/终败必达） ─── */
function notify(msg) {
  try {
    spawn('osascript', ['-e', `display notification "${msg}" with title "site-film 渲染" sound name "Glass"`], { stdio: 'ignore' }).unref();
  } catch { /* 通知失败不阻塞渲染 */ }
}

/* ─── 环境纪律：内存守卫 + 渲染前清场（playbook 铁律，pkill 串只放本脚本内） ─── */
function memoryGuard() {
  const MIN_MEM_GB = Number(process.env.RENDER_MIN_MEM_GB ?? 4); // 操作员显式覆盖（如 RENDER_MIN_MEM_GB=2 降规格冒烟），默认坚守 playbook 4GB
  const vm = spawnSync('vm_stat', { encoding: 'utf8' }).stdout ?? '';
  const page = (name) => Number(vm.match(new RegExp(`${name}:\\s+(\\d+)`))?.[1] ?? 0);
  const availGB = ((page('Pages free') + page('Pages inactive')) * 4096) / 2 ** 30;
  if (availGB < MIN_MEM_GB) die(`可用内存 ${availGB.toFixed(1)}GB < ${MIN_MEM_GB}GB——按 playbook 不启动渲染`);
  log(`内存可用 ${availGB.toFixed(1)}GB ✓（阈值 ${MIN_MEM_GB}GB）`);
}
function cleanup() {
  spawnSync('pkill', ['-f', 'remotion-shared-memory-capture']);
  spawnSync('pkill', ['-f', 'headless=old']);
  const pids = spawnSync('lsof', ['-ti', ':3211'], { encoding: 'utf8' }).stdout.trim().split('\n').filter(Boolean);
  if (pids.length) spawnSync('kill', ['-9', ...pids]);
}

/* ─── 缓存键：镜文件 hash + esbuild 依赖闭包（仓库内文件）+ 时长/fps ─── */
async function shotHash(s) {
  const result = await esbuild.build({
    entryPoints: [join(filmDir, s.source)], bundle: true, write: false, metafile: true, logLevel: 'silent', jsx: 'automatic',
  });
  const files = Object.keys(result.metafile.inputs).filter((k) => !k.includes('node_modules')).sort();
  const h = createHash('sha256');
  h.update(JSON.stringify({ durationFrames: s.durationFrames, fps: manifest.fps }));
  for (const f of files) {
    const abs = join(root, f);
    if (existsSync(abs) && statSync(abs).isFile()) h.update(readFileSync(abs));
  }
  return h.digest('hex').slice(0, 8);
}

const ffprobeFrames = (file) => {
  const r = spawnSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=nb_frames', '-of', 'default=noprint_wrappers=1:nokey=1', file], { encoding: 'utf8' });
  return Number(r.stdout.trim());
};
const run = (cmd, args) => {
  const r = spawnSync(cmd, args, { cwd: root, encoding: 'utf8' });
  if (r.status !== 0) console.error(`${cmd} 失败:`, (r.stderr ?? '').slice(-300));
  return r.status === 0;
};

/* ─── 拼接：concat 滤镜 + trim 帧级对齐（playbook：demuxer 拼接会补重复帧）→ CFR 终装 ─── */
function concatFilter(files, frames, out) {
  const ins = files.map((f) => ['-i', f]).flat();
  const chains = files.map((_, i) => `[${i}:v]trim=end_frame=${frames[i]},setpts=PTS-STARTPTS[v${i}]`).join(';');
  const graph = `${chains};${files.map((_, i) => `[v${i}]`).join('')}concat=n=${files.length}:v=1:a=0[cat]`;
  return run('ffmpeg', ['-y', ...ins, '-filter_complex', graph, '-map', '[cat]', '-r', '30', '-vsync', 'cfr',
    '-c:v', 'libx264', '-preset', 'veryfast', '-crf', String(CRF), '-pix_fmt', 'yuv420p', out]);
}

/* ─── 逐镜渲染（降级链：整镜 ×4 → 120f 块 ×3 → 30f 细块 ×3；看门狗：心跳停更 120s 击杀重试，同镜 3 轮止损） ─── */
async function renderRange(comp, serveUrl, start, end, out, stallMs = STALL_MS) {
  const { cancelSignal, cancel } = makeCancelSignal();
  let lastTick = Date.now();
  let stalled = false;
  const watchdog = setInterval(() => {
    if (!stalled && Date.now() - lastTick > stallMs) {
      stalled = true;
      log(`⚠️ 心跳停更 >${Math.round(stallMs / 1000)}s——看门狗击杀本次渲染`);
      cancel();
    }
  }, 5000);
  try {
    await renderMedia({
      composition: { ...comp, durationInFrames: end - start },
      serveUrl, codec: 'h264', crf: CRF, concurrency: CONCURRENCY, browserExecutable: CHROME,
      outputLocation: out, inputProps: {}, frameRange: [start, end - 1], cancelSignal,
      onProgress: ({ renderedFrames }) => {
        lastTick = Date.now();
        status.currentShotFrames = renderedFrames;
        status.renderedFrames = status.doneFrames + renderedFrames;
        writeStatus(false);
      },
    });
  } finally {
    clearInterval(watchdog);
  }
  return stalled;
}

async function renderShot(shot, comp, serveUrl, hash) {
  const out = join(shotsCache, `${shot.id}-${hash}.mp4`);
  const ladder = [[shot.durationFrames, 4], [120, 3], [30, 3]];
  let hangs = 0;
  while (true) {
    const hangsBefore = hangs;
    for (const [blk, attempts] of ladder) {
      for (let attempt = 1; attempt <= attempts; attempt++) {
        cleanup();
        status.degraded = blk < shot.durationFrames ? `${blk}f 细块` : null;
        try {
          if (blk === shot.durationFrames) {
            const stalled = await renderRange(comp, serveUrl, 0, shot.durationFrames, out);
            if (stalled) {
              hangs += 1;
              log(`${shot.id} 看门狗击杀（第 ${hangs}/${MAX_HANGS} 轮卡死）`);
              if (hangs >= MAX_HANGS) return { out: null, stalled: true };
              break;
            }
          } else {
            const blocks = [];
            let subStalled = false;
            for (let start = 0; start < shot.durationFrames; start += blk) {
              const end = Math.min(start + blk, shot.durationFrames);
              const sub = join(shotsCache, `${shot.id}-part-${start}.mp4`);
              rmSync(sub, { force: true });
              const st = await renderRange(comp, serveUrl, start, end, sub, Math.min(STALL_MS, 60_000));
              if (st) { subStalled = true; break; }
              blocks.push({ file: sub, frames: end - start });
            }
            if (subStalled) {
              hangs += 1;
              log(`${shot.id} 看门狗击杀（第 ${hangs}/${MAX_HANGS} 轮卡死，细块段）`);
              blocks.forEach((b) => rmSync(b.file, { force: true }));
              if (hangs >= MAX_HANGS) return { out: null, stalled: true };
              break;
            }
            if (!concatFilter(blocks.map((b) => b.file), blocks.map((b) => b.frames), out)) throw new Error('细块拼接失败');
            blocks.forEach((b) => rmSync(b.file, { force: true }));
          }
          const frames = ffprobeFrames(out);
          if (frames === shot.durationFrames) return { out, stalled: false };
          log(`${shot.id} 帧数不符：${frames} ≠ ${shot.durationFrames}（INV-S5）`);
          rmSync(out, { force: true });
        } catch (err) {
          log(`${shot.id} 第 ${attempt} 次失败：${String(err).slice(0, 160)}`);
          rmSync(out, { force: true });
        }
        await new Promise((r) => setTimeout(r, 3000));
      }
      if (hangs > hangsBefore) break; // 本梯被看门狗击杀打断——回到整镜重跑，止损预算未变
    }
    if (hangs === hangsBefore) return { out: null, stalled: false }; // 整梯耗尽且非卡死——真失败
  }
}

function bar(done, total) {
  const p = Math.round((done / total) * 100);
  const filled = Math.round(p / 4);
  return `${'█'.repeat(filled)}${'░'.repeat(25 - filled)} ${String(p).padStart(3)}%`;
}

/* ─── 主流程 ─── */
if (!assemble) memoryGuard(); // assemble 纯 ffmpeg 装配不吃渲染内存；其音轨渲染前的守卫在 wav 缺失分支内
const chromeVersion = spawnSync('defaults', ['read', '/Applications/Google Chrome.app/Contents/Info.plist', 'CFBundleShortVersionString'], { encoding: 'utf8' }).stdout.trim();
const chromeStamp = join(outDir, '.last-render-chrome.json');
if (existsSync(chromeStamp)) {
  const prev = JSON.parse(readFileSync(chromeStamp, 'utf8'));
  if (prev.chrome !== chromeVersion) {
    log(`⚠️ Chrome 版本漂移：${prev.chrome} → ${chromeVersion}——像素基线失效（漂移地板实测 ≈0.99），验收按漂移门口径执行`);
    notify(`⚠️ Chrome ${prev.chrome}→${chromeVersion}，按漂移门验收`);
    status.chromeDrift = { from: prev.chrome, to: chromeVersion };
  }
}
status.stage = 'plan'; ev('规划中：计算缓存键');
for (const s of shots) {
  s.hash = await shotHash(s);
  s.cachePath = join(shotsCache, `${s.id}-${s.hash}.mp4`);
  s.cached = !force && existsSync(s.cachePath);
  for (const f of readdirSync(shotsCache)) {
    if (f.startsWith(`${s.id}-`) && f !== `${s.id}-${s.hash}.mp4`) rmSync(join(shotsCache, f), { force: true });
  }
}
status.cached = shots.filter((s) => s.cached).length;
status.todo = shots.length - status.cached;
const todoFrames = shots.filter((s) => !s.cached).reduce((a, s) => a + s.durationFrames, 0);
const etaMin = Math.max(1, Math.round(todoFrames / 200));
const planLine = `${shots.length} 镜（缓存 ${status.cached} / 重渲 ${status.todo} ≈ ${todoFrames} 帧）预计 ~${etaMin} 分钟`;
log(`开工：${planLine}`);

/* ─── assemble 模式：跳过渲染，直接用缓存装配（驱动器逐镜渲完后的终装入口） ─── */
let serveUrl = bundleDir; // 预打包目录直接作为 serveUrl（renderMedia 接受本地目录）；assemble/音轨段需要时按需补 bundle
const rendered = [];
if (assemble) {
  const missing = shots.filter((s) => !s.cached);
  if (missing.length > 0) die(`--assemble 缺 ${missing.length} 镜缓存：${missing.map((s) => s.id).join(' ')}——先逐镜渲染`);
  rendered.push(...shots.map((s) => s.cachePath));
  status.stage = 'concat'; ev(`assemble：${shots.length} 镜缓存齐 ✓`); writeStatus(true);
} else {
  status.stage = 'bundle'; ev(planLine); writeStatus(true);
  notify(`开工：${planLine}`);
  if (!serveUrl) {
    serveUrl = await bundle({
      entryPoint: join(root, 'src', 'index.ts'),
      onProgress: ({ progress }) => { status.bundleProgress = Number.isFinite(progress) ? Math.round(progress * 100) : null; writeStatus(false); },
    });
  }
  log(`bundle ${bundleDir ? `复用 ${bundleDir}` : `完成（${status.bundleProgress ?? 100}%）`} → 逐镜渲染`);
  status.stage = 'shots'; writeStatus(true);

  const compBase = { id: 'SiteFilm', width: 1920, height: 1080, fps: manifest.fps };
  for (const s of shots) {
    if (s.cached) {
      rendered.push(s.cachePath);
      status.doneShots.add(s.id);
      status.doneFrames += s.durationFrames;
      status.renderedFrames = status.doneFrames;
      status.shotsDone += 1;
      log(`${s.id} 缓存命中 ✓（${s.durationFrames}f）`);
      writeStatus(false);
      continue;
    }
    status.currentShot = s; status.currentShotFrames = 0; writeStatus(true);
    const res = await renderShot(s, { ...compBase, durationInFrames: s.durationFrames }, serveUrl, s.hash);
    if (!res.out) {
      const why = res.stalled ? `卡死 ×${MAX_HANGS}（看门狗止损）` : '渲染失败（含 30f 细块降级）';
      status.stage = 'failed'; ev(`❌ ${s.id} 终败：${why}`);
      writeStatus(true);
      notify(`❌ ${s.id} 终败：${why}，已停止`);
      die(`${s.id} 终败：${why}`);
    }
    rendered.push(res.out);
    status.doneFrames += s.durationFrames;
    status.renderedFrames = status.doneFrames;
    status.currentShot = null; status.shotsDone += 1;
    const actShots = manifest.shots.filter((x) => x.act === s.act);
    if (actShots.every((x) => status.doneShots.has(x.id)) && !status.actsDone.includes(s.act)) {
      status.actsDone.push(s.act);
      const act = manifest.acts.find((a) => a.act === s.act);
      ev(`Act ${s.act} ${act.title} 完成（${status.shotsDone}/${shots.length} 镜）`);
      notify(`Act ${s.act} ${act.title} 完成（${status.shotsDone}/${shots.length} 镜）`);
    }
    log(`${s.id} 完成 ✔ ${bar(status.doneFrames, status.planFrames)}`);
    writeStatus(true);
  }
}

if (only) {
  log(`--only 模式：单镜 ${only} 出片 ${rendered[0]}`);
  status.stage = 'done'; status.final = { path: rendered[0] }; writeStatus(true);
  process.exit(0);
}

/* ─── 拼接 + 音轨 + 终装 ─── */
status.stage = 'concat'; ev('拼接中（concat 滤镜帧级对齐）'); writeStatus(true);
const silent = join(outDir, 'site-film-silent.mp4');
if (!concatFilter(rendered, shots.map((s) => s.durationFrames), silent)) die('拼接失败');
log('拼接完成 → 音轨渲染（SiteFilmAudio）');
status.stage = 'audio'; writeStatus(true);

let finalOk = false;
const finalPath = join(outDir, 'site-film-final.mp4');
if (!noAudio) {
  const audioHash = createHash('sha256')
    .update(readFileSync(join(filmDir, 'SiteFilmAudio.tsx')))
    .update(readdirSync(join(root, 'public', 'site-film')).sort().map((f) => createHash('sha256').update(readFileSync(join(root, 'public', 'site-film', f))).digest('hex')).join(''))
    .digest('hex').slice(0, 8);
  const wav = join(outDir, `site-film-audio-${audioHash}.wav`);
  if (!existsSync(wav)) {
    memoryGuard();
    if (!serveUrl) {
      serveUrl = await bundle({ entryPoint: join(root, 'src', 'index.ts'), onProgress: ({ progress }) => { status.bundleProgress = Number.isFinite(progress) ? Math.round(progress * 100) : null; } });
    }
    cleanup();
    const { cancelSignal, cancel } = makeCancelSignal();
    let lastTick = Date.now();
    let stalled = false;
    const watchdog = setInterval(() => {
      if (!stalled && Date.now() - lastTick > 300_000) { stalled = true; log('⚠️ 音轨渲染心跳停更 >300s——看门狗击杀'); cancel(); }
    }, 5000);
    try {
      await renderMedia({
        composition: { id: 'SiteFilmAudio', width: 1920, height: 1080, fps: manifest.fps, durationInFrames: manifest.totalFrames },
        serveUrl, codec: 'wav', browserExecutable: CHROME, outputLocation: wav, inputProps: {}, cancelSignal,
        onProgress: () => { lastTick = Date.now(); },
      });
    } finally {
      clearInterval(watchdog);
    }
    if (stalled) die('音轨渲染卡死（看门狗 3×100s 无心跳）——已停止，重跑脚本续渲染');
  }
  status.stage = 'mux'; writeStatus(true);
  finalOk = run('ffmpeg', ['-y', '-i', silent, '-i', wav, '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '256k', finalPath]);
} else {
  finalOk = run('cp', [silent, finalPath]);
}
if (!finalOk) die('终装 mux 失败');

/* ─── 三重终验 ─── */
status.stage = 'verify'; writeStatus(true);
const v = spawnSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=nb_frames,duration', '-of', 'default=noprint_wrappers=1', finalPath], { encoding: 'utf8' }).stdout;
const a = spawnSync('ffprobe', ['-v', 'error', '-select_streams', 'a:0', '-show_entries', 'stream=duration', '-of', 'default=noprint_wrappers=1', finalPath], { encoding: 'utf8' }).stdout;
const vol = spawnSync('ffmpeg', ['-i', finalPath, '-af', 'volumedetect', '-f', 'null', '-'], { encoding: 'utf8', timeout: 120000 });
const meanVol = vol.stderr?.match(/mean_volume: ([-\d.]+) dB/)?.[1] ?? '?';
const frames = ffprobeFrames(finalPath);
const ok = frames === manifest.totalFrames;
log(`终验：帧数 ${frames}/${manifest.totalFrames}（${ok ? '✓' : '✗ INV-S1'}）| ${v.trim().replace('\n', ' | ')} | audio ${a.trim()} | mean_volume ${meanVol} dB`);
status.stage = ok ? 'done' : 'failed';
status.final = { path: finalPath, frames, meanVolumeDb: meanVol };
if (ok) writeFileSync(chromeStamp, JSON.stringify({ chrome: chromeVersion, at: new Date().toISOString() }));
ev(ok ? `✅ 出片完成 ${finalPath}（${frames} 帧）` : `❌ 终验帧数不符 ${frames}`);
writeStatus(true);
notify(ok ? `✅ 出片完成：${frames} 帧` : `❌ 终验失败：帧数 ${frames} ≠ ${manifest.totalFrames}`);
rmSync(silent, { force: true });
process.exit(ok ? 0 : 1);
