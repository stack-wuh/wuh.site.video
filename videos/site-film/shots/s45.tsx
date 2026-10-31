/* 镜 45 · Act 7 向好与落版 · 全局帧 [7030,7200) · 170f */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, GRADES, TYPE, WARM_GOLD, sealStamp, sealTilt } from '../motion-tokens';
import { DustField } from '../components/DustField';

const serif = fontFamilies.serif;

const CLAMP = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const GOLD = WARM_GOLD; // 暖金光尘（DUST 7）

/* 镜 45（7030–7200）：墨晕成字（7050–7080）+ 打字机快书 3f/字（7080–7143）+ 钤印 22px（7150）
   + gold-drift 环绕渐暗 + bloom-glow 收束；tr-fade-black-final 在 Act 层（7130–7200）合流 */
const MOTTO = '写作是抵抗遗忘的方式，代码是构建世界的语言。';

const ShotFinale: FC = () => {
  const frame = useCurrentFrame(); // 镜局部帧（0 = 幕局 480 = 全局 7030）
  const local = frame; // 原 frame − ANCHORS.inkDrop（7030 = 落版私有网格原点），镜局化后即 frame
  const bloom = interpolate(local, [0, 20], [0, 1], { ...CLAMP, easing: CURVES.cineEaseOut });
  const word = interpolate(local, [20, 50], [0, 1], { ...CLAMP, easing: CURVES.cineEaseOut });
  const chars = Math.min(MOTTO.length, Math.max(0, Math.floor((local - 50) / TYPE.fast)));
  const seal = sealStamp(frame, 120, 30, sealTilt('wuh.site-finale')); // 全局 7150 = 镜局 120；fps 30（@30fps，见 manifest）
  const glowOut = interpolate(local, [128, 166], [1, 0], { ...CLAMP, easing: CURVES.cineEaseInOut });
  /* ── 幕级 overlay（自 Act7 return 分解，断点帧平移 −480；尾帧交接层归本镜） ── */
  const sat = interpolate(local, [-480, -360], [1, 0.8], CLAMP);
  const bri = interpolate(local, [-480, -360, 100, 170], [1, 0.85, 0.85, 0], CLAMP);
  const dustO = interpolate(local, [-480, -130, -10, 80, 150], [0.85, 0.85, 0.15, 0.5, 0], CLAMP); // 光尘收拢至 0
  const blackMul = interpolate(local, [-480, 20], [0, 0.5], CLAMP);
  const blackVeil = interpolate(local, [0, 170], [0, 0.4], CLAMP);
  const aperture = interpolate(local, [100, 170], [0, 1], { ...CLAMP, easing: CURVES.cineEaseInOut }); // 终幕渐黑（纯色渐变，规避全屏动画 radial 崩溃）
  const lastBlack = interpolate(local, [135, 170], [0, 1], { ...CLAMP, easing: CURVES.cineEaseIn });
  return (
    <AbsoluteFill style={{ filter: `saturate(${sat}) brightness(${bri})` }}>
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          {/* gold-drift 环绕光尘（渐暗） */}
          {Array.from({ length: 14 }).map((_, i) => {
            const a = ((i * 25.7 + local * 0.5) * Math.PI) / 180;
            const x = 960 + Math.cos(a) * (400 + (i % 3) * 110);
            const y = 512 + Math.sin(a) * (190 + (i % 4) * 48);
            const size = 2 + (i % 3);
            return <div key={i} style={{ position: 'absolute', left: x, top: y, width: size, height: size, borderRadius: size / 2, background: GOLD, opacity: word * (0.18 + 0.14 * Math.sin(local / 9 + i)) * (0.3 + 0.7 * glowOut) }} />;
          })}
          {/* ink-bloom 墨晕触纸 → 晕成标题 */}
          <div
            style={{
              position: 'absolute',
              left: 960,
              top: 552,
              width: 320,
              height: 320,
              borderRadius: '50%',
              transform: `translate(-50%, -50%) scale(${0.3 + bloom * 1.4})`,
              background: 'radial-gradient(circle, ${GRADES[6].lut.color} 30%, rgba(22,19,15,0.5) 55%, transparent 75%)',
              opacity: 0.7 * (1 - word * 0.88),
            }}
          />
          {/* bloom-glow 收束 */}
          <AbsoluteFill style={{ background: 'radial-gradient(circle at 50% 47%, rgba(233,217,174,0.4), transparent 55%)', opacity: word * 0.3 * glowOut, transform: `scale(${1 - (1 - glowOut) * 0.3})` }} />
          <div style={{ position: 'relative', textAlign: 'center', transform: `translateY(-30px) scale(${1 + (1 - word) * 0.14})`, opacity: word, filter: `blur(${(1 - word) * 7}px)` }}>
            <h1 style={{ fontFamily: serif, fontSize: 78, color: colors.paper, margin: 0, letterSpacing: '0.04em' }}>wuh.site · 朝朝如念</h1>
            <p style={{ fontFamily: serif, fontSize: 30, color: colors.paperMuted, marginTop: 48, minHeight: 44, letterSpacing: '0.05em' }}>
              {MOTTO.slice(0, chars)}
              {chars > 0 && chars < MOTTO.length ? <span style={{ display: 'inline-block', width: 3, height: 28, marginLeft: 6, background: colors.accent, opacity: Math.floor(frame / 3) % 2 ? 1 : 0.15 }} /> : null}
            </p>
          </div>
          {/* 钤印 22px 落定（右下） */}
          <div style={{ position: 'absolute', left: 1268, top: 648, width: 22, height: 22, background: colors.accent, boxShadow: `0 0 ${20 * glowOut + 6}px ${colors.accent}`, ...seal }} />
        </AbsoluteFill>
      </AbsoluteFill>
      <div style={{ opacity: dustO }}>
        <DustField act={7} />
      </div>
      {/* grade-fade-black 回收至墨黑（幕局 [0,500) 跨四镜，本镜段 [−480,20)） */}
      <AbsoluteFill style={{ background: GRADES[6].lut.color, mixBlendMode: 'multiply', opacity: blackMul }} />
      <AbsoluteFill style={{ background: GRADES[6].veil.color, opacity: blackVeil }} />
      {/* tr-fade-black-final 光圈收缩渐黑（全局 7130–7200 = 镜局 [100,170]，终击 7200 全黑） */}
      <AbsoluteFill style={{ background: GRADES[6].lut.color, opacity: aperture }} />
      <AbsoluteFill style={{ background: GRADES[6].lut.color, opacity: lastBlack }} />
    </AbsoluteFill>
  );
};

export default ShotFinale;
