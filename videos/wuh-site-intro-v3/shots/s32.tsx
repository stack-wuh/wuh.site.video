/* S32 · Act 6 入院 · 局部帧 [0,96) · 96f · 绝对 4730–4826
 *
 * V2 深空数据流重写（2026-11-11 品牌暖黑科技）：书架——原「点击 03→展开窗」改写为
 * HUD 模块轨道读数变化（Rail：光标滑至 03（0–8，窗口原样）→ 03 点亮（4）→ 尾段
 * 光标移向 04（82–96））；书墙数据化：24 枚书脊改为琥珀族竖排数据条（cascade
 * 落架 24–74 窗口原样，≤24 可见，2f/册），骨架屏微光横扫 45f（18–63，窗口原样，
 * 琥珀亮带）；抽出一本移近（74–90，write-fade 窗口原样，物动镜不动）：线框书卡
 * + 书名 +「阅读中」徽章（暖金边）。展开态机位驻定（CM-01，与 V1 同）。
 * 转场：入「切」，出「切」。字幕安全窗：start≥12、end≤84。
 * 尾帧：模块轨道 01–03 亮、光标停在 04 前（交接态：面板+三块亮）。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { CURVES, writeFade } from '../../../brand/motion';
import { FILM_COLORS2, glowText, lightSweep } from '../motion-tokens';
import { Caption } from '../components/Caption';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';

const TOTAL = 96;
const RAIL_PITCH = 74;
/** 书脊数据条配色（FILM_COLORS2 琥珀族轮换，替代旧内联彩虹 hex） */
const SPINE_STYLES = [FILM_COLORS2.data, FILM_COLORS2.dataDim, 'rgba(212,163,115,0.55)', 'rgba(212,163,115,0.32)', FILM_COLORS2.dataDim];

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

const S32: FC = () => {
  const frame = useCurrentFrame();
  const sweep = lightSweep(frame, 18, 45);
  const pullIn = writeFade(frame, 74, true);
  /* 轨道态：光标滑至 03（0–8）→ 03 亮（4）→ 尾段移向 04（82–96） */
  const tail = frame >= TOTAL - 14;
  const lit = frame >= 4 ? 3 : 2;
  const at = tail ? 4 : 3;
  const cursorP = tail ? interpolate(frame, [TOTAL - 14, TOTAL], [0, 0.6], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  /* 内容尾段淡出（82–90），让位交接态 */
  const contentOut = interpolate(frame, [82, 90], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep }}>
      <DeepSpace seed="s32v2" stars={44} grid />

      {/* 书墙数据化（展开态内容，尾段淡出） */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 27, opacity: contentOut }}>
        {/* 骨架屏微光横扫（1.5s ≈ 45f，琥珀亮带） */}
        <div style={{ position: 'absolute', top: 0, bottom: 0, width: 320, left: sweep.sweepX, background: `linear-gradient(90deg, transparent, rgba(212,163,115,0.7), transparent)`, mixBlendMode: 'screen', opacity: sweep.sweepOpacity * 1.4 }} />
        {/* 24 枚书脊数据条 cascade 落架（24–74，2f/册，窗口原样） */}
        {SPINE_STYLES.map((_c, i) => {
          const land = 24 + i * 2;
          const on = frame >= land;
          const rise = interpolate(frame, [land, land + 8], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: 120 + i * 70,
                bottom: 120,
                width: 54,
                height: 300 - (i % 5) * 22,
                background: SPINE_STYLES[i % SPINE_STYLES.length],
                opacity: on ? 0.85 : 0,
                transform: `translateY(${rise * 40}px)`,
                borderRadius: '3px 3px 1px 1px',
                boxShadow: i % 5 === 0 ? `0 0 12px rgba(212,163,115,0.25)` : 'none',
              }}
            >
              <div style={{ position: 'absolute', left: 8, right: 8, top: 20, height: 2, background: FILM_COLORS2.paperWhite, opacity: 0.3 }} />
              <div style={{ position: 'absolute', left: 8, right: 8, top: 30, height: 2, background: FILM_COLORS2.paperWhite, opacity: 0.2 }} />
            </div>
          );
        })}
        {/* 抽出一本移近画幅（物动镜不动，74–90） */}
        <div style={{ position: 'absolute', right: 150, top: 220, width: 430, ...pullIn, opacity: Number(pullIn.opacity ?? 0) * contentOut }}>
          <div style={{ position: 'relative', borderRadius: 8, background: FILM_COLORS2.panel, border: `1px solid ${FILM_COLORS2.line}`, boxShadow: `0 0 34px rgba(212,163,115,0.16), 0 26px 60px rgba(0,0,0,0.55)`, padding: '26px 30px 30px' }}>
            <div style={{ width: 150, height: 210, margin: '0 auto', background: `linear-gradient(160deg, ${FILM_COLORS2.dataDim}, rgba(212,163,115,0.3))`, borderRadius: 4, border: `1px solid ${FILM_COLORS2.line}` }} />
            <div style={{ textAlign: 'center', marginTop: 18, fontFamily: fontFamilies.serif, fontSize: 26, color: FILM_COLORS2.paperWhite, opacity: 0.92 }}>中国古代文化常识</div>
            <div style={{ textAlign: 'center', marginTop: 10 }}>
              <span style={{ fontFamily: fontFamilies.mono, fontSize: 14, color: FILM_COLORS2.gold, border: `1px solid ${FILM_COLORS2.gold}`, padding: '3px 12px', opacity: 0.85, letterSpacing: '0.2em' }}>阅读中</span>
            </div>
          </div>
        </div>
      </div>

      <Rail lit={lit} at={at} cursorP={cursorP} frame={frame} />
      <HudChrome label="wuh.site · BOOKS" readout="MODULE 03" />
      <Grade2 id="GR2-06" />
      <Caption text="读过的书，都站在这里。" appearAt={14} />
    </AbsoluteFill>
  );
};

export default S32;
