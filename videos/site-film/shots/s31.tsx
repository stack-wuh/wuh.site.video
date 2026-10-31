/* 镜 31 · Act 4 产品巡礼 · 全局帧 [4580,4700) · 120f */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, GRADES, SEAL_RED, SPRINGS, paperBreathe, sealStamp, sealTilt, writeFade } from '../motion-tokens';
import { DustField } from '../components/DustField';

const serif = fontFamilies.serif;
const sans = fontFamilies.sans;
const RED = SEAL_RED; // 红晕（约束允许的例外色）
const FPS = 30; // 与全片一致（shots/manifest fps: 30）；镜文件不引视频配置 hook，fps 用常量

const fade = (f: number, at: number) =>
  interpolate(f, [at, at + 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

/* 联系钤印：纸卡 spring-pop 展开 + 8 社交图标围合 cascade + 22px 方形钤印落章（seal-stamp），
   cam-dolly-in 俯拍轻急推；red-blaze 晕起渐衰入暖纸（tr-blaze-spread 晕开变体，grade 交叉入 Act 5）
   （原 Act4 镜 31，幕局部 1780–1900 → 镜局部 0–120；const f = frame - 1780 换算为 const f = frame；
     paperBreathe 原直用幕局部帧 → paperBreathe(frame + 1780) 保相位；fps 由视频配置 hook 改为常量 30） */
const ShotContact: FC = () => {
  const frame = useCurrentFrame();
  const grade = GRADES[3];
  const f = frame; // 0–120
  const open = spring({ frame: f - 2, fps: FPS, config: SPRINGS.springPop });
  const dolly = interpolate(f, [0, 120], [1, 1.12], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const icons = ['微', 'GH', 'B', '豆', '邮', 'R', 'Q', '云'];
  const seal = sealStamp(f, 50, FPS, sealTilt('contact-2026'));
  // red-blaze：50 晕起 → 66 后 40f 渐衰且色温转暖（晕开入暖纸变体）
  const blazeRise = interpolate(f, [50, 66], [0, 0.8], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const blazeDecay = interpolate(f, [66, 120], [0.8, 0.12], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  const warmRise = interpolate(f, [70, 120], [0, 0.5], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  return (
    <AbsoluteFill>
      <DustField act={4} />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', transform: `scale(${dolly})` }}>
        {/* 8 社交图标围合 */}
        {icons.map((s, i) => {
          const theta = (i / icons.length) * Math.PI * 2 - Math.PI / 2;
          return (
            <div key={s} style={{ position: 'absolute', left: `calc(50% + ${Math.cos(theta) * 470}px)`, top: `calc(50% + ${Math.sin(theta) * 300}px)`, transform: 'translate(-50%,-50%)', ...writeFade(f, 6 + i * 6), width: 54, height: 54, borderRadius: 12, background: colors.bgLift, border: `1px solid ${colors.hairline}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: serif, fontSize: 20, color: colors.paper }}>{s}</span>
            </div>
          );
        })}
        {/* 纸卡（spring-pop 展开 + paper-breathe 呼吸） */}
        <div style={{ transform: `scale(${interpolate(open, [0, 1], [0.6, 1])})` }}>
          <div style={{ ...paperBreathe(frame + 1780), width: 600, borderRadius: 14, background: colors.paperDeep, padding: '46px 56px', textAlign: 'center' }}>
            <p style={{ fontFamily: serif, fontSize: 38, color: colors.ink, margin: 0 }}>代码写诗，工具作画</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18, justifyContent: 'center', marginTop: 20 }}>
              <div style={{ height: 1, width: 60, background: colors.ink, opacity: 0.2 }} />
              <p style={{ fontFamily: sans, fontSize: 18, color: colors.muted, margin: 0, letterSpacing: '0.15em' }}>开源是一种信仰</p>
              <div style={{ height: 1, width: 60, background: colors.ink, opacity: 0.2 }} />
            </div>
          </div>
        </div>
        {/* 22px 方形钤印落章 */}
        <div style={{ position: 'absolute', left: '58%', top: '58%', ...seal, width: 22, height: 22, background: colors.accent }} />
        {/* red-blaze 红晕 → 暖金晕（交叉入 Act 5 grade-warm-paper） */}
        <AbsoluteFill style={{ background: `radial-gradient(circle at 58% 58%, ${RED} 0%, transparent 62%)`, opacity: f < 66 ? blazeRise : blazeDecay, mixBlendMode: 'screen' }} />
        <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 52%, ${colors.accent} 0%, transparent 70%)`, opacity: warmRise, mixBlendMode: 'screen' }} />
      </AbsoluteFill>
      {/* 幕级调色 overlay（原 Act4 全屏层分解入镜）：grade-warm-gold LUT + 雾光 */}
      <AbsoluteFill style={{ background: grade.lut.color, mixBlendMode: grade.lut.blend, opacity: grade.lut.opacity }} />
      <AbsoluteFill style={{ background: grade.veil.color, mixBlendMode: grade.veil.blend, opacity: grade.veil.opacity }} />
    </AbsoluteFill>
  );
};

export default ShotContact;
