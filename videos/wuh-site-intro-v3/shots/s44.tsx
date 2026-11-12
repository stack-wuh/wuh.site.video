/* S44 · Act 7 坐忘 · 局部帧 [0,168) · 168f · 绝对 5786–5954
 *
 * V2 深空数据流重构（2026-11-12 呼吸镜返工：微动不断 + 意义一句话）：
 * 推窗入七月——纸页余红残影（0–18 承接 s43 纸页边缘，朱红余晕收束）化作线框辉光窗
 * （18–58 推窗，窗框四条琥珀辉光条纵深收束=位移主线），GR2-07 七月数据光涌入（58–84），
 * 「七月」大字改 kineticChars 逐字弹入（58 起，2 字 × 6f，位移入场合规），
 * 末 20f rack focus 窗棂→窗台纸页（148–168 原窗口，暖纸白小页微亮）。
 * 意义一句话：推窗入七月——全片数据最密的一个月从这扇窗开始；留白让观众换一口气，
 * 也让「七月」两个字站成本镜唯一的主角。
 * 编排四问：
 *  承接：首帧 = s43 交出的纸页边缘 + 朱红余晕（0–18 残影收束化窗）；
 *  触发：窗框纵深收束（推窗 18–58）= 本镜主动作，光被「推进来」而非淡入；
 *  展开：帧级节奏表（见下）；手持颤动 + 光晕脉冲全程呼吸（微动不断）；
 *  交接：尾帧窗光铺满、窗台纸页微亮（endFrameDesc 契约，交 s45 主场数据镜）。
 * 逐拍帧表（fps=30）：
 *  [0–18]   余红残影收束（朱红→暖黑，纸页立起化窗）；
 *  [18–58]  推窗：窗框四条自屏缘纵深收束至窗位（上 80→200 / 侧 110→340，原窗口）；
 *  [58–84]  七月数据光涌入（琥珀光晕 floods）+「七月」kineticChars 逐字弹入（58/64）；
 *  [84–148] 光息呼吸：halo 脉冲 + 手持微动 + 辉光呼吸（无静止段）；
 *  [148–168] rack：窗台纸页微亮（148–168 原窗口，交 s45）。
 * 时间轴零改动：168f / 无字幕（留白）/ endFrameDesc「窗光铺满、窗台纸页微亮」语义原样 /
 * 全部窗口（0–18/18–58/58–84/148–168）原样；无 <Sequence>；random(seed) only；
 * springIn(kineticChars 内建) fps 取 useVideoConfig；色板只用 FILM_COLORS2 族。
 * 转场：入「纸翻」（18f，承接上镜纸页边缘），出「切」。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { CURVES } from '../../../brand/motion';
import { CameraRig } from '../components/CameraRig';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';
import { FILM_COLORS2, glowText, handheld, kineticChars } from '../motion-tokens';

const TOTAL = 168;
const CLAMP = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

const S44: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // 纸页立起化窗（0–18）：余红残影收束
  const toWindow = interpolate(frame, [0, 18], [0, 1], { ...CLAMP, easing: CURVES.cineEaseOut });
  // 推窗 40f（18–58）：窗框纵深收束 + 景深变化
  const push = interpolate(frame, [18, 58], [0, 1], { ...CLAMP, easing: CURVES.cineEaseInOut });
  // 七月数据光涌入（58–84）+ 光息呼吸（halo 脉冲不断）
  const lightIn = interpolate(frame, [58, 84], [0, 1], { ...CLAMP, easing: CURVES.cineEaseOut });
  // 末 20f rack：窗台纸页微亮
  const rack = interpolate(frame, [148, TOTAL], [0, 1], { ...CLAMP, easing: CURVES.cineEaseInOut });
  // 「七月」逐字弹入（58 起，2 字 × 6f，位移+微旋入场）
  const chars = kineticChars('七月', frame, 58, 6, fps, 0.5);
  // 手持微动（全镜不断）
  const shake = handheld('s44-cam', frame, 0.6);
  const cam = {
    scale: interpolate(frame, [0, TOTAL], [1.12, 1.02], { ...CLAMP, easing: CURVES.cineEaseInOut }),
    x: shake.dx,
    y: shake.dy,
    rot: shake.rot,
  };
  const barOpacity = 0.92 - push * 0.1;

  return (
    <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep }}>
      <CameraRig cam={cam}>
        <AbsoluteFill>
          <DeepSpace seed="s44v2" stars={54} grid horizon />

          {/* 窗外：七月数据光涌入（琥珀光晕自中心晕开，84 后转脉冲呼吸） */}
          <AbsoluteFill
            style={{
              background: `radial-gradient(circle at 50% 44%, rgba(233,217,174,0.26), rgba(212,163,115,0.1) 42%, rgba(212,163,115,0) 74%)`,
              opacity: lightIn * (0.85 + 0.15 * Math.sin(frame / 15)),
            }}
          />

          {/* 「七月」大字（内容主角，58 起 kineticChars 逐字弹入） */}
          <div style={{ position: 'absolute', left: 0, right: 0, top: 290, textAlign: 'center', zIndex: 26 }}>
            <span style={{ fontFamily: fontFamilies.serif, fontSize: 96, letterSpacing: '0.5em', color: FILM_COLORS2.paperWhite, textIndent: '0.5em' }}>
              {chars.map((c, i) => (
                <span key={i} style={c.style}>
                  {c.ch}
                </span>
              ))}
            </span>
            <span style={{ display: 'block', marginTop: 26, fontFamily: fontFamilies.mono, fontSize: 15, letterSpacing: '0.44em', color: FILM_COLORS2.textMuted, opacity: interpolate(frame, [84, 100], [0, 0.75], CLAMP), ...glowText(FILM_COLORS2.textMuted, 0.1) }}>JULY · 全片数据之月</span>
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

          {/* 窗台纸页（148–168 rack 微亮；呼吸微动不断，交 s45 主场） */}
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
              transform: `rotate(${-1.6 + 0.25 * Math.sin(frame / 17)}deg) translateY(${Math.sin(frame / 13) * -2}px)`,
              boxShadow: `0 0 ${rack * 22 + 6 * Math.sin(frame / 11)}px rgba(212,163,115,0.22), 0 14px 40px rgba(0,0,0,${0.4 - rack * 0.1})`,
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
