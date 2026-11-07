/* s34 · 平时改一镜、看一帧，从不重渲整片。（165f · 5.5s，Act 7 · 幕后）
 *
 * CI 卡样片子集：标题「workflow_dispatch · shots 子集」，两格方块「s06」「s21」
 * 按 MO-GRID-LIGHT 先暗后亮（波次间隔 6f，点亮过渡 4f，微弹定住）；
 * 下方小字「run 41285587793 · 两镜 ≈ 两分钟」。入 cut / 出 cut。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CLAMP, MO_EASE, MO_GRID } from '../motion-tokens';
import { Caption } from '../components/Caption';

const DURATION = 165;
const LIT_START = 36; // s06 点亮时刻；s21 = +MO_GRID.waveStep

const SHOTS = ['s06', 's21'] as const;

const S34: FC = () => {
  const f = useCurrentFrame();
  const titleIn = interpolate(f, [8, 14], [0, 1], { ...CLAMP, easing: MO_EASE.out });
  const subIn = interpolate(f, [64, 70], [0, 1], { ...CLAMP, easing: MO_EASE.out });

  return (
    <AbsoluteFill style={{ background: colors.bgLift }}>
      {/* 标题 */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 240,
          textAlign: 'center',
          fontFamily: fontFamilies.mono,
          fontSize: 26,
          letterSpacing: 5,
          color: colors.accent,
          opacity: titleIn,
        }}
      >
        workflow_dispatch · shots 子集
      </div>

      {/* 两格方块：先暗后亮（MO-GRID-LIGHT） */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 400,
          display: 'flex',
          justifyContent: 'center',
          gap: 120,
        }}
      >
        {SHOTS.map((id, i) => {
          const litAt = LIT_START + i * MO_GRID.waveStep;
          const lit = interpolate(f, [litAt, litAt + MO_GRID.greenFrames], [0, 1], CLAMP);
          const pop = interpolate(f, [litAt, litAt + MO_GRID.greenFrames], [0.96, 1], {
            ...CLAMP,
            easing: MO_EASE.out,
          });
          return (
            <div
              key={id}
              style={{
                position: 'relative',
                width: 260,
                height: 260,
                borderRadius: 12,
                background: colors.bg,
                border: `1px solid ${colors.hairline}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: `scale(${pop})`,
              }}
            >
              <div style={{ fontFamily: fontFamilies.mono, fontSize: 44, letterSpacing: 3, color: colors.muted }}>{id}</div>
              {/* 点亮层：金格 + 墨字，4f 显影 */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: 12,
                  background: colors.gold,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: lit,
                }}
              >
                <div style={{ fontFamily: fontFamilies.mono, fontSize: 44, letterSpacing: 3, color: colors.ink }}>{id}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 下方小字 */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 760,
          textAlign: 'center',
          fontFamily: fontFamilies.mono,
          fontSize: 22,
          letterSpacing: 3,
          color: colors.muted,
          opacity: subIn,
        }}
      >
        run 41285587793 · 两镜 ≈ 两分钟
      </div>

      <Caption
        text="平时改一镜、看一帧，从不重渲整片。"
        start={12}
        end={153}
        duration={DURATION}
        inSide={0}
        outSide={0}
      />
    </AbsoluteFill>
  );
};

export default S34;
