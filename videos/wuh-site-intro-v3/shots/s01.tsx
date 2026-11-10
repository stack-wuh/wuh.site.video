/* S01 · Act 1 开篇 · 局部帧 [0,150) · 150f · 绝对 0–150
 * V2 深空数据流样片（2026-11-10 科技重构）：黑场→深空显影（星点+网格）→
 * 手作 wordmark 辉光主角化（墨迹资产在深空上 screen 显影，笔尖余光改青色数据光点）→
 * 大数字 2019 滚动落定（BIG-NUMBER）→ 底部时间线画入（TIMELINE-FLOW 起点，开往八幕）→
 * 手作签名点：印章「朝朝如念」压角（screen 内的纸魂）。
 * 题记即字幕（wordmark 同文同层，不设 Caption）。转场：入「切」，出「墨洇」。
 * 尾帧：深空+wordmark+2019+时间线起步，全部稳定。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { CURVES, numRoll, writeFade } from '../../../brand/motion';
import { FILM_COLORS2, glowText } from '../motion-tokens';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';

/** 墨迹 wordmark 上的游走数据光点（原 FN-20 笔尖余光的青色版）：24–96 走完一遍，之后尾端呼吸 */
const penGlowAt = (frame: number): { x: number; opacity: number } => {
  const t = interpolate(frame, [28, 96], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const x = interpolate(t, [0, 1], [340, 1580]);
  const tail = frame >= 96;
  const opacity = tail ? interpolate(frame, [96, 106], [0.9, 0.5], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 0.9;
  return { x, opacity };
};

const S01: FC = () => {
  const frame = useCurrentFrame();
  /* 深空显影（0–14 从黑场起） */
  const reveal = interpolate(frame, [0, 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  /* 题记标题（文字版手作签名——墨迹 PNG 在深空上是不透明棕板，弃图用字） */
  const mark = writeFade(frame, 20, true);
  const glow = penGlowAt(frame);
  /* 大数字 2019（56–96 滚动，落定 96；年份不带千分位） */
  const yearV = numRoll(frame, 56, 40, 0, 2019);
  const yearGlow = frame >= 96 ? interpolate(frame, [96, 99, 122], [0.35, 1, 0.4], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : interpolate(frame, [56, 64], [0.12, 0.35], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const yearSlam = frame >= 96 ? interpolate(frame, [96, 104], [1.045, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 1;
  /* 副标 */
  const sub = writeFade(frame, 96);
  /* 底部时间线画入（104–146 走 22%，开往八幕） */
  const tlP = interpolate(frame, [104, 146], [0, 0.22], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  /* 手作签名印章（112 显影） */
  const seal = writeFade(frame, 112);

  return (
    <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep }}>
      <AbsoluteFill style={{ opacity: reveal }}>
        <DeepSpace seed="s01v2" stars={72} grid horizon={false} vignette={0.5} />
      </AbsoluteFill>

      {/* 题记即字幕（同文同层）：文字版墨迹标题 + 游走数据光点 */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 330,
          textAlign: 'center',
          zIndex: 30,
          opacity: mark.opacity,
          transform: `${mark.transform} scale(${interpolate(frame, [20, 64], [1.045, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut })})`,
        }}
      >
        <span style={{ fontFamily: fontFamilies.serif, fontSize: 84, color: FILM_COLORS2.paperInk, letterSpacing: '0.06em', ...glowText(FILM_COLORS2.paperInk, 0.4) }}>
          wuh.site<span style={{ color: FILM_COLORS2.sealRed, margin: '0 18px', fontSize: 56 }}>·</span>朝朝如念
        </span>
        <span style={{ display: 'block', marginTop: 26, fontFamily: fontFamilies.serif, fontSize: 26, color: FILM_COLORS2.dataWhite, opacity: 0.72, letterSpacing: '0.3em' }}>雾失楼台，月迷津渡</span>
        {/* 游走数据光点（青色笔尖余光，压在题记基线上） */}
        <div
          style={{
            position: 'absolute',
            left: `calc(50% + ${glow.x - 620}px)`,
            top: 96,
            width: 11,
            height: 11,
            borderRadius: 6,
            background: FILM_COLORS2.cyan,
            boxShadow: `0 0 20px 7px rgba(95,216,255,0.6)`,
            opacity: glow.opacity,
          }}
        />
      </div>

      {/* 大数字 2019（落定 = 年度报告开场钉；年份无千分位） */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 620,
          textAlign: 'center',
          zIndex: 30,
          fontFamily: fontFamilies.mono,
          fontSize: 128,
          fontWeight: 700,
          color: FILM_COLORS2.cyan,
          fontVariantNumeric: 'tabular-nums',
          letterSpacing: '0.06em',
          opacity: interpolate(frame, [56, 66], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          transform: `scale(${yearSlam})`,
          ...glowText(FILM_COLORS2.cyan, yearGlow * 0.8),
        }}
      >
        {Math.round(yearV)}
      </div>
      {/* 副标 */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 800, textAlign: 'center', zIndex: 30, ...sub }}>
        <span style={{ fontFamily: fontFamilies.mono, fontSize: 20, letterSpacing: '0.42em', color: FILM_COLORS2.dataWhite, opacity: 0.85 }}>SINCE 2019 · 博客，有了第一篇</span>
      </div>

      {/* 底部时间线（TIMELINE-FLOW 起点：主线自左画入，8 幕的旅程开往右方） */}
      <div style={{ position: 'absolute', left: 140, right: 140, bottom: 128, height: 2, background: 'rgba(120,170,240,0.16)' }} />
      <div style={{ position: 'absolute', left: 140, bottom: 128, height: 2, width: `${tlP * 100}%`, background: `linear-gradient(90deg, ${FILM_COLORS2.cyanDim}, ${FILM_COLORS2.cyan})`, boxShadow: `0 0 12px 2px rgba(95,216,255,${0.35 * tlP + 0.1})` }} />
      <div style={{ position: 'absolute', left: 140, bottom: 122, width: 14, height: 14, borderRadius: 7, background: FILM_COLORS2.cyan, boxShadow: `0 0 16px 4px rgba(95,216,255,0.55)`, opacity: interpolate(frame, [104, 112], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }} />

      {/* 手作签名点：印章「朝朝如念」（纸魂压在科技外壳右下） */}
      <div style={{ position: 'absolute', right: 150, bottom: 170, zIndex: 30, ...seal }}>
        <div
          style={{
            border: `2px solid ${FILM_COLORS2.sealRed}`,
            color: FILM_COLORS2.sealRed,
            fontFamily: fontFamilies.serif,
            fontSize: 22,
            letterSpacing: '0.18em',
            padding: '10px 18px',
            opacity: 0.92,
            textShadow: `0 0 14px rgba(201,111,74,0.4)`,
            boxShadow: `0 0 22px rgba(201,111,74,0.18), inset 0 0 12px rgba(201,111,74,0.12)`,
          }}
        >
          朝朝如念
        </div>
      </div>

      <HudChrome label="wuh.site" readout="SINCE 2019" />
      <Grade2 id="GR2-01" />
    </AbsoluteFill>
  );
};

export default S01;
