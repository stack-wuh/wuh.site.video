#!/usr/bin/env node
/**
 * 镜级 manifest 工具链（shot-spec §2）——帧数唯一机器真源 shots-manifest.json 的三件套：
 *   import  分镜定稿后一次性导入：解析 storyboard 逐镜表 → shots-manifest.json（此后改帧只改 manifest）
 *   sync    manifest → 生成 TS 视图（shots/manifest.ts）+ 镜注册表（shots/registry.ts）+ routes.tsx
 *   check   INV-S1/S2/S6 契约探针：对账、文件存在、生成物一致、与 storyboard 交叉核对（只读）
 */
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = join(import.meta.dirname, '..');
const filmDir = join(root, 'videos', 'site-film');
const storyboardPath = join(root, 'videos', 'preprod-site-film', 'assets', 'storyboard.md');
const manifestPath = join(filmDir, 'shots-manifest.json');
const FPS = 30;

const cmd = process.argv[2];
const die = (msg) => {
  console.error(`✗ ${msg}`);
  process.exit(1);
};

/* ─── storyboard 解析（import 一次性入口 + check 交叉核对共用） ─── */
function parseStoryboard(path) {
  if (!existsSync(path)) die(`分镜脚本不存在: ${path}`);
  const lines = readFileSync(path, 'utf8').split('\n');
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
      shots.push({
        id: `s${String(Number(row[1])).padStart(2, '0')}`,
        act: acts[acts.length - 1].act,
        title: copy.slice(0, 24) || `Act${acts[acts.length - 1].act}·镜${Number(row[1])}`,
        durationFrames: Number(row[2]),
        cellStart: Number(row[3]),
        cellEnd: Number(row[4]),
        source: `shots/s${String(Number(row[1])).padStart(2, '0')}.tsx`,
      });
    }
  }
  return { acts, shots };
}

function validate(manifest, parsed) {
  const errs = [];
  const { shots, acts, totalFrames } = manifest;
  shots.forEach((s, i) => {
    const n = i + 1;
    if (s.id !== `s${String(n).padStart(2, '0')}`) errs.push(`镜号不连续: 第 ${n} 项是 ${s.id}`);
    const prefix = shots.slice(0, i).reduce((sum, x) => sum + x.durationFrames, 0);
    if (s.startFrame !== prefix) errs.push(`${s.id} startFrame ${s.startFrame} ≠ 前缀和 ${prefix}`);
    if (parsed) {
      const p = parsed.shots[i];
      if (!p || p.id !== s.id) errs.push(`${s.id} 与分镜表第 ${i + 1} 行不对应`);
      else if (p.durationFrames !== s.durationFrames) errs.push(`${s.id} 时长 ${s.durationFrames} ≠ 分镜表 ${p.durationFrames}`);
      else if (p.cellStart !== s.startFrame) errs.push(`${s.id} 起帧 ${s.startFrame} ≠ 分镜表 ${p.cellStart}`);
    }
  });
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
    return { id: s.id, act: s.act, title: s.title, startFrame: s.cellStart, durationFrames: s.durationFrames, source: s.source };
  });
  const manifest = { film: 'site-film', fps: FPS, totalFrames: cursor, acts: parsed.acts, shots };
  const errs = validate(manifest, parsed);
  if (errs.length > 0) die(`对账失败 ${errs.length} 处:\n  ${errs.join('\n  ')}`);
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
  console.log(`✅ import: ${shots.length} 镜 / ${parsed.acts.length} 幕 / ${manifest.totalFrames} 帧 → shots-manifest.json`);
}

/* ─── sync：manifest → manifest.ts + registry.ts + routes.tsx ─── */
function doSync() {
  if (!existsSync(manifestPath)) die('shots-manifest.json 不存在——先跑 import');
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  mkdirSync(join(filmDir, 'shots'), { recursive: true });
  const header = (what) => `/* 由 scripts/shots.mjs sync 生成——勿手改；真源 shots-manifest.json（${what}） */\n`;
  const tsType = `{ film: string; fps: number; totalFrames: number; acts: Array<{ act: number; title: string; startFrame: number; endFrame: number }>; shots: Array<{ id: string; act: number; title: string; startFrame: number; durationFrames: number; source: string }> }`;
  writeFileSync(
    join(filmDir, 'shots', 'manifest.ts'),
    header('类型化视图') + `export type Manifest = ${tsType};\n\nexport const manifest: Manifest = ${JSON.stringify(manifest, null, 2)};\n`,
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
      + `import type { FC } from 'react';\nimport type { VideoRoute } from '../../src/route';\nimport { SiteFilm } from './SiteFilm';\nimport { SiteFilmAudio } from './SiteFilmAudio';\nimport { ShotShell } from './components/ShotShell';\nimport { shotRegistry } from './shots/registry';\nimport { manifest } from './shots/manifest';\n\n`
      + `const shotRoute = (id: string): VideoRoute => {\n  const entry = manifest.shots.find((s) => s.id === id);\n  if (!entry) throw new Error(\`manifest 缺镜 \${id}\`);\n  const Shot = shotRegistry[id];\n  const ShotComposition: FC = () => (\n    <ShotShell>\n      <Shot />\n    </ShotShell>\n  );\n  return { id: \`SiteFilm-\${id}\`, component: ShotComposition, durationInFrames: entry.durationFrames };\n};\n\n`
      + `export const siteFilmRoutes: VideoRoute[] = [\n  { id: 'SiteFilm', component: SiteFilm, durationInFrames: manifest.totalFrames },\n  { id: 'SiteFilmAudio', component: SiteFilmAudio, durationInFrames: manifest.totalFrames },\n  ...manifest.shots.map((s) => shotRoute(s.id)),\n];\n`,
  );
  rmSync(join(filmDir, 'routes.ts'), { force: true });
  console.log(`✅ sync: manifest.ts + registry.ts + routes.tsx（${manifest.shots.length} 镜）`);
}

/* ─── check：INV-S1/S2/S6 契约探针 ─── */
function doCheck() {
  if (!existsSync(manifestPath)) die('shots-manifest.json 不存在——先跑 import');
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  const parsed = parseStoryboard(storyboardPath);
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
    for (const s of manifest.shots) {
      if (!routes.includes(`SiteFilm-${s.id}`)) errs.push(`routes.tsx 缺 SiteFilm-${s.id}（跑 sync 重生成）`);
    }
    if (!routes.includes(`durationInFrames: manifest.totalFrames`)) errs.push('routes.tsx 缺 totalFrames 对账');
  }
  if (errs.length > 0) die(`INV 对账失败 ${errs.length} 处:\n  ${errs.join('\n  ')}`);
  console.log(`✅ check: INV-S1/S2/S6 全绿 —— ${manifest.shots.length} 镜 Σ=${manifest.totalFrames} 帧，与分镜表/幕表/生成物一致`);
}

switch (cmd) {
  case 'import': doImport(); break;
  case 'sync': doSync(); break;
  case 'check': doCheck(); break;
  default: die('用法: node scripts/shots.mjs <import|sync|check>');
}
