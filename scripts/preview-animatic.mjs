#!/usr/bin/env node
// preview-animatic.mjs — animatic/成片 内联预览页生成器（Gen UI fragment）
// 用法：node scripts/preview-animatic.mjs <unit> <成片mp4> <输出html>
//   unit = videos/<unit>/shots-manifest.json 的 slug（preprod 单元同案：manifest 在 videos/<unit>/）
// 流程（知识卡 video-production-flow「内联预览页交付口径」）：
//   抽 12–16 帧**镜中点帧**（成片帧 = 内容帧 + 片头偏移 120f；抽镜首会吃到墨洇/转场遮罩出黑帧）
//   + manifest 镜元数据（幕/帧窗/转场/字幕）→ 数据驱动 HTML：走片 player（缩略图跳镜 + 自动走片）
//   + 八幕结构条（主线着色）+ 镜头序列 chips（悬停看帧窗与字幕）。

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const INTRO = 120;
const MAX_STILLS = 16;

const [unit, film, outPath] = process.argv.slice(2);
if (!unit || !film || !outPath) {
  console.error('用法: node scripts/preview-animatic.mjs <unit> <成片mp4> <输出html>');
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, `videos/${unit}/shots-manifest.json`), 'utf8'));
const shots = manifest.shots;
const total = manifest.totalFrames;

// ── 选镜：每幕首镜 + 关键拍（字幕/画面关键词），去重后截到 16 ──
const BEAT_RULES = [
  [/2024 年 12 月 8 日|第一行/, '重音'],
  [/六月十四日|上线/, '上线'],
  [/重启计划/, '钤印'],
  [/1,842|阅读最多/, '坐忘'],
  [/118 个版本|发布脚本/, '版本雨'],
  [/汇进同一页日志|最近日志/, 'v3 新增'],
  [/吴尒红|a boy/, '落款'],
];
const picked = [];
const push = (i) => { if (!picked.includes(i) && picked.length < MAX_STILLS) picked.push(i); };
for (let a = 1; a <= 8; a++) { const f = shots.findIndex((s) => s.act === a); if (f >= 0) push(f); }
shots.forEach((s, i) => { for (const [re] of BEAT_RULES) if (re.test(s.title) && picked.length < MAX_STILLS) push(i); });
picked.sort((x, y) => x - y);

// ── ffmpeg 抽帧（镜中点 + 120f 片头偏移）→ 640px JPEG → base64 ──
const stills = picked.map((i, k) => {
  const s = shots[i];
  const mid = Math.min(s.startFrame + Math.floor(s.durationFrames / 2) + INTRO, total + INTRO - 2);
  const jpg = path.join(ROOT, `out/preview-${unit}-${String(k).padStart(2, '0')}.jpg`);
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-ss', (mid / 30).toFixed(3), '-i', film, '-frames:v', '1', '-vf', 'scale=640:-2', '-q:v', 5, jpg]);
  const b64 = fs.readFileSync(jpg).toString('base64');
  fs.rmSync(jpg);
  return { i, src: `data:image/jpeg;base64,${b64}`, mid };
});

const esc = (t) => String(t ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const ACT_TITLES = { 1: '墨点', 2: '旧屋', 3: '第一行', 4: '留白', 5: '灯亮', 6: '入院', 7: '坐忘', 8: '此刻' };

const shotData = shots.map((s, i) => ({
  id: s.id, act: s.act, start: s.startFrame, dur: s.durationFrames,
  tr: s.transition ?? 'cut', title: s.title ?? '',
  still: picked.includes(i) ? picked.indexOf(i) : -1,
}));

const html = `<!DOCTYPE html>
<html lang="zh"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(unit)} · animatic 内联预览</title>
<style>
  :root { color-scheme: dark; }
  * { box-sizing: border-box; margin: 0; }
  body { background: #17120e; color: #e8ddce; font-family: "Songti SC", "Noto Serif CJK SC", serif; padding: 28px 4vw 60px; }
  .mono { font-family: "Menlo", "Noto Sans Mono CJK SC", monospace; }
  h1 { font-size: 26px; font-weight: 600; letter-spacing: .06em; }
  .sub { color: #a8977e; font-size: 13px; margin-top: 6px; }
  .stage { margin-top: 22px; border: 1px solid #3a2f24; background: #100c09; position: relative; }
  .stage img { width: 100%; display: block; max-height: 62vh; object-fit: contain; background: #000; }
  .slate { position: absolute; left: 12px; top: 12px; font-size: 12px; color: #cdb894; background: rgba(16,12,9,.78); padding: 6px 10px; border: 1px solid #3a2f24; }
  .bar { display: flex; gap: 4px; margin-top: 10px; }
  .bar .seg { height: 6px; border-radius: 3px; background: #3a2f24; cursor: pointer; transition: background .2s; }
  .bar .seg.on { background: #c96f4a; }
  .actlabel { display: flex; gap: 4px; margin-top: 4px; font-size: 11px; color: #8a7a63; }
  .actlabel .seg { text-align: center; cursor: pointer; }
  .caption { margin-top: 14px; font-size: 21px; min-height: 34px; color: #f0e6d4; }
  .chips { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 18px; }
  .chip { font-family: "Menlo", monospace; font-size: 11px; padding: 3px 8px; border: 1px solid #3a2f24; color: #a8977e; cursor: pointer; border-radius: 3px; }
  .chip.has { color: #e8ddce; border-color: #6b563e; }
  .chip.on { background: #c96f4a; color: #17120e; border-color: #c96f4a; }
  .chip b { color: #c96f4a; font-weight: 600; }
  .filmstrip { display: flex; gap: 8px; margin-top: 18px; overflow-x: auto; padding-bottom: 8px; }
  .filmstrip img { height: 96px; border: 1px solid #3a2f24; cursor: pointer; opacity: .82; }
  .filmstrip img.on { border-color: #c96f4a; opacity: 1; }
  .ctrl { margin-top: 12px; display: flex; gap: 10px; align-items: center; font-size: 13px; color: #a8977e; }
  button { background: #241c14; color: #e8ddce; border: 1px solid #3a2f24; padding: 6px 14px; cursor: pointer; font-size: 13px; }
  button:hover { border-color: #c96f4a; }
  .note { margin-top: 26px; font-size: 12px; color: #8a7a63; line-height: 1.8; border-top: 1px solid #3a2f24; padding-top: 14px; }
</style></head><body>
<h1>《雾失楼台，月迷津渡》· animatic 预览</h1>
<div class="sub mono">wuh-site-intro-v3 · ${shots.length} 镜 / ${total}f 正片（4:35.3）+ FilmShell 120+180f → 全片 4:51.3 · 单色简板（真实素材降饱和占位）· 转场 inbound 已标注</div>

<div class="stage">
  <img id="img" src="${stills[0]?.src}" alt="shot">
  <div class="slate mono" id="slate"></div>
</div>
<div class="bar" id="actbar"></div>
<div class="actlabel mono" id="actlabel"></div>
<div class="caption" id="caption"></div>
<div class="ctrl mono">
  <button id="prev">◀ 上一镜</button><button id="next">下一镜 ▶</button>
  <button id="play">▶ 自动走片</button>
  <span>速度</span><button class="spd" data-s="2">2×</button><button class="spd" data-s="4">4×</button><button class="spd" data-s="8">8×</button>
  <span id="clock"></span>
</div>
<div class="filmstrip" id="strip"></div>
<div class="chips mono" id="chips"></div>
<div class="note">
  评审口径：只看<b>构图 / 节奏 / 文案</b>，不看画面质量与最终动效（简板占位）。灰阶大图 = 站点真实素材打底镜；SVG 母题 = Remotion 重绘镜（数据镜）。
  反馈请按「镜号 + 感受」给（如"镜 31 生成式封面展开太快"）；时间点也可（片内秒数 × 30 = 帧号，含 120f 片头）。16 帧为抽样，62 镜全量清单见下方 chips（悬停看帧窗与字幕）。
</div>
<script>
const SHOTS = ${JSON.stringify(shotData)};
const STILL_OF = ${JSON.stringify(stills.map((s) => ({ i: s.i, src: s.src })))};
const ACT_TITLES = ${JSON.stringify(ACT_TITLES)};
let cur = ${stills[0]?.i ?? 0}, playing = null, speed = 4;
const $ = (id) => document.getElementById(id);
const stillSrc = (i) => { const s = STILL_OF.find((x) => x.i === i); return s ? s.src : null; };
function render() {
  const s = SHOTS[cur];
  $('img').src = stillSrc(cur) || $('img').src;
  $('slate').innerHTML = '镜 ' + s.id.toUpperCase() + ' · Act ' + s.act + ' ' + (ACT_TITLES[s.act] || '') + ' · ' + s.dur + 'f · ' + s.start + '–' + (s.start + s.dur) + ' · 转场 ' + s.tr;
  $('caption').textContent = s.title;
  $('clock').textContent = Math.floor((s.start) / 30 / 60) + ':' + String(Math.floor((s.start / 30) % 60)).padStart(2, '0');
  document.querySelectorAll('#strip img').forEach((el, k) => el.classList.toggle('on', STILL_OF[k].i === cur));
  document.querySelectorAll('#chips .chip').forEach((el, k) => el.classList.toggle('on', k === cur));
  document.querySelectorAll('#actbar .seg').forEach((el, k) => { const [a0, a1] = actRange(k + 1); el.classList.toggle('on', s.start >= a0 && s.start < a1); });
}
function actRange(a) { const inA = SHOTS.filter((x) => x.act === a); return [inA[0].start, inA[inA.length - 1].start + inA[inA.length - 1].dur]; }
function go(i) { cur = (i + SHOTS.length) % SHOTS.length; render(); }
function tick() { if (!playing) return; go(cur + 1); playing = setTimeout(tick, Math.max(600, (SHOTS[cur].dur / 30) * 1000 / speed)); }
$('prev').onclick = () => go(cur - 1);
$('next').onclick = () => go(cur + 1);
$('play').onclick = () => { if (playing) { clearTimeout(playing); playing = null; $('play').textContent = '▶ 自动走片'; } else { $('play').textContent = '⏸ 暂停'; tick(); } };
document.querySelectorAll('.spd').forEach((b) => b.onclick = () => { speed = Number(b.dataset.s); });
STILL_OF.forEach((s, k) => { const im = new Image(); im.src = s.src; im.onclick = () => go(s.i); $('strip').appendChild(im); });
SHOTS.forEach((s, k) => { const c = document.createElement('span'); c.className = 'chip' + (stillSrc(k) ? ' has' : ''); c.innerHTML = s.id + (stillSrc(k) ? ' <b>·</b>' : ''); c.title = 'Act ' + s.act + ' · ' + s.start + '–' + (s.start + s.dur) + ' (' + (s.dur / 30).toFixed(1) + 's) · ' + s.tr + ' · ' + s.title; c.onclick = () => go(k); $('chips').appendChild(c); });
for (let a = 1; a <= 8; a++) { const [a0, a1] = actRange(a); const seg = document.createElement('div'); seg.className = 'seg'; seg.style.flex = a1 - a0; seg.onclick = () => go(SHOTS.findIndex((x) => x.act === a)); $('actbar').appendChild(seg); const lb = document.createElement('div'); lb.className = 'seg'; lb.style.flex = a1 - a0; lb.textContent = '幕' + a + ' ' + (ACT_TITLES[a] || ''); lb.onclick = () => go(SHOTS.findIndex((x) => x.act === a)); $('actlabel').appendChild(lb); }
render();
</script></body></html>`;

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, html);
console.log(`预览页 → ${outPath}`);
console.log(`抽帧 ${stills.length} 镜（镜中点 +${INTRO}f）：${stills.map((s) => shots[s.i].id).join(' ')}`);
