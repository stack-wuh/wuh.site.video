/* S49 · Act 7 坐忘 · 局部帧 [0,168) · 168f · 绝对 6686–6854
 *
 * V2 深空数据流重构（2026-11-11）：交接 八月——线框书页合拢（0–40，承接 s48 线框书房）；
 * 琥珀晨光移向右缘（0–60）；发光时间轴自 2026-07 继续前行（40–130，辉光点+尾迹）；
 * 前方细密数据光点亮起（60+3i → 100+3i 原窗口）；末段聚成星轨环微光（130–168，
 * 交接态：星轨环微光，s50 开场收紧承接）；「八月，在前方」暖纸白辉光落定（120–150）。
 * 全片第二缓（rack+横移守恒）。转场：入「切」，出「切」。无字幕。
 * 尾帧：琥珀光收拢、星轨环微光。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { random } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { CURVES } from '../../../brand/motion';
import { FILM_COLORS2, glowText } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';

const TOTAL = 168;

const S49: FC = () => {
  const frame = useCurrentFrame();
  const close = interpolate(frame, [0, 40], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const dotX = interpolate(frame, [40, 130], [500, 1250], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const ringIn = interpolate(frame, [130, TOTAL], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  const dotIn = interpolate(frame, [40, 60], [0, 0.9], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const cam = {
    scale: 1.05,
    x: interpolate(frame, [0, TOTAL], [0, -70], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }),
    y: 0,
    rot: 0,
  };

  return (
    <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep }}>
      <CameraRig cam={cam}>
        <AbsoluteFill>
          <DeepSpace seed="s49v2" stars={54} grid horizon />

          {/* 线框书页被风合上（0–40：承接 s48 书房的纸页收拢立起） */}
          {frame < 44 ? (
            <div style={{ position: 'absolute', left: 300, top: 280, perspective: 1400, opacity: 1 - close * 0.4 }}>
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: 640,
                  height: 420,
                  borderRadius: 6,
                  background: FILM_COLORS2.panel,
                  border: `1px solid ${FILM_COLORS2.line}`,
                  boxShadow: `0 0 30px rgba(212,163,115,0.12), 0 20px 50px rgba(0,0,0,0.5)`,
                  transform: `rotateY(${close * 78}deg)`,
                  transformOrigin: 'right center',
                }}
              />
            </div>
          ) : null}

          {/* 琥珀晨光移向右缘 */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(${270 - 40}deg, rgba(233,217,174,0.5) 0%, rgba(212,163,115,0.16) 30%, transparent 46%)`,
              opacity: interpolate(frame, [0, 60], [0.5, 0.7], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
              pointerEvents: 'none',
            }}
          />

          {/* 时间轴：发光主线 + 光点从 2026-07 前行 */}
          <div style={{ position: 'absolute', left: 120, right: 120, top: 600, height: 2, background: FILM_COLORS2.line, opacity: 0.5 }} />
          <div
            style={{
              position: 'absolute',
              left: 120,
              top: 600,
              height: 2.5,
              width: Math.max(0, dotX - 120),
              background: `linear-gradient(90deg, ${FILM_COLORS2.dataDim}, ${FILM_COLORS2.data})`,
              boxShadow: `0 0 14px 3px rgba(212,163,115,0.3)`,
              opacity: dotIn * 0.85,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: dotX - 12,
              top: 588,
              width: 24,
              height: 24,
              borderRadius: 12,
              background: FILM_COLORS2.data,
              boxShadow: `0 0 22px 6px rgba(212,163,115,${0.35 + 0.2 * Math.sin(frame / 5)})`,
              opacity: dotIn,
            }}
          />
          <span style={{ position: 'absolute', left: 380, top: 556, fontFamily: fontFamilies.mono, fontSize: 18, letterSpacing: '0.14em', color: FILM_COLORS2.textMuted, opacity: 0.65 }}>2026-07</span>

          {/* 前方细密数据光点 → 星轨环（130–168 聚成环微光） */}
          {Array.from({ length: 26 }).map((_, i) => {
            const ang = random(`s49-p-${i}`) * Math.PI * 2;
            const dist = interpolate(frame, [90, 168], [180 + random(`s49-d-${i}`) * 320, 60 + random(`s49-d-${i}`) * 90], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
            const cx = 1520 + Math.cos(ang) * dist * 1.5;
            const cy = 460 + Math.sin(ang) * dist;
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: cx,
                  top: cy,
                  width: 4,
                  height: 4,
                  borderRadius: 2,
                  background: FILM_COLORS2.data,
                  boxShadow: `0 0 8px 1px rgba(212,163,115,0.4)`,
                  opacity: interpolate(frame, [60 + i * 3, 100 + i * 3], [0, 0.85], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
                }}
              />
            );
          })}
          <div
            style={{
              position: 'absolute',
              left: 1400,
              top: 340,
              width: 240,
              height: 240,
              borderRadius: 120,
              border: `1.5px solid ${FILM_COLORS2.data}`,
              boxShadow: `0 0 ${30 + ringIn * 40}px rgba(212,163,115,${0.3 * ringIn}), inset 0 0 24px rgba(212,163,115,${0.14 * ringIn})`,
              opacity: ringIn * 0.6,
            }}
          />
          <span style={{ position: 'absolute', left: 760, top: 556, fontFamily: fontFamilies.serif, fontSize: 24, color: FILM_COLORS2.paperWhite, ...glowText(FILM_COLORS2.data, 0.32), opacity: interpolate(frame, [120, 150], [0, 0.8], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>八月，在前方</span>
        </AbsoluteFill>
      </CameraRig>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 300, backgroundImage: `linear-gradient(180deg, transparent, ${FILM_COLORS2.spaceDeep})`, opacity: 0.2 }} />
      <HudChrome label="wuh.site · TIMELINE" readout="07 → 08" />
      <Grade2 id="GR2-07" />
    </AbsoluteFill>
  );
};

export default S49;
