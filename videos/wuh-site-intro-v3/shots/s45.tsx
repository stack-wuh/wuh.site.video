/* S45 · Act 7 坐忘 · 局部帧 [0,174) · 174f · 绝对 5954–6128
 * V2 深空数据流样片（2026-11-10 科技重构）：「网站截图当主角」的反转示范——
 * S03 文章页截图降级为证据快闪（0–16 显影放大 → 28 退场，全片证据窗口径）；
 * 主角 = 全屏巨大等宽数字 0→1,842（★DAT-01 46–106 滚动，落定 106=绝对 6060=拍303 对音，
 * 落定 SLAM 辉光脉冲 + scale 1.045→1）；《再读〈坐忘歌》》题名辉光；
 * CHART-FLOW 五条阅读横条按比例同窗生长（46–106，与数字同拍）；
 * 2–5 名数据行落定后淡入（Staging：滚数时其余静止）；末 18f 主条扫光（原纸页翻起的数据版）。
 * 转场：入「切」，出「切」。字幕安全窗：start≥12。
 */
import type { FC } from 'react';
import { AbsoluteFill, Img, interpolate, useCurrentFrame } from 'remotion';
import { staticFile } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { CURVES, writeFade } from '../../../brand/motion';
import { bigNum, chartBar, FILM_COLORS2, fmtNum, glowText } from '../motion-tokens';
import { Caption } from '../components/Caption';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';

const TOTAL = 174;
/* 滚动落定 46+60=106 = 绝对 6060 = 拍303 */
const RANKS = [
  { title: '再读《坐忘歌》', views: 1842, top: true },
  { title: 'codex 的开发范式', views: 1513 },
  { title: '重启计划', views: 1375 },
  { title: 'docker 配置镜像源', views: 1298 },
  { title: '使用 vitepress 搭建 wiki', views: 1271 },
];

const S45: FC = () => {
  const frame = useCurrentFrame();
  /* 主角大数字（46–106 滚动，落定=拍303） */
  const hero = bigNum(frame, 46, 60, 0, 1842);
  /* 证据快闪：文章页截图（0–16 显影放大 → 28 退场） */
  const proofIn = writeFade(frame, 0, true);
  const proofOut = interpolate(frame, [18, 28], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  /* 题名与副标 */
  const titleIn = writeFade(frame, 108);
  /* 末 18f：主条扫光（数据版翻页） */
  const sweepP = interpolate(frame, [156, TOTAL], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });

  return (
    <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep }}>
      <DeepSpace seed="s45v2" stars={58} grid horizon />

      {/* 证据快闪：文章页截图（真实感锚点，0–16 显 → 28 退场，不抢戏） */}
      {frame < 30 ? (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '46%',
            width: interpolate(frame, [0, 16], [900, 560], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
            zIndex: 28,
            opacity: Number(proofIn.opacity ?? 0) * proofOut,
            transform: `translate(-50%, -50%) scale(${interpolate(frame, [0, 16], [1.04, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })})`,
          }}
        >
          <Img
            src={staticFile('wuh-site-intro-v3/site/s03-post-165-v1.png')}
            style={{ width: '100%', borderRadius: 10, border: `1px solid ${FILM_COLORS2.dataDim}`, boxShadow: `0 0 44px rgba(212,163,115,0.2), 0 24px 60px rgba(0,0,0,0.65)`, display: 'block' }}
          />
        </div>
      ) : null}

      {/* HUD 标题 */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 150, textAlign: 'center', zIndex: 30, ...writeFade(frame, 36) }}>
        <span style={{ fontFamily: fontFamilies.mono, fontSize: 17, letterSpacing: '0.4em', color: FILM_COLORS2.textMuted }}>READS RANK · 2026-07 · TOP 5</span>
      </div>

      {/* 主角：全屏大数字 0→1,842（落定 SLAM 辉光） */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 250,
          textAlign: 'center',
          zIndex: 30,
          fontFamily: fontFamilies.mono,
          fontSize: 300,
          fontWeight: 700,
          lineHeight: 1.05,
          color: FILM_COLORS2.data,
          fontVariantNumeric: 'tabular-nums',
          letterSpacing: '0.02em',
          opacity: interpolate(frame, [46, 58], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          transform: `scale(${hero.slam})`,
          ...glowText(FILM_COLORS2.data, hero.glow),
        }}
      >
        {hero.text}
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 596, textAlign: 'center', zIndex: 30 }}>
        <span style={{ fontFamily: fontFamilies.mono, fontSize: 18, letterSpacing: '0.5em', color: FILM_COLORS2.textMuted, opacity: interpolate(frame, [46, 60], [0, 0.9], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>次 阅读 · 全站之最</span>
      </div>

      {/* 题名 + 副标（落定后显影；在「次 阅读」行之下、榜单条之上，互不相撞） */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 636, textAlign: 'center', zIndex: 30, ...titleIn }}>
        <span style={{ fontFamily: fontFamilies.serif, fontSize: 46, color: FILM_COLORS2.paperWhite, ...glowText(FILM_COLORS2.paperWhite, 0.32) }}>《再读〈坐忘歌〉》</span>
        <span style={{ fontFamily: fontFamilies.mono, fontSize: 16, letterSpacing: '0.26em', color: FILM_COLORS2.gold, opacity: 0.9, marginLeft: 26 }}>全站阅读最多 · 非技术文</span>
      </div>

      {/* CHART-FLOW：五条阅读横条（46–106 与数字同窗生长；置于字幕带 bottom150 之上，不相撞） */}
      <div style={{ position: 'absolute', left: 330, right: 330, bottom: 210, zIndex: 29 }}>
        {RANKS.map((r) => {
          const bar = chartBar(frame, 46, 60, r.views / 1842);
          const sweepX = interpolate(sweepP, [0, 1], [-4, 104], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          return (
            <div key={r.title} style={{ position: 'relative', height: 24, marginBottom: 9 }}>
              <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '100%', background: 'rgba(120,170,240,0.07)', borderRadius: 3 }} />
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: `${bar.widthPct}%`,
                  borderRadius: 3,
                  background: r.top ? `linear-gradient(90deg, ${FILM_COLORS2.dataDim}, ${FILM_COLORS2.data})` : 'rgba(120,170,240,0.3)',
                  boxShadow: r.top ? `0 0 ${10 + bar.glow * 16}px rgba(212,163,115,${bar.glow * 0.5})` : 'none',
                }}
              />
              {/* 末 18f 扫光带 */}
              {r.top && sweepP > 0 && sweepP < 1 ? (
                <div style={{ position: 'absolute', left: `${sweepX}%`, top: -2, bottom: -2, width: 90, background: 'linear-gradient(90deg, transparent, rgba(234,242,255,0.85), transparent)', opacity: 0.8, filter: 'blur(1px)' }} />
              ) : null}
              <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-52%)', fontFamily: fontFamilies.serif, fontSize: 16, color: r.top ? FILM_COLORS2.spaceDeep : FILM_COLORS2.paperWhite, opacity: r.top ? 0.95 : 0.75, whiteSpace: 'nowrap' }}>{r.title}</span>
              <span style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-52%)', fontFamily: fontFamilies.mono, fontSize: 15, color: FILM_COLORS2.paperWhite, opacity: 0.85, fontVariantNumeric: 'tabular-nums' }}>{fmtNum(r.views)}</span>
            </div>
          );
        })}
      </div>

      <HudChrome label="wuh.site · READS" readout="TOP 1 · 非技术" />
      <Grade2 id="GR2-07" />
      <Caption text="七月，全站阅读最多的一篇不是技术，是《再读〈坐忘歌〉》——1,842 次。" appearAt={14} />
    </AbsoluteFill>
  );
};

export default S45;
