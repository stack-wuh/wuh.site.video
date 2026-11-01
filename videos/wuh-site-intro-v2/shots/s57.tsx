/* 镜 57 · Act 8 此刻 · 局部帧 [0,96) · 96f
   光标在句末停住不闪（FN-14 停闪）；纸面右下落定一行小字「吴尒红 · stack-wuh · a boy just ~」，
   名字处一枚极小墨点落下（PT-01，与开篇第一滴墨同形同位置语言）；
   CM-11 微距先落款再缓拉至全纸面；末 20f 收黑（TR-24）只余墨点余光，7658f 交家族片尾；GR-02。 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, FILM_COLORS, cursorBlink, writeFade } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { DustField } from '../components/DustField';
import { PaperGrain } from '../components/PaperGrain';
import { Grade } from '../components/Grade';
import { Caption } from '../components/Caption';

const CLAMP = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const TEXT1 = '写作是抵抗遗忘的方式，';
const TEXT2 = '代码是构建世界的语言。';
const LINE1_Y = 380;
const LINE2_Y = 523;
const CHAR_W = 84;
const X0 = 498;
const SIGN = { x: 1352, y: 894 };
const LAND = 42;

const serif = fontFamilies.serif;

const ShotSignature: FC = () => {
  const frame = useCurrentFrame();
  /* 光标：首 12f 收尾一闪，随后停住不再闪 */
  const cursorOn = frame < 12 ? cursorBlink(frame, 0, 6, 1) : 1;
  /* 微距落款 → 缓拉全纸面 */
  const camScale = frame < 30 ? interpolate(frame, [0, 30], [1.07, 1.02], { ...CLAMP, easing: CURVES.cineEaseInOut }) : frame < 66 ? interpolate(frame, [30, 66], [1.02, 1], { ...CLAMP, easing: CURVES.cineEaseInOut }) : 1;
  const camOrigin = frame < 66 ? '76% 82%' : 'center';
  /* 落款小字与名字墨点 */
  const sign = writeFade(frame, 12, true);
  const dotP = interpolate(frame, [28, LAND], [0, 1], { ...CLAMP, easing: CURVES.cineEaseIn });
  const bloom = interpolate(frame, [LAND, LAND + 6], [0.2, 1], CLAMP);
  const dotIn = interpolate(frame, [LAND, LAND + 6], [0, 1], CLAMP);
  /* 末 20f 收黑，只余墨点余光（TR-24） */
  const dark = interpolate(frame, [76, 96], [0, 0.94], { ...CLAMP, easing: CURVES.cineEaseInOut });
  const brightness = interpolate(frame, [76, 96], [1, 0.06], { ...CLAMP, easing: CURVES.cineEaseInOut });
  const afterglowFade = interpolate(frame, [76, 96], [1, 0.32], { ...CLAMP, easing: CURVES.cineEaseInOut });
  const afterglow = dotIn * afterglowFade * (0.9 + 0.1 * Math.sin(frame / 6));

  return (
    <AbsoluteFill style={{ background: colors.paper }}>
      <div style={{ position: 'absolute', inset: 0, filter: `brightness(${brightness})` }}>
        <CameraRig cam={{ scale: camScale, x: 0, y: 0, rot: 0, origin: camOrigin }}>
          <AbsoluteFill>
            <DustField act={8} seedBase="s57" />
            {/* 句末光标（停住不闪） */}
            <div style={{ position: 'absolute', left: X0 + TEXT2.length * CHAR_W - 1.5, top: LINE2_Y + 41, width: 3, height: 60, background: colors.ink, opacity: cursorOn * 0.9 }} />
            {/* 题记整句（s56 停住的同一纸面） */}
            <div style={{ position: 'absolute', left: 0, right: 0, top: LINE1_Y, textAlign: 'center', fontFamily: serif, fontSize: 84, lineHeight: '143px', color: colors.ink, whiteSpace: 'pre' }}>{TEXT1}</div>
            <div style={{ position: 'absolute', left: 0, right: 0, top: LINE2_Y, textAlign: 'center', fontFamily: serif, fontSize: 84, lineHeight: '143px', color: colors.ink, whiteSpace: 'pre' }}>{TEXT2}</div>
            {/* 落款：纸面右下一行小字 */}
            <div style={{ ...sign, position: 'absolute', right: 170, top: 880, fontFamily: serif, fontSize: 27, letterSpacing: '0.1em', color: colors.ink, whiteSpace: 'nowrap' }}>
              吴尒红 · stack-wuh · a boy just ~
            </div>
            {/* 名字处极小墨点：下落 → 洇开 */}
            {frame >= 28 && frame < LAND + 8 ? (
              <div
                style={{
                  position: 'absolute',
                  left: SIGN.x - 3.5,
                  top: SIGN.y - 54 * (1 - dotP) - 3.5,
                  width: 7,
                  height: 9,
                  borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                  background: colors.ink,
                  opacity: Math.min(1, frame - 26),
                }}
              />
            ) : null}
            {frame >= LAND ? (
              <>
                {[2, 7].map((blur, i) => (
                  <div
                    key={blur}
                    style={{
                      position: 'absolute',
                      left: SIGN.x - 11,
                      top: SIGN.y - 10,
                      width: 22,
                      height: 19,
                      borderRadius: '50%',
                      background: colors.ink,
                      opacity: (i === 0 ? 0.85 : 0.3) * bloom,
                      filter: `blur(${blur}px)`,
                      transform: `scale(${0.6 + bloom * 0.4})`,
                    }}
                  />
                ))}
                {[0, 8].map((off) => {
                  const p = interpolate(frame - LAND - off, [0, 22], [0, 1], { ...CLAMP, easing: CURVES.cineEaseOut });
                  return p > 0 && p < 1 ? (
                    <div
                      key={off}
                      style={{
                        position: 'absolute',
                        left: SIGN.x - 10 - p * 16,
                        top: SIGN.y - 8 - p * 12,
                        width: 20 + p * 32,
                        height: 16 + p * 24,
                        borderRadius: '50%',
                        border: `1px solid ${colors.ink}`,
                        opacity: 0.4 * (1 - p),
                      }}
                    />
                  ) : null;
                })}
              </>
            ) : null}
          </AbsoluteFill>
        </CameraRig>
        <PaperGrain opacity={0.06} />
        <Grade id="GR-02" />
        <Caption text="吴尒红 · stack-wuh · a boy just ~" appearAt={28} />
      </div>
      {/* TR-24 收黑 */}
      <AbsoluteFill style={{ background: FILM_COLORS.nearBlack, opacity: dark }} />
      {/* 墨点余光将熄 */}
      <div
        style={{
          position: 'absolute',
          left: SIGN.x - 6,
          top: SIGN.y - 6,
          width: 12,
          height: 12,
          borderRadius: 6,
          background: colors.ink,
          boxShadow: `0 0 22px ${colors.accent}`,
          opacity: afterglow,
        }}
      />
    </AbsoluteFill>
  );
};

export default ShotSignature;
