/* LightWash —— 一层「光」（洗白 / 压暗 / 暖场 / 冷层），全片共用一套。
 *
 *  v12 收编：十几个镜头各自手写过同一种层
 *   `{ background: radial-gradient(...) | linear-gradient(...) | 纯色, opacity, filter, mixBlendMode }`，
 *   差别只在形状、色标、浓度、模糊、混合、以及**承载盒子的几何**。
 *
 *  两个形态：
 *   · 不给 `box`  → 铺满画面（AbsoluteFill），radial 的百分比以全屏为基准；
 *   · 给 `box`    → 画在一个矩形盒子里（灯晕、纸角光、地平线金带都是这种）。
 *  三种填充：`radial`（默认）/ `linear`（配 `angle`）/ `solid`（纯色，stops 只取第一个颜色）。
 *
 *  纪律：颜色只取 brand/tokens 与 motion-tokens；不含随机数与时间运算——opacity 由镜头算好传进来。
 */
import type { CSSProperties, FC } from 'react';
import { AbsoluteFill } from 'remotion';

/** 色标：`[颜色, 位置(%)]`，位置 0–100，按原样拼进渐变。纯色填充只取第一条的颜色。 */
export type WashStop = [color: string, at: number];

export type WashBox = {
  left?: number | string;
  right?: number | string;
  top?: number | string;
  bottom?: number | string;
  width?: number | string;
  height?: number | string;
  /** 圆角：数字=px，字符串按原样（如 '50%'） */
  radius?: number | string;
};

export const LightWash: FC<{
  /** radial 的 CSS 形状串，如 `ellipse 27% 22% at 46% 86%` */
  shape?: string;
  stops: WashStop[];
  /** 浓度（0–1） */
  strength: number;
  /** 0 = radial（默认），1 = linear（配 angle），2 = solid */
  type?: 'radial' | 'linear' | 'solid';
  /** linear 的角度（deg） */
  angle?: number;
  /** 盒子几何；不传则铺满画面 */
  box?: WashBox;
  blur?: number;
  blend?: 'screen' | 'multiply' | 'normal' | 'soft-light' | 'color-dodge';
  style?: CSSProperties;
}> = ({ shape = 'ellipse 50% 50% at 50% 50%', stops, strength, type = 'radial', angle = 180, box, blur, blend = 'screen', style }) => {
  const painting =
    type === 'solid'
      ? stops[0][0]
      : type === 'linear'
        ? `linear-gradient(${angle}deg, ${stops.map(([c, at]) => `${c} ${at}%`).join(', ')})`
        : `radial-gradient(${shape}, ${stops.map(([c, at]) => `${c} ${at}%`).join(', ')})`;
  const paint: CSSProperties = {
    background: painting,
    opacity: strength,
    mixBlendMode: blend === 'normal' ? undefined : blend,
    filter: blur ? `blur(${blur}px)` : undefined,
    pointerEvents: 'none',
    ...style,
  };
  if (!box) return <AbsoluteFill style={paint} />;
  return (
    <div
      style={{
        position: 'absolute',
        left: box.left,
        right: box.right,
        top: box.top,
        bottom: box.bottom,
        width: box.width,
        height: box.height,
        borderRadius: box.radius,
        ...paint,
      }}
    />
  );
};