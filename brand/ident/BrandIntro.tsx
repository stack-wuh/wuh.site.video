import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { colors, fontFamilies } from '../tokens';
import { CURVES, TYPE, sealStamp, sealTilt, writeFade } from '../motion';
import { BrandDust, CLAMP } from './dust';
import type { FilmMeta } from './identity';

const serif = fontFamilies.serif;
const mono = fontFamilies.mono;

/** 片头 120f：墨滴坠落（20–32）→ 墨晕触纸（34–60）→ 标题落笔与片名打字（56–100）→ 钤印落定（100） */
export const BrandIntro: FC<{ meta: FilmMeta }> = ({ meta }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fallY = interpolate(frame, [20, 32], [430, 556], { ...CLAMP, easing: CURVES.cineEaseIn });
  const dropO = interpolate(frame, [20, 24, 32, 36], [0, 1, 1, 0], CLAMP);
  const bloom = interpolate(frame, [34, 60], [0, 1], { ...CLAMP, easing: CURVES.cineEaseOut });
  const chars = Math.min(meta.title.length, Math.max(0, Math.floor((frame - 74) / TYPE.fast)));
  const seal = sealStamp(frame, 100, fps, sealTilt('wuh.site-ident'));
  return (
    <AbsoluteFill>
      <BrandDust count={40} />
      {/* 墨晕触纸：静态径向渐变随 bloom 缩放收束 */}
      <div
        style={{
          position: 'absolute',
          left: 960,
          top: 560,
          width: 320,
          height: 320,
          borderRadius: '50%',
          transform: `translate(-50%, -50%) scale(${0.2 + bloom * 1.3})`,
          background: `radial-gradient(circle, ${colors.ink} 34%, ${colors.bg} 60%, transparent 78%)`,
          opacity: 0.75 * (1 - bloom * 0.75),
        }}
      />
      {/* 墨滴 */}
      <div
        style={{
          position: 'absolute',
          left: 960,
          top: fallY,
          width: 10,
          height: 10,
          borderRadius: 5,
          transform: 'translate(-50%, -50%)',
          background: colors.ink,
          boxShadow: `0 0 16px ${colors.gold}`,
          opacity: dropO,
        }}
      />
      <h1
        style={{
          position: 'absolute',
          left: 0,
          width: '100%',
          top: 406,
          textAlign: 'center',
          fontFamily: serif,
          fontSize: 76,
          color: colors.paper,
          margin: 0,
          letterSpacing: '0.04em',
          ...writeFade(frame, 56),
        }}
      >
        wuh.site · 朝朝如念
      </h1>
      <p
        style={{
          position: 'absolute',
          left: 0,
          width: '100%',
          top: 528,
          textAlign: 'center',
          fontFamily: serif,
          fontSize: 34,
          color: colors.paperMuted,
          margin: 0,
          letterSpacing: '0.05em',
          ...writeFade(frame, 70),
        }}
      >
        {meta.title.slice(0, chars)}
        {chars > 0 && chars < meta.title.length ? (
          <span style={{ display: 'inline-block', width: 3, height: 26, marginLeft: 6, background: colors.accent, opacity: Math.floor(frame / 3) % 2 ? 1 : 0.15 }} />
        ) : null}
      </p>
      {meta.episode ? (
        <p
          style={{
            ...writeFade(frame, 92),
            position: 'absolute',
            left: 0,
            width: '100%',
            top: 600,
            textAlign: 'center',
            fontFamily: mono,
            fontSize: 16,
            color: colors.muted,
            margin: 0,
            letterSpacing: '0.18em',
          }}
        >
          {meta.episode}
        </p>
      ) : null}
      {/* 钤印 22px 落定（标题右肩） */}
      <div
        style={{
          position: 'absolute',
          left: 1288,
          top: 402,
          width: 22,
          height: 22,
          background: colors.seal,
          boxShadow: `0 0 12px ${colors.seal}`,
          ...seal,
        }}
      />
    </AbsoluteFill>
  );
};
