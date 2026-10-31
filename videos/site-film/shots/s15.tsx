/* 镜 15 · Act 3 重启与复燃 · 全局帧 [2610,2800) · 190f */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, GRADES, WHITE_FLASH } from '../motion-tokens';

const serif = fontFamilies.serif;
const mono = fontFamilies.mono;

const fade = (f: number, at: number) =>
  interpolate(f, [at, at + 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

/* 灯笼点亮 + 白闪涨满（原 ShotLaunch；【坐标保真】白闪断点 [940,990,996] 原以幕局部帧求值（=全局 2740→2796，镜内白闪实际发生于镜局部 130–186），
   卡片/文案入场断点 8+20i 亦为幕局部（原片首帧即全亮静态）；本镜 frame = useCurrentFrame() + 810（幕局部）逐帧复现原渲染；
   镜尾帧交接态：白场（WHITE_FLASH 涨满持有至切点，Act 4 从白释放） */
const ShotLaunch: FC = () => {
  const frame = useCurrentFrame() + 810; // 幕局部帧保真（见头注释）
  const pages = ['/', '/music', '/guestbook', '/footprint', '/topics', '/design', '/weread', '/about', 'wuh.site'];
  const white = interpolate(frame, [940, 990, 996], [0, 1, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.whiteFlashIn });
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 20 }}>
          {pages.map((p, i) => (
            <div key={p} style={{ width: 158, height: 220, borderRadius: 10, background: colors.bgLift, border: `1px solid ${colors.hairline}`, opacity: fade(frame, 8 + i * 20) * (1 - white), transform: `translateY(${(1 - spring({ frame: frame - (8 + i * 20), fps: 30, config: { damping: 200 } })) * 30}px)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: mono, fontSize: 16, color: colors.muted }}>{p}</span>
            </div>
          ))}
        </div>
        <p style={{ position: 'absolute', bottom: 200, fontFamily: serif, fontSize: 42, color: colors.paper, opacity: fade(frame, 60) * (1 - white) }}>
          2026.06.14 · 流量切换，正式上线
        </p>
        {/* 白闪涨满（跨切点：Act 4 从白释放） */}
        <AbsoluteFill style={{ background: WHITE_FLASH.color, opacity: white }} />
      </AbsoluteFill>
      {/* 幕级调色 veil（grade-seal-red · screen 0.1，Act3 全幕常量，跨镜拆分归入各镜，层级在内容之上） */}
      <AbsoluteFill style={{ background: GRADES[2].lut.color, mixBlendMode: 'screen', opacity: 0.1 }} />
    </AbsoluteFill>
  );
};

export default ShotLaunch;
