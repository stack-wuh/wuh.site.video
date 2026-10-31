/* 镜 29 · Act 4 产品巡礼 · 全局帧 [4360,4470) · 110f */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, GRADES, SEAL_RED, inkRise } from '../motion-tokens';
import { DustField } from '../components/DustField';

const serif = fontFamilies.serif;
const sans = fontFamilies.sans;
const mono = fontFamilies.mono;
const RED = SEAL_RED; // 红晕（约束允许的例外色）

const fade = (f: number, at: number) =>
  interpolate(f, [at, at + 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

/* 主题换装：酒红/素雅分屏 A/B + 全阶色卡 cascade + hover-dye 换色 A/B + 「试墨」drag-follow 游走，
   cam-truck 微甩变体（首尾 6f blur 脉冲）；出场 tr-band-sweep 色带全屏横扫
   （原 Act4 镜 29，幕局部 1560–1670 → 镜局部 0–110；const f = frame - 1560 换算为 const f = frame） */
const ShotTheme: FC = () => {
  const frame = useCurrentFrame();
  const grade = GRADES[3];
  const f = frame; // 0–110
  const whip = interpolate(f, [0, 110], [-70, 70], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const blurIn = interpolate(f, [0, 6], [3, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const blurOut = interpolate(f, [104, 110], [0, 3], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const band = interpolate(f, [80, 110], [-100, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseIn });
  // 「试墨」块预烘焙轨迹（drag-follow 手感：缓动跟随 + 低幅游移）
  const inkX = interpolate(f, [12, 96], [210, 690], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }) + Math.sin(f / 7) * 6;
  const inkY = 66 + Math.sin(f / 11) * 26;
  return (
    <AbsoluteFill>
      <DustField act={4} />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', transform: `translateX(${whip}px)`, filter: `blur(${Math.max(blurIn, blurOut)}px)` }}>
        <div style={{ display: 'flex', gap: 26 }}>
          {/* A 酒红 */}
          <div style={{ width: 430, height: 300, borderRadius: 16, background: colors.bgLift, border: `1px solid ${colors.hairline}`, padding: '38px 44px' }}>
            <p style={{ fontFamily: serif, fontSize: 46, color: RED, margin: 0 }}>酒红</p>
            <p style={{ fontFamily: sans, fontSize: 18, color: colors.muted, marginTop: 16, letterSpacing: '0.2em' }}>暗 · 跟随系统</p>
            <div style={{ width: 88, height: 30, borderRadius: 15, background: colors.bg, border: `1px solid ${colors.hairline}`, marginTop: 24, position: 'relative' }}>
              <div style={{ position: 'absolute', right: 3, top: 3, width: 22, height: 22, borderRadius: 11, background: RED }} />
            </div>
          </div>
          {/* B 素雅 */}
          <div style={{ width: 430, height: 300, borderRadius: 16, background: colors.paper, padding: '38px 44px' }}>
            <p style={{ fontFamily: serif, fontSize: 46, color: colors.ink, margin: 0 }}>素雅</p>
            <p style={{ fontFamily: sans, fontSize: 18, color: colors.muted, marginTop: 16, letterSpacing: '0.2em' }}>明 · 日光纸色</p>
            <div style={{ width: 88, height: 30, borderRadius: 15, background: colors.paperDeep, marginTop: 24, position: 'relative' }}>
              <div style={{ position: 'absolute', left: 3, top: 3, width: 22, height: 22, borderRadius: 11, background: colors.accent }} />
            </div>
          </div>
        </div>
        {/* 100–900 全阶色卡（stagger 展开 + 换色 A/B：f=40 起逐卡由琥珀渡向酒红） */}
        <div style={{ display: 'flex', gap: 10, marginTop: 34 }}>
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} style={{ ...inkRise(f, 6 + i * 4), position: 'relative', width: 84, height: 96, borderRadius: 8, background: colors.accent, overflow: 'hidden' }}>
              <div style={{ position: 'absolute', inset: 0, background: RED, opacity: interpolate(f, [40 + i * 2, 50 + i * 2], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }} />
              <span style={{ position: 'absolute', left: 0, right: 0, bottom: 6, textAlign: 'center', fontFamily: mono, fontSize: 12, color: colors.bg }}>{(i + 1) * 100}</span>
            </div>
          ))}
        </div>
        {/* 试墨块 */}
        <div style={{ position: 'absolute', left: inkX, top: inkY, width: 48, height: 48, borderRadius: 10, background: colors.accent, boxShadow: `0 6px 18px ${colors.bg}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontFamily: serif, fontSize: 16, color: colors.bg }}>试墨</span>
        </div>
        <p style={{ position: 'absolute', bottom: 88, width: '100%', textAlign: 'center', fontFamily: serif, fontSize: 32, color: colors.paper, opacity: fade(f, 24) * (1 - band / 100) }}>换一种墨色，换一种心情</p>
        {/* tr-band-sweep：色带横扫（translateX −100%→0，cine-ease-in） */}
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(90deg, ${RED}, ${colors.accent}, ${colors.paperMuted})`, transform: `translateX(${band}%)` }} />
      </AbsoluteFill>
      {/* 幕级调色 overlay（原 Act4 全屏层分解入镜）：grade-warm-gold LUT + 雾光 */}
      <AbsoluteFill style={{ background: grade.lut.color, mixBlendMode: grade.lut.blend, opacity: grade.lut.opacity }} />
      <AbsoluteFill style={{ background: grade.veil.color, mixBlendMode: grade.veil.blend, opacity: grade.veil.opacity }} />
    </AbsoluteFill>
  );
};

export default ShotTheme;
