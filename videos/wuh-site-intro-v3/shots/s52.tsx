/* S52 · Act 8 此刻 · 局部帧 [0,144) · 144f · 绝对 7048–7192
 *
 * 方法论：波形淡出为工作流成文页面（#172 纸面 Remotion 重绘）；
 * proposal → discuss → apply → review → archive → commit 六阶段横向排开
 * 如传送带缓慢左移（10–120）；金句两段式落定——前半「不是当加速器」先出
 * （36），后半「边界和刹车」压轴（86）；落定即凝住。
 * 转场：入「切」，出「切」。字幕安全窗：start≥12、end≤132。
 * 尾帧：金句占满主位、六阶段沉为底纹。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, writeFade } from '../../../brand/motion';
import { CameraRig } from '../components/CameraRig';
import { Caption } from '../components/Caption';
import { DustField } from '../components/DustField';
import { Grade } from '../components/Grade';
import { PaperGrain } from '../components/PaperGrain';

const TOTAL = 144;
const STAGES = ['proposal', 'discuss', 'apply', 'review', 'archive', 'commit'];

const S52: FC = () => {
  const frame = useCurrentFrame();
  const beltX = interpolate(frame, [10, 120], [0, -260], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const dim = interpolate(frame, [60, 110], [0, 0.6], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const cam = { scale: 1.03, x: 0, y: 0, rot: 0 };
  const half1 = writeFade(frame, 36, true);
  const half2 = writeFade(frame, 86, true);

  return (
    <AbsoluteFill style={{ background: colors.paper }}>
      <CameraRig cam={cam}>
        <AbsoluteFill>
          <DustField act={8} count={14} seedBase="s52" />
          {/* 文章纸面骨架（#172 Remotion 重绘） */}
          <div style={{ position: 'absolute', left: 170, top: 80, right: 170, bottom: 80, borderRadius: 6, background: colors.paperDeep, border: `1px solid ${colors.paperMuted}` }}>
            <div style={{ position: 'absolute', left: 60, top: 40, fontFamily: fontFamilies.mono, fontSize: 18, color: colors.muted, opacity: 0.7 }}>#172 · Vibe Coding Workflow 概述 · 2026-10-07</div>
            <div style={{ position: 'absolute', left: 60, right: 60, top: 96, height: 1, background: colors.muted, opacity: 0.35 }} />
            {/* 六阶段传送带 */}
            <div style={{ position: 'absolute', left: 120, top: 170, transform: `translateX(${beltX}px)`, display: 'flex', gap: 40 }}>
              {STAGES.map((s, i) => (
                <div key={s} style={{ textAlign: 'center' }}>
                  <div style={{ width: 130, height: 60, borderRadius: 6, border: `1px solid ${colors.muted}`, background: colors.paper, opacity: 0.9, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontFamily: fontFamilies.mono, fontSize: 20, color: colors.ink, opacity: 0.8 }}>{s}</span>
                  </div>
                  {i < 5 ? <span style={{ position: 'absolute', right: -32, top: 22, fontFamily: fontFamilies.mono, fontSize: 18, color: colors.muted }}>→</span> : null}
                </div>
              ))}
            </div>
            {/* 金句两段式落定 */}
            <div style={{ position: 'absolute', left: 120, right: 120, top: 400, zIndex: 30 }}>
              <div style={{ ...half1, marginBottom: 20 }}>
                <span style={{ fontFamily: fontFamilies.serif, fontSize: 56, color: colors.ink }}>『工作流存在的意义不是当加速器，</span>
              </div>
              <div style={half2}>
                <span style={{ fontFamily: fontFamilies.serif, fontSize: 56, color: colors.ink }}>而是给 AI 装上边界和刹车。』</span>
              </div>
            </div>
            {/* 六阶段沉为底纹 */}
            <AbsoluteFill style={{ background: colors.paper, opacity: dim, pointerEvents: 'none' }} />
          </div>
        </AbsoluteFill>
      </CameraRig>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 300, backgroundImage: `linear-gradient(180deg, transparent, ${colors.bg})`, opacity: 0.18 }} />
      <PaperGrain opacity={0.06} />
      <Grade id="GR-02" />
      <Caption text="十月，他写道：『工作流存在的意义不是当加速器，而是给 AI 装上边界和刹车。』" appearAt={14} />
    </AbsoluteFill>
  );
};

export default S52;
