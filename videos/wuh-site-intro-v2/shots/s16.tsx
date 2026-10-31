/* 镜 16 · Act 3 第一行 · 局部帧 [0,90) · 90f
   TR-11 跟纸缘入画（0–24f 遮罩推进 + 纸缘亮线），灰调年度总结纸页整版落定；
   30–90f CM-06 缓慢下摇 4%，FN-08 整页蒙灰，页眉一点暖光；无字幕；GR-05。 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, FILM_COLORS, dyeDrain, paperBreathe } from '../motion-tokens';
import { DustField } from '../components/DustField';
import { PaperGrain } from '../components/PaperGrain';
import { Grade } from '../components/Grade';

const PAGE = { left: 90, top: 40, width: 1740, height: 1000 } as const;
const REVEAL = 24;
const ROWS = [92, 78, 96, 64, 88, 70, 95, 82, 58, 90, 74, 97, 66, 85, 76, 52, 94, 68] as const;

const ShotGreyAnnualPage: FC = () => {
  const frame = useCurrentFrame();
  const reveal = interpolate(frame, [0, REVEAL], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  const tilt = interpolate(frame, [30, 90], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const grey = dyeDrain(frame, 6);
  const warm = 0.13 + 0.03 * Math.sin(frame / 26);

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg, overflow: 'hidden' }}>
      {/* 纸页下方两张垫纸，随纸缘入画显形 */}
      <div style={{ position: 'absolute', left: PAGE.left + 16, top: PAGE.top + 14, width: PAGE.width, height: PAGE.height, background: FILM_COLORS.paperMist, opacity: reveal * 0.45 }} />
      <div style={{ position: 'absolute', left: PAGE.left + 8, top: PAGE.top + 7, width: PAGE.width, height: PAGE.height, background: FILM_COLORS.paperMist, opacity: reveal * 0.7 }} />
      <div
        style={{
          position: 'absolute',
          left: PAGE.left,
          top: PAGE.top,
          width: PAGE.width,
          height: PAGE.height,
          background: FILM_COLORS.blankPaper,
          clipPath: `inset(0 ${(1 - reveal) * 100}% 0 0)`,
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, ...paperBreathe(frame, 0.5) }}>
          <div style={{ position: 'absolute', inset: 0, transform: `translateY(${-44 * tilt}px) rotateX(${1.6 * tilt}deg)`, transformOrigin: '50% 0%' }}>
            {/* 页眉：一点暖光 + 角标 */}
            <div style={{ position: 'absolute', left: 250, top: 90, width: 460, height: 150, borderRadius: '50%', background: colors.gold, filter: 'blur(48px)', opacity: warm }} />
            <div style={{ position: 'absolute', left: 96, top: 84, fontFamily: fontFamilies.mono, fontSize: 17, letterSpacing: '0.22em', color: colors.muted, fontVariantNumeric: 'tabular-nums' }}>2022-02-08</div>
            <div style={{ position: 'absolute', left: 96, top: 126, width: 1548, height: 1, background: FILM_COLORS.wireGrey, opacity: 0.6 }} />
            {/* 标题与正文只留灰度行块，不伪造原文 */}
            <div style={{ position: 'absolute', left: 96, top: 168, width: 1548, ...grey }}>
              <div style={{ width: 640, height: 26, borderRadius: 3, background: FILM_COLORS.grey, opacity: 0.24, marginBottom: 18 }} />
              <div style={{ width: 420, height: 26, borderRadius: 3, background: FILM_COLORS.grey, opacity: 0.2, marginBottom: 40 }} />
              {ROWS.map((w, i) => (
                <div key={i} style={{ width: `${w}%`, height: 13, borderRadius: 3, background: FILM_COLORS.greyMist, opacity: 0.34, marginBottom: 22 }} />
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* 跟纸缘入画时的纸缘亮线 */}
      <div style={{ position: 'absolute', left: PAGE.left, top: PAGE.top, width: 2, height: PAGE.height, background: colors.gold, opacity: 0.45 * (1 - reveal), transform: `translateX(${reveal * PAGE.width}px)` }} />
      <DustField act={3} seedBase="s16" />
      <PaperGrain opacity={0.06} />
      <Grade id="GR-05" />
    </AbsoluteFill>
  );
};

export default ShotGreyAnnualPage;
