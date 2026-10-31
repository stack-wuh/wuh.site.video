/* 镜 14 · Act 3 重启与复燃 · 全局帧 [2420,2610) · 190f */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, GRADES, sealStamp, sealTilt } from '../motion-tokens';

const serif = fontFamilies.serif;

const fade = (f: number, at: number) =>
  interpolate(f, [at, at + 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

/* 钤印落章 + 10,330 光毯复燃（原 ShotReignite；【坐标保真】原镜断点（blaze [0,24,90]、camOut/crane [40,190]）以幕局部帧求值
   → 原片窗口起点即已全部完成，交付态为定格终态（钤印定着/光毯平复/热力图落定）；
   fps 取影片 30（manifest fps=30，等价原视频配置读取——镜文件禁用该 API，故以常量替换）；镜尾帧交接态：光毯已平复、钤印定着） */
const ShotReignite: FC = () => {
  const frame = useCurrentFrame() + 620; // 幕局部帧保真（见头注释）
  const fps = 30;
  const seal = sealStamp(frame, 0, fps, sealTilt('restart-2026'));
  const blaze = interpolate(frame, [0, 24, 90], [0, 0.85, 0.4], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const camOut = interpolate(frame, [40, 190], [1.35, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const crane = interpolate(frame, [40, 190], [30, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <AbsoluteFill style={{ transform: `translateY(${crane}px) scale(${camOut})` }}>
          <div style={{ display: 'flex', gap: 5, justifyContent: 'center' }}>
            {Array.from({ length: 26 }).map((_, w) => (
              <div key={w} style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {Array.from({ length: 7 }).map((_, d) => {
                  const ripple = spring({ frame: frame - (10 + (w + d) * 2), fps, config: { damping: 200 } });
                  return <div key={d} style={{ width: 24, height: 24, borderRadius: 5, background: (w + d) % 4 > 1 ? colors.accent : colors.paperMuted, opacity: interpolate(ripple, [0, 1], [0.08, (w + d) % 4 > 1 ? 0.9 : 0.35]), transform: `scale(${ripple})` }} />;
                })}
              </div>
            ))}
          </div>
        </AbsoluteFill>
        {/* 红光晕染 */}
        <AbsoluteFill style={{ background: `radial-gradient(circle, ${GRADES[2].lut.color} 0%, transparent 65%)`, opacity: blaze * 0.8, mixBlendMode: 'screen' }} />
        {/* 钤印 */}
        <div style={{ position: 'absolute', left: '58%', top: '52%', width: 46, height: 46, background: colors.accent, boxShadow: `0 0 ${40 * blaze}px ${colors.accent}`, ...seal }} />
        <p style={{ position: 'absolute', bottom: 140, fontFamily: serif, fontSize: 40, color: colors.paper, opacity: fade(frame, 60) }}>
          10,330 次活动 · 365 天逐日真实
        </p>
      </AbsoluteFill>
      {/* 幕级调色 veil（grade-seal-red · screen 0.1，Act3 全幕常量，跨镜拆分归入各镜，层级在内容之上） */}
      <AbsoluteFill style={{ background: GRADES[2].lut.color, mixBlendMode: 'screen', opacity: 0.1 }} />
    </AbsoluteFill>
  );
};

export default ShotReignite;
