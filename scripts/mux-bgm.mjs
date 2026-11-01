#!/usr/bin/env node
/**
 * 本地 BGM mux（music.md）——静默成片 + 用户本地音频 → 断点两遍混音。
 * 用法：node scripts/mux-bgm.mjs --film out/<silent>.mp4 --audio <aiyi.mp3> --out out/<final>.mp4
 * 约束：音频不入仓；禁用 <Audio loop>；片头 4s 静音、第一遍 0–139.46s、
 *       v8 断点静默 143.46–153.0s（掌心剩两枚 → 出家）、第二遍 153.0s 起取 0–83.67s、末 3s 淡出；
 *       v8 成片 7100f / 236.67s（片头 120f + 正片 6800f + 片尾 180f）。
 */
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';

const args = process.argv.slice(2);
const get = (flag, fallback) => {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1] : fallback;
};
const film = get('--film');
const audio = get('--audio');
const out = get('--out');
if (!film || !audio || !out) {
  console.error('用法: node scripts/mux-bgm.mjs --film <silent.mp4> --audio <aiyi.mp3> --out <final.mp4>');
  process.exit(1);
}
if (!existsSync(film) || !existsSync(audio)) {
  console.error('输入文件不存在:', film, audio);
  process.exit(1);
}

const filter = [
  '[1:a]atrim=0:139.46,asetpts=PTS-STARTPTS,afade=t=in:st=0:d=1[a1]',
  '[1:a]atrim=0:83.67,asetpts=PTS-STARTPTS,afade=t=in:st=0:d=1,afade=t=out:st=80.67:d=3[a2]',
  '[a1]adelay=4000|4000[d1]',
  '[a2]adelay=153000|153000[d2]',
  '[d1][d2]amix=inputs=2:duration=longest:dropout_transition=0:normalize=0,volume=0.7[a]',
].join(';');

execFileSync(
  'ffmpeg',
  ['-y', '-i', film, '-i', audio, '-filter_complex', filter, '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', '-shortest', out],
  { stdio: 'inherit' },
);

const probe = (entries, stream = false) =>
  execFileSync(
    'ffprobe',
    ['-v', 'error', ...(stream ? ['-select_streams', 'v:0'] : []), '-show_entries', entries, '-of', 'default=noprint_wrappers=1:nokey=1', out],
    { encoding: 'utf8' },
  ).trim();
const frames = probe('stream=nb_frames', true);
const duration = probe('format=duration');
console.log(`✅ mux: ${out} · ${frames} 帧 · ${duration}s`);
