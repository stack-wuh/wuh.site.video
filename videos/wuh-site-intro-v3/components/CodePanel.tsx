import type { CSSProperties, FC } from 'react';
import { useCurrentFrame } from 'remotion';
import { FILM_COLORS, FONTS, GRID, T, blink, progress, typedCount } from '../motion-tokens';

export type CodeLine = { text: string; tone?: 'plain' | 'dim' | 'accent' };

export type CodePanelProps = {
  lines: readonly CodeLine[];
  /** 起始帧（默认 0） */
  start?: number;
  /** 逐字速率（默认 2.5 f/字） */
  framesPerChar?: number;
  /** 若给则按行级打出（优先于逐字；JSON 用 8–10f/行） */
  framesPerLine?: number;
  width?: number;
  height?: number;
  /** 窗顶 mono 标题（如 `mongo · issues`） */
  title?: string;
  /** 行号（默认 true） */
  lineNumbers?: boolean;
  /** 正文字号（默认 26） */
  fontSize?: number;
  style?: CSSProperties;
};

const TONE_COLOR: Record<NonNullable<CodeLine['tone']>, string> = {
  plain: FILM_COLORS.ink,
  dim: FILM_COLORS.muted,
  accent: FILM_COLORS.vermillion,
};

/**
 * TX-02 TYPEWRITER：终端/代码窗（白底卡 + hairline 边 + 窗顶 mono 标题栏 + 行号 + 方波光标）。
 * 两种节奏：逐字（framesPerChar，默认 2.5f/字）或行级（framesPerLine，JSON 场景 8–10f/行，优先）。
 * 未打出的字符不占位（防行内跳动）；光标用 `blink` 方波，禁正弦。
 */
export const CodePanel: FC<CodePanelProps> = ({
  lines,
  start = 0,
  framesPerChar = 2.5,
  framesPerLine,
  width = GRID.content,
  height,
  title,
  lineNumbers = true,
  fontSize = 26,
  style,
}) => {
  const frame = useCurrentFrame();
  const lineHeight = Math.round(fontSize * 1.62);
  const titleSize = Math.max(T.meta, Math.round(fontSize * 0.62));
  const rows = lines.map((l) => ({ ...l, chars: Array.from(l.text) }));

  /* 逐字模式的累计字符位置 → 每行起始帧 */
  const cumStarts: number[] = [];
  let cum = 0;
  for (const r of rows) {
    cumStarts.push(cum);
    cum += r.chars.length;
  }

  const revealed = rows.map((r, i) => {
    if (framesPerLine !== undefined) {
      const at = start + i * framesPerLine;
      return { count: frame >= at ? r.chars.length : 0, opacity: progress(frame, at, 4) };
    }
    const count = typedCount(frame, start + cumStarts[i] * framesPerChar, framesPerChar, r.chars.length);
    return { count, opacity: count > 0 ? 1 : 0 };
  });

  /* 光标 = 最后一个已出现的行尾（未打完实心；打完后继续闪） */
  let cursorLine = -1;
  revealed.forEach((rv, i) => {
    if (rv.count > 0) cursorLine = i;
  });
  const cursorOn = cursorLine >= 0 && blink(frame, 6);
  const numW = lineNumbers ? Math.max(2, String(rows.length).length) * fontSize * 0.62 : 0;

  return (
    <div
      style={{
        width,
        height,
        boxSizing: 'border-box',
        backgroundColor: FILM_COLORS.card,
        border: `1px solid ${FILM_COLORS.hairline}`,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        ...style,
      }}
    >
      {title ? (
        <div
          style={{
            flexShrink: 0,
            height: Math.round(fontSize * 2.1),
            padding: `0 ${Math.round(fontSize * 0.9)}px`,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            borderBottom: `1px solid ${FILM_COLORS.hairline}`,
          }}
        >
          <div style={{ width: 8, height: 8, backgroundColor: FILM_COLORS.vermillion, flexShrink: 0 }} />
          <div
            style={{
              fontFamily: FONTS.mono,
              fontSize: titleSize,
              letterSpacing: '0.14em',
              color: FILM_COLORS.muted,
              whiteSpace: 'nowrap',
            }}
          >
            {title}
          </div>
        </div>
      ) : null}

      <div
        style={{
          flex: 1,
          minHeight: 0,
          padding: `${Math.round(fontSize * 0.8)}px ${Math.round(fontSize * 0.9)}px`,
          overflow: 'hidden',
        }}
      >
        {rows.map((r, i) => {
          const rv = revealed[i];
          const shown = r.chars.slice(0, rv.count).join('');
          const isCursor = i === cursorLine;
          return (
            <div
              key={`code-${i}`}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                minHeight: lineHeight,
                lineHeight: `${lineHeight}px`,
                opacity: rv.opacity,
              }}
            >
              {lineNumbers ? (
                <div
                  style={{
                    flexShrink: 0,
                    width: numW,
                    marginRight: Math.round(fontSize * 0.55),
                    textAlign: 'right',
                    fontFamily: FONTS.mono,
                    fontSize: titleSize,
                    color: FILM_COLORS.muted,
                    opacity: 0.7,
                    fontVariantNumeric: 'tabular-nums',
                    userSelect: 'none',
                  }}
                >
                  {i + 1}
                </div>
              ) : null}
              <div
                style={{
                  flex: 1,
                  minWidth: 0,
                  fontFamily: FONTS.mono,
                  fontSize,
                  color: r.tone ? TONE_COLOR[r.tone] : FILM_COLORS.ink,
                  whiteSpace: 'pre',
                  overflow: 'hidden',
                }}
              >
                {shown}
                {isCursor && cursorOn ? (
                  <span
                    style={{
                      display: 'inline-block',
                      width: Math.round(fontSize * 0.5),
                      height: Math.round(fontSize * 1.02),
                      verticalAlign: 'text-bottom',
                      backgroundColor: FILM_COLORS.ink,
                    }}
                  />
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};