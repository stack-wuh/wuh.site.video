/* 镜 34 · Act 5 创作人文 · 全局帧 [5250,5500) · 250f */
import type { CSSProperties, FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, GRADES, glowPulse, writeFade } from '../motion-tokens';
import { CameraRig, ParallaxLayer } from '../components/CameraRig';
import { DustField } from '../components/DustField';

const serif = fontFamilies.serif;
const mono = fontFamilies.mono;

const CLAMP = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

const grade = GRADES[4]; // grade-warm-paper：幕级根层 saturate(0.95) 作为镜根 filter 带入（背景由 ShotShell 提供）

/* 坐标保真（幕局部基准 + localStart = 550）：camDrift / glowPulse 为无钳制 Math.sin 振荡器，
   相位依赖幕局部帧 → 组件内 const frame = useCurrentFrame() + 550（FootprintCard 内部
   useCurrentFrame 同步 +550，保持其原求值坐标系），全部字面量逐字保留幕局部坐标
   （dolly [550,800]、ascend [760,800]、落纸 delay 600/680、write-fade delay 700、
   光尘升散 t0 = 762+(i%12)*3），逐帧复现原片渲染，不做镜局部改写。
   本镜无冻结断点，动画照原样播放；升散粒子末批（t0=795）按原样被 800 硬边界截断。 */

/** cam-drift 减半档：固定机位的呼吸（±2px / ±0.075°，120f 周期） */
const camDrift = (frame: number): { x: number; y: number; rot: number } => ({
  x: Math.sin((frame / 120) * Math.PI * 2 + 1.3) * 2,
  y: Math.cos((frame / 120) * Math.PI * 2 + 1.1) * 2,
  rot: Math.sin((frame / 120) * Math.PI * 2 + 0.6) * 0.075,
});

/** photo-develop 拍立得显影（45f）：过曝 → 成像 */
const photoDevelop = (frame: number, delay: number): CSSProperties => {
  const p = interpolate(frame - delay, [0, 45], [0, 1], { ...CLAMP, easing: CURVES.cineEaseOut });
  return { filter: `brightness(${1.5 - p * 0.5}) saturate(${p}) blur(${(1 - p) * 3}px)` };
};

/** heavy-glide 拍立得落纸（≤40f）：过阻尼滑落 + 落定 ±1° 微旋归正 + 2px 微沉降，无回弹 */
const polaroidLand = (frame: number, delay: number, dropY: number, tilt: number): CSSProperties => {
  const t = frame - delay;
  const fall = interpolate(t, [0, 30], [0, 1], { ...CLAMP, easing: CURVES.cineEaseOut });
  const sink = interpolate(t, [30, 35, 40], [0, 2, 0], CLAMP);
  const rot = interpolate(t, [0, 30, 40], [tilt * 2.2, tilt, 0], { ...CLAMP, easing: CURVES.cineEaseOut });
  return {
    transform: `translateY(${(1 - fall) * dropY + sink}px) rotate(${rot}deg)`,
    opacity: interpolate(t, [0, 3], [0, 1], CLAMP),
  };
};

/* ─── 足迹拍立得（原 Act5 ShotFootprints，幕局部 550–800 逐字保留） ───
   heavy-glide 落纸（全局 5300/5380 = 幕局部 600/680）+ photo-develop（45f 各随其后）+
   cam-hold/drift/dolly-in 缓慢微推 + glow-pulse 极淡档地图光点；出场 tr-photo-ascend 升散 */
const SeaScene: FC = () => (
  <div style={{ position: 'relative', width: '100%', height: '100%', background: `linear-gradient(${colors.paper} 0%, ${colors.paperMuted} 58%, ${colors.accent} 62%, ${colors.muted} 100%)` }}>
    <div style={{ position: 'absolute', right: 44, top: 24, width: 42, height: 42, borderRadius: 21, background: colors.accent, opacity: 0.9 }} />
    <div style={{ position: 'absolute', left: -26, bottom: -34, width: 210, height: 120, background: colors.ink, opacity: 0.3, borderRadius: '58% 42% 0 0', transform: 'rotate(5deg)' }} />
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 66, height: 2, background: colors.paper, opacity: 0.7 }} />
  </div>
);

const MountainScene: FC = () => (
  <div style={{ position: 'relative', width: '100%', height: '100%', background: `linear-gradient(${colors.paper} 0%, ${colors.paperMuted} 68%, ${colors.accent} 100%)` }}>
    <svg width="100%" height="100%" viewBox="0 0 308 212" preserveAspectRatio="none">
      <polygon points="0,212 98,72 192,212" fill={colors.muted} opacity={0.55} />
      <polygon points="112,212 208,44 308,212" fill={colors.ink} opacity={0.32} />
      <rect x="0" y="148" width="308" height="28" fill={colors.paper} opacity={0.5} />
    </svg>
  </div>
);

const FootprintCard: FC<{
  label: string;
  date: string;
  delay: number;
  tilt: number;
  x: number;
  y: number;
  scene: 'sea' | 'mountain';
}> = ({ label, date, delay, tilt, x, y, scene }) => {
  const frame = useCurrentFrame() + 550; // 幕局部帧（与镜组件同基准，delay 600/680 逐字保真）
  return (
    <div style={{ position: 'absolute', left: x, top: y, ...polaroidLand(frame, delay, 130, tilt) }}>
      <div style={{ position: 'absolute', left: 14, top: 30, width: 312, height: 250, background: colors.ink, opacity: 0.13, filter: 'blur(22px)', borderRadius: 20 }} />
      <div style={{ position: 'relative', width: 336, background: colors.paper, borderRadius: 4, padding: 14, boxSizing: 'border-box' }}>
        <div style={{ width: 308, height: 212, overflow: 'hidden', ...photoDevelop(frame, delay) }}>{scene === 'sea' ? <SeaScene /> : <MountainScene />}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '14px 4px 0' }}>
          <span style={{ fontFamily: serif, fontSize: 21, color: colors.ink }}>{label}</span>
          <span style={{ fontFamily: mono, fontSize: 14, color: colors.muted }}>{date}</span>
        </div>
      </div>
    </div>
  );
};

const ShotFootprints: FC = () => {
  const frame = useCurrentFrame() + 550; // 幕局部帧（无钳制振荡器保相位 + 断点逐字保真）
  const drift = camDrift(frame);
  const dolly = interpolate(frame, [550, 800], [0, 0.06], { ...CLAMP, easing: CURVES.cineEaseInOut }); // 缓慢微推
  const ascend = interpolate(frame, [760, 800], [0, 1], { ...CLAMP, easing: CURVES.cineEaseOut }); // tr-photo-ascend（40f）
  const cam = { scale: 1 + dolly, x: drift.x, y: drift.y, rot: drift.rot, origin: '50% 48%' };
  return (
    <AbsoluteFill style={{ filter: `saturate(${grade.filter.saturate})` }}>
      <CameraRig cam={cam}>
        {/* 背景极淡的地图光点呼吸（glow-pulse 极淡档） */}
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} style={{ ...glowPulse(frame, 0.4, [80, 100, 120][i % 3]), position: 'absolute', left: 280 + ((i * 173) % 1340), top: 170 + ((i * 97) % 660) }}>
            <div style={{ position: 'absolute', left: -8, top: -8, width: 23 + (i % 3) * 2, height: 23 + (i % 3) * 2, borderRadius: '50%', background: colors.accent, opacity: 0.1, filter: 'blur(5px)' }} />
            <div style={{ width: 7 + (i % 3) * 2, height: 7 + (i % 3) * 2, borderRadius: '50%', background: colors.accent, opacity: 0.16 }} />
          </div>
        ))}
        {/* 照片与字幕：升散出画（translateY −60 + blur + fade） */}
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - ascend, transform: `translateY(${-60 * ascend}px)`, filter: `blur(${4 * ascend}px)` }}>
          <FootprintCard label="杨梅坑" date="2025-08-15" delay={600} tilt={-1.1} x={420} y={252} scene="sea" />
          <FootprintCard label="梧桐山" date="2025-09-20" delay={680} tilt={1.2} x={986} y={330} scene="mountain" />
          <p style={{ ...writeFade(frame, 700, true), position: 'absolute', left: 0, right: 0, bottom: 138, textAlign: 'center', fontFamily: serif, fontSize: 34, color: colors.ink, letterSpacing: '0.05em', margin: 0 }}>
            2025，网站沉默的那一年——他仍在认真地生活
          </p>
        </div>
        {/* 光尘升散（dust-ascend 暖变体，40 颗确定性粒子） */}
        {Array.from({ length: 40 }).map((_, i) => {
          const t0 = 762 + (i % 12) * 3;
          const p = interpolate(frame, [t0, t0 + 36], [0, 1], { ...CLAMP, easing: CURVES.cineEaseOut });
          if (p <= 0 || p >= 1) return null;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: 400 + ((i * 211) % 1120),
                top: 300 + ((i * 137) % 430) - 90 * p,
                width: 3 + (i % 3),
                height: 3 + (i % 3),
                borderRadius: '50%',
                background: i % 10 === 9 ? colors.paperMuted : colors.accent,
                opacity: (1 - p) * 0.8,
              }}
            />
          );
        })}
      </CameraRig>
      {/* 幕级常量 overlay（原 Act5 根层分解入镜，保持原渲染次序）：光尘 multiply 层 + grade LUT + veil */}
      <div style={{ position: 'absolute', inset: 0, mixBlendMode: 'multiply' }}>
        <DustField act={5} />
      </div>
      <AbsoluteFill style={{ background: grade.lut.color, mixBlendMode: grade.lut.blend, opacity: grade.lut.opacity }} />
      <AbsoluteFill style={{ background: grade.veil.color, mixBlendMode: grade.veil.blend, opacity: grade.veil.opacity }} />
    </AbsoluteFill>
  );
};

export default ShotFootprints;
