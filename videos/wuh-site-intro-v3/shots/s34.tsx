/* S34 · Act 6 入院 · 局部帧 [0,72) · 72f · 绝对 5012–5084
 *
 * V2 深空数据流重写（2026-11-11 品牌暖黑科技）：安静半拍（两种人格·其一）——
 * 模块轨道 05 点亮（4），留言板窄栏数据化：辉光纵线节点生长（18–48，窗口原样）
 * + 衬线斜体日期落位（20+i*6，窗口原样），安静的一列留言自己排好；右侧留一枚
 * 暗色线框窗轮廓（弹幕窗将启）。半拍静置（48–72）——热闹在对面的窗里。
 * 转场：入「切」，出「切」。无字幕（安静半拍）。
 * 尾帧：留言板窄栏在左、弹幕窗将启（交接态：面板+五块亮·05 展开中）。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { CURVES, writeFade } from '../../../brand/motion';
import { FILM_COLORS2, glowText } from '../motion-tokens';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';

const RAIL_PITCH = 74;
const DATES = ['03-14', '04-02', '05-21', '06-08', '08-30', '10-17'];

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

const S34: FC = () => {
  const frame = useCurrentFrame();
  // 本镜无尾段收束：05 保持展开至镜尾（光标不前移，交接态=五块亮·05 展开中）
  const lit = frame >= 4 ? 5 : 4;
  const at = 5;
  const cursorP = 0.5;

  return (
    <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep }}>
      <DeepSpace seed="s34v2" stars={32} grid />

      {/* 留言板窄栏（安静列）：辉光纵线 + 节点生长（18–48）+ 留言自排（20+i*6） */}
      <div style={{ position: 'absolute', left: 560, top: 170, bottom: 130, width: 4, borderRadius: 2, background: `linear-gradient(180deg, ${FILM_COLORS2.data}, ${FILM_COLORS2.dataDim})`, opacity: 0.55, boxShadow: `0 0 12px rgba(212,163,115,0.3)` }} />
      <div style={{ position: 'absolute', inset: 0, zIndex: 27 }}>
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const grow = interpolate(frame, [18 + i * 6, 44 + i * 6], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
          return (
            <div key={i}>
              <div style={{ position: 'absolute', left: 560, top: 170 + i * 110, width: 4, height: grow * 100, background: FILM_COLORS2.line }} />
              <div
                style={{
                  position: 'absolute',
                  left: 556,
                  top: 170 + i * 110 + grow * 100 - 5,
                  width: 12,
                  height: 12,
                  borderRadius: 6,
                  background: FILM_COLORS2.data,
                  boxShadow: `0 0 ${8 + grow * 10}px rgba(212,163,115,${0.3 + grow * 0.3})`,
                  opacity: grow * 0.95,
                }}
              />
              {/* 留言行（衬线斜体日期 + 内容行，write-fade 自排） */}
              <div style={{ position: 'absolute', left: 600, top: 170 + i * 110 + grow * 100 - 24, ...writeFade(frame, 20 + i * 6) }}>
                <span style={{ fontFamily: fontFamilies.serif, fontSize: 15, fontStyle: 'italic', color: FILM_COLORS2.textMuted }}>{DATES[i]}</span>
                <div style={{ width: 300 - (i % 3) * 60, height: 13, borderRadius: 3, background: `rgba(245,240,232,${0.4 - (i % 3) * 0.06})`, marginTop: 8 }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* 右侧留白（弹幕窗将启的暗窗轮廓） */}
      <div style={{ position: 'absolute', right: 140, top: 180, bottom: 180, width: 500, border: `1px solid ${FILM_COLORS2.line}`, opacity: 0.5, borderRadius: 10, background: `rgba(23,20,16,0.5)`, boxShadow: `0 0 24px rgba(212,163,115,0.06)` }}>
        <span style={{ position: 'absolute', left: 20, top: 14, fontFamily: fontFamilies.mono, fontSize: 13, letterSpacing: '0.3em', color: FILM_COLORS2.textMuted, opacity: 0.6 }}>BARRAGE · STANDBY</span>
        <span style={{ position: 'absolute', right: 20, bottom: 14, fontFamily: fontFamilies.mono, fontSize: 13, color: FILM_COLORS2.textMuted, opacity: 0.6 }}>· · ·</span>
      </div>

      <Rail lit={lit} at={at} cursorP={cursorP} frame={frame} />
      <HudChrome label="wuh.site · GUESTBOOK" readout="MODULE 05 · QUIET" />
      <Grade2 id="GR2-06" />
    </AbsoluteFill>
  );
};

export default S34;
