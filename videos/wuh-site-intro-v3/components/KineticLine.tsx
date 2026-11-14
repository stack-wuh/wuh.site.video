import type { CSSProperties, FC } from 'react';
import { useCurrentFrame } from 'remotion';
import { FILM_COLORS, FONTS, T, clamp01 } from '../motion-tokens';

export type KineticLineProps = {
  text: string;
  start?: number;
  /** 每字帧数（motion-spec TX-01：2f/字；词组间自动 +2f） */
  framesPerChar?: number;
  size?: number;
  weight?: 400 | 700;
  color?: string;
  fontFamily?: string;
  lineHeight?: number;
  align?: 'left' | 'center' | 'right';
  /** 首字下沉（给首字，字号 = size×3.35） */
  dropCap?: boolean;
  dropCapColor?: string;
  style?: CSSProperties;
};

const GROUP_BREAK = new Set(['，', '。', '：', '；', '、', '？', '！', '——', ' ']);

/**
 * TX-01 动能字幕：逐字落笔（opacity 0→1 + Y 6px），词组间 +2f 气口。
 * 字幕是画面内动能排版，不做底部字幕条（style-anchor §4）。
 */
export const KineticLine: FC<KineticLineProps> = ({
  text,
  start = 0,
  framesPerChar = 2,
  size = T.line,
  weight = 400,
  color = FILM_COLORS.ink,
  fontFamily = FONTS.serif,
  lineHeight = 1.5,
  align = 'left',
  dropCap = false,
  dropCapColor = FILM_COLORS.vermillion,
  style,
}) => {
  const frame = useCurrentFrame();
  const chars = Array.from(text);
  let cursor = start;
  const timings: number[] = [];
  for (let i = 0; i < chars.length; i++) {
    timings.push(cursor);
    cursor += framesPerChar + (GROUP_BREAK.has(chars[i]) ? 2 : 0);
  }
  const p = (i: number) => clamp01((frame - timings[i]) / 8);

  return (
    <div
      style={{
        fontFamily,
        fontSize: size,
        fontWeight: weight,
        color,
        lineHeight,
        textAlign: align,
        ...style,
      }}
    >
      {chars.map((ch, i) => {
        const isCap = dropCap && i === 0;
        const a = p(i);
        return (
          <span
            key={`${ch}-${i}`}
            style={{
              display: 'inline-block',
              opacity: a,
              transform: `translateY(${(1 - a) * 6}px)`,
              color: isCap ? dropCapColor : undefined,
              fontWeight: isCap ? 700 : undefined,
              fontSize: isCap ? size * 3.35 : undefined,
              lineHeight: isCap ? 0.9 : undefined,
              verticalAlign: isCap ? 'baseline' : undefined,
              marginRight: isCap ? size * 0.18 : undefined,
            }}
          >
            {ch}
          </span>
        );
      })}
    </div>
  );
};