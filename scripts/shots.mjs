#!/usr/bin/env node
/**
 * 镜级 manifest 工具链（shot-spec §2）——帧数唯一机器真源 shots-manifest.json 的三件套：
 *   import  分镜定稿后一次性导入：解析 storyboard 逐镜表 → shots-manifest.json（此后改帧只改 manifest）
 *   sync    manifest → 生成 TS 视图（shots/manifest.ts）+ 镜注册表（shots/registry.ts）+ routes.tsx
 *   check   INV-S1/S2/S6 契约探针：对账、文件存在、生成物一致、与 storyboard 交叉核对（只读）
 * 用法：node scripts/shots.mjs <import|sync|check> [--unit <slug>]（--unit 缺省 site-film，多片共用）
 */
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = join(import.meta.dirname, '..');
const argv = process.argv.slice(2);
const cmd = argv[0];
const die = (msg) => {
  console.error(`✗ ${msg}`);
  process.exit(1);
};
const unitIdx = argv.indexOf('--unit');
const unit = unitIdx >= 0 ? argv[unitIdx + 1] : 'site-film';
if (!unit || unit.startsWith('--')) die('--unit 需要 slug，例如 --unit wuh-site-intro-v2');
const pascal = unit.split('-').map((p) => p[0].toUpperCase() + p.slice(1)).join('');
const camel = unit.split('-').map((p, i) => (i === 0 ? p : p[0].toUpperCase() + p.slice(1))).join('');
const filmDir = join(root, 'videos', unit);
const storyboardPath = join(root, 'videos', `preprod-${unit}`, 'assets', 'storyboard.md');
const manifestPath = join(filmDir, 'shots-manifest.json');
const configPath = join(filmDir, 'film.config.json');
/** film.config.json 的 shell 声明（intro/outro 帧）：有则 film/audio 路由时长含片头片尾；无则维持 site-film 既有口径 */
const readShell = () => (existsSync(configPath) ? (JSON.parse(readFileSync(configPath, 'utf8')).shell ?? null) : null);
const FPS = 30;

/* ─── 转场（v11 §二）：第 7 列 = 进入本镜的 inbound；outbound = 下一镜 inbound ───
 * 单侧帧数即镜内首/尾遮罩占用：墨洇 20（总 40，v11 起全片唯一软转场）、纸翻 18、飞白 10、硬切 0。
 * durationFrames / startFrame 不因转场改动——转场只在镜内占用（design-v11 §二）。 */
const TRANSITIONS = {
  page: { side: 18, zh: '纸翻' },
  dry: { side: 10, zh: '飞白' },
  ink: { side: 20, zh: '墨洇' },
  cut: { side: 0, zh: '切' },
};
const TRANSITION_SIDE = Object.fromEntries(Object.entries(TRANSITIONS).map(([k, v]) => [k, v.side]));
const isTransition = (v) => Object.hasOwn(TRANSITIONS, v);
/** 中文/英文别名 → page/dry/ink/cut。空值（无该列的老分镜）= cut；无法识别的非空值返回 null（由 validate 决定是否报错） */
const TRANSITION_ALIASES = {
  纸翻: 'page', 翻页: 'page', 翻: 'page', page: 'page', paper: 'page', flip: 'page',
  飞白: 'dry', 干笔: 'dry', dry: 'dry',
  墨洇: 'ink', 洇墨: 'ink', 墨: 'ink', ink: 'ink', bleed: 'ink',
  切: 'cut', 硬切: 'cut', cut: 'cut',
};
function normalizeTransition(raw) {
  const key = String(raw ?? '').trim().toLowerCase();
  if (!key) return 'cut';
  return Object.hasOwn(TRANSITION_ALIASES, key) ? TRANSITION_ALIASES[key] : null;
}

/* ─── storyboard 解析（import 一次性入口 + check 交叉核对共用） ─── */
function parseStoryboard(path) {
  if (!existsSync(path)) die(`分镜脚本不存在: ${path}`);
  const text = readFileSync(path, 'utf8');
  const lines = text.split('\n');
  /** 表头注释声明了「进入本镜的转场」才严格校验第 7 列；老单元第 7 列是尾帧/音效散文，按无转场处理 */
  const strictTransitions = text.includes('进入本镜的转场');
  const acts = [];
  const shots = [];
  for (const line of lines) {
    const act = line.match(/^###\s*Act\s*(\d+)\s*(.*?)（帧\s*(\d+)–(\d+)/);
    if (act) {
      acts.push({ act: Number(act[1]), title: act[2].trim(), startFrame: Number(act[3]), endFrame: Number(act[4]) });
      continue;
    }
    const row = line.match(/^\|\s*(\d+)\s*\|\s*(\d+)f\s*·[^|]*?（(\d+)–(\d+)）\s*\|/);
    if (row && acts.length > 0) {
      const cells = line.split('|').map((c) => c.trim());
      const copy = (cells[5] ?? '').replace(/\[材质?\S*\]|\[材料\S*\]/g, '').replace(/\s+/g, ' ').trim();
      const transitionRaw = cells[6] ?? '';
      shots.push({
        id: `s${String(Number(row[1])).padStart(2, '0')}`,
        act: acts[acts.length - 1].act,
        title: copy.slice(0, 24) || `Act${acts[acts.length - 1].act}·镜${Number(row[1])}`,
        durationFrames: Number(row[2]),
        cellStart: Number(row[3]),
        cellEnd: Number(row[4]),
        transition: normalizeTransition(transitionRaw),
        transitionRaw,
        source: `shots/s${String(Number(row[1])).padStart(2, '0')}.tsx`,
      });
    }
  }
  return { acts, shots, strictTransitions };
}

function validate(manifest, parsed) {
  const errs = [];
  const { shots, totalFrames } = manifest;
  shots.forEach((s, i) => {
    const n = i + 1;
    if (s.id !== `s${String(n).padStart(2, '0')}`) errs.push(`镜号不连续: 第 ${n} 项是 ${s.id}`);
    const prefix = shots.slice(0, i).reduce((sum, x) => sum + x.durationFrames, 0);
    if (s.startFrame !== prefix) errs.push(`${s.id} startFrame ${s.startFrame} ≠ 前缀和 ${prefix}`);
    // 转场值域：manifest 只允许 page/dry/ink/cut
    if (s.transition !== undefined && !isTransition(s.transition)) {
      errs.push(`${s.id} transition「${s.transition}」不在 page/dry/ink/cut 值域`);
    }
    if (parsed) {
      const p = parsed.shots[i];
      if (!p || p.id !== s.id) errs.push(`${s.id} 与分镜表第 ${i + 1} 行不对应`);
      else {
        if (p.durationFrames !== s.durationFrames) errs.push(`${s.id} 时长 ${s.durationFrames} ≠ 分镜表 ${p.durationFrames}`);
        if (p.cellStart !== s.startFrame) errs.push(`${s.id} 起帧 ${s.startFrame} ≠ 分镜表 ${p.cellStart}`);
        // 转场真源在分镜表：manifest 必须与第 7 列一致
        if (p.transition === null) {
          if (parsed.strictTransitions) {
            errs.push(`${s.id} 转场值「${String(p.transitionRaw).trim()}」无法识别（可用：${Object.keys(TRANSITION_ALIASES).join(' / ')}）`);
          }
        } else if (s.transition !== undefined && s.transition !== p.transition) {
          errs.push(`${s.id} transition「${s.transition}」≠ 分镜表「${p.transition}」`);
        }
        if (parsed.strictTransitions && s.transition === undefined) errs.push(`${s.id} manifest 缺 transition（先跑 import）`);
      }
    }
  });
  // 转场连续性：s01 无前镜 → inbound 必须硬切；outbound 由下一镜 inbound 推导、末镜恒为切，不落表
  const first = shots[0];
  if (first?.transition !== undefined && first.transition !== 'cut') errs.push(`${first.id} 是首镜，无前镜，inbound 必须为 cut`);
  const sum = shots.reduce((sum, x) => sum + x.durationFrames, 0);
  if (sum !== totalFrames) errs.push(`Σ durationFrames ${sum} ≠ totalFrames ${totalFrames}`);
  if (parsed) {
    const lastEnd = parsed.shots[parsed.shots.length - 1]?.cellEnd;
    if (lastEnd !== totalFrames) errs.push(`分镜表末镜止帧 ${lastEnd} ≠ totalFrames ${totalFrames}`);
    for (const a of parsed.acts) {
      const inAct = shots.filter((s) => s.act === a.act);
      if (inAct.length === 0 || inAct[0].startFrame !== a.startFrame) errs.push(`Act ${a.act} 幕起点与分镜表 ${a.startFrame} 不符`);
      const actSum = inAct.reduce((sum, x) => sum + x.durationFrames, 0);
      if (a.endFrame - a.startFrame !== actSum) errs.push(`Act ${a.act} 幕长 ${a.endFrame - a.startFrame} ≠ Σ ${actSum}`);
    }
  }
  return errs;
}

/* ─── import：storyboard → manifest（一次性） ─── */
function doImport() {
  const parsed = parseStoryboard(storyboardPath);
  if (parsed.shots.length === 0) die('分镜表解析出 0 镜——表格格式可能已变');
  let cursor = 0;
  const shots = parsed.shots.map((s) => {
    if (s.cellStart !== cursor) die(`${s.id} 分镜表起帧 ${s.cellStart} 与前镜止帧 ${cursor} 不连续`);
    cursor = s.cellEnd;
    return {
      id: s.id,
      act: s.act,
      title: s.title,
      startFrame: s.cellStart,
      durationFrames: s.durationFrames,
      transition: s.transition ?? 'cut',
      source: s.source,
    };
  });
  const manifest = { film: unit, fps: FPS, totalFrames: cursor, acts: parsed.acts, shots };
  const errs = validate(manifest, parsed);
  if (errs.length > 0) die(`对账失败 ${errs.length} 处:\n  ${errs.join('\n  ')}`);
  mkdirSync(filmDir, { recursive: true });
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
  console.log(`✅ import: ${shots.length} 镜 / ${parsed.acts.length} 幕 / ${manifest.totalFrames} 帧 → shots-manifest.json`);
}

/* ─── sync：manifest → manifest.ts + registry.ts + routes.tsx ─── */
function doSync() {
  if (!existsSync(manifestPath)) die('shots-manifest.json 不存在——先跑 import');
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  const shell = readShell();
  const filmDurationExpr = shell ? String(manifest.totalFrames + shell.intro + shell.outro) : 'manifest.totalFrames';
  mkdirSync(join(filmDir, 'shots'), { recursive: true });
  const header = (what) => `/* 由 scripts/shots.mjs sync 生成——勿手改；真源 shots-manifest.json（${what}） */\n`;
  const transitionUnion = Object.keys(TRANSITIONS).map((k) => `'${k}'`).join(' | ');
  const tsType = `{ film: string; fps: number; totalFrames: number; acts: Array<{ act: number; title: string; startFrame: number; endFrame: number }>; shots: Array<{ id: string; act: number; title: string; startFrame: number; durationFrames: number; transition: Transition; source: string }> }`;
  writeFileSync(
    join(filmDir, 'shots', 'manifest.ts'),
    header('类型化视图')
      + `export type Transition = ${transitionUnion};\n\n`
      + `/** 转场单侧帧数（总帧 = 2×；cut = 0）：墨洇 20 / 纸翻 18 / 飞白 10。in = 镜首 inbound，out = 下一镜 inbound */\n`
      + `export const TRANSITION_SIDE: Record<Transition, number> = ${JSON.stringify(TRANSITION_SIDE, null, 2)};\n\n`
      + `export type Manifest = ${tsType};\n\nexport const manifest: Manifest = ${JSON.stringify(manifest, null, 2)};\n`,
  );
  const imports = manifest.shots.map((s) => `import ${s.id.toUpperCase()} from './${s.id}';`).join('\n');
  const entries = manifest.shots.map((s) => `  ${s.id}: ${s.id.toUpperCase()},`).join('\n');
  writeFileSync(
    join(filmDir, 'shots', 'registry.ts'),
    header('镜组件注册表') + `import type { FC } from 'react';\n${imports}\n\nexport const shotRegistry: Record<string, FC> = {\n${entries}\n};\n`,
  );
  writeFileSync(
    join(filmDir, 'routes.tsx'),
    header('视频单元路由')
      + `import type { FC } from 'react';\nimport type { VideoRoute } from '../../src/route';\nimport { ${pascal} } from './${pascal}';\nimport { ${pascal}Audio } from './${pascal}Audio';\nimport { ShotShell } from './components/ShotShell';\nimport { shotRegistry } from './shots/registry';\nimport { manifest } from './shots/manifest';\n\n`
      + `const shotRoute = (id: string): VideoRoute => {\n  const entry = manifest.shots.find((s) => s.id === id);\n  if (!entry) throw new Error(\`manifest 缺镜 \${id}\`);\n  const next = manifest.shots[manifest.shots.indexOf(entry) + 1];\n  const Shot = shotRegistry[id];\n  const ShotComposition: FC = () => (\n    <ShotShell in={entry.transition} out={next?.transition} duration={entry.durationFrames}>\n      <Shot />\n    </ShotShell>\n  );\n  return { id: \`${pascal}-\${id}\`, component: ShotComposition, durationInFrames: entry.durationFrames };\n};\n\n`
      + `export const ${camel}Routes: VideoRoute[] = [\n  { id: '${pascal}', component: ${pascal}, durationInFrames: ${filmDurationExpr} },\n  { id: '${pascal}Audio', component: ${pascal}Audio, durationInFrames: ${filmDurationExpr} },\n  ...manifest.shots.map((s) => shotRoute(s.id)),\n];\n`,
  );
  rmSync(join(filmDir, 'routes.ts'), { force: true });
  console.log(`✅ sync: manifest.ts + registry.ts + routes.tsx（${manifest.shots.length} 镜）`);
}

/* ─── check：INV-S1/S2/S6 契约探针 ─── */
function doCheck() {
  if (!existsSync(manifestPath)) die('shots-manifest.json 不存在——先跑 import');
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  const parsed = parseStoryboard(storyboardPath);
  const shell = readShell();
  const filmDurationExpr = shell ? String(manifest.totalFrames + shell.intro + shell.outro) : 'manifest.totalFrames';
  const errs = validate(manifest, parsed);
  for (const s of manifest.shots) {
    if (!existsSync(join(filmDir, s.source))) errs.push(`${s.source} 不存在`);
  }
  const regPath = join(filmDir, 'shots', 'registry.ts');
  if (existsSync(regPath)) {
    const reg = readFileSync(regPath, 'utf8');
    for (const s of manifest.shots) {
      if (!reg.includes(`'./${s.id}'`) || !reg.includes(`${s.id}:`)) errs.push(`registry.ts 缺 ${s.id}（跑 sync 重生成）`);
    }
  }
  const routesPath = join(filmDir, 'routes.tsx');
  if (existsSync(routesPath)) {
    const routes = readFileSync(routesPath, 'utf8');
    // 生成物以 shotRoute(s.id) 模板聚合全部镜级 comp，镜号字面量不在文件内——校验生成器模式本身
    if (!routes.includes(`id: \`${pascal}-\${id}\``)) errs.push(`routes.tsx 缺镜级 comp 前缀 ${pascal}-（跑 sync 重生成）`);
    if (!routes.includes(`component: ${pascal},`)) errs.push(`routes.tsx 缺 film comp ${pascal}（跑 sync 重生成）`);
    if (!routes.includes(`component: ${pascal}Audio,`)) errs.push(`routes.tsx 缺 audio comp ${pascal}Audio（跑 sync 重生成）`);
    if (!routes.includes('...manifest.shots.map((s) => shotRoute(s.id))')) errs.push('routes.tsx 缺 manifest 逐镜遍历（跑 sync 重生成）');
    if (!routes.includes(`durationInFrames: ${filmDurationExpr}`)) errs.push('routes.tsx 缺时长对账（跑 sync 重生成）');
    // 转场透传：分镜表声明了 inbound 列的单元，镜级 comp 必须把 in（本镜 inbound）/out（下一镜 inbound）喂给 ShotShell；
    // 老单元（第 7 列是尾帧/音效散文）维持旧契约，不因共享工具升级而红
    if (parsed.strictTransitions) {
      if (!routes.includes('in={entry.transition}')) errs.push('routes.tsx 缺 ShotShell in 透传（跑 sync 重生成）');
      if (!routes.includes('out={next?.transition}')) errs.push('routes.tsx 缺 ShotShell out 透传（跑 sync 重生成）');
      if (!routes.includes('duration={entry.durationFrames}')) errs.push('routes.tsx 缺 ShotShell duration 透传（跑 sync 重生成）');
    }
  }
  const manifestTsPath = join(filmDir, 'shots', 'manifest.ts');
  if (parsed.strictTransitions && existsSync(manifestTsPath)) {
    const mts = readFileSync(manifestTsPath, 'utf8');
    if (!mts.includes('transition: Transition')) errs.push('manifest.ts 缺 transition 字段（跑 sync 重生成）');
    if (!mts.includes('export const TRANSITION_SIDE')) errs.push('manifest.ts 缺 TRANSITION_SIDE（跑 sync 重生成）');
  }
  if (errs.length > 0) die(`INV 对账失败 ${errs.length} 处:\n  ${errs.join('\n  ')}`);
  console.log(`✅ check: INV-S1/S2/S6 全绿 —— ${manifest.shots.length} 镜 Σ=${manifest.totalFrames} 帧，与分镜表/幕表/生成物一致`);
}

switch (cmd) {
  case 'import': doImport(); break;
  case 'sync': doSync(); break;
  case 'check': doCheck(); break;
  default: die('用法: node scripts/shots.mjs <import|sync|check> [--unit <slug>]');
}
