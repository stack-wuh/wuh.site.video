/* S41 · Act 6 入院 · 局部帧 [0,60) · 60f · 绝对 5554–5614
 * 漫游连击 3/5：/guestbook 卡（S06 卡面）低角度上摇、卡面自画幅下缘升起；
 * 无字幕；入出皆切。尾帧：/guestbook 卡过。 */
import type { FC } from 'react';
import { AbsoluteFill, Img, interpolate, useCurrentFrame } from 'remotion';
import { staticFile } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES } from '../../../brand/motion';
import { cardReveal } from '../motion-tokens';
import { DustField } from '../components/DustField';
import { Grade } from '../components/Grade';
import { PaperGrain } from '../components/PaperGrain';

const TOTAL = 60;

const S41: FC = () => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [2, TOTAL], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const fade = interpolate(p, [0, 0.15, 0.85, 1], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const transform = `translateY(${interpolate(p, [0, 1], [420, -360])}px) rotateX(${interpolate(p, [0, 1], [-10, 6])}deg)`;

  return (
    <AbsoluteFill style={{ background: colors.bg, overflow: 'hidden' }}>
      <DustField act={6} count={6} seedBase="s41" />
      <div style={{ position: 'absolute', left: 520, top: 190, width: 880, height: 560, borderRadius: 10, overflow: 'hidden', border: `1px solid ${colors.hairline}`, boxShadow: '0 30px 90px rgba(0,0,0,0.5)', transform, opacity: fade }}>
        <Img src={staticFile('wuh-site-intro-v3/site/s06-guestbook-v1.png')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <AbsoluteFill style={{ background: colors.bg, opacity: 0.2 }} />
        {[0, 1, 2].map((r) => {
          const { mask, ink } = cardReveal(frame, 10 + r * 10, r);
          return (
            <div key={r} style={{ position: 'absolute', left: 60, top: 380 + r * 46, width: 640, height: 26, overflow: 'hidden' }}>
              <div style={{ width: `${mask}%`, height: 13, background: colors.paper, opacity: ink * 0.5 }} />
            </div>
          );
        })}
        <span style={{ position: 'absolute', left: 60, bottom: 26, fontFamily: fontFamilies.mono, fontSize: 15, color: colors.paper, opacity: 0.7, letterSpacing: '0.2em' }}>留言 · /GUESTBOOK</span>
      </div>
      <span style={{ position: 'absolute', right: 90, top: 70, fontFamily: fontFamilies.mono, fontSize: 15, color: colors.muted, opacity: 0.7, letterSpacing: '0.24em' }}>ROAM · 3/5</span>
      <PaperGrain opacity={0.05} />
      <Grade id="GR-01" />
    </AbsoluteFill>
  );
};

export default S41;
