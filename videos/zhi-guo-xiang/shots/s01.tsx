/* 镜 01 · S1 白纸（无字）· 镜内帧 0–179 · 180f ｜ 全局 0–180
   入场 PT-01/PT-02/GR-01；持续 CM-01/CM-02 + FN-05 + PT-03；出场 FN-06 冻帧 → TR-01 交 S2。
   一页未写的纸：无字、无印、无题款；只有纸面呼吸（120f / 振幅 0.4）与一缕侧光右移 2%。 */
import type { FC } from 'react';
import { AbsoluteFill, random, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { CameraRig } from '../components/CameraRig';
import { DustField } from '../components/DustField';
import { CM, CV, FN, GRADES, PT, STROKE } from '../motion-tokens';

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const TAIL = 179;
const G = GRADES['GR-01'];

/** PT-02 纸纤维：种子化 1px 短 strokes，静态，整体 opacity = PT.paperFiber（≤8%） */
const FiberField: FC<{ seed: string; count?: number }> = ({ seed, count = 120 }) => (
  <svg
    viewBox="0 0 1920 1080"
    preserveAspectRatio="none"
    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: PT.paperFiber.opacity }}
  >
    {Array.from({ length: count }).map((_, i) => {
      const x = random(`${seed}-x-${i}`) * 1920;
      const y = random(`${seed}-y-${i}`) * 1080;
      const len = 6 + random(`${seed}-l-${i}`) * 20;
      const bend = (random(`${seed}-b-${i}`) - 0.5) * 8;
      const pale = random(`${seed}-c-${i}`) < 0.25;
      return (
        <path
          key={i}
          d={`M${x.toFixed(1)} ${y.toFixed(1)} q${(len / 2).toFixed(1)} ${bend.toFixed(1)} ${len.toFixed(1)} 0`}
          stroke={pale ? colors.paperMuted : colors.muted}
          strokeWidth={STROKE.S0}
          fill="none"
        />
      );
    })}
  </svg>
);

/** 中心偏上的一处纤维结（storyboard 画面列） */
const FiberKnot: FC = () => (
  <svg
    viewBox="0 0 1920 1080"
    preserveAspectRatio="none"
    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.1 }}
  >
    {[0, 1, 2, 3, 4].map((i) => (
      <path
        key={i}
        d={`M${926 + i * 16} ${468 + (i % 3) * 9} q18 ${(i - 2) * 6} 38 ${(i % 2) * 4}`}
        stroke={colors.ink}
        strokeWidth={STROKE.S0}
        fill="none"
      />
    ))}
    <circle cx={966} cy={477} r={1.6} fill={colors.ink} />
  </svg>
);

const S01: FC = () => {
  const f = FN.freezeHold(useCurrentFrame(), TAIL); // FN-06 尾帧冻帧
  const cam = { ...CM.drift(f, 1), scale: FN.paperBreathe(f, 0.4) }; // CM-02 幅度减半 + FN-05
  const lightX = 38 * CV.sineOut(clamp01(f / TAIL)); // 侧光右移 2%（38px）
  return (
    <AbsoluteFill style={{ background: colors.paper }}>
      <CameraRig cam={cam}>
        <div style={{ position: 'absolute', inset: -40, background: colors.paper }} />
        {/* 侧光：纸面留一层极淡余影，柔光带自左向右扫过（线性渐变，无 radial） */}
        <AbsoluteFill style={{ background: colors.paperMuted, opacity: 0.22 }} />
        <AbsoluteFill style={{ backgroundImage: `linear-gradient(100deg, ${colors.paperMuted}, transparent 62%)`, opacity: 0.3 }} />
        <div
          style={{
            position: 'absolute',
            top: -220,
            left: 0,
            width: 640,
            height: 1520,
            transform: `translateX(${960 + lightX}px) rotate(-14deg)`,
            backgroundImage: `linear-gradient(90deg, transparent, ${colors.paperDeep} 46%, ${colors.paperDeep} 54%, transparent)`,
            mixBlendMode: 'screen',
            opacity: 0.55,
          }}
        />
        <FiberField seed="s01-fiber" />
        <FiberKnot />
        <DustField act={1} count={6} seedBase="s01" />
      </CameraRig>
      {/* GR-01 纸白：软光底 + 四边极淡纸边阴影（veil 取 0.45 档，保「极淡」） */}
      <AbsoluteFill style={{ background: G.base.color, mixBlendMode: G.base.blend, opacity: G.base.opacity }} />
      <AbsoluteFill
        style={{ backgroundImage: G.veil?.gradient, mixBlendMode: G.veil?.blend, opacity: (G.veil?.opacity ?? 0) * 0.45 }}
      />
    </AbsoluteFill>
  );
};

export default S01;
