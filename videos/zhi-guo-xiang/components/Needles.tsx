/* 三枚金针——中医针灸针：细长针身、缠丝针柄、发丝一样的针尖。
   形制必须对，所以不用模型画，这里画。 */
import type { FC } from 'react';
import { AbsoluteFill } from 'remotion';

const GOLD = '#c8a24d';
const GOLD_HI = '#f0dcae';
const GOLD_LO = '#8a6b28';

/** 一枚针：柄在原点，针身朝 +x 方向，总长 len。 */
const Needle: FC<{ len: number; width?: number }> = ({ len, width = 1 }) => {
  const handle = len * 0.3;
  const h = 8 * width;
  return (
    <g>
      {/* 针身：从柄端向针尖收细 */}
      <polygon
        points={`${handle},${-1.5 * width} ${handle},${1.5 * width} ${len},0`}
        fill={"url(#nz-shaft)"}
      />
      {/* 针柄：缠丝 */}
      <rect x={0} y={-h / 2} width={handle} height={h} rx={h / 2} fill={"url(#nz-wrap)"} />
      {Array.from({ length: 14 }).map((_, i) => {
        const x = (handle / 15) * (i + 0.5);
        return <rect key={i} x={x} y={-h / 2 + 0.6} width={1.1} height={h - 1.2} fill="rgba(60,44,16,0.55)" />;
      })}
      <rect x={0} y={-h / 2} width={handle} height={h} rx={h / 2} fill="none" stroke={GOLD_LO} strokeWidth={0.8} />
    </g>
  );
};

const Defs: FC = () => (
  <defs>
    <linearGradient id="nz-shaft" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stopColor={GOLD_LO} />
      <stop offset="40%" stopColor={GOLD_HI} />
      <stop offset="100%" stopColor={GOLD_HI} />
    </linearGradient>
    <linearGradient id="nz-wrap" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor={GOLD_HI} />
      <stop offset="45%" stopColor={GOLD} />
      <stop offset="100%" stopColor={GOLD_LO} />
    </linearGradient>
  </defs>
);
/** 一组针：摆在掌心/纸上。positions 用画面像素（1920×1080 基准）。 */
export const Needles: FC<{
  count?: number;
  origin?: [number, number];
  len?: number;
  spread?: number;
  tilt?: number;
  opacity?: number;
  shadow?: boolean;
}> = ({ count = 3, origin = [900, 560], len = 900, spread = 150, tilt = -7, opacity = 1, shadow = true }) => (
  <AbsoluteFill style={{ opacity, mixBlendMode: 'normal' }}>
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0 }}>
      <Defs />
      {Array.from({ length: count }).map((_, i) => {
        const off = (i - (count - 1) / 2) * spread;
        const a = tilt + (i - (count - 1) / 2) * 3.2;
        return (
          <g key={i} transform={`translate(${origin[0] + off * 0.35}, ${origin[1] + off}) rotate(${a})`}>
            {shadow ? <ellipse cx={len * 0.45} cy={9} rx={len * 0.42} ry={5} fill="rgba(0,0,0,0.16)" /> : null}
            <Needle len={len} />
          </g>
        );
      })}
    </svg>
  </AbsoluteFill>
);
