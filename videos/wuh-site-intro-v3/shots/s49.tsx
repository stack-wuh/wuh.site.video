/* S49 · Act 7 坐忘 · 局部帧 [0,168) · 168f · 绝对 6686–6854
 *
 * 交接 八月：书页被风合上（0–40），晨光移到画面右缘；时间轴墨点从 2026-07
 * 继续前行（40–130），前方开始出现细密光点；末段光点聚成星轨环微光（130–168）。
 * 全片第二缓（rack+横移）。转场：入「切」（承接墨洇后暗场），出「切」。
 * 无字幕。尾帧：晨光收拢、星轨环微光。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { random } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES } from '../../../brand/motion';
import { FILM_COLORS } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { DustField } from '../components/DustField';
import { Grade } from '../components/Grade';
import { PaperGrain } from '../components/PaperGrain';

const TOTAL = 168;

const S49: FC = () => {
  const frame = useCurrentFrame();
  const close = interpolate(frame, [0, 40], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const dotX = interpolate(frame, [40, 130], [500, 1250], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const ringIn = interpolate(frame, [130, TOTAL], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  const cam = {
    scale: 1.05,
    x: interpolate(frame, [0, TOTAL], [0, -70], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }),
    y: 0,
    rot: 0,
  };

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <CameraRig cam={cam}>
        <AbsoluteFill>
          <DustField act={7} count={10} seedBase="s49" />

          {/* 书页被风合上（0–40：摊开书页收拢立起） */}
          {frame < 44 ? (
            <div style={{ position: 'absolute', left: 300, top: 280, perspective: 1400 }}>
              <div style={{ position: 'absolute', left: 0, top: 0, width: 640, height: 420, borderRadius: 6, background: colors.paper, border: `1px solid ${colors.paperMuted}`, transform: `rotateY(${close * 78}deg)`, transformOrigin: 'right center', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }} />
            </div>
          ) : null}
          {/* 晨光移向右缘 */}
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(${270 - 40}deg, ${FILM_COLORS.dawnLight} 0%, transparent 46%)`, opacity: interpolate(frame, [0, 60], [0.5, 0.7], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }), pointerEvents: 'none' }} />

          {/* 时间轴：墨点从 2026-07 前行 */}
          <div style={{ position: 'absolute', left: 120, right: 120, top: 600, height: 2, background: colors.muted, opacity: 0.45 }} />
          <div style={{ position: 'absolute', left: dotX, top: 588, width: 24, height: 24, borderRadius: 12, background: colors.ink, opacity: interpolate(frame, [40, 60], [0, 0.9], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }} />
          <span style={{ position: 'absolute', left: 380, top: 556, fontFamily: fontFamilies.mono, fontSize: 18, color: colors.muted, opacity: 0.6 }}>2026-07</span>

          {/* 前方细密光点 → 星轨环（130–168 聚成环） */}
          {Array.from({ length: 26 }).map((_, i) => {
            const ang = random(`s49-p-${i}`) * Math.PI * 2;
            const dist = interpolate(frame, [90, 168], [180 + random(`s49-d-${i}`) * 320, 60 + random(`s49-d-${i}`) * 90], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
            const cx = 1520 + Math.cos(ang) * dist * 1.5;
            const cy = 460 + Math.sin(ang) * dist;
            return (
              <div key={i} style={{ position: 'absolute', left: cx, top: cy, width: 4, height: 4, borderRadius: 2, background: FILM_COLORS.goldMist, opacity: interpolate(frame, [60 + i * 3, 100 + i * 3], [0, 0.85], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }} />
            );
          })}
          <div style={{ position: 'absolute', left: 1400, top: 340, width: 240, height: 240, borderRadius: 120, border: `1px solid ${FILM_COLORS.goldMist}`, opacity: ringIn * 0.5 }} />
          <span style={{ position: 'absolute', left: 760, top: 556, fontFamily: fontFamilies.serif, fontSize: 20, color: colors.muted, opacity: interpolate(frame, [120, 150], [0, 0.7], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>八月，在前方</span>
        </AbsoluteFill>
      </CameraRig>
      <PaperGrain opacity={0.06} />
      <Grade id="GR-06" />
    </AbsoluteFill>
  );
};

export default S49;
