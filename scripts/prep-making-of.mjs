#!/usr/bin/env node
/**
 * scripts/prep-making-of.mjs — 历程片素材预处理（母带裁段 → 标准片段入 public/）
 *
 * 真源：
 *   videos/preprod-making-of-zhi-guo-xiang/assets/segments.json   母带清单 + 片段清单（in/out 秒、-vN 版本）
 *
 * 产物：
 *   public/making-of-zhi-guo-xiang/segments/<id>-v<N>.mp4         统一 1080p30 / H.264 / yuv420p / faststart / **无声**
 *                                                                 （声轨在装配层做；片段是 staticFile 渲染依赖，必进 git）
 *
 * 规则：
 *   - 母带在仓库外（~/Desktop/remotion），只读，永不入 git（成片不入库纪律）
 *   - 换段内容必升 segments.json 里的 version（-vN 纪律：staticFile 不在镜级缓存键 import 闭包内，只换内容不改名 = 像素漂移）
 *   - 机检口径：段 id 重复/未知母带/in-out 越界/时长 <0.5s → 报错指名段号，exit 1
 *   - 幂等：输出已存在且未 --force 时跳过；--check 只验产物（存在 + ffprobe 帧数/规格对账）不产段
 *
 * 用法：
 *   node scripts/prep-making-of.mjs                 # 产缺的段（跳过已存在）
 *   node scripts/prep-making-of.mjs --force         # 全部重产
 *   node scripts/prep-making-of.mjs --only seg-animatic-open
 *   node scripts/prep-making-of.mjs --dry-run       # 只打印 ffmpeg 命令
 *   node scripts/prep-making-of.mjs --check         # 对账已有产物，不写任何文件；异常 exit 1
 */
import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { homedir } from 'node:os';
import path from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const MANIFEST = path.join(ROOT, 'videos/preprod-making-of-zhi-guo-xiang/assets/segments.json');
const OUT_DIR = path.join(ROOT, 'public/making-of-zhi-guo-xiang/segments');

const args = process.argv.slice(2);
const FORCE = args.includes('--force');
const DRY_RUN = args.includes('--dry-run');
const CHECK = args.includes('--check');
const ONLY_IDX = args.indexOf('--only');
const ONLY = ONLY_IDX >= 0 ? args[ONLY_IDX + 1]?.split(',').map((s) => s.trim()).filter(Boolean) : null;

function die(msg) {
  console.error(`✗ ${msg}`);
  process.exit(1);
}

function run(cmd, cmdArgs, opts = {}) {
  const r = spawnSync(cmd, cmdArgs, { encoding: 'utf8', ...opts });
  if (r.status !== 0) {
    die(`${cmd} 失败（exit ${r.status}）\n${(r.stderr || '').split('\n').slice(-6).join('\n')}`);
  }
  return r.stdout;
}

function ffprobeJson(file) {
  const out = run('ffprobe', [
    '-v', 'error',
    '-select_streams', 'v:0',
    '-show_entries', 'stream=width,height,r_frame_rate,nb_frames',
    '-show_entries', 'format=duration',
    '-of', 'json', file,
  ]);
  const j = JSON.parse(out);
  return { stream: j.streams?.[0], duration: parseFloat(j.format?.duration ?? '0') };
}

function expandHome(p) {
  return p.startsWith('~') ? path.join(homedir(), p.slice(1)) : p;
}

if (!existsSync(MANIFEST)) die(`真源不存在：${MANIFEST}`);
const manifest = JSON.parse(readFileSync(MANIFEST, 'utf8'));

// ── 清单机检 ──────────────────────────────────────────────
const ids = new Set();
for (const seg of manifest.segments) {
  if (!/^[a-z0-9-]+$/.test(seg.id)) die(`段 id 非法（小写字母/数字/连字符）：${seg.id}`);
  if (ids.has(seg.id)) die(`段 id 重复：${seg.id}`);
  ids.add(seg.id);
  const master = manifest.masters[seg.master];
  if (!master) die(`${seg.id}：未知母带编号 ${seg.master}（masters 里没有）`);
  if (!(seg.out > seg.in)) die(`${seg.id}：out(${seg.out}) 必须大于 in(${seg.in})`);
  if (seg.out - seg.in < 0.5) die(`${seg.id}：时长 ${(seg.out - seg.in).toFixed(2)}s < 0.5s`);
  if (!Number.isInteger(seg.version) || seg.version < 1) die(`${seg.id}：version 必须是 ≥1 的整数（-vN 纪律）`);
}
if (ONLY) {
  for (const id of ONLY) if (!ids.has(id)) die(`--only 指定的段不存在：${id}`);
}

// ── 母带探测（越界机检）──────────────────────────────────
const mastersDir = expandHome(manifest.mastersDir);
const masterDurations = {};
for (const [key, master] of Object.entries(manifest.masters)) {
  const file = path.join(mastersDir, master.file);
  if (!existsSync(file)) {
    console.warn(`⚠ 母带缺失，跳过其相关段（--check 会红）：${key} → ${file}`);
    continue;
  }
  masterDurations[key] = ffprobeJson(file).duration;
  for (const seg of manifest.segments.filter((s) => s.master === key)) {
    if (seg.out > masterDurations[key] + 0.05) {
      die(`${seg.id}：out=${seg.out}s 超出母带 ${key} 时长 ${masterDurations[key].toFixed(3)}s`);
    }
  }
}

// ── 产段 ──────────────────────────────────────────────────
mkdirSync(OUT_DIR, { recursive: true });
let built = 0;
let skipped = 0;
let broken = 0;

for (const seg of manifest.segments) {
  if (ONLY && !ONLY.includes(seg.id)) continue;
  const master = manifest.masters[seg.master];
  const masterPath = path.join(mastersDir, master.file);
  const outName = `${seg.id}-v${seg.version}.mp4`;
  const outPath = path.join(OUT_DIR, outName);

  if (CHECK) {
    if (!existsSync(outPath)) {
      console.error(`✗ ${seg.id}：产物缺失 ${outName}`);
      broken += 1;
      continue;
    }
    const probe = ffprobeJson(outPath);
    const wantFrames = Math.round((seg.out - seg.in) * 30);
    const gotFrames = parseInt(probe.stream?.nb_frames ?? '0', 10);
    const okSpec =
      probe.stream?.width === 1920 && probe.stream?.height === 1080 && probe.stream?.r_frame_rate === '30/1';
    if (!okSpec || Math.abs(gotFrames - wantFrames) > 2) {
      console.error(
        `✗ ${seg.id}：规格/帧数不符——want ${wantFrames}f@1080p30，got ${gotFrames}f ` +
          `${probe.stream?.width}x${probe.stream?.height}@${probe.stream?.r_frame_rate}`,
      );
      broken += 1;
      continue;
    }
    console.log(`✓ ${outName}（${gotFrames}f / ${probe.duration.toFixed(3)}s）`);
    continue;
  }

  if (!existsSync(masterPath)) {
    console.warn(`⚠ 跳过 ${seg.id}：母带缺失 ${masterPath}`);
    skipped += 1;
    continue;
  }
  if (existsSync(outPath) && !FORCE) {
    skipped += 1;
    continue;
  }

  const duration = (seg.out - seg.in).toFixed(3);
  const ffmpegArgs = [
    '-y', '-v', 'error',
    '-i', masterPath,
    '-ss', seg.in.toFixed(3), '-t', duration,
    '-vf', 'fps=30,scale=1920:1080:flags=lanczos',
    '-c:v', 'libx264', '-crf', '18', '-preset', 'veryfast',
    '-pix_fmt', 'yuv420p', '-movflags', '+faststart',
    '-an',
    outPath,
  ];
  if (DRY_RUN) {
    console.log(`[dry] ffmpeg ${ffmpegArgs.map((a) => (a.includes(' ') ? JSON.stringify(a) : a)).join(' ')}`);
    built += 1;
    continue;
  }
  console.log(`▶ ${outName}（${master.version} ${seg.in}–${seg.out}s）`);
  run('ffmpeg', ffmpegArgs);
  built += 1;
}

if (CHECK) {
  if (broken > 0) die(`对账失败 ${broken} 段`);
  console.log('✅ check 全绿');
} else {
  console.log(`✅ 产段 ${built}，跳过 ${skipped}（已存在或母带缺失）`);
}
