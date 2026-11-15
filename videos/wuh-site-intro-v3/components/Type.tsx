import type { CSSProperties, FC, PropsWithChildren } from 'react';
import { FILM_COLORS, FONTS, T } from '../motion-tokens';

/** 章节眉线：12px serif / 字距 0.42em / 朱红（站点同源「第 N 节」） */
export const Kicker: FC<PropsWithChildren<{ color?: string; style?: CSSProperties }>> = ({
  children,
  color = FILM_COLORS.vermillion,
  style,
}) => (
  <div
    style={{
      fontFamily: FONTS.serif,
      fontSize: T.micro,
      letterSpacing: '0.42em',
      color,
      ...style,
    }}
  >
    {children}
  </div>
);

/** 英文/数字数据标签：mono 大写字距 0.18em（数据镜头顶的 COMMITS / WORDS…） */
export const DataLabel: FC<PropsWithChildren<{ color?: string; size?: number; style?: CSSProperties }>> = ({
  children,
  color = FILM_COLORS.muted,
  size = T.label,
  style,
}) => (
  <div
    style={{
      fontFamily: FONTS.mono,
      fontSize: size,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color,
      ...style,
    }}
  >
    {children}
  </div>
);

/** 角标/出处：mono 12–14px 字距 0.16em */
export const Meta: FC<PropsWithChildren<{ color?: string; size?: number; style?: CSSProperties }>> = ({
  children,
  color = FILM_COLORS.muted,
  size = T.meta,
  style,
}) => (
  <div
    style={{
      fontFamily: FONTS.mono,
      fontSize: size,
      letterSpacing: '0.16em',
      color,
      ...style,
    }}
  >
    {children}
  </div>
);

/** 1px 发丝线 */
export const Hairline: FC<{ width?: number | string; color?: string; style?: CSSProperties }> = ({
  width = '100%',
  color = FILM_COLORS.hairline,
  style,
}) => <div style={{ width, height: 1, backgroundColor: color, ...style }} />;

/** 菱形分隔符（站点同源：44px 发丝线 + 10px 45° 菱形 + 44px 发丝线） */
export const DiamondRule: FC<{ color?: string; style?: CSSProperties }> = ({
  color = FILM_COLORS.hairline,
  style,
}) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, ...style }}>
    <div style={{ width: 44, height: 1, backgroundColor: color }} />
    <div
      style={{
        width: 10,
        height: 10,
        backgroundColor: color,
        transform: 'rotate(45deg)',
        opacity: 0.6,
      }}
    />
    <div style={{ width: 44, height: 1, backgroundColor: color }} />
  </div>
);

/** 衬线大字（标题/引语/数字的公共底样式，字号与颜色由调用方给） */
export const Serif: FC<PropsWithChildren<{ size?: number; weight?: 400 | 700; color?: string; style?: CSSProperties }>> = ({
  children,
  size = T.line,
  weight = 400,
  color = FILM_COLORS.ink,
  style,
}) => (
  <div
    style={{
      fontFamily: FONTS.serif,
      fontSize: size,
      fontWeight: weight,
      color,
      lineHeight: 1.35,
      fontVariantNumeric: 'lining-nums',
      ...style,
    }}
  >
    {children}
  </div>
);

/** 首字下沉（站点同源：3.35em serif 700 朱红） */
export const DropCap: FC<{ char: string; size?: number; color?: string; style?: CSSProperties }> = ({
  char,
  size = 72,
  color = FILM_COLORS.vermillion,
  style,
}) => (
  <span
    style={{
      float: 'left',
      fontFamily: FONTS.serif,
      fontWeight: 700,
      fontSize: size * 3.35,
      lineHeight: 0.92,
      color,
      marginRight: size * 0.28,
      marginTop: size * 0.06,
      ...style,
    }}
  >
    {char}
  </span>
);