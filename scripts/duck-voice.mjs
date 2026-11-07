#!/usr/bin/env node
/**
 * duck-voice.mjs —— 「BGM ducking」可行性与执行工具（不改 mux-bgm.mjs）
 *
 * ⚠️ 过期声明（2026-11-06 · v6）：
 *   本文件里的 `LANDINGS` 是 v9 时期的 21 条**字幕**表，`CONTROL_WINDOWS` 是当时的留白窗。
 *   v5 已删 7 条、移 2 条字幕，v6 又把旁白从 20 段扩到 22 段（a01–a05 / b08 拆 b08a·b08b），
 *   现片只有 **14 条字幕**、**22 段人声**，且 11–23s 早已有 a02–a04 在说话。
 *   → `--mode plan` 的时间预算 / 男声×诗行重叠 / 对照窗三条结论**一条都不能用**；
 *   → 仍有效的是：filter_complex 拓扑、ffmpeg 封装（含本次修复的 stderr 解析）、measure/verify 的取窗口方式。
 *   成片混音请走 `scripts/build-bgm-mix.py`（v6 实测压深表由它逐段检测输出）。
 *   修正记录：`ffQuiet` 原先只回 stdout、而 volumedetect 写 stderr（BUG1，实测 stdout 命中 0 次）→
 *   现改用 spawnSync 同时收 stdout+stderr；`PASS2_OFFSET` 45.46 → 45.45754（零交叉起播，修 click）。
 *
 * 为什么单独一个脚本：mux-bgm.mjs 的口径是「单遍 amix=inputs=3」，不能再叠第二级 amix
 * （已实证：先合 BGM 再叠人声会把音轨截到 143.45s，第二遍 BGM 根本没参与）。
 * 本脚本把 ducking 塞进「同一条 amix=inputs=3」里：对两遍 BGM 各自做侧链压缩，
 * 人声只做 key，最后仍然只有一级 amix——拓扑与已验通的 mux-bgm.mjs 同构。
 *
 * 用法（全部在**有 ffmpeg 的机器**上跑；本仓库环境 ffmpeg 不在 PATH，脚本会明确报缺）：
 *   node scripts/duck-voice.mjs --mode plan                      # 只出参数 + 命令，不碰文件
 *   node scripts/duck-voice.mjs --mode measure --audio aiyi.mp3 --voice voice-track-full.wav
 *   node scripts/duck-voice.mjs --mode render  --film silent.mp4 --audio aiyi.mp3 --voice voice-track-full.wav --out out/a.mkv
 *   node scripts/duck-voice.mjs --mode verify  --dir out/duck     # 量 A/B/C 三份渲染
 *   node scripts/duck-voice.mjs --mode all     ...                # measure → render×3 → verify
 *
 * 三份渲染（verify 的对象，缺一不可）：
 *   A mix.mkv     = ducked BGM + voice          （成片音轨）
 *   B duck.wav    = ducked BGM only（不放人声）  （量「压低后」电平）
 *   C plain.wav   = 未压低 BGM only（只有 volume=0.7）（量「压低前」电平）
 *   压低深度 = C − B（同一个窗口），与人声本身无关，因此不会被 TTS 电平污染。
 *
 * 判据（写死在 RULES 里，可 --strict/--loose 调）：
 *   1) 人声窗口内 BGM ≤ −24 dBFS（硬底线）/ 建议 ≤ −28
 *   2) 人声窗口内 压低深度落在 8–20 dB（小于 8 压不住，大于 20 音乐会塌）
 *   3) 对照静默窗（11–23 / 144–151 / 157–163，人声保证为零）压低深度 ≤ 0.5 dB（不该被压）
 *   4) 窗口末点后 300ms 内恢复：末 100ms 段与 C 的差 ≤ 1.5 dB
 */

import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve, join } from 'node:path';

// ─────────────────────────────────────────────────────────────── 常量：时间轴真源
// 曲位置映射（music.md §七 + script-v9.md §八，两遍不同起播点，别弄混）
const PASS1_START = 4.0;      // 绝对 4.0  ↔ 曲 0
const PASS1_LEN = 139.46;     // 绝对 4.0–143.46 ↔ 曲 0–139.46
const BREAK_START = 143.46;   // 断点静默起
const PASS2_START = 151.0;    // 绝对 151.0 ↔ 曲 45.45754
const PASS2_OFFSET = 45.45754; // 第二遍曲内偏移（零交叉点，修 mux 起播 click）
const PASS2_LEN = 94.0;       // 曲 45.45754–139.46
const FILM_LEN = 245.0;

/** 21 条字幕窗口（script-v9.md §七）；字数只数汉字，标点另计停顿 */
const LANDINGS = [
  { id: 'S01', a: 4.0, b: 11.0, text: '念念，我想给你讲一个故事。' },
  { id: 'S04', a: 23.0, b: 29.0, text: '十六岁那年，她在风陵渡遇见一个人。' },
  { id: 'S05', a: 29.0, b: 34.0, text: '他叫杨过。江湖上叫他神雕侠。' },
  { id: 'S10', a: 58.0, b: 64.0, text: '他留下三枚金针，说可以许三个愿望。' },
  { id: 'S11', a: 64.0, b: 70.0, text: '那一夜，满城烟花是为她放的。' },
  { id: 'S14', a: 83.0, b: 88.0, text: '她不知道。' },
  { id: 'S16', a: 94.0, b: 99.0, text: '后来，她背着剑，走了很多年。' },
  { id: 'S18', a: 106.0, b: 113.0, text: '一个渡口接一个渡口，她在找他。' },
  { id: 'S19', a: 113.0, b: 120.0, text: '有人说，他三天前来过。' },
  { id: 'S20', a: 120.0, b: 126.0, text: '江湖都说，她这一生，误在杨过身上。' },
  { id: 'S22', a: 133.0, b: 138.0, text: '她没有解释。' },
  { id: 'S23', a: 138.0, b: 144.0, text: '峨眉有个郭女侠，等郎等到白了发。' },
  { id: 'S25', a: 151.0, b: 157.0, text: '三个愿望，她用掉了一个。' },
  { id: 'S27', a: 163.0, b: 170.0, text: '十六岁出门，四十岁出家。' },
  { id: 'S28', a: 170.0, b: 177.0, text: '剑收进木匣，再也没有取出来。' },
  { id: 'S30', a: 183.0, b: 189.0, text: '她记得的，是那夜的火光。' },
  { id: 'S31', a: 189.0, b: 195.0, text: '她留下一首诗，写的是十六岁那年的烟花。' },
  { id: 'S35', a: 214.0, b: 220.0, text: '舍不得写完的那一句，她留在了纸的背面。' },
  { id: 'S36', a: 220.0, b: 227.0, text: '很多年后，有人在海边读到这张纸。' },
  { id: 'S37', a: 227.0, b: 234.0, text: '她写完了。' },
  { id: 'S38', a: 234.0, b: 239.0, text: '这个故事，我讲完了，念念~' },
];

/** 现有 8 落点（tts-voiceover-pipeline.md，已定稿 voice-track-full.wav）——用于查「男声 vs 诗行」重叠 */
const POEM_LANDINGS = [
  { id: 'L1', t: 189.0, text: '我走过山时，山不说话' },
  { id: 'L2', t: 191.6, text: '我路过海时，海不说话' },
  { id: 'L3', t: 196.0, text: '小毛驴滴滴答答' },
  { id: 'L4', t: 215.0, text: '大家都说我因为爱着杨过大侠' },
  { id: 'L5', t: 228.5, text: '其实我只是爱上了峨眉山上的云和霞' },
  { id: 'L6', t: 235.0, text: '像极了十六岁那年的烟花' },
];

/** 人声保证为零的对照窗（script-v9.md §七「留白的位置」）——ducking 不该在这里动作 */
const CONTROL_WINDOWS = [
  { id: 'CTL-1', a: 11.0, b: 23.0 },
  { id: 'CTL-2', a: 144.0, b: 151.0 },
  { id: 'CTL-3', a: 157.0, b: 163.0 },
];

const RULES = {
  bgmCeilHard: -24,     // dBFS，硬底线
  bgmCeilSoft: -28,     // dBFS，建议目标
  duckMin: 8,           // dB，低于此压不住
  duckMax: 20,          // dB，高于此音乐会塌
  ctlTolerance: 0.5,    // dB，对照窗允许的误压
  recoverDb: 1.5,       // dB，300ms 内与未压低参考的差
};

// ─────────────────────────────────────────────────────────────── 参数默认（可被实测覆盖）
const DEFAULTS = {
  voiceRmsDb: -18.0,    // 典型 TTS/近讲干声 RMS；measure 模式会用实测替换
  ratio: 8,
  attack: 15,           // ms
  release: 280,         // ms —— 必须 ≤300ms，对应「人声静默 300ms 内恢复」
  knee: 2.5,
  makeup: 1,
  level_sc: 1,          // ★ BUG2 兜底：render 模式不传 --level-sc 时也曾拼出 level_sc=undefined
  targetDepth: 14,      // dB，默认压低量（实测不足时由 recommend() 抬高）
};

// ─────────────────────────────────────────────────────────────── CLI
function parseArgs(argv) {
  const o = { mode: 'plan', strict: false };
  for (let i = 0; i < argv.length; i++) {
    const k = argv[i];
    if (!k.startsWith('--')) continue;
    const name = k.slice(2);
    const next = argv[i + 1];
    if (name === 'strict') { o.strict = true; continue; }
    if (next && !next.startsWith('--')) { o[name] = next; i++; } else { o[name] = true; }
  }
  return o;
}
const opt = parseArgs(process.argv.slice(2));
const need = (k, v) => { if (!v) { console.error(`缺少 --${k}`); process.exit(1); } return v; };

// ─────────────────────────────────────────────────────────────── 时间轴数学
const isHan = (c) => /[\u4e00-\u9fa5]/.test(c);
function hanCount(t) { return [...t].filter(isHan).length; }
function pauseOf(t) {
  const c = (ch) => [...t].filter((x) => x === ch).length;
  return c('，') * 0.2 + c('。') * 0.35 + c('~') * 0.4;
}
/** 估算口播时长：字数/语速 + 标点停顿 */
function estDuration(text, rate = 4.2) { return hanCount(text) / rate + pauseOf(text); }

/** 绝对时间 → 曲内位置；返回 {pass, pos, silent} */
function toScore(t) {
  if (t < PASS1_START) return { pass: 0, pos: null, silent: true };
  if (t < BREAK_START) return { pass: 1, pos: t - PASS1_START, silent: false };
  if (t < PASS2_START) return { pass: 0, pos: null, silent: true };
  return { pass: 2, pos: t - PASS2_START + PASS2_OFFSET, silent: false };
}
/** 曲内位置 → mp3 内的取样区间（两遍都是同一首曲子，只是起播点不同） */
function scoreToMp3([a, b]) {
  const s = toScore(a);
  if (s.silent) return null;
  if (s.pass === 1) return [a - PASS1_START, Math.min(b - PASS1_START, PASS1_LEN)];
  return [a - PASS2_START + PASS2_OFFSET, Math.min(b - PASS2_START + PASS2_OFFSET, PASS2_OFFSET + PASS2_LEN)];
}

// ─────────────────────────────────────────────────────────────── 滤镜图（核心交付物）
/**
 * 生成 filter_complex。variant:
 *   'mix'   → ducked BGM + voice（成片用，一级 amix=3）
 *   'duck'  → 只有 ducked BGM（verify 的 B）
 *   'plain' → 只有未压低 BGM（verify 的 C）
 */
function buildFilter({ variant = 'mix', p = DEFAULTS } = {}) {
  const sc = [
    `threshold=${p.threshold.toFixed(5)}`,
    `ratio=${p.ratio}`,
    `attack=${p.attack}`,
    `release=${p.release}`,
    `knee=${p.knee}`,
    'link=maximum',
    'detection=rms',
    `makeup=${p.makeup}`,
    `level_sc=${p.level_sc}`,
    'mode=downward',
  ].join(':');

  const f = [
    // 第一遍：曲 0–139.46 放在绝对 4.0
    `[1:a]atrim=0:${PASS1_LEN},asetpts=PTS-STARTPTS,afade=t=in:st=0:d=1,volume=0.7[b1]`,
    // 第二遍：曲 45.45754–139.46 放在绝对 151.0（不淡出，落在曲子自己的静默里）
    `[1:a]atrim=${PASS2_OFFSET}:${PASS2_OFFSET + PASS2_LEN},asetpts=PTS-STARTPTS,afade=t=in:st=0:d=1,volume=0.7[b2]`,
  ];

  if (variant === 'plain') {
    f.push(`[b1]adelay=4000|4000[d1]`, `[b2]adelay=151000|151000[d2]`,
      `[d1][d2]amix=inputs=2:duration=longest:dropout_transition=0:normalize=0[a]`);
    return f.join(';');
  }

  // 人声轨：245s 静音底、时长即片长，不再 adelay；一副三用（两个 key + 一路干声）
  f.push(`[2:a]aformat=sample_fmts=fltp:sample_rates=44100:channel_layouts=stereo,asplit=3[vk1][vk2][vc]`);
  // key 必须是「与该遍 BGM 同一 0 基时间轴」的切片，否则侧链对不上拍
  f.push(`[vk1]atrim=${PASS1_START}:${BREAK_START},asetpts=PTS-STARTPTS,aformat=sample_fmts=fltp:sample_rates=44100:channel_layouts=stereo[k1]`);
  f.push(`[vk2]atrim=${PASS2_START}:${FILM_LEN},asetpts=PTS-STARTPTS,aformat=sample_fmts=fltp:sample_rates=44100:channel_layouts=stereo[k2]`);
  // 侧链压缩：BGM 为主输入，人声为 key；人声静默时 key 低于阈值 → 零增益变化
  f.push(`[b1][k1]sidechaincompress=${sc}[du1]`);
  f.push(`[b2][k2]sidechaincompress=${sc}[du2]`);
  f.push(`[du1]adelay=4000|4000[d1]`, `[du2]adelay=151000|151000[d2]`);

  if (variant === 'duck') {
    f.push(`[d1][d2]amix=inputs=2:duration=longest:dropout_transition=0:normalize=0[a]`);
  } else {
    // ★ 只有一级 amix=inputs=3 —— 踩过的坑：两级 amix 会把音轨截到 143.45s
    f.push(`[d1][d2][vc]amix=inputs=3:duration=longest:dropout_transition=0:normalize=0[a]`);
  }
  return f.join(';');
}

/** 由「需要的压低深度」反解 threshold / level_sc（sidechaincompress 的压力量与 BGM 电平无关，只跟 key 电平有关） */
function recommend({ voiceRmsDb, maxRequiredDepthDb, ratio = DEFAULTS.ratio }) {
  const ratioTerm = 1 - 1 / ratio;
  // depth = (V − T)(1 − 1/ratio)  →  T = V − depth/(1−1/ratio)
  const thrDb = voiceRmsDb - maxRequiredDepthDb / ratioTerm;
  const threshold = Math.pow(10, thrDb / 20);
  return {
    threshold: +threshold.toFixed(5),
    thresholdDb: +thrDb.toFixed(1),
    expectedDepthDb: +maxRequiredDepthDb.toFixed(1),
    formula: `depth = (voiceRms ${voiceRmsDb.toFixed(1)}dB − threshold ${thrDb.toFixed(1)}dB) × (1 − 1/${ratio})`,
    // 人声电平偏低时把 level_sc 抬高，避免 threshold 掉到 0 附近失去意义
    level_sc: thrDb < -45 ? 2 : 1,
  };
}

// ─────────────────────────────────────────────────────────────── ffmpeg 封装
function has(cmd) {
  try { execFileSync(cmd, ['-version'], { stdio: 'ignore' }); return true; } catch { return false; }
}
const FFMPEG = has('ffmpeg');
const FFPROBE = has('ffprobe');

function ff(args) {
  return execFileSync('ffmpeg', ['-hide_banner', '-nostats', ...args], { encoding: 'utf8', maxBuffer: 1 << 26 });
}
function ffQuiet(args) {
  // ★ BUG1 修复：volumedetect 把结果写在 **stderr**，execFileSync 成功路径只返回 stdout
  //   （实测 stdout 命中 0 次、stderr 1 次 → 旧版「语音−BGM = −70dB」那批废数字的真根因）。
  //   改 spawnSync 一次性拿两路，stdout+stderr 拼接后再正则解析。
  const r = spawnSync('ffmpeg', ['-hide_banner', '-nostats', ...args], { encoding: 'utf8', maxBuffer: 1 << 26 });
  return `${r.stdout || ''}${r.stderr || ''}`;
}
/** 量某文件 [a,b) 的 mean_volume（dBFS）；输入侧 -ss/-t，避免解码抖动 */
function meanVolume(file, a, b) {
  const dur = Math.max(0.05, b - a);
  const out = ffQuiet(['-ss', String(a), '-t', String(dur), '-i', file, '-af', 'volumedetect', '-f', 'null', '-']);
  const m = out.match(/mean_volume:\s*(-?[\d.]+|-inf)\s*dB/);
  if (!m) throw new Error(`volumedetect 无输出: ${file} @${a}-${b}`);
  return m[1] === '-inf' ? -99 : parseFloat(m[1]);
}
function probe(file, entries, stream = false) {
  return execFileSync('ffprobe', ['-v', 'error', ...(stream ? ['-select_streams', 'v:0'] : []),
    '-show_entries', entries, '-of', 'default=noprint_wrappers=1:nokey=1', file], { encoding: 'utf8' }).trim();
}

// ─────────────────────────────────────────────────────────────── 分析（纯时间轴 + 预算）
function timeBudget(rate = 4.2) {
  return LANDINGS.map((L) => {
    const win = +(L.b - L.a).toFixed(2);
    const est = +estDuration(L.text, rate).toFixed(2);
    const slack = +(win - 0.6 - est).toFixed(2); // 0.6s = 进出各 0.3s 留白
    const judge = slack < 0.3 ? '临界' : slack < 1.0 ? '紧' : '舒适';
    return { id: L.id, window: `${L.a}–${L.b}`, win, han: hanCount(L.text), est, slack, judge };
  });
}

/** 男声落点 vs 已定稿诗六行 —— 这两条声轨是叠加关系，不是二选一 */
function voiceCollisions(rate = 3.68) {
  const hits = [];
  for (const L of LANDINGS) {
    for (const P of POEM_LANDINGS) {
      const dur = hanCount(P.text) / rate + pauseOf(P.text);
      if (P.t < L.b && P.t + dur > L.a) {
        hits.push({ narration: L.id, poem: P.id, poemSpan: `${P.t.toFixed(1)}–${(P.t + dur).toFixed(1)}` });
      }
    }
  }
  return hits;
}

// ─────────────────────────────────────────────────────────────── 各模式
function printPlan(p) {
  console.log('── 参数 ──');
  console.log(JSON.stringify(p, null, 2));
  console.log('\n── filter_complex（mix：ducked BGM + voice，一级 amix=3）──\n');
  console.log(buildFilter({ variant: 'mix', p }));
  console.log('\n── filter_complex（plain：未压低参考，verify 的 C）──\n');
  console.log(buildFilter({ variant: 'plain', p }));
}

function modeMeasure(o) {
  const audio = need('audio', o.audio);
  const voice = need('voice', o.voice);
  if (!FFMPEG) return missing();

  // 1) 人声实测 RMS：取一个"整窗都是话"的句子（S28 170–177，实测落在 BGM 高潮，最需要压低）
  const voiceRms = meanVolume(voice, 170.0, 177.0);
  // 2) 逐条量 BGM 未压低电平：直接量 mp3 的对应曲位置，再减 volume=0.7 的 3.1dB
  const rows = LANDINGS.map((L) => {
    const r = scoreToMp3([L.a, L.b]);
    const bgm = r ? +(meanVolume(audio, r[0], r[1]) - 3.1).toFixed(1) : -99;
    const needDepth = Math.max(0, +(RULES.bgmCeilSoft - bgm).toFixed(1)); // 目标 −28 需要压多少
    return { id: L.id, window: `${L.a}–${L.b}`, bgmDb: bgm, needDepth, over20: bgm > -20 };
  });
  const maxDepth = Math.max(...rows.map((r) => r.needDepth));
  const p = { ...DEFAULTS, voiceRmsDb: voiceRms, ...recommend({ voiceRmsDb: voiceRms, maxRequiredDepthDb: maxDepth }) };

  console.table(rows);
  const over20 = rows.filter((r) => r.over20);
  console.log(`\n> −20dB 段：${over20.length} 条 → ${over20.map((r) => `${r.id}(${r.bgmDb})`).join(' ')}`);
  console.log(`最深需压 ${maxDepth.toFixed(1)} dB → 推荐参数：`);
  printPlan(p);
  if (maxDepth > RULES.duckMax) console.log(`\n⚠️ 所需压低 ${maxDepth.toFixed(1)}dB > ${RULES.duckMax}dB：音乐会塌，转降级梯（EQ 避让 / 缩句）。`);
  return { rows, p, voiceRms, maxDepth };
}

function modeRender(o) {
  const film = need('film', o.film), audio = need('audio', o.audio), voice = need('voice', o.voice);
  const out = o.out || 'out/duck/mix.mkv';
  const dir = dirname(resolve(out));
  mkdirSync(dir, { recursive: true });
  if (!FFMPEG) return missing(dir);
  const p = { ...DEFAULTS, ...(o.threshold ? { threshold: parseFloat(o.threshold) } : {}), ...(o['level-sc'] ? { level_sc: parseFloat(o['level-sc']) } : {}) };
  if (!p.threshold) p.threshold = recommend({ voiceRmsDb: DEFAULTS.voiceRmsDb, maxRequiredDepthDb: DEFAULTS.targetDepth }).threshold;

  const base = join(dir, 'duck');
  // A：成片音轨
  console.log('→ A mix');
  ff(['-y', '-i', film, '-i', audio, '-i', voice,
    '-filter_complex', buildFilter({ variant: 'mix', p }),
    '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k',
    '-movflags', '+faststart', '-shortest', out]);
  // B / C：BGM-only 两份参考（verify 用），走 wav 免二次编码损失
  console.log('→ B ducked-bgm');
  ff(['-y', '-i', audio, '-i', voice,
    '-filter_complex', buildFilter({ variant: 'duck', p }),
    '-map', '[a]', '-c:a', 'pcm_s16le', `${base}-B.wav`]);
  console.log('→ C plain-bgm');
  ff(['-y', '-i', audio,
    '-filter_complex', buildFilter({ variant: 'plain', p }),
    '-map', '[a]', '-c:a', 'pcm_s16le', `${base}-C.wav`]);
  console.log(`✅ 三份：${out} / ${base}-B.wav / ${base}-C.wav`);
}

function modeVerify(o) {
  const dir = resolve(o.dir || 'out/duck');
  const A = o.mix || join(dir, 'mix.mkv');
  const B = o.bgmDucked || join(dir, 'duck-B.wav');
  const C = o.bgmPlain || join(dir, 'duck-C.wav');
  for (const f of [A, B, C]) if (!existsSync(f)) { console.error('缺文件:', f); process.exit(1); }
  if (!FFMPEG || !FFPROBE) return missing();

  // 三重终验：时长 / 帧数 / 音轨规格
  const frames = probe(A, 'stream=nb_frames', true);
  const dur = parseFloat(probe(A, 'format=duration'));
  const aCh = probe(A, 'stream=channels', true);
  const aSr = probe(A, 'stream=sample_rate', true);
  console.log(`[终验1] 帧数 ${frames}（期望 7350） / 时长 ${dur.toFixed(2)}s（期望 245.0）`);
  console.log(`[终验2] 音轨 ${aSr}Hz ${aCh}ch`);
  console.log(`[终验3] 是否被截到 143.45s：${dur > 240 ? '否 ✅' : '是 ❌（两级 amix 坑复发）'}`);

  const rows = LANDINGS.map((L) => {
    const ducked = meanVolume(B, L.a, L.b);
    const plain = meanVolume(C, L.a, L.b);
    const depth = +(plain - ducked).toFixed(1);
    const okCeil = ducked <= RULES.bgmCeilHard;
    const okDepth = depth >= RULES.duckMin && depth <= RULES.duckMax;
    return {
      id: L.id, window: `${L.a}–${L.b}`,
      plainDb: +plain.toFixed(1), duckedDb: +ducked.toFixed(1), depth,
      verdict: okCeil && okDepth ? 'PASS' : (!okCeil ? `FAIL-CEIL(${ducked}dB)` : `FAIL-DEPTH(${depth}dB)`),
    };
  });
  console.table(rows);

  // 对照窗：人声为零的地方不该被压
  const ctl = CONTROL_WINDOWS.map((w) => {
    const depth = +(meanVolume(C, w.a, w.b) - meanVolume(B, w.a, w.b)).toFixed(1);
    return { id: w.id, window: `${w.a}–${w.b}`, depth, verdict: Math.abs(depth) <= RULES.ctlTolerance ? 'PASS' : `FAIL(${depth}dB)` };
  });
  console.table(ctl);

  // 恢复时间：窗口末点后 0–100 / 100–200 / 200–300 ms 与 C 的差应单调收敛到 ≤1.5dB
  const rec = LANDINGS.map((L) => {
    const slices = [0, 0.1, 0.2].map((d) => {
      const a = L.b + d, b = Math.min(a + 0.1, FILM_LEN);
      return +(meanVolume(C, a, b) - meanVolume(B, a, b)).toFixed(1);
    });
    return { id: L.id, '0-100ms': slices[0], '100-200ms': slices[1], '200-300ms': slices[2], verdict: slices[2] <= RULES.recoverDb ? 'PASS' : 'FAIL-SLOW-RELEASE' };
  });
  console.table(rec);

  const fails = [...rows, ...ctl, ...rec].filter((r) => String(r.verdict) !== 'PASS');
  console.log(`\n${fails.length === 0 ? '✅ 全部通过' : `❌ ${fails.length} 项未过：${fails.map((f) => f.id).join(' ')}`}`);
  if (fails.length) console.log('调整顺序：先抬 ratio / 降 threshold（加深），再缩 release（<=300）；若加深超过 20dB 仍不过 → 降级梯（EQ 避让 → 缩句）。');
  return { rows, ctl, rec, frames, dur, fails };
}

function missing(dir) {
  console.error('❌ 本机没有 ffmpeg（PATH 里找不到）。这不是失败，是环境事实：');
  console.error('   本仓库无 bundled ffmpeg，版权 BGM 也不入仓 → 只能在你的本机跑。');
  console.error('   把下面三条拿到有 ffmpeg 的机器上执行即可（脚本会自己量参数、自己验）：');
  console.error('     node scripts/duck-voice.mjs --mode measure --audio "<aiyi.mp3>" --voice "<voice-track-full.wav>"');
  console.error('     node scripts/duck-voice.mjs --mode render  --film "<silent.mp4>" --audio "<aiyi.mp3>" --voice "<voice-track-full.wav>" --out out/duck/mix.mkv');
  console.error('     node scripts/duck-voice.mjs --mode verify  --dir out/duck');
  if (dir) console.error(`   （输出目录：${dir}）`);
  process.exit(2);
}

// ─────────────────────────────────────────────────────────────── main
const mode = String(opt.mode || 'plan');
console.log(`duck-voice.mjs · mode=${mode} · ffmpeg=${FFMPEG ? 'OK' : 'MISSING'}\n`);

if (mode === 'plan') {
  console.log('── 时间预算（4.2 字/秒基准，0.6s 进出留白）──');
  console.table(timeBudget(4.2));
  console.log('── 3.68 字/秒（由 8 落点 24.7s 反解的诗行语速）敏感性 ──');
  console.table(timeBudget(3.68).map((r) => ({ id: r.id, slack: r.slack, judge: r.judge })));
  console.log('── 男声落点 vs 已定稿诗六行 重叠 ──');
  console.table(voiceCollisions());
  const p = { ...DEFAULTS, ...recommend({ voiceRmsDb: DEFAULTS.voiceRmsDb, maxRequiredDepthDb: DEFAULTS.targetDepth }) };
  printPlan(p);
} else if (mode === 'measure') modeMeasure(opt);
else if (mode === 'render') modeRender(opt);
else if (mode === 'verify') modeVerify(opt);
else if (mode === 'all') {
  const m = modeMeasure(opt);
  if (m && FFMPEG) { modeRender(opt); modeVerify({ dir: dirname(resolve(opt.out || 'out/duck/mix.mkv')) }); }
} else {
  console.error('未知 --mode，可选：plan | measure | render | verify | all');
  process.exit(1);
}