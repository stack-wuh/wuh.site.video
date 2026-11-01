/* 镜 09 · Act 2 旧屋 · 局部帧 [0,150) · 150f
   微距俯拍旧站页面一角；64f（全局 880，第 45 拍）朱红闲章按下 6f（FN-09 压印 + 墨晕），
   随后极缓后拉露出整页，章旁页面元素轻轻避让；字幕「代码写诗，工具作画。」。 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, sealStamp, sealTilt } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { Caption } from '../components/Caption';
import { DustField } from '../components/DustField';
import { PaperGrain } from '../components/PaperGrain';
import { Grade } from '../components/Grade';

const SEAL_AT = 64;

const ShotSealPoem: FC = () => {
  const frame = useCurrentFrame();
  const drift = Math.sin((frame / 120) * Math.PI * 2);
  const cam = {
    scale: interpolate(frame, [0, SEAL_AT, 150], [1.24, 1.23, 1.05], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }),
    x: drift * 4,
    y: 0,
    rot: drift * 0.15,
  };
  const sealStyle = sealStamp(frame, SEAL_AT, 30, sealTilt('s09'));
  const dip = interpolate(frame, [SEAL_AT, SEAL_AT + 3, SEAL_AT + 10], [0, 2, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const bleed = interpolate(frame, [SEAL_AT + 1, SEAL_AT + 22], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  const avoid = interpolate(frame, [56, 80], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });

  return (
    <AbsoluteFill>
      <CameraRig cam={cam}>
        <AbsoluteFill style={{ background: colors.paper }}>
          <div
            style={{
              position: 'absolute',
              left: 150,
              top: 96,
              display: 'flex',
              gap: 30,
              alignItems: 'baseline',
              fontFamily: fontFamilies.mono,
              fontSize: 19,
              letterSpacing: '0.2em',
              color: colors.ink,
              opacity: 0.5,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            <span>随笔</span>
            <span>2021-04-18</span>
          </div>
          <div style={{ position: 'absolute', left: 150, top: 176, width: 640, transform: `translateX(${-avoid * 16}px)` }}>
            {[470, 540, 400].map((w, i) => (
              <div key={w} style={{ width: w, height: 26, marginBottom: 18, borderRadius: 3, background: colors.ink, opacity: 0.16 - i * 0.04 }} />
            ))}
            <div style={{ marginTop: 40 }}>
              {[604, 580, 616, 520, 588, 440].map((w, i) => (
                <div key={`${w}-${i}`} style={{ width: w, height: 10, marginBottom: 17, borderRadius: 2, background: colors.ink, opacity: 0.1 }} />
              ))}
            </div>
          </div>
          <div style={{ position: 'absolute', right: 150, top: 196, width: 470, transform: `translateX(${avoid * 16}px)` }}>
            {[0, 1].map((i) => (
              <div key={i} style={{ height: 150, marginBottom: 26, border: `1px solid ${colors.paperDeep}`, borderRadius: 6, padding: 20 }}>
                <div style={{ height: 66, borderRadius: 3, background: colors.paperDeep }} />
                <div style={{ width: 300 - i * 60, height: 9, marginTop: 18, borderRadius: 2, background: colors.ink, opacity: 0.12 }} />
              </div>
            ))}
          </div>
          <div style={{ position: 'absolute', left: 150, right: 150, top: 902, height: 1, background: colors.ink, opacity: 0.14 }} />
        </AbsoluteFill>
        <div style={{ position: 'absolute', left: 764, top: 396, width: 392, height: 248, transform: `translateY(${dip}px)` }}>
          <div style={{ position: 'absolute', inset: -8, borderRadius: 12, background: colors.seal, opacity: 0.14 * bleed, filter: 'blur(10px)' }} />
          <div style={{ position: 'absolute', inset: 0, ...sealStyle }}>
            <div style={{ position: 'absolute', inset: 0, border: `11px solid ${colors.seal}`, borderRadius: 8 }} />
            <div style={{ position: 'absolute', inset: 15, border: `2px solid ${colors.seal}`, borderRadius: 4 }} />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: fontFamilies.serif,
                fontSize: 56,
                letterSpacing: '0.14em',
                color: colors.seal,
                lineHeight: 1.5,
              }}
            >
              <span>代码写诗，</span>
              <span>工具作画。</span>
            </div>
          </div>
        </div>
        <DustField act={2} seedBase="s09" />
      </CameraRig>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 320, background: `linear-gradient(0deg, ${colors.bg} 0%, transparent 55%)`, opacity: 0.45, pointerEvents: 'none' }} />
      <PaperGrain opacity={0.07} />
      <Grade id="GR-04" />
      <Grade id="GR-03" />
      <Caption text="代码写诗，工具作画。" appearAt={30} />
    </AbsoluteFill>
  );
};

export default ShotSealPoem;
