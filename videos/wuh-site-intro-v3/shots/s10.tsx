/* S10 · Act 2 旧屋 · 局部帧 [0,240) · 240f · 绝对 1344–1584
 *
 * V3 批次 A 重做（2026-11-12 六门验收 + 审计返工单 · 审计重定义：TypeScript 重写 = 代码数据件，
 * typeCharsAt 键击 + 行生长）：
 * 【承接】首帧承接 s09 尾帧交出的「宣言落定 + 笔电掀盖屏光微亮」——本镜屏幕亮起（0–16
 *         原窗），镜头俯身看那行行被重写的代码。
 * 【触发】主动作 = 键击重写：rewrite.ts 三行旧 JS 依次被 TypeScript 行**逐字符键击**替换
 *         （24/48/72，typeCharsAt 量化），类型标注行随键击完成**横向生长**浮出（形变入场）；
 *         96–126 横摇到流水线窗，build/test/deploy 三节点 136/156/176（对齐矩阵帧位，
 *         絕不动）springIn 点亮，deploy 176 落定带粒子冲击。
 * 【展开】逐拍帧表（局部帧，fps=30）：
 *   [0–16]    编辑器屏幕亮起（blur 8→0 原窗）+ handheld('s10-cam',1.1) + dataCurtain('s10-rain',8 列,110)；
 *   [8–20]    文件名 rewrite.ts — 2021·10 键击逐字（0.6f/字）+ 键击光标闪烁；
 *   [24/48/72] 三行重写连击（每行 24f）：旧 JS 行划线压暗 → 新 TS 行逐字键击（0.7f/字）
 *             → 类型标注行 scaleX 0→1 横向生长 + gold 辉光（↳ Promise<Post[]> / Post[] / FC）；
 *   [96–126]  横摇（原窗）：编辑器左移出画、流水线窗入画；
 *   [136/156/176] build/test/deploy 三节点 springIn 弹入点亮（✓ gold），deploy 176=绝对 1520
 *             落定：sparkBurst('s10-burst',10 粒) + 状态灯琥珀辉光（176–196 原窗）；
 *   [196–236] rack focus 收拢、其余沉暗（原窗）——尾帧交接态：暗场中一点状态灯高亮。
 * 【交接】尾帧 = 暗场中一点琥珀状态灯高亮（manifest endFrameDesc：暗场中一点绿灯高亮，
 *         语义=部署成功的一盏灯，色板纪律下为琥珀状态灯）→ 交 s11 幕间呼吸时间线。
 * 意义一句话：三行 JS 被逐字敲成 TypeScript，流水线三盏灯次第亮起——十二月，部署第一次全自动。
 * 时间轴零改动：240f / 屏亮 0–16 / 三行 24/48/72 / 横摇 96–126 / 节点 136/156/176（对齐矩阵）/ 状态灯 176–196 / rack 196–236 / Caption（appearAt 14）原样。
 * 转场：入「切」出「切」。字幕安全窗：start≥14、end≤228。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { CURVES } from '../../../brand/motion';
import {
  FILM_COLORS2,
  dataCurtain,
  glowText,
  handheld,
  cursorBlink,
  sparkBurst,
  springIn,
  typeCharsAt,
} from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { Caption } from '../components/Caption';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';

const TOTAL = 240;
const FILENAME = 'rewrite.ts — 2021·10';
const CODE_ROWS = [
  { js: 'var api = require("./api")', ts: 'import { api } from "./api"', types: 'Promise<Post[]>' },
  { js: 'function render(list) {', ts: 'const render = (list: Post[]): JSX.Element => {', types: 'Post[]' },
  { js: 'module.exports = App', ts: 'export default App', types: 'FC' },
];
const NODES = [
  { name: 'build', delay: 136 },
  { name: 'test', delay: 156 },
  { name: 'deploy', delay: 176 },
];

const S10: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // 屏幕亮起（0–16）
  const screenOn = interpolate(frame, [0, 16], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  // 文件名键击（8 起 0.6f/字）+ 光标
  const nameShown = typeCharsAt(frame, FILENAME.length, 8, 0.6);
  // 横摇（96–126）：编辑器 → 流水线窗
  const pan = interpolate(frame, [96, 126], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  // deploy 落定（176）：粒子冲击
  const burst = sparkBurst('s10-burst', frame, 176, 10);
  // 末段 rack focus 收拢（196–236）
  const focus = interpolate(frame, [196, 236], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const hh = handheld('s10-cam', frame, 1.1);
  const cam = {
    scale: interpolate(frame, [0, TOTAL], [1.02, 1.09], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }),
    x: interpolate(frame, [96, 126], [0, -120], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }) + interpolate(frame, [196, 236], [0, 60], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }) + hh.dx,
    y: interpolate(frame, [196, 236], [0, 40], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }) + hh.dy,
    rot: hh.rot,
  };
  const rain = dataCurtain('s10-rain', frame, 8, 110);

  return (
    <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep }}>
      <DeepSpace seed="s10v2" stars={44} grid />
      {/* 数字雨帘（背景氛围层） */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 2, pointerEvents: 'none' }}>
        {rain.map((c, i) => (
          <span key={`rain-${i}`} style={{ position: 'absolute', left: `${c.x}%`, top: c.y, fontFamily: fontFamilies.mono, fontSize: 13, color: FILM_COLORS2.data, opacity: c.o, fontVariantNumeric: 'tabular-nums' }}>
            {c.text}
          </span>
        ))}
      </div>
      <CameraRig cam={cam}>
        <AbsoluteFill>
          {/* 线框编辑器（屏幕微距；随横摇左移出画） */}
          <div style={{ position: 'absolute', left: 120 - pan * 260, top: 150, width: 1100, height: 660, opacity: screenOn, filter: `blur(${(1 - screenOn) * 8}px)`, background: FILM_COLORS2.panel, borderRadius: 10, border: `1px solid ${FILM_COLORS2.line}`, boxShadow: `0 0 30px rgba(212,163,115,0.08), 0 24px 60px rgba(0,0,0,0.5)` }}>
            <div style={{ position: 'absolute', left: 24, top: 18, display: 'flex', gap: 10, alignItems: 'center' }}>
              {[0, 1, 2].map((i) => (
                <div key={`dot-${i}`} style={{ width: 12, height: 12, borderRadius: 6, background: FILM_COLORS2.dataDim, opacity: 0.45 }} />
              ))}
              <span style={{ fontFamily: fontFamilies.mono, fontSize: 15, color: FILM_COLORS2.textMuted, marginLeft: 12, opacity: 0.8, whiteSpace: 'pre' }}>{FILENAME.slice(0, nameShown)}</span>
              {frame >= 8 && nameShown < FILENAME.length ? <span style={{ display: 'inline-block', width: 8, height: 14, background: FILM_COLORS2.textMuted, opacity: cursorBlink(frame, 8, 4, 4) ? 0.9 : 0.25 }} /> : null}
            </div>
            {CODE_ROWS.map((row, i) => {
              const t0 = 24 + i * 24;
              const done = typeCharsAt(frame, row.ts.length, t0 + 2, 0.7);
              const typing = frame >= t0 + 2 && done < row.ts.length;
              // 旧 JS 行：键击开始即划线压暗
              const oldFade = interpolate(frame, [t0, t0 + 8], [0.85, 0.28], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
              // 类型标注行：键击完成后横向生长（scaleX 0→1，形变入场）
              const typesP = interpolate(frame, [t0 + 2 + row.ts.length * 0.7, t0 + 10 + row.ts.length * 0.7], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
              return (
                <div key={`row-${i}`} style={{ position: 'absolute', left: 30, top: 90 + i * 96, right: 30 }}>
                  {/* 旧 JS 行 */}
                  <div style={{ fontFamily: fontFamilies.mono, fontSize: 24, color: FILM_COLORS2.textMuted, opacity: oldFade, textDecoration: 'line-through' }}>{row.js}</div>
                  {/* 新 TS 行：逐字键击（0.7f/字）+ 行生长滑入 */}
                  <div style={{ fontFamily: fontFamilies.mono, fontSize: 24, color: FILM_COLORS2.paperWhite, marginTop: 8, whiteSpace: 'pre', transform: `translateX(${(1 - Math.min(1, done / 6)) * -14}px)`, opacity: frame >= t0 ? 1 : 0 }}>
                    {row.ts.slice(0, done)}
                    {typing ? <span style={{ display: 'inline-block', width: 9, height: 17, marginLeft: 4, verticalAlign: '-2px', background: FILM_COLORS2.data, opacity: cursorBlink(frame, t0 + 2, 4, 4) ? 0.9 : 0.3 }} /> : null}
                  </div>
                  {/* 类型标注高亮（键击完成 → 横向生长，gold） */}
                  <div
                    style={{
                      fontFamily: fontFamilies.mono,
                      fontSize: 18,
                      color: FILM_COLORS2.gold,
                      marginTop: 6,
                      transformOrigin: 'left center',
                      transform: `scaleX(${typesP})`,
                      opacity: typesP,
                      ...(frame >= t0 + 10 + row.ts.length * 0.7 ? glowText(FILM_COLORS2.gold, 0.3 * typesP, '233,217,174') : {}),
                    }}
                  >
                    ↳ {row.types}
                  </div>
                </div>
              );
            })}
          </div>

          {/* 线框流水线窗 + Actions 三节点（随横摇入画） */}
          <div style={{ position: 'absolute', left: 1180, top: 180, width: 620, height: 560, opacity: pan, background: FILM_COLORS2.panel, borderRadius: 10, border: `1px solid ${FILM_COLORS2.line}`, boxShadow: `0 0 30px rgba(212,163,115,0.08), 0 24px 60px rgba(0,0,0,0.5)` }}>
            <div style={{ position: 'absolute', left: 26, top: 20, fontFamily: fontFamilies.mono, fontSize: 16, color: FILM_COLORS2.textMuted, opacity: 0.8 }}>
              github-actions · first run · 2021-12
            </div>
            {NODES.map((n, i) => {
              const p = springIn(frame, n.delay, fps);
              const isDeploy = n.name === 'deploy';
              const lit = frame >= n.delay + 12;
              return (
                <div key={n.name} style={{ position: 'absolute', left: 40, top: 100 + i * 130, display: 'flex', alignItems: 'center', gap: 20, transform: `translateX(${(1 - p) * -22}px)`, opacity: Math.min(1, p * 1.4) }}>
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 15,
                      border: `2px solid ${FILM_COLORS2.data}`,
                      background: `rgba(212,163,115,${p * 0.3})`,
                      boxShadow: isDeploy && lit ? `0 0 18px 4px rgba(212,163,115,0.45)` : 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <span style={{ color: FILM_COLORS2.gold, fontSize: 16, opacity: p }}>✓</span>
                  </div>
                  <span style={{ fontFamily: fontFamilies.mono, fontSize: 26, color: FILM_COLORS2.paperWhite, opacity: 0.9 }}>{n.name}</span>
                </div>
              );
            })}
            {/* deploy 落定（176）：粒子冲击，锚在 deploy 节点（1220, 510） */}
            {frame >= 176 ? (
              <div style={{ position: 'absolute', left: 80, top: 498, width: 0, height: 0, zIndex: 28, pointerEvents: 'none' }}>
                {burst.map((p, i) => (
                  <div key={`burst-${i}`} style={p.style} />
                ))}
              </div>
            ) : null}
            {/* 部署状态灯映在窗内（克制辉光，176–196 原窗） */}
            {frame >= 176 ? (
              <div style={{ position: 'absolute', left: 40, top: 470, width: 60, height: 8, borderRadius: 4, background: FILM_COLORS2.data, opacity: interpolate(frame, [176, 196], [0, 0.35], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }), filter: `blur(${4 + focus * 2}px)`, boxShadow: `0 0 16px 4px rgba(212,163,115,0.4)` }} />
            ) : null}
          </div>

          {/* rack focus 收拢：非焦点区沉暗 */}
          <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep, opacity: focus * 0.62, pointerEvents: 'none' }} />
        </AbsoluteFill>
      </CameraRig>
      <HudChrome label="wuh.site · PIPELINE" readout={frame >= 176 ? 'DEPLOY · OK' : 'CI · RUNNING'} />
      <Grade2 id="GR2-04" />
      <Caption text="十月，他用 TypeScript 重写博客前端；十二月，GitHub Actions 第一次替他部署。" appearAt={14} />
    </AbsoluteFill>
  );
};

export default S10;
