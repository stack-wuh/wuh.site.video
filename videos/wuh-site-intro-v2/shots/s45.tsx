/* 镜 45 · Act 7 坐忘 · 局部帧 [0,180) · 180f
   承接 s44 翻起纸页（TR-03，入场 10f 内收拢）；纸页翻面，全屏只剩字：
   前两句竖排衬线、字距极宽，每字半拍落下，带极轻压痕（FN-29）；
   严格零运镜（CM-01，禁 CM-02/CM-14）——只有字的落下与光的变化；GR-02。 */
import type { CSSProperties, FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, HALF_BEAT, letterpress } from '../motion-tokens';
import { Caption } from '../components/Caption';
import { PaperGrain } from '../components/PaperGrain';
import { Grade } from '../components/Grade';

const UPPER_TOP = 96;
const COLUMN_GAP = 130;

const COLUMN_STYLE: CSSProperties = {
  writingMode: 'vertical-rl',
  fontFamily: fontFamilies.serif,
  fontSize: 34,
  lineHeight: 1,
  letterSpacing: '0.42em',
  color: colors.ink,
};

/* 竖排一列：每字按半拍落下；landed 用于承接前一镜已落定的字 */
const PageColumn: FC<{ frame: number; text: string; start: number; landed?: boolean }> = ({ frame, text, start, landed = false }) => (
  <div style={COLUMN_STYLE}>
    {Array.from(text).map((ch, i) => (
      <span key={`${ch}-${i}`} style={{ display: 'inline-block', ...letterpress(frame, landed ? -20 : start + i * HALF_BEAT, 1) }}>
        {ch}
      </span>
    ))}
  </div>
);

const ShotPoemFirstHalf: FC = () => {
  const frame = useCurrentFrame();
  const turn = interpolate(frame, [0, 10], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  const light = interpolate(frame, [0, 180], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });

  return (
    <AbsoluteFill style={{ background: colors.paper }}>
      <div style={{ position: 'absolute', inset: 0, perspective: 1800 }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transformOrigin: 'left center',
            transform: `rotateY(${(1 - turn) * -16}deg)`,
          }}
        >
          {/* 光的极缓变化（非运镜） */}
          <AbsoluteFill style={{ backgroundImage: `linear-gradient(180deg, ${colors.gold} 0%, transparent 58%)`, opacity: 0.1 + light * 0.1, mixBlendMode: 'screen' }} />
          <div style={{ position: 'absolute', left: 0, right: 0, top: UPPER_TOP, display: 'flex', justifyContent: 'center', gap: COLUMN_GAP }}>
            <PageColumn frame={frame} text="少思慧烛内光。" start={82} />
            <PageColumn frame={frame} text="常默元气不伤，" start={12} />
          </div>
        </div>
      </div>
      {/* 底部纸面暗带：给字幕留对比 */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 300, backgroundImage: `linear-gradient(180deg, transparent, ${colors.bg})`, opacity: 0.16 }} />
      <PaperGrain opacity={0.07} />
      <Grade id="GR-02" />
      <Caption text="常默元气不伤，少思慧烛内光。" appearAt={60} />
    </AbsoluteFill>
  );
};

export default ShotPoemFirstHalf;
