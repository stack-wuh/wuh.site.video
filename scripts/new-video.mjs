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
const dir = join(root, 'videos', slug);
mkdirSync(join(dir, 'assets'), { recursive: true });
writeFileSync(join(dir, 'assets/.gitkeep'), '');
writeFileSync(
  join(dir, `${pascal}.tsx`),
  [
    "import type { FC } from 'react';",
    "import { AbsoluteFill } from 'remotion';",
    "import { colors, fontFamilies } from '../../brand/tokens';",
    '',
    `export const ${pascal}: FC = () => {`,
    '  return (',
    "    <AbsoluteFill style={{ background: colors.bg }}>",
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
    '    </AbsoluteFill>',
    '  );',
    '};',
    '',
  ].join('\n'),
);

console.log(`已生成 videos/${slug}/${pascal}.tsx`);
console.log('下一步：在 src/Root.tsx 注册 Composition；package.json 加 render:' + slug + ' 脚本');
console.log('渲染口径: --crf=16 --browser-executable=系统Chrome --port=3211');

