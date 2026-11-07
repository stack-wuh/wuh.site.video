/* s28 · 倒数第二版，我自己的声音进来了。（165f · 5.5s，Act 6 · 声音的进化）
 *
 * 录音花絮三连卡：A1/A2/A3 三张波形卡依次落下（MO-CARD-RISE 12f ×3，间隔 38f），
 * 每张卡内静态波形（random(seed) 一次算定）+ 呼吸律动（sin，确定性相位），
 * 卡上小字「自己的声音 · full」「开头」「结尾」。
 * 入 cut / 出 cut。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, random, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CLAMP, MO_CARD, MO_CHART, MO_EASE } from '../motion-tokens';
import { Caption } from '../components/Caption';

const DURATION = 165;
const BAR_COUNT = 24;
const ENTER_STEP = 38;

const CARDS = [
  { id: 'A1', label: '自己的声音 · full' },
  { id: 'A2', label: '开头' },
  { id: 'A3', label: '结尾' },
] as const;

/** 静态波形基高（确定性，模块级一次算定） */
const BAR_BASE = CARDS.map((_, card) =>
  Array.from({ length: BAR_COUNT }, (_, i) => 14 + random(`s28-wav-${card}-${i}`) * 120),
);

const S28: FC = () => {
  const f = useCurrentFrame();

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 56,
        }}
      >
        {CARDS.map((card, ci) => {
          const enterAt = 10 + ci * ENTER_STEP;
          const rise = interpolate(f, [enterAt, enterAt + MO_CARD.riseFrames], [0, 1], {
            ...CLAMP,
            easing: MO_EASE.out,
          });
          // 全卡呼吸：波形的整体明暗（sin，确定性）
          const breathe = 0.5 + 0.5 * Math.sin(f * 0.12 + ci * 1.9);
          return (
            <div
              key={card.id}
              style={{
                width: 460,
                height: 440,
                background: colors.bgLift,
                border: `1px solid ${colors.hairline}`,
                borderRadius: 10,
                padding: '30px 40px',
                display: 'flex',
                flexDirection: 'column',
                opacity: rise,
                transform: `translateY(${(1 - rise) * MO_CARD.riseShiftPx}px)`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                <div style={{ fontFamily: fontFamilies.mono, fontSize: 32, letterSpacing: 4, color: colors.accent }}>
                  {card.id}
                </div>
                <div style={{ fontFamily: fontFamilies.mono, fontSize: 18, letterSpacing: 2, color: colors.muted }}>
                  {card.label}
                </div>
              </div>
              <div style={{ height: 1, background: colors.hairline, margin: '20px 0 0' }} />
              {/* 静态波形 + 呼吸律动 */}
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                }}
              >
                {BAR_BASE[ci].map((base, i) => {
                  const h = base * (1 + 0.13 * Math.sin(f * 0.16 + i * 0.52 + ci * 1.7));
                  /* MO-CHART-GROW：卡落定后波形从中线错峰生长（凡量必动） */
                  const g0 = enterAt + MO_CARD.riseFrames + i * 1;
                  const grow = interpolate(f, [g0, g0 + MO_CHART.growFrames], [0, 1], { ...CLAMP, easing: MO_EASE.out });
                  return (
                    <div
                      key={i}
                      style={{
                        width: 10,
                        height: Math.max(2, h * grow),
                        borderRadius: 5,
                        background: colors.paper,
                        opacity: 0.32 + 0.22 * breathe,
                      }}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <Caption
        text="倒数第二版，我自己的声音进来了。"
        start={12}
        end={153}
        duration={DURATION}
        inSide={0}
        outSide={0}
      />
    </AbsoluteFill>
  );
};

export default S28;
