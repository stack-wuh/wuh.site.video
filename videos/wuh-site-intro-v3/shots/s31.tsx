/* S31 · Act 6 入院 · 局部帧 [0,96) · 96f · 绝对 4634–4730
 *
 * V2 深空数据流重写（2026-11-11 品牌暖黑科技）：生成式封面——原「点击 02→展开窗」
 * 改写为 HUD 模块轨道读数变化（Rail：光标滑至 02（0–10，窗口原样）→ 点击涟漪
 * （10–22，窗口原样）→ 02 点亮（12）→ 尾段光标移向 03（82–96））；
 * ★DAT-05 CHART-DRAW 山峦/涟漪双曲线改为琥珀辉光描边（24–44 / 44–64 窗口原样，
 * inkDraw 真长度驱动）；金句大字号 kinetic（write-fade 30 + glowText）；
 * p-post-cover-165 封面样本降级为证据快闪小窗（36 出现 → 78 退场，≤2s 口径）；
 * 「wuh.site」落款如钤 66=拍235 落定即凝住（sealRed 手作签名）。
 * 展开态机位驻定（CM-01，与 V1 同——rig 语义保留不施动）。
 * 转场：入「切」，出「切」。字幕安全窗：start≥12、end≤84。
 * 尾帧：模块轨道 01–02 亮、光标停在 03 前（交接态：面板+二块亮）。
 */
import type { FC } from 'react';
import { AbsoluteFill, Img, interpolate, useCurrentFrame } from 'remotion';
import { staticFile } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { CURVES, inkDraw, writeFade } from '../../../brand/motion';
import { FILM_COLORS2, glowText } from '../motion-tokens';
import { Caption } from '../components/Caption';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';

const TOTAL = 96;
const CLICK_AT = 10;
const RAIL_PITCH = 74;

/** V2 模块轨道（原控制台面板的 HUD 化替身）——交接态语义同 s30 */
const Rail: FC<{ lit: number; at: number; cursorP: number; frame: number; ripple: number }> = ({ lit, at, cursorP, frame, ripple }) => (
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
    {ripple > 0 && ripple < 1 ? (
      <div style={{ position: 'absolute', top: 9 - 22 * ripple, left: (at - 1) * RAIL_PITCH + 32 - (12 + 44 * ripple) / 2, width: 12 + 44 * ripple, height: 12 + 44 * ripple, borderRadius: 20, border: `1.5px solid ${FILM_COLORS2.gold}`, opacity: (1 - ripple) * 0.9 }} />
    ) : null}
  </div>
);

const S31: FC = () => {
  const frame = useCurrentFrame();
  // 双曲线逐段描边（24–64：山峦 24–44，涟漪 44–64；真长度驱动，窗口原样）
  const mountain = interpolate(frame, [24, 44], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const rippleWave = interpolate(frame, [44, 64], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const RIDGE_D = 'M 240 700 Q 560 420 880 640 T 1680 560';
  const RIPPLE_D = 'M 240 760 Q 620 830 980 760 T 1680 780';
  /* 证据快闪：封面样本（36 出现 → 78 退场） */
  const coverIn = writeFade(frame, 36, true);
  const coverOut = interpolate(frame, [70, 78], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  /* 轨道态：光标滑至 02（0–10）→ 点击（10–22）→ 02 亮（12）→ 尾段移向 03（82–96） */
  const ripple = frame >= CLICK_AT && frame < CLICK_AT + 12 ? (frame - CLICK_AT) / 12 : 0;
  const tail = frame >= TOTAL - 14;
  const lit = frame >= CLICK_AT + 2 ? 2 : 1;
  const at = tail ? 3 : 2;
  const cursorP = tail ? interpolate(frame, [TOTAL - 14, TOTAL], [0, 0.6], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : interpolate(frame, [0, CLICK_AT], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  /* 内容尾段淡出（82–90），让位交接态 */
  const contentOut = interpolate(frame, [82, 90], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep }}>
      <DeepSpace seed="s31v2" stars={44} grid />

      {/* 山峦/涟漪双曲线（琥珀辉光描边生长） */}
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 27, opacity: contentOut }}>
        <path d={RIDGE_D} fill="none" stroke={FILM_COLORS2.data} strokeWidth={3} strokeLinecap="round" {...inkDraw(mountain, RIDGE_D)} opacity={0.9} style={{ filter: 'drop-shadow(0 0 7px rgba(212,163,115,0.5))' }} />
        <path d={RIPPLE_D} fill="none" stroke={FILM_COLORS2.line} strokeWidth={2} strokeLinecap="round" {...inkDraw(rippleWave, RIPPLE_D)} opacity={0.8} style={{ filter: 'drop-shadow(0 0 5px rgba(212,163,115,0.3))' }} />
      </svg>

      {/* 金句大字号 kinetic */}
      <div style={{ position: 'absolute', left: 190, top: 170, zIndex: 29, ...writeFade(frame, 30), opacity: Number(writeFade(frame, 30).opacity ?? 0) * contentOut }}>
        <span style={{ fontFamily: fontFamilies.serif, fontSize: 62, color: FILM_COLORS2.paperWhite, ...glowText(FILM_COLORS2.paperWhite, 0.32, '245,240,232') }}>每一篇，都有一幅只属于它的山水。</span>
      </div>

      {/* 证据快闪：p-post-cover-165 封面样本（辉光小窗，36 → 78 退场） */}
      <div style={{ position: 'absolute', right: 190, top: 300, width: 520, zIndex: 28, opacity: Number(coverIn.opacity ?? 0) * coverOut * contentOut, transform: `${coverIn.transform ?? ''}` }}>
        <Img
          src={staticFile('wuh-site-intro-v3/site/p-post-cover-165-v1.png')}
          style={{
            width: '100%',
            borderRadius: 10,
            border: `1px solid ${FILM_COLORS2.dataDim}`,
            boxShadow: `0 0 40px rgba(212,163,115,0.2), 0 22px 56px rgba(0,0,0,0.6)`,
            display: 'block',
          }}
        />
        <div style={{ position: 'absolute', left: -1, right: -1, top: -1, bottom: -1, borderRadius: 11, border: `1px solid rgba(212,163,115,0.4)`, opacity: 0.6, pointerEvents: 'none' }} />
      </div>

      {/* 「wuh.site」落款如钤（66=拍235，落定即凝住）——手作签名 */}
      <div style={{ position: 'absolute', right: 220, bottom: 130, zIndex: 29, ...writeFade(frame, 66), opacity: Number(writeFade(frame, 66).opacity ?? 0) * contentOut }}>
        <span style={{ fontFamily: fontFamilies.serif, fontSize: 34, color: FILM_COLORS2.sealRed, letterSpacing: '0.2em', border: `2px solid ${FILM_COLORS2.sealRed}`, padding: '8px 22px', opacity: 0.92, ...glowText(FILM_COLORS2.sealRed, 0.3, '122,31,22') }}>wuh.site</span>
      </div>

      <Rail lit={lit} at={at} cursorP={cursorP} frame={frame} ripple={ripple} />
      <HudChrome label="wuh.site · COVERS" readout="MODULE 02" />
      <Grade2 id="GR2-06" />
      <Caption text="每一篇，都有一幅只属于它的山水。" appearAt={14} />
    </AbsoluteFill>
  );
};

export default S31;
