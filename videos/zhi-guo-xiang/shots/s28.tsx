/* 镜 28 · 幕四 说书桌 · local [0,80) · 80f
   市井一角：一张说书桌，桌上一叠传抄的纸页、一块醒木；桌后空着；街上人来人往只有剪影。
   末 20f 一只手把一张纸推入画面。 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { ArtBase } from '../components/ArtBase';

const S28: FC = () => {
  const f = useCurrentFrame();
  const pushIn = interpolate(f, [0, 80], [1.0, 1.05], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const paperIn = interpolate(f, [56, 76], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <ArtBase name="g10" zoom={[1.0, 1.02]}>
        <div style={{ position: 'absolute', inset: 0, transform: `scale(${pushIn})`, transformOrigin: '54% 58%' }} />
        <div
          style={{
            position: 'absolute',
            right: '18%',
            bottom: '26%',
            width: 220,
            height: 90,
            background: colors.paper,
            border: `1px solid ${colors.muted}`,
            opacity: 0.9 * paperIn,
            transform: `translateX(${(1 - paperIn) * 160}px) rotate(-4deg)`,
            boxShadow: `0 2px 10px rgba(0,0,0,0.18)`,
          }}
        />
      </ArtBase>
      <AbsoluteFill style={{ background: colors.ink, opacity: 0.1 }} />
    </AbsoluteFill>
  );
};

export default S28;
