/* S52 · Act 8 此刻 · 局部帧 [0,144) · 144f · 绝对 7048–7192
 *
 * 审计重定义（2026-11-12 批次 E 返工单）：金句镜升级——kineticChars 逐字弹入（整段淡入退役）
 * + 背景数据雨帘 dataCurtain（峰值 opacity 按 token ≤0.22，永远在信息层之下）
 * + 金句落定轻冲击（第二行末字落定 = 暖金双环 + 金粒 + 金光横扫）。
 * 注：任务单笔误「190f」，本镜时长以文件/manifest 现状 144f 为准（时间轴零改动铁律）。
 *
 * 编排四问：
 * ① 承接——s51 尾帧交出「波形扩散」：0 起 dataCurtain 数字雨铺底（波形余韵化为数据雨），
 *   #172 成文信息键击入场（6–26）。
 * ② 触发——六阶段芯片 pipelineNode 逐个弹亮（10/28/46/64/82/100，传送带缓移 10–120 原窗口），
 *   像流水线先开动，金句随后逐字落。
 * ③ 展开——金句两段 kineticChars：前半 36 起（step 2.4f/字）、后半 86 顺延；
 *   [60–110] spaceDeep 幕布把芯片沉为底纹（原窗口，金句之下）；
 *   [128] 末字落定轻冲击：shockwave 暖金双环 + sparkBurst 12 金粒 + [126–140] sheenSweep 金光扫过金句。
 * ④ 交接——尾帧：金句占满主位、六阶段沉为底纹（manifest endFrameDesc 契约「交接态：金句页+底纹」原样）。
 *
 * 逐拍帧表（局部帧，fps=30）：
 * [0–144]   dataCurtain('s52-rain',16 列) 数字雨匀速下落（信息层之下）；
 * [6–26]    '#172 · VIBE CODING WORKFLOW · 2026-10-07' typeCharsAt 键击 + 键击光标；
 * [10–120]  六芯片 pipelineNode 依次弹亮（10+i*18）+ 传送带左移（10–120 原窗口）；
 * [36–79]   金句前半 kineticChars 逐字弹入（16 字 × 2.4f）；[86–127] 后半顺延（15 字）；
 * [60–110]  底纹幕布压暗（原窗口）；[128] 落定冲击（双环+金粒）；[126–140] 金光横扫金句；
 * [128–144] 辉光呼吸收束 = 交接态。
 * 时间轴零改动：144f / Caption（文本+appearAt 14）原样；无 <Sequence>；
 * FILM_COLORS2 only；random(seed) only；springIn/kineticChars fps 取 useVideoConfig()。
 * 转场：入「切」，出「切」。字幕安全窗：start≥12、end≤132。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { CURVES } from '../../../brand/motion';
import {
  FILM_COLORS2,
  cursorBlink,
  dataCurtain,
  glowText,
  kineticChars,
  pipelineNode,
  sheenSweep,
  shockwave,
  sparkBurst,
  typeCharsAt,
} from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { Caption } from '../components/Caption';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';

const STAGES = ['proposal', 'discuss', 'apply', 'review', 'archive', 'commit'];
const TOTAL = 144;
const META = '#172 · VIBE CODING WORKFLOW · 2026-10-07';
const LINE1 = '『工作流存在的意义不是当加速器，';
const LINE2 = '而是给 AI 装上边界和刹车。』';
const Q1_START = 36;
const Q2_START = 86;
const Q_STEP = 2.4;
const SETTLE_AT = 128; // 后半末字落定 ≈ 86+14×2.4+7 ≈ 127 → 冲击 128

const S52: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const beltX = interpolate(frame, [10, 120], [0, -260], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const dim = interpolate(frame, [60, 110], [0, 0.6], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const typed = typeCharsAt(frame, META.length, 6, 0.5);
  const line1 = kineticChars(LINE1, frame, Q1_START, Q_STEP, fps, 0.5);
  const line2 = kineticChars(LINE2, frame, Q2_START, Q_STEP, fps, 0.5);
  const wave = shockwave(frame, SETTLE_AT, '233,217,174');
  const burst = sparkBurst('s52-burst', frame, SETTLE_AT, 12, true);
  const rain = dataCurtain('s52-rain', frame, 16, 150);
  /* 落定辉光呼吸（128 起 1→收敛至镜尾） */
  const settleGlow = interpolate(frame, [SETTLE_AT, SETTLE_AT + 3, TOTAL], [0.4, 0.85, 0.4], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const cam = { scale: 1.03, x: 0, y: 0, rot: 0 };

  return (
    <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep }}>
      <CameraRig cam={cam}>
        <AbsoluteFill>
          <DeepSpace seed="s52v2" stars={54} grid />

          {/* 背景数据雨帘（0–144，信息层之下，峰值 opacity 按 token ≤0.22） */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 2, overflow: 'hidden', pointerEvents: 'none' }}>
            {rain.map((c, i) => (
              <span
                key={i}
                style={{
                  position: 'absolute',
                  left: `${c.x}%`,
                  top: c.y,
                  fontFamily: fontFamilies.mono,
                  fontSize: 18,
                  color: FILM_COLORS2.data,
                  opacity: c.o,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {c.text}
              </span>
            ))}
          </div>

          {/* #172 成文信息（6–26 键击 + 键击光标） */}
          <div style={{ position: 'absolute', left: 0, right: 0, top: 120, textAlign: 'center', zIndex: 30, whiteSpace: 'pre' }}>
            <span style={{ fontFamily: fontFamilies.mono, fontSize: 17, letterSpacing: '0.34em', color: FILM_COLORS2.textMuted }}>{META.slice(0, typed)}</span>
            {frame >= 6 && typed < META.length ? (
              <span style={{ display: 'inline-block', width: 9, height: 16, marginLeft: 6, verticalAlign: '-2px', background: FILM_COLORS2.textMuted, opacity: cursorBlink(frame, 6, 4, 4) ? 0.9 : 0.25 }} />
            ) : null}
            <div style={{ position: 'absolute', left: '50%', top: 40, width: 520, marginLeft: -260, height: 1, background: FILM_COLORS2.line, opacity: 0.6 }} />
          </div>

          {/* 六阶段线框芯片传送带：pipelineNode 依次弹亮（10/28/46/64/82/100） */}
          <div style={{ position: 'absolute', left: 380, top: 250, transform: `translateX(${beltX}px)`, display: 'flex', gap: 40 }}>
            {STAGES.map((s, i) => {
              const node = pipelineNode(frame, 10 + i * 18, fps);
              return (
                <div key={s} style={{ textAlign: 'center', opacity: node.opacity, transform: node.transform }}>
                  <div
                    style={{
                      width: 150,
                      height: 62,
                      borderRadius: 6,
                      border: `1px solid ${node.green > 0.5 ? FILM_COLORS2.dataDim : FILM_COLORS2.line}`,
                      background: `rgba(212,163,115,${node.green * 0.1})`,
                      boxShadow: node.green > 0.5 ? `0 0 ${8 + node.green * 14}px rgba(212,163,115,${0.14 * node.green})` : 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <span style={{ fontFamily: fontFamilies.mono, fontSize: 20, color: FILM_COLORS2.paperWhite, opacity: 0.85 }}>{s}</span>
                  </div>
                  {i < 5 ? <span style={{ position: 'absolute', right: -33, top: 20, fontFamily: fontFamilies.mono, fontSize: 18, color: FILM_COLORS2.dataDim }}>→</span> : null}
                </div>
              );
            })}
          </div>

          {/* 六阶段沉为底纹（spaceDeep 幕布，金句之下） */}
          <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep, opacity: dim, pointerEvents: 'none', zIndex: 5 }} />

          {/* 金句两段 kineticChars 逐字弹入（主角；落定轻冲击 128 + 金光横扫 126–140） */}
          <div style={{ position: 'absolute', left: 120, right: 120, top: 430, textAlign: 'center', zIndex: 30 }}>
            <div style={{ marginBottom: 24, ...glowText(FILM_COLORS2.data, frame >= SETTLE_AT ? settleGlow : 0.18) }}>
              {line1.map((c, i) => (
                <span key={i} style={{ ...c.style, fontFamily: fontFamilies.serif, fontSize: 62, color: FILM_COLORS2.paperWhite }}>
                  {c.ch}
                </span>
              ))}
            </div>
            <div style={{ ...glowText(FILM_COLORS2.data, frame >= SETTLE_AT ? settleGlow : 0.18) }}>
              {line2.map((c, i) => (
                <span key={i} style={{ ...c.style, fontFamily: fontFamilies.serif, fontSize: 62, color: FILM_COLORS2.paperWhite }}>
                  {c.ch}
                </span>
              ))}
            </div>
            <div style={sheenSweep(frame, 126, 14)} />
          </div>

          {/* 落定轻冲击（128）：暖金双环 + 金粒，锚金句视觉中心（top 430+100+24+46≈600） */}
          {frame >= SETTLE_AT ? (
            <div style={{ position: 'absolute', left: '50%', top: 600, width: 0, height: 0, zIndex: 31, pointerEvents: 'none' }}>
              {wave ? <div style={wave.ring1} /> : null}
              {wave ? <div style={wave.ring2} /> : null}
              {burst.map((p, i) => (
                <div key={i} style={p.style} />
              ))}
            </div>
          ) : null}
        </AbsoluteFill>
      </CameraRig>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 300, backgroundImage: `linear-gradient(180deg, transparent, ${FILM_COLORS2.spaceDeep})`, opacity: 0.18 }} />
      <HudChrome label="wuh.site · WORKFLOW" readout={frame >= SETTLE_AT ? 'QUOTE · SETTLED' : 'propose → commit'} />
      <Grade2 id="GR2-08" />
      <Caption text="十月，他写道：『工作流存在的意义不是当加速器，而是给 AI 装上边界和刹车。』" appearAt={14} />
    </AbsoluteFill>
  );
};

export default S52;
