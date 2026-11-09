import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { random } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CONSOLE_LINES, FILM_COLORS } from '../motion-tokens';

/* 入院幕控制台面板（FN-37/39）：深近黑底 + 1px 细线网格 + 扫描线 ≤6% +
 * 4×2 八块功能位（等宽标签）+ 墨点光标。lit = 已点亮块数（01..lit）；
 * active = 光标当前指向的块（1–8）；panelIn = 面板显影进度 0–1。
 * 面板是跨镜共享语汇（s30–s43 反复出现），属 components/ 白名单。 */

export const CONSOLE_LABELS = ['首页', '文章', '书架', '音乐', '留言', '热力', '设计', '漫游'] as const;

/** 块位（4×2 网格，面板坐标 1920×1080 内）：返回块中心，供展开窗起点用 */
export const blockRect = (index: number): { x: number; y: number; w: number; h: number } => {
  const col = (index - 1) % 4;
  const row = Math.floor((index - 1) / 4);
  return { x: 360 + col * 300, y: 300 + row * 240, w: 280, h: 220 };
};

export const ConsolePanel: FC<{ lit: number; active?: number; panelIn: number; scanBoost?: number }> = ({ lit, active, panelIn, scanBoost = 0 }) => {
  const frame = useCurrentFrame();
  const scanY = (frame * 2) % 1080;
  return (
    <AbsoluteFill style={{ opacity: panelIn, background: FILM_COLORS.nearBlack }}>
      {/* 1px 细线网格 */}
      <AbsoluteFill style={{ backgroundImage: CONSOLE_LINES.grid, opacity: 0.9 }} />
      {/* 扫描线（≤6%，scanBoost 末镜加速一次） */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: scanY - 40, height: 80, backgroundImage: CONSOLE_LINES.scan, opacity: 0.04 + scanBoost * 0.03 }} />
      {/* 4×2 八块功能位 */}
      {CONSOLE_LABELS.map((label, i) => {
        const index = i + 1;
        const rect = blockRect(index);
        const isLit = index <= lit;
        const isActive = index === active;
        const seedR = random(`console-${index}`);
        return (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: rect.x,
              top: rect.y,
              width: rect.w,
              height: rect.h,
              border: `1px solid ${isActive ? colors.gold : isLit ? colors.seal : colors.hairline}`,
              background: isLit ? `rgba(201,111,74,${0.08 + seedR * 0.04})` : 'transparent',
              opacity: panelIn,
            }}
          >
            <span style={{ position: 'absolute', left: 14, top: 10, fontFamily: fontFamilies.mono, fontSize: 15, color: isLit ? colors.gold : colors.muted, opacity: 0.85, letterSpacing: '0.14em' }}>
              {String(index).padStart(2, '0')}
            </span>
            <span style={{ position: 'absolute', left: 14, bottom: 12, fontFamily: fontFamilies.mono, fontSize: 17, color: isLit ? colors.paper : colors.muted, opacity: isLit ? 0.9 : 0.5 }}>
              {label}
            </span>
            {isLit ? <div style={{ position: 'absolute', right: 14, top: 14, width: 8, height: 8, borderRadius: 4, background: colors.seal, opacity: 0.9 }} /> : null}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/** 墨点光标（FN-39）：移到 active 块中心悬停；moveProgress 0–1 控制行进 */
export const ConsoleCursor: FC<{ active: number; moveProgress?: number; clickRipple?: number }> = ({ active, moveProgress = 1, clickRipple = 0 }) => {
  const rect = blockRect(active);
  const cx = rect.x + rect.w / 2;
  const cy = rect.y + rect.h / 2;
  // 从面板中央出发到目标块
  const x = interpolate(moveProgress, [0, 1], [960, cx]);
  const y = interpolate(moveProgress, [0, 1], [540, cy]);
  return (
    <>
      <div style={{ position: 'absolute', left: x - 9, top: y - 9, width: 18, height: 18, borderRadius: 9, background: colors.ink, opacity: 0.95, boxShadow: `0 0 10px 2px rgba(201,111,74,0.4)` }} />
      {clickRipple > 0 ? (
        <div style={{ position: 'absolute', left: x - clickRipple * 60, top: y - clickRipple * 30, width: clickRipple * 120, height: clickRipple * 60, borderRadius: clickRipple * 60, border: `1.5px solid ${colors.gold}`, opacity: 1 - clickRipple }} />
      ) : null}
    </>
  );
};
