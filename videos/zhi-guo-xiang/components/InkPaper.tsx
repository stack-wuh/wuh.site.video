/* 墨与字：纸上真字。
   全片的诗是她的手迹，不是字幕——所以字一律由这里写出来，图里只出现空白纸。
   竖排右起；逐字落下（每个字自带一点洇边的墨气）；可以被一滴墨吃掉。 */
import type { FC, ReactNode } from 'react';
import { AbsoluteFill, Img, interpolate, staticFile } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';

/** 诗六行。逐字不改。 */
export const POEM = [
  '我走过山时，山不说话，',
  '我路过海时，海不说话。',
  '小毛驴滴滴答答，倚天剑伴我走天涯。',
  '大家都说我因为爱着杨过大侠，才在峨嵋山上出了家，',
  '其实我只是爱上了峨眉山上的云和霞，',
  '像极了十六岁那年的烟花。',
] as const;

/** 竖排的列。长句按句读断成两列——纸上的字不会一列写到画外去。 */
export const POEM_COLS = [
  '我走过山时，山不说话，',
  '我路过海时，海不说话。',
  '小毛驴滴滴答答，',
  '倚天剑伴我走天涯。',
  '大家都说我因为爱着杨过大侠，',
  '才在峨嵋山上出了家，',
  '其实我只是爱上了',
  '峨眉山上的云和霞，',
  '像极了十六岁那年的烟花。',
] as const;

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const LH = 1.08;

type InkPaperProps = {
  /** 纸的底图（public/zhi-guo-xiang/paper/<name>.jpg），空则用纯色纸 */
  base?: string;
  /** 要写的行（右起为一列一行） */
  lines: readonly string[];
  /** 书写进度：0 一个字没有，1 全写完 */
  progress: number;
  /** 字号（px，1920 基准） */
  size?: number;
  /** 最右一列的右边距 */
  right?: string;
  /** 纵向起点 */
  top?: string;
  /** 行距（倍字号） */
  gap?: number;
  /** 墨色 */
  color?: string;
  /** 墨团：0 无，1 最大 */
  blot?: number;
  /** 墨团给画面坐标（px，1920×1080 基准） */
  blotAt?: { x: number; y: number; r?: number };
  /** 额外叠层 */
  children?: ReactNode;
};

/** 竖排，逐字落下。列用绝对定位，不靠 flex，避免 writing-mode 在 flex 里塌掉。 */
export const InkPaper: FC<InkPaperProps> = ({
  base,
  lines,
  progress,
  size = 64,
  right = '24%',
  top = '16%',
  gap = 1.5,
  color = colors.ink,
  blot = 0,
  blotAt,
  children,
}) => {
  const total = lines.reduce((s, l) => s + l.length, 0);
  const written = interpolate(progress, [0, 1], [0, total], clamp);
  const offsets = lines.map((_, i) => lines.slice(0, i).reduce((s, l) => s + l.length, 0));
  return (
    <AbsoluteFill>
      {base ? (
        <Img
          src={staticFile(`zhi-guo-xiang/paper/${base}.jpg`)}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : null}
      <AbsoluteFill style={{ mixBlendMode: 'multiply', filter: 'blur(0.3px)' }}>
      {lines.map((line, li) => {
        const from = offsets[li];
        const lineWritten = Math.max(0, Math.min(line.length, written - from));
        return (
          <div
            key={li}
            style={{
              position: 'absolute',
              right: `calc(${right} + ${li * size * gap}px)`,
              top,
              writingMode: 'vertical-rl',
              fontFamily: fontFamilies.serif,
              fontSize: size,
              lineHeight: LH,
              letterSpacing: size * 0.06,
              color,
              whiteSpace: 'nowrap',
            }}
          >
            {[...line].map((ch, ci) => {
              const t = interpolate(lineWritten - ci, [0, 1], [0, 1], clamp);
              const fresh = interpolate(lineWritten - ci, [0, 2], [1, 0], clamp);
              return (
                <span
                  key={ci}
                  style={{
                    opacity: t,
                    filter: fresh > 0.02 ? `blur(${fresh * 0.7}px)` : undefined,
                    textShadow: fresh > 0.02 ? `0 0 ${fresh * 2}px ${color}` : undefined,
                  }}
                >
                  {ch}
                </span>
              );
            })}

          </div>
        );
      })}
      </AbsoluteFill>
      {blot > 0 && blotAt ? (
        <div
          style={{
            position: 'absolute',
            left: blotAt.x - (blotAt.r ?? size * 1.9) * blot,
            top: blotAt.y - (blotAt.r ?? size * 1.9) * blot * 0.55,
            width: (blotAt.r ?? size * 1.9) * 2 * blot,
            height: (blotAt.r ?? size * 1.9) * 1.8 * blot,
            borderRadius: '50%',
            background: `radial-gradient(ellipse, ${colors.ink} 0%, rgba(24,21,18,0.85) 34%, rgba(24,21,18,0.22) 62%, transparent 76%)`,
            filter: `blur(${1 + blot * 2.5}px)`,
            mixBlendMode: 'multiply',
            opacity: 0.95,
          }}
        />
      ) : null}
      {children}
    </AbsoluteFill>
  );
};
