import type { FC } from 'react';
import { AbsoluteFill, interpolate, random, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { CLAMP, CM, CV, GRADES, STROKE } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { CrowdFigure } from '../components/Figure';
import { DustField } from '../components/DustField';

/**
 * 镜 28 · 说书桌（local 0–79）· 无字幕。
 * CM-09 固定中景微距；FG-18 街面只给剪影；说书人不在场——桌后空着。
 * 末 20f 一只手把一张纸推上桌（FN-23 paper-action 的推入）；GR-01 纸白。
 */
const S28: FC = () => {
  const frame = useCurrentFrame();
  const cam = CM.macro(frame, 80, 1.04, 1.08);
  const push = interpolate(frame, [58, 74], [0, 1], { ...CLAMP, easing: CV.out });
  const grade = GRADES['GR-01'];
  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <CameraRig cam={cam}>
        <AbsoluteFill style={{ background: colors.paper }} />
        {Array.from({ length: 16 }).map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: random(`s28-fiber-${i}`) * 1920,
              top: random(`s28-fiber-${i}-y`) * 1080,
              width: 20 + random(`s28-fiber-${i}-w`) * 30,
              height: 1,
              background: colors.muted,
              opacity: 0.06,
            }}
          />
        ))}
        {/* 街面与人影：只有剪影，色温压暗 */}
        <div style={{ position: 'absolute', inset: 0, transform: `translateX(${-frame * 0.5}px)` }}>
          <div style={{ position: 'absolute', left: -80, top: 606, width: 2400, height: 1, background: colors.muted, opacity: 0.35 }} />
          <CrowdFigure count={14} opacity={0.12} style={{ top: 300, height: 380, filter: 'blur(4px)' }} />
        </div>
        {/* 说书桌 */}
        <div style={{ position: 'absolute', left: 360, top: 700, width: 1200, height: 26, background: colors.ink }} />
        <div style={{ position: 'absolute', left: 470, top: 726, width: 20, height: 354, background: colors.ink, opacity: 0.85 }} />
        <div style={{ position: 'absolute', left: 1430, top: 726, width: 20, height: 354, background: colors.ink, opacity: 0.85 }} />
        {/* 桌上一叠传抄的纸页 */}
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 660 + i * 4,
              top: 674 - i * 4,
              width: 360,
              height: 26,
              background: i === 6 ? colors.paperDeep : colors.paperMuted,
              border: `1px solid ${colors.ink}`,
              opacity: 0.95,
            }}
          />
        ))}
        {Array.from({ length: 6 }).map((_, c) =>
          Array.from({ length: 3 }).map((_, r) => (
            <div key={`${c}-${r}`} style={{ position: 'absolute', left: 684 + c * 52, top: 656 + r * 7, width: 30, height: 1, background: colors.ink, opacity: 0.4 }} />
          )),
        )}
        {/* 醒木 */}
        <div style={{ position: 'absolute', left: 1440, top: 650, width: 96, height: 32, background: colors.ink }} />
        <div style={{ position: 'absolute', left: 1446, top: 654, width: 84, height: 2, background: colors.paperMuted, opacity: 0.5 }} />
        {/* 末 20f：一只手把一张纸推入画面 */}
        <div
          style={{
            position: 'absolute',
            left: 900 + (1 - push) * 760,
            top: 636 - (1 - push) * 26,
            width: 300,
            height: 46,
            background: colors.paperDeep,
            border: `1px solid ${colors.ink}`,
            transform: `rotate(${(1 - push) * -8}deg)`,
          }}
        />
        <div style={{ position: 'absolute', left: 1200 + (1 - push) * 700, top: 618 - (1 - push) * 36 }}>
          <svg viewBox="0 0 220 120" style={{ width: 220, height: 120 }}>
            <path d="M40 60 Q60 18 120 20 L200 24 L200 96 L120 96 Q60 96 40 60 Z" fill={colors.paper} stroke={colors.ink} strokeWidth={STROKE.S1} />
            <path d="M60 44 Q96 30 130 34 M60 62 Q98 50 132 54" fill="none" stroke={colors.ink} strokeWidth={STROKE.S1} opacity={0.5} />
          </svg>
        </div>
      </CameraRig>
      <DustField act={4} count={10} seedBase="s28" />
      <AbsoluteFill style={{ background: grade.base.color, mixBlendMode: grade.base.blend, opacity: grade.base.opacity }} />
      {grade.veil ? <AbsoluteFill style={{ background: grade.veil.gradient, mixBlendMode: grade.veil.blend, opacity: grade.veil.opacity }} /> : null}
    </AbsoluteFill>
  );
};

export default S28;
