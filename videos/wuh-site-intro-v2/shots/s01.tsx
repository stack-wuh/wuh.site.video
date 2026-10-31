/* 镜 01 · Act 1 墨点 · 局部帧 [0,120) · 120f
   一滴墨悬于画面上缘，50–80f 自由落体（CV-02），80f 触纸洇开 6f + 双涟漪 24f；
   CM-03 极缓推 100→103%，PT-05 极稀光尘，GR-01 暖黑；无字幕。 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { CURVES } from '../motion-tokens';
import { DustField } from '../components/DustField';
import { PaperGrain } from '../components/PaperGrain';
import { Grade } from '../components/Grade';

const INK_X = 760;
const INK_Y = 700;
const LAND = 80;

const ShotInkDrop: FC = () => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, 120], [1, 1.03], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const fall = interpolate(frame, [50, LAND], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseIn });
  const dropletY = 96 + fall * (INK_Y - 96);
  const bloom = interpolate(frame, [LAND, LAND + 6], [0.2, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  const ripple = (offset: number) => interpolate(frame - LAND - offset, [0, 24], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `scale(${scale})`, transformOrigin: 'center' }}>
        <DustField act={1} count={40} seedBase="s01" />
        {frame < LAND + 2 ? (
          <div
            style={{
              position: 'absolute',
              left: INK_X - 9,
              top: dropletY - 14,
              width: 18,
              height: 26,
              borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
              background: colors.ink,
            }}
          />
        ) : null}
        {frame >= LAND ? (
          <>
            {[0, 6, 12].map((blur, i) => (
              <div
                key={blur}
                style={{
                  position: 'absolute',
                  left: INK_X - 34,
                  top: INK_Y - 30,
                  width: 68,
                  height: 60,
                  borderRadius: '50%',
                  background: colors.ink,
                  opacity: (i === 0 ? 0.9 : 0.35) * bloom,
                  filter: `blur(${blur === 0 ? 2 : blur === 6 ? 6 : 12}px)`,
                  transform: `scale(${0.6 + bloom * 0.4})`,
                }}
              />
            ))}
            {[0, 8].map((off) => {
              const p = ripple(off);
              return p > 0 && p < 1 ? (
                <div
                  key={off}
                  style={{
                    position: 'absolute',
                    left: INK_X - 30 - p * 70,
                    top: INK_Y - 26 - p * 50,
                    width: 60 + p * 140,
                    height: 52 + p * 110,
                    borderRadius: '50%',
                    border: `1px solid ${colors.ink}`,
                    opacity: 0.45 * (1 - p),
                  }}
                />
              ) : null;
            })}
          </>
        ) : null}
      </AbsoluteFill>
      <PaperGrain opacity={0.07} />
      <Grade id="GR-01" />
    </AbsoluteFill>
  );
};

export default ShotInkDrop;
