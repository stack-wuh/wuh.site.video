/* S36 · Act 6 入院 · 局部帧 [0,96) · 96f · 绝对 5172–5268
 *
 * V2 深空数据流重写（2026-11-11 品牌暖黑科技）：热力图成为数据主角——
 * 模块轨道读数变化（Rail：光标滑至 06（0–8，窗口原样）→ 06 点亮（4）→ 尾段
 * 光标移向 07（82–96））；主角 = 全屏大数字 12,800→13,603（★DAT-01 bigNum
 * 28–68 滚动，落定 68=绝对 5240=拍262 对音，SLAM 辉光）+ 365 日热力数据盘
 * （heatCells() 确定性重绘，FN-38 heatDeepen 全盘缓慢加深 18–78，无逐格扫描，
 * 窗口原样）；峰值格 2026-07-24 · 1,263 被 sealRed 环圈住（72 起，标识不滚，
 * 手作签名）；p-heatmap-crop 截图不再使用（数据盘即主角）。
 * 展开态机位缓移峰值格语义保留为注释（CM-06 微移，与 V1 同未施动）。
 * 转场：入「切」，出「切」。字幕安全窗：start≥12、end≤84。
 * 尾帧：峰值格被圈住、热力盘全深（交接态：热力图+前景，交 s37 足迹同框）。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { writeFade } from '../../../brand/motion';
import { bigNum, DATA, FILM_COLORS2, glowText, heatCells, heatDeepen } from '../motion-tokens';
import { Caption } from '../components/Caption';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';

const TOTAL = 96;
const COLS = 71; // 284 格 = 71×4（heatCells 真实月窗日数）
const GRID_LEFT = (1920 - COLS * 24) / 2;
const GRID_TOP = 620;
const RAIL_PITCH = 74;

/* 确定性热力数据（同 bundle 同帧同像素） */
const CELLS = heatCells();
const PEAK_IDX = CELLS.findIndex((c) => c.activity === DATA.peakActivity);

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

const S36: FC = () => {
  const frame = useCurrentFrame();
  /* 主角大数字（28–68 滚动，落定=拍262） */
  const hero = bigNum(frame, 28, 40, 12800, 13603);
  // 365 格全盘加深（18–78）：heatDeepen 全局同一 ramp，无逐格扫描（窗口原样）
  const deepen = interpolate(frame, [18, 78], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  /* 轨道态：光标滑至 06（0–8）→ 06 亮（4）→ 尾段移向 07（82–96） */
  const tail = frame >= TOTAL - 14;
  const lit = frame >= 4 ? 6 : 5;
  const at = tail ? 7 : 6;
  const cursorP = tail ? interpolate(frame, [TOTAL - 14, TOTAL], [0, 0.6], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  /* 内容尾段淡出（82–90），让位交接态 */
  const contentOut = interpolate(frame, [82, 90], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  /* 展开态机位缓移峰值格（CM-06 微移语义保留，与 V1 同未施动） */
  void interpolate(frame, [18, 78], [0, -50], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep }}>
      <DeepSpace seed="s36v2" stars={52} grid horizon />

      {/* 主角：全屏大数字 12,800→13,603（落定 SLAM 辉光） */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 196, textAlign: 'center', zIndex: 29, opacity: contentOut }}>
        <span style={{ fontFamily: fontFamilies.mono, fontSize: 17, letterSpacing: '0.4em', color: FILM_COLORS2.textMuted, ...writeFade(frame, 24) }}>MODULE 06 · ACTIVITY 365D</span>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 236,
          textAlign: 'center',
          zIndex: 29,
          fontFamily: fontFamilies.mono,
          fontSize: 190,
          fontWeight: 700,
          lineHeight: 1.05,
          color: FILM_COLORS2.data,
          fontVariantNumeric: 'tabular-nums',
          letterSpacing: '0.02em',
          opacity: contentOut * interpolate(frame, [28, 38], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          transform: `scale(${hero.slam})`,
          ...glowText(FILM_COLORS2.data, hero.glow),
        }}
      >
        {hero.text}
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 474, textAlign: 'center', zIndex: 29, opacity: contentOut }}>
        <span style={{ fontFamily: fontFamilies.mono, fontSize: 17, color: FILM_COLORS2.textMuted, ...writeFade(frame, 30), letterSpacing: '0.14em' }}>次活动 / 365 天 · 167 天有活动</span>
      </div>

      {/* 365 日热力数据盘（heatCells 确定性重绘 + heatDeepen 全盘加深） */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 28, opacity: contentOut }}>
        <div
          style={{
            position: 'absolute',
            left: GRID_LEFT - 16,
            top: GRID_TOP - 16,
            width: COLS * 24 + 32,
            height: Math.ceil(CELLS.length / COLS) * 24 + 32,
            borderRadius: 10,
            border: `1px solid ${FILM_COLORS2.line}`,
            background: FILM_COLORS2.panel,
            boxShadow: `0 0 30px rgba(212,163,115,${0.08 + deepen * 0.1})`,
          }}
        />
        {CELLS.map((c, i) => {
          const col = i % COLS;
          const row = Math.floor(i / COLS);
          const deep = heatDeepen(frame, c.activity, 18, 78);
          return <div key={i} style={{ position: 'absolute', left: GRID_LEFT + col * 24, top: GRID_TOP + row * 24, width: 16, height: 16, borderRadius: 3, background: deep.background, opacity: deep.opacity }} />;
        })}
        {/* 峰值格被 sealRed 环圈住（72 起，标识不滚）——手作签名 */}
        {PEAK_IDX >= 0 ? (
          <div style={{ position: 'absolute', left: GRID_LEFT + (PEAK_IDX % COLS) * 24 - 24, top: GRID_TOP + Math.floor(PEAK_IDX / COLS) * 24 - 24, opacity: Number(writeFade(frame, 72).opacity ?? 0) * contentOut }}>
            <div style={{ width: 64, height: 64, borderRadius: 32, border: `2px solid ${FILM_COLORS2.sealRed}`, opacity: 0.9, boxShadow: `0 0 16px rgba(122,31,22,0.35)` }} />
            <span style={{ position: 'absolute', left: 76, top: 12, fontFamily: fontFamilies.mono, fontSize: 15, color: FILM_COLORS2.paperWhite, opacity: 0.85, whiteSpace: 'nowrap' }}>2026-07-24 · 1,263</span>
          </div>
        ) : null}
      </div>
      {/* 全盘加深时的暖光聚焦（窗口原样 18–78） */}
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 62% 34%, rgba(212,163,115,0.12), transparent 46%)`, opacity: deepen * contentOut, pointerEvents: 'none', zIndex: 27 }} />

      <Rail lit={lit} at={at} cursorP={cursorP} frame={frame} />
      <HudChrome label="wuh.site · HEATMAP" readout="MODULE 06" />
      <Grade2 id="GR2-06" />
      <Caption text="三百六十五天，逐格真实。" appearAt={14} />
    </AbsoluteFill>
  );
};

export default S36;
