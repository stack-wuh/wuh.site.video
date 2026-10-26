import type { FC } from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, dyeDrain, eqBars, inkRise, numRoll, writeFade , GRADES} from '../motion-tokens';
import { DustField } from './Act1';

const serif = fontFamilies.serif;
const sans = fontFamilies.sans;
const mono = fontFamilies.mono;

const fade = (f: number, at: number) =>
  interpolate(f, [at, at + 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

/* 镜 4：第一行代码（700–880） */
const ShotFirstCode: FC = () => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, 180], [1, 1.1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', transform: `scale(${scale})` }}>
      <div style={{ width: 820, borderRadius: 14, background: colors.terminalBg, border: `1px solid ${colors.hairline}`, padding: '28px 36px' }}>
        <p style={{ fontFamily: mono, fontSize: 24, color: colors.terminalText, margin: 0 }}>
          {'npx create-next-app@latest wuh.site'.slice(0, Math.floor(frame / 2.5))}
          <span style={{ color: colors.accent, opacity: Math.floor(frame / 10) % 2 ? 1 : 0.1 }}>▍</span>
        </p>
        <p style={{ fontFamily: mono, fontSize: 17, color: colors.muted, marginTop: 24, opacity: fade(frame, 100) }}>✓ 2024.12 · 1168 commits 由此起笔</p>
      </div>
      <p style={{ position: 'absolute', right: 120, bottom: 120, fontFamily: serif, fontSize: 30, color: colors.accent, opacity: fade(frame, 110) }}>2024.12</p>
    </AbsoluteFill>
  );
};

/* 镜 5：热力图生长 + 数字（880–1040） */
const ANNUAL = [3117, 3563, 3935, 2139, 2183, 2319, 0, 4387];
const ShotHeatmap: FC = () => {
  const frame = useCurrentFrame();
  const roll = numRoll(frame, 30, 40, 0, 1168);
  const tilt = interpolate(frame, [40, 100], [0, 18], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', perspective: 1200 }}>
      <div style={{ transform: `rotateX(${tilt}deg)`, display: 'flex', gap: 5 }}>
        {Array.from({ length: 22 }).map((_, w) => (
          <div key={w} style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {Array.from({ length: 7 }).map((_, d) => {
              const grow = spring({ frame: frame - (6 + w * 4 + d), fps: 30, config: { damping: 200 } });
              return <div key={d} style={{ width: 24, height: 24, borderRadius: 5, background: (w + d) % 4 > 1 ? colors.accent : colors.paperMuted, opacity: 0.35 + 0.55 * grow, transform: `scaleY(${interpolate(grow, [0, 1], [0.2, 1])})` }} />;
            })}
          </div>
        ))}
      </div>
      <p style={{ fontFamily: serif, fontSize: 44, color: colors.paper, marginTop: 44, opacity: fade(frame, 60) }}>
        {Math.round(roll).toLocaleString()} commits · 685 天
      </p>
    </AbsoluteFill>
  );
};

/* 镜 6：版本星轨（1040–1160） */
/* 镜 6：版本流水线（1040–1160；镜内 local = frame − 340，0–120）
   v1.0.1 → v2.0.0 全程动效：版本徽章传送带持续流动 + 里程碑高亮 + 107 计数器 + 末段吸入黑暗 */
const MILESTONES = ['v1.0.1', 'v1.1.0', 'v1.2.0', 'v1.3.0', 'v1.4.0', 'v1.4.87', 'v2.0.0'];
const versionLabel = (i: number): string => {
  const m = i % 7;
  if (m === 0) return MILESTONES[(i / 7) % 7 | 0];
  const minor = Math.min(4, 1 + ((i * 3) % 4));
  const patch = (i * 7) % 10;
  return `v1.${minor}.${patch}`;
};
const isMilestone = (i: number): boolean => i % 7 === 0;

const ShotTagArc: FC = () => {
  const frame = useCurrentFrame();
  const local = frame - 340;
  const flow = local * 5; // 传送带 5px/f
  const sink = interpolate(local, [85, 120], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseIn });
  const roll = numRoll(local, 10, 45, 0, 107);
  const finalLand = spring({ frame: local - 62, fps: 30, config: { damping: 12, stiffness: 200, mass: 0.9 } });
  return (
    <div style={{ position: 'relative', width: 1600, height: 420 }}>
      {/* 管线轨道 */}
      <div style={{ position: 'absolute', top: 310, left: 40, right: 40, height: 1, background: colors.hairline, opacity: 0.7 }} />
      <div style={{ position: 'absolute', top: 305, left: 40, width: 10, height: 10, borderRadius: 5, background: colors.accent, opacity: fade(local, 4) }} />
      {/* 传送带徽章 */}
      {Array.from({ length: 24 }).map((_, i) => {
        const x = (((i * 165 - flow) % 2200) + 2200) % 2200 - 320;
        const milestone = isMilestone(i);
        const chipSink = sink * sink * 600;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x + chipSink,
              top: 288,
              padding: '7px 14px',
              borderRadius: 8,
              border: `1px solid ${milestone ? colors.accent : colors.hairline}`,
              background: colors.terminalBg,
              fontFamily: mono,
              fontSize: milestone ? 17 : 14,
              color: milestone ? colors.accent : colors.terminalText,
              opacity: (1 - sink) * (milestone ? 1 : 0.6),
              transform: `scale(${(1 - sink) * (milestone ? 1.05 : 1) + 0.15 * sink})`,
              boxShadow: milestone ? `0 0 ${18 * (1 - sink)}px rgba(212,163,115,0.35)` : 'none',
              whiteSpace: 'nowrap',
            }}
          >
            {versionLabel(i)}
          </div>
        );
      })}
      {/* 终点 v2.0.0 落定 */}
      <div
        style={{
          position: 'absolute',
          right: 90,
          top: 246,
          padding: '12px 22px',
          borderRadius: 10,
          border: `1px solid ${colors.accent}`,
          background: colors.bgLift,
          fontFamily: mono,
          fontSize: 26,
          color: colors.accent,
          transform: `scale(${interpolate(finalLand, [0, 1], [2.2, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })})`,
          opacity: interpolate(local, [60, 70, 100, 120], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          boxShadow: `0 0 ${30}px rgba(212,163,115,0.5)`,
        }}
      >
        v2.0.0
      </div>
      {/* 起点 v1.0.1 标记 */}
      <div style={{ position: 'absolute', left: 40, top: 246, fontFamily: mono, fontSize: 15, color: colors.muted, opacity: fade(local, 12) * (1 - sink) }}>
        v1.0.1 起笔
      </div>
      {/* 107 计数器 */}
      <p style={{ position: 'absolute', right: 60, top: 20, fontFamily: mono, fontSize: 44, color: colors.paper, margin: 0, opacity: fade(local, 14), fontVariantNumeric: 'tabular-nums' }}>
        {Math.round(roll)}
        <span style={{ fontSize: 18, color: colors.muted, marginLeft: 10 }}>个版本</span>
      </p>
      <p style={{ position: 'absolute', bottom: 0, width: '100%', textAlign: 'center', fontFamily: mono, fontSize: 24, color: colors.muted, opacity: fade(local, 24) * (1 - sink) }}>
        107 个版本 · v1.0.1 → v2.0.0
      </p>
    </div>
  );
};

/* 镜 7：骤暗（1160–1380） */
const ShotBlackout: FC = () => {
  const frame = useCurrentFrame();
  const die = interpolate(frame, [10, 130], [0.6, 0.04], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ display: 'flex', gap: 5, opacity: die }}>
        {Array.from({ length: 14 }).map((_, i) => (
          <div key={i} style={{ ...dyeDrain(frame, 6 + i * 8), width: 26, height: 26, borderRadius: 5, background: colors.accent }} />
        ))}
      </div>
      <p style={{ fontFamily: serif, fontSize: 56, color: colors.paper, marginTop: 70, opacity: fade(frame, 90) }}>然后，安静了。</p>
    </AbsoluteFill>
  );
};

/* 镜 8：2025·0（1380–1520） */
const ShotZero: FC = () => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: 'flex', gap: 34, alignItems: 'flex-end', height: 340 }}>
      {[
        ['2019', 3117], ['2020', 3563], ['2021', 3935], ['2022', 2139], ['2023', 2183], ['2024', 2319], ['2025', 0],
      ].map(([y, v], i) => (
        <div key={String(y)} style={{ textAlign: 'center', ...dyeDrain(frame, 10 + i * 10) }}>
          <div style={{ width: 58, height: Math.max((Number(v) / 3935) * 270, 4), background: colors.muted, borderRadius: 4 }} />
          <p style={{ fontFamily: mono, fontSize: 15, color: colors.muted, marginTop: 10 }}>{y}</p>
          {y === '2025' ? <p style={{ ...inkRise(frame, 40), fontFamily: serif, fontSize: 44, color: colors.paper, margin: 0 }}>0</p> : null}
        </div>
      ))}
    </div>
  );
};

/* 镜 9：金句（1520–1670） */
const ShotQuote: FC = () => {
  const frame = useCurrentFrame();
  const scatter = interpolate(frame, [110, 150], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <div style={{ textAlign: 'center', opacity: 1 - scatter * 0.9, filter: `blur(${scatter * 4}px)` }}>
      <p style={{ ...inkRise(frame, 8), fontFamily: serif, fontSize: 48, color: colors.paper, margin: '16px 0' }}>人生一世不过 3 万多天，</p>
      <p style={{ ...inkRise(frame, 40), fontFamily: serif, fontSize: 48, color: colors.paper, margin: '16px 0' }}>实在是太短了。</p>
    </div>
  );
};

/* 镜 10：时间轴失色 + 暗红伏笔（1670–1800） */
const ShotTimelineGrey: FC = () => {
  const frame = useCurrentFrame();
  const pulse = 0.3 + 0.7 * Math.abs(Math.sin(frame / 8)) * interpolate(frame, [40, 120], [0.4, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <div style={{ position: 'relative', width: 1000, height: 300, ...dyeDrain(frame, 10) }}>
      <div style={{ position: 'absolute', top: 140, left: 0, right: 0, height: 1, background: colors.hairline }} />
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} style={{ position: 'absolute', left: 60 + i * 94, top: 136, width: 9, height: 9, borderRadius: 5, background: colors.muted }} />
      ))}
      <div style={{ position: 'absolute', right: 120, top: 120, width: 22, height: 22, borderRadius: 11, background: GRADES[2].lut.color, opacity: pulse, boxShadow: `0 0 ${30 * pulse}px ${GRADES[2].lut.color}` }} />
      <p style={{ position: 'absolute', bottom: 0, width: '100%', textAlign: 'center', fontFamily: serif, fontSize: 40, color: colors.paper, opacity: fade(frame, 40) }}>
        欲望，是最恐怖的东西。
      </p>
    </div>
  );
};

const SHOTS: Array<{ from: number; to: number; Board: FC }> = [
  { from: 700, to: 880, Board: ShotFirstCode },
  { from: 880, to: 1040, Board: ShotHeatmap },
  { from: 1040, to: 1160, Board: ShotTagArc },
  { from: 1160, to: 1380, Board: ShotBlackout },
  { from: 1380, to: 1520, Board: ShotZero },
  { from: 1520, to: 1670, Board: ShotQuote },
  { from: 1670, to: 1800, Board: ShotTimelineGrey },
];

// Act 2 起步与沉默（700–1800，本地帧 0–1100；幕调色 grade-ash-grey）
export const Act2: FC = () => {
  const frame = useCurrentFrame();
  const local = frame;
  const shot = SHOTS.find((s) => local >= s.from - 700 && local < s.to - 700) ?? SHOTS[0];
  const Board = shot.Board;
  return (
    <AbsoluteFill style={{ background: colors.bg, filter: 'saturate(0.55)' }}>
      <DustField act={2} />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Board />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: GRADES[1].lut.color, mixBlendMode: 'multiply', opacity: 0.45 }} />
      <AbsoluteFill style={{ background: GRADES[1].veil.color, mixBlendMode: 'screen', opacity: 0.08 }} />
    </AbsoluteFill>
  );
};
