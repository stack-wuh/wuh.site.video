import type { FC, ReactNode } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { colors } from '../../../brand/tokens';
import { PT } from '../motion-tokens';
import { TRANSITION_SIDE, type Transition } from '../shots/manifest';

type MaskProps = { coverage: number };

/** 纸翻：纸色纵向擦除 + 1px 暗边（上一「页」向右侧退开）。coverage 1 = 满幅纸色。 */
const PageMask: FC<MaskProps> = ({ coverage }) => {
  const wipe = (1 - coverage) * 100; // 左侧已被擦开的百分比
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <AbsoluteFill style={{ background: colors.paper, clipPath: `inset(0 0 0 ${wipe}%)` }} />
      {coverage > 0.02 && coverage < 0.98 ? (
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: `${wipe}%`,
            width: 2,
            background: 'rgba(24,19,14,0.4)',
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};

/** 飞白：横向干笔擦——纸底 + 多条错位细墨线，各自速度不同（干笔的丝路）。coverage 1 = 满幅纸底 + 定格丝路。 */
const DRY_STREAKS = [
  { top: '5%', h: 8, w: 52, x: -40, speed: 1.12, alpha: 0.62 },
  { top: '14%', h: 4, w: 38, x: -22, speed: 1.34, alpha: 0.5 },
  { top: '22%', h: 10, w: 64, x: -52, speed: 1.02, alpha: 0.7 },
  { top: '33%', h: 3, w: 30, x: -12, speed: 1.46, alpha: 0.42 },
  { top: '41%', h: 6, w: 46, x: -34, speed: 1.2, alpha: 0.58 },
  { top: '52%', h: 12, w: 58, x: -46, speed: 0.98, alpha: 0.74 },
  { top: '63%', h: 4, w: 34, x: -16, speed: 1.4, alpha: 0.46 },
  { top: '72%', h: 7, w: 50, x: -38, speed: 1.1, alpha: 0.6 },
  { top: '83%', h: 5, w: 42, x: -26, speed: 1.28, alpha: 0.52 },
  { top: '92%', h: 9, w: 56, x: -44, speed: 1.04, alpha: 0.66 },
] as const;
const DryMask: FC<MaskProps> = ({ coverage }) => {
  const c = Math.max(0, Math.min(1, coverage));
  const travel = (1 - c) * 120; // 干笔丝路随 coverage 横移；coverage 1 时定格在同一落点（相邻镜同帧无缝）
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', opacity: c }}>
      <AbsoluteFill style={{ background: colors.paper }} />
      {DRY_STREAKS.map((s) => (
        <div
          key={s.top}
          style={{
            position: 'absolute',
            top: s.top,
            left: 0,
            width: `${s.w}%`,
            height: s.h,
            borderRadius: s.h,
            background: `linear-gradient(90deg, transparent 0%, ${colors.ink} 10%, ${colors.ink} 90%, transparent 100%)`,
            opacity: s.alpha,
            transform: `translateX(${s.x + travel * s.speed}%)`,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

/** 墨洇：墨色自四边径向晕开——径向渐变背景把中心留孔，孔随 coverage 平方收缩（先慢后快，末帧不整块跳变）。coverage 1 = 满幅墨色。 */
const InkMask: FC<MaskProps> = ({ coverage }) => {
  const c = Math.max(0, Math.min(1, coverage));
  if (c <= 0.005) return <AbsoluteFill style={{ pointerEvents: 'none', background: colors.ink, opacity: 0 }} />;
  if (c >= 0.999) return <AbsoluteFill style={{ pointerEvents: 'none', background: colors.ink, opacity: 0.97 }} />; // 峰值帧两侧同像素
  const hole = Math.min(155, (1 - c) ** 2 * 155); // 中心透明孔半径（% 渐变射线），超过画幅对角即无墨
  const gradient = `radial-gradient(circle at 50% 50%, transparent ${hole}%, rgba(43,38,32,0.35) ${Math.min(100, hole + 2)}%, ${colors.ink} ${Math.min(100, hole + 9)}%)`;
  return <AbsoluteFill style={{ pointerEvents: 'none', background: gradient, opacity: 0.97 }} />;
};

/** 按类型派发遮罩；cut 返回 null（不产生任何 DOM，保证逐像素不变） */
const TransitionMask: FC<{ type: Transition; coverage: number }> = ({ type, coverage }) => {
  if (type === 'page') return <PageMask coverage={coverage} />;
  if (type === 'dry') return <DryMask coverage={coverage} />;
  if (type === 'ink') return <InkMask coverage={coverage} />;
  return null;
};

/**
 * 全局视觉下沉（shot-spec §4）：暖黑底 + 纸纹垫底随每镜自渲染；装配层不再叠全片 overlay。
 *
 * 镜内转场（design-v10 §3.1）：转场只在**本镜首/尾帧内占用**，durationFrames / startFrame 不动。
 * in  = 进入本镜的 inbound（首 side 帧遮罩，从满遮罩退开）；
 * out = 本镜的 outbound = 下一镜的 inbound（尾 side 帧遮罩，盖满到最后一帧）。
 * 单侧帧数来自 shots.mjs 的 TRANSITION_SIDE：纸翻 18 / 飞白 10 / 墨洇 12 / 硬切 0。
 *
 * 字幕安全窗（交给接线同学）：字幕 start ≥ in 单侧帧 + 12，end ≤ duration − out 单侧帧 − 12。
 * cut 时两值均为 0 且**不渲染任何遮罩层**——默认参数下画面逐像素不变。
 */
export const ShotShell: FC<{ children: ReactNode; in?: Transition; out?: Transition; duration?: number }> = ({
  children,
  in: inTransition = 'cut',
  out: outTransition = 'cut',
  duration,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  // 全片装配层里 ShotShell 挂在 Sequence 内，useVideoConfig 给的是根 comp 时长——优先用 manifest 传入的本镜时长
  const total = duration ?? durationInFrames;
  const inSide = TRANSITION_SIDE[inTransition];
  const outSide = TRANSITION_SIDE[outTransition];
  const inCoverage =
    inSide > 0 ? interpolate(frame, [0, inSide], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 0;
  const outCoverage =
    outSide > 0 ? interpolate(frame, [total - outSide, total - 1], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 0;

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      {children}
      <AbsoluteFill
        style={{ background: colors.bgLift, opacity: PT.paperGrain.opacity, mixBlendMode: PT.paperGrain.blend, pointerEvents: 'none' }}
      />
      {inSide > 0 ? <TransitionMask type={inTransition} coverage={inCoverage} /> : null}
      {outSide > 0 ? <TransitionMask type={outTransition} coverage={outCoverage} /> : null}
    </AbsoluteFill>
  );
};