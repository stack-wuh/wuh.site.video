/* 镜 39 · Act 6 影子工作流 · 全局帧 [6120,6240) · 120f */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { CURVES, SPRINGS, COLD, GRADES } from '../motion-tokens';
import { CameraRig, type CamState } from '../components/CameraRig';
import { DustField } from '../components/DustField';

const serif = fontFamilies.serif;
const mono = fontFamilies.mono;
const FPS = 30; // 与全片一致（shots/manifest fps: 30）；镜文件不引视频配置 hook，fps 用常量

/* 坐标基准：镜局部帧（0 = 幕局 520 = 全局 6120）。原 Act6 以 <Board f={local − shot.from}> 供帧（本镜 localStart=520），
   镜内断点（dolly 0–90、draw1 8–42、draw2 26–60、NODES at 36/52/56/68、TOSS 64–92、burst 96–120、
   入场白闪 0–10）全部以镜局部帧求值且落在镜窗 [0,120) 内 —— const f = frame 逐字面量等价，无冻结/无跨镜相位；
   交汇驻点无钳制振荡器 Math.sin((f/60)·2π)（f≥96 起）原以镜局部帧取相位，局部基准下逐帧一致。 */
const ELECTRIC = COLD.electric; // 电蓝主色
const ELECTRIC_SOFT = COLD.electricSoft; // 电蓝浅
const COLD_WHITE = COLD.coldWhite; // 冷白
const COLD_DIM = COLD.coldDim; // 冷灰蓝次级文字

const fade = (f: number, at: number) =>
  interpolate(f, [at, at + 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

/* 双轴交汇 —— path-draw 双时间轴 + data-stream 光点互掷 + tr-converge-burst */
const NODES = [
  { axis: 0, x: 320, label: '06-14 · 上线', at: 36 },
  { axis: 0, x: 1160, label: 'v2.0.0', at: 52 },
  { axis: 1, x: 320, label: '06-27 · 诞生', at: 56 },
  { axis: 1, x: 1160, label: 'v6.3.1', at: 68 },
] as const;
const TOSS = [
  { from: 64, to: 82, x1: 320, y1: 130, x2: 1160, y2: 300, arc: -46 },
  { from: 74, to: 92, x1: 320, y1: 300, x2: 1160, y2: 130, arc: 46 },
] as const;

const ShotAxes: FC = () => {
  const frame = useCurrentFrame();
  const f = frame; // 镜局部帧 0–120
  const dolly = interpolate(f, [0, 90], [1.1, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const cam: CamState = { scale: dolly, x: 0, y: 0, rot: 0 };
  const draw1 = interpolate(f, [8, 42], [1160, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const draw2 = interpolate(f, [26, 60], [1160, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const burst = interpolate(f, [96, 120], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ filter: 'saturate(0.85)' }}>
        <AbsoluteFill>
          <CameraRig cam={cam}>
            <svg width="1400" height="420" viewBox="0 0 1400 420" style={{ position: 'absolute', left: 260, top: 330 }}>
              <line x1={120} y1={130} x2={1280} y2={130} stroke={ELECTRIC} strokeWidth={2} strokeDasharray={1160} strokeDashoffset={draw1} opacity={0.9} />
              <line x1={120} y1={300} x2={1280} y2={300} stroke={ELECTRIC_SOFT} strokeWidth={2} strokeDasharray={1160} strokeDashoffset={draw2} opacity={0.75} />
              <text x={40} y={136} fill={COLD_DIM} fontFamily={mono} fontSize={17} opacity={fade(f, 10)}>作品轴</text>
              <text x={40} y={306} fill={COLD_DIM} fontFamily={mono} fontSize={17} opacity={fade(f, 28)}>方法轴</text>
              {NODES.map((n, idx) => {
                const pop = spring({ frame: f - n.at, fps: FPS, config: SPRINGS.springPop });
                const y = n.axis === 0 ? 130 : 300;
                return (
                  <g key={idx}>
                    <circle cx={n.x} cy={y} r={interpolate(pop, [0, 1], [0, 7])} fill={n.axis === 0 ? COLD_WHITE : ELECTRIC_SOFT} opacity={0.95} />
                    <text x={n.x} y={n.axis === 0 ? y - 20 : y + 36} textAnchor="middle" fill={ELECTRIC_SOFT} fontFamily={mono} fontSize={18} opacity={Math.min(1, Math.max(0, pop * 6))}>
                      {n.label}
                    </text>
                  </g>
                );
              })}
            </svg>
            {/* data-stream 光点互掷 ×2 */}
            {TOSS.map((t, i) => {
              const p = interpolate(f, [t.from, t.to], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
              const x = t.x1 + (t.x2 - t.x1) * p;
              const y = t.y1 + (t.y2 - t.y1) * p + t.arc * Math.sin(p * Math.PI);
              const ang = (Math.atan2(t.y2 - t.y1, t.x2 - t.x1) * 180) / Math.PI;
              return (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    left: 260 + x,
                    top: 330 + y,
                    width: 34,
                    height: 5,
                    borderRadius: 3,
                    background: `linear-gradient(90deg, transparent, ${COLD_WHITE}, ${ELECTRIC})`,
                    transform: `translate(-50%, -50%) rotate(${ang}deg)`,
                    opacity: p <= 0 ? 0 : 0.95 * (1 - burst),
                    mixBlendMode: 'screen',
                    filter: `drop-shadow(0 0 8px ${ELECTRIC})`,
                  }}
                />
              );
            })}
            {/* tr-converge-burst：交汇爆发（双轴中点） */}
            <div style={{ position: 'absolute', left: 1000, top: 545 }}>
              <div
                style={{
                  position: 'absolute',
                  left: -110,
                  top: -110,
                  width: 220,
                  height: 220,
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${COLD_WHITE} 0%, ${ELECTRIC} 38%, transparent 70%)`,
                  opacity: (1 - burst) * 0.95,
                  transform: `scale(${0.2 + burst * 3.2})`,
                  mixBlendMode: 'screen',
                }}
              />
              {Array.from({ length: 12 }).map((_, r) => (
                <div
                  key={r}
                  style={{
                    position: 'absolute',
                    left: -1,
                    top: -burst * 150,
                    width: 2,
                    height: burst * 150,
                    background: `linear-gradient(180deg, ${COLD_WHITE}, transparent)`,
                    transform: `rotate(${r * 30}deg)`,
                    transformOrigin: '50% 100%',
                    opacity: (1 - burst) * 0.75,
                    mixBlendMode: 'screen',
                  }}
                />
              ))}
              {/* 交汇驻点 glow-pulse */}
              <div
                style={{
                  position: 'absolute',
                  left: -7,
                  top: -7,
                  width: 14,
                  height: 14,
                  borderRadius: '50%',
                  background: COLD_WHITE,
                  opacity: f >= 96 ? 0.5 + 0.2 * Math.sin((f / 60) * Math.PI * 2) : 0,
                  boxShadow: `0 0 18px ${ELECTRIC}`,
                }}
              />
            </div>
          </CameraRig>
          <p style={{ position: 'absolute', top: '87%', width: '100%', textAlign: 'center', fontFamily: serif, fontSize: 36, color: COLD_WHITE, margin: 0, opacity: fade(f, 58) }}>
            方法与作品，一起长大
          </p>
          <AbsoluteFill style={{ background: COLD_WHITE, opacity: interpolate(f, [0, 10], [0.9, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }), mixBlendMode: 'screen' }} />
        </AbsoluteFill>
        {/* Act6 幕级光尘（ColdDust 上收为 DustField，act=6：40 颗快档） */}
        <DustField act={6} />
      </AbsoluteFill>
      {/* 幕级 grade-electric-blue（原 Act6 return 全幕常量层，位于 saturate(0.85) 滤镜组之外，保持原渲染层级） */}
      <AbsoluteFill style={{ background: GRADES[5].lut.color, mixBlendMode: 'multiply', opacity: 0.5 }} />
      <AbsoluteFill style={{ background: COLD.coldWhite, mixBlendMode: 'screen', opacity: 0.1 }} />
    </AbsoluteFill>
  );
};

export default ShotAxes;
