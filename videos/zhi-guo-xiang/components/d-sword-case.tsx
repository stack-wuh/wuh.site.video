/* D 组 · v11 S28「剑入匣」专用（design-v11 §3.10，用户意见 15「什么动效，难看死了」）。
 *
 * v10 用 `dry` 干笔擦（横向几何条带）演「剑滑入匣」——一排与画面无关的横条，被用户直接点名。
 * v11 换成「光与遮挡」，不出现任何条带/几何蒙版：
 *   · SwordShadow  剑影：一把软边剑形暗影（multiply + blur）。它投在**开着的匣盖内面**上
 *                  （灯在画面左侧，剑在灯与盖之间 —— 影子落在那儿是物理上对的），
 *                  不是第二把剑，是一块会动的影子；影层按盖的四边裁住，剑沉下去时
 *                  是**被匣沿吃掉**，不是淡出；
 *   · CaseDust     剑彻底入匣那一刻，匣口前沿起的一点尘（random(seed)，确定性）。
 *
 * 关于「合盖」：v11 曾试过「把底图那面开着的盖按铰链压平 + 用平移底图补墙 + 再画一块盖板」，
 * 渲出来是一块直边假墙 + 一条窄木带（见 04:0x 的抽帧判读），比「不闭盖」更出戏，**已按 lead 决定撤掉**。
 * 本镜保留底图原本那只开着的盖：「剑收进木匣」由剑已入匣 + 旁白承担，不在代码里画一只假盖。
 *
 * 底图 p-sword-case（1920×1080）实测：剑轴 剑尖(700,780)→剑柄(1005,640)、静置中心 (852,710)、
 * 开盖四面 (534,596)-(976,536)-(986,676)-(618,744)；灯焰心 (492,722)。
 */
import type { CSSProperties, FC } from 'react';
import { AbsoluteFill, random } from 'remotion';
import { colors } from '../../../brand/tokens';

export const LID_OPEN = [
  [534, 596],
  [976, 536],
  [986, 676],
  [618, 744],
] as const;
export const LID_OPEN_CSS = LID_OPEN.map(([x, y]) => `${x}px ${y}px`).join(', ');

/** 剑影：软边剑形（不画实物剑，只画它投在盖面上的那一层暗）。 */
export const SwordShadow: FC<{ style?: CSSProperties; opacity?: number }> = ({ style, opacity = 1 }) => (
  <svg viewBox="0 0 120 360" style={style} opacity={opacity}>
    <path d="M44 164 L76 164 L73 322 L60 352 L47 322 Z" fill={colors.ink} />
    <path d="M22 148 L98 148 L98 166 L22 166 Z" fill={colors.ink} />
    <path d="M50 92 L70 92 L70 148 L50 148 Z" fill={colors.ink} />
    <circle cx={60} cy={84} r={10} fill={colors.ink} />
  </svg>
);

/** 剑入匣落定那一点尘：匣口前沿一排起浮，random(seed) 确定性，不越界不闪烁。 */
export const CaseDust: FC<{ frame: number; from: number; count?: number }> = ({ frame, from, count = 12 }) => {
  const t = frame - from;
  if (t < 0 || t > 26) return null;
  const p = t / 26;
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {Array.from({ length: count }).map((_, i) => {
        const seed = `d-case-dust-${i}`;
        const x0 = 632 + random(seed) * 350;
        const y0 = 752 + random(`${seed}-y`) * 52;
        const rise = 18 + random(`${seed}-r`) * 44;
        const drift = (random(`${seed}-d`) - 0.5) * 46;
        const size = 1.4 + random(`${seed}-s`) * 2.2;
        const o = Math.sin(Math.min(1, p * 1.15) * Math.PI) * (0.26 + random(`${seed}-o`) * 0.3);
        return (
          <div
            key={seed}
            style={{
              position: 'absolute',
              left: x0 + drift * p,
              top: y0 - rise * p,
              width: size,
              height: size,
              borderRadius: '50%',
              background: colors.paperMuted,
              opacity: o,
              filter: 'blur(0.6px)',
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};