/* S34 · Act 6 入院 · 局部帧 [0,72) · 72f · 绝对 5012–5084
 *
 * 安静半拍（两种人格·其一）：光标移 05→点击→最大化→05 展开态第一窗（0–18）；
 * S06 留言板打底（720px 窄栏）：纵线节点生长（18–48）、衬线斜体日期落位，
 * 安静的一列留言自己排好；半拍静置（48–72）——热闹在对面的窗里。
 * 转场：入「切」，出「切」。无字幕（安静半拍）。
 * 尾帧：留言板窄栏在左，弹幕窗将启（冻帧）。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, writeFade } from '../../../brand/motion';
import { ConsoleCursor, ConsolePanel } from '../components/ConsolePanel';
import { ExpandWindow } from '../components/ExpandWindow';
import { DustField } from '../components/DustField';
import { Grade } from '../components/Grade';
import { PaperGrain } from '../components/PaperGrain';

const TOTAL = 72;

const S34: FC = () => {
  const frame = useCurrentFrame();
  const expanded = frame >= 2;
  const cam = { scale: 1.04, x: 0, y: 0, rot: 0 };

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      {!expanded ? (
        <ConsolePanel lit={4} active={5} panelIn={interpolate(frame, [0, 8], [1, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })} />
      ) : (
        <ExpandWindow startAt={0} total={TOTAL} block={5} asset="wuh-site-intro-v3/site/s06-guestbook-v1.png" dim={0.28} objectPos="center">
          {/* 720px 窄栏：纵线节点生长（18–48）+ 留言自排 */}
          <div style={{ position: 'absolute', left: 560, top: 150, bottom: 120, width: 4 }}>
            {[0, 1, 2, 3, 4, 5].map((i) => {
              const grow = interpolate(frame, [18 + i * 6, 44 + i * 6], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
              return (
                <div key={i}>
                  <div style={{ position: 'absolute', left: 1, top: i * 110, width: 2, height: grow * 100, background: colors.muted, opacity: 0.5 }} />
                  <div style={{ position: 'absolute', left: -4, top: i * 110 + grow * 100 - 5, width: 12, height: 12, borderRadius: 6, background: colors.seal, opacity: grow * 0.85 }} />
                  {/* 留言行（衬线斜体日期 + 内容行，write-fade 自排） */}
                  <div style={{ position: 'absolute', left: 40, top: i * 110 + grow * 100 - 24, ...writeFade(frame, 20 + i * 6) }}>
                    <span style={{ fontFamily: fontFamilies.serif, fontSize: 15, fontStyle: 'italic', color: colors.muted }}>{['03-14', '04-02', '05-21', '06-08', '08-30', '10-17'][i]}</span>
                    <div style={{ width: 300 - (i % 3) * 60, height: 13, background: colors.paper, opacity: 0.5, marginTop: 8 }} />
                  </div>
                </div>
              );
            })}
          </div>
          {/* 右侧留白（弹幕窗将启的暗窗轮廓） */}
          <div style={{ position: 'absolute', right: 140, top: 180, bottom: 180, width: 500, border: `1px solid ${colors.hairline}`, opacity: 0.4, borderRadius: 8, background: `rgba(0,0,0,0.3)` }}>
            <span style={{ position: 'absolute', right: 20, bottom: 14, fontFamily: fontFamilies.mono, fontSize: 13, color: colors.muted, opacity: 0.6 }}>· · ·</span>
          </div>
        </ExpandWindow>
      )}
      <DustField act={6} count={8} seedBase="s34" />
      <PaperGrain opacity={0.05} />
      <Grade id="GR-01" />
    </AbsoluteFill>
  );
};

export default S34;
