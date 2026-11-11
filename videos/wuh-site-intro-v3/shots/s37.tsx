/* S37 · Act 6 入院 · 局部帧 [0,78) · 78f · 绝对 5268–5346
 *
 * V2 深空数据流重写（2026-11-11 品牌暖黑科技）：热力图与足迹同框——s36 热力盘
 * 降级为证据快闪小窗（0 出现，36–44 退场，≤2s 口径，上移退场窗口 0–20 原样）；
 * 足迹改为线框坐标图（frameIn 4 浮入窗口原样）：坐标网格 + 同心环 + 两枚落点
 * 琥珀辉光点亮——杨梅坑 32=绝对 5300=拍265、梧桐山 52=绝对 5320=拍266
 * （与镜 23 同源回响，涟漪参数同族、窗口原样）；模块轨道保持六块亮，尾段光标
 * 微移向 07（62–78，窗口原样）。本镜机位驻定（与 V1 同未施动，cam 语义保留）。
 * 转场：入「切」，出「切」。字幕安全窗：start≥12、end≤66。
 * 尾帧：模块轨道 01–06 亮、光标停在 07 前（交接态：面板+六块亮）。
 */
import type { FC } from 'react';
import { AbsoluteFill, Img, interpolate, useCurrentFrame } from 'remotion';
import { staticFile } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';

import { FILM_COLORS2, frameIn, glowText } from '../motion-tokens';
import { Caption } from '../components/Caption';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';

const TOTAL = 78;
const RAIL_PITCH = 74;
const PIN_A = { x: 940, y: 700, land: 32, label: '杨梅坑 · 2025-08' }; // = 拍265
const PIN_B = { x: 640, y: 560, land: 52, label: '梧桐山 · 2025-09' }; // = 拍266

/** 落点亮起（涟漪参数与镜 23 同族、更紧凑；窗口原样） */
const EchoPin: FC<{ p: { x: number; y: number; land: number; label: string }; frame: number; dim: number }> = ({ p, frame, dim }) => {
  const on = frame >= p.land;
  const r1 = interpolate(frame, [p.land, p.land + 30], [0, 90], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return on ? (
    <div style={{ opacity: dim }}>
      <div style={{ position: 'absolute', left: p.x - 7, top: p.y - 7, width: 14, height: 14, borderRadius: 7, background: FILM_COLORS2.gold, boxShadow: `0 0 14px 4px rgba(212,163,115,0.5)` }} />
      {r1 > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: p.x - r1,
            top: p.y - r1 / 2,
            width: r1 * 2,
            height: r1,
            borderRadius: r1,
            border: `1.2px solid ${FILM_COLORS2.data}`,
            opacity: interpolate(frame, [p.land, p.land + 10, p.land + 30], [0, 0.5, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          }}
        />
      ) : null}
      <span style={{ position: 'absolute', left: p.x + 14, top: p.y - 26, fontFamily: fontFamilies.mono, fontSize: 13, color: FILM_COLORS2.paperWhite, opacity: 0.85, whiteSpace: 'nowrap', ...glowText(FILM_COLORS2.paperWhite, 0.25, '245,240,232') }}>{p.label}</span>
    </div>
  ) : null;
};

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

const S37: FC = () => {
  const frame = useCurrentFrame();
  /* 证据快闪：s36 热力盘余韵（0 出现 → 44 退场；上移退场窗口 0–20 原样） */
  const proofDrift = interpolate(frame, [0, 20], [0, -40], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const proofDim = interpolate(frame, [0, 20], [1, 0.35], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) * interpolate(frame, [36, 44], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  /* 足迹坐标图（frameIn 4 浮入，窗口原样） */
  const win = frameIn(frame, 4);
  /* 轨道态：六块亮，光标停在 07 前（62–78 微移，窗口原样） */
  const tail = frame >= TOTAL - 16;
  const lit = 6;
  const at = 7;
  const cursorP = tail ? interpolate(frame, [TOTAL - 16, TOTAL], [0, 0.6], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 0.5;
  /* 内容尾段淡出（62–70），让位交接态 */
  const contentOut = interpolate(frame, [62, 70], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep }}>
      <DeepSpace seed="s37v2" stars={40} grid />

      {/* 证据快闪：s36 热力盘余韵（小窗，0 → 44 退场） */}
      <div
        style={{
          position: 'absolute',
          left: 190,
          top: 110 + proofDrift,
          width: 480,
          zIndex: 28,
          opacity: 0.6 * proofDim,
        }}
      >
        <Img
          src={staticFile('wuh-site-intro-v3/site/p-heatmap-crop-v1.png')}
          style={{
            width: '100%',
            borderRadius: 10,
            border: `1px solid ${FILM_COLORS2.dataDim}`,
            boxShadow: `0 0 30px rgba(212,163,115,0.18), 0 18px 44px rgba(0,0,0,0.6)`,
            display: 'block',
          }}
        />
      </div>

      {/* 足迹线框坐标图（内容，62–70 淡出） */}
      <div style={{ position: 'absolute', left: 480, top: 420, width: 900, height: 380, zIndex: 27, ...win, opacity: Number(win.opacity ?? 0) * contentOut, boxShadow: `0 0 34px rgba(212,163,115,0.14), 0 24px 60px rgba(0,0,0,0.5)` }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: 10, border: `1px solid ${FILM_COLORS2.line}`, background: FILM_COLORS2.panel }} />
        <div
          style={{
            position: 'absolute',
            inset: 1,
            borderRadius: 9,
            backgroundImage: `linear-gradient(rgba(212,163,115,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(212,163,115,0.06) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
        {/* 同心环（雷达坐标感） */}
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ position: 'absolute', left: 380 - i * 110, top: 90 - i * 110, width: 340 + i * 220, height: 340 + i * 220, borderRadius: 200, border: `1px solid ${i === 0 ? FILM_COLORS2.line : FILM_COLORS2.grid}`, opacity: 0.5 - i * 0.12 }} />
        ))}
        <span style={{ position: 'absolute', left: 14, top: 10, fontFamily: fontFamilies.mono, fontSize: 13, color: FILM_COLORS2.paperWhite, opacity: 0.8, letterSpacing: '0.2em' }}>足 迹 · FOOTPRINT</span>
      </div>
      {/* 两枚落点亮起（32=拍265 / 52=拍266，窗口原样） */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 28, opacity: contentOut, pointerEvents: 'none' }}>
        <EchoPin p={PIN_A} frame={frame} dim={1} />
        <EchoPin p={PIN_B} frame={frame} dim={1} />
      </div>
      {/* 视线自热力图移到足迹图（聚光偏移，窗口原样 20–40） */}
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 74% 58%, transparent 40%, rgba(10,9,8,0.35))`, opacity: interpolate(frame, [20, 40], [0, 0.8], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) * contentOut, pointerEvents: 'none', zIndex: 29 }} />

      <Rail lit={lit} at={at} cursorP={cursorP} frame={frame} />
      <HudChrome label="wuh.site · FOOTPRINT" readout="2025-08 · 09" />
      <Grade2 id="GR2-06" />
      <Caption text="此乐何极~" appearAt={14} />
    </AbsoluteFill>
  );
};

export default S37;
