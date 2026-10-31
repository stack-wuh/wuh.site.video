/* 镜 35 · Act 5 创作人文 · 全局帧 [5500,5600) · 100f */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, random, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, GRADES, writeFade } from '../motion-tokens';
import { DustField } from '../components/DustField';

const serif = fontFamilies.serif;

const CLAMP = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

const grade = GRADES[4]; // grade-warm-paper：幕级根层 saturate(0.95) 作为镜根 filter 带入（背景由 ShotShell 提供）

/* 坐标保真 + 冻结事实（幕局部基准 + localStart = 800）：
   ⚠️ flashOn 的三闪窗口写在镜局部数（20–26、40–46、≥60），但原码 `const local = frame` 以幕局部帧求值
   （local ∈ [800,900)）→ 前两窗完全落在求值域之外、`local >= 60` 恒真 → 原片本镜光标全程保持
   第三记亮起的终态（内芯 opacity 1、光晕 opacity 0.5），从未真实闪烁——这是已交付成片的真实渲染。
   按坐标保真红线逐帧复现：保留幕局部基准与全部字面量逐字不动，禁止改为镜局部基准
   （那会让 0–60f 真实三闪，属顺手修复动画）。
   dark [800,834]、pull [800,900]、dim [866,900]、write-fade delay 812、聚尘 [806+(i%6)*6, 896]
   均为幕局部在窗内断点，照原样播放；dim 终值 0.3 + 冻结亮起光标保持至 900 硬切入 Act 6。 */

/* ─── 光标承转（原 Act5 ShotCursorHandover，幕局部 800–900 逐字保留） ───
   converge-point 纵深灭点变体 + cam-dolly-out 缓慢后拉入暗 */
const ShotCursorHandover: FC = () => {
  const frame = useCurrentFrame() + 800; // 幕局部帧（flashOn 冻结事实 + 断点逐字保真）
  const local = frame;
  const dark = interpolate(frame, [800, 834], [0, 1], { ...CLAMP, easing: CURVES.cineEaseInOut }); // 纸底溶入黑暗
  const pull = interpolate(frame, [800, 900], [0, 1], { ...CLAMP, easing: CURVES.cineEaseInOut });
  const dim = interpolate(frame, [866, 900], [0, 0.3], CLAMP); // 缓慢入暗（溶解档）
  const flashOn = (local >= 20 && local < 26) || (local >= 40 && local < 46) || local >= 60;
  return (
    <AbsoluteFill style={{ filter: `saturate(${grade.filter.saturate})` }}>
      <AbsoluteFill style={{ background: colors.bg, opacity: dark }}>
        <AbsoluteFill style={{ transform: `scale(${1 - pull * 0.06})` }}>
          {/* converge-point（纵深灭点变体）：光尘向屏幕深处聚去 */}
          {Array.from({ length: 36 }).map((_, i) => {
            const sx = 960 + (random(`a5cx${i}`) - 0.5) * 1760;
            const sy = 540 + (random(`a5cy${i}`) - 0.5) * 1000;
            const p = interpolate(frame, [806 + (i % 6) * 6, 896], [0, 1], { ...CLAMP, easing: CURVES.cineEaseIn });
            const size = (2 + random(`a5cs${i}`) * 3) * (1 - p * 0.65);
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: sx + (960 - sx) * p,
                  top: sy + (486 - sy) * p,
                  width: size,
                  height: size,
                  borderRadius: '50%',
                  background: i % 10 === 9 ? colors.paperMuted : colors.accent,
                  opacity: 0.55 - p * 0.35,
                }}
              />
            );
          })}
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 38 }}>
            <p style={{ ...writeFade(frame, 812, true), fontFamily: serif, fontSize: 40, color: colors.paper, letterSpacing: '0.08em', margin: 0 }}>
              然后，他把这些热爱，写成了方法。
            </p>
            <div style={{ position: 'relative', width: 20, height: 30 }}>
              <div style={{ position: 'absolute', left: -15, top: -17, width: 50, height: 64, borderRadius: 25, background: colors.accent, opacity: flashOn ? 0.5 : 0.06, filter: 'blur(16px)' }} />
              <div style={{ position: 'relative', width: 20, height: 30, borderRadius: 3, background: colors.accent, opacity: flashOn ? 1 : 0.12 }} />
            </div>
          </div>
        </AbsoluteFill>
        <AbsoluteFill style={{ background: colors.bg, opacity: dim }} />
      </AbsoluteFill>
      {/* 幕级常量 overlay（原 Act5 根层分解入镜，保持原渲染次序）：光尘 multiply 层 + grade LUT + veil */}
      <div style={{ position: 'absolute', inset: 0, mixBlendMode: 'multiply' }}>
        <DustField act={5} />
      </div>
      <AbsoluteFill style={{ background: grade.lut.color, mixBlendMode: grade.lut.blend, opacity: grade.lut.opacity }} />
      <AbsoluteFill style={{ background: grade.veil.color, mixBlendMode: grade.veil.blend, opacity: grade.veil.opacity }} />
    </AbsoluteFill>
  );
};

export default ShotCursorHandover;
