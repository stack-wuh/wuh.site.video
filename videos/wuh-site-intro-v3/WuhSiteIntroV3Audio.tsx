import type { FC } from 'react';
import { Audio, Sequence, interpolate, staticFile } from 'remotion';

/**
 * 配乐分段编排 v1（6030f = 片头 150 + 正片 5700 + 片尾 180；90 BPM 对拍，无 SFX）。
 * 亮色信息密度·产品发布片：Life of Riley（起点）→ Meditation Impromptu 01（沉默，最薄）
 * → Take the Lead（重启）→ Digital Lemonade（屋里）→ Crypto（方法）→ Inspired（签名/片尾）。
 * 曲目 Kevin MacLeod · CC BY 4.0；已归一 -17 LUFS / TP -1.4（public/wuh-site-intro-v3/score-bright/）。
 * 段间 30f 真交叉淡化；禁用 <Audio loop>（loop 音量按轮重置，playbook 实证）。
 * 改编排只动本文件与 assets/bgm-selection.md，不重渲画面。
 */

const FADE = 30;
const CLAMP = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

type Segment = {
  from: number;
  dur: number;
  src: string;
  startFrom: number;
  peak: number;
  fadeIn?: number;
  fadeOut?: number;
};

const SEGMENTS: Segment[] = [
  // 冷开场 + 第一幕 起点（abs 0–1680）
  { from: 0, dur: 1680, src: 'life-of-riley.m4a', startFrom: 0, peak: 0.78 },
  // 第二幕 沉默（abs 1650–2580）：全片最薄
  { from: 1650, dur: 930, src: 'meditation-impromptu-01.m4a', startFrom: 300, peak: 0.52 },
  // 第三幕 重启（abs 2550–3480）
  { from: 2550, dur: 930, src: 'take-the-lead.m4a', startFrom: 0, peak: 0.82 },
  // 第四幕 屋里（abs 3450–4680）
  { from: 3450, dur: 1230, src: 'digital-lemonade.m4a', startFrom: 0, peak: 0.76 },
  // 第五幕 方法（abs 4650–5380）
  { from: 4650, dur: 730, src: 'crypto.m4a', startFrom: 1800, peak: 0.72 },
  // 第六幕 签名 + 片尾（abs 5350–6030）：末 90f 淡出
  { from: 5350, dur: 680, src: 'inspired.m4a', startFrom: 0, peak: 0.8, fadeOut: 90 },
];

export const WuhSiteIntroV3Audio: FC = () => (
  <>
    {SEGMENTS.map((seg) => {
      const fadeIn = seg.fadeIn ?? FADE;
      const fadeOut = seg.fadeOut ?? FADE;
      const volume = (f: number) =>
        interpolate(f, [0, fadeIn, seg.dur - fadeOut, seg.dur], [0, seg.peak, seg.peak, 0], CLAMP);
      return (
        <Sequence key={`${seg.from}-${seg.src}`} from={seg.from} durationInFrames={seg.dur}>
          <Audio
            src={staticFile(`wuh-site-intro-v3/score-bright/${seg.src}`)}
            startFrom={seg.startFrom}
            volume={volume}
          />
        </Sequence>
      );
    })}
  </>
);