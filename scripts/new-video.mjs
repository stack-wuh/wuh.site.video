#!/usr/bin/env node
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const slug = process.argv[2];
const valid = /^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug || '');
if (!valid || existsSync(join(root, 'videos', slug))) {
  console.error('用法: node scripts/new-video.mjs <kebab-slug>，且 videos/<slug>/ 不存在');
  process.exit(1);
}

const pascal = slug.split('-').map((p) => p[0].toUpperCase() + p.slice(1)).join('');
const camel = slug.split('-').map((p, i) => (i === 0 ? p : p[0].toUpperCase() + p.slice(1))).join('');
const dir = join(root, 'videos', slug);
mkdirSync(join(dir, 'assets'), { recursive: true });
writeFileSync(join(dir, 'assets/.gitkeep'), '');
writeFileSync(
  join(dir, `${pascal}.tsx`),
  [
    "import type { FC } from 'react';",
    "import { AbsoluteFill } from 'remotion';",
    "import { colors, fontFamilies } from '../../brand/tokens';",
    "import { FilmShell } from '../../brand/ident/FilmShell';",
    '',
    'export const CONTENT_FRAMES = 300;',
    '',
    `export const ${pascal}: FC = () => {`,
    '  return (',
    '    <FilmShell',
    `      meta={{ title: '${pascal}', subtitle: '', episode: '', credits: [] }}`,
    '      contentFrames={CONTENT_FRAMES}',
    '    >',
    '      <AbsoluteFill',
    '        style={{',
    "          justifyContent: 'center',",
    "          alignItems: 'center',",
    '          fontFamily: fontFamilies.serif,',
    '          fontSize: 72,',
    '          color: colors.paper,',
    '        }}',
    '      >',
    `        ${pascal}`,
    '      </AbsoluteFill>',
    '    </FilmShell>',
    '  );',
    '};',
    '',
  ].join('\n'),
);
writeFileSync(
  join(dir, 'routes.ts'),
  [
    "import type { VideoRoute } from '../../src/route';",
    "import { totalFilmFrames } from '../../brand/ident/identity';",
    `import { CONTENT_FRAMES, ${pascal} } from './${pascal}';`,
    '',
    `export const ${camel}Routes: VideoRoute[] = [`,
    `  { id: '${pascal}', component: ${pascal}, durationInFrames: totalFilmFrames(CONTENT_FRAMES) },`,
    '];',
    '',
  ].join('\n'),
);

console.log(`已生成 videos/${slug}/${pascal}.tsx 与 routes.ts（默认接入 FilmShell 家族片头片尾）`);
console.log(`下一步：在 src/Root.tsx 加一行 import 并把 ${camel}Routes spread 进 films 分组；package.json 加 render:${slug} 脚本`);
console.log('渲染口径: --crf=16 --browser-executable=系统Chrome --port=3211');
