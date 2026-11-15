import type { CSSProperties, FC } from 'react';
import { useCurrentFrame } from 'remotion';
import { FILM_COLORS, FONTS, GRID, tapeX } from '../motion-tokens';

export type TapeProps = {
  items: readonly string[];
  /** 行数（默认 5） */
  rows?: number;
  /** 基准流速 px/f（默认 3；每行 ×(1 + row·0.12) 防整墙同步） */
  speed?: number;
  /** 字号（默认 24） */
  fontSize?: number;
  /** 行间距（默认 28） */
  rowGap?: number;
  /** 内容带宽度（默认 GRID.content） */
  width?: number;
  style?: CSSProperties;
};

/** 单字符宽度（em；确定性估算，不依赖 DOM measure，为的是让循环周期可精确计算） */
const charEm = (ch: string): number => {
  const code = ch.codePointAt(0) ?? 0;
  if (ch === ' ') return 0.3;
  if (code >= 0x2e80) return 1; // CJK / 全角
  if ('il.,:;!|\'’'.includes(ch)) return 0.32;
  if ('mwMW@'.includes(ch)) return 0.9;
  if (ch >= 'A' && ch <= 'Z') return 0.68;
  if (ch >= '0' && ch <= '9') return 0.6;
  return 0.56;
};

const textEm = (text: string): number => {
  let w = 0;
  for (const ch of Array.from(text)) w += charEm(ch);
  return w;
};

/**
 * GR-06 TAPE-DRIFT：无缝横向流动标题带（文章标题墙）。
 * x = tapeX(frame, speed·(1+row·0.12), rowWidth, row·phase) —— 线性取模是 §7 明列的无缝循环例外。
 * 每行内容按「字符宽度估算 + 固定格宽」拼接到 ≥ width×2，周期 rowWidth 精确可算；
 * 轨道渲染两份（2·rowWidth ≥ 4·width）保证任意帧窗口覆盖、循环点不露馅。
 * 行间流速差 12% + 独立相位，避免整墙同步跳回。
 */
export const Tape: FC<TapeProps> = ({
  items,
  rows = 5,
  speed = 3,
  fontSize = 24,
  rowGap = 28,
  width = GRID.content,
  style,
}) => {
  const frame = useCurrentFrame();

  /* 一个 item 的格宽 = 文字宽 + 右侧气口；分隔符独立格宽 */
  const itemGap = 1.7 * fontSize;
  const sepW = 1.5 * fontSize;
  const cells = items.map((label) => ({ label, w: textEm(label) * fontSize + itemGap }));
  const periodW = cells.reduce((sum, c) => sum + c.w + sepW, 0);

  /* 循环拼接到 ≥ width×2（空 items 时给 1 个周期的兜底，避免除零） */
  const repeat = periodW > 0 ? Math.max(1, Math.ceil((width * 2) / periodW)) : 1;
  const rowWidth = periodW > 0 ? periodW * repeat : width;

  const rowH = fontSize * 1.35;
  const height = rows * rowH + Math.max(0, rows - 1) * rowGap;

  return (
    <div
      style={{
        width,
        height,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        gap: rowGap,
        ...style,
      }}
    >
      {Array.from({ length: rows }, (_, row) => {
        const phase = row * rowWidth * 0.37;
        const x = tapeX(frame, speed * (1 + row * 0.12), rowWidth, phase);
        const rowOpacity = 0.92 - row * 0.05;
        return (
          <div
            key={`row-${row}`}
            style={{
              height: rowH,
              lineHeight: `${rowH}px`,
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              opacity: rowOpacity,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                height: rowH,
                width: rowWidth * 2,
                transform: `translateX(${x}px)`,
                willChange: 'transform',
              }}
            >
              {Array.from({ length: repeat * 2 }, (_, copy) =>
                items.map((label, i) => (
                  <div key={`c-${row}-${copy}-${i}`} style={{ display: 'flex', alignItems: 'center' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        width: cells[i].w,
                        fontFamily: FONTS.serif,
                        fontSize,
                        color: FILM_COLORS.inkSoft,
                        letterSpacing: '0.02em',
                        overflow: 'visible',
                      }}
                    >
                      {label}
                    </span>
                    <span
                      style={{
                        display: 'inline-block',
                        width: sepW,
                        textAlign: 'center',
                        fontFamily: FONTS.serif,
                        fontSize: fontSize * 0.62,
                        color: FILM_COLORS.muted,
                        opacity: 0.75,
                      }}
                    >
                      ·
                    </span>
                  </div>
                )),
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};