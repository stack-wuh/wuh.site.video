/* S10 · Act 2 旧屋 · 局部帧 [0,240) · 240f · 绝对 1344–1584
 *
 * 第一次重写：笔电屏幕亮起翻成编辑器（0–16），深色代码页里旧 JS 片段被逐块
 * 替换为 TypeScript、类型标注高亮浮出（16–96）；横向摇到旁侧终端窗（96–126），
 * GitHub Actions 流水线构建/测试/部署三节点依次转绿（136/156/176=绝对
 * 1480/1500/1520，对齐矩阵帧位）；末段 rack focus 向绿灯收拢、其余沉暗（196–236）。
 * 转场：入「切」，出「切」。
 * 字幕安全窗：start≥12、end≤228。
 * 尾帧：暗场中一点绿灯高亮。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES } from '../../../brand/motion';
import { FILM_COLORS, lineReplace, pipelineNode } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { Caption } from '../components/Caption';
import { DustField } from '../components/DustField';
import { Grade } from '../components/Grade';
import { PaperGrain } from '../components/PaperGrain';

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
  // 横摇（96–126）：编辑器 → 终端窗
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
    <AbsoluteFill style={{ background: colors.bg }}>
      <CameraRig cam={cam}>
        <AbsoluteFill>
          <DustField act={2} count={14} seedBase="s10" />

          {/* 编辑器（屏幕微距；随横摇左移出画） */}
          <div style={{ position: 'absolute', left: 120 - pan * 260, top: 150, width: 1100, height: 660, opacity: screenOn, filter: `blur(${(1 - screenOn) * 8}px)`, background: colors.terminalBg, borderRadius: 8, border: `1px solid ${colors.hairline}` }}>
            <div style={{ position: 'absolute', left: 24, top: 18, display: 'flex', gap: 10 }}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{ width: 12, height: 12, borderRadius: 6, background: colors.muted, opacity: 0.4 }} />
              ))}
              <span style={{ fontFamily: fontFamilies.mono, fontSize: 15, color: colors.muted, marginLeft: 12, opacity: 0.7 }}>rewrite.ts — 2021·10</span>
            </div>
            {CODE_ROWS.map((row, i) => {
              const r = lineReplace(frame, 24 + i * 24, 14);
              const replaced = r.flash > 0.5;
              return (
                <div key={i} style={{ position: 'absolute', left: 30, top: 90 + i * 96, right: 30 }}>
                  {/* 旧 JS 行 */}
                  <div style={{ fontFamily: fontFamilies.mono, fontSize: 24, color: colors.muted, opacity: (1 - r.opacity) * 0.85, textDecoration: 'line-through' }}>{row.js}</div>
                  {/* 新 TS 行 */}
                  <div style={{ fontFamily: fontFamilies.mono, fontSize: 24, color: colors.paper, opacity: r.opacity, marginTop: 8 }}>{row.ts}</div>
                  {/* 类型标注高亮浮出 */}
                  <div style={{ fontFamily: fontFamilies.mono, fontSize: 18, color: FILM_COLORS.statusGreen, opacity: r.opacity * 0.9, marginTop: 6 }}>↳ {row.types}</div>
                </div>
              );
            })}
          </div>

          {/* 终端窗 + Actions 流水线（随横摇入画） */}
          <div style={{ position: 'absolute', left: 1180 - pan * 260 + pan * 260, top: 180, width: 620, height: 560, opacity: pan, background: colors.terminalBg, borderRadius: 8, border: `1px solid ${colors.hairline}` }}>
            <div style={{ position: 'absolute', left: 26, top: 20, fontFamily: fontFamilies.mono, fontSize: 16, color: colors.muted, opacity: 0.75 }}>
              github-actions · first run · 2021-12
            </div>
            {NODES.map((n, i) => {
              const node = pipelineNode(frame, n.delay, 30);
              return (
                <div key={n.name} style={{ position: 'absolute', left: 40, top: 100 + i * 130, display: 'flex', alignItems: 'center', gap: 20, transform: node.transform, opacity: node.opacity }}>
                  <div style={{ width: 30, height: 30, borderRadius: 15, border: `2px solid ${FILM_COLORS.statusGreen}`, background: `rgba(111,163,111,${node.green * 0.35})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ color: FILM_COLORS.statusGreen, fontSize: 16, opacity: node.green }}>✓</span>
                  </div>
                  <span style={{ fontFamily: fontFamilies.mono, fontSize: 26, color: colors.paper, opacity: 0.9 }}>{n.name}</span>
                </div>
              );
            })}
            {/* 部署绿灯映在纸面（克制辉光） */}
            {frame >= 176 ? (
              <div style={{ position: 'absolute', left: 40, top: 470, width: 60, height: 8, borderRadius: 4, background: FILM_COLORS.statusGreen, opacity: interpolate(frame, [176, 196], [0, 0.3], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }), filter: `blur(${4 + focus * 2}px)` }} />
            ) : null}
          </div>

          {/* rack focus 收拢：非焦点区沉暗 */}
          <AbsoluteFill style={{ background: colors.bg, opacity: focus * 0.62, pointerEvents: 'none' }} />
        </AbsoluteFill>
      </CameraRig>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 320, backgroundImage: `linear-gradient(180deg, transparent, ${colors.bg})`, opacity: 0.2 }} />
      <PaperGrain opacity={0.06} />
      <Grade id="GR-04" />
      <Caption text="十月，他用 TypeScript 重写博客前端；十二月，GitHub Actions 第一次替他部署。" appearAt={14} />
    </AbsoluteFill>
  );
};

export default S10;
