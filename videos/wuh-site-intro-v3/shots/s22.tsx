/* S22 · Act 4 留白 · 局部帧 [0,120) · 120f · 绝对 3186–3306
 *
 * 零：年度浏览量刻度盘从尘埃中显出（0–20）；★DAT-07 NUM-ZERO-HOLD——
 * 指针 0→微偏→0（14–54，阻尼 30f，回 0=绝对 3240）；衬线大字「0」letterpress
 * 落定 74（=绝对 3260=拍163 对音；反衬：量的缺席，无滚数、禁假滚）；
 * 正面对称构图，1% 呼吸推拉（周期 60f）；末段「0」微微失焦。
 * 转场：入「切」，出「切」。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES } from '../../../brand/motion';
import { zeroHold } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { Caption } from '../components/Caption';
import { DustField } from '../components/DustField';
import { Grade } from '../components/Grade';
import { PaperGrain } from '../components/PaperGrain';

const TOTAL = 120;

const S22: FC = () => {
  const frame = useCurrentFrame();
  const cam = {
    scale: 1.03 + Math.sin((frame / 60) * Math.PI * 2) * 0.01,
    x: 0,
    y: 0,
    rot: 0,
  };
  // ★DAT-07 指针 0→微偏→0（14–54）
  const needle = zeroHold(frame, 14, 40);
  const dialIn = interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  // 大字「0」letterpress 落定（74=拍163 对音）
  const zeroIn = interpolate(frame, [64, 74], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  const zeroPress = interpolate(frame, [74, 82], [1.08, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  // 末段微微失焦
  const blurOut = interpolate(frame, [104, TOTAL], [0, 3.5], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <CameraRig cam={cam}>
        <AbsoluteFill>
          <DustField act={4} count={10} seedBase="s22" />

          {/* 刻度盘（对称构图，自尘埃显出） */}
          <div style={{ position: 'absolute', left: 610, top: 190, width: 700, height: 700, opacity: dialIn }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: 350, border: `3px solid ${colors.muted}`, opacity: 0.55 }} />
            <div style={{ position: 'absolute', inset: 40, borderRadius: 310, border: `1px solid ${colors.muted}`, opacity: 0.3 }} />
            {/* 刻度（每 30° 一格） */}
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: 0,
                  width: 2,
                  height: 22,
                  background: colors.muted,
                  opacity: 0.5,
                  transformOrigin: '50% 328px',
                  transform: `rotate(${i * 30}deg)`,
                }}
              />
            ))}
            {/* 指针（0→微偏→0，阻尼摆动） */}
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: 350,
                width: 4,
                height: 270,
                background: colors.paper,
                opacity: 0.85,
                transformOrigin: '50% 0%',
                transform: `translateX(-2px) rotate(${needle - 90 + 90}deg) translateY(-270px) rotate(90deg)`,
              }}
            />
            <div style={{ position: 'absolute', left: '50%', top: 350, width: 16, height: 16, borderRadius: 8, background: colors.paper, transform: 'translate(-8px,-8px)', opacity: 0.85 }} />
          </div>

          {/* 衬线大字「0」（letterpress 落定，压住整幅；反衬——无滚数） */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 330,
              textAlign: 'center',
              fontFamily: fontFamilies.serif,
              fontSize: 460,
              lineHeight: 1,
              color: colors.ink,
              opacity: zeroIn * 0.88,
              transform: `scale(${zeroPress})`,
              textShadow: `0 4px 0 rgba(0,0,0,0.25), 0 0 60px rgba(245,233,200,0.12)`,
              filter: `blur(${blurOut}px)`,
              zIndex: 30,
            }}
          >
            0
          </div>
        </AbsoluteFill>
      </CameraRig>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 300, backgroundImage: `linear-gradient(180deg, transparent, ${colors.bg})`, opacity: 0.24 }} />
      <PaperGrain opacity={0.07} />
      <Grade id="GR-05" />
      <Caption text="那一年，站点的年度浏览量是 0。" appearAt={12} />
    </AbsoluteFill>
  );
};

export default S22;
