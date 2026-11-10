import type { FC, ReactNode } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { colors } from '../../../brand/tokens';
import { FILM_COLORS2, PT } from '../motion-tokens';
import { TRANSITION_SIDE, type Transition } from '../shots/manifest';

type MaskProps = { coverage: number };

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smoothstep = (t: number) => t * t * (3 - 2 * t);

/** 转场遮罩所在的 z 层。字幕不跟着被转场吞，字幕层要压在这之上。 */
export const TRANSITION_MASK_Z = 20;

/** V2 光晕呼吸遮罩（2026-11-11 用户拍板：水墨家族遮罩（墨洇/纸翻/飞白）在本片退役，
 * 全片非切转场统一换此动效；家族镜 s01/s60–s62 内容不动，其边界转场同走本口径）。
 *
 * 曝光适应式：出镜侧画面缓亮 + 琥珀辉光自中心呼吸晕开，末段收进近黑；
 * 入镜侧从近黑显影、辉光收敛落定。两侧在接缝帧同为整屏 spaceDeep 实色
 * （同像素接缝，顶替家族遮罩的「满墨/满纸」接缝语义）。
 * coverage 沿用家族口径（out 0→1 / in 1→0），单侧帧数仍取 TRANSITION_SIDE[type]
 * ——manifest 与字幕安全窗零改动。 */
const BloomMask: FC<MaskProps & { dir: 'in' | 'out' }> = ({ coverage, dir }) => {
  const c = clamp01(coverage);
  if (c <= 0.004) return null; // 零覆盖不产生 DOM（与家族遮罩同纪律）
  // 辉光：out 随覆盖增强；in 随退场收敛（早期最亮，像曝光落定）
  const glow = dir === 'out' ? smoothstep(clamp01(c / 0.7)) : smoothstep(clamp01(c / 0.9));
  const glowR = 24 + glow * 76;
  // 近黑收口：两侧镜像对称（出侧末 28% 压黑 / 入侧首 28% 从黑揭开）——呼吸同形
  const blackout = smoothstep(clamp01((c - 0.72) / 0.28));
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', zIndex: TRANSITION_MASK_Z }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 46%, rgba(212,163,115,${(0.34 * glow).toFixed(3)}) 0%, rgba(212,163,115,${(0.12 * glow).toFixed(3)}) ${glowR.toFixed(0)}%, rgba(212,163,115,0) ${Math.min(100, glowR + 34).toFixed(0)}%)`,
          mixBlendMode: 'screen',
        }}
      />
      <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep, opacity: blackout.toFixed(3) }} />
    </AbsoluteFill>
  );
};

/** 按类型派发遮罩；cut 返回 null（不产生任何 DOM，保证逐像素不变）。
 * V2（2026-11-11）：ink/page/dry 全部改走 BloomMask（type 只决定单侧帧数）；cut 仍为零 DOM。 */
const TransitionMask: FC<{ type: Transition; coverage: number; dir: 'in' | 'out' }> = ({ type, coverage, dir }) => {
  if (type === 'cut') return null;
  return <BloomMask coverage={coverage} dir={dir} />;
};

/**
 * 全局视觉下沉（shot-spec §4）：底色垫底随每镜自渲染；装配层不再叠全片 overlay。
 *
 * 镜内转场：转场只在**本镜首/尾帧内占用**，durationFrames / startFrame 不动。
 * in  = 进入本镜的 inbound（首 side 帧遮罩，从满遮罩退开）；
 * out = 本镜的 outbound = 下一镜的 inbound（尾 side 帧遮罩，盖满到最后一帧）。
 * 单侧帧数来自 shots.mjs 的 TRANSITION_SIDE：墨洇 20（总 40）/ 纸翻 18 / 飞白 10 / 硬切 0。
 * V2 视觉：非切转场 = 光晕呼吸（BloomMask），children 随覆盖获得轻微亮度呼吸。
 *
 * 字幕安全窗：字幕 start ≥ in 单侧帧 + 12，end ≤ duration − out 单侧帧 − 12；
 * 遮罩层 zIndex = TRANSITION_MASK_Z（20），字幕层必须压在其上。
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
      {/* V2 亮度呼吸：出镜渐亮（曝光上浮）/ 入镜余亮落定——与 BloomMask 辉光同窗 */}
      <AbsoluteFill style={{ filter: `brightness(${(1 + 0.08 * outCoverage + 0.05 * inCoverage).toFixed(4)})` }}>
        {children}
      </AbsoluteFill>
      <AbsoluteFill
        style={{ background: colors.bgLift, opacity: PT.paperGrain.opacity, mixBlendMode: PT.paperGrain.blend, pointerEvents: 'none' }}
      />
      {inSide > 0 ? <TransitionMask type={inTransition} coverage={inCoverage} dir="in" /> : null}
      {outSide > 0 ? <TransitionMask type={outTransition} coverage={outCoverage} dir="out" /> : null}
    </AbsoluteFill>
  );
};
