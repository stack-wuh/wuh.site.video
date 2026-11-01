/* 镜 08 · Act 2 旧屋 · 局部帧 [0,96) · 96f
   纸缝穿越（TR-04 seam）：沿右缘纸缝向左推入，20f rack focus 由纸纹切到年份牌；
   巨幅衬线「2021」自纵深浮起、落到墨点时间轴顶端，落定后微幅沉降；旧站内页暗暖铺开；无字幕。 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { DustField } from '../components/DustField';
import { PaperGrain } from '../components/PaperGrain';
import { Grade } from '../components/Grade';

const DUR = 96;

const OldSitePage: FC<{ focus: number }> = ({ focus }) => (
  <AbsoluteFill style={{ background: colors.paper, transform: 'scale(1.03)', filter: `blur(${focus}px)` }}>
    <div
      style={{
        position: 'absolute',
        left: 140,
        right: 140,
        top: 70,
        height: 66,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: `1px solid ${colors.paperDeep}`,
      }}
    >
      <span style={{ fontFamily: fontFamilies.mono, fontSize: 21, letterSpacing: '0.32em', color: colors.ink, opacity: 0.7 }}>WUH.SITE</span>
      <span style={{ fontFamily: fontFamilies.sans, fontSize: 19, letterSpacing: '0.24em', color: colors.ink, opacity: 0.4 }}>首页　文章　关于</span>
    </div>
    <div style={{ position: 'absolute', left: 148, top: 214, width: 720 }}>
      {[520, 442, 350].map((w, i) => (
        <div key={w} style={{ width: w, height: 30, marginBottom: 20, borderRadius: 3, background: colors.ink, opacity: 0.16 - i * 0.04 }} />
      ))}
      <div style={{ marginTop: 36 }}>
        {[700, 668, 620, 560].map((w) => (
          <div key={w} style={{ width: w, height: 11, marginBottom: 16, borderRadius: 2, background: colors.ink, opacity: 0.1 }} />
        ))}
      </div>
    </div>
    <div style={{ position: 'absolute', right: 150, top: 216, width: 520 }}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ height: 130, marginBottom: 22, border: `1px solid ${colors.paperDeep}`, borderRadius: 6, padding: 18 }}>
          <div style={{ height: 54, borderRadius: 3, background: colors.paperDeep }} />
          <div style={{ width: 260 - i * 30, height: 9, marginTop: 16, borderRadius: 2, background: colors.ink, opacity: 0.12 }} />
        </div>
      ))}
    </div>
    <div style={{ position: 'absolute', right: 22, top: 230, width: 112, height: 132, border: `1px solid ${colors.muted}`, opacity: 0.25 }} />
    <div style={{ position: 'absolute', right: 40, top: 252, width: 70, height: 7, background: colors.muted, opacity: 0.2 }} />
    <div style={{ position: 'absolute', left: 180, right: 180, top: 806, height: 2, background: colors.ink, opacity: 0.26 }} />
    {Array.from({ length: 16 }).map((_, i) => (
      <div
        key={`dot-${i}`}
        style={{
          position: 'absolute',
          left: 174 + i * 104,
          top: 800,
          width: i % 3 === 0 ? 12 : 8,
          height: i % 3 === 0 ? 12 : 8,
          borderRadius: 8,
          background: colors.ink,
          opacity: 0.16 + (i % 4) * 0.08,
        }}
      />
    ))}
  </AbsoluteFill>
);

const ShotSeamInto2021: FC = () => {
  const frame = useCurrentFrame();
  const part = interpolate(frame, [0, 26], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const pageFocus = interpolate(frame, [0, 22], [5, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  const rise = interpolate(frame, [20, 56], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  const yearFocus = interpolate(frame, [16, 40], [12, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  const settle = interpolate(frame, [58, 88], [0, 7], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const warmOut = interpolate(frame, [0, 64], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const cam = {
    scale: interpolate(frame, [0, DUR], [1.08, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }),
    x: 0,
    y: interpolate(frame, [0, DUR], [26, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }),
    rot: 0,
  };

  return (
    <AbsoluteFill>
      <CameraRig cam={cam}>
        <OldSitePage focus={pageFocus} />
        <div
          style={{
            position: 'absolute',
            left: 560,
            top: 356,
            width: 800,
            height: 434,
            opacity: Math.min(1, rise * 1.6),
            filter: `blur(${yearFocus * (1 - rise * 0.4)}px)`,
            transform: `translateY(${(1 - rise) * 170 + settle}px) scale(${0.84 + rise * 0.16 - settle * 0.0009})`,
          }}
        >
          <div style={{ position: 'absolute', inset: 0, borderRadius: 10, background: colors.paperDeep, boxShadow: `0 40px 90px ${colors.bg}` }} />
          <div style={{ position: 'absolute', inset: 14, borderRadius: 6, border: `1px solid ${colors.ink}`, opacity: 0.14 }} />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: fontFamilies.serif,
              fontSize: 296,
              letterSpacing: '0.03em',
              color: colors.ink,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            2021
          </div>
        </div>
        <DustField act={2} seedBase="s08" />
      </CameraRig>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          clipPath: `inset(0 ${7.3 + part * 92.7}% 0 0)`,
          background: `linear-gradient(90deg, ${colors.paper} 0%, ${colors.paperDeep} 100%)`,
        }}
      >
        <div style={{ position: 'absolute', left: 600, top: 360, width: 720, height: 340, borderRadius: 6, background: colors.paper, border: `1px solid ${colors.paperMuted}` }} />
        <div style={{ position: 'absolute', left: 644, top: 468, width: 124, height: 124, borderRadius: 62, background: colors.paperDeep }} />
        <div style={{ position: 'absolute', left: 800, top: 448, width: 180, height: 26, borderRadius: 3, background: colors.ink, opacity: 0.2 }} />
        <div style={{ position: 'absolute', left: 800, top: 500, width: 240, height: 12, borderRadius: 2, background: colors.ink, opacity: 0.12 }} />
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 40, backgroundImage: `linear-gradient(270deg, ${colors.bg}, transparent)`, opacity: 0.3 }} />
      </div>
      <div style={{ position: 'absolute', left: `${100 - (7.3 + part * 92.7)}%`, top: 0, bottom: 0, width: 2, background: colors.gold, opacity: 0.55 * (1 - part) }} />
      <div
        style={{
          position: 'absolute',
          left: `calc(${100 - (7.3 + part * 92.7)}% + 2px)`,
          top: 0,
          bottom: 0,
          width: 26,
          backgroundImage: `linear-gradient(90deg, ${colors.bg}, transparent)`,
          opacity: 0.45 * (1 - part),
        }}
      />
      <PaperGrain opacity={0.07} />
      <Grade id="GR-01" />
      <Grade id="GR-04" />
      <div style={{ position: 'absolute', inset: 0, background: colors.gold, mixBlendMode: 'soft-light', opacity: 0.4 * (1 - warmOut) }} />
    </AbsoluteFill>
  );
};

export default ShotSeamInto2021;
