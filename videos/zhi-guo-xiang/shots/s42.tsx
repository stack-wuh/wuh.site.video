import type { FC } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { CV, GRADES } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const GRADE = GRADES['GR-06'];

/**
 * S42（5-6 前段，5640–5700，60f）——禅房一面空墙，墙上多了一道横钉，钉上还空着；
 * 窗外的天色在墙上一格一格地走，末 20f 一道云影掠过墙面。
 * 固定平视、微距；TR-05 出镜：末 20f blur 0→8px，交给 S43 的 8→0 入镜。
 */
const S42: FC = () => {
  const frame = useCurrentFrame();
  const cell = Math.min(6, Math.floor(frame / 8));
  const cloud = CV.inOut(clamp01((frame - 40) / 20));
  const outBlur = 8 * cloud;
  const entry = CV.out(clamp01(frame / 8));
  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <CameraRig cam={{ scale: 1.14, x: 0, y: 0, rot: 0 }}>
        <AbsoluteFill style={{ filter: `blur(${outBlur}px) saturate(${GRADE.saturate})` }}>
          <AbsoluteFill style={{ background: `linear-gradient(180deg, ${colors.bgLift} 0%, ${colors.bg} 100%)` }} />
          <AbsoluteFill style={{ background: `linear-gradient(90deg, ${colors.muted} 0%, transparent 62%)`, opacity: 0.2 }} />
          {/* 窗外天光落在墙上：一格一格地走 */}
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: 480 + i * 320,
                top: 0,
                width: 320,
                height: 1080,
                background: `linear-gradient(90deg, transparent 0%, ${colors.paper} 50%, transparent 100%)`,
                opacity: 0.09,
                transform: `translateX(${cell * 52}px) skewX(-12deg)`,
              }}
            />
          ))}
          {/* 墙面的旧痕与接缝 */}
          {[300, 620, 900].map((y, i) => (
            <div key={y} style={{ position: 'absolute', left: 0, top: y, width: 1920, height: 1, background: colors.muted, opacity: 0.08 - i * 0.02 }} />
          ))}
          {[420, 1160, 1620].map((x) => (
            <div key={x} style={{ position: 'absolute', left: x, top: 0, width: 1, height: 1080, background: colors.ink, opacity: 0.1 }} />
          ))}
          {/* 一道横钉，钉上还空着 */}
          <div style={{ position: 'absolute', left: 800, top: 430, width: 190, height: 3, background: colors.ink }} />
          <div style={{ position: 'absolute', left: 800, top: 427, width: 190, height: 1, background: colors.paperMuted, opacity: 0.25 }} />
          <div style={{ position: 'absolute', left: 812, top: 437, width: 176, height: 2, background: colors.ink, opacity: 0.35 }} />
          <div style={{ position: 'absolute', left: 970, top: 424, width: 20, height: 15, borderRadius: 7, background: colors.ink }} />
          {/* 云影掠过墙面 */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: 2100,
              height: 1080,
              background: `linear-gradient(90deg, transparent 0%, ${colors.ink} 46%, ${colors.ink} 60%, transparent 100%)`,
              opacity: 0.11,
              transform: `translateX(${-1100 + 2200 * cloud}px)`,
            }}
          />
          <AbsoluteFill style={{ background: GRADE.base.color, mixBlendMode: GRADE.base.blend, opacity: GRADE.base.opacity }} />
        </AbsoluteFill>
      </CameraRig>
      {GRADE.veil ? <AbsoluteFill style={{ background: GRADE.veil.gradient, mixBlendMode: GRADE.veil.blend, opacity: GRADE.veil.opacity }} /> : null}
      {/* TR-02：8f 从空庭院溶解进屋 */}
      <AbsoluteFill style={{ background: colors.bg, opacity: 1 - entry }} />
    </AbsoluteFill>
  );
};

export default S42;
