#!/usr/bin/env node
/**
 * scripts/captions.mjs — 字幕表生成器（v12：跟每一句旁白走）
 *
 * 真源：
 *   videos/zhi-guo-xiang/assets/script-v10.md   台词逐字真源（m01–m62 / f01–f08 / 诗六行）
 *   videos/zhi-guo-xiang/shots-manifest.json    41 镜的镜窗与 inbound 转场
 *   out/voice-v8/cues-v8.json                   旁白实测落点（对象 {id|opening|ending: {start,end}}，秒，正片 0 基）
 *   out/voice-v8/cues-v8-lines.json             opening / ending 两个整段真声的行级切分（16 句，秒，正片 0 基）
 *
 * 产物：
 *   videos/zhi-guo-xiang/shots/caption-cues.ts  Record<string, CaptionCue[]>（一镜 0–4 句）
 *   out/voice-v8/caption-audit-v8.md            对账表 + 问题清单
 *
 * 落点规则（v12）：
 *   一句旁白一条字幕；正片秒 → 镜内帧（`useCurrentFrame()` 在 Sequence 里是镜内帧）：
 *     start = round((cue.start − shot.startFrame/30) × 30) − 2        （比人声早 2f 起）
 *     end   = round((cue.end   − shot.startFrame/30) × 30) + 16        （比人声晚 16f 收）
 *   安全窗：夹到 [inSide + 10, durationFrames − outSide − 10]，
 *           inSide 取**本镜** inbound 的墨洇单侧宽（ink=20 / cut=0），outSide 取**下一镜**的。
 *   最短停留 30f（1.0s）；同镜内两句不许重叠：后句 start ≥ 前句 end + 4，
 *   冲突时先压前句尾巴，压到最短仍撞就把后句整体后挪（都会打印提示）。
 *   旁白跨镜：在该镜边界切成两条（两侧各需 ≥0.2s，否则整句归占比大的一侧，不为 1–2 帧的擦边切碎）。
 *   一镜多句：全部保留、按时间排序——这是 v12 与 v11「一字镜像 / 只跟第一句」的根本区别。
 *
 * 用法：
 *   node scripts/captions.mjs            # 生成 caption-cues.ts + 对账表
 *   node scripts/captions.mjs --check    # 只校验（CI 用），不写任何文件；有问题 exit 1
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync, globSync } from 'node:fs';

const ROOT = new URL('..', import.meta.url).pathname;
const SCRIPT = `${ROOT}videos/zhi-guo-xiang/assets/script-v10.md`;
const MANIFEST = `${ROOT}videos/zhi-guo-xiang/shots-manifest.json`;
const CUES = `${ROOT}out/voice-v8/cues-v8.json`;
const LINES = `${ROOT}out/voice-v8/cues-v8-lines.json`;
const OUT_TS = `${ROOT}videos/zhi-guo-xiang/shots/caption-cues.ts`;
const OUT_AUDIT = `${ROOT}out/voice-v8/caption-audit-v8.md`;
const SHOTS_DIR = `${ROOT}videos/zhi-guo-xiang/shots`;

const args = new Set(process.argv.slice(2));
const CHECK_ONLY = args.has('--check');

const FPS = 30;
const LEAD = 2; // 比人声早 2f 起
const TAIL = 16; // 比人声晚 16f 收
const MIN_DUR = 30; // 最短停留 1.0s
const GAP = 4; // 同镜两句之间至少留 4f
const PAD = 10; // 安全窗内缩
const SIDE = { ink: 20, cut: 0 }; // 与 shots.mjs TRANSITION_SIDE 一致
const SPLIT_MIN = 0.2; // 跨镜切分：两侧各需 ≥0.2s
const CLAMP_TOL = 2; // 夹紧 ≤2f 不算数（就是取整误差）
const LONG_TEXT = 24; // 单句超过这么多汉字要人看（组件在 >18 汉字处折两行）
const LONG_WRAP = 18;

const problems = [];
const warnings = [];
const fail = (msg) => problems.push(msg);
const warn = (msg) => warnings.push(msg);

/* ── 读台词真源 ─────────────────────────────────────────────────────── */
const src = readFileSync(SCRIPT, 'utf8');
const texts = new Map();
for (const m of src.matchAll(/^\| (m\d{2}) \| (.+?) \|$/gm)) texts.set(m[1], m[2].trim());
for (const m of src.matchAll(/^\| (f\d{2}) \| (.+?) \| (?:16|40) \|$/gm)) texts.set(m[1], m[2].trim());
const poemBlock = /诗六行[^\n]*\n\s*\n((?:>[^\n]*\n){6})/.exec(src);
if (!poemBlock) throw new Error('script-v10.md 里找不到「诗六行」那一段（六行 > 引用）');
const poem = poemBlock[1].split('\n').map((l) => l.replace(/^>\s*/, '').trim()).filter(Boolean);
if (poem.length !== 6) throw new Error(`诗六行只读到 ${poem.length} 行`);
poem.forEach((line, i) => texts.set(`poem-${i + 1}`, line));

const hanzi = (s) => (s.match(/[\u4e00-\u9fff]/g) ?? []).length;
const charCount = (s) => s.replace(/[，。：；、！？—…「」《》\s]/g, '').length;
const norm = (s) => s.replace(/[^\u4e00-\u9fff]/g, '');

/* ── 读镜窗 ─────────────────────────────────────────────────────────── */
if (!existsSync(MANIFEST)) { console.error('✗ 缺 shots-manifest.json'); process.exit(1); }
const manifest = JSON.parse(readFileSync(MANIFEST, 'utf8'));
const shots = manifest.shots.map((s, i) => ({
  ...s,
  startSec: s.startFrame / FPS,
  endSec: (s.startFrame + s.durationFrames) / FPS,
  next: manifest.shots[i + 1],
  inSide: SIDE[s.transition] ?? 0,
  outSide: SIDE[manifest.shots[i + 1]?.transition] ?? 0,
}));

/* ── 读旁白落点 ─────────────────────────────────────────────────────── */
if (!existsSync(CUES)) { console.error(`✗ 缺 ${CUES}（旁白实测落点）`); process.exit(1); }
const raw = JSON.parse(readFileSync(CUES, 'utf8'));
if (Array.isArray(raw)) { console.error('✗ cues-v8.json 是对象（{id: {start,end}}），不是数组'); process.exit(1); }
for (const [id, v] of Object.entries(raw)) {
  if (typeof v?.start !== 'number' || typeof v?.end !== 'number') fail(`cues-v8.json 的 ${id} 缺 start/end`);
  else if (v.end <= v.start) fail(`cues-v8.json 的 ${id} end ≤ start`);
}

let linesFile = null;
if (existsSync(LINES)) {
  const rows = JSON.parse(readFileSync(LINES, 'utf8'));
  if (!Array.isArray(rows)) throw new Error('cues-v8-lines.json 不是数组');
  linesFile = new Map(rows.map((r) => [r.id, r]));
} else {
  warn('缺 out/voice-v8/cues-v8-lines.json —— opening / ending 退化为字数加权的兜底分配');
}

/** 整段真声里的一句话：优先行级切分，没有就按字数在整段窗口里加权分配 */
const paragraph = (key, ids) => {
  const win = raw[key];
  if (!win) { for (const id of ids) fail(`cues-v8.json 缺整段 ${key}，${id} 没有落点`); return []; }
  if (ids.every((id) => linesFile?.has(id))) {
    return ids.map((id) => {
      const r = linesFile.get(id);
      if (r.text && texts.has(id) && r.text.trim() !== texts.get(id)) warn(`${id} 行级切分文件里的文案与 script-v10.md 不一致，以 script 为准`);
      return { id, start: r.start, end: r.end, method: 'vad' };
    });
  }
  const total = ids.reduce((a, id) => a + charCount(texts.get(id) ?? ''), 0);
  const span = win.end - win.start;
  let acc = win.start;
  return ids.map((id) => {
    const share = (charCount(texts.get(id) ?? '') / total) * span;
    const row = { id, start: Math.round(acc * 1000) / 1000, end: Math.round((acc + share) * 1000) / 1000, method: 'weighted' };
    acc += share;
    return row;
  });
};

const lines = [];
const pushLine = (row) => {
  const text = texts.get(row.id);
  if (!text) fail(`script-v10.md 里没有 ${row.id} 的台词`);
  lines.push({ ...row, text: text ?? '' });
};
for (const row of paragraph('opening', ['m01', 'm02', 'm03', 'm04', 'm05', 'm06', 'm07'])) pushLine(row);
for (const id of [...texts.keys()]) {
  if (/^(m0[1-7]|m5[4-9]|m6[0-2])$/.test(id)) continue; // opening / ending 段落已处理
  const v = raw[id];
  if (!v) { fail(`cues-v8.json 缺 ${id} 的落点`); continue; }
  pushLine({ id, start: v.start, end: v.end, method: 'cue' });
}
for (const row of paragraph('ending', ['m54', 'm55', 'm56', 'm57', 'm58', 'm59', 'm60', 'm61', 'm62'])) pushLine(row);
lines.sort((a, b) => a.start - b.start);

/* ── 逐句落镜 ───────────────────────────────────────────────────────── */
const perShot = new Map(shots.map((s) => [s.id, []]));
const coverage = new Map(lines.map((l) => [l.id, 0]));
const splitPieces = new Map(); // 句 id → 被切成几条（跨镜）

for (const line of lines) {
  const hits = shots.filter((s) => Math.min(line.end, s.endSec) - Math.max(line.start, s.startSec) > 0.001);
  if (!hits.length) { fail(`${line.id} 落在所有镜窗之外（${line.start}–${line.end}s）`); continue; }
  let pieces;
  if (hits.length === 1) {
    pieces = [{ shot: hits[0], from: line.start, to: line.end }];
  } else {
    const overlaps = hits.map((s) => ({ s, ov: Math.min(line.end, s.endSec) - Math.max(line.start, s.startSec) }));
    const big = overlaps.filter((o) => o.ov >= SPLIT_MIN);
    if (big.length <= 1) {
      const pick = overlaps.reduce((a, b) => (b.ov > a.ov ? b : a));
      pieces = [{ shot: pick.s, from: line.start, to: line.end }];
      warn(`${line.id} 跨 ${hits.map((h) => h.id).join('/')}，但擦边部分 <${SPLIT_MIN}s，整句归 ${pick.s.id}`);
    } else {
      pieces = big.map(({ s }) => ({ shot: s, from: Math.max(line.start, s.startSec), to: Math.min(line.end, s.endSec) }));
    }
  }
  splitPieces.set(line.id, pieces.length);
  for (const p of pieces) {
    coverage.set(line.id, (coverage.get(line.id) ?? 0) + 1);
    const s = p.shot;
    const dur = s.durationFrames;
    const lo = s.inSide + PAD;
    const hi = dur - s.outSide - PAD;
    const rawStart = Math.round((p.from - s.startSec) * FPS) - LEAD;
    const rawEnd = Math.round((p.to - s.startSec) * FPS) + TAIL;
    let start = Math.max(rawStart, lo);
    let end = Math.min(rawEnd, hi);
    let squeezed = false;
    if (end - start < MIN_DUR) {
      squeezed = true;
      end = Math.min(start + MIN_DUR, hi);
      if (end - start < MIN_DUR) start = Math.max(Math.min(start, end - MIN_DUR), lo);
      if (end - start < MIN_DUR) fail(`${s.id}/${line.id} 安全窗只剩 ${end - start}f（<${MIN_DUR}f），字幕塞不下`);
    }
    perShot.get(s.id).push({
      id: line.id,
      text: line.text,
      start,
      end,
      rawStart,
      rawEnd,
      safeStart: Math.max(rawStart, lo),
      winLost: Math.max(0, Math.max(rawStart, lo) - rawStart), // 安全窗吃掉的
      push: 0, // 同镜去重叠后挪的
      headLost: Math.max(0, start - rawStart),
      tailLost: Math.max(0, rawEnd - end),
      squeezed,
      pushed: false,
      continued: p.from > line.start + 1e-6,
      carriesOver: p.to < line.end - 1e-6,
    });
  }
}

/* ── 同镜去重叠 ─────────────────────────────────────────────────────── */
for (const s of shots) {
  const cues = perShot.get(s.id);
  if (!cues.length) continue;
  cues.sort((a, b) => a.start - b.start || a.end - b.end);
  const hi = s.durationFrames - s.outSide - PAD;
  for (let i = 1; i < cues.length; i += 1) {
    const prev = cues[i - 1];
    const cur = cues[i];
    if (cur.start >= prev.end + GAP) continue;
    const want = cur.start - GAP;
    if (want - prev.start >= MIN_DUR) {
      const trimmed = prev.end - want;
      prev.end = want;
      prev.tailLost += trimmed;
      // 正常情况：+16 收尾本来就压到下一句头上，只有压得狠了才值得说
      if (prev.end - prev.start < 45 || trimmed > 24) {
        warn(`${s.id}：${prev.id} 尾巴与 ${cur.id} 起点撞，前句收到 ${prev.end}f（${prev.end - prev.start}f 长，删尾 ${trimmed}f）`);
      }
    } else if (prev.start + MIN_DUR + GAP <= hi) {
      const nextStart = prev.start + MIN_DUR + GAP;
      warn(`${s.id}：${prev.id} 已压到最短仍撞 ${cur.id}，后句整体后挪 ${nextStart - cur.start}f`);
      cur.start = nextStart;
      cur.end = Math.min(Math.max(cur.end, cur.start + MIN_DUR), hi);
      cur.pushed = true;
      cur.push = cur.start - cur.safeStart;
      cur.headLost = Math.max(0, cur.start - cur.rawStart);
      if (cur.end - cur.start < MIN_DUR) warn(`${s.id}：${cur.id} 后挪之后只剩 ${cur.end - cur.start}f（<${MIN_DUR}f）`);
      prev.end = cur.start - GAP;
    } else {
      fail(`${s.id}：${prev.id} 与 ${cur.id} 在 ${s.durationFrames}f 的镜里挤不下（安全窗 ${s.inSide + PAD}–${hi}）`);
    }
  }
  for (let i = 1; i < cues.length; i += 1) {
    if (cues[i].start < cues[i - 1].end + GAP) fail(`${s.id}：${cues[i - 1].id}/${cues[i].id} 仍重叠`);
  }
  for (const c of cues) {
    if (!Number.isInteger(c.start) || !Number.isInteger(c.end)) fail(`${s.id}/${c.id} 帧号不是整数`);
    if (c.start < 0 || c.end > s.durationFrames) fail(`${s.id}/${c.id} 越出镜窗 [0,${s.durationFrames}]`);
  }
}

/* ── 覆盖率 / 文案长度 ─────────────────────────────────────────────── */
const missingLines = [...coverage].filter(([, n]) => n === 0).map(([id]) => id);
if (missingLines.length) fail(`这些旁白没落进任何字幕：${missingLines.join(', ')}`);
const coveredShots = shots.filter((s) => perShot.get(s.id).length > 0);
const totalCues = shots.reduce((a, s) => a + perShot.get(s.id).length, 0);
const longTexts = lines.filter((l) => hanzi(l.text) > LONG_TEXT);
const splitLines = lines.filter((l) => splitPieces.get(l.id) > 1);
const startClampedCues = shots.flatMap((s) => perShot.get(s.id).filter((c) => c.winLost > CLAMP_TOL));
const pushedCues = shots.flatMap((s) => perShot.get(s.id).filter((c) => c.push > CLAMP_TOL));

/* ── 镜窗 vs 旁白：漂移诊断（只诊断，不改落点） ─────────────────────── */
/** 按分镜剧本的意思，这句本该在哪个镜（镜 title 里含这句的前 6 个汉字） */
const intendedShot = new Map();
for (const l of lines) {
  const key = norm(l.text).slice(0, 6);
  if (!key) continue;
  // 同一句可能在两个镜的 title 里出现（例如两处「念念。」）——取时间上最近的那个
  const cands = shots.filter((s) => norm(s.title ?? '').includes(key));
  if (!cands.length) continue;
  const mid = (l.start + l.end) / 2;
  const near = cands.reduce((a, b) => {
    const da = Math.abs((a.startSec + a.endSec) / 2 - mid);
    const db = Math.abs((b.startSec + b.endSec) / 2 - mid);
    return db < da ? b : a;
  });
  intendedShot.set(l.id, near.id);
}
/** 音轨实际落的镜 = 重叠最多的那一镜 */
const landedShot = (l) => shots.reduce((best, s) => {
  const ov = Math.min(l.end, s.endSec) - Math.max(l.start, s.startSec);
  return ov > (best.ov ?? -1) ? { s, ov } : best;
}, { s: null, ov: -1 }).s;
const driftRows = [];
for (const l of lines) {
  const want = intendedShot.get(l.id);
  if (!want) continue;
  const got = landedShot(l);
  if (!got || got.id === want) continue;
  const w = shots.find((s) => s.id === want);
  driftRows.push({ id: l.id, want, got: got.id, delta: +(l.start - w.startSec).toFixed(2) });
}
const driftShots = [...new Set(driftRows.map((d) => d.got))];
const matchedLines = lines.filter((l) => intendedShot.has(l.id)).length;

/** 每幕的旁白填充情况：开口偏移 + 幕尾剩余 */
const actRows = (manifest.acts ?? []).map((a) => {
  const t0 = a.startFrame / FPS;
  const t1 = a.endFrame / FPS;
  const inner = lines.filter((l) => l.start >= t0 - 1 && l.start < t1);
  if (!inner.length) return { act: a.act, title: a.title, empty: true };
  const first = inner[0];
  const last = inner[inner.length - 1];
  return {
    act: a.act,
    title: a.title,
    t0,
    t1,
    first: first.id,
    open: +(first.start - t0).toFixed(2),
    lastId: last.id,
    lastEnd: +last.end.toFixed(2),
    tail: +(t1 - last.end).toFixed(2),
    n: inner.length,
  };
});

/* ── 镜头文件里有没有 <Caption cue=…>（只报告，不修改） ─────────────── */
const captionFiles = new Set();
for (const f of globSync(`${SHOTS_DIR}/s*.tsx`)) {
  if (/<Caption\b/.test(readFileSync(f, 'utf8'))) captionFiles.add(/(s\d{2})\.tsx$/.exec(f)?.[1] ?? '');
}
const noCaptionMount = shots.filter((s) => !captionFiles.has(s.id)).map((s) => s.id);
const mountedButSilent = coveredShots.filter((s) => !captionFiles.has(s.id)).map((s) => s.id);

/* ── 打印摘要 ───────────────────────────────────────────────────────── */
const pad = (v, n) => String(v).padEnd(n);
console.log(`${pad('镜', 5)}${pad('起', 6)}${pad('止', 6)}${pad('时长', 7)}${pad('句', 7)}文案`);
for (const s of shots) {
  const cues = perShot.get(s.id);
  if (!cues.length) { console.log(`${pad(s.id, 5)}—（本镜无旁白）`); continue; }
  cues.forEach((c, i) => {
    const flags = `${c.startClamped ? '起夹 ' : ''}${c.endClamped ? '止夹 ' : ''}${c.continued ? '接前镜 ' : ''}${c.carriesOver ? '延下镜' : ''}`.trim();
    console.log(
      `${pad(i === 0 ? s.id : '', 5)}${pad(c.start, 6)}${pad(c.end, 6)}${pad(`${c.end - c.start}f`, 7)}${pad(c.id, 7)}${c.text}${flags ? `  [${flags}]` : ''}`,
    );
  });
}
console.log(`\n共 ${totalCues} 条字幕 / ${coveredShots.length} 镜有字幕 / ${shots.length - coveredShots.length} 镜无旁白（${shots.filter((s) => !perShot.get(s.id).length).map((s) => s.id).join(', ') || '无'}）`);
const head10 = startClampedCues.filter((c) => c.headLost > 10);
console.log(`起点被安全窗夹（>${CLAMP_TOL}f）：${startClampedCues.length} 条，其中 >10f 的 ${head10.length} 条（见 §4.1）；被后句挤后挪：${pushedCues.length} 条`);
if (driftRows.length) {
  console.log(`\n⚠ 音轨落点与分镜剧本对不上：${driftRows.length} 句（${driftRows.map((d) => `${d.id} 本该 ${d.want} 落在 ${d.got}`).join('；')}）`);
}
if (warnings.length) { console.log('\n提示：'); for (const w of warnings) console.log(`  · ${w}`); }
if (problems.length) { console.log('\n问题：'); for (const p of problems) console.log(`  ✗ ${p}`); }

/* ── 写 caption-cues.ts ─────────────────────────────────────────────── */
const tsBody = shots
  .filter((s) => perShot.get(s.id).length)
  .map((s) => {
    const items = perShot.get(s.id).map((c) => `    { text: ${JSON.stringify(c.text)}, start: ${c.start}, end: ${c.end} },`).join('\n');
    return `  ${s.id}: [\n${items}\n  ],`;
  })
  .join('\n');

const ts = `/* 自动生成，勿手改：node scripts/captions.mjs
 *
 * v12：字幕跟**每一句旁白**走，一镜 0–4 条。
 * 真源：script-v10.md（台词逐字）× out/voice-v8/cues-v8.json（实测落点）
 *       × out/voice-v8/cues-v8-lines.json（opening / ending 两个整段真声的行级切分）
 * 落点：镜内帧 = round((旁白秒 − 本镜起点秒) × 30) − 2 … + 16；
 *       夹在 [本镜墨洇 inSide + 10, 镜长 − 下一镜 inSide − 10] 里，最短 30f，同镜两句间隔 ≥4f。
 * 组件按 useCurrentFrame() 挑当前活跃的一条，所以这里存数组。
 */
export type CaptionCue = { text: string; start: number; end: number };

export const CAPTION_CUES: Record<string, CaptionCue[]> = {
${tsBody}
};
`;

if (CHECK_ONLY) {
  if (problems.length) {
    console.error(`\n✗ 字幕校验未通过（${problems.length} 项）`);
    process.exitCode = 1;
  } else {
    console.log('\n✓ 字幕校验通过');
  }
  process.exit(process.exitCode ?? 0);
}

mkdirSync(`${ROOT}out/voice-v8`, { recursive: true });
writeFileSync(OUT_TS, ts);
console.log(`\n✓ 写出 ${OUT_TS}`);

/* ── 写对账表 ───────────────────────────────────────────────────────── */
const rateOf = (l) => charCount(l.text) / (l.end - l.start);
const knownRates = lines.filter((l) => l.method === 'cue' && l.end - l.start > 0.5).map(rateOf).sort((a, b) => a - b);
const medianRate = knownRates[Math.floor(knownRates.length / 2)];
const realVoice = lines.filter((l) => l.method === 'vad' || l.method === 'weighted');

const md = [];
md.push('# caption-audit-v8 · 字幕对账表（v12：跟每一句旁白走）');
md.push('');
md.push(`> 生成：\`node scripts/captions.mjs\` · ${shots.length} 镜 / ${coveredShots.length} 镜有字幕 / ${totalCues} 条字幕 / ${lines.length} 句旁白`);
md.push('> 落点：镜内帧 = round((旁白秒 − 本镜起点秒) × 30) − 2 … + 16；夹在 [inSide+10, 镜长−outSide−10]，最短 30f，同镜两句间隔 ≥4f');
md.push('');
md.push('## 一 · 总账');
md.push('');
md.push('| 项 | 值 |');
md.push('| --- | --- |');
md.push(`| 旁白句数 | ${lines.length}（男 ${lines.filter((l) => l.id.startsWith('m')).length} / 女 ${lines.filter((l) => l.id.startsWith('f')).length} / 诗 ${lines.filter((l) => l.id.startsWith('poem')).length}） |`);
md.push(`| 生成字幕条数 | ${totalCues}（一镜多句 / 跨镜切分导致条数 > 句数） |`);
md.push(`| 有字幕的镜头 | ${coveredShots.length} / ${shots.length}（无旁白：${shots.filter((s) => !perShot.get(s.id).length).map((s) => s.id).join(', ') || '无'}） |`);
md.push(`| 跨镜被切分的句子 | ${splitLines.length ? splitLines.map((l) => `${l.id}×${splitPieces.get(l.id)}`).join(' · ') : '无'} |`);
md.push(`| 起点被安全窗夹（>${CLAMP_TOL}f） | ${startClampedCues.length} 条（其中跨镜碎片 ${startClampedCues.filter((c) => c.continued).length} 条，正常；非碎片的 ${startClampedCues.filter((c) => !c.continued).length} 条见 §4.1） |`);
md.push(`| 因同镜挤而被后挪 | ${pushedCues.length} 条 |`);
md.push(`| 终点被夹（>${CLAMP_TOL}f） | ${shots.flatMap((s) => perShot.get(s.id)).filter((c) => c.tailLost > CLAMP_TOL).length} 条 |`);
md.push(`| 靠最短停留 30f 撑住 | ${shots.flatMap((s) => perShot.get(s.id)).filter((c) => c.squeezed).length} 条 |`);
md.push(`| 文案 >${LONG_TEXT} 汉字 | ${longTexts.length ? longTexts.map((l) => `${l.id}(${hanzi(l.text)})`).join(' ') : '无'} |`);
md.push(`| 文案 >${LONG_WRAP} 汉字（组件折两行） | ${lines.filter((l) => hanzi(l.text) > LONG_WRAP).length} 句 |`);
md.push('');
md.push('## 二 · 真声段（opening / ending）行级切分核对');
md.push('');
md.push('这两段是**一次录完/一次合成**的，逐句时间由 `out/voice-v8/split-real-voice.mjs` 切出：');
md.push('能量包络→静音段（-40dB/≥120ms）→ 气口组合并（<320ms 且一侧 <0.4s）→ 穷举分配使每句「字/秒」最一致；');
md.push('再用归一化互相关把 wav 对齐到正片音轨 `voice-track-v8.wav`（opening r=1.000 @0.236s / ending r=1.000 @266.576s）。');
md.push('');
md.push(`参照：全片 ${knownRates.length} 条单句旁白的中位语速 **${medianRate.toFixed(2)} 字/s**（区间 ${knownRates[0].toFixed(2)}–${knownRates[knownRates.length - 1].toFixed(2)}）。`);
md.push('');
md.push('| 句 | 起(s) | 止(s) | 实测时长 | 字数 | 实测字/s | 按中位语速估 | 偏差 | 判定 |');
md.push('| --- | --- | --- | --- | --- | --- | --- | --- | --- |');
for (const l of realVoice) {
  const c = charCount(l.text);
  const dur = l.end - l.start;
  const rate = c / dur;
  const est = c / medianRate;
  const dev = rate / medianRate - 1;
  const short = c <= 3;
  const verdict = short ? '短句（天然偏快）' : Math.abs(dev) <= 0.25 ? '好' : Math.abs(dev) <= 0.45 ? '偏' : '存疑';
  md.push(`| ${l.id} | ${l.start.toFixed(3)} | ${l.end.toFixed(3)} | ${dur.toFixed(2)}s | ${c} | ${rate.toFixed(2)} | ${est.toFixed(2)}s | ${dev >= 0 ? '+' : ''}${(dev * 100).toFixed(0)}% | ${verdict} |`);
}
const devOf = (l) => Math.abs(charCount(l.text) / (l.end - l.start) / medianRate - 1);
const devs = realVoice.map((l) => ({ l, dev: devOf(l), short: charCount(l.text) <= 3 }));
const okCnt = devs.filter((d) => d.dev <= 0.25).length;
const midCnt = devs.filter((d) => d.dev > 0.25 && d.dev <= 0.45).length;
const badCnt = devs.filter((d) => d.dev > 0.45).length;
md.push('');
md.push('**可信度**：16 句里偏差 ≤25% 的 ' + okCnt + ' 句，25–45% 的 ' + midCnt + ' 句，>45% 的 ' + badCnt + ' 句（其中 3 句是 2–3 字短句，单句太短、天然偏快，可不看）。');
md.push('');
md.push('- **ending（9 句）可信**：14 个气口组和 9 句基本 1:1，长句 3.1–5.1 字/s，句边界都落在 ≥0.5s 的长停顿上。');
md.push('- **opening（7 句）前 4 句稳**（m02–m04 偏差 ≤12%，m01「念念。」是 2 字短句），**后 3 句有歧义**：19.6–27s 这段里「我盯着看了很久，半天没回你。／太巧了。／巧得我差点以为，你知道了。」有两条同样合理的切法。');
md.push('  选的是「14.97–19.62 / 20.74–22.60 / 22.85–26.27」（偏差 −34% / −54% / −18%）；另一条是 18.28 处断（+42% / −19% / −45%），两条的总偏差几乎一样。');
md.push('  **建议人耳复核 19–27s**；要改只改 `out/voice-v8/cues-v8-lines.json` 里 m05/m06/m07 三条，重跑脚本即可。');
md.push('');
md.push('## 三 · 逐镜对账表');
md.push('');
md.push('| 镜 | 句 | 起(f) | 止(f) | 时长 | 秒 | 起点夹紧 | 跨镜 | 文案 |');
md.push('| --- | --- | --- | --- | --- | --- | --- | --- | --- |');
for (const s of shots) {
  const cues = perShot.get(s.id);
  if (!cues.length) { md.push(`| ${s.id} | — | — | — | — | — | — | — | （本镜无旁白） |`); continue; }
  for (const c of cues) {
    const cross = c.continued ? '接前镜' : c.carriesOver ? '延下镜' : '';
    const lost = c.winLost > CLAMP_TOL ? `⚠−${c.winLost}f` : c.push > CLAMP_TOL ? `后挪${c.push}f` : '';
    md.push(`| ${s.id} | ${c.id} | ${c.start} | ${c.end} | ${c.end - c.start}f | ${((c.end - c.start) / FPS).toFixed(2)}s | ${lost} | ${cross} | ${c.text} |`);
  }
}
md.push('');
md.push('## 四 · 问题与需要人拍板的地方');
md.push('');
if (!problems.length) md.push('- 校验项：无致命问题（每句旁白都落进了至少一条字幕，无重叠、无越界）。');
for (const p of problems) md.push(`- ✗ **${p}**`);
for (const w of warnings) md.push(`- · ${w}`);
md.push('');
md.push('### 4.1 「塞不下 / 靠夹紧 / 文案超长」');
md.push('');
// 跨镜「接前镜」碎片天然从 0 帧起，一定会被 lo 顶住；那不是「字幕晚了」，单列
const freshClamp = startClampedCues.filter((c) => !c.continued).sort((a, b) => b.winLost - a.winLost);
const hardClamp = freshClamp.slice(0, 12);
if (hardClamp.length) {
  md.push(`起点被安全窗（inSide+10）夹掉最多的条目（共 ${freshClamp.length} 条，不含跨镜碎片）——这类是「人声已经开口、字幕还没上来」，需要人耳确认能不能接受：`);
  md.push('');
  md.push('| 镜 | 句 | 字幕起(f) | 丢掉 | 本镜转场 | 说明 |');
  md.push('| --- | --- | --- | --- | --- | --- |');
  for (const c of hardClamp) {
    const shot = shots.find((s) => perShot.get(s.id).includes(c));
    const why = shot?.inSide ? `本镜入「墨洇」，前 ${shot.inSide}f 是转场、不能上字，字幕最早 ${shot.inSide + PAD}f` : `本镜硬切，字幕最早 ${PAD}f`;
    md.push(`| ${shot?.id} | ${c.id} | ${c.start} | ${c.winLost}f (${(c.winLost / FPS).toFixed(2)}s) | ${shot?.transition} (inSide ${shot?.inSide}f) | ${why} |`);
  }
} else md.push('- 无。');
md.push('');
const squeezedReal = shots
  .map((s) => ({ s, cues: perShot.get(s.id).filter((c) => c.squeezed && !c.continued) }))
  .filter(({ cues }) => cues.length)
  .map(({ s, cues }) => `- **${s.id}**：${cues.map((c) => `${c.id} ${c.end - c.start}f`).join(' · ')}`);
const squeezedFrag = shots
  .map((s) => ({ s, cues: perShot.get(s.id).filter((c) => c.squeezed && c.continued) }))
  .filter(({ cues }) => cues.length)
  .map(({ s, cues }) => `${s.id}(${cues.map((c) => c.id).join('/')})`);
md.push('靠最短停留 30f 撑住的原句（旁白本身就短于 1s）：');
md.push('');
md.push(...(squeezedReal.length ? squeezedReal : ['- 无。']));
md.push('');
if (squeezedFrag.length) {
  md.push(`跨镜残片被撑到 30f 的（只活 1s 的「续前镜」尾巴，正常现象）：${squeezedFrag.join('、')}`);
  md.push('');
}
md.push('');
const packed = shots
  .filter((s) => perShot.get(s.id).some((c) => c.push > CLAMP_TOL || c.squeezed))
  .map((s) => `- **${s.id}**：${perShot.get(s.id).length} 句挤在 ${s.durationFrames}f 里，${perShot.get(s.id).filter((c) => c.push > CLAMP_TOL || c.squeezed).map((c) => `${c.id}(${c.push > 0 ? `后挪${c.push}f` : `仅${c.end - c.start}f`})`).join(' · ')}`);
if (packed.length) { md.push('一镜多句把安全窗挤满、必须靠压缩/后挪才排得下的：'); md.push(''); md.push(...packed); md.push(''); }
if (longTexts.length) {
  md.push(`文案 >${LONG_TEXT} 汉字的句子（一行放不下，组件会折两行）：`);
  md.push('');
  for (const l of longTexts) md.push(`- ${l.id}（${hanzi(l.text)} 字）：${l.text}`);
  md.push('');
}
md.push('### 4.2 ⚠ 音轨是按「幕」铺的，不是按「镜」铺的（这不是字幕的问题，但会让人以为是）');
md.push('');
md.push('**证据 A：每一幕都从幕起点 +0.50s 开口，幕尾留一大截空。**');
md.push('');
md.push('| 幕 | 幕窗 | 句数 | 首句 | 开口偏移 | 末句 | 末句结束 | 幕尾余量 |');
md.push('| --- | --- | --- | --- | --- | --- | --- | --- |');
for (const a of actRows) {
  if (a.empty) { md.push(`| ${a.act} ${a.title} | — | 0 | — | — | — | — | — |`); continue; }
  md.push(`| ${a.act} ${a.title} | ${a.t0}–${a.t1}s | ${a.n} | ${a.first} | +${a.open}s | ${a.lastId} | ${a.lastEnd}s | ${a.tail}s |`);
}
md.push('');
md.push('**证据 B：能按剧本 `shots[].title` 对上的句子，实测落点与剧本指定的镜对不上。**');
md.push('');
if (!driftRows.length) {
  md.push('- 未发现漂移。');
} else {
  md.push(`剧本 title 里写到的 ${matchedLines} 句，有 **${driftRows.length} 句**音轨落在别的镜里：`);
  md.push('');
  md.push('| 句 | 剧本指定镜 | 音轨实际落镜 | 与指定镜起点的偏差 |');
  md.push('| --- | --- | --- | --- |');
  for (const d of driftRows) md.push(`| ${d.id} | ${d.want} | ${d.got} | ${d.delta >= 0 ? '+' : ''}${d.delta}s |`);
}
md.push('');
md.push('**结论**：`voice-track-v8.wav` 是「幕起点 +0.5s 开始、句间 0.35s 连续往下铺」，铺到幕尾就停（幕尾空 3.8–13.1s），');
md.push('**没有按 41 镜的镜窗逐镜对齐**。后果：幕内每一句都比剧本打算的位置更早，越往后越早（最重 −16s）；');
md.push('于是 s17 / s30 / s31 / s37 这四镜在音轨里是**纯静音**，而剧本标「无旁白」的 s26 反而有 4 句（m41 尾 / m42 / m43 / f08）。');
md.push('字幕只能跟着音轨走（这是对的），但画面对不上旁白是上游问题：**要么按镜窗重排音轨（推荐，字幕脚本会自动跟着重算），要么按音轨重切镜头**。');
md.push(`受影响最重的镜：${driftShots.join(', ')}。`);
md.push('');
md.push('### 4.3 字幕组件挂载情况（只报告，未改镜头文件）');
md.push('');
md.push('> 镜头文件正由另一位同事同时改，这一节是**本次运行时的快照**；重跑脚本即可刷新。');
md.push('');
md.push(`- 已挂 \`<Caption cue="sNN" />\` 的镜（${captionFiles.size}/${shots.length}）：${[...captionFiles].filter(Boolean).sort().join(', ') || '无'}`);
md.push(`- **有字幕但镜头文件里没挂载**：${mountedButSilent.length ? mountedButSilent.join(', ') : '无'}`);
md.push(`- 所有没挂载的镜：${noCaptionMount.length ? noCaptionMount.join(', ') : '无'}`);
if (noCaptionMount.includes('s26')) {
  md.push('');
  md.push('注：s26 的镜头头注释写着「本镜无字幕」，但**音轨在 185–192s 有 4 句旁白**（m41 尾 / m42 / m43 / f08）——');
  md.push('这是 §4.2 那条漂移的后果。若音轨按镜窗重排，s26 会自然变空，无需改镜头。');
}
md.push('');
md.push('### 4.4 组件行为（v12）');
md.push('');
md.push('- `Caption.tsx` 接受 `CaptionCue[]`：按 `useCurrentFrame()` 选当前活跃的一条，一条没赶上就返回 null。');
md.push(`- 文案 >${LONG_WRAP} 汉字自动折两行（\`whiteSpace: normal\` / \`maxWidth 1560\` / 居中），短句仍 \`nowrap\` 单行。`);
md.push('- 老写法 `<Caption text start end />`、`tone="paper"|"ink"`、`bottom=110`、10f 淡入 + 2px 上浮 + 12f 淡出全部保留。');
md.push('- 诗六行用 `script-v10.md` 的原字，标点未改。');
md.push('');
md.push('### 4.5 怎么重跑');
md.push('');
md.push('```bash');
md.push('node out/voice-v8/split-real-voice.mjs --write   # 只有 opening/ending 重新录了才需要');
md.push('node scripts/captions.mjs                        # 重算 caption-cues.ts + 本表');
md.push('node scripts/captions.mjs --check                # CI：只校验，不写文件');
md.push('```');
md.push('');
md.push('旁白落点更新后改 `out/voice-v8/cues-v8.json`；opening/ending 的 16 句行级时间在 `out/voice-v8/cues-v8-lines.json`。');
md.push('');
writeFileSync(OUT_AUDIT, `${md.join('\n')}\n`);
console.log(`✓ 写出 ${OUT_AUDIT}`);

if (problems.length) process.exitCode = 1;