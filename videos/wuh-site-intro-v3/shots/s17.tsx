/* S17 · Act 3 第一行 · 局部帧 [0,156) · 156f · 绝对 2538–2694
 *
 * 全片第一记重音：编辑器全屏亮起（0–12），光标两闪（RH-04 5f 周期）；
 * `feat(init): 基于nextjs构建的monorepos项目` 逐字键入（12–80，fpc 2.0，
 * 等宽 tabular，画面文字=提交原文原样拼写）；机位跟行尾；
 * 回车重音 82=绝对 2620=拍131 对音：纸面轻震（paperShake）+
 * push-in 100→103%（82–112，全片 push-in 之一，只给重音）；
 * 角落日期水印 2024-12-08（标识，落位即现）。
 * 转场：入「切」，出「切」。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES } from '../../../brand/motion';
import { paperShake, typeCharsAt } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { Caption } from '../components/Caption';
import { DustField } from '../components/DustField';
import { Grade } from '../components/Grade';
import { PaperGrain } from '../components/PaperGrain';

const TOTAL = 156;
const CODE_LINE = 'feat(init): 基于nextjs构建的monorepos项目';
const TYPE_START = 12;
const FPC = 2.0;
const ENTER_AT = 82; // 绝对 2620 = 拍131

const S17: FC = () => {
  const frame = useCurrentFrame();
  const chars = typeCharsAt(frame, CODE_LINE.length, TYPE_START, FPC);
  const shake = paperShake(frame, ENTER_AT, 2.5, 12);
  const pushIn = interpolate(frame, [ENTER_AT, ENTER_AT + 30], [1.0, 1.03], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  const cam = {
    scale: 1.02 * pushIn,
    x: interpolate(frame, [TYPE_START, TYPE_START + 68], [60, -260], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }),
    y: 0,
    rot: 0,
  };
  // 光标两闪（12 前预备 + 键入期间常驻闪烁）
  const cursorOn = frame < TYPE_START ? frame % 10 < 5 : chars < CODE_LINE.length ? frame % 6 < 3 : false;
  const screenOn = interpolate(frame, [0, 12], [0.3, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <CameraRig cam={cam}>
        <AbsoluteFill style={{ ...shake, background: colors.terminalBg }}>
          <DustField act={3} count={10} seedBase="s17" />
          {/* 编辑器全屏（FN-22 亮起） */}
          <AbsoluteFill style={{ opacity: screenOn }}>
            {/* 角落日期水印（标识） */}
            <div style={{ position: 'absolute', right: 90, top: 70, fontFamily: fontFamilies.mono, fontSize: 20, color: colors.muted, opacity: interpolate(frame, [ENTER_AT + 6, ENTER_AT + 16], [0, 0.75], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }), fontVariantNumeric: 'tabular-nums' }}>
              2024-12-08
            </div>
            {/* 提交行（等宽原样拼写） */}
            <div style={{ position: 'absolute', left: 160, top: 480, right: 120, fontFamily: fontFamilies.mono, fontSize: 58, color: colors.paper, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
              <span style={{ color: colors.gold }}>{CODE_LINE.slice(0, chars)}</span>
              {cursorOn ? <span style={{ borderRight: `4px solid ${colors.paper}`, marginRight: -4 }} /> : null}
            </div>
            {/* 行首序号 */}
            <div style={{ position: 'absolute', left: 90, top: 480, fontFamily: fontFamilies.mono, fontSize: 58, color: colors.muted, opacity: 0.4 }}>1</div>
            {/* 回车后行下的微亮反光（重音余韵） */}
            {frame >= ENTER_AT ? (
              <div style={{ position: 'absolute', left: 150, top: 580, width: interpolate(frame, [ENTER_AT, ENTER_AT + 20], [0, 1100], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }), height: 3, background: colors.gold, opacity: interpolate(frame, [ENTER_AT, ENTER_AT + 8, ENTER_AT + 40], [0, 0.5, 0.22], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }} />
            ) : null}
          </AbsoluteFill>
        </AbsoluteFill>
      </CameraRig>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 320, backgroundImage: `linear-gradient(180deg, transparent, ${colors.bg})`, opacity: 0.26 }} />
      <PaperGrain opacity={0.05} />
      <Grade id="GR-01" />
      <Caption text="2024 年 12 月 8 日，新站落下第一行代码。同一天，七次初始化提交。" appearAt={14} />
    </AbsoluteFill>
  );
};

export default S17;
