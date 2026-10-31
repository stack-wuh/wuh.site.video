/* 镜 12 · Act 2 旧屋 · 局部帧 [0,180) · 180f
   遮罩纸页自折线展开为木桌俯拍：两摞纸 40f 推到中央，《搬山计划》竖排标题落定，宣言三列逐行浮现；
   尾段笔电掀盖、屏幕微亮（交接掀盖笔电）；字幕「五月，他写《搬山计划》：『除了工作就是工作，是时候做出一点点改变了，去玩生活去』」。 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, FILM_COLORS, letterpress, writeFade } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { Caption } from '../components/Caption';
import { DustField } from '../components/DustField';
import { PaperGrain } from '../components/PaperGrain';
import { Grade } from '../components/Grade';

const TITLE = ['《', '搬', '山', '计', '划', '》'];
const MANIFESTO = ['除了工作就是工作，', '是时候做出一点点改变了，', '去玩生活去'];

const ShotDeskPlan: FC = () => {
  const frame = useCurrentFrame();
  const unfold = interpolate(frame, [0, 30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const push = interpolate(frame, [26, 66], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const lidOpen = interpolate(frame, [152, 176], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  const cam = {
    scale: interpolate(frame, [0, 180], [1, 1.08], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }),
    x: 0,
    y: 0,
    rot: 0,
  };

  return (
    <AbsoluteFill>
      <CameraRig cam={cam}>
        <AbsoluteFill style={{ background: `linear-gradient(118deg, ${colors.bgLift} 0%, ${colors.accent} 46%, ${colors.bgLift} 100%)` }}>
          <AbsoluteFill style={{ backgroundImage: `repeating-linear-gradient(94deg, ${colors.ink} 0px, ${colors.ink} 1px, transparent 1px, transparent 38px)`, opacity: 0.05 }} />
          <AbsoluteFill style={{ backgroundImage: `linear-gradient(160deg, ${colors.gold} 0%, transparent 42%)`, opacity: 0.14, mixBlendMode: 'soft-light' }} />

          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: 214 + i * 10,
                top: 622 - i * 16,
                width: 156,
                height: 156,
                padding: 16,
                background: i === 2 ? FILM_COLORS.paperMist : colors.paperDeep,
                transform: `rotate(${-4 + i * 3}deg)`,
                boxShadow: `0 12px 26px ${colors.bg}`,
              }}
            >
              <div style={{ height: 8, width: 92, background: colors.ink, opacity: 0.2, marginBottom: 10 }} />
              <div style={{ height: 8, width: 116, background: colors.ink, opacity: 0.14 }} />
            </div>
          ))}

          <div style={{ position: 'absolute', left: 1508, top: 512, width: 236, height: 318, transform: 'rotate(-7deg)', borderRadius: 6, background: colors.seal, boxShadow: `0 24px 44px ${colors.bg}` }}>
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 14, borderRadius: '6px 0 0 6px', background: colors.bgLift, opacity: 0.5 }} />
            <div style={{ position: 'absolute', right: 0, top: 8, bottom: 8, width: 10, background: colors.paper, opacity: 0.75 }} />
            <div style={{ position: 'absolute', left: 38, top: 60, width: 120, height: 10, background: colors.gold, opacity: 0.9 }} />
            <div style={{ position: 'absolute', left: 38, top: 86, width: 84, height: 8, background: colors.gold, opacity: 0.55 }} />
            <div style={{ position: 'absolute', left: 38, top: 214, fontFamily: fontFamilies.serif, fontSize: 22, letterSpacing: '0.4em', color: colors.paper, opacity: 0.8 }}>诗集</div>
          </div>

          <div style={{ position: 'absolute', left: 1640, top: 812, width: 168, height: 168 }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: 84, background: colors.paperDeep, opacity: 0.9 }} />
            <div style={{ position: 'absolute', inset: 26, borderRadius: 58, background: colors.paper }} />
            <div style={{ position: 'absolute', inset: 42, borderRadius: 42, background: colors.accent, opacity: 0.85 }} />
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: 46 + i * 30,
                  top: -96,
                  width: 4,
                  height: 86,
                  borderRadius: 2,
                  background: colors.paper,
                  opacity: 0.26 - i * 0.05,
                  filter: 'blur(2px)',
                  transform: `translateY(${Math.sin((frame + i * 26) / 22) * 8}px) rotate(${Math.sin((frame + i * 30) / 30) * 6}deg)`,
                }}
              />
            ))}
          </div>

          <div style={{ position: 'absolute', left: 660, top: 300, width: 340, height: 520, transform: `translateX(${(1 - push) * -620}px)` }}>
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: i * 4,
                  top: i * 7,
                  width: 340 - i * 8,
                  height: 520 - i * 14,
                  background: i === 3 ? colors.paper : colors.paperDeep,
                  transform: `rotate(${(i - 1.5) * 0.7}deg)`,
                  boxShadow: i === 3 ? `0 18px 44px ${colors.bg}` : 'none',
                }}
              />
            ))}
            <div style={{ position: 'absolute', inset: '46px 34px', display: 'flex', flexDirection: 'row-reverse', gap: 24 }}>
              {MANIFESTO.map((line, i) => (
                <div
                  key={line}
                  style={{
                    writingMode: 'vertical-rl',
                    fontFamily: fontFamilies.serif,
                    fontSize: 27,
                    letterSpacing: '0.22em',
                    color: colors.ink,
                    height: '100%',
                    ...writeFade(frame, 104 + i * 22, true),
                  }}
                >
                  {line}
                </div>
              ))}
            </div>
          </div>

          <div style={{ position: 'absolute', left: 1080, top: 280, width: 420, height: 560, transform: `translateX(${(1 - push) * 620}px)` }}>
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: i * 5,
                  top: i * 7,
                  width: 420 - i * 10,
                  height: 560 - i * 14,
                  background: i === 3 ? colors.paper : colors.paperDeep,
                  transform: `rotate(${(i - 1.5) * -0.6}deg)`,
                  boxShadow: i === 3 ? `0 18px 44px ${colors.bg}` : 'none',
                }}
              />
            ))}
            <div style={{ position: 'absolute', inset: '54px 40px', display: 'flex', flexDirection: 'row-reverse' }}>
              <div style={{ writingMode: 'vertical-rl', fontFamily: fontFamilies.serif, fontSize: 56, letterSpacing: '0.1em', color: colors.ink }}>
                {TITLE.map((ch, i) => (
                  <span key={`${ch}-${i}`} style={{ display: 'inline-block', ...letterpress(frame, 58 + i * 5, 0) }}>
                    {ch}
                  </span>
                ))}
              </div>
              <div
                style={{
                  writingMode: 'vertical-rl',
                  fontFamily: fontFamilies.mono,
                  fontSize: 17,
                  letterSpacing: '0.2em',
                  color: colors.ink,
                  opacity: 0.35,
                  marginRight: 26,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                2021-05-07
              </div>
            </div>
          </div>

          <div style={{ position: 'absolute', left: 1180, top: 900, width: 420, height: 170 }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: 12, background: colors.bgLift, border: `1px solid ${colors.hairline}`, boxShadow: `0 18px 40px ${colors.bg}` }} />
            <div style={{ position: 'absolute', left: 24, top: 42, width: 372, height: 8, borderRadius: 2, background: colors.paper, opacity: 0.12 }} />
            <div style={{ position: 'absolute', left: 24, top: 66, width: 372, height: 8, borderRadius: 2, background: colors.paper, opacity: 0.08 }} />
            <div style={{ position: 'absolute', left: 34, top: -104, width: 352, height: 120, transform: `scaleY(${0.1 + lidOpen * 0.9})`, transformOrigin: 'bottom center' }}>
              <div style={{ position: 'absolute', inset: 0, borderRadius: 8, background: colors.bgLift, border: `1px solid ${colors.hairline}` }} />
              <div style={{ position: 'absolute', inset: 10, borderRadius: 4, background: colors.paperMist, opacity: 0.16 + lidOpen * 0.5 }} />
            </div>
          </div>
        </AbsoluteFill>

        {frame < 40
          ? [0, 1].map((half) => (
              <div
                key={half}
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: half === 0 ? 0 : 1190,
                  width: half === 0 ? 1190 : 730,
                  background: `linear-gradient(90deg, ${colors.paper} 0%, ${colors.paperDeep} 100%)`,
                  transform: `perspective(1600px) rotateY(${unfold * (half === 0 ? 82 : -82)}deg)`,
                  transformOrigin: half === 0 ? 'right center' : 'left center',
                  opacity: Math.max(0, 1 - unfold * 1.2),
                }}
              >
                <div style={{ position: 'absolute', top: 0, bottom: 0, ...(half === 0 ? { right: 0 } : { left: 0 }), width: 2, background: colors.ink, opacity: 0.14 }} />
              </div>
            ))
          : null}

        <DustField act={2} seedBase="s12" />
      </CameraRig>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 320, background: `linear-gradient(0deg, ${colors.bg} 0%, transparent 55%)`, opacity: 0.45, pointerEvents: 'none' }} />
      <PaperGrain opacity={0.06} />
      <Grade id="GR-04" />
      <Caption
        text="五月，他写《搬山计划》：『除了工作就是工作，是时候做出一点点改变了，去玩生活去』"
        appearAt={48}
      />
    </AbsoluteFill>
  );
};

export default ShotDeskPlan;
