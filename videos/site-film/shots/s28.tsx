/* 镜 28 · Act 4 产品巡礼 · 全局帧 [4240,4360) · 120f */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, GRADES } from '../motion-tokens';
import { DustField } from '../components/DustField';

const serif = fontFamilies.serif;
const mono = fontFamilies.mono;

const fade = (f: number, at: number) =>
  interpolate(f, [at, at + 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

/* 足迹俯冲：cam-dive 落定（承接 27 俯冲）+ 双标记 ripple-bloom 绽开（错 8f）+
   照片九宫格 cascade + B 站角标；出场 tr-grid-scatter 九格向九方向化整为零（35f）
   （原 Act4 镜 28，幕局部 1440–1560 → 镜局部 0–120；const f = frame - 1440 换算为 const f = frame） */
const ShotFootprint: FC = () => {
  const frame = useCurrentFrame();
  const grade = GRADES[3];
  const f = frame; // 0–120
  const settle = interpolate(f, [0, 28], [1.42, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  const settleY = interpolate(f, [0, 28], [70, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  const scatter = interpolate(f, [85, 120], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  const marks: Array<[string, string, number, number, number]> = [
    ['梧桐山', '2025-09-20', 620, 330, 4],
    ['杨梅坑', '2025-08-15', 940, 470, 12],
  ];
  return (
    <AbsoluteFill>
      <DustField act={4} />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', transform: `scale(${settle}) translateY(${settleY}px)` }}>
        {/* 地图底：等高线圆环 */}
        <div style={{ position: 'absolute', left: 300, top: 120, width: 900, height: 680 }}>
          {[420, 330, 240, 150].map((r) => (
            <div key={r} style={{ position: 'absolute', left: 450 - r, top: 340 - r, width: r * 2, height: r * 2, borderRadius: r, border: `1px solid ${colors.hairline}` }} />
          ))}
        </div>
        {marks.map(([name, date, x, y, born]) => (
          <div key={name} style={{ position: 'absolute', left: x, top: y }}>
            {/* ripple-bloom 双环错 8f */}
            {[0, 8].map((off) => {
              const p = interpolate(f - born - off, [0, 24], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
              return <div key={off} style={{ position: 'absolute', left: -18, top: -18, width: 36, height: 36, borderRadius: 18, border: `2px solid ${colors.accent}`, opacity: f < born + off || p >= 1 ? 0 : 0.6 * (1 - p), transform: `scale(${0.2 + p * 2.8})` }} />;
            })}
            <div style={{ position: 'absolute', left: -7, top: -7, width: 14, height: 14, borderRadius: 7, background: colors.accent, boxShadow: `0 0 16px ${colors.accent}`, opacity: fade(f, born) }} />
            <div style={{ position: 'absolute', left: 16, top: -14, opacity: fade(f, born + 6) }}>
              <p style={{ fontFamily: serif, fontSize: 24, color: colors.paper, margin: 0, whiteSpace: 'nowrap' }}>{name}</p>
              <p style={{ fontFamily: mono, fontSize: 13, color: colors.muted, margin: '4px 0 0', whiteSpace: 'nowrap' }}>{date}</p>
            </div>
          </div>
        ))}
        {/* 照片九宫格（cascade 展开 → grid-scatter 散开，方向角均分） */}
        <div style={{ position: 'absolute', left: 170, top: 470, display: 'grid', gridTemplateColumns: 'repeat(3, 86px)', gap: 8 }}>
          {Array.from({ length: 9 }).map((_, i) => {
            const g = spring({ frame: f - (44 + i * 4), fps: 30, config: { damping: 200 } });
            const ang = ((i * 40 + 15) * Math.PI) / 180;
            return (
              <div key={i} style={{ position: 'relative', width: 86, height: 86, borderRadius: 8, background: i % 3 === 0 ? colors.paperDeep : colors.paperMuted, opacity: g * (1 - scatter), transform: `translate(${Math.cos(ang) * scatter * 120}px, ${Math.sin(ang) * scatter * 120}px) rotate(${(i % 2 ? 1 : -1) * scatter * 6}deg)` }}>
                {i === 4 ? <span style={{ position: 'absolute', right: 4, bottom: 4, fontFamily: mono, fontSize: 10, color: colors.bg, background: colors.accent, borderRadius: 4, padding: '1px 5px' }}>B 站</span> : null}
              </div>
            );
          })}
        </div>
        <div style={{ position: 'absolute', bottom: 84, width: '100%', textAlign: 'center' }}>
          <p style={{ fontFamily: serif, fontSize: 27, color: colors.paper, margin: 0, opacity: fade(f, 30) }}>上班就好好上班……下班了就好好生活，</p>
          <p style={{ fontFamily: serif, fontSize: 27, color: colors.paper, margin: '8px 0 0', opacity: fade(f, 44) }}>玩游戏、写代码、找朋友聊天，玩累了就看看书、写写字。此乐何极~</p>
        </div>
      </AbsoluteFill>
      {/* 幕级调色 overlay（原 Act4 全屏层分解入镜）：grade-warm-gold LUT + 雾光 */}
      <AbsoluteFill style={{ background: grade.lut.color, mixBlendMode: grade.lut.blend, opacity: grade.lut.opacity }} />
      <AbsoluteFill style={{ background: grade.veil.color, mixBlendMode: grade.veil.blend, opacity: grade.veil.opacity }} />
    </AbsoluteFill>
  );
};

export default ShotFootprint;
