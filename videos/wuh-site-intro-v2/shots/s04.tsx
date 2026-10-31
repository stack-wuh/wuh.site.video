/* 镜 04 · Act 1 墨点 · 局部帧 [0,72) · 72f
   双日期纸卡 0–12f 翻面（FN-23）成 2020-04 日历页；计数器 30→0 分两段先快后慢
   （FN-19），70f 归零定格（全局 466f，锚点 ±2f）；旧站线框未亮、冷灰微光 GR-05。 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, FILM_COLORS, counterFlip, pageFlip } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { Caption } from '../components/Caption';
import { DustField } from '../components/DustField';
import { PaperGrain } from '../components/PaperGrain';
import { Grade } from '../components/Grade';

const CARD = { left: 470, top: 250, width: 980, height: 560 };
const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const ShotCountdown: FC = () => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, 72], [1.03, 1.06], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const stageOne = counterFlip(frame, 8, 46, 30, 6);
  const stageTwo = counterFlip(frame, 56, 14, 6, 0);
  const spin = counterFlip(frame, 8, 62, 30, 0);
  const value = frame >= 56 ? stageTwo.value : stageOne.value;
  const flip = spin.flip;
  const page = interpolate(frame, [4, 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  const wire = interpolate(frame, [56, 72], [0.06, 0.16], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });

  return (
    <AbsoluteFill style={{ background: colors.paper }}>
      <CameraRig cam={{ scale, x: 0, y: 0, rot: 0 }}>
        <AbsoluteFill>
          <DustField act={1} count={40} seedBase="s04" />
          <div style={{ position: 'absolute', left: 60, top: 60, right: 60, bottom: 60, opacity: page }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: 6, background: colors.paper, border: `1px solid ${colors.paperMuted}` }} />
            {/* 旧站线框：尚未点亮 */}
            <div style={{ position: 'absolute', left: 60, top: 56, width: 1680, height: 30, border: `1px solid ${colors.muted}`, opacity: 0.16 }} />
            <div style={{ position: 'absolute', right: 70, top: 340, width: 300, height: 200, border: `1px solid ${colors.muted}`, opacity: 0.12 }} />
            <div style={{ position: 'absolute', right: 70, top: 580, width: 300, height: 120, border: `1px solid ${colors.muted}`, opacity: 0.12 }} />
            <div style={{ position: 'absolute', left: 80, top: 70, display: 'flex', alignItems: 'baseline', gap: 18 }}>
              <span style={{ fontFamily: fontFamilies.serif, fontSize: 92, color: colors.ink, fontVariantNumeric: 'tabular-nums' }}>2020</span>
              <span style={{ fontFamily: fontFamilies.serif, fontSize: 92, color: colors.muted }}>·</span>
              <span style={{ fontFamily: fontFamilies.serif, fontSize: 92, color: colors.ink, fontVariantNumeric: 'tabular-nums' }}>04</span>
            </div>
            <div style={{ position: 'absolute', left: 445, top: 230, width: 910, height: 420 }}>
              {WEEKDAYS.map((w, i) => (
                <span
                  key={i}
                  style={{
                    position: 'absolute',
                    left: i * 130,
                    top: 0,
                    width: 130,
                    textAlign: 'center',
                    fontFamily: fontFamilies.mono,
                    fontSize: 18,
                    color: colors.muted,
                    opacity: 0.7,
                  }}
                >
                  {w}
                </span>
              ))}
              {Array.from({ length: 35 }).map((_, i) => {
                const day = i - 3 + 1;
                return day >= 1 && day <= 30 ? (
                  <span
                    key={i}
                    style={{
                      position: 'absolute',
                      left: (i % 7) * 130,
                      top: 44 + Math.floor(i / 7) * 74,
                      width: 130,
                      height: 60,
                      textAlign: 'center',
                      lineHeight: '60px',
                      fontFamily: fontFamilies.mono,
                      fontSize: 22,
                      color: colors.ink,
                      opacity: 0.55,
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {day}
                  </span>
                ) : null;
              })}
            </div>
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 660,
                textAlign: 'center',
                fontFamily: fontFamilies.serif,
                fontSize: 210,
                lineHeight: 1,
                color: colors.ink,
                fontVariantNumeric: 'tabular-nums',
                transform: `perspective(900px) rotateX(${flip}deg)`,
              }}
            >
              {value}
            </div>
            {/* 冷线框微光：尾帧交接用 */}
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                height: 240,
                backgroundImage: `linear-gradient(0deg, ${FILM_COLORS.wireGrey}, transparent)`,
                opacity: wire,
              }}
            />
          </div>
          {/* 承接 S3 双日期冻帧：翻面退场 */}
          {frame < 13 ? (
            <div style={{ position: 'absolute', left: CARD.left, top: CARD.top, width: CARD.width, height: CARD.height, perspective: 1400 }}>
              <div style={{ position: 'absolute', inset: 0, transform: 'rotateY(-4deg)', transformOrigin: 'left center' }}>
                <div style={{ position: 'absolute', inset: 0, ...pageFlip(frame, 0, 12, 'left') }}>
                  <div style={{ position: 'absolute', inset: 0, transform: 'translateY(14px)', background: colors.bg, opacity: 0.1, filter: 'blur(16px)' }} />
                  <div style={{ position: 'absolute', inset: 0, borderRadius: 6, background: colors.paperDeep, border: `1px solid ${colors.paperMuted}` }} />
                  <div style={{ position: 'absolute', left: 60, top: 44, display: 'flex', alignItems: 'baseline', gap: 18 }}>
                    <span style={{ fontFamily: fontFamilies.mono, fontSize: 24, color: colors.muted, fontVariantNumeric: 'tabular-nums' }}>2018-08-05</span>
                    <span style={{ fontFamily: fontFamilies.serif, fontSize: 40, color: colors.ink }}>【开篇】</span>
                  </div>
                  <div style={{ position: 'absolute', left: 60, right: 60, top: 128, height: 1, background: colors.muted, opacity: 0.45 }} />
                  <div style={{ position: 'absolute', left: 60, top: 168, width: 560, height: 12, background: colors.ink, opacity: 0.35 }} />
                  {[0, 1, 2].map((i) => (
                    <div key={i} style={{ position: 'absolute', left: 60, top: 206 + i * 30, width: 700 - i * 90, height: 7, background: colors.muted, opacity: 0.28 }} />
                  ))}
                  <div style={{ position: 'absolute', left: 150, top: 320, width: 190, height: 190, borderRadius: 8, background: colors.seal }}>
                    <span style={{ position: 'absolute', left: 0, right: 0, top: 64, textAlign: 'center', fontFamily: fontFamilies.serif, fontSize: 26, color: colors.paper }}>发布</span>
                    <span style={{ position: 'absolute', left: 0, right: 0, top: 116, textAlign: 'center', fontFamily: fontFamilies.mono, fontSize: 20, color: colors.paper, fontVariantNumeric: 'tabular-nums' }}>2019-07-26</span>
                  </div>
                  <div style={{ position: 'absolute', left: 640, top: 320, width: 190, height: 190, borderRadius: 8, background: colors.seal }}>
                    <span style={{ position: 'absolute', left: 0, right: 0, top: 64, textAlign: 'center', fontFamily: fontFamilies.serif, fontSize: 26, color: colors.paper }}>正文落款</span>
                    <span style={{ position: 'absolute', left: 0, right: 0, top: 116, textAlign: 'center', fontFamily: fontFamilies.mono, fontSize: 20, color: colors.paper, fontVariantNumeric: 'tabular-nums' }}>2018-08-05</span>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </AbsoluteFill>
      </CameraRig>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 320,
          backgroundImage: `linear-gradient(180deg, transparent, ${colors.bg})`,
          opacity: 0.2,
        }}
      />
      <PaperGrain opacity={0.07} />
      <Grade id="GR-05" />
      <Caption text="2020 年 4 月，他用 30 天" />
    </AbsoluteFill>
  );
};

export default ShotCountdown;
