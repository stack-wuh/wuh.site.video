/* s33 · 重试、子集、拆段拼，三级兜底救回来。（180f · 6.0s，Act 7 · 幕后）
 *
 * 三级兜底流程卡：三张步进卡「重试 → 子集 → 拆段拼」依次推进
 * （每步 MO-CARD-RISE 12f 入场 + 大箭头 8f 滑入），每步一行小注
 * （rerun failed / -f shots="s31" / artifact + 本地 concat），
 * 末步入场后描边点亮定场。入 cut / 出 cut。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CLAMP, MO_CARD, MO_EASE } from '../motion-tokens';
import { Caption } from '../components/Caption';

const DURATION = 180;
const ENTER_STEP = 50;

const STEPS = [
  { no: '01', title: '重试', note: 'rerun failed' },
  { no: '02', title: '子集', note: '-f shots="s31"' },
  { no: '03', title: '拆段拼', note: 'artifact + 本地 concat' },
] as const;

const S33: FC = () => {
  const f = useCurrentFrame();
  // 末步定场：描边点亮
  const finalGlow = interpolate(f, [140, 148], [0, 1], { ...CLAMP, easing: MO_EASE.out });

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 26,
        }}
      >
        {STEPS.map((step, i) => {
          const enterAt = 14 + i * ENTER_STEP;
          const rise = interpolate(f, [enterAt, enterAt + MO_CARD.riseFrames], [0, 1], {
            ...CLAMP,
            easing: MO_EASE.out,
          });
          const isLast = i === STEPS.length - 1;
          return (
            <div key={step.no} style={{ display: 'flex', alignItems: 'center', gap: 26 }}>
              <div
                style={{
                  position: 'relative',
                  width: 440,
                  height: 420,
                  background: colors.bgLift,
                  border: `1px solid ${colors.hairline}`,
                  borderRadius: 12,
                  padding: '36px 40px',
                  display: 'flex',
                  flexDirection: 'column',
                  opacity: rise,
                  transform: `translateY(${(1 - rise) * MO_CARD.riseShiftPx}px)`,
                }}
              >
                {/* 末步描边点亮（定场） */}
                {isLast && finalGlow > 0.01 ? (
                  <div
                    style={{
                      position: 'absolute',
                      inset: -1,
                      borderRadius: 12,
                      border: `2px solid ${colors.accent}`,
                      opacity: finalGlow * 0.85,
                      pointerEvents: 'none',
                    }}
                  />
                ) : null}
                <div style={{ fontFamily: fontFamilies.mono, fontSize: 24, letterSpacing: 6, color: colors.accent }}>
                  {step.no}
                </div>
                <div style={{ fontFamily: fontFamilies.serif, fontSize: 46, letterSpacing: 4, color: colors.paper, marginTop: 16 }}>
                  {step.title}
                </div>
                <div style={{ height: 1, background: colors.hairline, margin: '22px 0 0' }} />
                <div
                  style={{
                    marginTop: 'auto',
                    fontFamily: fontFamilies.mono,
                    fontSize: 20,
                    letterSpacing: 1,
                    color: colors.muted,
                  }}
                >
                  {step.note}
                </div>
              </div>
              {/* 大箭头：8f 滑入（最后一张卡后不再出箭头） */}
              {!isLast ? (
                (() => {
                  const arrowAt = enterAt + 20;
                  const k = interpolate(f, [arrowAt, arrowAt + 8], [0, 1], CLAMP);
                  return (
                    <div
                      style={{
                        fontFamily: fontFamilies.mono,
                        fontSize: 60,
                        color: colors.accent,
                        opacity: 0.85 * k,
                        transform: `translateX(${(1 - k) * -14}px)`,
                      }}
                    >
                      →
                    </div>
                  );
                })()
              ) : null}
            </div>
          );
        })}
      </div>

      <Caption
        text="重试、子集、拆段拼，三级兜底救回来。"
        start={12}
        end={168}
        duration={DURATION}
        inSide={0}
        outSide={0}
      />
    </AbsoluteFill>
  );
};

export default S33;
