/* 镜 11 · Act 2 旧屋 · 局部帧 [0,108) · 108f
   低机位仰拍 Nginx 牌，20f rack focus 下移到牌下翻出的 2021-04 UI 设计稿（色卡 + 网格）；
   设计稿横扫出画、带起遮罩纸页盖满画面（TR-06）；字幕「Nginx 一直没离开。」。 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, glowPulse } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { Caption } from '../components/Caption';
import { DustField } from '../components/DustField';
import { PaperGrain } from '../components/PaperGrain';
import { Grade } from '../components/Grade';

const ShotNginxDraft: FC = () => {
  const frame = useCurrentFrame();
  const low = interpolate(frame, [0, 108], [2, 0.4], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const lift = interpolate(frame, [0, 108], [26, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const focusPull = interpolate(frame, [28, 48], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const plateBlur = focusPull * 2.6;
  const draftBlur = (1 - focusPull) * 10;
  const draftIn = interpolate(frame, [26, 50], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  const sweep = interpolate(frame, [74, 100], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseIn });
  const maskX = interpolate(frame, [78, 102], [-108, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const cam = {
    scale: 1.02,
    x: 0,
    y: interpolate(frame, [0, 108], [30, -4], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }),
    rot: 0,
  };

  return (
    <AbsoluteFill>
      <CameraRig cam={cam}>
        <div style={{ position: 'absolute', inset: -70, background: colors.paper }} />
        <div style={{ position: 'absolute', inset: 0, perspective: 1500 }}>
          <AbsoluteFill style={{ transform: `rotateX(${low}deg) translateY(${lift}px)`, transformOrigin: '50% 74%' }}>
            <div style={{ position: 'absolute', left: -150, top: 300, width: 330, height: 250, opacity: 0.45, filter: 'blur(2px)' }}>
              <div style={{ position: 'absolute', inset: 0, borderRadius: 10, background: colors.paperDeep, border: `1px solid ${colors.hairline}` }} />
              <div style={{ position: 'absolute', left: 26, top: 24, fontFamily: fontFamilies.mono, fontSize: 22, letterSpacing: '0.26em', color: colors.ink, opacity: 0.7 }}>DOCKER</div>
              <div style={{ position: 'absolute', left: 26, top: 78, width: 18, height: 18, borderRadius: 9, background: colors.accent, boxShadow: `0 0 14px ${colors.accent}` }} />
            </div>

            <div style={{ position: 'absolute', left: 610, top: 140, width: 700, height: 286, filter: `blur(${plateBlur}px)` }}>
              <div style={{ position: 'absolute', inset: 0, borderRadius: 12, background: colors.paperDeep, border: `1px solid ${colors.hairline}`, boxShadow: `0 34px 70px ${colors.bg}` }} />
              <div style={{ position: 'absolute', left: 40, top: 36, fontFamily: fontFamilies.mono, fontSize: 40, letterSpacing: '0.3em', color: colors.ink, opacity: 0.85 }}>NGINX</div>
              <div style={{ position: 'absolute', left: 40, top: 122, display: 'flex', alignItems: 'center', gap: 18 }}>
                <div style={{ width: 22, height: 22, borderRadius: 11, background: colors.accent, boxShadow: `0 0 20px ${colors.accent}`, ...glowPulse(frame, 0.4) }} />
                <span style={{ fontFamily: fontFamilies.mono, fontSize: 20, letterSpacing: '0.16em', color: colors.ink, opacity: 0.7 }}>RUNNING · 常驻</span>
              </div>
              <div style={{ position: 'absolute', left: 40, right: 40, bottom: 52, height: 10, borderRadius: 2, background: colors.ink, opacity: 0.08 }} />
              <div style={{ position: 'absolute', right: 40, bottom: 32, fontFamily: fontFamilies.mono, fontSize: 16, letterSpacing: '0.1em', color: colors.ink, opacity: 0.4 }}>reverse proxy · 2020 → now</div>
            </div>

            <div
              style={{
                position: 'absolute',
                left: 560,
                top: 512,
                width: 800,
                height: 470,
                opacity: draftIn * (1 - sweep * 0.4),
                filter: `blur(${draftBlur}px)`,
                transform: `rotateX(${(1 - draftIn) * -70}deg) translateY(${(1 - draftIn) * -46}px) translateX(${sweep * 1060}px) rotate(${sweep * 2.5}deg)`,
                transformOrigin: 'top center',
              }}
            >
              <div style={{ position: 'absolute', inset: 0, borderRadius: 8, background: colors.paper, border: `1px solid ${colors.paperDeep}`, boxShadow: `0 30px 60px ${colors.bg}` }} />
              <div style={{ position: 'absolute', left: 34, top: 26, fontFamily: fontFamilies.mono, fontSize: 17, letterSpacing: '0.22em', color: colors.ink, opacity: 0.6 }}>UI DESIGN</div>
              <div style={{ position: 'absolute', right: 30, top: 22, padding: '6px 12px', border: `1px solid ${colors.seal}`, borderRadius: 3, fontFamily: fontFamilies.mono, fontSize: 15, letterSpacing: '0.12em', color: colors.seal, fontVariantNumeric: 'tabular-nums' }}>2021-04</div>
              <div style={{ position: 'absolute', left: 34, right: 34, top: 74, display: 'flex', gap: 10 }}>
                {[colors.seal, colors.accent, colors.gold, colors.paperMuted, colors.paperDeep, colors.ink, colors.muted, colors.terminalText].map((c) => (
                  <div key={c} style={{ width: 54, height: 54, borderRadius: 4, background: c, border: `1px solid ${colors.hairline}` }} />
                ))}
              </div>
              <div style={{ position: 'absolute', left: 34, right: 34, top: 156, bottom: 30, borderRadius: 4, border: `1px solid ${colors.paperDeep}`, overflow: 'hidden' }}>
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `repeating-linear-gradient(90deg, ${colors.ink} 0px, ${colors.ink} 1px, transparent 1px, transparent 46px), repeating-linear-gradient(0deg, ${colors.ink} 0px, ${colors.ink} 1px, transparent 1px, transparent 46px)`,
                    opacity: 0.07,
                  }}
                />
                <div style={{ position: 'absolute', left: 18, top: 18, width: 220, height: 90, borderRadius: 3, background: colors.paperDeep }} />
                <div style={{ position: 'absolute', right: 18, top: 18, width: 160, height: 90, borderRadius: 3, border: `1px dashed ${colors.ink}`, opacity: 0.5 }} />
                <div style={{ position: 'absolute', left: 18, bottom: 18, right: 18, height: 34, borderRadius: 3, background: colors.accent, opacity: 0.5 }} />
              </div>
            </div>
          </AbsoluteFill>
        </div>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transform: `translateX(${maskX}%) scale(1.04)`,
            background: `linear-gradient(90deg, ${colors.paper} 0%, ${colors.paper} 62%, ${colors.paperDeep} 100%)`,
          }}
        >
          <div style={{ position: 'absolute', left: '62%', top: 0, bottom: 0, width: 2, background: colors.ink, opacity: 0.12 }} />
        </div>
        <DustField act={2} seedBase="s11" />
      </CameraRig>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 320, background: `linear-gradient(0deg, ${colors.bg} 0%, transparent 55%)`, opacity: 0.45, pointerEvents: 'none' }} />
      <PaperGrain opacity={0.07} />
      <Grade id="GR-01" />
      <Grade id="GR-04" />
      <Caption text="Nginx 一直没离开。" appearAt={72} />
    </AbsoluteFill>
  );
};

export default ShotNginxDraft;
