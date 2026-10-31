import type { FC } from 'react';
import { Audio, Sequence, interpolate, staticFile } from 'remotion';

/**
 * 配乐分段编排 v2（8234f 新时间轴；90 BPM 对拍，无 SFX）：
 * 片头 120f 静默 → Act1–2 静（meditation）→ Act3 扬（lead 0–990）
 * → Act4 回捞（meditation 低音）→ Act5 复燃（prelude：前奏+行动两段式，3976–4015 白闪真空音量下沉）
 * → Act6 机械（clash）→ Act7 深缓（meditation 尾段）→ Act8 + 片尾归主题（lead 270s 起，末 180f 淡出）。
 * 全片绝对帧 0–8234；交叉淡化 45f；禁用 <Audio loop>（playbook 实证：loop 音量按轮重置）。
 */
const fade = (dur: number, peak = 1) => (f: number) =>
  interpolate(f, [0, 45, dur - 45, dur], [0, peak, peak, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

/* Act5：白闪前 20f 骤停到 0.15，真空 20f，白闪释放后 10f 回到 0.85 */
const preludeVol = (f: number) =>
  interpolate(f, [0, 45, 214, 234, 254, 264, 753, 798], [0, 0.85, 0.85, 0.15, 0.15, 0.85, 0.85, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

/* 终章：全段 0.95，最后 180f（= 片尾）淡出 */
const finaleVol = (f: number) =>
  interpolate(f, [0, 45, 1226, 1406], [0, 0.95, 0.95, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

export const WuhSiteIntroV2Audio: FC = () => (
  <>
    <Sequence from={120} durationInFrames={1872}>
      <Audio src={staticFile('site-film/meditation.m4a')} volume={fade(1872)} />
    </Sequence>
    <Sequence from={1992} durationInFrames={990}>
      <Audio src={staticFile('site-film/lead.m4a')} volume={fade(990, 0.9)} />
    </Sequence>
    <Sequence from={2982} durationInFrames={780}>
      <Audio src={staticFile('site-film/meditation.m4a')} startFrom={4200} volume={fade(780, 0.55)} />
    </Sequence>
    <Sequence from={3762} durationInFrames={798}>
      <Audio src={staticFile('wuh-site-intro-v2/prelude.m4a')} volume={preludeVol} />
    </Sequence>
    <Sequence from={4560} durationInFrames={1200}>
      <Audio src={staticFile('site-film/clash.m4a')} volume={fade(1200, 0.9)} />
    </Sequence>
    <Sequence from={5760} durationInFrames={1068}>
      <Audio src={staticFile('site-film/meditation.m4a')} startFrom={2400} volume={fade(1068, 0.7)} />
    </Sequence>
    <Sequence from={6828} durationInFrames={1406}>
      <Audio src={staticFile('site-film/lead.m4a')} startFrom={8100} volume={finaleVol} />
    </Sequence>
  </>
);
