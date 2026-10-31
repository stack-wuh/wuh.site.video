/* 镜 22 · Act 3 第一行 · 局部帧 [0,210) · 210f
   从印章散出时间轴首日：7 枚墨点前 4 每 12f、后 3 加速（26/38/50/62/69/74/78f）；
   FN-21 七点弧线接回主时间轴（88–114f）；CM-07 随点横移 + 末段拉开 6%（120–168f）；
   TR-10 光沉（190–210f，brightness→0.35 + 暗角 0.6）；GR-02；字幕落定于第 7 点。 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, FILM_COLORS, GRADES, glowPulse, pathDraw } from '../motion-tokens';
import { Caption } from '../components/Caption';
import { DustField } from '../components/DustField';
import { PaperGrain } from '../components/PaperGrain';
import { Grade } from '../components/Grade';

const GAPS = [0, 120, 120, 120, 90, 60, 50] as const;
const LAND = [26, 38, 50, 62, 69, 74, 78] as const;
const LABELS = ['components', 'husky', 'changelog', '版本号'] as const;
const YEARS: Array<[string, number]> = [['2024', 960], ['2025', 1900], ['2026', 2700]];
const DOT_X = (() => {
  const out: number[] = [];
  let x = 1050;
  GAPS.forEach((gap, i) => {
    if (i > 0) x += gap;
    out.push(x);
  });
  return out;
})();
const dotY = (i: number): number => 742 - Math.sin((i / 6) * Math.PI) * 30;
const ARC = `M ${DOT_X.map((x, i) => `${x} ${dotY(i)}`).join(' L ')} L 1790 760`;
const ARC_LEN = 780;
const BG = `linear-gradient(90deg, ${FILM_COLORS.blankPaper} 0%, ${FILM_COLORS.blankPaper} 60%, ${colors.bgLift} 80%, ${colors.bg} 100%)`;

const ShotInitDots: FC = () => {
  const frame = useCurrentFrame();
  const shift = interpolate(frame, [0, 26, 38, 50, 62, 78, 110], [0, -80, -200, -320, -440, -540, -620], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const scale = interpolate(frame, [120, 168], [1.02, 0.958], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const dark = interpolate(frame, [190, 210], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const lit = interpolate(frame, [118, 140], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  const pulse = glowPulse(frame, 0.8).opacity;
  const arc = pathDraw(frame, 88, 26, ARC_LEN);
  const capIn = interpolate(frame, [78, 94], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  const vignette = GRADES['GR-01'].veil?.gradient ?? 'none';
  const mono = fontFamilies.mono;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg, backgroundImage: BG, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: 3000, height: 1080, transform: `translate(${shift}px, 0) scale(${scale})`, transformOrigin: '960px 540px' }}>
        <div style={{ position: 'absolute', inset: 0, filter: `brightness(${1 - 0.6 * dark})` }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: BG }} />
          {/* 主时间轴：向右延伸进黑暗 */}
          <div style={{ position: 'absolute', left: 120, top: 760, width: 2780, height: 2, background: FILM_COLORS.wireGrey, opacity: 0.5 }} />
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} style={{ position: 'absolute', left: 160 + i * 120, top: 754, width: 1, height: 12, background: colors.muted, opacity: 0.28 }} />
          ))}
          {YEARS.map(([y, x]) => (
            <div key={y} style={{ position: 'absolute', left: x - 40, top: 790, fontFamily: mono, fontSize: 22, letterSpacing: '0.1em', color: colors.muted, opacity: 0.55, fontVariantNumeric: 'tabular-nums' }}>{y}</div>
          ))}
          {/* s21 交接：印章停在时间轴起点 */}
          <div style={{ position: 'absolute', left: 400, top: 425, width: 1120, height: 240 }}>
            <div style={{ position: 'absolute', inset: 0, border: `5px solid ${colors.seal}`, borderRadius: 6, opacity: 0.9 }} />
            <div style={{ position: 'absolute', inset: 12, border: `2px solid ${colors.seal}`, opacity: 0.5 }} />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingBottom: 22, fontFamily: mono, fontSize: 36, letterSpacing: '0.02em', color: colors.seal, whiteSpace: 'pre' }}>feat(init): 基于nextjs构建的monorepos项目</div>
            <div style={{ position: 'absolute', right: 30, bottom: 13, fontFamily: mono, fontSize: 15, color: colors.seal, opacity: 0.6, fontVariantNumeric: 'tabular-nums' }}>2024-12-08</div>
          </div>
        </div>
        {/* FN-21 七点弧线接回主时间轴 */}
        <svg style={{ position: 'absolute', left: 0, top: 0, width: 3000, height: 1080 }} viewBox="0 0 3000 1080">
          <path d={ARC} fill="none" stroke={colors.accent} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" opacity={0.85} style={arc} />
        </svg>
        {/* 7 枚提交墨点，前 4 先落、后 3 加速 */}
        {DOT_X.map((x, i) => {
          const landAt = LAND[i];
          const t = frame - landAt;
          const fall = interpolate(frame, [landAt - 8, landAt], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseIn });
          const bloom = interpolate(t, [0, 8], [0.4, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
          const ring = interpolate(t, [4, 22], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
          const y = dotY(i);
          const shown = frame >= landAt - 8;
          return (
            <div key={`dot-${i}`}>
              <div style={{ position: 'absolute', left: x - 15, top: y - 15, width: 30, height: 30, borderRadius: 15, background: colors.gold, filter: 'blur(9px)', opacity: 0.42 * lit * pulse }} />
              <div style={{ position: 'absolute', left: x - 8, top: y - 8, width: 16, height: 16, borderRadius: 8, background: colors.ink, opacity: shown ? 0.92 : 0, transform: `translateY(${(1 - fall) * -54}px) scale(${bloom})` }} />
              {ring > 0 && ring < 1 ? (
                <div style={{ position: 'absolute', left: x - 8 - ring * 20, top: y - 8 - ring * 20, width: 16 + ring * 40, height: 16 + ring * 40, borderRadius: '50%', border: `1.5px solid ${colors.accent}`, opacity: 0.5 * (1 - ring) }} />
              ) : null}
              {i < LABELS.length ? (
                <div style={{ position: 'absolute', left: x + 16, top: y + 10, fontFamily: mono, fontSize: 15, letterSpacing: '0.06em', color: colors.muted, opacity: interpolate(t, [10, 24], [0, 0.7], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>{LABELS[i]}</div>
              ) : null}
            </div>
          );
        })}
      </div>
      {/* TR-10 光沉：暗角与压暗 */}
      <div style={{ position: 'absolute', inset: 0, opacity: dark * 0.6, backgroundImage: vignette }} />
      <DustField act={3} seedBase="s22" />
      <PaperGrain opacity={0.05} />
      <Grade id="GR-02" />
      {/* 字幕底衬：纸上压一层暗坡，保证字幕可读 */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 250, backgroundImage: `linear-gradient(0deg, ${colors.bg}, transparent)`, opacity: 0.5 * capIn }} />
      <Caption text="同一天，七次初始化提交。" appearAt={78} />
    </AbsoluteFill>
  );
};

export default ShotInitDots;
