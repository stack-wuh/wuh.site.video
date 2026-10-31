/* 镜 04 · Act 2 起步与沉默 · 全局帧 [700,880) · 180f */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, GRADES } from '../motion-tokens';

const serif = fontFamilies.serif;
const mono = fontFamilies.mono;

const fade = (f: number, at: number) =>
  interpolate(f, [at, at + 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

/* 第一行代码：终端打字（原 ShotFirstCode；localStart 0，幕局部 [0,180) 与镜局部 [0,180) 重合，
   断点 scale [0,180]、打字 f/2.5、光标 f/10、fade 100/110 全部落在镜窗内且逐帧活跃
   → 镜局部帧基准，逐帧等价原片。镜根 filter: saturate(0.55) 为原 Act2 根滤镜（grade-ash-grey），
   覆盖内容与幕级调色层；根背景色由装配层 ShotShell 提供，故不在此声明。 */
const ShotFirstCode: FC = () => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, 180], [1, 1.1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  return (
    <AbsoluteFill style={{ filter: 'saturate(0.55)' }}>
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
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
      </AbsoluteFill>
      {/* 幕级调色 veil（grade-ash-grey · multiply 0.45 + screen 0.08，Act2 全幕常量，跨镜拆分归入各镜，层级在内容之上） */}
      <AbsoluteFill style={{ background: GRADES[1].lut.color, mixBlendMode: 'multiply', opacity: 0.45 }} />
      <AbsoluteFill style={{ background: GRADES[1].veil.color, mixBlendMode: 'screen', opacity: 0.08 }} />
    </AbsoluteFill>
  );
};

export default ShotFirstCode;
