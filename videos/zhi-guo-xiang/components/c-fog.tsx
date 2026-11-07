/*
 * C 组雾层：S21「雾从雪脊漫上来，把两人的下半身吃掉」。
 *
 * 底图是高调淡彩（雪与纸都近白），所以雾不能画成灰块——用**比底图更亮半档的暖纸白**
 * 一层层从雪脊往上漫：它不吃掉轮廓里的淡墨，只把下半个画面「洗白」，人是被雾吃掉，
 * 不是被涂掉。blend 用 screen（纸白提亮），边缘全是 40–90px 模糊，没有硬边。
 *
 * progress 0→1 由镜头按帧给（S21：110f 起雾，176f 吃满）。
 * 坐标基准 1920×1080。
 */
import type { FC } from 'react';
import { AbsoluteFill, random, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { FILM } from '../motion-tokens';

/** 从 ridgeY 往上漫的雾：阶梯式起雾（每团有自己的门槛，先来的高、后来的厚）。 */
export const RisingFog: FC<{
  /** 0–1：吃满到哪儿 */
  progress: number;
  seedBase: string;
  /** 雪脊高度（雾从这条线上长出来） */
  ridgeY?: number;
  /** 吃满时雾顶到多高（px，往上算） */
  rise?: number;
  count?: number;
  /** 整体浓度 */
  strength?: number;
}> = ({ progress, seedBase, ridgeY = 812, rise = 460, count = 9, strength = 1 }) => {
  const f = useCurrentFrame();
  const p = Math.max(0, Math.min(1, progress));
  if (p <= 0.001) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', mixBlendMode: 'screen' }}>
      {Array.from({ length: count }).map((_, i) => {
        const seed = `${seedBase}-fog-${i}`;
        const r0 = random(seed);
        const r1 = random(`${seed}-r`);
        const r2 = random(`${seed}-p`);
        /* 每团雾自己的门槛：低处的先起、高处的后到（所以「先吃下半身」） */
        const gate = r2 * 0.45;
        const local = Math.max(0, Math.min(1, (p - gate) / (1 - gate)));
        const size = 420 + r0 * 520;
        const x = 60 + r1 * 1800 - size * 0.15;
        const y = ridgeY - local * (rise * (0.35 + r0 * 0.75)) - size * 0.34;
        const wobble = Math.sin((f + r2 * 200) / 90) * 26;
        const o = (0.16 + r1 * 0.14) * Math.min(1, local * 1.6) * strength;
        return (
          <div
            key={seed}
            style={{
              position: 'absolute',
              left: x + wobble,
              top: y,
              width: size,
              height: size * (0.62 + r0 * 0.24),
              borderRadius: '50%',
              background: `radial-gradient(ellipse 50% 50% at 50% 50%, ${colors.paper} 0%, ${colors.paper} 42%, transparent 72%)`,
              filter: `blur(${44 + r1 * 40}px)`,
              opacity: o,
            }}
          />
        );
      })}
      {/* 雾脚：贴着雪脊的一条厚白，慢慢抬高——这条是「吃到膝盖」的那条线 */}
      <div
        style={{
          position: 'absolute',
          left: -100,
          right: -100,
          top: ridgeY - 40,
          height: 300 + p * 190,
          background: `linear-gradient(180deg, ${colors.paper} 0%, ${colors.paper} 46%, transparent 100%)`,
          opacity: 0.42 * p * strength,
          filter: 'blur(30px)',
        }}
      />
    </AbsoluteFill>
  );
};

/** 贴地的一层薄雾（全片呼吸用）：不参与剧情，只让空气动起来。 */
export const GroundMist: FC<{ seedBase: string; opacity?: number; y?: number; drift?: number }> = ({
  seedBase,
  opacity = 0.5,
  y = 900,
  drift = 0,
}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', mixBlendMode: 'screen' }}>
      {Array.from({ length: 4 }).map((_, i) => {
        const seed = `${seedBase}-mist-${i}`;
        const r = random(seed);
        const x = 100 + r * 1700 + drift * f * 0.2 + Math.sin((f + r * 180) / 70) * 40;
        return (
          <div
            key={seed}
            style={{
              position: 'absolute',
              left: x,
              top: y + i * 34 - r * 40,
              width: 300 + r * 300,
              height: 90 + r * 60,
              borderRadius: '50%',
              background: `radial-gradient(closest-side, ${colors.paper} 0%, transparent 76%)`,
              filter: 'blur(26px)',
              opacity: (0.12 + r * 0.1) * opacity,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/** 面具那一侧的冷光：抬手到面具时，雪光在面具系带上亮一下（不摘面具，只有光）。 */
export const MaskColdLight: FC<{ at: { x: number; y: number }; amount: number; r?: number }> = ({ at, amount, r = 150 }) => {
  if (amount <= 0.001) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', mixBlendMode: 'screen' }}>
      <div
        style={{
          position: 'absolute',
          left: at.x - r,
          top: at.y - r,
          width: r * 2,
          height: r * 2,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${FILM.snowCyan} 0%, transparent 66%)`,
          opacity: 0.16 * amount,
          filter: 'blur(18px)',
        }}
      />
    </AbsoluteFill>
  );
};
/** 局部一簇雾（不铺满画幅）：从 at 处往上长，用来「湿接」掉底图上一层旧墨——
 *  S21 他垂着的袖子抬走后，原位由这簇雾接管（水彩湿接，不是贴片遮罩）。 */
export const LocalMist: FC<{
  at: { x: number; y: number };
  /** 0–1：浓度 */
  progress: number;
  seedBase: string;
  /** 横向铺开（px） */
  spread?: number;
  /** 往上的高度（px） */
  rise?: number;
  count?: number;
  /** 整体浓度上限 */
  strength?: number;
}> = ({ at, progress, seedBase, spread = 150, rise = 220, count = 5, strength = 1 }) => {
  const f = useCurrentFrame();
  const p = Math.max(0, Math.min(1, progress));
  if (p <= 0.001) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {Array.from({ length: count }).map((_, i) => {
        const seed = `${seedBase}-local-${i}`;
        const r0 = random(seed);
        const r1 = random(`${seed}-r`);
        const local = Math.max(0, Math.min(1, (p - r0 * 0.3) / 0.7));
        const size = spread * (0.7 + r1 * 0.9);
        return (
          <div
            key={seed}
            style={{
              position: 'absolute',
              left: at.x - size / 2 + (r0 - 0.5) * spread + Math.sin((f + r0 * 90) / 80) * 12,
              top: at.y - local * rise * (0.4 + r0 * 0.8) - size * 0.45,
              width: size,
              height: size * (1.05 + r1 * 0.6),
              borderRadius: '50%',
              background: `radial-gradient(ellipse 52% 52% at 50% 50%, ${colors.paper} 0%, ${colors.paper} 52%, transparent 82%)`,
              filter: `blur(${20 + r1 * 18}px)`,
              opacity: local * (0.5 + r0 * 0.4) * strength,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
