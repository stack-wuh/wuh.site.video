import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { colors, fontFamilies } from '../tokens';
import { CURVES, TYPE, sealStamp, sealTilt, writeFade } from '../motion';
import { BrandDust, CLAMP } from './dust';
import type { FilmMeta } from './identity';

const serif = fontFamilies.serif;
const mono = fontFamilies.mono;
const MOTTO = '写作是抵抗遗忘的方式，代码是构建世界的语言。';

/** 片尾 180f：钤印浮现（4）→ 站训打字（40–106）→ 署名行（104–140）→ 光尘收束（128–168）→ 墨点收黑（158–180） */
export const BrandOutro: FC<{ meta: FilmMeta }> = ({ meta }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const chars = Math.min(MOTTO.length, Math.max(0, Math.floor((frame - 40) / TYPE.fast)));
  const seal = sealStamp(frame, 4, fps, sealTilt('wuh.site-finale'));
  const ring = interpolate(frame, [128, 150, 168], [0, 0.8, 0], CLAMP);
  const dropY = interpolate(frame, [158, 168], [526, 660], { ...CLAMP, easing: CURVES.cineEaseIn });
  const dropO = interpolate(frame, [156, 160, 166, 170], [0, 1, 1, 0], CLAMP);
  const black = interpolate(frame, [164, 176], [0, 1], { ...CLAMP, easing: CURVES.cineEaseIn });
  const credits = meta.credits ?? [];
  return (
    <AbsoluteFill>
      <BrandDust count={34} />
      {/* 钤印先浮现 */}
      <div
        style={{
          position: 'absolute',
          left: 949,
          top: 330,
          width: 22,
          height: 22,
          background: colors.seal,
          boxShadow: `0 0 12px ${colors.seal}`,
          ...seal,
        }}
      />
      <h1
        style={{
          position: 'absolute',
          left: 0,
          width: '100%',
          top: 382,
          textAlign: 'center',
          fontFamily: serif,
          fontSize: 64,
          color: colors.paper,
          margin: 0,
          letterSpacing: '0.04em',
          ...writeFade(frame, 16),
        }}
      >
        wuh.site · 朝朝如念
      </h1>
      <p
        style={{
          position: 'absolute',
          left: 0,
          width: '100%',
          top: 492,
          textAlign: 'center',
          fontFamily: serif,
          fontSize: 28,
          color: colors.paperMuted,
          margin: 0,
          letterSpacing: '0.05em',
          minHeight: 40,
        }}
      >
        {MOTTO.slice(0, chars)}
        {chars > 0 && chars < MOTTO.length ? (
          <span style={{ display: 'inline-block', width: 3, height: 22, marginLeft: 6, background: colors.accent, opacity: Math.floor(frame / 3) % 2 ? 1 : 0.15 }} />
        ) : null}
      </p>
      <div style={{ position: 'absolute', left: 0, width: '100%', top: 634, textAlign: 'center' }}>
        {meta.subtitle ? (
          <p style={{ ...writeFade(frame, 100), fontFamily: serif, fontSize: 20, color: colors.paper, margin: '0 0 14px', letterSpacing: '0.06em' }}>
            {meta.subtitle}
          </p>
        ) : null}
        {meta.episode ? (
          <p style={{ ...writeFade(frame, 104), fontFamily: mono, fontSize: 16, color: colors.muted, margin: '0 0 10px', letterSpacing: '0.18em' }}>
            {meta.episode}
          </p>
        ) : null}
        {credits.map((c, i) => (
          <p key={c} style={{ ...writeFade(frame, 112 + i * 8), fontFamily: mono, fontSize: 15, color: colors.muted, margin: '4px 0', letterSpacing: '0.06em' }}>
            {c}
          </p>
        ))}
        <p style={{ ...writeFade(frame, 120 + credits.length * 8), fontFamily: serif, fontSize: 18, color: colors.paperMuted, margin: '16px 0 0', letterSpacing: '0.08em' }}>
          made with shadow-dev-workflow
        </p>
      </div>
      {/* 环绕光尘收束 */}
      {Array.from({ length: 14 }).map((_, i) => {
        const a = ((i * 25.7 + frame * 0.5) * Math.PI) / 180;
        const x = 960 + Math.cos(a) * (420 + (i % 3) * 110);
        const y = 470 + Math.sin(a) * (200 + (i % 4) * 48);
        const s = 2 + (i % 3);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: s,
              height: s,
              borderRadius: s / 2,
              background: colors.gold,
              opacity: ring * (0.3 + 0.2 * Math.sin(frame / 9 + i)),
            }}
          />
        );
      })}
      {/* 墨点坠落 → 收黑 */}
      <div
        style={{
          position: 'absolute',
          left: 960,
          top: dropY,
          width: 8,
          height: 8,
          borderRadius: 4,
          transform: 'translate(-50%, -50%)',
          background: colors.seal,
          boxShadow: `0 0 18px ${colors.seal}`,
          opacity: dropO,
        }}
      />
      <AbsoluteFill style={{ background: colors.bg, opacity: black }} />
    </AbsoluteFill>
  );
};
