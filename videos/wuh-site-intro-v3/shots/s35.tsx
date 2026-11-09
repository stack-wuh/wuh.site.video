/* S35 · Act 6 入院 · 局部帧 [0,88) · 88f · 绝对 5084–5172
 *
 * 两种人格（其二）：同一展开态另一窗推开（0–18）；S07 About 弹幕聊天室打底
 * （1120×720 Dialog）：左右分列聊天气泡交替弹入（18–66，左纸色/右朱红带尾巴，
 * 半拍错峰）；微距俯拍轻微横摇 ±2°；两列气泡聚成一点（66–74）→收束回面板
 * （72–88），lit={01–05}→06。转场：入「切」，出「切」。
 * 字幕安全窗：start≥12、end≤76。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES } from '../../../brand/motion';
import { ConsoleCursor, ConsolePanel } from '../components/ConsolePanel';
import { ExpandWindow } from '../components/ExpandWindow';
import { Caption } from '../components/Caption';
import { DustField } from '../components/DustField';
import { Grade } from '../components/Grade';
import { PaperGrain } from '../components/PaperGrain';

const TOTAL = 88;
const BUBBLES = [
  { side: 'L' as const, name: 'Shadow', text: '潘江陆海，各洒云尔~~' },
  { side: 'R' as const, name: '路人', text: '看着不错来玩一下' },
  { side: 'L' as const, name: '远方的名字', text: '聊天式留言比弹幕更容易回看。' },
  { side: 'R' as const, name: 'shshhhsh', text: '随便输入一点什么东西' },
  { side: 'L' as const, name: 'Shadow', text: '见字如面，各洒云尔~' },
  { side: 'R' as const, name: 'kkaksddd', text: '打招呼' },
];

const S35: FC = () => {
  const frame = useCurrentFrame();
  const expanded = frame >= 2 && frame < TOTAL - 14;
  const tailPanel = frame >= TOTAL - 14;
  // 轻微横摇 ±2°
  const camYaw = Math.sin(frame / 22) * 0.5;
  const cam = { scale: 1.05, x: camYaw * 12, y: 0, rot: camYaw };
  // 气泡聚点（66–74）
  const converge = interpolate(frame, [66, 74], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseIn });

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      {!expanded ? (
        <>
          <ConsolePanel lit={4} active={5} panelIn={1} />
          <ConsoleCursor active={5} moveProgress={interpolate(frame, [0, 6], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })} />
          {tailPanel ? <ConsolePanel lit={5} active={6} panelIn={1} /> : null}
          {tailPanel ? <ConsoleCursor active={6} moveProgress={interpolate(frame, [TOTAL - 14, TOTAL], [0, 0.6], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })} /> : null}
        </>
      ) : (
        <div style={{ position: 'absolute', inset: 0, transform: `translate(${(converge * (960 - 800))}px, ${(converge * (540 - 500))}px) scale(${1 - converge * 0.985})`, opacity: 1 - converge * 0.4 }}>
          <ExpandWindow startAt={0} total={TOTAL} block={5} asset="wuh-site-intro-v3/site/s07-about-barrage-v1.png" dim={0.3} objectPos="center">
            {/* Dialog 气泡交替弹入（18–66，半拍错峰） */}
            {BUBBLES.map((b, i) => {
              const t0 = 18 + i * 8;
              const local = frame - t0;
              if (local < 0) return null;
              const pop = interpolate(local, [0, 8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineAccent });
              const mine = b.side === 'R';
              return (
                <div key={i} style={{ position: 'absolute', left: mine ? undefined : 300, right: mine ? 300 : undefined, top: 130 + i * 86, opacity: pop, transform: `translateY(${(1 - pop) * 14}px)` }}>
                  <div style={{ display: 'flex', flexDirection: mine ? 'row-reverse' : 'row', alignItems: 'flex-end', gap: 12 }}>
                    <div style={{ maxWidth: 560, background: mine ? colors.seal : colors.paper, borderRadius: mine ? '12px 4px 12px 12px' : '4px 12px 12px 12px', padding: '12px 20px', opacity: 0.95 }}>
                      <div style={{ fontFamily: fontFamilies.mono, fontSize: 13, color: mine ? colors.paper : colors.muted, opacity: 0.8, textAlign: mine ? 'right' : 'left' }}>{b.name}</div>
                      <div style={{ fontFamily: fontFamilies.serif, fontSize: 22, color: mine ? colors.paper : colors.ink, marginTop: 4 }}>{b.text}</div>
                    </div>
                    {/* 小尾巴 */}
                    <div style={{ width: 0, height: 0, border: `8px solid transparent`, borderTopColor: mine ? colors.seal : colors.paper }} />
                  </div>
                </div>
              );
            })}
          </ExpandWindow>
        </div>
      )}
      <DustField act={6} count={8} seedBase="s35" />
      <PaperGrain opacity={0.05} />
      <Grade id="GR-03" />
      <Caption text="两种人格，一间屋子。" appearAt={20} />
    </AbsoluteFill>
  );
};

export default S35;
