/* S29 · Act 5 灯亮 · 局部帧 [0,252) · 252f · 绝对 4254–4506
 *
 * V3 特效解禁重写（2026-11-11 逐拍脚本）：Act5《重启计划》金句 + 钤印，叙事镜（金句主角化）。
 * 逐拍事件链（局部帧，fps=30）：
 *   0–252   CameraRig scale 1.0→1.045（cineEaseInOut）+ handheld('s29-cam', 1.4)；
 *           背景 DeepSpace(seed='s29v2' stars=40 grid 原样保留) + dataCurtain('s29-rain', 8 列, 110) 低密度数字雨帘
 *   14–43   引言行「一周后，他写下《重启计划》：」typeCharsAt 键击逐字（起 14f，2.2f/字，serif 21px textMuted）
 *   44–56   日期角标 2026-06-21 淡入（原窗口原样保留）
 *   66–108  金句 L1『……每周发布一篇博客，kineticChars 逐字弹入（step 2.5f/字）
 *   106–130 金句 L2 无限进步，同上（行锚 66/106/146 = 原文件金句 appearAt 原样）
 *   146–190 金句 L3 开始重启计划~~』同上；serif 76px paperWhite intensity 0.55，落定辉光呼吸（token 自带）
 *   192     钤印落下 springIn（scale 1.18→1 + y −40→0，12f）= ANCHORS.sealRestart 绝对 4446（对音，絕不动）；
 *           落定瞬间 shockwave(sealRed 双环) + sparkBurst('s29-burst', 12 粒) + paperShake(2.5, 10)
 *   192–246 尾帧交接态：以印章为中心 rgba(122,31,22,…)=sealRed radial-gradient 朱红晕开成红光——
 *           opacity 0→0.38、半径 scale 0.22→1.56 从印面扩到全屏（interpolate [192,246] 驱动）→
 *           末帧整屏泛朱红微光（交 s30）。
 * 时间轴契约零改动：252f 总长；钤印 192（绝对 4446）；Caption appearAt=64 与文本原样；金句文本原样。
 * 转场：入「切」，出「切」。字幕安全窗：start≥12、end≤240。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import {
  CURVES,
  FILM_COLORS2,
  dataCurtain,
  glowText,
  handheld,
  kineticChars,
  paperShake,
  shockwave,
  sparkBurst,
  springIn,
  typeCharsAt,
} from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { Caption } from '../components/Caption';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';

const TOTAL = 252;
const SEAL_AT = 192; // ANCHORS.sealRestart 绝对 4446 = 局部 192（对音，絕不动）
const SEAL_RGB = '122,31,22'; // = FILM_COLORS2.sealRed (#7A1F16) 三元组（rgba/shockwave 参数用，唯一色源仍是色板）
const SEAL_CX = '78.9%'; // 印章中心（1920×1080：right 300 + 105）
const SEAL_CY = '67.1%'; // = top 620 + 105
const KINETIC_STEP = 2.5; // 金句逐字步进（f/字）
const INTRO_TEXT = '一周后，他写下《重启计划》：';
const INTRO_START = 14;
const INTRO_FPC = 2.2;
/** 金句原文原样；start = 原文件金句 appearAt（writeFade delay 66/106/146 原样承接为 kinetic 锚点） */
const QUOTE_LINES = [
  { text: '『……每周发布一篇博客，', start: 66 },
  { text: '无限进步，', start: 106 },
  { text: '开始重启计划~~』', start: 146 },
];

const S29: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // 机位：全镜缓推 1.0→1.045（cineEaseInOut）+ 手持呼吸
  const hand = handheld('s29-cam', frame, 1.4);
  const cam = {
    scale: interpolate(frame, [0, TOTAL], [1.0, 1.045], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }),
    x: hand.dx,
    y: hand.dy,
    rot: hand.rot,
  };
  // 印章落定纸面轻震（192 落定瞬间，amp 2.5 / decay 10）
  const shake = paperShake(frame, SEAL_AT, 2.5, 10);
  // 引言行键击逐字（typeCharsAt 量化）
  const introShown = typeCharsAt(frame, INTRO_TEXT.length, INTRO_START, INTRO_FPC);
  // 尾帧朱红晕开进度（192→246：半径印面→全屏）
  const bloomP = interpolate(frame, [SEAL_AT, 246], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  // 钤印 springIn 弹性落下（scale 1.18→1 + y −40→0）
  const sealP = springIn(frame, SEAL_AT, fps);

  return (
    <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep }}>
      <DeepSpace seed="s29v2" stars={40} grid />
      {/* 数据雨帘（背景氛围层，opacity 峰值按 token 返回值，不再放大） */}
      <AbsoluteFill>
        {dataCurtain('s29-rain', frame, 8, 110).map((c, i) => (
          <span
            key={i}
            style={{
              position: 'absolute',
              left: `${c.x}%`,
              top: c.y,
              transform: 'translateX(-50%)',
              fontFamily: fontFamilies.mono,
              fontSize: 18,
              color: FILM_COLORS2.dataDim,
              opacity: c.o,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {c.text}
          </span>
        ))}
      </AbsoluteFill>
      <CameraRig cam={cam}>
        <AbsoluteFill style={shake}>
          {/* 引言行 + 金句主体（kinetic typography 主角化）+ 日期角标 */}
          <div style={{ position: 'absolute', left: 0, right: 0, top: 230, textAlign: 'center' }}>
            <div
              style={{
                fontFamily: fontFamilies.serif,
                fontSize: 21,
                letterSpacing: '0.18em',
                color: FILM_COLORS2.textMuted,
                minHeight: 32,
                whiteSpace: 'pre-wrap',
              }}
            >
              {Array.from(INTRO_TEXT)
                .slice(0, introShown)
                .join('')}
            </div>
            <div style={{ marginTop: 30 }}>
              {QUOTE_LINES.map((line, li) => (
                <div
                  key={li}
                  style={{
                    position: 'relative',
                    height: 108,
                    lineHeight: 1,
                    fontFamily: fontFamilies.serif,
                    fontSize: 76,
                    fontWeight: 700,
                    color: FILM_COLORS2.paperWhite,
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {kineticChars(line.text, frame, line.start, KINETIC_STEP, fps, 0.55).map((k, ci) => (
                    <span key={ci} style={k.style}>
                      {k.ch}
                    </span>
                  ))}
                </div>
              ))}
            </div>
            <div
              style={{
                marginTop: 22,
                fontFamily: fontFamilies.mono,
                fontSize: 20,
                letterSpacing: '0.14em',
                color: FILM_COLORS2.textMuted,
                fontVariantNumeric: 'tabular-nums',
                opacity: interpolate(frame, [44, 56], [0, 0.75], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
              }}
            >
              2026-06-21
            </div>
          </div>

          {/* 重启钤印（192 = ANCHORS.sealRestart 绝对 4446 对音）——本镜唯一手作签名点 */}
          <div style={{ position: 'absolute', right: 300, top: 620, width: 210, height: 210, zIndex: 30 }}>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                opacity: interpolate(frame, [SEAL_AT, SEAL_AT + 5], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
                transform: `translateY(${-40 * (1 - sealP)}px) scale(${1.18 - 0.18 * sealP})`,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: 10,
                  background: FILM_COLORS2.sealRed,
                  opacity: 0.93,
                  boxShadow: `0 0 34px rgba(${SEAL_RGB},0.45)`,
                }}
              >
                <div style={{ position: 'absolute', inset: 12, border: `2px solid ${FILM_COLORS2.paperWhite}`, opacity: 0.4, borderRadius: 6 }} />
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: 62,
                    textAlign: 'center',
                    fontFamily: fontFamilies.serif,
                    fontSize: 40,
                    color: FILM_COLORS2.paperWhite,
                    letterSpacing: '0.1em',
                    ...glowText(FILM_COLORS2.sealRed, 0.3, SEAL_RGB),
                  }}
                >
                  重启
                </div>
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: 118,
                    textAlign: 'center',
                    fontFamily: fontFamilies.serif,
                    fontSize: 40,
                    color: FILM_COLORS2.paperWhite,
                    letterSpacing: '0.1em',
                    ...glowText(FILM_COLORS2.sealRed, 0.3, SEAL_RGB),
                  }}
                >
                  计划
                </div>
              </div>
            </div>
            {/* 落定瞬间冲击波双环（sealRed） */}
            {(() => {
              const sw = shockwave(frame, SEAL_AT, SEAL_RGB);
              return sw ? (
                <div style={{ position: 'absolute', left: '50%', top: '50%' }}>
                  <div style={{ position: 'absolute', ...sw.ring1 }} />
                  <div style={{ position: 'absolute', ...sw.ring2 }} />
                </div>
              ) : null;
            })()}
            {/* 落定瞬间粒子喷洒（random('s29-burst') 确定性） */}
            <div style={{ position: 'absolute', left: '50%', top: '50%' }}>
              {sparkBurst('s29-burst', frame, SEAL_AT, 12).map((p, i) => (
                <div key={i} style={p.style} />
              ))}
            </div>
          </div>

          {/* 尾帧交接态：钤印朱红晕开成红光（192–246 半径印面→全屏，末帧整屏泛朱红微光，交 s30） */}
          {frame >= SEAL_AT ? (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                zIndex: 20,
                background: `radial-gradient(circle at ${SEAL_CX} ${SEAL_CY}, rgba(${SEAL_RGB},0.62), rgba(${SEAL_RGB},0.22) 44%, transparent 74%)`,
                opacity: bloomP * 0.38,
                transform: `scale(${0.22 + bloomP * 1.34})`,
                transformOrigin: `${SEAL_CX} ${SEAL_CY}`,
                pointerEvents: 'none',
              }}
            />
          ) : null}
        </AbsoluteFill>
      </CameraRig>
      <HudChrome label="wuh.site · RESTART PLAN" readout="D+7 · 无限进步" />
      <Grade2 id="GR2-05" />
      <Caption text="一周后，他写下《重启计划》：『……每周发布一篇博客，无限进步，开始重启计划~~』" appearAt={64} bottom={110} />
    </AbsoluteFill>
  );
};

export default S29;
