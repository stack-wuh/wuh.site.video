/* S21 · Act 4 留白 · 局部帧 [0,150) · 150f · 绝对 3036–3186
 *
 * 四步与空白：时间轴串起四墨点（0–20）；2025-06（三次）/ 2025-07（一次）标注
 * 落位即现（24/44，标识不滚）；微距横移过空白段（44–104，slow-pause-slow
 * 速度≈0）；空白处长出纸纤维（64–124）与尘埃上浮；尘埃落定 104=拍157；
 * 末段刻度盘微光显出（124–150）。转场：入「切」，出「切」。
 * 字幕安全窗：start≥12、end≤138。
 * 尾帧：空白段尽头一枚灰尘落定，露出刻度盘微光。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { random } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES } from '../../../brand/motion';
import { CameraRig } from '../components/CameraRig';
import { Caption } from '../components/Caption';
import { DustField } from '../components/DustField';
import { Grade } from '../components/Grade';
import { PaperGrain } from '../components/PaperGrain';

const TOTAL = 150;

const S21: FC = () => {
  const frame = useCurrentFrame();
  // 微距横移（slow-pause-slow：44–104 速度≈0）
  const cam = {
    scale: 1.06,
    x: interpolate(frame, [0, 44, 104, TOTAL], [0, 80, 84, 170], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }),
    y: 0,
    rot: 0,
  };

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <CameraRig cam={cam}>
        <AbsoluteFill>
          <DustField act={4} count={14} seedBase="s21" />

          {/* 时间轴 + 四墨点（2025-06 三点 / 2025-07 一点） */}
          <div style={{ position: 'absolute', left: 120, right: 120, top: 520, height: 2, background: colors.muted, opacity: 0.5 }} />
          {[0, 1, 2].map((i) => (
            <div key={`june-${i}`} style={{ position: 'absolute', left: 260 + i * 70, top: 508, width: 26, height: 26, borderRadius: 13, background: colors.ink, opacity: interpolate(frame, [4 + i * 6, 12 + i * 6], [0, 0.9], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }} />
          ))}
          <div style={{ position: 'absolute', left: 500, top: 508, width: 26, height: 26, borderRadius: 13, background: colors.ink, opacity: interpolate(frame, [26, 34], [0, 0.9], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }} />
          {/* 标注（落位即现） */}
          <div style={{ position: 'absolute', left: 250, top: 440, fontFamily: fontFamilies.mono, fontSize: 17, color: colors.muted, opacity: interpolate(frame, [24, 34], [0, 0.65], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>2025-06 ×3</div>
          <div style={{ position: 'absolute', left: 478, top: 440, fontFamily: fontFamilies.mono, fontSize: 17, color: colors.muted, opacity: interpolate(frame, [44, 54], [0, 0.65], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>2025-07 ×1</div>

          {/* 空白段刻度（8–11 月，连续空白） */}
          {[0, 1, 2, 3].map((i) => (
            <div key={i} style={{ position: 'absolute', left: 640 + i * 200, top: 506, width: 2, height: 30, background: colors.muted, opacity: 0.3 }} />
          ))}
          <div style={{ position: 'absolute', left: 636, top: 440, fontFamily: fontFamilies.mono, fontSize: 17, color: colors.muted, opacity: 0.4 }}>08 …… 11</div>

          {/* 纸纤维生长（64–124，空白段里长出细丝） */}
          {Array.from({ length: 9 }).map((_, i) => {
            const grow = interpolate(frame, [64 + i * 6, 124 + i * 3], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
            const x = 660 + i * 130 + (random(`f21-${i}`) - 0.5) * 60;
            return (
              <div key={i} style={{ position: 'absolute', left: x, top: 522, width: 1.4, height: grow * 60, background: colors.paper, opacity: grow * 0.22, transform: `rotate(${(random(`f21r-${i}`) - 0.5) * 40}deg)`, transformOrigin: 'bottom center' }} />
            );
          })}

          {/* 一枚灰尘落定（104=拍157） */}
          <div
            style={{
              position: 'absolute',
              left: 1090,
              top: interpolate(frame, [84, 104], [470, 516], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseIn }),
              width: 6,
              height: 6,
              borderRadius: 3,
              background: colors.paper,
              opacity: interpolate(frame, [84, 104, 130], [0, 0.8, 0.5], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
            }}
          />

          {/* 末段：刻度盘微光显出（124–150，右下角） */}
          <div
            style={{
              position: 'absolute',
              right: 210,
              top: 240,
              width: 330,
              height: 330,
              borderRadius: 165,
              border: `2px solid ${colors.muted}`,
              opacity: interpolate(frame, [124, TOTAL], [0, 0.4], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
              boxShadow: `inset 0 0 40px rgba(245,233,200,${interpolate(frame, [124, TOTAL], [0, 0.1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })})`,
            }}
          />
        </AbsoluteFill>
      </CameraRig>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 300, backgroundImage: `linear-gradient(180deg, transparent, ${colors.bg})`, opacity: 0.26 }} />
      <PaperGrain opacity={0.07} />
      <Grade id="GR-05" />
      <Caption text="2025 年，新站只走了四步，然后长久地安静。" appearAt={12} />
    </AbsoluteFill>
  );
};

export default S21;
