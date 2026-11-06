#!/usr/bin/env node
/**
 * scripts/captions.mjs — 字幕表生成器（design-v11 §一）
 *
 * 输入：
 *   videos/preprod-zhi-guo-xiang/assets/storyboard.md   字幕文案真源（第 5 列）
 *   videos/zhi-guo-xiang/shots-manifest.json            镜头窗口 + 转场
 *   out/voice/cues-v7.json                              旁白实测落点 [{id,voice,text,start,end}]（秒，绝对）
 * 输出：
 *   videos/zhi-guo-xiang/shots/caption-cues.ts          每镜的字幕 {text,start,end}
 *
 * 规则（design-v11 §1.2）：
 *   - 字幕落点由旁白反推：start = 所在旁白 start − 2f，end = 旁白 end + 18f（收字比人声晚）
 *   - 安全窗夹紧：start ≥ inSide + 12，end ≤ duration − outSide − 12（inSide/outSide 取本镜 inbound/下一镜 inbound）
 *   - 无旁白的镜头若仍有字幕：退化为 inSide+14 → duration−outSide−20
 *   - 字幕只有下限长度 36f（1.2s），短于该值就向下扩，扩不动再报警
 *
 * 用法：
 *   node scripts/captions.mjs              # 生成 caption-cues.ts（并打印对账表）
 *   node scripts/captions.mjs --sweep      # 额外把各镜 <Caption .../> 改成 <Caption cue="sNN" tone=…>
 *   node scripts/captions.mjs --check       # 只校验，不写文件（CI 用）
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { globSync } from 'node:fs';

const ROOT = new URL('..', import.meta.url).pathname;
const STORYBOARD = `${ROOT}videos/preprod-zhi-guo-xiang/assets/storyboard.md`;
const MANIFEST = `${ROOT}videos/zhi-guo-xiang/shots-manifest.json`;
const CUES = `${ROOT}out/voice/cues-v7.json`;
const OUT = `${ROOT}videos/zhi-guo-xiang/shots/caption-cues.ts`;

const args = new Set(process.argv.slice(2));
const SWEEP = args.has('--sweep');
const CHECK_ONLY = args.has('--check');

const FPS = 30;
const INTRO = 120; // 片头帧数：正片第 0 帧 = 绝对 120 帧
const LEAD = 2; // 字幕比人声早起 2f
const TAIL = 18; // 字幕比人声晚收 18f
const MIN_DUR = 36; // 最短停留 1.2s

const fail = (msg) => {
  console.error(`✗ ${msg}`);
  process.exitCode = 1;
};

/* ── 读分镜：字幕文案 ───────────────────────────────────────────────── */
const shotsMeta = new Map();
for (const line of readFileSync(STORYBOARD, 'utf8').split('\n')) {
  const m = /^\| (\d+) \| (\d+)f · [^|]+\|([^|]*)\|([^|]*)\|([^|]*)\|([^|]*)\|/.exec(line);
  if (!m) continue;
  const id = `s${String(m[1]).padStart(2, '0')}`;
  const caption = m[5].trim();
  shotsMeta.set(id, { durationFrames: Number(m[2]), caption: caption === '无' ? null : caption });
}

/* ── 读 manifest：镜头窗口 + 转场 ────────────────────────────────────── */
if (!existsSync(MANIFEST)) {
  fail('缺 shots-manifest.json（先 node scripts/shots.mjs import）');
  process.exit(1);
}
const manifest = JSON.parse(readFileSync(MANIFEST, 'utf8'));
const SIDE = { page: 18, dry: 10, ink: 20, cut: 0 }; // 与 shots.mjs TRANSITION_SIDE 保持一致

let acc = 0;
const shots = manifest.shots.map((s, i) => {
  const row = { ...s, absStartFrame: INTRO + acc, next: manifest.shots[i + 1] };
  acc += s.durationFrames;
  return row;
});

/* ── 读旁白落点 ─────────────────────────────────────────────────────── */
let cues = [];
if (existsSync(CUES)) {
  cues = JSON.parse(readFileSync(CUES, 'utf8'));
  if (!Array.isArray(cues)) throw new Error('cues-v7.json 不是数组');
  cues.forEach((c) => {
    if (typeof c.start !== 'number' || typeof c.end !== 'number') throw new Error(`cues 条目缺 start/end: ${JSON.stringify(c)}`);
    if (c.end <= c.start) throw new Error(`cues 条目 end<=start: ${c.id}`);
  });
  // 诗六行（voice='poem'）是纸上的字本身，不参与字幕锚定：字幕只跟讲述者的人声走
  cues = cues.filter((c) => c.voice !== 'poem');
  cues.sort((a, b) => a.start - b.start);
} else {
  console.warn('! 缺 out/voice/cues-v7.json —— 字幕按「无旁白」退化落点生成（等 audio 交付后重跑）');
}

/* ── 逐镜算字幕窗 ───────────────────────────────────────────────────── */
const rows = [];
const problems = [];
const silent = [];
for (const s of shots) {
  const meta = shotsMeta.get(s.id) ?? {};
  const text = meta.caption ?? null;
  const dur = s.durationFrames;
  const inSide = SIDE[s.transition] ?? 0;
  const outSide = SIDE[s.next?.transition] ?? 0;
  const safeStart = inSide + 12;
  const safeEnd = dur - outSide - 12;
  if (!text) {
    if (s.transition !== 'cut' || s.next?.transition !== 'cut') continue;
    continue;
  }
  const absStart = s.absStartFrame / FPS;
  const absEnd = (s.absStartFrame + dur) / FPS;
  const inside = cues.filter((c) => c.start >= absStart - 0.001 && c.start < absEnd - 0.001);
  let start;
  let end;
  if (inside.length) {
    // 一镜多句旁白时，字幕只跟**第一句**走（跟最后一句会拖到下一次叙事上）
    const first = inside[0];
    start = Math.round((first.start - absStart) * FPS) - LEAD;
    end = Math.round((first.end - absStart) * FPS) + TAIL;
    if (inside.length > 1) problems.push(`${s.id} 一镜 ${inside.length} 句旁白，字幕跟第一句（${first.id}）；文案需人眼确认是否覆盖整段`);
  } else {
    // BGM 站出段的点睛字幕（design-v11 §1.2）：旁白让位，字幕起落跟乐句，比跟人声的字幕停留更久
    start = inSide + 16;
    end = dur - outSide - 24;
    silent.push(s.id);
  }
  start = Math.max(start, safeStart);
  end = Math.min(end, safeEnd);
  if (end - start < MIN_DUR) {
    end = Math.min(start + MIN_DUR, safeEnd);
    start = Math.max(Math.min(start, end - MIN_DUR), safeStart);
    if (end - start < MIN_DUR) problems.push(`${s.id} 安全窗只剩 ${end - start}f(<${MIN_DUR}f)，字幕塞不下：调旁白落点或缩字`);
  }
  rows.push({ id: s.id, text, start, end, dur, inSide, outSide });
}

/* ── 输出对账表 ─────────────────────────────────────────────────────── */
const pad = (v, n) => String(v).padEnd(n);
console.log(`${pad('shot', 6)}${pad('start', 7)}${pad('end', 7)}${pad('dur', 6)}${pad('安全窗', 14)}文案`);
for (const r of rows) {
  console.log(`${pad(r.id, 6)}${pad(r.start, 7)}${pad(r.end, 7)}${pad(r.dur, 6)}${pad(`[${r.inSide + 12},${r.dur - r.outSide - 12}]`, 14)}${r.text}`);
}
if (problems.length) {
  console.log('\n需要注意：');
  for (const p of problems) console.log(`  · ${p}`);
}

if (CHECK_ONLY) {
  if (problems.some((p) => p.includes('塞不下') || p.includes('缺'))) fail('字幕校验未通过');
  process.exit(process.exitCode ?? 0);
}

/* ── 写 caption-cues.ts ─────────────────────────────────────────────── */
const body = rows
  .map((r) => `  ${r.id}: { text: ${JSON.stringify(r.text)}, start: ${r.start}, end: ${r.end} },`)
  .join('\n');
const ts = `/* 自动生成，勿手改：node scripts/captions.mjs
 * 真源：storyboard.md 字幕列 × out/voice/cues-v7.json 旁白实测落点（design-v11 §一）
 * 字幕落点跟人声走，安全窗按墨洇单侧 ${SIDE.ink}f 夹紧。 */
export type CaptionCue = { text: string; start: number; end: number };

export const CAPTION_CUES: Record<string, CaptionCue> = {
${body}
};
`;
writeFileSync(OUT, ts);
console.log(`\n✓ 写出 ${OUT}（${rows.length} 条字幕，其中 BGM 段点睛字幕 ${silent.length} 条：${silent.join('/') || '无'}）`);

/* ── 可选：把各镜写死的 <Caption .../> 换成查表调用 ──────────────────── */
if (SWEEP) {
  const files = globSync(`${ROOT}videos/zhi-guo-xiang/shots/s*.tsx`);
  let n = 0;
  for (const f of files) {
    const id = /(s\d{2})\.tsx$/.exec(f)?.[1];
    if (!id || !rows.some((r) => r.id === id)) continue;
    const src = readFileSync(f, 'utf8');
    if (!/<Caption\b/.test(src)) continue;
    const next = src.replace(/<Caption\b[^/>]*?\/>/gs, (tag) => {
      if (/\bcue=/.test(tag)) return tag;
      const tone = /tone="(\w+)"/.exec(tag)?.[1];
      n += 1;
      return `<Caption cue="${id}"${tone ? ` tone="${tone}"` : ''} />`;
    });
    if (next !== src) writeFileSync(f, next);
  }
  console.log(`✓ sweep：替换 ${n} 处 <Caption> 调用`);
}