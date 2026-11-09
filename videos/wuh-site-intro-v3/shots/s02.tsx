/* S02 · Act 1 墨点 · 局部帧 [0,138) · 138f · 绝对 150–288
 *
 * 墨点母题第一次落纸：题记余光坠出窗框化作一滴墨（20–50 ease-in 下坠），触纸（50）
 * 洇成圆斑 + 两圈涟漪（50–62），展开为第一篇文章纸卡（56–90）：
 * 卡头「2018-08-05 【开篇】」+ 双日期章「发布 2019-07-26」「正文落款 2018-08-05」
 * （章 90/110 各 6f 落下，标识不滚）；极缓后拉（120–138）。
 * 转场：入「墨洇」（镜首 20f 遮罩内起步），出「纸翻」（本镜尾帧=双日期冻帧）。
 * 字幕安全窗：start≥32、end≤108。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, sealStamp, sealTilt } from '../../../brand/motion';
import { FILM_COLORS } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { Caption } from '../components/Caption';
import { DustField } from '../components/DustField';
import { Grade } from '../components/Grade';
import { PaperGrain } from '../components/PaperGrain';

const TOTAL = 138;

/** 双日期章（复用 v2 s04 物证版式：朱底方章 + 衬线标签 + 等宽日期） */
const DateSeal: FC<{ label: string; date: string; left: number; top: number; delay: number; frame: number }> = ({
  label,
  date,
  left,
  top,
  delay,
  frame,
}) => (
  <div style={{ position: 'absolute', left, top, ...sealStamp(frame, delay, 30, sealTilt(`s02-${label}`)) }}>
    <div style={{ position: 'relative', width: 190, height: 190, borderRadius: 8, background: colors.seal, opacity: 0.92 }}>
      <span style={{ position: 'absolute', left: 0, right: 0, top: 64, textAlign: 'center', fontFamily: fontFamilies.serif, fontSize: 26, color: colors.paper }}>
        {label}
      </span>
      <span style={{ position: 'absolute', left: 0, right: 0, top: 116, textAlign: 'center', fontFamily: fontFamilies.mono, fontSize: 20, color: colors.paper, fontVariantNumeric: 'tabular-nums' }}>
        {date}
      </span>
    </div>
  </div>
);

const S02: FC = () => {
  const frame = useCurrentFrame();
  // 墨滴下坠（20–50 ease-in）：自上方窗框位置坠到纸面点
  const dropY = interpolate(frame, [20, 50], [-260, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseIn });
  const dropOpacity = interpolate(frame, [20, 26], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  // 触纸洇开（50–62）：墨斑半径 + 两圈涟漪
  const blotR = interpolate(frame, [50, 62], [6, 46], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  const ripple1 = interpolate(frame, [52, 78], [0, 130], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const ripple2 = interpolate(frame, [58, 96], [0, 190], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const rippleOpacity = (r: number, t0: number, t1: number) =>
    interpolate(frame, [t0, t0 + 10, t1], [0, 0.35, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  // 纸卡展开（56–90）
  const cardP = interpolate(frame, [56, 90], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  // 极缓后拉（120–138）
  const cam = {
    scale: interpolate(frame, [0, 120, TOTAL], [1.02, 1.02, 1.0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }),
    x: 0,
    y: 0,
    rot: 0,
  };

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <CameraRig cam={cam}>
        <AbsoluteFill>
          <DustField act={1} count={26} seedBase="s02" />

          {/* 墨滴（坠出窗框的那点余光） */}
          {frame >= 20 && frame < 52 ? (
            <div
              style={{
                position: 'absolute',
                left: 940,
                top: 300 + dropY,
                width: 18,
                height: 24,
                borderRadius: '50% 50% 60% 60%',
                background: colors.ink,
                opacity: dropOpacity,
                transform: 'scale(1, 1.3)',
              }}
            />
          ) : null}

          {/* 墨斑 + 涟漪（触纸点即纸卡左上，构图偏左上三分线） */}
          <div style={{ position: 'absolute', left: 470, top: 300 }}>
            {frame >= 50 ? <div style={{ position: 'absolute', left: -blotR / 2, top: -blotR / 2, width: blotR, height: blotR, borderRadius: blotR, background: colors.ink, opacity: 0.82 }} /> : null}
            {ripple1 > 0 ? <div style={{ position: 'absolute', left: -ripple1, top: -ripple1 / 2, width: ripple1 * 2, height: ripple1, borderRadius: ripple1, border: `1.4px solid ${colors.ink}`, opacity: rippleOpacity(ripple1, 52, 78) }} /> : null}
            {ripple2 > 0 ? <div style={{ position: 'absolute', left: -ripple2, top: -ripple2 / 2, width: ripple2 * 2, height: ripple2, borderRadius: ripple2, border: `1px solid ${colors.ink}`, opacity: rippleOpacity(ripple2, 58, 96) }} /> : null}
          </div>

          {/* 第一篇文章纸卡（卡头 + 双日期章并置） */}
          <div style={{ position: 'absolute', left: 470, top: 300, width: 980, height: 430, opacity: cardP, transform: `scale(${0.96 + cardP * 0.04})`, transformOrigin: 'left top' }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: 6, background: colors.paper, border: `1px solid ${colors.paperMuted}`, boxShadow: `0 14px 40px rgba(0,0,0,0.24)` }} />
            <div style={{ position: 'absolute', left: 60, top: 44, display: 'flex', alignItems: 'baseline', gap: 18 }}>
              <span style={{ fontFamily: fontFamilies.mono, fontSize: 24, color: colors.muted, fontVariantNumeric: 'tabular-nums' }}>2018-08-05</span>
              <span style={{ fontFamily: fontFamilies.serif, fontSize: 40, color: colors.ink }}>【开篇】</span>
            </div>
            <div style={{ position: 'absolute', left: 60, right: 60, top: 128, height: 1, background: colors.muted, opacity: 0.45 }} />
            <div style={{ position: 'absolute', left: 60, top: 168, width: 560, height: 12, background: colors.ink, opacity: 0.35 }} />
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ position: 'absolute', left: 60, top: 206 + i * 30, width: 700 - i * 90, height: 7, background: colors.muted, opacity: 0.28 }} />
            ))}
            <DateSeal label="发布" date="2019-07-26" left={150} top={230} delay={90} frame={frame} />
            <DateSeal label="正文落款" date="2018-08-05" left={640} top={230} delay={110} frame={frame} />
            {/* 墨斑未干余晕（尾帧交接） */}
            {frame >= 50 ? <div style={{ position: 'absolute', left: -14, top: -14, width: 28, height: 28, borderRadius: 14, background: colors.ink, opacity: 0.1, filter: 'blur(6px)' }} /> : null}
          </div>
        </AbsoluteFill>
      </CameraRig>
      {/* 底部字幕渐隐托底 */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 300, backgroundImage: `linear-gradient(180deg, transparent, ${colors.bg})`, opacity: 0.24 }} />
      <PaperGrain opacity={0.06} />
      <Grade id="GR-01" />
      <Caption text="2019 年，博客有了第一篇。" appearAt={32} />
    </AbsoluteFill>
  );
};

export default S02;
