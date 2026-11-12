/* S61 · Act 8 此刻 · 局部帧 [0,88) · 88f · 绝对 8082–8170（ANCHORS.typewriter = 本镜局部 0）
 *
 * 题记回环（2026-11-11 破家族豁免重做：金句文本原样保留为内容，视觉编排按宪法 V2/§9/§10 重做）。
 * 原实现为纸面底（开篇同款纸面），按逐拍令保留纸面语义：暖黑深空（DeepSpace）中一张题记纸
 * 微亮起，墨字逐字弹入；落定极轻纸面阴影脉冲 + 墨点粒子；尾帧整句停住、浮游墨点未落尽交 s62。
 * 逐拍事件链（局部帧，fps=30）：
 * [0–12]    承接 s60 总结纸页（入「切」）：题记纸面 springIn 显影（scale 0.982→1 + y +18→0），
 *           题记区暖金微光晕亮起（0–10 涨、34 收至微亮留存 =「同一束光」）；
 * [4–30]    第一行「写作是抵抗遗忘的方式，」kineticChars 逐字弹入（4 起，step 2f/字，serif 56px，
 *           墨色 #1a1712【纸面方案专用墨色，用户裁定允许】），落定字微辉光（kineticChars 自带呼吸辉光）；
 * [32–52]   第二行「代码是构建世界的语言。」接续弹入（32 = 4 + 11 字×2f + 6，step 2f，句号 52 敲定）；
 *           两行左对齐阶梯错落（第二行右缩进 80px），行宽 653px = 34% 画面 ≤72%（修单行出框 bug）；
 * [52–58]   整句落定：极轻纸面阴影脉冲（52 起 8px 下沉 + 阴影加深，66 回平）+
 *           sparkBurst('s61-settle', 52, 10) 墨点粒子自句号位溅出；HUD readout → 'EST. 2019 — ∞'；
 * [58–88]   收束呼吸：句区暖金光晕慢呼吸（13f 周期，纸面方案的「辉光呼吸」）；
 *           「粒子未落尽」——3 枚浮游墨点/光点缓慢漂浮至末帧（56–68 显影，末帧仍在浮）；
 * [0–88]    CameraRig scale 1.03→1.0 缓收 + handheld('s61-cam', 0.8) 手持颤动。
 * Caption 契约：原文件无 <Caption> 组件（同文同层——字幕即画面句子），保持不变；句子逐字保留
 * 于画面中上区（y 384–546），底部字幕安全区留空，无重叠。
 * 无图片 / 禁 <Sequence> / random(seed) only / springIn·kineticChars fps 取 useVideoConfig()。
 * 转场：入「切」，出「切」。尾帧：整句停住、粒子未落尽（交接态：题记纸面+浮游墨点）。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES } from '../../../brand/motion';
import { FILM_COLORS2, handheld, kineticChars, sparkBurst, springIn } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';

const TOTAL = 88;
/* 金句逐字保留（破豁免裁定：文本原样），拆两行修出框 bug */
const LINE1 = '写作是抵抗遗忘的方式，'; // 11 字
const LINE2 = '代码是构建世界的语言。'; // 11 字
const L1_START = 4; // 第一行逐字起
const STEP = 2; // 2f/字
const L2_START = L1_START + LINE1.length * STEP + 6; // = 32
const LAND_AT = 52; // 句号敲定 = 整句落定（sparkBurst/阴影脉冲/HUD 切读数锚点）
/* 行排版：serif 56px + 字距 0.06em → 行宽 ≈ 11×59.4 ≈ 653px（34% 画面 ≤72%）；第二行右缩进 80px */
const FONT_SIZE = 56;
const L1_LEFT = 620;
const L2_LEFT = L1_LEFT + 80;
const L1_TOP = 384;
const L2_TOP = L1_TOP + 92;
/* 纸面方案专用墨色（用户裁定：仅纸面方案允许 #1a1712，替代品牌 ink #2b2620） */
const MOTTO_INK = '#1a1712';
/* 浮游墨点（尾帧契约：未落尽，漂浮到 87f 仍在） */
const FLOATERS = [
  { seed: 's61-fl0', x: 1330, y: 512, size: 6, ink: true, ax: 11, ay: 8, sp: 33 },
  { seed: 's61-fl1', x: 1178, y: 348, size: 5, ink: true, ax: 9, ay: 7, sp: 41 },
  { seed: 's61-fl2', x: 760, y: 588, size: 5, ink: false, ax: 10, ay: 6, sp: 37 },
];

const S61: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  /* 纸面显影（0–12 springIn）与题记区微亮起（0–10 涨、34 收至微亮留存） */
  const paperP = springIn(frame, 0, fps, 17, 150, 1.1);
  const wash = interpolate(frame, [0, 10, 34], [0, 0.55, 0.14], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  /* 两行金句逐字弹入（落定字微辉光由 kineticChars 自带呼吸） */
  const chars1 = kineticChars(LINE1, frame, L1_START, STEP, fps, 0.5);
  const chars2 = kineticChars(LINE2, frame, L2_START, STEP, fps, 0.5);
  /* 整句落定（52）：极轻纸面阴影脉冲 + 句号位墨点溅出 */
  const settleP = interpolate(frame, [LAND_AT, LAND_AT + 4, LAND_AT + 14], [0, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const burst = sparkBurst('s61-settle', frame, LAND_AT, 10);
  /* 收束呼吸（58–88）：句区暖金光晕慢呼吸 */
  const halo = interpolate(frame, [LAND_AT, 60], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) * (0.1 + 0.05 * Math.sin(frame / 13));
  /* CameraRig：1.03→1.0 缓收 + handheld 颤动 */
  const shake = handheld('s61-cam', frame, 0.8);
  const cam = {
    scale: interpolate(frame, [0, TOTAL], [1.03, 1.0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }),
    x: shake.dx,
    y: shake.dy,
    rot: shake.rot,
  };

  return (
    <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep }}>
      <DeepSpace seed="s61v2" stars={44} grid />
      <CameraRig cam={cam}>
        <AbsoluteFill>
          {/* 题记纸面（家族语义保留：与 s60 总结纸页同一张纸、同一束光） */}
          <div
            style={{
              position: 'absolute',
              left: 260,
              right: 260,
              top: 300,
              bottom: 300,
              borderRadius: 6,
              background: colors.paper,
              border: `1px solid ${colors.paperMuted}`,
              opacity: Math.min(1, paperP * 1.6),
              transform: `translateY(${(1 - paperP) * 18}px) scale(${0.982 + paperP * 0.018})`,
              /* 整句落定（52）：极轻阴影脉冲 */
              boxShadow: `0 ${30 + settleP * 8}px ${90 + settleP * 26}px rgba(0,0,0,${0.45 + settleP * 0.1})`,
            }}
          >
            {/* 题记区微亮起（0–10）：暖金光晕亮起后收至微亮留存 */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: 6,
                background: 'radial-gradient(62% 72% at 50% 42%, rgba(233,217,174,0.5), rgba(233,217,174,0) 72%)',
                mixBlendMode: 'screen',
                opacity: wash,
              }}
            />
            {/* 句区暖金光晕（58–88 慢呼吸，纸面方案的辉光呼吸） */}
            <div
              style={{
                position: 'absolute',
                left: 520,
                top: 60,
                width: 880,
                height: 300,
                borderRadius: '50%',
                background: 'radial-gradient(closest-side, rgba(212,163,115,0.16), rgba(212,163,115,0))',
                opacity: halo,
              }}
            />
          </div>

          {/* 第一行（4–30 kineticChars 逐字弹入，左起 620，行宽 653px ≤72% 画面） */}
          <div style={{ position: 'absolute', left: L1_LEFT, top: L1_TOP, zIndex: 30, whiteSpace: 'pre' }}>
            <span style={{ fontFamily: fontFamilies.serif, fontSize: FONT_SIZE, letterSpacing: '0.06em', color: MOTTO_INK, whiteSpace: 'pre' }}>
              {chars1.map((c, i) => (
                <span key={i} style={c.style}>
                  {c.ch}
                </span>
              ))}
            </span>
          </div>

          {/* 第二行（32–52 接续弹入，右缩进 80px 阶梯错落） */}
          <div style={{ position: 'absolute', left: L2_LEFT, top: L2_TOP, zIndex: 30, whiteSpace: 'pre' }}>
            <span style={{ fontFamily: fontFamilies.serif, fontSize: FONT_SIZE, letterSpacing: '0.06em', color: MOTTO_INK, whiteSpace: 'pre' }}>
              {chars2.map((c, i) => (
                <span key={i} style={c.style}>
                  {c.ch}
                </span>
              ))}
            </span>
          </div>

          {/* 整句落定（52）：墨点粒子自句号位溅出 */}
          {frame >= LAND_AT ? (
            <div style={{ position: 'absolute', left: L2_LEFT + 640, top: L2_TOP + 30, width: 0, height: 0, zIndex: 30, pointerEvents: 'none' }}>
              {burst.map((p, i) => (
                <div key={i} style={p.style} />
              ))}
            </div>
          ) : null}

          {/* 浮游墨点/光点（尾帧契约「粒子未落尽」：56–68 显影，缓慢漂浮至末帧） */}
          {FLOATERS.map((f, i) => {
            const phase = random(`${f.seed}-p`) * Math.PI * 2;
            const born = interpolate(frame, [56 + i * 6, 68 + i * 6], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
            if (born <= 0) return null;
            const x = f.x + Math.cos(frame / f.sp + phase) * f.ax;
            const y = f.y + Math.sin(frame / (f.sp * 1.3) + phase) * f.ay - born * 6;
            const o = born * (0.5 + 0.14 * Math.sin(frame / 12 + phase));
            return (
              <div
                key={f.seed}
                style={{
                  position: 'absolute',
                  left: x,
                  top: y,
                  width: f.size,
                  height: f.size,
                  borderRadius: f.size / 2,
                  zIndex: 31,
                  background: f.ink ? MOTTO_INK : FILM_COLORS2.data,
                  boxShadow: f.ink ? `0 0 8px rgba(26,23,18,0.35)` : `0 0 9px rgba(212,163,115,0.55)`,
                  opacity: o,
                }}
              />
            );
          })}
        </AbsoluteFill>
      </CameraRig>

      <HudChrome label="wuh.site · MOTTO" readout={frame >= LAND_AT ? 'EST. 2019 — ∞' : 'TYPING…'} />
      <Grade2 id="GR2-08" />
    </AbsoluteFill>
  );
};

export default S61;
