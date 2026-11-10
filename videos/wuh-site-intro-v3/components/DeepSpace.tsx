import type { FC } from 'react';
import { AbsoluteFill, interpolate, random, useCurrentFrame } from 'remotion';
import { noise2D } from '@remotion/noise';
import { FILM_COLORS2 } from '../motion-tokens';

/**
 * V2 深空底（2026-11-10 科技感重构）：深空渐变 + 星点粒子场 + 微网格 + 扫描线 + 暗角。
 * 确定性：星点 random(seed)，漂移 noise2D 三参——同 bundle 同帧同像素。
 * 用法：<DeepSpace seed="s01" stars={64} grid />  —— 镜自带完整像素（本组件即底色层）。
 */
export const DeepSpace: FC<{
  seed: string;
  stars?: number;
  grid?: boolean;
  /** 底部网格透视地面（年度报告舞台感） */
  horizon?: boolean;
  vignette?: number;
}> = ({ seed, stars = 64, grid = true, horizon = false, vignette = 0.55 }) => {
  const frame = useCurrentFrame();

  /* 星点：两层纵深——远层小而密（慢闪），近层大而疏（noise 漂移） */
  const far = Array.from({ length: Math.floor(stars * 0.7) }, (_, i) => ({
    x: random(`${seed}-fx${i}`) * 100,
    y: random(`${seed}-fy${i}`) * 100,
    r: 0.8 + random(`${seed}-fr${i}`) * 1.2,
    phase: random(`${seed}-fp${i}`) * Math.PI * 2,
    speed: 3 + random(`${seed}-fs${i}`) * 4,
    base: 0.25 + random(`${seed}-fb${i}`) * 0.4,
  }));
  const near = Array.from({ length: Math.ceil(stars * 0.3) }, (_, i) => ({
    x: random(`${seed}-nx${i}`) * 100,
    y: random(`${seed}-ny${i}`) * 100,
    r: 1.6 + random(`${seed}-nr${i}`) * 1.8,
    phase: random(`${seed}-np${i}`) * Math.PI * 2,
    speed: 2 + random(`${seed}-ns${i}`) * 3,
    base: 0.4 + random(`${seed}-nb${i}`) * 0.45,
    dx: noise2D(`${seed}-ndx`, i / 3, frame / 240) * 6,
    dy: noise2D(`${seed}-ndy`, i / 3, frame / 240) * 4,
  }));
  /* 数据流星：3 条极淡的横划线，随机时刻掠过（信息流速感） */
  const streaks = Array.from({ length: 3 }, (_, i) => {
    const cycle = 210 + i * 90;
    const t = (frame + i * 70) % cycle;
    const y = 12 + random(`${seed}-sk-y${i}`) * 70;
    const x = interpolate(t, [0, cycle * 0.45, cycle], [-8, 108, 108], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    const o = interpolate(t, [0, cycle * 0.16, cycle * 0.4, cycle * 0.45], [0, 0.5, 0.12, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) * 0.35;
    return { key: i, y, x, o };
  });

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {/* 深空渐变底（中心微亮的蓝黑） */}
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 130% 100% at 50% 42%, #0A1018 0%, ${FILM_COLORS2.space} 52%, ${FILM_COLORS2.spaceDeep} 100%)` }} />

      {/* 微网格（年度报告坐标纸感，极淡） */}
      {grid ? (
        <AbsoluteFill
          style={{
            backgroundImage: `linear-gradient(${FILM_COLORS2.grid} 1px, transparent 1px), linear-gradient(90deg, ${FILM_COLORS2.grid} 1px, transparent 1px)`,
            backgroundSize: '96px 96px',
            opacity: 0.5,
            maskImage: 'radial-gradient(ellipse 100% 88% at 50% 46%, black 30%, transparent 88%)',
            WebkitMaskImage: 'radial-gradient(ellipse 100% 88% at 50% 46%, black 30%, transparent 88%)',
          }}
        />
      ) : null}

      {/* 透视地平网格（舞台地面，horizon 镜用） */}
      {horizon ? (
        <div
          style={{
            position: 'absolute',
            left: '-30%',
            right: '-30%',
            bottom: 0,
            height: 300,
            backgroundImage: `linear-gradient(90deg, ${FILM_COLORS2.grid} 1px, transparent 1px)`,
            backgroundSize: '140px 100%',
            transform: 'perspective(700px) rotateX(58deg)',
            transformOrigin: 'bottom center',
            maskImage: 'linear-gradient(180deg, transparent, black 42%)',
            WebkitMaskImage: 'linear-gradient(180deg, transparent, black 42%)',
            opacity: 0.8,
          }}
        />
      ) : null}

      {/* 星点场 */}
      <AbsoluteFill>
        {far.map((s, i) => (
          <div
            key={`f${i}`}
            style={{
              position: 'absolute',
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: s.r * 2,
              height: s.r * 2,
              borderRadius: s.r,
              background: FILM_COLORS2.dataWhite,
              opacity: s.base * (0.72 + 0.28 * Math.sin((frame / s.speed) * Math.PI * 2 + s.phase)),
            }}
          />
        ))}
        {near.map((s, i) => (
          <div
            key={`n${i}`}
            style={{
              position: 'absolute',
              left: `calc(${s.x}% + ${s.dx}px)`,
              top: `calc(${s.y}% + ${s.dy}px)`,
              width: s.r * 2,
              height: s.r * 2,
              borderRadius: s.r,
              background: i % 4 === 0 ? FILM_COLORS2.cyan : FILM_COLORS2.dataWhite,
              boxShadow: i % 4 === 0 ? `0 0 8px 1px rgba(95,216,255,0.5)` : 'none',
              opacity: s.base * (0.7 + 0.3 * Math.sin((frame / s.speed) * Math.PI * 2 + s.phase)),
            }}
          />
        ))}
      </AbsoluteFill>

      {/* 数据流星 */}
      <AbsoluteFill>
        {streaks.map((s) => (
          <div
            key={s.key}
            style={{
              position: 'absolute',
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: 90,
              height: 1.5,
              borderRadius: 1,
              background: `linear-gradient(90deg, transparent, ${FILM_COLORS2.cyan})`,
              opacity: s.o,
            }}
          />
        ))}
      </AbsoluteFill>

      {/* 扫描线：一条极淡亮线每 ~4.5s 扫过全屏 */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: `${(frame * (100 / 135)) % 112 - 6}%`,
          height: 2,
          background: `linear-gradient(180deg, transparent, rgba(95,216,255,0.10), transparent)`,
          opacity: 0.7,
        }}
      />

      {/* 暗角 */}
      <AbsoluteFill style={{ backgroundImage: `radial-gradient(ellipse 118% 96% at 50% 46%, rgba(2,3,8,0) 54%, rgba(2,3,8,${vignette * 0.62}) 88%, rgba(2,3,8,${vignette}) 100%)` }} />
    </AbsoluteFill>
  );
};
