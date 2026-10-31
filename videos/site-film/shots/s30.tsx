/* 镜 30 · Act 4 产品巡礼 · 全局帧 [4470,4580) · 110f */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, GRADES } from '../motion-tokens';
import { DustField } from '../components/DustField';

const serif = fontFamilies.serif;
const mono = fontFamilies.mono;

const fade = (f: number, at: number) =>
  interpolate(f, [at, at + 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

/* 全站漫游：页面序列四连击（原幕局部 1680/1700/1720/1740 → 镜局部 10/30/50/70）+
   .reveal 元素书写显现（entry 0→35%）+ 高速 cam-dolly-in + 三语标识 glitch-flick 低振幅；
   出场 tr-soft-bloom（非白闪，D-3：brightness 正脉冲 1→1.6→1）
   （原 Act4 镜 30，幕局部 1670–1780 → 镜局部 0–110；const f = frame - 1670 换算为 const f = frame） */
const writeReveal = (f: number, at: number) =>
  interpolate(f, [at, at + 10], [0, 35], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

const ShotRoam: FC = () => {
  const frame = useCurrentFrame();
  const grade = GRADES[3];
  const f = frame; // 0–110
  const dolly = interpolate(f, [0, 110], [1, 1.5], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseIn });
  const bloom = interpolate(f, [95, 103, 110], [1, 1.6, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseIn });
  const pages = ['/', '/music', '/guestbook', '/footprint', '/topics'];
  return (
    <AbsoluteFill>
      <DustField act={4} />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', transform: `scale(${dolly})`, filter: `brightness(${bloom})` }}>
        <div style={{ display: 'flex', gap: 24 }}>
          {pages.map((p, i) => {
            const born = i === 0 ? 2 : 10 + i * 20; // 镜局部 10/30/50/70 四连击（全片 4480/4500/4520/4540）
            const inP = spring({ frame: f - born, fps: 30, config: { damping: 200 } });
            const flick = Math.floor(f / 3) % 7 === 0;
            return (
              <div key={p} style={{ width: 190, height: 260, borderRadius: 12, background: colors.bgLift, border: `1px solid ${colors.hairline}`, opacity: inP, transform: `translateY(${(1 - inP) * 30}px) scale(${0.86 + inP * 0.14})`, padding: '20px 18px', position: 'relative' }}>
                <p style={{ fontFamily: mono, fontSize: 15, color: colors.accent, margin: 0 }}>{p}</p>
                {[0, 1, 2, 3].map((l) => (
                  <div key={l} style={{ height: 7, width: `${writeReveal(f, born + 6 + l * 5)}%`, background: colors.paperMuted, opacity: 0.4, borderRadius: 4, marginTop: 12 }} />
                ))}
                {i === pages.length - 1 ? (
                  <span style={{ position: 'absolute', right: 10, bottom: 10, fontFamily: mono, fontSize: 11, color: colors.muted, opacity: flick ? 0.35 : 1, transform: `translateX(${flick ? -2 : 0}px)` }}>中 / EN / 日</span>
                ) : null}
              </div>
            );
          })}
        </div>
        <p style={{ position: 'absolute', bottom: 100, width: '100%', textAlign: 'center', fontFamily: serif, fontSize: 32, color: colors.paper, opacity: fade(f, 26) }}>每一页，都在呼吸</p>
      </AbsoluteFill>
      {/* 幕级调色 overlay（原 Act4 全屏层分解入镜）：grade-warm-gold LUT + 雾光 */}
      <AbsoluteFill style={{ background: grade.lut.color, mixBlendMode: grade.lut.blend, opacity: grade.lut.opacity }} />
      <AbsoluteFill style={{ background: grade.veil.color, mixBlendMode: grade.veil.blend, opacity: grade.veil.opacity }} />
    </AbsoluteFill>
  );
};

export default ShotRoam;
