/* S17 · Act 3 第一行 · 局部帧 [0,156) · 156f · 绝对 2538–2694
 *
 * 编排四问：
 *   承接 = 上镜交出的暗场深空（首帧近黑，终端屏幕自暗中亮起）；
 *   触发 = 键击即动作——光标闪烁 + typeCharsAt 逐字键入提交原文（全片第一记重音由「打字」执行）；
 *   展开 = 帧级节奏：0–12 终端亮起 → 12–80 逐字键入（fpc 2.0）→ 82 回车重音（冲击环+粒子+轻震+push-in）→ 82+ 反光余韵/水印 → handheld 呼吸到底；
 *   交接 = 尾帧：单行代码 + 琥珀反光 + 日期水印悬停暗场（交接态：单行代码+暗底，交 s18 同日七提交印章）。
 * 逐拍帧表（fps=30）：
 *   [0–12]    终端亮起 screenOn 0.3→1（cineEaseOut）；光标预备两闪（5f 周期）；
 *   [12–80]   CODE_LINE 34 字 typeCharsAt 键入（键入字琥珀数据色+微辉光），光标随打随闪（3f 周期）；机位跟行尾 x 60→-260；
 *   [82]      ENTER 重音 = 绝对 2620 = 拍131 对音（絕不动）：paperShake(2.5,12) + shockwave 双环 rgb(212,163,115) + sparkBurst×14，锚 (1560,508)（行尾键完处）；
 *   [82–112]  push-in 1.02→1.0506（cam 窗原样）；行下琥珀反光 0→1100px / 0→0.5→0.22 余韵；
 *   [88–98]   角落日期水印 2024-12-08 springIn 落位即现（标识不滚）；
 *   [112–156] handheld('s17-cam', 1.2) 手持呼吸微动不断（无静止段）。
 * 时间轴零改动：156f / TYPE_START 12 / ENTER_AT 82 / Caption appearAt 14 原样；转场：入「切」，出「切」。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { CURVES } from '../../../brand/motion';
import { FILM_COLORS2, glowText, handheld, paperShake, shockwave, sparkBurst, springIn, typeCharsAt } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { Caption } from '../components/Caption';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';

const CODE_LINE = 'feat(init): 基于nextjs构建的monorepos项目';
const TYPE_START = 12;
const FPC = 2.0;
const ENTER_AT = 82; // 绝对 2620 = 拍131
/** 冲击锚点：行尾键完处（等宽 58px 估宽，随 cam x 已含 -260 平移） */
const HIT_X = 1560;
const HIT_Y = 508;

const S17: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const chars = typeCharsAt(frame, CODE_LINE.length, TYPE_START, FPC);
  const shake = paperShake(frame, ENTER_AT, 2.5, 12);
  const pushIn = interpolate(frame, [ENTER_AT, ENTER_AT + 30], [1.0, 1.03], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  const hh = handheld('s17-cam', frame, 1.2);
  const cam = {
    scale: 1.02 * pushIn,
    x: interpolate(frame, [TYPE_START, TYPE_START + 68], [60, -260], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }) + hh.dx,
    y: hh.dy,
    rot: hh.rot,
  };
  // 光标两闪（12 前预备 + 键入期间常驻闪烁）
  const cursorOn = frame < TYPE_START ? frame % 10 < 5 : chars < CODE_LINE.length ? frame % 6 < 3 : false;
  const screenOn = interpolate(frame, [0, 12], [0.3, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  // 回车重音（82）：冲击双环 + 粒子喷洒
  const wave = shockwave(frame, ENTER_AT);
  const burst = sparkBurst('s17-burst', frame, ENTER_AT, 14);
  // 日期水印 springIn（88 落位）
  const markP = springIn(frame, ENTER_AT + 6, fps);

  return (
    <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep }}>
      <DeepSpace seed="s17v2" stars={48} grid horizon />
      <CameraRig cam={cam}>
        <AbsoluteFill style={{ ...shake, background: FILM_COLORS2.spaceDeep }}>
          {/* 终端 HUD（0–12 亮起） */}
          <AbsoluteFill style={{ opacity: screenOn }}>
            {/* 角落日期水印（标识，springIn 落位） */}
            <div
              style={{
                position: 'absolute',
                right: 90,
                top: 70,
                fontFamily: fontFamilies.mono,
                fontSize: 20,
                color: FILM_COLORS2.textMuted,
                fontVariantNumeric: 'tabular-nums',
                opacity: Math.min(0.75, markP * 0.9),
                transform: `translateY(${(1 - markP) * 8}px)`,
              }}
            >
              2024-12-08
            </div>
            {/* 提交行（等宽原样拼写；键入字琥珀数据色+微辉光） */}
            <div style={{ position: 'absolute', left: 160, top: 480, right: 120, fontFamily: fontFamilies.mono, fontSize: 58, color: FILM_COLORS2.paperWhite, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
              <span style={{ color: FILM_COLORS2.data, ...glowText(FILM_COLORS2.data, 0.28) }}>{CODE_LINE.slice(0, chars)}</span>
              {cursorOn ? <span style={{ borderRight: `4px solid ${FILM_COLORS2.paperWhite}`, marginRight: -4 }} /> : null}
            </div>
            {/* 行首序号 */}
            <div style={{ position: 'absolute', left: 90, top: 480, fontFamily: fontFamilies.mono, fontSize: 58, color: FILM_COLORS2.textMuted, opacity: 0.4 }}>1</div>
            {/* 回车后行下的琥珀反光（重音余韵） */}
            {frame >= ENTER_AT ? (
              <div style={{ position: 'absolute', left: 150, top: 580, width: interpolate(frame, [ENTER_AT, ENTER_AT + 20], [0, 1100], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }), height: 3, background: FILM_COLORS2.data, boxShadow: `0 0 12px rgba(212,163,115,0.5)`, opacity: interpolate(frame, [ENTER_AT, ENTER_AT + 8, ENTER_AT + 40], [0, 0.5, 0.22], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }} />
            ) : null}
          </AbsoluteFill>

          {/* 回车重音（82）：冲击双环 + 粒子（锚行尾，zIndex 高于终端行） */}
          {wave ? (
            <div style={{ position: 'absolute', left: HIT_X, top: HIT_Y, width: 0, height: 0, zIndex: 34 }}>
              <div style={wave.ring1} />
              <div style={wave.ring2} />
            </div>
          ) : null}
          <div style={{ position: 'absolute', left: HIT_X, top: HIT_Y, width: 0, height: 0, zIndex: 34 }}>
            {burst.map((p, i) => (
              <div key={`burst-${i}`} style={p.style} />
            ))}
          </div>
        </AbsoluteFill>
      </CameraRig>
      <HudChrome label="wuh.site · FIRST LINE" readout="INIT COMMIT · 2024-12-08" />
      <Grade2 id="GR2-03" />
      <Caption text="2024 年 12 月 8 日，新站落下第一行代码。同一天，七次初始化提交。" appearAt={14} />
    </AbsoluteFill>
  );
};

export default S17;
