/* S33 · Act 6 入院 · 局部帧 [0,186) · 186f · 绝对 4826–5012
 *
 * 音乐年轮：光标移 04→点击→最大化（0–18）；S05 音乐页打底 + WIN-01；
 * 黑胶 5s/圈（150f 绝对时间不对拍，持续旋转）+ 俯拍同轴缓旋（cam-coax 仅此镜）；
 * 年份环走过一年（18–170，8 年 sweep ~19f/年，年度最爱逐环亮出——标识不滚数）；
 * 唱针 12f 落碟心（62–74，落定 74=绝对 4900=拍245 对音）；
 * ★DAT-04 EQ 三墨柱 CHART-GROW 起势（74–84）→ eqBars 相位差贴拍；
 * p-music-player 迷你播放器就位（114–134）+ 跑马灯；唱针抬起（164–170）→收束（170–186）。
 * 转场：入「切」，出「切」。两句字幕 ／ 分序：句 1 appearAt 20、句 2 appearAt 112（先后衔接，不叠字）。
 */
import type { FC } from 'react';
import { AbsoluteFill, Img, interpolate, useCurrentFrame } from 'remotion';
import { staticFile } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, eqBars, writeFade } from '../../../brand/motion';
import { ConsoleCursor, ConsolePanel } from '../components/ConsolePanel';
import { ExpandWindow } from '../components/ExpandWindow';
import { DustField } from '../components/DustField';
import { Grade } from '../components/Grade';
import { PaperGrain } from '../components/PaperGrain';

/* 年度最爱（八年歌单播放之最；materials v3 §2.8，沿 v2 私有快照 2026-10-25 抓取——标识不滚数） */
const YEARS_FAV = [
  { year: 2018, song: '《诱惑的街 (Live)》林志炫' },
  { year: 2019, song: '《腻味》金玟岐' },
  { year: 2020, song: '《少年不凡》刘美麟' },
  { year: 2021, song: '《风月缠绵（金风玉露变奏）》陈致逸' },
  { year: 2022, song: '《归期》钱润玉' },
  { year: 2023, song: '《爱意（金风玉露变奏）》陈致逸' },
  { year: 2024, song: '《爱意（金风玉露变奏）》陈致逸' },
  { year: 2025, song: '《爱意（金风玉露变奏）》陈致逸' },
];

const TOTAL = 186;
const NEEDLE_LAND = 74; // = 绝对 4900 = 拍245

/** 顺序字幕（两句 ／ 同镜先后衔接，句窗不重叠；film-kit Caption 单 cue 版式） */
const SeqCaption: FC<{ text: string; from: number; to: number; total: number }> = ({ text, from, to, total }) => {
  const frame = useCurrentFrame();
  if (frame < from || frame >= to) return null;
  const local = frame - from;
  const out = interpolate(local, [to - from - 12, to - from], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 150, textAlign: 'center', zIndex: 30, opacity: Math.min(1, interpolate(local, [0, 10], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })) * out }}>
      <span style={{ fontFamily: fontFamilies.serif, fontSize: 40, color: colors.paper, textShadow: `0 2px 18px ${colors.bg}` }}>{text}</span>
      <span style={{ display: 'block', height: 0 }} />
      <span style={{ position: 'absolute', left: 0, right: 0, bottom: -30, textAlign: 'center', fontFamily: fontFamilies.mono, fontSize: 12, color: colors.muted, opacity: 0.5 }}>{total}</span>
    </div>
  );
};

const S33: FC = () => {
  const frame = useCurrentFrame();
  const expanded = frame >= 2 && frame < TOTAL - 16;
  const tailPanel = frame >= TOTAL - 16;
  const vinylDeg = (frame * 2.4) % 360; // 黑胶 5s/圈 = 150f/圈 → 2.4°/f
  // 年份环 sweep（18–170，8 年）
  const yearK = interpolate(frame, [18, 170], [0, 8], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const yearIdx = Math.min(7, Math.floor(yearK));
  // 唱针（62–74 落下，落定=拍245；164–170 抬起）
  const needleDrop = interpolate(frame, [62, NEEDLE_LAND], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  const needleUp = interpolate(frame, [164, 170], [1, 0.2], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const needle = Math.min(needleDrop, needleUp);
  // ★DAT-04 EQ 起势（74–84）→ 相位差贴拍
  const eqGrow = interpolate(frame, [NEEDLE_LAND, 84], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  const bars = eqBars(frame);
  const playerIn = writeFade(frame, 114, true);

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      {!expanded ? (
        <>
          <ConsolePanel lit={3} active={4} panelIn={1} />
          <ConsoleCursor active={4} moveProgress={interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })} />
          {tailPanel ? <ConsolePanel lit={4} active={5} panelIn={1} /> : null}
          {tailPanel ? <ConsoleCursor active={5} moveProgress={interpolate(frame, [TOTAL - 16, TOTAL], [0, 0.6], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })} /> : null}
        </>
      ) : (
        <ExpandWindow startAt={2} total={TOTAL} block={4} asset="wuh-site-intro-v3/site/s05-music-v1.png" dim={0.24} objectPos="center">
          {/* 黑胶（俯拍同轴缓旋：碟面自转） */}
          <div style={{ position: 'absolute', left: 700, top: 300, width: 520, height: 520 }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: 260, background: `radial-gradient(circle, #1a1512 0%, #241d18 30%, #16110d 62%)`, border: `1px solid ${colors.hairline}`, transform: `rotate(${vinylDeg}deg)` }}>
              <div style={{ position: 'absolute', left: '50%', top: '50%', width: 150, height: 150, borderRadius: 75, transform: 'translate(-75px,-75px)', background: `radial-gradient(circle, ${colors.gold} 0%, transparent 70%)`, opacity: 0.35 }} />
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} style={{ position: 'absolute', inset: 40 + i * 44, borderRadius: 260 - i * 88, border: `1px solid rgba(255,255,255,0.05)` }} />
              ))}
            </div>
            {/* 唱针（12f 落碟心） */}
            <div style={{ position: 'absolute', right: -20, top: 30, width: 130, height: 8, borderRadius: 4, background: colors.paper, opacity: 0.85, transform: `rotate(${18 + needle * 24}deg)`, transformOrigin: 'right center' }} />
            <div style={{ position: 'absolute', right: -26, top: 20, width: 26, height: 26, borderRadius: 13, background: colors.muted, opacity: 0.7 }} />
          </div>
          {/* 年份环 + 年度最爱题签（逐环亮出，标识不滚数） */}
          <div style={{ position: 'absolute', left: 200, top: 240, width: 380 }}>
            {YEARS_FAV.map((y, i) => {
              const on = frame >= 18 + i * 19;
              return (
                <div key={y.year} style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 12, opacity: on ? 0.95 : 0.25, transform: on ? 'translateX(0)' : 'translateX(-8px)' }}>
                  <span style={{ fontFamily: fontFamilies.serif, fontSize: 26, color: i === yearIdx ? colors.gold : colors.paper, fontVariantNumeric: 'tabular-nums' }}>{y.year}</span>
                  <span style={{ fontFamily: fontFamilies.serif, fontSize: 17, color: colors.muted }}>{on ? y.song : '· · ·'}</span>
                </div>
              );
            })}
          </div>
          {/* EQ 三墨柱（CHART-GROW 起势 → 相位差贴拍） */}
          <div style={{ position: 'absolute', left: 1210, top: 560, display: 'flex', gap: 26, alignItems: 'flex-end' }}>
            {bars.map((v, i) => (
              <div key={i} style={{ width: 34, height: eqGrow * (60 + v * 130), background: colors.ink, opacity: 0.85, borderRadius: 4 }} />
            ))}
          </div>
          {/* p-music-player 迷你播放器就位（114–134）+ 跑马灯 */}
          <div style={{ position: 'absolute', left: 120, bottom: 120, width: 440, ...playerIn }}>
            <Img src={staticFile('wuh-site-intro-v3/site/p-music-player-v1.png')} style={{ width: '100%', borderRadius: 10, border: `1px solid ${colors.hairline}`, boxShadow: '0 18px 44px rgba(0,0,0,0.5)' }} />
            <div style={{ position: 'absolute', left: 90, top: 24, width: 210, overflow: 'hidden' }}>
              <div style={{ fontFamily: fontFamilies.mono, fontSize: 13, color: colors.paper, opacity: 0.75, whiteSpace: 'nowrap', transform: `translateX(${interpolate(frame % 120, [0, 120], [0, -60])}px)` }}>风月缠绵 · 陈致逸 · 金风玉露变奏</div>
            </div>
          </div>
        </ExpandWindow>
      )}
      <DustField act={6} count={10} seedBase="s33" />
      <PaperGrain opacity={0.05} />
      <Grade id="GR-04" />
      <SeqCaption text="时间的年轮，刻着每一年的歌。" from={20} to={106} total={TOTAL} />
      <SeqCaption text="黑胶还在转，时光没走远。" from={112} to={168} total={TOTAL} />
    </AbsoluteFill>
  );
};

export default S33;
