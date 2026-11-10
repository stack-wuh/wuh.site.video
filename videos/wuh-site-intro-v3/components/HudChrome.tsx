import type { FC } from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { FILM_COLORS2 } from '../motion-tokens';

/**
 * V2 HUD 角标（2026-11-10 科技重构）：四角刻度括号 + 左上读数 chip + 右下帧读数。
 * 确定性：全部由 frame/useVideoConfig 驱动；克制档（opacity ≤0.6），不抢主角。
 * 用法：<HudChrome label="wuh.site · DATA STREAM" /> —— 压在最上层（zIndex 25，字幕之下）。
 */
export const HudChrome: FC<{ label?: string; readout?: string }> = ({ label = 'wuh.site', readout = 'DATA STREAM' }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const inP = interpolate(frame, [6, 26], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: undefined });
  const arm = 46;
  const th = 1.5;
  const corners: Array<{ key: string; style: React.CSSProperties }> = [
    { key: 'tl', style: { left: 36, top: 36, borderTop: `${th}px solid`, borderLeft: `${th}px solid` } },
    { key: 'tr', style: { right: 36, top: 36, borderTop: `${th}px solid`, borderRight: `${th}px solid` } },
    { key: 'bl', style: { left: 36, bottom: 36, borderBottom: `${th}px solid`, borderLeft: `${th}px solid` } },
    { key: 'br', style: { right: 36, bottom: 36, borderBottom: `${th}px solid`, borderRight: `${th}px solid` } },
  ];
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 25, opacity: inP * 0.6 }}>
      {corners.map((c) => (
        <div key={c.key} style={{ position: 'absolute', width: arm, height: arm, borderColor: FILM_COLORS2.cyanDim, ...c.style }} />
      ))}
      {/* 左上读数 */}
      <div style={{ position: 'absolute', left: 100, top: 42, display: 'flex', alignItems: 'baseline', gap: 14 }}>
        <span style={{ fontFamily: 'Menlo, monospace', fontSize: 15, letterSpacing: '0.22em', color: FILM_COLORS2.dataWhite, opacity: 0.85 }}>{label}</span>
        <span style={{ fontFamily: 'Menlo, monospace', fontSize: 12, letterSpacing: '0.3em', color: FILM_COLORS2.cyan, opacity: 0.7 }}>{readout}</span>
      </div>
      {/* 右下帧读数（确定性：同帧同值） */}
      <div style={{ position: 'absolute', right: 100, bottom: 42, fontFamily: 'Menlo, monospace', fontSize: 12, letterSpacing: '0.2em', color: FILM_COLORS2.textMuted, fontVariantNumeric: 'tabular-nums', opacity: 0.55 }}>
        {String(frame).padStart(4, '0')} / {String(durationInFrames).padStart(4, '0')}
      </div>
    </div>
  );
};
