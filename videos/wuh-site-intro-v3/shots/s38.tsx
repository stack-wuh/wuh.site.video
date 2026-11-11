/* S38 · Act 6 入院 · 局部帧 [0,88) · 88f · 绝对 5346–5434
 *
 * V2 深空数据流重写（2026-11-11 品牌暖黑科技）：设计系统换装——模块轨道读数变化
 * （Rail：光标滑至 07（0–8，窗口原样）→ 07 点亮（4）→ 尾段光标移向 08（74–88））；
 * 主题引擎数据化：酒红/素雅两套主题即时插值换装（18–58，两级各卡一拍，窗口原样；
 * swap 插值驱动双 hues 层淡入淡出，色值全部由 FILM_COLORS2 族派生）；
 * 100–900 全阶色卡带铺开（22+i*3 stagger 窗口原样，scaleY 生长）；换装瞬间微甩
 * 横移一次（18–32 窗口原样，CameraRig 施动）；「试墨」色块被拖拽游走（58–72，
 * 窗口原样，sealRed 手作签名）。V1 尾段轨道读数以 manifest 为准：01–07 亮。
 * 转场：入「切」，出「切」。字幕安全窗：start≥12、end≤76。
 * 尾帧：模块轨道 01–07 亮、光标停在 08 前（交接态：面板+七块亮）。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { CURVES } from '../../../brand/motion';
import { FILM_COLORS2, glowText } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { Caption } from '../components/Caption';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';

const TOTAL = 88;
const RAIL_PITCH = 74;
/* 两套主题的全阶明度/色相 ramp（全部由 FILM_COLORS2 族派生，禁内联色值）：
 * 共享明度 ramp（100 亮 → 900 深）+ 酒红 hue（sealRed 族）/ 素雅 hue（textMuted 族）*/
const LIGHT_RAMP = [0.85, 0.7, 0.55, 0.42, 0.3, 0.2, 0.12, 0.06, 0.03];
const WINE_HUE = [0.18, 0.28, 0.38, 0.5, 0.62, 0.72, 0.82, 0.9, 0.95];
const CALM_HUE = [0.05, 0.12, 0.2, 0.3, 0.4, 0.5, 0.62, 0.75, 0.85];

/** V2 模块轨道（原控制台面板的 HUD 化替身）——交接态语义同 s30 */
const Rail: FC<{ lit: number; at: number; cursorP: number; frame: number }> = ({ lit, at, cursorP, frame }) => (
  <div style={{ position: 'absolute', left: '50%', top: 92, width: 582, marginLeft: -291, zIndex: 26 }}>
    <div style={{ display: 'flex', gap: 10 }}>
      {Array.from({ length: 8 }).map((_, i) => {
        const n = i + 1;
        const on = n <= lit;
        const active = n === at && on;
        return (
          <div key={n} style={{ width: 64 }}>
            <div
              style={{
                textAlign: 'center',
                fontFamily: fontFamilies.mono,
                fontSize: 13,
                letterSpacing: '0.18em',
                color: on ? FILM_COLORS2.data : n === at ? FILM_COLORS2.gold : FILM_COLORS2.textMuted,
                opacity: on ? 0.95 : n === at ? 0.9 : 0.5,
                ...(active ? glowText(FILM_COLORS2.data, 0.4 + 0.15 * Math.sin(frame / 6)) : {}),
              }}
            >
              {String(n).padStart(2, '0')}
            </div>
            <div style={{ marginTop: 6, height: 3, borderRadius: 2, background: on ? FILM_COLORS2.data : FILM_COLORS2.line, boxShadow: on ? `0 0 8px rgba(212,163,115,${active ? 0.4 + 0.2 * Math.sin(frame / 6) : 0.45})` : 'none', opacity: on ? 1 : 0.5 }} />
          </div>
        );
      })}
    </div>
    {at > lit ? (
      <div style={{ position: 'absolute', top: 14, left: (at - 1) * RAIL_PITCH - 14 + cursorP * 8, width: 0, height: 0, borderTop: '5px solid transparent', borderBottom: '5px solid transparent', borderLeft: `7px solid ${FILM_COLORS2.gold}`, opacity: 0.9, filter: 'drop-shadow(0 0 6px rgba(212,163,115,0.6))' }} />
    ) : null}
  </div>
);

const S38: FC = () => {
  const frame = useCurrentFrame();
  // 换装插值（18–58：两级各卡一拍 20f，窗口原样）
  const swap = interpolate(frame, [18, 38, 58], [0, 0.5, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  // 微甩横移（换装瞬间一次，窗口原样 18–32）
  const whip = interpolate(frame, [18, 24, 32], [0, 18, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const cam = { scale: 1.04, x: whip, y: 0, rot: 0 };
  // 试墨色块拖拽游走（58–72，窗口原样）
  const dragX = interpolate(frame, [58, 72], [420, 900], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  /* 轨道态：光标滑至 07（0–8）→ 07 亮（4）→ 尾段移向 08（74–88，V1 停 0.5） */
  const tail = frame >= TOTAL - 14;
  const lit = frame >= 4 ? 7 : 6;
  const at = tail ? 8 : 7;
  const cursorP = tail ? 0.5 : interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  /* 内容尾段淡出（70–78），让位交接态 */
  const contentOut = interpolate(frame, [70, 78], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep }}>
      <DeepSpace seed="s38v2" stars={40} grid />
      <CameraRig cam={cam}>
        {/* 主题引擎数据台（内容，70–78 淡出） */}
        <div style={{ position: 'absolute', inset: 0, opacity: contentOut }}>
          {/* 换装标题 */}
          <div style={{ position: 'absolute', left: 0, right: 0, top: 190, textAlign: 'center' }}>
            <span style={{ fontFamily: fontFamilies.serif, fontSize: 46, color: FILM_COLORS2.paperWhite, opacity: 0.94, ...glowText(FILM_COLORS2.paperWhite, 0.28, '245,240,232') }}>酒红 ⟷ 素雅</span>
            <div style={{ marginTop: 10 }}>
              <span style={{ fontFamily: fontFamilies.mono, fontSize: 15, letterSpacing: '0.34em', color: FILM_COLORS2.textMuted }}>THEME ENGINE · 100–900</span>
            </div>
          </div>
          {/* 100–900 全阶色卡带铺开（22+i*3 stagger，scaleY 生长，窗口原样） */}
          <div style={{ position: 'absolute', left: 240, right: 240, top: 420, display: 'flex', gap: 18 }}>
            {LIGHT_RAMP.map((light, i) => {
              const rise = interpolate(frame, [22 + i * 3, 34 + i * 3], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
              return (
                <div key={i} style={{ flex: 1 }}>
                  <div style={{ position: 'relative', height: 160 - Math.abs(i - 4) * 8, borderRadius: 4, overflow: 'hidden', border: `1px solid ${FILM_COLORS2.line}`, transform: `scaleY(${rise})`, transformOrigin: 'bottom' }}>
                    {/* 共享明度层 */}
                    <div style={{ position: 'absolute', inset: 0, background: `rgba(245,240,232,${light})` }} />
                    {/* 酒红 hue 层（换装前） */}
                    <div style={{ position: 'absolute', inset: 0, background: `rgba(122,31,22,${WINE_HUE[i]})`, opacity: 1 - swap }} />
                    {/* 素雅 hue 层（换装后） */}
                    <div style={{ position: 'absolute', inset: 0, background: `rgba(138,130,114,${CALM_HUE[i]})`, opacity: swap }} />
                  </div>
                  <div style={{ textAlign: 'center', fontFamily: fontFamilies.mono, fontSize: 14, color: FILM_COLORS2.textMuted, marginTop: 8, opacity: rise * 0.8 }}>{(i + 1) * 100}</div>
                </div>
              );
            })}
          </div>
          {/* 「试墨」色块被拖拽游走（58–72）——手作签名 */}
          <div style={{ position: 'absolute', left: dragX, top: 640, width: 110, height: 44, borderRadius: 22, background: FILM_COLORS2.sealRed, opacity: 0.92, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 22px rgba(122,31,22,0.4)` }}>
            <span style={{ fontFamily: fontFamilies.mono, fontSize: 16, color: FILM_COLORS2.paperWhite, letterSpacing: '0.2em' }}>试墨</span>
          </div>
        </div>
      </CameraRig>

      <Rail lit={lit} at={at} cursorP={cursorP} frame={frame} />
      <HudChrome label="wuh.site · THEMES" readout="MODULE 07" />
      <Grade2 id="GR2-06" />
      <Caption text="换一种墨色，换一种心情。" appearAt={14} />
    </AbsoluteFill>
  );
};

export default S38;
