/* 镜 07 · Act 1 墨点 · 局部帧 [0,90) · 90f
   S6 文章列表沉为底纹（TR-07 入场侧）；About 资料卡 24–44f 自下浮起，
   68 repos 44–62f 落定、bio 50f 起 write-fade；64–90f 100→104% 极缓推；
   尾帧右缘掀缝透出下一幕旧站页。GR-02 + GR-03。无字幕。 */
import type { FC } from 'react';
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, FILM_COLORS, cardFly, numRoll, writeFade } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { DustField } from '../components/DustField';
import { PaperGrain } from '../components/PaperGrain';
import { Grade } from '../components/Grade';

const CARD = { left: 600, top: 360, width: 720, height: 340 };

const ShotProfile: FC = () => {
  const frame = useCurrentFrame();
  const sinkOpacity = interpolate(frame, [0, 20], [1, 0.18], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const sinkBlur = interpolate(frame, [0, 20], [0, 2.5], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const sinkScale = interpolate(frame, [0, 20], [1, 0.98], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const push = interpolate(frame, [64, 90], [1, 1.04], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const repos = Math.round(numRoll(frame, 44, 18, 0, 68));
  const seam = interpolate(frame, [70, 88], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });

  return (
    <AbsoluteFill style={{ background: colors.paper }}>
      <CameraRig cam={{ scale: push, x: 0, y: 0, rot: 0 }}>
        <AbsoluteFill>
          <DustField act={1} count={40} seedBase="s07" />
          {/* 文章列表沉为底纹 */}
          <AbsoluteFill style={{ opacity: sinkOpacity, filter: `blur(${sinkBlur}px)`, transform: `scale(${sinkScale})` }}>
            {[0, 1, 2, 3].map((i) => (
              <div key={i} style={{ position: 'absolute', left: 800, top: 240 + i * 140, width: 700, height: 112 }}>
                <div style={{ position: 'absolute', inset: 0, borderRadius: 4, background: colors.paperDeep, border: `1px solid ${colors.paperMuted}` }} />
                <div style={{ position: 'absolute', left: 28, top: 30, width: 430 - i * 22, height: 12, background: colors.ink, opacity: 0.55 }} />
                <div style={{ position: 'absolute', left: 28, top: 62, width: 220, height: 7, background: colors.muted, opacity: 0.35 }} />
                <div style={{ position: 'absolute', right: 28, top: 28, width: 64, height: 20, borderRadius: 10, background: colors.gold, opacity: 0.4 }} />
              </div>
            ))}
          </AbsoluteFill>
          {/* About 资料卡：自下浮起 */}
          <div
            style={{
              position: 'absolute',
              left: CARD.left,
              top: CARD.top,
              width: CARD.width,
              height: CARD.height,
              ...cardFly(frame, 24, 20, { x: 0, y: 170, rot: 0, scale: 0.98 }, { x: 0, y: 0, rot: 0, scale: 1 }),
            }}
          >
            <div style={{ position: 'absolute', inset: 0, transform: 'translateY(12px)', background: colors.bg, opacity: 0.1, filter: 'blur(14px)' }} />
            <div style={{ position: 'absolute', inset: 0, borderRadius: 6, background: colors.paper, border: `1px solid ${colors.paperMuted}` }} />
            <span style={{ position: 'absolute', left: 44, top: 30, fontFamily: fontFamilies.mono, fontSize: 12, letterSpacing: '0.32em', color: colors.muted, opacity: 0.55 }}>ABOUT</span>
            {/* GitHub 真头像（@stack-wuh，低饱和圆形裁切） */}
            <div style={{ position: 'absolute', left: 44, top: 108, width: 124, height: 124, borderRadius: 62, overflow: 'hidden', border: `1px solid ${colors.paperMuted}`, background: colors.paperDeep }}>
              <Img src={staticFile('wuh-site-intro-v2/avatar.png')} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(0.55) brightness(0.96)' }} />
              <div style={{ position: 'absolute', inset: 0, borderRadius: 62, border: `1px solid ${colors.paperMuted}`, opacity: 0.6 }} />
            </div>
            <div style={{ position: 'absolute', left: 200, top: 88, display: 'flex', alignItems: 'baseline', gap: 12 }}>
              <span style={{ fontFamily: fontFamilies.mono, fontSize: 42, color: colors.ink, fontVariantNumeric: 'tabular-nums' }}>{repos}</span>
              <span style={{ fontFamily: fontFamilies.mono, fontSize: 19, color: colors.muted }}>public repos</span>
            </div>
            <div style={{ position: 'absolute', left: 200, top: 154, fontFamily: fontFamilies.serif, fontSize: 34, color: colors.ink, ...writeFade(frame, 50) }}>
              a boy just ~
            </div>
            <div style={{ position: 'absolute', left: 200, top: 220, fontFamily: fontFamilies.mono, fontSize: 17, color: colors.muted }}>
              Shenzhen, Guangdong, China
            </div>
          </div>
        </AbsoluteFill>
      </CameraRig>
      {/* 尾帧：右缘掀缝，透出下一幕旧站页 */}
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          width: 140,
          height: 1080,
          transformOrigin: 'right center',
          transform: `scaleX(${seam})`,
        }}
      >
        <div style={{ position: 'absolute', inset: 0, background: colors.terminalBg }} />
        <div style={{ position: 'absolute', left: 26, top: 210, width: 88, height: 8, background: FILM_COLORS.wireGrey, opacity: 0.22 }} />
        <div style={{ position: 'absolute', left: 26, top: 240, width: 64, height: 8, background: FILM_COLORS.wireGrey, opacity: 0.18 }} />
        <div style={{ position: 'absolute', left: 26, top: 330, width: 88, height: 120, border: `1px solid ${FILM_COLORS.wireGrey}`, opacity: 0.18 }} />
        <div style={{ position: 'absolute', left: 0, top: 0, width: 2, height: 1080, background: colors.gold, opacity: 0.55 }} />
        <div style={{ position: 'absolute', left: 2, top: 0, width: 26, height: 1080, backgroundImage: `linear-gradient(90deg, ${colors.bg}, transparent)`, opacity: 0.5 }} />
      </div>
      <PaperGrain opacity={0.07} />
      <Grade id="GR-02" />
      <Grade id="GR-03" />
    </AbsoluteFill>
  );
};

export default ShotProfile;
