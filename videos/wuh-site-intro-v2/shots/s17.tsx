/* 镜 17 · Act 3 第一行 · 局部帧 [0,156) · 156f
   灰纸上暖句逐字浮出（FN-29 letterpress + FN-02 write-fade 合流，衬线）；
   半句处纸面透暖金（GR-05→GR-04 双层 Grade opacity 插值），右下极小字「#37 · 2022」；
   末 30f CM-03 推 3%，尾帧灰纸掀角（FN-23 局部）；字幕为 #37 年度总结引句。 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, FILM_COLORS, letterpress, paperBreathe, writeFade } from '../motion-tokens';
import { Caption } from '../components/Caption';
import { DustField } from '../components/DustField';
import { PaperGrain } from '../components/PaperGrain';
import { Grade } from '../components/Grade';

const LINES = ['不要停步不前，', '每一天都要做出一点改变。'] as const;
const OFFSETS = LINES.map((_, li) => (li === 0 ? 0 : Array.from(LINES[li - 1]).length));

const ShotWarmQuote: FC = () => {
  const frame = useCurrentFrame();
  const warm = interpolate(frame, [30, 66], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const push = interpolate(frame, [126, 156], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const lift = interpolate(frame, [132, 150], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  const capIn = interpolate(frame, [30, 46], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  const scale = 1.1 * (1 + push * 0.03);

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, transform: `scale(${scale})`, transformOrigin: '50% 46%' }}>
        <div style={{ position: 'absolute', left: 80, top: 30, width: 1760, height: 1020, background: FILM_COLORS.blankPaper, overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, ...paperBreathe(frame, 0.5) }}>
            {/* 同一张年度总结纸页的页眉与上下文行块 */}
            <div style={{ position: 'absolute', left: 90, top: 58, fontFamily: fontFamilies.mono, fontSize: 15, letterSpacing: '0.22em', color: colors.muted, opacity: 0.55, fontVariantNumeric: 'tabular-nums' }}>2022-02-08</div>
            <div style={{ position: 'absolute', left: 90, top: 98, width: 1580, height: 1, background: FILM_COLORS.wireGrey, opacity: 0.45 }} />
            {[64, 88, 52].map((w, i) => (
              <div key={`top-${i}`} style={{ position: 'absolute', left: 90, top: 140 + i * 34, width: `${w}%`, height: 12, borderRadius: 3, background: FILM_COLORS.greyMist, opacity: 0.2 }} />
            ))}
            {/* 半句处纸面透出的暖金 */}
            <div style={{ position: 'absolute', left: 300, top: 300, width: 1320, height: 430, borderRadius: '50%', background: colors.gold, filter: 'blur(90px)', opacity: 0.12 * warm }} />
            {/* 暖句逐字浮出 */}
            <div style={{ position: 'absolute', left: 220, top: 300, width: 1400 }}>
              {LINES.map((line, li) => (
                <div key={line} style={{ fontFamily: fontFamilies.serif, fontSize: 76, lineHeight: 1.85, letterSpacing: '0.08em', color: colors.ink, whiteSpace: 'nowrap' }}>
                  {Array.from(line).map((ch, ci) => {
                    const delay = 14 + (OFFSETS[li] + ci) * 2;
                    return (
                      <span key={ci} style={{ display: 'inline-block', ...letterpress(frame, delay, 2), ...writeFade(frame, delay) }}>{ch}</span>
                    );
                  })}
                </div>
              ))}
            </div>
            {[46, 72, 58, 84].map((w, i) => (
              <div key={`bot-${i}`} style={{ position: 'absolute', left: 90, top: 800 + i * 34, width: `${w}%`, height: 12, borderRadius: 3, background: FILM_COLORS.greyMist, opacity: 0.16 }} />
            ))}
            <div style={{ position: 'absolute', right: 90, bottom: 250, fontFamily: fontFamilies.mono, fontSize: 16, letterSpacing: '0.16em', color: colors.muted, opacity: 0.8, fontVariantNumeric: 'tabular-nums' }}>#37 · 2022</div>
          </div>
          {/* 尾帧掀角 */}
          <div style={{ position: 'absolute', right: 0, bottom: 0, width: 150, height: 150, transform: `rotate(${-26 * lift}deg)`, transformOrigin: '100% 100%', opacity: lift }}>
            <div style={{ position: 'absolute', inset: 0, background: FILM_COLORS.paperDeep, clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }} />
          </div>
        </div>
      </div>
      <DustField act={3} seedBase="s17" />
      <PaperGrain opacity={0.06} />
      <div style={{ position: 'absolute', inset: 0, opacity: 1 - warm * 0.85 }}><Grade id="GR-05" /></div>
      <div style={{ position: 'absolute', inset: 0, opacity: warm }}><Grade id="GR-04" /></div>
      {/* 字幕底衬：纸上压一层暗坡，保证字幕可读 */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 230, backgroundImage: `linear-gradient(0deg, ${colors.bg}, transparent)`, opacity: 0.55 * capIn }} />
      <Caption text="2022 年 2 月，他写《2022 年度总结》：『不要停步不前，每一天都要做出一点改变。』" appearAt={30} />
    </AbsoluteFill>
  );
};

export default ShotWarmQuote;
