import type { CSSProperties, FC, PropsWithChildren } from 'react';
import { AbsoluteFill } from 'remotion';
import { FILM_COLORS, FONTS, GRID, T } from '../motion-tokens';

export type ShotTone = 'paper' | 'deep' | 'dim' | 'card';

export type ShotShellProps = PropsWithChildren<{
  /** 进入本镜的转场（manifest 透传；本片零软转场，一律 cut） */
  in?: string;
  /** 下一镜转场（manifest 透传） */
  out?: string;
  duration?: number;
  /** 纸面基调：paper 暖纸 / deep 纸深 / dim 压暗 12%（二幕沉默）/ card 卡片白 */
  tone?: ShotTone;
  /** 是否显示 12 列微网格（默认否；数据镜可开） */
  grid?: boolean;
  /** 左下角幕标，如 'ACT 04 · 屋里' */
  act?: string;
  /** 右上角标，默认 '2019 → 2026' */
  meta?: string;
  /** 右下角标，默认快照日 */
  footer?: string;
  /** 是否显示四角角标（默认是） */
  chrome?: boolean;
}>;

const TONE_BG: Record<ShotTone, string> = {
  paper: FILM_COLORS.paper,
  deep: FILM_COLORS.paperDeep,
  dim: FILM_COLORS.paper,
  card: FILM_COLORS.card,
};

const corner: CSSProperties = {
  position: 'absolute',
  fontFamily: FONTS.mono,
  fontSize: T.micro,
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  color: FILM_COLORS.muted,
  opacity: 0.9,
  whiteSpace: 'nowrap',
};

/**
 * 镜壳：纸底 + 四角角标 +（可选）微网格。
 * 装配层与镜级 comp 都包这一层；转场本片全 cut，因此不做遮罩。
 * 纪律：不在这里画任何镜内容；背景必须不透明（shot-spec §3-3）。
 */
export const ShotShell: FC<ShotShellProps> = ({
  children,
  tone = 'paper',
  grid = false,
  act,
  meta = '2019 → 2026',
  footer = '2026-11-14',
  chrome = true,
}) => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: TONE_BG[tone],
        color: FILM_COLORS.ink,
        fontFamily: FONTS.serif,
        overflow: 'hidden',
      }}
    >
      {tone === 'dim' ? (
        <AbsoluteFill style={{ backgroundColor: 'rgba(42,30,22,0.12)' }} />
      ) : null}
      {grid ? <GridLines /> : null}
      {children}
      {chrome ? (
        <>
          <div style={{ ...corner, left: 56, top: 48 }}>WUH.SITE</div>
          <div style={{ ...corner, right: 56, top: 48 }}>{meta}</div>
          {act ? <div style={{ ...corner, left: 56, bottom: 48 }}>{act}</div> : null}
          <div style={{ ...corner, right: 56, bottom: 48 }}>{footer}</div>
        </>
      ) : null}
    </AbsoluteFill>
  );
};

/** 12 列微网格：极淡竖线 + 上下基线刻度（数据镜开启） */
export const GridLines: FC = () => {
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {Array.from({ length: GRID.cols + 1 }, (_, i) => (
        <div
          key={`v${i}`}
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: GRID.margin + (i * (GRID.content + GRID.gutter)) / GRID.cols - GRID.gutter / 2,
            width: 1,
            backgroundColor: FILM_COLORS.hairlineSoft,
          }}
        />
      ))}
      <div
        style={{
          position: 'absolute',
          left: GRID.margin,
          right: GRID.margin,
          bottom: 96,
          height: 1,
          backgroundColor: FILM_COLORS.hairlineSoft,
        }}
      />
    </AbsoluteFill>
  );
};