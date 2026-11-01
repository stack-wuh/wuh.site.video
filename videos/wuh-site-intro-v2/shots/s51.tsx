/* 镜 51 · Act 8 此刻 · 局部帧 [0,122) · 122f
   星轨倾侧让位：116 颗版本光点（v1.0.1 → v1.4.97）斜落进下方时间轴
   2026-08-22 → 10-27 区间，每颗落定闪一次（FN-27 version-dot-land）；
   末尾 20f 减速落满（全局 6620f 第 332 拍），尾帧光点密轴；
   CM-05 斜向跟摇与雨同速（CM-15）；GR-01。 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, random, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, versionDotLand, writeFade } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { DustField } from '../components/DustField';
import { PaperGrain } from '../components/PaperGrain';
import { Grade } from '../components/Grade';
import { Caption } from '../components/Caption';

const CLAMP = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const AXIS_X0 = 260;
const AXIS_X1 = 1640;
const AXIS_Y = 800;
const DOT_COUNT = 116;

const mono = fontFamilies.mono;

/* 116 颗版本光点（seed 确定性；落点沿 2026-08-22 → 10-27 区间） */
const RAIN = Array.from({ length: DOT_COUNT }).map((_, i) => {
  const seed = `s51-rain-${i}`;
  return {
    seed,
    delay: (i / (DOT_COUNT - 1)) * 76 + random(`${seed}-delay`) * 1.6,
    x: AXIS_X0 + (i / (DOT_COUNT - 1)) * (AXIS_X1 - AXIS_X0) + (random(`${seed}-x`) - 0.5) * 14,
    y: AXIS_Y + (random(`${seed}-y`) - 0.5) * 18,
    red: random(`${seed}-tone`) > 0.9,
  };
});

/* 时间轴月度刻度：8-22 → 10-27 共 66 天 */
const MONTH_TICKS = [
  { x: AXIS_X0 + (10 / 66) * (AXIS_X1 - AXIS_X0), label: '09' },
  { x: AXIS_X0 + (40 / 66) * (AXIS_X1 - AXIS_X0), label: '10' },
];

const ShotVersionRain: FC = () => {
  const frame = useCurrentFrame();
  const pan = interpolate(frame, [0, 102], [0, 1], { ...CLAMP, easing: CURVES.cineEaseInOut });
  const cam = { scale: 1.02, x: 28 - 56 * pan, y: 14 - 26 * pan, rot: 0 };
  const axisIn = interpolate(frame, [0, 18], [0, 1], { ...CLAMP, easing: CURVES.cineEaseOut });
  const orbitFade = interpolate(frame, [0, 20], [0.35, 0.12], CLAMP);
  const settleGlow = interpolate(frame, [88, 98], [0, 0.28], CLAMP);
  const enter = interpolate(frame, [0, 6], [0, 1], { ...CLAMP, easing: CURVES.cineEaseOut });

  return (
    <AbsoluteFill>
      <CameraRig cam={cam}>
        <AbsoluteFill style={{ opacity: enter }}>
          <DustField act={8} seedBase="s51" />
          {/* 星轨倾侧（让出画面给雨） */}
          <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
            <g transform="rotate(-7 960 300)" opacity={orbitFade}>
              <ellipse cx={960} cy={300} rx={430} ry={84} fill="none" stroke={colors.gold} strokeWidth={1.4} />
              <circle cx={960 + 430 * Math.cos(-0.24)} cy={300 + 84 * Math.sin(-0.24)} r={4} fill={colors.accent} />
              <circle cx={960 + 430} cy={300} r={4} fill={colors.accent} />
              <circle cx={960 + 430 * Math.cos(0.24)} cy={300 + 84 * Math.sin(0.24)} r={4} fill={colors.accent} />
            </g>
          </svg>
          {/* 时间轴 */}
          <div style={{ position: 'absolute', left: AXIS_X0, top: AXIS_Y, width: AXIS_X1 - AXIS_X0, height: 1.5, background: colors.muted, opacity: 0.35 * axisIn }} />
          <div
            style={{
              position: 'absolute',
              left: AXIS_X0,
              top: AXIS_Y - 1.5,
              width: AXIS_X1 - AXIS_X0,
              height: 4,
              backgroundImage: `linear-gradient(90deg, transparent, ${colors.gold}, transparent)`,
              opacity: settleGlow,
            }}
          />
          <div style={{ position: 'absolute', left: AXIS_X0 - 1, top: AXIS_Y - 7, width: 1.5, height: 14, background: colors.muted, opacity: 0.5 * axisIn }} />
          <div style={{ position: 'absolute', left: AXIS_X1 - 1, top: AXIS_Y - 7, width: 1.5, height: 14, background: colors.muted, opacity: 0.5 * axisIn }} />
          {MONTH_TICKS.map((m) => (
            <div key={m.label}>
              <div style={{ position: 'absolute', left: m.x - 0.75, top: AXIS_Y - 5, width: 1.5, height: 10, background: colors.muted, opacity: 0.4 * axisIn }} />
              <div style={{ position: 'absolute', left: m.x, top: AXIS_Y - 30, transform: 'translateX(-50%)', fontFamily: mono, fontSize: 13, color: colors.muted, opacity: 0.65 * axisIn, fontVariantNumeric: 'tabular-nums' }}>{m.label}</div>
            </div>
          ))}
          <div style={{ position: 'absolute', left: AXIS_X0, top: AXIS_Y + 22, fontFamily: mono, fontSize: 17, letterSpacing: '0.12em', color: colors.muted, opacity: 0.9 * axisIn, fontVariantNumeric: 'tabular-nums' }}>2026-08-22</div>
          <div style={{ position: 'absolute', right: 1920 - AXIS_X1, top: AXIS_Y + 22, fontFamily: mono, fontSize: 17, letterSpacing: '0.12em', color: colors.muted, opacity: 0.9 * axisIn, fontVariantNumeric: 'tabular-nums' }}>10-27</div>
          {/* 版本雨：116 颗，每颗落定闪一次 */}
          {RAIN.map((d) => {
            if (frame < d.delay) return null;
            const land = versionDotLand(frame, d.delay, d.seed);
            const hx = (land.y / -70) * 44;
            const fadeIn = interpolate(frame - d.delay, [0, 4], [0, 0.9], CLAMP);
            return (
              <div key={d.seed}>
                <div
                  style={{
                    position: 'absolute',
                    left: d.x - 2.5,
                    top: d.y - 2.5,
                    width: 5,
                    height: 5,
                    borderRadius: 2.5,
                    background: d.red ? colors.seal : colors.gold,
                    opacity: fadeIn,
                    transform: `translate(${hx}px, ${land.y}px) scale(${1 + land.flash * 0.9})`,
                  }}
                />
                {land.flash > 0 ? (
                  <div
                    style={{
                      position: 'absolute',
                      left: d.x - 7,
                      top: d.y - 7,
                      width: 14,
                      height: 14,
                      borderRadius: 7,
                      border: `1px solid ${d.red ? colors.seal : colors.gold}`,
                      opacity: land.flash * 0.4,
                      transform: `translate(${hx}px, ${land.y}px) scale(${1 + land.flash})`,
                    }}
                  />
                ) : null}
              </div>
            );
          })}
          {/* 首尾版本标号 */}
          <div style={{ ...writeFade(frame, RAIN[0].delay + 12), position: 'absolute', left: RAIN[0].x - 4, top: AXIS_Y - 44, fontFamily: mono, fontSize: 15, color: colors.paperMuted, fontVariantNumeric: 'tabular-nums' }}>v1.0.1</div>
          <div style={{ ...writeFade(frame, 90), position: 'absolute', left: RAIN[DOT_COUNT - 1].x + 4, top: AXIS_Y - 44, transform: 'translateX(-100%)', fontFamily: mono, fontSize: 15, color: colors.paperMuted, fontVariantNumeric: 'tabular-nums' }}>v1.4.97</div>
        </AbsoluteFill>
      </CameraRig>
      <PaperGrain opacity={0.05} />
      <Grade id="GR-01" />
      <Caption text="两个月，116 个版本。" appearAt={30} />
    </AbsoluteFill>
  );
};

export default ShotVersionRain;
