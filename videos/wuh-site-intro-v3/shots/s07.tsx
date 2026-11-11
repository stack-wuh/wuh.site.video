/* S07 · Act 2 旧屋 · 局部帧 [0,120) · 120f · 绝对 852–972
 * V2 暖黑数据流（2026-11-11 风格重构）：「整版朱红大闲章」改写为「金句 kinetic + 闲章签名」——
 * 题眼金句「代码写诗，工具作画。」大字号 serif kinetic（writeFade 30/40，两句于 48=绝对
 * 900=拍45 对音前落定）+ glowText 常驻；朱红闲章缩为签名小章（48 落下，印面「闲」，
 * 每镜一处手作签名点），章旁数据线框元素避让（54–74 原窗微移 6px）；极缓后拉守恒。
 * 题眼同文同层：字幕即金句本体，不另设 Caption。
 * 转场：入「墨洇」出「墨洇」→ ShotShell 光晕呼吸，镜文件零工作。
 * 尾帧：闲章冻帧，朱色未干（余晕）——交接态语义保持。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { CURVES, sealStamp, sealTilt, writeFade } from '../../../brand/motion';
import { FILM_COLORS2, glowText } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';

const TOTAL = 120;

const S07: FC = () => {
  const frame = useCurrentFrame();
  const cam = {
    scale: interpolate(frame, [0, TOTAL], [1.14, 1.02], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }),
    x: 0,
    y: 0,
    rot: 0,
  };
  // 章旁元素避让（54–74：微移 6px 原窗）
  const dodge = interpolate(frame, [48, 68], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });

  return (
    <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep }}>
      <DeepSpace seed="s07v2" stars={40} grid />
      <CameraRig cam={cam}>
        <AbsoluteFill>
          {/* 数据页一角线框（背景元素，承接镜 6 档案面板；随避让微移） */}
          <div style={{ position: 'absolute', left: 120, right: 120, top: 90 }}>
            <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: 1, background: FILM_COLORS2.line, opacity: 0.6 }} />
            <div style={{ position: 'absolute', left: 40, top: 60, width: 620, height: 16, background: FILM_COLORS2.paperWhite, opacity: 0.12, transform: `translateX(${dodge * -6}px)` }} />
            <div style={{ position: 'absolute', left: 40, top: 104, width: 520, height: 11, background: FILM_COLORS2.dataDim, opacity: 0.2, transform: `translateX(${dodge * -6}px)` }} />
            <div style={{ position: 'absolute', left: 900, top: 70, width: 300, height: 180, border: `1px solid ${FILM_COLORS2.line}`, opacity: 0.35, transform: `translateX(${dodge * 6}px)` }} />
          </div>

          {/* 金句 kinetic（writeFade 30/40 → 48=拍45 前落定；serif 大字 + glowText） */}
          <div style={{ position: 'absolute', left: 0, right: 0, top: 316, textAlign: 'center', zIndex: 30 }}>
            <div style={{ ...writeFade(frame, 30) }}>
              <span style={{ fontFamily: fontFamilies.serif, fontSize: 92, color: FILM_COLORS2.paperWhite, letterSpacing: '0.14em', ...glowText(FILM_COLORS2.paperWhite, 0.35) }}>代码写诗</span>
            </div>
            <div style={{ ...writeFade(frame, 40), marginTop: 26 }}>
              <span style={{ fontFamily: fontFamilies.serif, fontSize: 92, color: FILM_COLORS2.gold, letterSpacing: '0.14em', ...glowText(FILM_COLORS2.gold, 0.4, '233,217,174') }}>工具作画。</span>
            </div>
          </div>

          {/* 朱红闲章（签名小章，落下 48=拍45；每镜一处手作签名点） */}
          <div style={{ position: 'absolute', left: '50%', top: 590, marginLeft: -55, zIndex: 30, ...sealStamp(frame, 48, 30, sealTilt('s07-poem')) }}>
            <div
              style={{
                position: 'relative',
                width: 110,
                height: 110,
                borderRadius: 8,
                background: FILM_COLORS2.sealRed,
                opacity: 0.93,
                boxShadow: '0 12px 30px rgba(0,0,0,0.45), 0 0 20px rgba(122,31,22,0.35)',
              }}
            >
              <div style={{ position: 'absolute', inset: 8, border: `1.5px solid ${FILM_COLORS2.paperWhite}`, opacity: 0.35, borderRadius: 5 }} />
              <div style={{ position: 'absolute', left: 0, right: 0, top: 30, textAlign: 'center' }}>
                <span style={{ fontFamily: fontFamilies.serif, fontSize: 46, color: FILM_COLORS2.paperWhite }}>闲</span>
              </div>
            </div>
            {/* 朱色未干余晕（尾帧交接态） */}
            {frame >= 48 ? (
              <div style={{ position: 'absolute', left: 24, top: 44, width: 60, height: 60, borderRadius: 30, background: FILM_COLORS2.sealRed, opacity: interpolate(frame, [48, 90], [0.22, 0.08], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }), filter: 'blur(12px)' }} />
            ) : null}
          </div>
        </AbsoluteFill>
      </CameraRig>
      <HudChrome label="wuh.site · MOTTO" readout="CODE × CRAFT" />
      <Grade2 id="GR2-03" />
    </AbsoluteFill>
  );
};

export default S07;
