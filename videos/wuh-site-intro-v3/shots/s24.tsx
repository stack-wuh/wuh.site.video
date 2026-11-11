/* S24 · Act 4 留白 · 局部帧 [0,144) · 144f · 绝对 3564–3708
 *
 * V2 暖黑数据流重写（2026-11-11 品牌暖黑科技）：第一簇数据火星——2025-12 刻度亮起
 * （16=绝对 3580，数据轴 + 琥珀刻度）；21 颗数据火星聚拢 accel（★DAT-08，16–76 原窗，
 * deterministic random）；★DAT-01「21」bigNum 全屏滚动落定（36–76，落定 76=绝对 3640=
 * 拍182 对音，与末颗火星同帧，SLAM 辉光脉冲）；随火星升腾上摇 3%（cam 窗原样 36–96）；
 * 余光向上延展成 2026 春暖光带（顶部琥珀光带，96–144）。
 * 转场：入「切」，出「切」。字幕安全窗：start≥12、end≤132。
 * 尾帧：火簇余光在天顶连成暖光带（交接态：火簇余光+顶部暖带）。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, random, useCurrentFrame } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { CURVES } from '../../../brand/motion';
import { bigNum, FILM_COLORS2, glowText } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { Caption } from '../components/Caption';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';

const TOTAL = 144;
const SPARKS = 21;
const ROLL_END = 76; // 落定=绝对 3640=拍182

const S24: FC = () => {
  const frame = useCurrentFrame();
  // 21 颗数据火星 accel 聚拢（16–76）：间隔递减，每颗从四周向簇心收
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
  // ★DAT-01「21」bigNum 滚动（36–76，与末颗火星同帧落定）
  const count = bigNum(frame, 36, ROLL_END - 36, 0, 21);
  const cam = {
    scale: 1.05,
    x: 0,
    y: interpolate(frame, [36, 96], [0, -32], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }),
    rot: 0,
  };

  return (
    <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep }}>
      <DeepSpace seed="s24v2" stars={48} grid horizon />
      <CameraRig cam={cam}>
        <AbsoluteFill>
          {/* 2025-12 刻度亮起（16）：数据轴 + 琥珀刻度 */}
          <div style={{ position: 'absolute', left: 150, right: 150, top: 620, height: 2, background: FILM_COLORS2.line, opacity: 0.5 }} />
          <div style={{ position: 'absolute', left: 880, top: 606, width: 3, height: 30, background: FILM_COLORS2.data, boxShadow: `0 0 10px rgba(212,163,115,0.5)`, opacity: interpolate(frame, [16, 26], [0, 0.9], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }} />
          <span style={{ position: 'absolute', left: 850, top: 650, fontFamily: fontFamilies.mono, fontSize: 18, color: FILM_COLORS2.textMuted, opacity: interpolate(frame, [16, 26], [0, 0.7], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }), fontVariantNumeric: 'tabular-nums' }}>2025-12</span>

          {/* 21 颗数据火星（accel 聚拢，琥珀辉光） */}
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
                background: FILM_COLORS2.data,
                opacity: 0.35 + s.flash * 0.65,
                boxShadow: s.flash > 0.3 ? `0 0 12px 4px rgba(212,163,115,${s.flash * 0.5})` : 'none',
              }}
            />
          ))}

          {/* ★DAT-01 计数「21」（bigNum 落定 SLAM 辉光，主角化） */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 330,
              textAlign: 'center',
              zIndex: 30,
              fontFamily: fontFamilies.mono,
              fontSize: 160,
              fontWeight: 700,
              lineHeight: 1.05,
              color: FILM_COLORS2.data,
              fontVariantNumeric: 'tabular-nums',
              letterSpacing: '0.02em',
              opacity: interpolate(frame, [36, 48], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
              transform: `scale(${count.slam})`,
              ...glowText(FILM_COLORS2.data, count.glow),
            }}
          >
            {count.text}
          </div>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 505, textAlign: 'center', zIndex: 30 }}>
            <span style={{ fontFamily: fontFamilies.mono, fontSize: 20, letterSpacing: '0.4em', color: FILM_COLORS2.textMuted, opacity: interpolate(frame, [60, 72], [0, 0.85], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>COMMITS · 十二月</span>
          </div>

          {/* 余光向上延展成 2026 春暖光带（96–144，顶部琥珀光带） */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              height: 300,
              backgroundImage: `linear-gradient(180deg, rgba(212,163,115,0.22), transparent)`,
              opacity: interpolate(frame, [96, TOTAL], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
              pointerEvents: 'none',
            }}
          />
        </AbsoluteFill>
      </CameraRig>
      <HudChrome label="wuh.site · RETURN" readout="DEC 2025 · +21" />
      <Grade2 id="GR2-04" />
      <Caption text="十二月，他回来了：21 个提交。" appearAt={12} />
    </AbsoluteFill>
  );
};

export default S24;
