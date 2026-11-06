/* D 组 · v11 共用：油灯灯焰 + 光晕（design-v11 §3.10 落盖「灯焰一晃」、§3.11「灯焰跳动 + 光晕呼吸」）。
 *
 * 底图（p-sword-case / p-paper-lamp）里灯焰是烤进去的静态像，这里只叠「会动的那一层」：
 *   ① 焰心微颤：三条不同周期的正弦叠加（确定性，无 Math.random），横向 0.8px、纵向 0.6px；
 *   ② 光晕呼吸：暖金径向光晕，半径与不透明度按 90f 周期起伏；
 *   ③ jolt：外部给 0–1 的冲击量（匣盖落下的那一下），让焰身被气流压一下、再晃回。
 * 颜色只取 brand/tokens 的 colors.paper / colors.gold 与 motion-tokens 的 FILM.fireGold。
 */
import type { FC } from 'react';
import { colors } from '../../../brand/tokens';
import { FILM } from '../motion-tokens';

export const LampFlame: FC<{
  frame: number;
  /** 焰心中心（1920×1080 底图坐标；调用方负责套上底图的 zoom） */
  at: { x: number; y: number };
  /** 焰高（px），p-sword-case ≈ 24，p-paper-lamp ≈ 46 */
  size?: number;
  /** 0–1：外部冲击（合匣落定），焰晃一下 */
  jolt?: number;
  /** 0–1：灯火更亮一档（匣面被照亮的那一拍） */
  boost?: number;
}> = ({ frame, at, size = 26, jolt = 0, boost = 0 }) => {
  const sec = frame / 30;
  /* 三条互质周期的正弦：像火，但完全可复现（同帧同像素） */
  const flick = 0.5 * Math.sin(sec * 13.1) + 0.3 * Math.sin(sec * 7.7 + 1.3) + 0.2 * Math.sin(sec * 21.3 + 0.7);
  const breath = 0.5 + 0.5 * Math.sin((frame / 90) * Math.PI * 2);
  const shakeX = Math.sin(frame * 2.2) * 2.6 * jolt;
  const shakeY = Math.cos(frame * 2.6) * 1.8 * jolt;
  const stretch = 1 + 0.05 * flick - 0.22 * jolt;
  const glow = 0.13 + 0.05 * flick + 0.05 * breath + 0.16 * jolt + 0.06 * boost;
  const halo = 0.05 + 0.025 * breath + 0.05 * boost;

  return (
    <>
      {/* 远光晕：呼吸的外圈（半透明 screen，叠在底图的暖光上） */}
      <div
        style={{
          position: 'absolute',
          left: at.x - size * 7,
          top: at.y - size * 6.4,
          width: size * 14,
          height: size * 12.8,
          borderRadius: '50%',
          background: `radial-gradient(ellipse at 50% 50%, ${FILM.fireGold} 0%, transparent 62%)`,
          mixBlendMode: 'screen',
          opacity: halo,
        }}
      />
      {/* 近光晕：压着灯焰的那一圈暖光 */}
      <div
        style={{
          position: 'absolute',
          left: at.x - size * 2.8 + shakeX,
          top: at.y - size * 2.6 + shakeY,
          width: size * 5.6,
          height: size * 5.2,
          borderRadius: '50%',
          background: `radial-gradient(ellipse at 50% 50%, ${colors.gold} 0%, ${FILM.fireGold} 28%, transparent 68%)`,
          mixBlendMode: 'screen',
          opacity: glow,
        }}
      />
      {/* 焰身：白心 → 火金的泪滴；只补动态，不重画底图那支焰 */}
      <svg
        width={size * 3}
        height={size * 4}
        viewBox="-30 -60 60 80"
        style={{
          position: 'absolute',
          left: at.x - size * 1.5 + shakeX * 0.7,
          top: at.y - size * 1.5 + shakeY * 0.7,
          overflow: 'visible',
          mixBlendMode: 'screen',
          opacity: 0.17 + 0.1 * flick + 0.12 * jolt + 0.06 * boost,
          transform: `scaleY(${stretch})`,
          transformOrigin: '50% 62%',
        }}
      >
        <defs>
          <linearGradient id="d-flame-core" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={colors.paper} stopOpacity={0.9} />
            <stop offset="0.45" stopColor={colors.gold} stopOpacity={0.85} />
            <stop offset="1" stopColor={FILM.fireGold} stopOpacity={0.25} />
          </linearGradient>
        </defs>
        <path d="M0 -46 Q13 -18 9 2 Q6 16 0 18 Q-6 16 -9 2 Q-13 -18 0 -46 Z" fill="url(#d-flame-core)" />
        <path d="M0 -22 Q5 -6 3 4 Q1 11 0 12 Q-1 11 -3 4 Q-5 -6 0 -22 Z" fill={colors.paper} opacity={0.55} />
      </svg>
    </>
  );
};