/* 镜 03 · Act 1 墨点 · 局部帧 [0,96) · 96f
   题记纸面向右横移（CM-15 plateau，4% 画幅），带出第一篇文章纸卡；
   发布章 30f、正文落款章 66f 先后落下（SP-01 + FN-10），尾帧纸缘微翘。
   GR-02 + GR-03。 */
import type { CSSProperties, FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, paperBreathe, sealStamp, sealTilt } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { Caption } from '../components/Caption';
import { DustField } from '../components/DustField';
import { PaperGrain } from '../components/PaperGrain';
import { Grade } from '../components/Grade';

const CARD = { left: 470, top: 250, width: 980, height: 560 };

const Seal: FC<{ label: string; date: string; left: number; top: number; stamp: CSSProperties }> = ({ label, date, left, top, stamp }) => (
  <div style={{ position: 'absolute', left, top, width: 190, height: 190, ...stamp }}>
    <div style={{ position: 'absolute', inset: 0, borderRadius: 8, background: colors.seal }} />
    <div style={{ position: 'absolute', inset: 10, borderRadius: 5, border: `1px solid ${colors.paper}`, opacity: 0.5 }} />
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        color: colors.paper,
        fontFamily: fontFamilies.serif,
        fontSize: 26,
        letterSpacing: '0.08em',
      }}
    >
      <span>{label}</span>
      <span style={{ fontFamily: fontFamilies.mono, fontSize: 20, letterSpacing: 0, fontVariantNumeric: 'tabular-nums' }}>{date}</span>
    </div>
  </div>
);

const ShotFirstPost: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pan = interpolate(frame, [0, 10, 86, 96], [0, 10, 67, 77], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const curl = interpolate(frame, [80, 96], [0, -4], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const echo = interpolate(frame, [0, 12], [0.3, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });

  return (
    <AbsoluteFill style={{ background: colors.paper }}>
      <CameraRig cam={{ scale: 1, x: -pan, y: 0, rot: 0 }}>
        <AbsoluteFill style={{ ...paperBreathe(frame, 0.5), perspective: 1400 }}>
          <DustField act={1} count={40} seedBase="s03" />
          {/* 题记余光：横移起手时自左侧退场 */}
          <div style={{ position: 'absolute', left: 140, top: 120, fontFamily: fontFamilies.serif, fontSize: 40, letterSpacing: '0.26em', color: colors.ink, opacity: echo }}>
            wuh.site · 朝朝如念
          </div>
          <div
            style={{
              position: 'absolute',
              left: CARD.left,
              top: CARD.top,
              width: CARD.width,
              height: CARD.height,
              transform: `rotateY(${curl}deg)`,
              transformOrigin: 'left center',
            }}
          >
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
            <Seal label="发布" date="2019-07-26" left={150} top={320} stamp={sealStamp(frame, 30, fps, sealTilt('s03-publish'))} />
            <Seal label="正文落款" date="2018-08-05" left={640} top={320} stamp={sealStamp(frame, 66, fps, sealTilt('s03-sign'))} />
          </div>
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
      <Grade id="GR-02" />
      <Grade id="GR-03" />
      <Caption text="2019 年，博客有了第一篇。" />
    </AbsoluteFill>
  );
};

export default ShotFirstPost;
