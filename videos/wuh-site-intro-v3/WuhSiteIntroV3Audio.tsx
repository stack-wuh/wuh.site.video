import type { FC } from 'react';
import { Audio, Sequence, interpolate, staticFile } from 'remotion';

/**
 * 配乐分段编排 v3·V2 科技版（8590f 时间轴 = 150 片头 + 8260 正片 + 180 片尾；90 BPM 对拍，无 SFX）：
 * 深空数据流·电子氛围——2026-11-11 用户拍板随风格重构换科技 BGM（Kevin MacLeod 电子/氛围族，CC-BY 4.0）：
 *   Act1–2 静（Spacial Harvest）→ Act3 温（Deep Haze）→ Act4 痛·断电（Crypto）
 *   → Act5 燃（Voltaic，白闪真空对齐渲染帧 4089，preludeVol 避让窗原样）→ Act6 奇（Digital Lemonade）
 *   → Act7 深（Spacial Harvest 回捞）→ Act8 扬（As I Figure）→ 终章归（Deep Haze 再起，末 120f 淡出）。
 * 段界/startFrom/交叉淡化结构与 V1 纸墨版完全同构（时间轴真源不动，只换曲）；
 * 全片绝对帧 0–8590；段间 30f 真交叉淡化；曲目已归一 -17 LUFS / TP -1.4
 * （public/wuh-site-intro-v3/score-tech；V1 家族纸墨版保留在 score/ 供回滚）。
 * 禁用 <Audio loop>（playbook 实证：loop 音量按轮重置）。
 */

const FADE = 30;
const CLAMP = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

const fadeVol = (dur: number, peak: number, fadeIn = FADE, fadeOut = FADE) => (f: number) =>
  interpolate(f, [0, fadeIn, dur - fadeOut, dur], [0, peak, peak, 0], CLAMP);

/* Act5：白闪前 20f 压低、真空 20f、释放后 30f 回到 0.9；白闪峰值在渲染帧 4089（本段局部 261；段自 3828 起） */
const preludeVol = (f: number) =>
  interpolate(f, [0, FADE, 241, 261, 281, 311, 798, 828], [0, 0.85, 0.85, 0.12, 0.12, 0.9, 0.9, 0], CLAMP);

type Segment = {
  from: number;
  dur: number;
  src: string;
  startFrom: number;
  volume: (f: number) => number;
};

const SEGMENTS: Segment[] = [
  { from: 150, dur: 1872, src: 'spacial-harvest.m4a', startFrom: 0, volume: fadeVol(1872, 0.85) },
  { from: 1992, dur: 1086, src: 'deep-haze.m4a', startFrom: 0, volume: fadeVol(1086, 0.82) },
  { from: 3048, dur: 810, src: 'crypto.m4a', startFrom: 900, volume: fadeVol(810, 0.9) },
  { from: 3828, dur: 828, src: 'voltaic.m4a', startFrom: 0, volume: preludeVol },
  { from: 4626, dur: 1310, src: 'digital-lemonade.m4a', startFrom: 0, volume: fadeVol(1310, 0.78) },
  { from: 5906, dur: 1098, src: 'spacial-harvest.m4a', startFrom: 2400, volume: fadeVol(1098, 0.8) },
  { from: 6974, dur: 1068, src: 'as-i-figure.m4a', startFrom: 3600, volume: fadeVol(1068, 0.88) },
  { from: 8012, dur: 578, src: 'deep-haze.m4a', startFrom: 0, volume: fadeVol(578, 0.92, FADE, 120) },
];

export const WuhSiteIntroV3Audio: FC = () => (
  <>
    {SEGMENTS.map((seg) => (
      <Sequence key={`${seg.from}-${seg.src}`} from={seg.from} durationInFrames={seg.dur}>
        <Audio src={staticFile(`wuh-site-intro-v3/score-tech/${seg.src}`)} startFrom={seg.startFrom} volume={seg.volume} />
      </Sequence>
    ))}
  </>
);
