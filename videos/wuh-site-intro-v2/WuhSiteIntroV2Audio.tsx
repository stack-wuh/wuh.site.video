import type { FC } from 'react';
import { Audio, Sequence, interpolate, staticFile } from 'remotion';

/**
 * 配乐分段编排（复用 public/site-film 三轨，90 BPM 对拍，无 SFX）：
 * 片头 120f 静默 → Act1–2 静（meditation）→ Act3 扬（lead 0–990）
 * → Act4 回捞（meditation 低音）→ Act5 续扬（lead 990–1788 续播）
 * → Act6 机械（clash）→ Act7 深缓（meditation 尾段）→ Act8 + 片尾归主题（lead 270s 起，末 180f 淡出）。
 * 全片绝对帧 0–7958；交叉淡化 45f；禁用 <Audio loop>（playbook 实证：loop 音量按轮重置）。
 */
const fade = (from: number, to: number, peak = 1) => (f: number) =>
  interpolate(f, [0, 45, from - 45, to], [0, peak, peak, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

export const WuhSiteIntroV2Audio: FC = () => (
  <>
    <Sequence from={120} durationInFrames={1872}>
      <Audio src={staticFile('site-film/meditation.m4a')} volume={fade(1872, 1872)} />
    </Sequence>
    <Sequence from={1992} durationInFrames={990}>
      <Audio src={staticFile('site-film/lead.m4a')} volume={fade(990, 990, 0.9)} />
    </Sequence>
    <Sequence from={2982} durationInFrames={780}>
      <Audio src={staticFile('site-film/meditation.m4a')} startFrom={4200} volume={fade(780, 780, 0.55)} />
    </Sequence>
    <Sequence from={3762} durationInFrames={798}>
      <Audio src={staticFile('site-film/lead.m4a')} startFrom={990} volume={fade(798, 798, 0.9)} />
    </Sequence>
    <Sequence from={4560} durationInFrames={924}>
      <Audio src={staticFile('site-film/clash.m4a')} volume={fade(924, 924, 0.9)} />
    </Sequence>
    <Sequence from={5484} durationInFrames={1068}>
      <Audio src={staticFile('site-film/meditation.m4a')} startFrom={2400} volume={fade(1068, 1068, 0.7)} />
    </Sequence>
    <Sequence from={6552} durationInFrames={1406}>
      <Audio src={staticFile('site-film/lead.m4a')} startFrom={8100} volume={fade(1406, 1406, 0.95)} />
    </Sequence>
  </>
);
