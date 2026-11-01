/* 镜 29 · Act 5 灯亮 · 局部帧 [0,126) · 126f
   承接 S28 火簇余光（TR-18）：顶部暖带先入、旧年份刻度被雨推远，纸面由暖转青；
   三月 71 点先落成浅苔痕、五月 151 点更密落成深苔痕，两片左右并置，
   苔痕中心极小等宽字 71 / 151（FN-04 滚动）；CM-06 低机位微距 → CM-04 后拉，
   雨势缓-密-缓（CM-15），GR-04 湿纸；尾帧雨歇、双苔痕静置（交接 S30：湿纸+双苔痕）。 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, random, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, FILM_COLORS, numRoll, writeFade } from '../motion-tokens';
import { Caption } from '../components/Caption';
import { DustField } from '../components/DustField';
import { Grade } from '../components/Grade';
import { PaperGrain } from '../components/PaperGrain';

const CLAMP = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const mono = fontFamilies.mono;

type RainDot = { key: string; x: number; y: number; size: number; land: number; fall: number; drop: number };

/* 墨点落点：种子化椭圆分布；落点时刻取双随机均值 → 中段密、首尾疏（雨势缓-密-缓） */
const rain = (key: string, cx: number, cy: number, rx: number, ry: number, count: number, t0: number, span: number): RainDot[] =>
  Array.from({ length: count }, (_, i) => {
    const seed = `s29-${key}-${i}`;
    const ang = random(`${seed}-ang`) * Math.PI * 2;
    const rad = Math.sqrt(random(`${seed}-rad`));
    const skew = (random(`${seed}-t1`) + random(`${seed}-t2`)) / 2;
    return {
      key: seed,
      x: cx + Math.cos(ang) * rad * rx,
      y: cy + Math.sin(ang) * rad * ry,
      size: 2.5 + random(`${seed}-size`) * 3.5,
      land: t0 + Math.floor(skew * span),
      fall: 11 + Math.floor(random(`${seed}-fall`) * 9),
      drop: 130 + random(`${seed}-drop`) * 190,
    };
  });

const MARCH = rain('mar', 640, 566, 226, 176, 71, 10, 52);
const MAY = rain('may', 1286, 560, 292, 224, 151, 46, 62);
const DOTS = [...MARCH, ...MAY];

const PATCHES = [
  { key: 'mar', cx: 640, cy: 566, rx: 226, ry: 176, count: 71, deep: false, numDelay: 52, numDur: 42, mossAt: [14, 64] },
  { key: 'may', cx: 1286, cy: 560, rx: 292, ry: 224, count: 151, deep: true, numDelay: 96, numDur: 28, mossAt: [48, 104] },
];

/* 每片苔痕三层椭圆：外晕 ×2 + 芯 */
const BLOBS = [
  { dx: -0.16, dy: 0.12, w: 1.04, h: 0.92, blur: 34, core: false },
  { dx: 0.18, dy: -0.1, w: 0.94, h: 0.82, blur: 26, core: false },
  { dx: 0.02, dy: 0.04, w: 0.6, h: 0.62, blur: 16, core: true },
] as const;

const YEARS = ['2019', '2020', '2021', '2022', '2023', '2024', '2025-12'];

const ShotInkRain: FC = () => {
  const frame = useCurrentFrame();

  /* CM-06 低机位微距仰看雨势 → 随落点下移 → CM-04 雨势加大后拉露出双苔痕 */
  const scale = interpolate(frame, [0, 50, 96, 126], [1.14, 1.1, 1.035, 1.02], { ...CLAMP, easing: CURVES.cineEaseInOut });
  const shiftY = interpolate(frame, [0, 50, 96, 126], [46, 12, -4, 0], { ...CLAMP, easing: CURVES.cineEaseInOut });
  const driftX = Math.sin((frame / 120) * Math.PI * 2) * 3;
  const driftR = Math.sin((frame / 120) * Math.PI * 2 + 1) * 0.08;

  /* 旧年份刻度被雨势推远 */
  const axisOut = interpolate(frame, [0, 46], [1, 0], { ...CLAMP, easing: CURVES.cineEaseInOut });
  const axisPush = interpolate(frame, [0, 46], [0, 1], { ...CLAMP, easing: CURVES.cineEaseInOut });

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ backgroundColor: colors.paper }} />
      <AbsoluteFill style={{ transform: `translate(${driftX}px, ${shiftY}px) scale(${scale}) rotate(${driftR}deg)`, transformOrigin: 'center' }}>
        {/* 旧年份刻度（2025-12 为 S28 交接刻度，随雨势退远） */}
        <div
          style={{
            position: 'absolute',
            left: 260,
            top: 206,
            width: 1400,
            opacity: axisOut * 0.75,
            transform: `translateY(${-axisPush * 42}px) scale(${1 - axisPush * 0.08})`,
            transformOrigin: 'center',
          }}
        >
          <div style={{ height: 1, background: colors.muted, opacity: 0.35 }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
            {YEARS.map((y) => (
              <span
                key={y}
                style={{
                  fontFamily: mono,
                  fontSize: 13,
                  letterSpacing: '0.12em',
                  color: y === '2025-12' ? colors.accent : colors.muted,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {y}
              </span>
            ))}
          </div>
        </div>
        {/* 苔痕底：浅苔痕（三月）与深苔痕（五月） */}
        {PATCHES.map((p) => {
          const alpha = interpolate(frame, p.mossAt, [0, 1], { ...CLAMP, easing: CURVES.cineEaseInOut }) * (p.deep ? 0.5 : 0.28);
          return (
            <div key={p.key}>
              {BLOBS.map((b, bi) => (
                <div
                  key={bi}
                  style={{
                    position: 'absolute',
                    left: p.cx + b.dx * p.rx - b.w * p.rx,
                    top: p.cy + b.dy * p.ry - b.h * p.ry,
                    width: b.w * p.rx * 2,
                    height: b.h * p.ry * 2,
                    borderRadius: '50%',
                    background: colors.ink,
                    filter: `blur(${b.blur}px)`,
                    opacity: alpha * (b.core ? 1 : 0.55),
                  }}
                />
              ))}
            </div>
          );
        })}
        {/* 墨点雨：自由落体 → 触纸洇成苔痕斑点 */}
        {DOTS.map((d) => {
          const t = frame - (d.land - d.fall);
          const p = interpolate(t, [0, d.fall], [0, 1], { ...CLAMP, easing: CURVES.cineEaseIn });
          const opacity = interpolate(frame, [d.land - d.fall, d.land - d.fall + 2, d.land, d.land + 4], [0, 0.9, 0.9, 0.55], CLAMP);
          const bloom = interpolate(frame, [d.land, d.land + 6], [1.5, 1], { ...CLAMP, easing: CURVES.cineEaseOut });
          return (
            <div
              key={d.key}
              style={{
                position: 'absolute',
                left: d.x,
                top: d.y,
                width: d.size,
                height: d.size,
                borderRadius: '50%',
                background: colors.ink,
                opacity,
                transform: `translateY(${-(1 - p) * d.drop}px) scale(${bloom})`,
              }}
            />
          );
        })}
        {/* 苔痕中心：极小等宽计数 */}
        {PATCHES.map((p) => {
          const value = Math.round(numRoll(frame, p.numDelay, p.numDur, 0, p.count));
          return (
            <div key={`num-${p.key}`} style={{ ...writeFade(frame, p.numDelay), position: 'absolute', left: p.cx - 60, top: p.cy - 13, width: 120, textAlign: 'center' }}>
              <span
                style={{
                  fontFamily: mono,
                  fontSize: 22,
                  letterSpacing: '0.18em',
                  color: p.deep ? colors.paper : colors.ink,
                  fontVariantNumeric: 'tabular-nums',
                  textShadow: `0 1px 4px ${p.deep ? colors.bg : colors.paper}`,
                }}
              >
                {value}
              </span>
            </div>
          );
        })}
      </AbsoluteFill>
      <DustField act={5} seedBase="s29" />
      <PaperGrain opacity={0.08} />
      {/* S28 火簇余光（局部径向，不铺屏）与顶部暖带 → 纸面转青 */}
      <div
        style={{
          position: 'absolute',
          left: 960 - 150,
          top: 688 - 150,
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${FILM_COLORS.dawnLight} 0%, transparent 66%)`,
          opacity: 0.5 * interpolate(frame, [0, 28], [1, 0], CLAMP),
          mixBlendMode: 'screen',
        }}
      />
      <AbsoluteFill style={{ backgroundImage: `linear-gradient(180deg, ${FILM_COLORS.dawnLight}, transparent 42%)`, mixBlendMode: 'screen', opacity: interpolate(frame, [0, 30], [0.55, 0], CLAMP) }} />
      <AbsoluteFill style={{ backgroundColor: FILM_COLORS.greyMist, mixBlendMode: 'soft-light', opacity: interpolate(frame, [8, 56], [0, 0.14], { ...CLAMP, easing: CURVES.cineEaseInOut }) }} />
      <AbsoluteFill style={{ backgroundImage: `linear-gradient(180deg, ${FILM_COLORS.paperMist}, transparent 34%)`, mixBlendMode: 'screen', opacity: interpolate(frame, [26, 110], [0.04, 0.16], { ...CLAMP, easing: CURVES.cineEaseInOut }) }} />
      <AbsoluteFill style={{ backgroundImage: `linear-gradient(180deg, ${colors.bg}, transparent 22%)`, opacity: 0.3 }} />
      <AbsoluteFill style={{ backgroundImage: `linear-gradient(0deg, ${colors.bg}, transparent 26%)`, opacity: 0.42 }} />
      <Grade id="GR-04" />
      <Caption text="2026 年春天，提交变密；" appearAt={30} bottom={150} />
    </AbsoluteFill>
  );
};

export default ShotInkRain;
