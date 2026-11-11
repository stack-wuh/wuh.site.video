/* S10 · Act 2 旧屋 · 局部帧 [0,240) · 240f · 绝对 1344–1584
 * V2 暖黑数据流（2026-11-11 风格重构）：「深色编辑器+绿色流水线」改写为「终端 HUD 过程镜」——
 * ① 屏幕亮起（0–16 原窗）：线框编辑器 rewrite.ts，旧 JS 行被逐块替换为 TypeScript
 *    （lineReplace 24+i·24 原帧），类型标注高亮浮出（琥珀金，替代原 statusGreen）；
 * ② 横摇到旁侧流水线窗（96–126 原窗）：github-actions 线框，build/test/deploy 三节点
 *    依次点亮（136/156/176=绝对 1480/1500/1520 对齐矩阵帧位不变），✓ 走暖金；
 * ③ 部署状态灯琥珀辉光（176–196 原窗）；末段 rack focus 收拢、其余沉暗（196–236 原窗）。
 * 尾帧交接态：暗场中一点状态灯高亮（原「绿灯」→ 琥珀状态灯，FILM_COLORS2 色板纪律）。
 * 转场：入「切」出「切」。字幕安全窗：start≥12、end≤228。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { CURVES } from '../../../brand/motion';
import { FILM_COLORS2, lineReplace, pipelineNode } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { Caption } from '../components/Caption';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';

const TOTAL = 240;
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
  // 屏幕亮起（0–16）
  const screenOn = interpolate(frame, [0, 16], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  // 横摇（96–126）：编辑器 → 流水线窗
  const pan = interpolate(frame, [96, 126], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  // 末段 rack focus 收拢（196–236）
  const focus = interpolate(frame, [196, 236], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const cam = {
    scale: interpolate(frame, [0, TOTAL], [1.02, 1.09], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }),
    x: interpolate(frame, [96, 126], [0, -120], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }) + interpolate(frame, [196, 236], [0, 60], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }),
    y: interpolate(frame, [196, 236], [0, 40], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }),
    rot: 0,
  };

  return (
    <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep }}>
      <DeepSpace seed="s10v2" stars={44} grid />
      <CameraRig cam={cam}>
        <AbsoluteFill>
          {/* 线框编辑器（屏幕微距；随横摇左移出画） */}
          <div style={{ position: 'absolute', left: 120 - pan * 260, top: 150, width: 1100, height: 660, opacity: screenOn, filter: `blur(${(1 - screenOn) * 8}px)`, background: FILM_COLORS2.panel, borderRadius: 10, border: `1px solid ${FILM_COLORS2.line}`, boxShadow: `0 0 30px rgba(212,163,115,0.08), 0 24px 60px rgba(0,0,0,0.5)` }}>
            <div style={{ position: 'absolute', left: 24, top: 18, display: 'flex', gap: 10, alignItems: 'center' }}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{ width: 12, height: 12, borderRadius: 6, background: FILM_COLORS2.dataDim, opacity: 0.45 }} />
              ))}
              <span style={{ fontFamily: fontFamilies.mono, fontSize: 15, color: FILM_COLORS2.textMuted, marginLeft: 12, opacity: 0.8 }}>rewrite.ts — 2021·10</span>
            </div>
            {CODE_ROWS.map((row, i) => {
              const r = lineReplace(frame, 24 + i * 24, 14);
              return (
                <div key={i} style={{ position: 'absolute', left: 30, top: 90 + i * 96, right: 30 }}>
                  {/* 旧 JS 行 */}
                  <div style={{ fontFamily: fontFamilies.mono, fontSize: 24, color: FILM_COLORS2.textMuted, opacity: (1 - r.opacity) * 0.85, textDecoration: 'line-through' }}>{row.js}</div>
                  {/* 新 TS 行 */}
                  <div style={{ fontFamily: fontFamilies.mono, fontSize: 24, color: FILM_COLORS2.paperWhite, opacity: r.opacity, marginTop: 8 }}>{row.ts}</div>
                  {/* 类型标注高亮浮出（暖金） */}
                  <div style={{ fontFamily: fontFamilies.mono, fontSize: 18, color: FILM_COLORS2.gold, opacity: r.opacity * 0.9, marginTop: 6 }}>↳ {row.types}</div>
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
              const node = pipelineNode(frame, n.delay, 30);
              const isDeploy = n.name === 'deploy';
              const lit = frame >= n.delay + 12;
              return (
                <div key={n.name} style={{ position: 'absolute', left: 40, top: 100 + i * 130, display: 'flex', alignItems: 'center', gap: 20, transform: node.transform, opacity: node.opacity }}>
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 15,
                      border: `2px solid ${FILM_COLORS2.data}`,
                      background: `rgba(212,163,115,${node.green * 0.3})`,
                      boxShadow: isDeploy && lit ? `0 0 18px 4px rgba(212,163,115,0.45)` : 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <span style={{ color: FILM_COLORS2.gold, fontSize: 16, opacity: node.green }}>✓</span>
                  </div>
                  <span style={{ fontFamily: fontFamilies.mono, fontSize: 26, color: FILM_COLORS2.paperWhite, opacity: 0.9 }}>{n.name}</span>
                </div>
              );
            })}
            {/* 部署状态灯映在窗内（克制辉光） */}
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
