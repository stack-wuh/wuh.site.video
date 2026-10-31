import type { CSSProperties, FC, ReactNode } from 'react';
import { AbsoluteFill } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CONSOLE_LINES } from '../motion-tokens';

/**
 * Act 6「入院」暗色控制台三件套（FN-39/40/41 的组件化落地）：
 *   ConsolePanel —— 4×2 八块面板（litSet 累积点亮，不清空）
 *   ConsoleWindow —— 块边界 → 全屏的正向/反向最大化（clipPath 对齐 tile 矩形）
 *   ConsoleCursor —— 墨点光标（悬停环 + 点击涟漪，局部尺寸，不铺屏）
 * 面板是冷的（terminalBg + 细线 + 扫描线），展开窗口里一律纸面内容。
 */

export const TILE_LABELS = ['首页', '生成式封面', '书架', '音乐', '留言板', '热力图', '设计系统', '页面漫游'] as const;

export const TILE_RECTS = TILE_LABELS.map((_, i) => ({
  x: 126 + (i % 4) * 423,
  y: 190 + Math.floor(i / 4) * 394,
  w: 399,
  h: 370,
}));

const mono = fontFamilies.mono;
const serif = fontFamilies.serif;

export const ConsolePanel: FC<{ lit: readonly number[]; active?: number; style?: CSSProperties; scanBoost?: number }> = ({ lit, active = -1, style, scanBoost = 0 }) => (
  <AbsoluteFill style={style}>
    <div style={{ position: 'absolute', left: 90, top: 90, width: 1740, height: 900, background: colors.terminalBg, border: `1px solid ${colors.hairline}` }}>
      <AbsoluteFill style={{ backgroundImage: CONSOLE_LINES.grid, opacity: 0.5 }} />
      <AbsoluteFill style={{ backgroundImage: CONSOLE_LINES.scan, opacity: 0.35 + scanBoost * 0.5 }} />
      <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', padding: '18px 24px', borderBottom: `1px solid ${colors.hairline}`, fontFamily: mono, fontSize: 15, color: colors.muted, letterSpacing: '0.22em' }}>
        <span>WUH.SITE · FEATURES</span>
        <span>{String(lit.length).padStart(2, '0')} / 08</span>
      </div>
      <div style={{ position: 'relative' }}>
        {TILE_RECTS.map((r, i) => {
          const on = lit.includes(i);
          const cur = i === active;
          return (
            <div
              key={TILE_LABELS[i]}
              style={{
                position: 'absolute',
                left: r.x - 90,
                top: r.y - 90,
                width: r.w,
                height: r.h,
                border: `1px solid ${cur ? colors.seal : colors.hairline}`,
                background: cur ? colors.bgLift : 'transparent',
                opacity: cur ? 1 : on ? 0.82 : 0.45,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: 16,
              }}
            >
              <span style={{ fontFamily: mono, fontSize: 13, color: cur ? colors.accent : colors.muted, letterSpacing: '0.18em' }}>0{i + 1}</span>
              <span style={{ fontFamily: serif, fontSize: 26, color: colors.paper }}>{TILE_LABELS[i]}</span>
              <span style={{ display: 'block', height: 3, width: '58%', background: colors.accent, opacity: on || cur ? 0.85 : 0 }} />
            </div>
          );
        })}
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: '38%', height: 1, background: colors.accent, opacity: 0.1 }} />
    </div>
  </AbsoluteFill>
);

export const ConsoleWindow: FC<{ tile: number; progress: number; children: ReactNode }> = ({ tile, progress, children }) => {
  const r = TILE_RECTS[Math.max(0, Math.min(7, tile))];
  const p = Math.min(1, Math.max(0, progress));
  const insetTop = r.y * (1 - p);
  const insetLeft = r.x * (1 - p);
  const insetRight = (1920 - r.x - r.w) * (1 - p);
  const insetBottom = (1080 - r.y - r.h) * (1 - p);
  return (
    <AbsoluteFill
      style={{
        background: colors.paper,
        clipPath: `inset(${insetTop}px ${insetRight}px ${insetBottom}px ${insetLeft}px)`,
        border: `1px solid ${colors.accent}`,
        opacity: p > 0 ? 1 : 0,
      }}
    >
      {children}
      <div style={{ position: 'absolute', inset: 0, border: `1px solid ${colors.accent}`, opacity: 0.55 * (1 - p) }} />
    </AbsoluteFill>
  );
};

export const ConsoleCursor: FC<{ x: number; y: number; hover?: boolean; ripple?: number; opacity?: number }> = ({ x, y, hover = false, ripple = 0, opacity = 1 }) => (
  <AbsoluteFill style={{ pointerEvents: 'none', opacity }}>
    <div style={{ position: 'absolute', left: x - 7, top: y - 7, width: 14, height: 14, borderRadius: 7, background: colors.accent, boxShadow: `0 0 16px ${colors.accent}` }} />
    {hover ? <div style={{ position: 'absolute', left: x - 22, top: y - 22, width: 44, height: 44, borderRadius: 22, border: `1px solid ${colors.accent}`, opacity: 0.5 }} /> : null}
    {ripple > 0 && ripple < 1 ? (
      <div style={{ position: 'absolute', left: x - 10, top: y - 10, width: 20, height: 20, borderRadius: 10, border: `2px solid ${colors.accent}`, opacity: 0.6 * (1 - ripple), transform: `scale(${1 + ripple * 3})` }} />
    ) : null}
  </AbsoluteFill>
);
