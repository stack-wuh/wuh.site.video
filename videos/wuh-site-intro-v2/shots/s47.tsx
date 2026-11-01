/* 镜 47 · Act 7 坐忘 · 局部帧 [0,108) · 108f
   落款位以笔锋写下「——司马承祯《坐忘歌》」（clip 生长 + 细线 stroke 生长），
   纸角一枚 16px 级「忘」字闲章（章落 4f，FN-09/FN-10 同工艺）；
   微距俯拍落款起手，CM-04 100→102% 缓拉露出整页；画面文字即落款，不用 Caption；GR-02 + GR-03。 */
import type { CSSProperties, FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, letterpress, paperBreathe, pathDraw, sealTilt } from '../motion-tokens';
import { PaperGrain } from '../components/PaperGrain';
import { Grade } from '../components/Grade';

const UPPER_TOP = 96;
const LOWER_TOP = 486;
const COLUMN_GAP = 130;

const COLUMN_STYLE: CSSProperties = {
  writingMode: 'vertical-rl',
  fontFamily: fontFamilies.serif,
  fontSize: 34,
  lineHeight: 1,
  letterSpacing: '0.42em',
  color: colors.ink,
};

const PageColumn: FC<{ frame: number; text: string }> = ({ frame, text }) => (
  <div style={COLUMN_STYLE}>
    {Array.from(text).map((ch, i) => (
      <span key={`${ch}-${i}`} style={{ display: 'inline-block', ...letterpress(frame, -20, 1) }}>
        {ch}
      </span>
    ))}
  </div>
);

const ShotSignatureSeal: FC = () => {
  const frame = useCurrentFrame();
  const camera = interpolate(frame, [60, 108], [1.02, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const release = interpolate(frame, [60, 108], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const write = interpolate(frame, [14, 58], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const sealP = interpolate(frame, [64, 68], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  const breathe = paperBreathe(frame, 0.5);

  return (
    <AbsoluteFill style={{ background: colors.paper }}>
      <AbsoluteFill style={{ ...breathe, transform: `${breathe.transform} scale(${camera})` }}>
        {/* 四句：起手微距只锁落款，缓拉时整页入焦 */}
        <div style={{ position: 'absolute', inset: 0, filter: `blur(${(1 - release) * 1.4 + 0.2}px)` }}>
          <div style={{ position: 'absolute', left: 0, right: 0, top: UPPER_TOP, display: 'flex', justifyContent: 'center', gap: COLUMN_GAP }}>
            <PageColumn frame={frame} text="少思慧烛内光。" />
            <PageColumn frame={frame} text="常默元气不伤，" />
          </div>
          <div style={{ position: 'absolute', left: 0, right: 0, top: LOWER_TOP, display: 'flex', justifyContent: 'center', gap: COLUMN_GAP }}>
            <PageColumn frame={frame} text="不恼心地清凉。" />
            <PageColumn frame={frame} text="不怒百神和畅，" />
          </div>
        </div>

        {/* 落款位：白线即上一镜浮出的空位 */}
        <div style={{ position: 'absolute', right: 220, bottom: 118, width: 330, height: 2, background: colors.ink, opacity: 0.14 }} />

        {/* 笔锋落款 */}
        <div style={{ position: 'absolute', right: 232, bottom: 132 }}>
          <div style={{ position: 'relative', clipPath: `inset(-12% ${100 - write * 100}% -12% -2%)` }}>
            <span style={{ fontFamily: fontFamilies.serif, fontSize: 32, letterSpacing: '0.1em', color: colors.ink, whiteSpace: 'nowrap' }}>——司马承祯《坐忘歌》</span>
            <svg width={462} height={14} style={{ position: 'absolute', left: 0, bottom: -12 }}>
              <path d="M2 9 C 128 5, 320 8, 460 6" fill="none" stroke={colors.ink} strokeWidth={1.3} strokeLinecap="round" style={pathDraw(frame, 14, 44, 460)} />
            </svg>
          </div>
        </div>

        {/* 纸角「忘」小章：16px 级，章落 4f */}
        <div
          style={{
            position: 'absolute',
            right: 168,
            bottom: 88,
            width: 34,
            height: 34,
            borderRadius: 3,
            background: colors.seal,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: fontFamilies.serif,
            fontSize: 16,
            color: colors.paper,
            opacity: sealP,
            transform: `translateY(${(1 - sealP) * 1.5}px) rotate(${sealTilt('s47')}deg) scale(${1.4 - sealP * 0.4})`,
          }}
        >
          忘
        </div>
      </AbsoluteFill>
      <PaperGrain opacity={0.07} />
      <Grade id="GR-02" />
      <Grade id="GR-03" />
    </AbsoluteFill>
  );
};

export default ShotSignatureSeal;
