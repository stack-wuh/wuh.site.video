/* S24 · Act 4 留白 · 局部帧 [0,144) · 144f · 绝对 3564–3708
 *
 * 第一簇火星：2025-12 刻度亮起（16=绝对 3580）；21 颗火花聚拢 accel
 * （★DAT-08，16–76）；★DAT-01「21」NUM-ROLL（36–76，落定 76=绝对 3640=拍182
 * 对音，与末颗火花同帧）；随火星升腾上摇 3%（36–96）；余光向上延展成
 * 2026 春暖光带（GR-06 顶部，96–144）。转场：入「切」，出「切」。
 * 字幕安全窗：start≥12、end≤132。
 * 尾帧：火簇余光在天顶连成暖光带。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { random } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, writeFade } from '../../../brand/motion';
import { FILM_COLORS, numRoll, ROLL_DUR } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { Caption } from '../components/Caption';
import { DustField } from '../components/DustField';
import { Grade } from '../components/Grade';
import { PaperGrain } from '../components/PaperGrain';

const TOTAL = 144;
const SPARKS = 21;
const ROLL_END = 76; // 落定=绝对 3640=拍182

const S24: FC = () => {
  const frame = useCurrentFrame();
  // 21 颗火花 accel 聚拢（16–76）：间隔递减，每颗从四周向簇心收
  const sparks = Array.from({ length: SPARKS }).map((_, i) => {
    const k = Math.pow(i / (SPARKS - 1), 1.65);
    const land = 16 + k * 60;
    const t = interpolate(frame, [land - 14, land], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
    const ang = random(`s24-a-${i}`) * Math.PI * 2;
    const dist = 120 + random(`s24-d-${i}`) * 140;
    const cx = 960 + Math.cos(ang) * dist * (1 - t);
    const cy = 560 + Math.sin(ang) * dist * (1 - t) * 0.7;
    const flash = interpolate(frame, [land, land + 2, land + 8], [0, 0.9, 0.3], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    return { cx, cy, t, flash, land };
  });
  // ★DAT-01「21」滚动（36–76，与末颗火花同帧落定）
  const count = Math.round(numRoll(frame, 36, ROLL_DUR.standard, 0, 21));
  const cam = {
    scale: 1.05,
    x: 0,
    y: interpolate(frame, [36, 96], [0, -32], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }),
    rot: 0,
  };

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <CameraRig cam={cam}>
        <AbsoluteFill>
          <DustField act={4} count={10} seedBase="s24" />

          {/* 2025-12 刻度亮起（16） */}
          <div style={{ position: 'absolute', left: 150, right: 150, top: 620, height: 2, background: colors.muted, opacity: 0.45 }} />
          <div style={{ position: 'absolute', left: 880, top: 606, width: 3, height: 30, background: FILM_COLORS.lampAmber, opacity: interpolate(frame, [16, 26], [0, 0.9], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }} />
          <span style={{ position: 'absolute', left: 850, top: 650, fontFamily: fontFamilies.mono, fontSize: 18, color: colors.muted, opacity: interpolate(frame, [16, 26], [0, 0.7], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>2025-12</span>

          {/* 21 颗火花（accel 聚拢，火苗短促但明确） */}
          {sparks.map((s, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: s.cx - 3,
                top: s.cy - 3 - s.t * 6,
                width: 6 + s.flash * 3,
                height: 10 + s.flash * 4,
                borderRadius: '50% 50% 40% 40%',
                background: FILM_COLORS.lampAmber,
                opacity: 0.35 + s.flash * 0.65,
                boxShadow: s.flash > 0.3 ? `0 0 10px 3px rgba(217,160,91,${s.flash * 0.5})` : 'none',
              }}
            />
          ))}

          {/* ★DAT-01 计数「21」 */}
          <div style={{ position: 'absolute', left: 890, top: 420, ...writeFade(frame, 60), zIndex: 30 }}>
            <span style={{ fontFamily: fontFamilies.serif, fontSize: 74, color: FILM_COLORS.lampAmber, fontVariantNumeric: 'tabular-nums' }}>{count}</span>
            <span style={{ fontFamily: fontFamilies.mono, fontSize: 22, color: colors.muted }}> commits</span>
          </div>

          {/* 余光向上延展成 2026 春暖光带（96–144，GR-06 顶部） */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              height: 300,
              backgroundImage: `linear-gradient(180deg, ${FILM_COLORS.dawnLight}, transparent)`,
              opacity: interpolate(frame, [96, TOTAL], [0, 0.4], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
              pointerEvents: 'none',
            }}
          />
        </AbsoluteFill>
      </CameraRig>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 300, backgroundImage: `linear-gradient(180deg, transparent, ${colors.bg})`, opacity: 0.24 }} />
      <PaperGrain opacity={0.07} />
      <Grade id="GR-01" />
      <Caption text="十二月，他回来了：21 个提交。" appearAt={12} />
    </AbsoluteFill>
  );
};

export default S24;
