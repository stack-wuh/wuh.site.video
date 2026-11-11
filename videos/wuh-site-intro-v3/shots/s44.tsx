/* S44 · Act 7 坐忘 · 局部帧 [0,168) · 168f · 绝对 5786–5954
 *
 * V2 深空数据流重构（2026-11-11）：推窗入七月——纸页余红残影（0–18 承接 s43
 * 纸页边缘，朱红余晕退役为暖黑底上一抹余温）化作线框辉光窗（18–58 推窗，
 * 窗框改琥珀辉光条），GR2-07 七月数据光涌入（58–84，原晨光改为琥珀光晕 floods）；
 * 「七月」大字 serif 辉光落定（内容主角化）；末 20f rack focus 窗棂→窗台纸页
 * （148–168 原窗口，暖纸白小页微亮）。
 * 转场：入「纸翻」（18f，承接上镜纸页边缘），出「切」。无字幕（留白）。
 * 尾帧：窗光铺满、窗台纸页微亮（交接态：窗光+纸页，接 s45 证据快闪）。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { CURVES, writeFade } from '../../../brand/motion';
import { CameraRig } from '../components/CameraRig';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';
import { FILM_COLORS2, glowText } from '../motion-tokens';

const TOTAL = 168;

const S44: FC = () => {
  const frame = useCurrentFrame();
  // 纸页立起化窗（0–18）：余红残影收束
  const toWindow = interpolate(frame, [0, 18], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  // 推窗 40f（18–58）：窗框纵深收束 + 景深变化
  const push = interpolate(frame, [18, 58], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  // 七月数据光涌入（58–84）
  const lightIn = interpolate(frame, [58, 84], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  // 末 20f rack：窗台纸页微亮
  const rack = interpolate(frame, [148, TOTAL], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const cam = {
    scale: interpolate(frame, [0, TOTAL], [1.12, 1.02], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }),
    x: 0,
    y: 0,
    rot: 0,
  };
  const barOpacity = 0.92 - push * 0.1;

  return (
    <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep }}>
      <CameraRig cam={cam}>
        <AbsoluteFill>
          <DeepSpace seed="s44v2" stars={54} grid horizon />

          {/* 窗外：七月数据光涌入（琥珀光晕自中心晕开） */}
          <AbsoluteFill
            style={{
              background: `radial-gradient(circle at 50% 44%, rgba(233,217,174,0.26), rgba(212,163,115,0.1) 42%, rgba(212,163,115,0) 74%)`,
              opacity: lightIn,
            }}
          />

          {/* 「七月」大字（内容主角，serif 辉光落定） */}
          <div style={{ position: 'absolute', left: 0, right: 0, top: 290, textAlign: 'center', zIndex: 26, ...writeFade(frame, 58, true) }}>
            <span style={{ fontFamily: fontFamilies.serif, fontSize: 96, letterSpacing: '0.5em', color: FILM_COLORS2.paperWhite, textIndent: '0.5em', ...glowText(FILM_COLORS2.gold, 0.42) }}>七月</span>
          </div>

          {/* 窗棂（线框辉光窗框：矩形纵深收束成窗框） */}
          <div style={{ position: 'absolute', inset: 0 }}>
            <div style={{ position: 'absolute', left: 0, right: 0, top: interpolate(push, [0, 1], [80, 200]), height: 26, background: FILM_COLORS2.dataDim, opacity: barOpacity, boxShadow: `0 0 18px rgba(212,163,115,0.32)` }} />
            <div style={{ position: 'absolute', left: 0, right: 0, bottom: interpolate(push, [0, 1], [80, 200]), height: 26, background: FILM_COLORS2.dataDim, opacity: barOpacity, boxShadow: `0 0 18px rgba(212,163,115,0.32)` }} />
            <div style={{ position: 'absolute', top: 0, bottom: 0, left: interpolate(push, [0, 1], [110, 340]), width: 26, background: FILM_COLORS2.dataDim, opacity: barOpacity, boxShadow: `0 0 18px rgba(212,163,115,0.32)` }} />
            <div style={{ position: 'absolute', top: 0, bottom: 0, right: interpolate(push, [0, 1], [110, 340]), width: 26, background: FILM_COLORS2.dataDim, opacity: barOpacity, boxShadow: `0 0 18px rgba(212,163,115,0.32)` }} />
            {/* 纸页余红残影（0–18 收束：暖黑底上一抹朱红余温） */}
            {frame < 18 ? <AbsoluteFill style={{ background: `linear-gradient(160deg, rgba(122,31,22,0.3), rgba(10,9,8,0.88))`, opacity: 1 - toWindow }} /> : null}
          </div>

          {/* 窗台纸页（末 20f rack 微亮，接 s45 证据快闪） */}
          <div
            style={{
              position: 'absolute',
              right: 420,
              bottom: 150,
              width: 300,
              height: 200,
              borderRadius: 4,
              background: FILM_COLORS2.paperWhite,
              border: `1px solid ${FILM_COLORS2.dataDim}`,
              opacity: 0.7 + rack * 0.3,
              transform: `rotate(-1.6deg)`,
              boxShadow: `0 0 ${rack * 22}px rgba(212,163,115,0.22), 0 14px 40px rgba(0,0,0,${0.4 - rack * 0.1})`,
            }}
          >
            <div style={{ position: 'absolute', left: 26, top: 30, width: 200, height: 12, background: FILM_COLORS2.dataDim, opacity: 0.4 }} />
            <div style={{ position: 'absolute', left: 26, top: 56, width: 150, height: 10, background: FILM_COLORS2.dataDim, opacity: 0.26 }} />
          </div>
        </AbsoluteFill>
      </CameraRig>
      <HudChrome label="wuh.site · JULY" readout="07 · 推窗" />
      <Grade2 id="GR2-07" />
    </AbsoluteFill>
  );
};

export default S44;
