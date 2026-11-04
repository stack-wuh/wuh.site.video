#!/usr/bin/env node
/**
 * 本地 mux（music.md + tts-voiceover-pipeline.md）——静默成片 + 本地 BGM +（可选）人声整轨 → 断点两遍混音。
 * 用法：node scripts/mux-bgm.mjs --film out/<silent>.mp4 --audio <aiyi.mp3> [--voice <voice-track-full.wav>] --out out/<final>.mp4
 * 约束：音频不入仓（人声整轨例外——public/zhi-guo-xiang/tts/ 入库）；禁用 <Audio loop>；片头 4s 静音、第一遍 0–139.46s、
 *       v9 断点静默 143.46–151.0s（童谣尾 → 茶棚）、第二遍 151.0s 起取 45.46–139.46s（94.0s，自然收，不淡出）；
 *       v9 成片 7350f / 245.0s（片头 120f + 正片 7050f + 片尾 180f）；
 *       人声轨由 assemble_track.py 按落点表预置静音底、时长即片长，故不再 adelay，直接叠第三路。
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
const voice = get('--voice');
const out = get('--out');
if (!film || !audio || !out) {
  console.error('用法: node scripts/mux-bgm.mjs --film <silent.mp4> --audio <aiyi.mp3> [--voice <voice-track-full.wav>] --out <final.mp4>');
  process.exit(1);
}
for (const f of [film, audio, ...(voice ? [voice] : [])]) {
  if (!existsSync(f)) {
    console.error('输入文件不存在:', f);
    process.exit(1);
  }
}

// BGM 两遍各自衰减 0.7 后直加（amix normalize=0），与先合后音量一致
const filter = [
  '[1:a]atrim=0:139.46,asetpts=PTS-STARTPTS,afade=t=in:st=0:d=1,volume=0.7[a1]',
  '[1:a]atrim=45.46:139.46,asetpts=PTS-STARTPTS,afade=t=in:st=0:d=1,volume=0.7[a2]',
  '[a1]adelay=4000|4000[d1]',
  '[a2]adelay=151000|151000[d2]',
  ...(voice
    ? [
        // 人声轨自带 245s 静音底、时长即片长，不再 adelay；叠成 stereo/44.1k 与 BGM 对齐
        '[2:a]aformat=sample_fmts=fltp:sample_rates=44100:channel_layouts=stereo[vc]',
        '[d1][d2][vc]amix=inputs=3:duration=longest:dropout_transition=0:normalize=0[a]',
      ]
    : ['[d1][d2]amix=inputs=2:duration=longest:dropout_transition=0:normalize=0[a]']),
].join(';');

execFileSync(
  'ffmpeg',
  ['-y', '-i', film, '-i', audio, ...(voice ? ['-i', voice] : []), '-filter_complex', filter, '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', '-shortest', out],
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
