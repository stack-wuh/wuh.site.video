/*
 * S24 的茶碗 —— v11 §3.7「碗从满到空，三段」。
 *
 * 底图 p-teahouse 里她那一桌上有一只素茶碗；这里在**同一个位置**叠一只代码画的碗，
 * 把「茶面高度」当这一镜的钟：满 → 半 → 空。物如刀刻（与 Objects.tsx 同口径）：
 * 碗身用纸灰（colors.paperMuted，和底图的瓷色同族，不用纯白）+ 一线淡墨轮廓，
 * 茶汤暖赭，全程不出现纯黑填充（只有 ≤1.6px 的淡墨描边）。
 *
 * 手：不给整只手（那会读成一团白）。只给**搭在碗沿上的三根手指**——
 * 「放下碗、手指在碗沿停住」是这一镜的落点，手背/袖子都在画外。
 *
 * 局部坐标：原点 = 碗口中心，1 单位 ≈ 1px（由 scale 缩放）；+x 向右、+y 向下。
 */
import type { FC } from 'react';
import { colors } from '../../../brand/tokens';

const BLUR_ID = 'c-teabowl-soft-blur';

/** 茶汤面随 level 收缩下移：level 1 = 满（贴碗口），0 = 见底。 */
const teaGeom = (level: number) => ({
  cy: 8 + (1 - level) * 54,
  rx: 78 * (0.3 + 0.7 * level),
  ry: 13 * (0.42 + 0.58 * level),
});

/** 三根手指搭在碗沿：每根从碗沿外侧伸进来一点，rest 0→1 从「握」松到「搭」。 */
const FINGERS = [
  { x0: 96, y0: -6, x1: 46, y1: 2, w: 7.4 },
  { x0: 98, y0: 6, x1: 50, y1: 14, w: 8 },
  { x0: 96, y0: 18, x1: 54, y1: 26, w: 7 },
] as const;

export const TeaBowl: FC<{
  /** 碗口中心（屏幕 px） */
  at: { x: number; y: number };
  /** 缩放：1 = 局部 1 单位 1px */
  scale?: number;
  /** 茶面：1 满 → 0 见底 */
  level: number;
  /** 倾杯角度（deg，负 = 远端抬起） */
  tilt?: number;
  /** 离桌高度（局部单位，正 = 抬起） */
  lift?: number;
  /** 口沿涟漪 0–1（锣响 / 落碗那一下） */
  ripple?: number;
  /** 搭在碗沿的手指：0 无 → 1 三指都在 */
  fingers?: number;
  /** 0 握碗 / 1 松成搭在碗沿 */
  rest?: number;
  /** 水汽 0–1 */
  steam?: number;
  /** 整碗不透明度 */
  opacity?: number;
}> = ({ at, scale = 1, level, tilt = 0, lift = 0, ripple = 0, fingers = 0, rest = 0, steam = 0.6, opacity = 1 }) => {
  const tea = teaGeom(Math.max(0, Math.min(1, level)));
  /* 松手时手指贴回碗沿一点 */
  const settle = rest * 4;
  return (
    <svg
      width={1920}
      height={1080}
      viewBox="0 0 1920 1080"
      style={{ position: 'absolute', inset: 0, opacity, pointerEvents: 'none' }}
    >
      <defs>
        <filter id={BLUR_ID} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>
      {/* 碗：抬起、倾倒时整体带着走 */}
      <g transform={`translate(${at.x} ${at.y}) scale(${scale}) translate(0 ${-lift}) rotate(${tilt})`}>
        {/* 桌上投影先画，压在最下面 */}
        <ellipse cx={8} cy={122} rx={88} ry={16} fill={colors.muted} opacity={0.2} filter={`url(#${BLUR_ID})`} />
        {/* 碗身：纸灰瓷 + 一线淡墨轮廓 */}
        <path d="M-92 0 Q-88 92 0 118 Q88 92 92 0 Z" fill={colors.paperMuted} stroke={colors.ink} strokeOpacity={0.3} strokeWidth={1.4} />
        {/* 左侧背光面 */}
        <path d="M-92 0 Q-88 92 0 118 Q-46 86 -48 0 Z" fill={colors.muted} opacity={0.16} />
        {/* 碗内壁的暗（纸灰上的淡墨压色，不是黑） */}
        <ellipse cx={0} cy={0} rx={84} ry={21} fill={colors.muted} opacity={0.2} />
        {/* 茶汤：暖赭；满→半→空 */}
        {tea.ry > 0.6 ? (
          <>
            <ellipse cx={0} cy={tea.cy} rx={tea.rx} ry={tea.ry} fill={colors.accent} opacity={0.5} />
            <ellipse cx={-tea.rx * 0.3} cy={tea.cy - tea.ry * 0.22} rx={tea.rx * 0.3} ry={tea.ry * 0.32} fill={colors.gold} opacity={0.26} />
          </>
        ) : null}
        {/* 涟漪：锣响/落碗那一下，口沿里两圈极淡的纸白 */}
        {ripple > 0.01 ? (
          <>
            <ellipse cx={0} cy={tea.cy} rx={tea.rx * (0.5 + ripple * 0.9)} ry={tea.ry * (0.5 + ripple * 0.9)} fill="none" stroke={colors.paper} strokeWidth={1.6} opacity={0.45 * ripple} />
            <ellipse cx={0} cy={tea.cy} rx={tea.rx * (0.2 + ripple * 0.5)} ry={tea.ry * (0.2 + ripple * 0.5)} fill="none" stroke={colors.paper} strokeWidth={1.1} opacity={0.3 * ripple} />
          </>
        ) : null}
        {/* 碗口沿：一圈 + 前缘一道加重的线（一点俯视） */}
        <ellipse cx={0} cy={0} rx={92} ry={26} fill="none" stroke={colors.ink} strokeOpacity={0.24} strokeWidth={1.2} />
        <path d="M-92 0 A 92 26 0 0 0 92 0" fill="none" stroke={colors.ink} strokeOpacity={0.36} strokeWidth={1.6} />

        {/* 三根手指搭在碗沿（只给指，不给手背/袖） */}
        {fingers > 0.01 ? (
          <g opacity={fingers}>
            {FINGERS.map((p, i) => (
              <g key={`fing-${i}`}>
                <path
                  d={`M${p.x0} ${p.y0} Q${(p.x0 + p.x1) / 2} ${(p.y0 + p.y1) / 2 - 5 + settle} ${p.x1} ${p.y1 + settle}`}
                  fill="none"
                  stroke={colors.paperMuted}
                  strokeWidth={p.w}
                  strokeLinecap="round"
                />
                <path
                  d={`M${p.x0} ${p.y0} Q${(p.x0 + p.x1) / 2} ${(p.y0 + p.y1) / 2 - 5 + settle} ${p.x1} ${p.y1 + settle}`}
                  fill="none"
                  stroke={colors.muted}
                  strokeWidth={1.1}
                  strokeLinecap="round"
                  opacity={0.65 - i * 0.08}
                />
              </g>
            ))}
            {/* 指尖一点暖：手是热的，碗是凉的 */}
            <circle cx={FINGERS[0].x1} cy={FINGERS[0].y1 + settle} r={2.2} fill={colors.accent} opacity={0.3} />
          </g>
        ) : null}
      </g>
      {/* 水汽：碗口上方两缕，随 steam 起落 */}
      {steam > 0.01
        ? [0, 1].map((i) => (
            <ellipse
              key={i}
              cx={at.x - 26 + i * 54}
              cy={at.y - lift * scale - 52 - i * 34 - steam * 26}
              rx={20 + steam * 15 + i * 5}
              ry={28 + steam * 20 + i * 6}
              fill={colors.paper}
              opacity={0.14 + steam * 0.14}
              filter={`url(#${BLUR_ID})`}
            />
          ))
        : null}
    </svg>
  );
};