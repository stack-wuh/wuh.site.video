/* S09 · Act 2 旧屋 · 局部帧 [0,204) · 204f · 绝对 1140–1344
 * V2 暖黑数据流（2026-11-11 风格重构）：「木桌俯拍实物」改写为「双数据堆对撞 + 宣言 kinetic」——
 * ① 遮罩入场（0–14 spaceDeep 揭开，推界琥珀光缝，承接语汇）；
 * ② 左「工位」右「生活」两块线框数据堆推向画心并排（30–70 原窗）——工作和生活
 *    被摆上同一张桌面的数据版；
 * ③ 竖排标题《搬山计划》落定（70–80，落定 80=绝对 1220=拍61 对音不变，静 2 拍），
 *    serif + glowText；
 * ④ 宣言金句逐行 kinetic（100/130/160 原窗 write-fade，大字号 + glowText）；
 * ⑤ 桌角笔电数据窗掀盖、琥珀屏光微亮（184–204，尾帧交接态）。
 * 转场：入「纸翻」出「切」→ ShotShell 光晕呼吸，镜文件零工作。
 * 字幕安全窗：start≥30、end≤192。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { CURVES, writeFade } from '../../../brand/motion';
import { FILM_COLORS2, glowText } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { Caption } from '../components/Caption';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';

const TOTAL = 204;
const QUOTE_LINES = ['『除了工作就是工作，', '是时候做出一点点改变了，', '去玩生活去』'];

const S09: FC = () => {
  const frame = useCurrentFrame();
  const drop = interpolate(frame, [0, 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  const cam = {
    scale: interpolate(frame, [0, TOTAL], [1.1, 1.02], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }),
    x: 0,
    y: interpolate(frame, [18, 60], [0, 40], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }),
    rot: 0,
  };
  // 两摞数据堆推移（30–70）：左堆右移、右堆左移，到画心并排
  const push = interpolate(frame, [30, 70], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  // 竖排标题落定（80=拍61）
  const titleP = interpolate(frame, [70, 80], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineAccent });
  // 笔电数据窗掀盖、屏光微亮（184–204，尾帧交接）
  const laptop = interpolate(frame, [184, TOTAL], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });

  return (
    <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep }}>
      <DeepSpace seed="s09v2" stars={42} grid />
      <CameraRig cam={cam}>
        <AbsoluteFill>
          {/* 左：工位数据堆（右移到画心） */}
          <div style={{ position: 'absolute', left: 300 + push * 190, top: 420, width: 300 }}>
            <div style={{ position: 'absolute', left: 0, top: 0, width: 280, height: 200, borderRadius: 8, background: FILM_COLORS2.panel, border: `1px solid ${FILM_COLORS2.line}`, boxShadow: `0 0 24px rgba(212,163,115,0.1), 0 14px 30px rgba(0,0,0,0.45)` }}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{ position: 'absolute', left: 24, top: 34 + i * 44, width: 200 - i * 30, height: 10, background: FILM_COLORS2.paperWhite, opacity: 0.2 }} />
              ))}
              <span style={{ position: 'absolute', right: 20, bottom: 16, fontFamily: fontFamilies.mono, fontSize: 12, letterSpacing: '0.24em', color: FILM_COLORS2.dataDim }}>WORK · ISSUES</span>
            </div>
            <span style={{ position: 'absolute', left: 20, top: -40, fontFamily: fontFamilies.mono, fontSize: 16, color: FILM_COLORS2.textMuted, letterSpacing: '0.3em' }}>工 位</span>
          </div>

          {/* 右：生活数据堆（左移到画心） */}
          <div style={{ position: 'absolute', left: 1300 - push * 190, top: 420, width: 320 }}>
            <div style={{ position: 'absolute', left: 30, top: 0, width: 250, height: 200, borderRadius: 8, background: FILM_COLORS2.panel, border: `1px solid ${FILM_COLORS2.line}`, boxShadow: `0 0 24px rgba(212,163,115,0.1), 0 14px 30px rgba(0,0,0,0.45)` }}>
              <div style={{ position: 'absolute', left: 24, top: 30, width: 24, height: 24, borderRadius: 12, background: FILM_COLORS2.gold, opacity: 0.5, boxShadow: `0 0 16px 4px rgba(233,217,174,0.3)` }} />
              {[0, 1].map((i) => (
                <div key={i} style={{ position: 'absolute', left: 66, top: 36 + i * 24, width: 140 - i * 40, height: 9, background: FILM_COLORS2.paperWhite, opacity: 0.2 }} />
              ))}
              {/* 呼吸光点一线（原茶盏热气的数据版） */}
              <div style={{ position: 'absolute', right: 30, bottom: 22, width: 2, height: 40, background: `linear-gradient(180deg, transparent, ${FILM_COLORS2.data})`, opacity: 0.4 + Math.sin(frame / 30) * 0.12 }} />
              <span style={{ position: 'absolute', left: 24, bottom: 16, fontFamily: fontFamilies.mono, fontSize: 12, letterSpacing: '0.24em', color: FILM_COLORS2.dataDim }}>LIFE · MOMENTS</span>
            </div>
            <span style={{ position: 'absolute', left: 50, top: -40, fontFamily: fontFamilies.mono, fontSize: 16, color: FILM_COLORS2.textMuted, letterSpacing: '0.3em' }}>生 活</span>
          </div>

          {/* 竖排标题《搬山计划》（落定 80=拍61，静 2 拍；serif + glowText） */}
          <div
            style={{
              position: 'absolute',
              left: 790,
              top: 130,
              writingMode: 'vertical-rl',
              fontFamily: fontFamilies.serif,
              fontSize: 64,
              color: FILM_COLORS2.paperWhite,
              letterSpacing: '0.28em',
              opacity: titleP,
              transform: `translateY(${(1 - titleP) * -30}px)`,
              ...glowText(FILM_COLORS2.paperWhite, 0.35),
            }}
          >
            搬山计划
          </div>

          {/* 宣言金句逐行 kinetic（100/130/160 原窗，大字号 + glowText） */}
          <div style={{ position: 'absolute', left: 460, top: 660, zIndex: 30 }}>
            {QUOTE_LINES.map((line, i) => (
              <div key={i} style={{ ...writeFade(frame, 100 + i * 30, true), marginBottom: 14 }}>
                <span style={{ fontFamily: fontFamilies.serif, fontSize: 42, color: FILM_COLORS2.paperWhite, opacity: 0.94, ...glowText(FILM_COLORS2.paperWhite, 0.3) }}>{line}</span>
              </div>
            ))}
          </div>

          {/* 桌角笔电数据窗掀盖（184–204，琥珀屏光微亮——尾帧交接态） */}
          <div style={{ position: 'absolute', left: 1280, top: 700, width: 380, height: 160, opacity: interpolate(frame, [184, 196], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>
            <div style={{ position: 'absolute', left: 20, top: 0, width: 340, height: 10, borderRadius: 3, background: FILM_COLORS2.line, opacity: 0.9, transform: `perspective(800px) rotateX(${(1 - laptop) * -70}deg)`, transformOrigin: 'bottom center', boxShadow: `0 0 12px rgba(212,163,115,0.25)` }} />
            <div style={{ position: 'absolute', left: 0, top: 10, width: 380, height: 12, borderRadius: 4, background: FILM_COLORS2.panel, border: `1px solid ${FILM_COLORS2.line}` }} />
            {frame >= 196 ? <div style={{ position: 'absolute', left: 30, top: -74, width: 320, height: 84, background: FILM_COLORS2.data, opacity: laptop * 0.14, filter: 'blur(12px)' }} /> : null}
          </div>
        </AbsoluteFill>
      </CameraRig>

      {/* 遮罩入场（0–14 承接语汇；spaceDeep 揭开 + 推界琥珀光缝） */}
      {frame < 15 ? (
        <>
          <AbsoluteFill style={{ pointerEvents: 'none', background: FILM_COLORS2.spaceDeep, clipPath: `inset(0 0 ${(1 - drop) * 100}% 0)` }} />
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: `${(1 - drop) * 100}%`,
              height: 3,
              background: FILM_COLORS2.data,
              opacity: 0.7,
              boxShadow: `0 0 20px 6px rgba(212,163,115,0.4)`,
              pointerEvents: 'none',
            }}
          />
        </>
      ) : null}

      <HudChrome label="wuh.site · PLAN" readout="MAY 2021 · 搬山计划" />
      <Grade2 id="GR2-02" />
      <Caption text="五月，他写《搬山计划》：『除了工作就是工作，是时候做出一点点改变了，去玩生活去』" appearAt={104} bottom={110} />
    </AbsoluteFill>
  );
};

export default S09;
