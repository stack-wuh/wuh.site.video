/* b-seasonveil —— 三拍季节的「天气与光」（design-v11 §3.4）：同一张底图，只换季节的色与光。
 *
 *  v11 抽帧返工 ×2（lead 2026-11-07）：
 *   ① 第一版三拍只差一层几乎看不见的色雾，观众读不出「季节变了」；
 *   ② 第二版用整幅 screen 叠纸白做冬雪，把整帧冲成白纸（抽帧 f64/f72 全白）——**禁止**整幅 screen 叠白。
 *  本版每条季节线都改成「底色真的变 + 地面真的变 + 专属粒子」三件事同时发生：
 *   · 春：真压冷青（normal + multiply）+ 橄榄灰（muted，读作淡绿）+ 青苔地面 + 抬底雾带；
 *   · 冬：冷灰青压色（multiply 0.26）+ **地面雪斑（snow patches，白斑 + 灰青影子）** + 上半幅远景淡白
 *          + 飞雪；不再整幅漂白，人物轮廓保住；
 *   · 秋：暖赭（soft-light + accent 轻 normal 混合）+ 右上斜金光 + 地面枯黄 + 斜向光带 + 芦苇。
 *  三拍的地面分别是「青苔 / 雪斑 / 枯黄」，是三帧并排时最容易被读到的差。
 *  exposure：季节切换点的快门曝光跳——正值过曝（纸白），负值压暗（墨）；镜头给 ±0.15 量级、1–2f。
 *
 *  颜色只取 brand/tokens + FILM（渐变里的透明用 transparent 关键字，不内联色值）。
 */
import type { FC } from 'react';
import { AbsoluteFill } from 'remotion';
import { colors } from '../../../brand/tokens';
import { FILM } from '../motion-tokens';

/** 冬拍地面积雪斑：位置写死（1920×1080），只压画面下半，像路边/田埂上积起来的雪。
 *  每块 = 纸白雪面 + 下缘一圈灰青影子；不做整幅漂白。 */
const SNOW_PATCHES: ReadonlyArray<{ x: number; y: number; rx: number; ry: number }> = [
  { x: 240, y: 902, rx: 210, ry: 66 },
  { x: 520, y: 956, rx: 270, ry: 84 },
  { x: 880, y: 1032, rx: 390, ry: 112 },
  { x: 1268, y: 930, rx: 250, ry: 76 },
  { x: 1586, y: 982, rx: 300, ry: 92 },
  { x: 1772, y: 862, rx: 180, ry: 58 },
  { x: 700, y: 872, rx: 150, ry: 46 },
];

const SnowPatches: FC<{ weight: number }> = ({ weight }) => {
  if (weight <= 0.01) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0 }}>
        <g style={{ filter: 'blur(11px)' }}>
          {SNOW_PATCHES.map((p, i) => (
            <g key={i} opacity={weight}>
              {/* 雪面底下的灰青影子：雪是「压」在土路上的，不是贴上去的白片 */}
              <ellipse cx={p.x} cy={p.y + p.ry * 0.28} rx={p.rx * 0.98} ry={p.ry * 0.82} fill={FILM.snowCyan} opacity={0.3} />
              <ellipse cx={p.x} cy={p.y} rx={p.rx} ry={p.ry} fill={colors.paper} opacity={0.62} />
            </g>
          ))}
        </g>
      </svg>
    </AbsoluteFill>
  );
};

export const SeasonVeil: FC<{
  spring: number;
  winter: number;
  autumn: number;
  /** 快门曝光：>0 过曝（纸白），<0 压暗（墨） */
  exposure?: number;
}> = ({ spring, winter, autumn, exposure = 0 }) => (
  <AbsoluteFill style={{ pointerEvents: 'none' }}>
    {spring > 0.01 ? (
      <>
        {/* 春：真的压一层冷青（normal 混合 = 整幅色相变冷，不是只加光） */}
        <AbsoluteFill style={{ background: FILM.snowCyan, opacity: 0.14 * spring }} />
        <AbsoluteFill style={{ background: FILM.snowCyan, mixBlendMode: 'multiply', opacity: 0.12 * spring }} />
        {/* 橄榄灰 → 读作「淡绿」的春色（palette 里唯一的绿调灰） */}
        <AbsoluteFill style={{ background: colors.muted, mixBlendMode: 'soft-light', opacity: 0.42 * spring }} />
        {/* 地面：青苔色（从画面下缘往上） */}
        <AbsoluteFill
          style={{ background: `linear-gradient(0deg, ${colors.muted} 0%, transparent 56%)`, mixBlendMode: 'normal', opacity: 0.06 * spring }}
        />
        <AbsoluteFill
          style={{ background: `linear-gradient(0deg, ${colors.muted} 0%, transparent 56%)`, mixBlendMode: 'soft-light', opacity: 0.42 * spring }}
        />
        {/* 春雾：抬底，让远景发白 */}
        <AbsoluteFill style={{ background: `linear-gradient(180deg, transparent 46%, ${colors.paper} 100%)`, opacity: 0.2 * spring }} />
      </>
    ) : null}

    {winter > 0.01 ? (
      <>
        {/* 冬：冷灰青压色（这是「冬天的光」，不是让画面变白） */}
        <AbsoluteFill style={{ background: FILM.snowCyan, mixBlendMode: 'multiply', opacity: 0.26 * winter }} />
        <AbsoluteFill style={{ background: colors.paper, opacity: 0.06 * winter }} />
        {/* 远景被雪雾吃掉：screen 只压上半幅（远山/天际），人物所在的中景不动 */}
        <AbsoluteFill
          style={{ background: `linear-gradient(180deg, ${colors.paper} 0%, ${colors.paper} 16%, transparent 48%)`, mixBlendMode: 'screen', opacity: 0.55 * winter }}
        />
        {/* 地面雪斑：路边/田埂上的积雪（只在下半幅，局部白，不整幅漂白） */}
        <SnowPatches weight={winter} />
        {/* 路面上最后一点雪色反光 */}
        <AbsoluteFill
          style={{ background: `linear-gradient(180deg, transparent 74%, ${colors.paper} 100%)`, mixBlendMode: 'screen', opacity: 0.3 * winter }}
        />
      </>
    ) : null}

    {autumn > 0.01 ? (
      <>
        {/* 暖赭：整体色温往暖推 */}
        <AbsoluteFill style={{ background: colors.accent, mixBlendMode: 'soft-light', opacity: 0.38 * autumn }} />
        <AbsoluteFill style={{ background: colors.accent, opacity: 0.06 * autumn }} />
        {/* 右上斜金光 */}
        <AbsoluteFill
          style={{ background: `linear-gradient(215deg, ${FILM.fireGold} 0%, transparent 58%)`, mixBlendMode: 'screen', opacity: 0.42 * autumn }}
        />
        {/* 地面枯黄 */}
        <AbsoluteFill
          style={{ background: `linear-gradient(0deg, ${colors.accent} 0%, transparent 48%)`, mixBlendMode: 'soft-light', opacity: 0.38 * autumn }}
        />
        {/* 斜向光带：两层很淡的暖光斜纹，给「斜光」一个方向 */}
        <AbsoluteFill
          style={{
            background: `repeating-linear-gradient(105deg, transparent 0px, transparent 150px, ${colors.gold} 152px, transparent 200px, transparent 350px)`,
            mixBlendMode: 'screen',
            opacity: 0.16 * autumn,
          }}
        />
      </>
    ) : null}

    {exposure > 0.001 ? <AbsoluteFill style={{ background: colors.paper, opacity: exposure }} /> : null}
    {exposure < -0.001 ? <AbsoluteFill style={{ background: colors.ink, opacity: -exposure }} /> : null}
  </AbsoluteFill>
);