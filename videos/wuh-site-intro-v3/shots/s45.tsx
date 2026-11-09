/* S45 · Act 7 坐忘 · 局部帧 [0,174) · 174f · 绝对 5954–6128
 *
 * 阅读之最：窗台纸页亮起为热度榜——S03 文章页打底（WIN-01 页内点亮展开 0–20，
 * WIN-03 驻定巡视 ≤1.06）；榜单自下而上滚动由快到停（20–106，末 30f 几乎静止）；
 * ★DAT-01 阅读数 0→1,842（46–106，落定 106=绝对 6060=拍303 对音，与榜单停同帧）；
 * 第二名 1,513 等背景虚化（Staging：滚数时其余静止）；凝住不推；
 * 末 18f 第一名纸页翻起一半（156–174）。转场：入「切」，出「切」。
 * 字幕安全窗：start≥12。
 */
import type { FC } from 'react';
import { AbsoluteFill, Img, interpolate, useCurrentFrame } from 'remotion';
import { staticFile } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, writeFade } from '../../../brand/motion';
import { fmtNum, numRoll, panePan, ROLL_DUR } from '../motion-tokens';
import { Caption } from '../components/Caption';
import { DustField } from '../components/DustField';
import { Grade } from '../components/Grade';
import { PaperGrain } from '../components/PaperGrain';

const TOTAL = 174;
const ROLL_END = 106; // = 绝对 6060 = 拍303
const RANKS = [
  { title: '再读《坐忘歌》', views: 1842, top: true },
  { title: 'codex 的开发范式', views: 1513 },
  { title: '重启计划', views: 1375 },
  { title: 'docker 配置镜像源', views: 1298 },
  { title: '使用 vitepress 搭建 wiki', views: 1271 },
];

const S45: FC = () => {
  const frame = useCurrentFrame();
  const views = Math.round(numRoll(frame, 46, ROLL_DUR.significant, 0, 1842));
  // 榜单滚动（20–106 由快到停：easeOut 长尾）
  const scrollP = interpolate(frame, [20, ROLL_END], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  const pan = panePan(frame, 20, 120, { x: -10, y: -8 }, 1.05);
  const cam = { scale: 1.03, x: 0, y: 0, rot: 0 };
  const foldUp = interpolate(frame, [156, TOTAL], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <div style={{ position: 'absolute', inset: 0 }}>
        {/* S03 文章页打底（页内点亮展开） */}
        <Img
          src={staticFile('wuh-site-intro-v3/site/s03-post-165-v1.png')}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%', ...pan }}
        />
        <AbsoluteFill style={{ background: colors.bg, opacity: interpolate(frame, [0, 20], [0.4, 0.34], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }} />

        {/* 热度榜（自下而上滚动，末 30f 几乎静止） */}
        <div style={{ position: 'absolute', left: 300, top: 190, width: 1320, zIndex: 30 }}>
          <div style={{ ...writeFade(frame, 16), marginBottom: 18 }}>
            <span style={{ fontFamily: fontFamilies.mono, fontSize: 16, color: colors.muted, letterSpacing: '0.24em' }}>热 度 榜 · 2026-07</span>
          </div>
          <div style={{ transform: `translateY(${(1 - scrollP) * 320}px)` }}>
            {RANKS.map((r, i) => (
              <div
                key={r.title}
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: 26,
                  padding: '20px 30px',
                  marginBottom: 14,
                  borderRadius: 6,
                  background: r.top ? colors.paper : 'transparent',
                  border: r.top ? `1px solid ${colors.gold}` : `1px solid ${colors.hairline}`,
                  opacity: r.top ? 1 : interpolate(frame, [60 + i * 10, 76 + i * 10], [0.5, 0.28], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
                  filter: r.top ? 'none' : `blur(${interpolate(frame, [ROLL_END - 20, ROLL_END], [1.5, 2.5], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}px)`,
                }}
              >
                <span style={{ fontFamily: fontFamilies.mono, fontSize: 22, color: r.top ? colors.seal : colors.muted, fontVariantNumeric: 'tabular-nums' }}>{i + 1}</span>
                <span style={{ fontFamily: fontFamilies.serif, fontSize: r.top ? 40 : 30, color: r.top ? colors.ink : colors.muted }}>{r.title}</span>
                <span style={{ marginLeft: 'auto', fontFamily: fontFamilies.mono, fontSize: r.top ? 46 : 26, color: r.top ? colors.seal : colors.muted, fontVariantNumeric: 'tabular-nums' }}>
                  {r.top ? fmtNum(views) : fmtNum(r.views)}
                </span>
                <span style={{ fontFamily: fontFamilies.mono, fontSize: 18, color: colors.muted, opacity: 0.7 }}> 次</span>
              </div>
            ))}
          </div>
        </div>

        {/* 末 18f：第一名纸页翻起一半 */}
        <div style={{ position: 'absolute', left: 300, top: 236, width: 1320, height: 120, transformOrigin: 'bottom center', transform: `perspective(1400px) rotateX(${foldUp * -42}deg)`, opacity: foldUp, background: colors.paper, borderRadius: 6, border: `1px solid ${colors.gold}`, zIndex: 31 }} />
      </div>
      <DustField act={7} count={10} seedBase="s45" />
      <PaperGrain opacity={0.05} />
      <Grade id="GR-02" />
      <Caption text="七月，全站阅读最多的一篇不是技术，是《再读〈坐忘歌〉》——1,842 次。" appearAt={14} />
    </AbsoluteFill>
  );
};

export default S45;
