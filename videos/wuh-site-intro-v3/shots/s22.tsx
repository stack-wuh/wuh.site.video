/* S22 · Act 4 留白 · 局部帧 [0,120) · 120f · 绝对 3186–3306
 *
 * V2 暖黑数据流重写（2026-11-11 品牌暖黑科技）：零——线框刻度盘从深空显出（0–20）；
 * ★DAT-07 NUM-ZERO-HOLD——指针 0→微偏→0（14–54，阻尼 30f，回 0=绝对 3240；
 * 反衬：量的缺席，无滚数、禁假滚）；衬线大字「0」letterpress 落定 74
 * （=绝对 3260=拍163 对音，paperWhite + 微辉光压住整幅）；正面对称构图，
 * 1% 呼吸推拉（cam 原样周期 60f）；末段「0」微微失焦。
 * 转场：入「切」，出「切」。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { CURVES } from '../../../brand/motion';
import { FILM_COLORS2, glowText, zeroHold } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { Caption } from '../components/Caption';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';

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
    <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep }}>
      <DeepSpace seed="s22v2" stars={44} grid horizon />
      <CameraRig cam={cam}>
        <AbsoluteFill>
          {/* 线框刻度盘（对称构图，自深空显出） */}
          <div style={{ position: 'absolute', left: 610, top: 190, width: 700, height: 700, opacity: dialIn }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: 350, border: `3px solid ${FILM_COLORS2.dataDim}`, opacity: 0.55 }} />
            <div style={{ position: 'absolute', inset: 40, borderRadius: 310, border: `1px solid ${FILM_COLORS2.grid}`, opacity: 0.5 }} />
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
                  background: FILM_COLORS2.dataDim,
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
                background: FILM_COLORS2.paperWhite,
                opacity: 0.85,
                transformOrigin: '50% 0%',
                transform: `translateX(-2px) rotate(${needle - 90 + 90}deg) translateY(-270px) rotate(90deg)`,
                boxShadow: `0 0 10px rgba(212,163,115,0.35)`,
              }}
            />
            <div style={{ position: 'absolute', left: '50%', top: 350, width: 16, height: 16, borderRadius: 8, background: FILM_COLORS2.data, boxShadow: `0 0 14px rgba(212,163,115,0.5)`, transform: 'translate(-8px,-8px)', opacity: 0.85 }} />
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
              color: FILM_COLORS2.paperWhite,
              opacity: zeroIn * 0.88,
              transform: `scale(${zeroPress})`,
              ...glowText(FILM_COLORS2.paperWhite, 0.14),
              filter: `blur(${blurOut}px)`,
              zIndex: 30,
            }}
          >
            0
          </div>
        </AbsoluteFill>
      </CameraRig>
      <HudChrome label="wuh.site · VIEWS" readout="2025 · 0" />
      <Grade2 id="GR2-04" />
      <Caption text="那一年，站点的年度浏览量是 0。" appearAt={12} />
    </AbsoluteFill>
  );
};

export default S22;
