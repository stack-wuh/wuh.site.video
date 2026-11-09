/* S07 · Act 2 旧屋 · 局部帧 [0,120) · 120f · 绝对 852–972
 *
 * 自我注脚：旧站页面一角，一枚朱红闲章按下（落定 48=绝对 900=拍45，6f），
 * 印面「代码写诗，工具作画。」两行小楷；印泥边缘微毛，章旁页面元素轻轻避让
 * （906–926 → 局部 54–74 微移 6px）；极缓后拉露整页。
 * 题眼同文同层：字幕即印面文字，不另设 Caption。
 * 转场：入「墨洇」（20f），出「墨洇」（下一镜 inbound）。
 * 尾帧：闲章冻帧，朱色未干（余晕）。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, sealStamp, sealTilt } from '../../../brand/motion';
import { CameraRig } from '../components/CameraRig';
import { DustField } from '../components/DustField';
import { Grade } from '../components/Grade';
import { PaperGrain } from '../components/PaperGrain';

const TOTAL = 120;

const S07: FC = () => {
  const frame = useCurrentFrame();
  const cam = {
    scale: interpolate(frame, [0, TOTAL], [1.14, 1.02], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }),
    x: 0,
    y: 0,
    rot: 0,
  };
  // 章旁元素避让（局部 54–74：微移 6px）
  const dodge = interpolate(frame, [48, 68], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });

  return (
    <AbsoluteFill style={{ background: colors.paper }}>
      <CameraRig cam={cam}>
        <AbsoluteFill>
          <DustField act={2} count={18} seedBase="s07" />

          {/* 旧站内页一角（背景元素，承接镜 6 内页） */}
          <div style={{ position: 'absolute', left: 120, right: 120, top: 90 }}>
            <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: 1, background: colors.muted, opacity: 0.35 }} />
            <div style={{ position: 'absolute', left: 40, top: 60, width: 620, height: 20, background: colors.ink, opacity: 0.3, transform: `translateX(${dodge * -6}px)` }} />
            <div style={{ position: 'absolute', left: 40, top: 110, width: 520, height: 14, background: colors.ink, opacity: 0.22, transform: `translateX(${dodge * -6}px)` }} />
            <div style={{ position: 'absolute', left: 900, top: 70, width: 300, height: 180, border: `1px solid ${colors.muted}`, opacity: 0.2, transform: `translateX(${dodge * 6}px)` }} />
          </div>

          {/* 朱红闲章（落定 48=拍45）：印面即字幕（同文同层 zIndex 30） */}
          <div style={{ position: 'absolute', left: 700, top: 320, zIndex: 30, ...sealStamp(frame, 48, 30, sealTilt('s07-poem')) }}>
            <div
              style={{
                position: 'relative',
                width: 520,
                height: 300,
                borderRadius: 10,
                background: colors.seal,
                opacity: 0.93,
                boxShadow: '0 14px 36px rgba(0,0,0,0.2)',
              }}
            >
              {/* 印泥边缘微毛（内细线框） */}
              <div style={{ position: 'absolute', inset: 10, border: `2px solid ${colors.paper}`, opacity: 0.35, borderRadius: 6 }} />
              <div style={{ position: 'absolute', left: 0, right: 0, top: 86, textAlign: 'center' }}>
                <div style={{ fontFamily: fontFamilies.serif, fontSize: 52, color: colors.paper, letterSpacing: '0.12em' }}>代码写诗</div>
                <div style={{ fontFamily: fontFamilies.serif, fontSize: 52, color: colors.paper, letterSpacing: '0.12em', marginTop: 22 }}>工具作画。</div>
              </div>
            </div>
            {/* 朱色未干余晕（尾帧交接） */}
            {frame >= 48 ? (
              <div style={{ position: 'absolute', left: 30, top: 140, width: 60, height: 60, borderRadius: 30, background: colors.seal, opacity: interpolate(frame, [48, 90], [0.22, 0.08], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }), filter: 'blur(12px)' }} />
            ) : null}
          </div>
        </AbsoluteFill>
      </CameraRig>
      <PaperGrain opacity={0.06} />
      <Grade id="GR-03" />
    </AbsoluteFill>
  );
};

export default S07;
