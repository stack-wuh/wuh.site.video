/* S32 · Act 6 入院 · 局部帧 [0,96) · 96f · 绝对 4730–4826
 *
 * 书架：光标移 03→点击→最大化（0–18）；S04 微信读书书架打底 + WIN-01；
 * 骨架屏微光横扫 45f（18–63）+ 真封面书脊 cascade 落架（24–74，≤24 可见，
 * p-books 由数据单元重绘仅画面散文）；低机位掠过书墙，抽出一本移近（74–90，
 * 物动镜不动：真封面卡 + 书名 +「阅读中」徽章）；收束（80–96）→04。
 * 转场：入「切」，出「切」。字幕安全窗：start≥12、end≤84。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, writeFade } from '../../../brand/motion';
import { ConsoleCursor, ConsolePanel } from '../components/ConsolePanel';
import { ExpandWindow } from '../components/ExpandWindow';
import { Caption } from '../components/Caption';
import { DustField } from '../components/DustField';
import { Grade } from '../components/Grade';
import { lightSweep } from '../motion-tokens';
import { PaperGrain } from '../components/PaperGrain';

const TOTAL = 96;
const SPINE_COLORS = ['#8a4a3a', '#3e5a4e', '#5a4a6e', '#6e5a3e', '#4a5a6e', '#7a3e4e', '#4e6e5a', '#6e3e5a', '#3a5a7a', '#6e6e3e', '#5a3a3e', '#3e6e6e', '#7a5a3a', '#4a3e6e', '#5e6e4a', '#6e4a3e', '#3e4e6e', '#6e5a5a', '#4e7a5a', '#6e3e6e', '#3e6e4e', '#7a4e3e', '#4e3e5a', '#5e4e3e'];

const S32: FC = () => {
  const frame = useCurrentFrame();
  const expanded = frame >= 2 && frame < TOTAL - 14;
  const tailPanel = frame >= TOTAL - 14;
  const sweep = lightSweep(frame, 18, 45);
  const pullIn = writeFade(frame, 74, true);
  const cam = { scale: 1.04, x: 0, y: 0, rot: 0 };

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      {!expanded ? (
        <>
          <ConsolePanel lit={2} active={3} panelIn={1} />
          <ConsoleCursor active={3} moveProgress={interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })} />
          {tailPanel ? <ConsolePanel lit={3} active={4} panelIn={1} /> : null}
          {tailPanel ? <ConsoleCursor active={4} moveProgress={interpolate(frame, [TOTAL - 14, TOTAL], [0, 0.6], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })} /> : null}
        </>
      ) : (
        <ExpandWindow startAt={2} total={TOTAL} block={3} asset="wuh-site-intro-v3/site/s04-weread-v1.png" dim={0.26} objectPos="center">
          {/* 骨架屏微光横扫（1.5s ≈ 45f） */}
          <div style={{ position: 'absolute', top: 0, bottom: 0, width: 320, left: sweep.sweepX, background: `linear-gradient(90deg, transparent, ${FILM_MIST}, transparent)`, mixBlendMode: 'screen', opacity: sweep.sweepOpacity * 1.4 }} />
          {/* 真封面书脊 cascade 落架（24–74，≤24 可见；数据单元重绘 p-books） */}
          {SPINE_COLORS.map((c, i) => {
            const land = 24 + i * 2;
            const on = frame >= land;
            const rise = interpolate(frame, [land, land + 8], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
            return (
              <div key={i} style={{ position: 'absolute', left: 120 + i * 70, bottom: 120, width: 54, height: 300 - (i % 5) * 22, background: c, opacity: on ? 0.85 : 0, transform: `translateY(${rise * 40}px)`, borderRadius: '3px 3px 1px 1px' }}>
                <div style={{ position: 'absolute', left: 8, right: 8, top: 20, height: 2, background: colors.paper, opacity: 0.3 }} />
                <div style={{ position: 'absolute', left: 8, right: 8, top: 30, height: 2, background: colors.paper, opacity: 0.2 }} />
              </div>
            );
          })}
          {/* 抽出一本移近画幅（物动镜不动） */}
          <div style={{ position: 'absolute', right: 150, top: 220, width: 430, ...pullIn }}>
            <div style={{ position: 'relative', borderRadius: 6, background: colors.paperDeep, border: `1px solid ${colors.hairline}`, boxShadow: '0 24px 60px rgba(0,0,0,0.5)', padding: '26px 30px 30px' }}>
              <div style={{ width: 150, height: 210, margin: '0 auto', background: '#5a4a3a', borderRadius: 4, border: `1px solid ${colors.hairline}` }} />
              <div style={{ textAlign: 'center', marginTop: 18, fontFamily: fontFamilies.serif, fontSize: 26, color: colors.paper, opacity: 0.9 }}>中国古代文化常识</div>
              <div style={{ textAlign: 'center', marginTop: 10 }}>
                <span style={{ fontFamily: fontFamilies.mono, fontSize: 14, color: FILM_MIST, border: `1px solid ${colors.gold}`, padding: '3px 12px', opacity: 0.85 }}>阅读中</span>
              </div>
            </div>
          </div>
        </ExpandWindow>
      )}
      <DustField act={6} count={10} seedBase="s32" />
      <PaperGrain opacity={0.05} />
      <Grade id="GR-01" />
      <Caption text="读过的书，都站在这里。" appearAt={14} />
    </AbsoluteFill>
  );
};

const FILM_MIST = '#F5E9C8';

export default S32;
