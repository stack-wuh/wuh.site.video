import type { CSSProperties, FC } from 'react';
import { useCurrentFrame } from 'remotion';
import { DataLabel } from './Type';
import { FILM_COLORS, FONTS, T, fmtInt, roll, slam } from '../motion-tokens';

export type BigNumberProps = {
  value: number;
  /** 下方 mono 标签（COMMITS / WORDS…） */
  label?: string;
  /** 标签右侧补充（如 `46 篇公开文章 · 26,408`） */
  sub?: string;
  size?: number;
  color?: string;
  /** 滚动起点值（默认 0） */
  from?: number;
  /** 滚动起始帧（默认 0） */
  start?: number;
  /** 滚动时长（0 = 不滚，直接显示终值） */
  dur?: number;
  /** 落定 slam 帧（undefined = 不 slam） */
  slamAt?: number;
  align?: 'left' | 'center' | 'right';
  style?: CSSProperties;
  /** 数字与标签之间的 hairline（默认显示） */
  rule?: boolean;
  ruleWidth?: number;
  labelColor?: string;
  /** 单元/后缀（如 `字`），跟在数字后小号显示 */
  unit?: string;
};

/**
 * NUM-01/02/03/05：巨型衬线数字 + 里程表滚动 + SLAM 落定 + mono 标签 + hairline 基座。
 * 数字用 lining figures、tabular 宽度；滚动以 ease-out 精确落定，不 overshoot（数据不撒谎）。
 */
export const BigNumber: FC<BigNumberProps> = ({
  value,
  label,
  sub,
  size = T.hero,
  color = FILM_COLORS.ink,
  from = 0,
  start = 0,
  dur = 0,
  slamAt,
  align = 'center',
  style,
  rule = true,
  ruleWidth = 180,
  labelColor = FILM_COLORS.muted,
  unit,
}) => {
  const frame = useCurrentFrame();
  const v = dur > 0 ? roll(frame, start, dur, from, value) : value;
  const s = slamAt !== undefined ? slam(frame, slamAt) : { scale: 1, dx: 0, dy: 0, hit: 0 };
  const alignItems = align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems,
        transform: `translate(${s.dx}px, ${s.dy}px) scale(${s.scale})`,
        transformOrigin: align === 'right' ? 'right center' : align === 'left' ? 'left center' : 'center center',
        ...style,
      }}
    >
      <div
        style={{
          fontFamily: FONTS.serif,
          fontWeight: 700,
          fontSize: size,
          lineHeight: 0.95,
          letterSpacing: '-0.02em',
          color,
          fontVariantNumeric: 'tabular-nums lining-nums',
          whiteSpace: 'nowrap',
        }}
      >
        {fmtInt(v)}
        {unit ? (
          <span style={{ fontFamily: FONTS.sans, fontWeight: 400, fontSize: size * 0.18, marginLeft: size * 0.08, color }}>{unit}</span>
        ) : null}
      </div>
      {rule ? (
        <div
          style={{
            width: ruleWidth,
            height: 1,
            marginTop: size * 0.12,
            backgroundColor: s.hit > 0 ? FILM_COLORS.vermillion : FILM_COLORS.hairline,
          }}
        />
      ) : null}
      {label ? (
        <div style={{ marginTop: 10, display: 'flex', alignItems: 'baseline', gap: 14 }}>
          <DataLabel color={labelColor}>{label}</DataLabel>
          {sub ? <DataLabel color={FILM_COLORS.muted}>{sub}</DataLabel> : null}
        </div>
      ) : null}
    </div>
  );
};