import type { CSSProperties, FC } from 'react';
import { useCurrentFrame } from 'remotion';
import { FILM_COLORS, FONTS, blink, typedCount } from '../motion-tokens';

export type TypewriterProps = {
  text: string;
  /** 起始帧（局部帧） */
  start?: number;
  /** 每字帧数 */
  framesPerChar?: number;
  /** 光标：'end' 常驻行尾闪烁 / 'always' 常亮 / 'none' */
  cursor?: 'end' | 'always' | 'none';
  fontSize?: number;
  color?: string;
  fontFamily?: string;
  /** 光标颜色（默认朱红） */
  cursorColor?: string;
  /** 文字行高 */
  lineHeight?: number;
  style?: CSSProperties;
};

/**
 * TX-02 打字机 + TX-03 光标闪烁。
 * 未打出的字符不占位（防跳动）；光标用方波闪烁，禁正弦。
 */
export const Typewriter: FC<TypewriterProps> = ({
  text,
  start = 0,
  framesPerChar = 4,
  cursor = 'end',
  fontSize = 56,
  color = FILM_COLORS.ink,
  fontFamily = FONTS.mono,
  cursorColor = FILM_COLORS.vermillion,
  lineHeight = 1.5,
  style,
}) => {
  const frame = useCurrentFrame();
  const count = typedCount(frame, start, framesPerChar, text.length);
  const shown = text.slice(0, count);
  const done = count >= text.length;
  const cursorVisible = cursor === 'always' ? true : blink(frame, 6);
  const cursorColorResolved = done ? cursorColor : FILM_COLORS.ink;

  return (
    <div
      style={{
        fontFamily,
        fontSize,
        lineHeight,
        color,
        whiteSpace: 'pre',
        ...style,
      }}
    >
      {shown}
      {cursor !== 'none' ? (
        <span
          style={{
            display: 'inline-block',
            width: fontSize * 0.08,
            height: fontSize * 0.92,
            marginLeft: 4,
            verticalAlign: 'text-bottom',
            backgroundColor: cursorColorResolved,
            opacity: done && cursor === 'end' ? (cursorVisible ? 1 : 0) : 1,
          }}
        />
      ) : null}
    </div>
  );
};