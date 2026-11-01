/* 镜 46 · Act 7 坐忘 · 局部帧 [0,180) · 180f
   后两句在下半留白处落下（半拍/字），与前两句合成完整四句；
   仍为零运镜（CM-01，禁 CM-02/CM-14），末 20f 极轻 1% 下移（CM-03）引向落款位；
   纸页底部浮出空落款位；GR-02。 */
import type { CSSProperties, FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, HALF_BEAT, letterpress } from '../motion-tokens';
import { Caption } from '../components/Caption';
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

const PageColumn: FC<{ frame: number; text: string; start: number; landed?: boolean }> = ({ frame, text, start, landed = false }) => (
  <div style={COLUMN_STYLE}>
    {Array.from(text).map((ch, i) => (
      <span key={`${ch}-${i}`} style={{ display: 'inline-block', ...letterpress(frame, landed ? -20 : start + i * HALF_BEAT, 1) }}>
        {ch}
      </span>
    ))}
  </div>
);

const ShotPoemSecondHalf: FC = () => {
  const frame = useCurrentFrame();
  const light = interpolate(frame, [0, 180], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const shift = interpolate(frame, [160, 180], [0, 11], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const slot = interpolate(frame, [146, 176], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });

  return (
    <AbsoluteFill style={{ background: colors.paper }}>
      <AbsoluteFill style={{ backgroundImage: `linear-gradient(180deg, ${colors.gold} 0%, transparent 58%)`, opacity: 0.12 + light * 0.08, mixBlendMode: 'screen' }} />
      <div style={{ position: 'absolute', inset: 0, transform: `translateY(${shift}px)` }}>
        {/* 上阕：承接 s45 已落定 */}
        <div style={{ position: 'absolute', left: 0, right: 0, top: UPPER_TOP, display: 'flex', justifyContent: 'center', gap: COLUMN_GAP }}>
          <PageColumn frame={frame} text="少思慧烛内光。" start={0} landed />
          <PageColumn frame={frame} text="常默元气不伤，" start={0} landed />
        </div>
        {/* 下阕：在下半留白处落下 */}
        <div style={{ position: 'absolute', left: 0, right: 0, top: LOWER_TOP, display: 'flex', justifyContent: 'center', gap: COLUMN_GAP }}>
          <PageColumn frame={frame} text="不恼心地清凉。" start={90} />
          <PageColumn frame={frame} text="不怒百神和畅，" start={10} />
        </div>
        {/* 空落款位 */}
        <div style={{ position: 'absolute', right: 220, bottom: 118, width: 330, height: 2, background: colors.ink, opacity: 0.14 * slot }} />
      </div>
      {/* 底部纸面暗带：给字幕留对比 */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 260, backgroundImage: `linear-gradient(180deg, transparent, ${colors.bg})`, opacity: 0.16 }} />
      <PaperGrain opacity={0.07} />
      <Grade id="GR-02" />
      <Caption text="不怒百神和畅，不恼心地清凉。" appearAt={64} />
    </AbsoluteFill>
  );
};

export default ShotPoemSecondHalf;
