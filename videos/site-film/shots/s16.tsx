/* 镜 16 · Act 4 产品巡礼 · 全局帧 [2800,2920) · 120f */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, GRADES, WHITE_FLASH, glowPulse, inkRise, writeFade } from '../motion-tokens';
import { CameraRig, ParallaxLayer } from '../components/CameraRig';
import type { CamState } from '../components/CameraRig';
import { DustField } from '../components/DustField';

const serif = fontFamilies.serif;
const sans = fontFamilies.sans;
const mono = fontFamilies.mono;

const fade = (f: number, at: number) =>
  interpolate(f, [at, at + 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

/* 首页全景：cam-crane 纵向下移巡阅，板块 ink-rise 依次入画，tr-cursor-lead 光标牵引收尾
   （原 Act4 镜 16，幕局部 0–120 = 镜局部 0–120，帧字面量零平移） */
const REPOS: Array<[string, string, number]> = [
  ['wuh.site', 'TypeScript', 128],
  ['ink-flow', 'Rust', 64],
  ['shadow-workflow', 'Go', 96],
];

const ShotHome: FC = () => {
  const frame = useCurrentFrame();
  const grade = GRADES[3];
  // tr-white-flash 跨切点收尾（原 Act 包裹层 overlay，覆盖幕局部 [0,12) ⊂ 本镜，归入并置顶）：
  // 2800 剪点后 12f cine-ease-out 释放（涨满段在 Act 3 镜 15）
  const white = interpolate(frame, [0, 12], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  const cam: CamState = {
    scale: 1.06,
    x: 0,
    y: interpolate(frame, [0, 120], [-70, 60], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }),
    rot: 0,
  };
  // tr-cursor-lead：光标沿路径滑向时间轴首点（100–115），落点亮起 glow-pulse 一记
  const lead = interpolate(frame, [100, 115], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const curX = interpolate(lead, [0, 1], [760, 496]);
  const curY = interpolate(lead, [0, 1], [320, 470]);
  const dotGlow = glowPulse(frame - 108, 1, 60).opacity ?? 1;
  return (
    <AbsoluteFill>
      <DustField act={4} />
      <AbsoluteFill>
        <CameraRig cam={cam}>
          <ParallaxLayer depth={0.5} cam={cam} blurBase={2}>
            <DustField act={4} count={22} />
          </ParallaxLayer>
          <ParallaxLayer depth={1} cam={cam}>
            <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
              <div style={{ width: 940 }}>
                <h1 style={{ ...inkRise(frame, 2), fontFamily: serif, fontSize: 64, color: colors.paper, margin: 0 }}>wuh.site · 朝朝如念</h1>
                <div style={{ ...writeFade(frame, 14), display: 'flex', alignItems: 'center', gap: 18, margin: '26px 0' }}>
                  <div style={{ height: 1, flex: 1, background: colors.hairline }} />
                  <div style={{ width: 12, height: 12, background: colors.accent, transform: 'rotate(45deg)' }} />
                  <div style={{ height: 1, flex: 1, background: colors.hairline }} />
                </div>
                {/* 墨点时间轴（首枚点位亮） */}
                <div style={{ position: 'relative', height: 12, marginTop: 10 }}>
                  <div style={{ position: 'absolute', top: 5, left: 0, right: 0, height: 1, background: colors.hairline }} />
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} style={{ position: 'absolute', left: 4 + i * 46, top: i === 0 ? 1 : 2, width: i === 0 ? 10 : 8, height: i === 0 ? 10 : 8, borderRadius: 5, background: i === 0 ? colors.accent : colors.muted, opacity: fade(frame, 20 + i * 4) * (i === 0 ? dotGlow : 1) }} />
                  ))}
                </div>
                {/* 精选项目卡（仓库名 + 语言 + ☆N） */}
                <div style={{ display: 'flex', gap: 22, marginTop: 38 }}>
                  {REPOS.map(([name, lang, star], i) => (
                    <div key={name} style={{ ...inkRise(frame, 30 + i * 12), flex: 1, background: colors.bgLift, border: `1px solid ${colors.hairline}`, borderRadius: 12, padding: '20px 24px' }}>
                      <p style={{ fontFamily: mono, fontSize: 20, color: colors.paper, margin: 0 }}>{name}</p>
                      <p style={{ fontFamily: mono, fontSize: 15, color: colors.muted, marginTop: 12 }}>
                        <span style={{ color: colors.accent }}>●</span> {lang}　☆ {star}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </AbsoluteFill>
          </ParallaxLayer>
        </CameraRig>
        <div style={{ position: 'absolute', left: curX, top: curY, width: 14, height: 14, borderRadius: 7, background: colors.accent, boxShadow: `0 0 18px ${colors.accent}`, opacity: fade(frame, 96) }} />
        <p style={{ position: 'absolute', bottom: 110, width: '100%', textAlign: 'center', fontFamily: serif, fontSize: 34, color: colors.paper, opacity: fade(frame, 46) }}>一座用代码写成的小院</p>
        <p style={{ position: 'absolute', bottom: 72, width: '100%', textAlign: 'center', fontFamily: sans, fontSize: 18, color: colors.accent, letterSpacing: '0.2em', opacity: fade(frame, 60) }}>开源是一种信仰</p>
      </AbsoluteFill>
      {/* 幕级调色 overlay（原 Act4 全屏层分解入镜）：grade-warm-gold LUT + 雾光 */}
      <AbsoluteFill style={{ background: grade.lut.color, mixBlendMode: grade.lut.blend, opacity: grade.lut.opacity }} />
      <AbsoluteFill style={{ background: grade.veil.color, mixBlendMode: grade.veil.blend, opacity: grade.veil.opacity }} />
      <AbsoluteFill style={{ background: WHITE_FLASH.color, opacity: white }} />
    </AbsoluteFill>
  );
};

export default ShotHome;
