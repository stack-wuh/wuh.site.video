/* S34 · Act 6 入院 · 局部帧 [0,72) · 72f · 绝对 5012–5084
 *
 * V3 审计返工重写（2026-11-12 storyboard-audit s34 条 = 安静半拍·呼吸镜处理，微动不断，
 * 衔接 s33→s35）：面板 05 点亮后的一口呼吸——留言板窄栏在左自己排好，右侧弹幕窗「将启」。
 * 呼吸纪律：全镜无 >12f 连续静止——相机慢推 + handheld 常驻、节点辉光呼吸链错峰相位、
 * 弹幕窗内气泡剪影循环预升（将启而不启，安静但活着）。
 * 逐拍事件链（局部帧，fps=30）：
 * 【承接】0–4 承 s33 尾帧（面板 01–04 亮·光标停 05 前）→ 4 面板 05 点亮（lit 4→5，
 *         展开态驻留至镜尾，光标不前移——交接态「五块亮·05 展开中」窗口原样）。
 * 【触发】4–20 留言板辉光纵线自顶生长（writeFade 慢档）；8–20 右侧弹幕窗线框点亮
 *         （frameIn 辉光呼吸，BARRAGE · STANDBY 读数）。
 * 【展开】18–48 六节点纵线级联生长（18+i*6 窗口原样，springIn 位移入场）+ 衬线斜体日期
 *         逐行落位（20+i*6 窗口原样）+ 内容行灰条自排——安静的一列留言自己排好；
 *         20–64 呼吸链：节点辉光按 i*7f 相位错峰脉动（sin 常驻，永不静止）。
 * 【预启】48–72 弹幕窗内 3 枚气泡剪影循环预升（random(seed) 相位，y 上漂 + 淡入淡出
 *         常驻循环 = 「热闹在对面的窗里」）；56–72 HUD readout 切 BARRAGE · LOADING。
 * 【交接】全镜保持 05 展开态；尾帧 = 留言板窄栏在左、弹幕窗将启（交接态：面板+五块亮·
 *         05 展开中 → s35 弹幕侧开演）。
 * 意义一句话：热闹到来前的半拍安静——留言安静排好、对面的窗将启未启，站点有两种性格。
 * 时间轴零改动：72f / 05 亮 4 / 节点窗 18–48 / 无字幕（安静半拍，manifest 原样）/
 * 尾帧交接态语义原样。
 * 转场：入「切」，出「切」。镜内文字最低点 y≈900（<930，不进 bottom 150px）；
 * 零图片零快照引用；random(seed) only；无 <Sequence>；springIn fps 取
 * useVideoConfig()；色板只用 FILM_COLORS2。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { CURVES, writeFade } from '../../../brand/motion';
import { FILM_COLORS2, glowText, handheld, springIn } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';

const TOTAL = 72;
const RAIL_PITCH = 74;
const DATES = ['03-14', '04-02', '05-21', '06-08', '08-30', '10-17'];
const LINE_X = 560;
const ROW_PITCH = 110;

/** V2 模块轨道（原控制台面板的 HUD 化替身）——交接态语义同 s30 */
const Rail: FC<{ lit: number; at: number; cursorP: number; frame: number }> = ({ lit, at, cursorP, frame }) => (
  <div style={{ position: 'absolute', left: '50%', top: 92, width: 582, marginLeft: -291, zIndex: 26 }}>
    <div style={{ display: 'flex', gap: 10 }}>
      {Array.from({ length: 8 }).map((_v, i) => {
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
  const { fps } = useVideoConfig();
  /* 呼吸相机：慢推 1.0→1.03 + handheld 常驻（微动不断的第一层） */
  const hh = handheld('s34-cam', frame, 0.8);
  const cam = {
    scale: interpolate(frame, [0, TOTAL], [1.0, 1.03], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }),
    x: hh.dx,
    y: hh.dy,
    rot: hh.rot,
  };
  /* 本镜无尾段收束：05 保持展开至镜尾（光标不前移，交接态=五块亮·05 展开中） */
  const lit = frame >= 4 ? 5 : 4;
  const at = 5;
  const cursorP = 0.5;
  /* 纵线主干生长（4–44 writeFade 慢档） */
  const trunk = writeFade(frame, 4, true);
  /* 弹幕窗点亮（8–20） */
  const boxIn = springIn(frame, 8, fps, 17, 180, 0.9);

  return (
    <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep }}>
      <DeepSpace seed="s34v2" stars={32} grid />

      <CameraRig cam={cam}>
        {/* 留言板窄栏（安静列）：辉光纵线生长（4–44）+ 节点级联（18–48）+ 呼吸链常驻 */}
        <div style={{ position: 'absolute', left: LINE_X, top: 170, width: 4, height: interpolate(frame, [4, 44], [0, 640], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut }), borderRadius: 2, background: `linear-gradient(180deg, ${FILM_COLORS2.data}, ${FILM_COLORS2.dataDim})`, opacity: (0.55 + 0.08 * Math.sin(frame / 8)) * Number(trunk.opacity ?? 0), boxShadow: `0 0 12px rgba(212,163,115,0.3)` }} />
        <div style={{ position: 'absolute', inset: 0, zIndex: 27 }}>
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const grow = interpolate(frame, [18 + i * 6, 44 + i * 6], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
            const p = springIn(frame, 18 + i * 6, fps, 16, 190, 0.85);
            /* 呼吸链：每节点按 i*7f 相位错峰脉动（永不静止） */
            const breathe = 0.5 + 0.5 * Math.sin(frame / 9 - i * 1.15);
            return (
              <div key={i}>
                <div style={{ position: 'absolute', left: LINE_X, top: 170 + i * ROW_PITCH, width: 4, height: grow * 100, background: FILM_COLORS2.line }} />
                <div
                  style={{
                    position: 'absolute',
                    left: LINE_X - 4,
                    top: 170 + i * ROW_PITCH + grow * 100 - 5,
                    width: 12,
                    height: 12,
                    borderRadius: 6,
                    background: FILM_COLORS2.data,
                    boxShadow: `0 0 ${8 + breathe * 10}px rgba(212,163,115,${0.28 + breathe * 0.28})`,
                    opacity: p * 0.95,
                    transform: `translateY(${(1 - p) * -12}px) scale(${0.6 + p * 0.4})`,
                  }}
                />
                {/* 留言行（衬线斜体日期 + 内容行，write-fade 自排） */}
                <div style={{ position: 'absolute', left: 600, top: 170 + i * ROW_PITCH + grow * 100 - 24, ...writeFade(frame, 20 + i * 6) }}>
                  <span style={{ fontFamily: fontFamilies.serif, fontSize: 15, fontStyle: 'italic', color: FILM_COLORS2.textMuted }}>{DATES[i]}</span>
                  <div style={{ width: 300 - (i % 3) * 60, height: 13, borderRadius: 3, background: `rgba(245,240,232,${0.4 - (i % 3) * 0.06})`, marginTop: 8, transform: `translateX(${(1 - Math.min(1, p * 1.3)) * -10}px)`, opacity: 0.55 + breathe * 0.12 }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* 右侧弹幕窗（将启的暗窗轮廓，8–20 点亮；窗内气泡剪影循环预启） */}
        <div style={{ position: 'absolute', right: 140, top: 180, bottom: 180, width: 500, border: `1px solid ${FILM_COLORS2.line}`, opacity: 0.5 * boxIn + 0.06 * Math.sin(frame / 10) * boxIn, borderRadius: 10, background: FILM_COLORS2.panel, boxShadow: `0 0 ${24 + boxIn * 10}px rgba(212,163,115,${0.06 + boxIn * 0.05})`, transform: `translateY(${(1 - boxIn) * 14}px)` }}>
          <span style={{ position: 'absolute', left: 20, top: 14, fontFamily: fontFamilies.mono, fontSize: 13, letterSpacing: '0.3em', color: FILM_COLORS2.textMuted, opacity: 0.6 * boxIn }}>BARRAGE · STANDBY</span>
          {/* 三枚气泡剪影循环预升（random(seed) 相位；将启而不启） */}
          {[0, 1, 2].map((i) => {
            const phase = random(`s34-bub-${i}`) * 44;
            const t = ((frame + phase) % 44) / 44;
            const o = interpolate(t, [0, 0.25, 0.8, 1], [0, 0.5, 0.5, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) * boxIn;
            const y = (1 - t) * 150 + 90 + i * 10;
            const w = 150 + random(`s34-bub-w${i}`) * 140;
            return (
              <div key={i} style={{ position: 'absolute', left: 26 + i * 118, top: y, width: w, height: 26, borderRadius: 8, border: `1px solid ${FILM_COLORS2.line}`, background: `rgba(245,240,232,${0.05})`, opacity: o }}>
                <div style={{ position: 'absolute', left: 10, top: 8, width: w * 0.55, height: 8, borderRadius: 3, background: `rgba(245,240,232,0.16)` }} />
              </div>
            );
          })}
          <span style={{ position: 'absolute', right: 20, bottom: 14, fontFamily: fontFamilies.mono, fontSize: 13, color: FILM_COLORS2.data, opacity: (0.35 + 0.3 * Math.sin(frame / 5)) * boxIn }}>· · ·</span>
        </div>
      </CameraRig>

      <Rail lit={lit} at={at} cursorP={cursorP} frame={frame} />
      <HudChrome label="wuh.site · GUESTBOOK" readout={frame >= 56 ? 'BARRAGE · LOADING' : 'MODULE 05 · QUIET'} />
      <Grade2 id="GR2-06" />
    </AbsoluteFill>
  );
};

export default S34;
