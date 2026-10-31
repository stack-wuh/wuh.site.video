/* 镜 27 · Act 4 产品巡礼 · 全局帧 [4120,4240) · 120f */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, GRADES } from '../motion-tokens';
import { CameraRig, ParallaxLayer } from '../components/CameraRig';
import type { CamState } from '../components/CameraRig';
import { DustField } from '../components/DustField';

const serif = fontFamilies.serif;
const sans = fontFamilies.sans;
const mono = fontFamilies.mono;

const fade = (f: number, at: number) =>
  interpolate(f, [at, at + 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

/* About 全家桶：热力图 heat-wave 逐格波浪点亮（col+row 波次）+ 广角 cam-pan + dof-parallax 板块视差；
   出场 tr-dive-through（scale 1→1.7 + translateY 冲向地图 + 前景 blur 冲屏）
   （原 Act4 镜 27，幕局部 1320–1440 → 镜局部 0–120；const f = frame - 1320 换算为 const f = frame） */
const ShotAbout: FC = () => {
  const frame = useCurrentFrame();
  const grade = GRADES[3];
  const f = frame; // 0–120
  const pan = interpolate(f, [0, 90], [90, -110], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const dive = interpolate(f, [90, 120], [1, 1.7], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseIn });
  const diveY = interpolate(f, [90, 120], [0, 190], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseIn });
  const fgBlur = interpolate(f, [114, 120], [0, 6], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const cam: CamState = { scale: dive, x: pan, y: diveY, rot: 0, origin: '78% 62%' };
  return (
    <AbsoluteFill>
      <DustField act={4} />
      <AbsoluteFill>
        <CameraRig cam={cam}>
          <ParallaxLayer depth={0.6} cam={cam} blurBase={1.5}>
            <div style={{ position: 'absolute', left: 220, top: 260, width: 520, height: 300, borderRadius: '50%', background: colors.paperMuted, opacity: 0.1, filter: 'blur(2px)' }} />
          </ParallaxLayer>
          <ParallaxLayer depth={1} cam={cam}>
            <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', filter: `blur(${fgBlur}px)` }}>
              <div style={{ display: 'flex', gap: 44, alignItems: 'flex-start' }}>
                {/* GitHub 资料行 + 平台卡 + 时间线筛选 */}
                <div style={{ width: 300 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 54, height: 54, borderRadius: 27, background: colors.accent }} />
                    <div>
                      <p style={{ fontFamily: mono, fontSize: 22, color: colors.paper, margin: 0 }}>wuhong</p>
                      <p style={{ fontFamily: mono, fontSize: 14, color: colors.muted, margin: '6px 0 0' }}>1,168 commits · 107 tags</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
                    {['GitHub', 'B 站', '豆瓣'].map((p) => (
                      <span key={p} style={{ fontFamily: mono, fontSize: 13, color: colors.muted, border: `1px solid ${colors.hairline}`, borderRadius: 10, padding: '4px 12px' }}>{p}</span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 18 }}>
                    {['全部', '按年', '按月'].map((t, i) => (
                      <span key={t} style={{ fontFamily: sans, fontSize: 13, color: i === 0 ? colors.accent : colors.muted, background: i === 0 ? colors.bgLift : undefined, borderRadius: 8, padding: '4px 12px', border: `1px solid ${colors.hairline}` }}>{t}</span>
                    ))}
                  </div>
                </div>
                {/* 10,330 逐格真数据热力图（heat-wave） */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(24, 20px)', gap: 4 }}>
                  {Array.from({ length: 24 * 7 }).map((_, i) => {
                    const col = i % 24;
                    const row = Math.floor(i / 24);
                    const g = spring({ frame: f - 4 - (col + row) * 0.9, fps: 30, config: { damping: 200 } });
                    const lit = (i * 7) % 10 < 7;
                    return <div key={i} style={{ width: 20, height: 20, borderRadius: 4, background: lit ? colors.accent : colors.paperMuted, opacity: g * (lit ? 0.35 + ((i * 13) % 10) / 16 : 0.2), transform: `scaleY(${interpolate(g, [0, 1], [0.2, 1])})` }} />;
                  })}
                </div>
                {/* 380px 足迹地图 */}
                <div style={{ position: 'relative', width: 300, height: 260, borderRadius: 14, background: colors.bgLift, border: `1px solid ${colors.hairline}` }}>
                  {[[90, 70], [190, 140], [130, 200]].map(([x, y], i) => (
                    <div key={i} style={{ position: 'absolute', left: x, top: y, width: 12, height: 12, borderRadius: 6, background: colors.accent, opacity: fade(f, 50 + i * 14), boxShadow: `0 0 12px ${colors.accent}` }} />
                  ))}
                  <p style={{ position: 'absolute', left: 18, bottom: 12, fontFamily: mono, fontSize: 13, color: colors.muted, margin: 0 }}>足迹 · 380px</p>
                </div>
              </div>
            </AbsoluteFill>
          </ParallaxLayer>
        </CameraRig>
        <p style={{ position: 'absolute', bottom: 96, width: '100%', textAlign: 'center', fontFamily: serif, fontSize: 34, color: colors.paper, opacity: fade(f, 26) * (1 - interpolate(f, [104, 116], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })) }}>10,330 次活动 · 365 天 · 逐格真实</p>
      </AbsoluteFill>
      {/* 幕级调色 overlay（原 Act4 全屏层分解入镜）：grade-warm-gold LUT + 雾光 */}
      <AbsoluteFill style={{ background: grade.lut.color, mixBlendMode: grade.lut.blend, opacity: grade.lut.opacity }} />
      <AbsoluteFill style={{ background: grade.veil.color, mixBlendMode: grade.veil.blend, opacity: grade.veil.opacity }} />
    </AbsoluteFill>
  );
};

export default ShotAbout;
