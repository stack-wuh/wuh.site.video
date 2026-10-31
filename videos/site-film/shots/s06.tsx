/* 镜 06 · Act 2 起步与沉默 · 全局帧 [1040,1160) · 120f */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, GRADES, numRoll } from '../motion-tokens';

const mono = fontFamilies.mono;

const fade = (f: number, at: number) =>
  interpolate(f, [at, at + 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

/* 镜 6：版本流水线（1040–1160；镜内 local = frame，0–120）
   v1.0.1 → v2.0.0 全程动效：版本徽章传送带持续流动 + 里程碑高亮 + 107 计数器 + 末段吸入黑暗
   （原 ShotTagArc；原码自带 local = frame − 340（镜起点幕内偏移 340），断点 sink [85,120]、
   roll [10,55]、finalLand −62、终点徽章 [60,70,100,120]、fade 4/12/14/24 全部经 local 求值，
   与镜局部逐帧等价、动画全程活跃 → 镜局部帧基准，local = frame）。 */
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
  const local = frame;
  const flow = local * 5; // 传送带 5px/f
  const sink = interpolate(local, [85, 120], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseIn });
  const roll = numRoll(local, 10, 45, 0, 107);
  const finalLand = spring({ frame: local - 62, fps: 30, config: { damping: 12, stiffness: 200, mass: 0.9 } });
  return (
    <AbsoluteFill style={{ filter: 'saturate(0.55)' }}>
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
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
      </AbsoluteFill>
      {/* 幕级调色 veil（grade-ash-grey · multiply 0.45 + screen 0.08，Act2 全幕常量，跨镜拆分归入各镜，层级在内容之上） */}
      <AbsoluteFill style={{ background: GRADES[1].lut.color, mixBlendMode: 'multiply', opacity: 0.45 }} />
      <AbsoluteFill style={{ background: GRADES[1].veil.color, mixBlendMode: 'screen', opacity: 0.08 }} />
    </AbsoluteFill>
  );
};

export default ShotTagArc;
