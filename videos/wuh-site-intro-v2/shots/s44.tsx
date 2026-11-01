/* 镜 44 · Act 7 坐忘 · 局部帧 [0,168) · 168f
   窗台纸页亮成热度榜：榜单自下而上滚动，由快到停（末 30f 几乎静止）；
   第一名《再读〈坐忘歌〉》停于最上，「1,748」衬线大字落定（FN-29），
   第二名 1,451 等仅作背景虚化；CM-03 落定后缓推 3%；无鼓；GR-02。 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, FILM_COLORS, letterpress, paperBreathe } from '../motion-tokens';
import { Caption } from '../components/Caption';
import { DustField } from '../components/DustField';
import { PaperGrain } from '../components/PaperGrain';
import { Grade } from '../components/Grade';

const mono = fontFamilies.mono;
const serif = fontFamilies.serif;

/* 第三名以后只作密度：标题与阅读数均为纸面行块，不伪造原文 */
const GHOST_ROWS = [
  { rank: '03', title: 470, count: 96 },
  { rank: '04', title: 390, count: 86 },
  { rank: '05', title: 520, count: 78 },
  { rank: '06', title: 330, count: 70 },
] as const;

const ShotHotList: FC = () => {
  const frame = useCurrentFrame();
  const scroll = interpolate(frame, [4, 118], [620, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.numRollOut });
  const push = interpolate(frame, [130, 168], [1, 1.03], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const flip = interpolate(frame, [146, 168], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const bigIn = letterpress(frame, 116, 1);

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <AbsoluteFill style={{ background: `linear-gradient(180deg, ${colors.paper} 0%, ${FILM_COLORS.blankPaper} 55%, ${colors.paperDeep} 100%)` }} />
      <div style={{ position: 'absolute', inset: 0, ...paperBreathe(frame, 0.5) }}>
        <div style={{ position: 'absolute', inset: 0, transform: `scale(${push})`, transformOrigin: '960px 260px' }}>
          {/* 页眉 */}
          <div
            style={{
              position: 'absolute',
              left: 190,
              right: 190,
              top: 118,
              display: 'flex',
              justifyContent: 'space-between',
              fontFamily: mono,
              fontSize: 16,
              letterSpacing: '0.28em',
              color: colors.muted,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            <span>READING · 2026-07</span>
            <span>WUH.SITE</span>
          </div>
          <div style={{ position: 'absolute', left: 190, right: 190, top: 158, height: 1, background: colors.paperMuted }} />

          {/* 榜单：自下而上滚动 */}
          <div style={{ position: 'absolute', left: 190, right: 190, top: 240, transform: `translateY(${scroll}px)` }}>
            {/* 第一名：纸页翻起一半 */}
            <div style={{ position: 'relative', height: 400 }}>
              <div style={{ position: 'absolute', inset: 0, perspective: 1200 }}>
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    transformOrigin: 'left center',
                    transform: `rotateY(${-flip * 52}deg)`,
                    background: `linear-gradient(180deg, ${FILM_COLORS.blankPaper} 0%, ${colors.paper} 100%)`,
                    borderBottom: `1px solid ${colors.paperMuted}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 48px',
                  }}
                >
                  <div>
                    <div style={{ fontFamily: mono, fontSize: 18, letterSpacing: '0.22em', color: colors.muted, fontVariantNumeric: 'tabular-nums' }}>01</div>
                    <div style={{ fontFamily: serif, fontSize: 64, marginTop: 26, color: colors.ink, letterSpacing: '0.04em' }}>《再读〈坐忘歌〉》</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ ...bigIn, display: 'inline-block', fontFamily: serif, fontSize: 148, lineHeight: 1, color: colors.ink, fontVariantNumeric: 'tabular-nums' }}>
                      1,748
                    </span>
                    <div style={{ fontFamily: mono, fontSize: 15, color: colors.muted, letterSpacing: '0.2em' }}>READS</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 第二名（背景虚化） */}
            <div style={{ height: 150, display: 'flex', alignItems: 'center', gap: 34, filter: 'blur(2px)', opacity: 0.6, borderBottom: `1px solid ${colors.paperMuted}` }}>
              <span style={{ fontFamily: mono, fontSize: 18, letterSpacing: '0.2em', color: colors.muted, marginLeft: 48, fontVariantNumeric: 'tabular-nums' }}>02</span>
              <div style={{ height: 24, width: 520, borderRadius: 4, background: colors.paperMuted }} />
              <span style={{ marginLeft: 'auto', marginRight: 48, fontFamily: mono, fontSize: 40, color: colors.ink, fontVariantNumeric: 'tabular-nums' }}>1,451</span>
            </div>

            {/* 其余仅作密度 */}
            {GHOST_ROWS.map((r) => (
              <div key={r.rank} style={{ height: 132, display: 'flex', alignItems: 'center', gap: 34, filter: 'blur(3px)', opacity: 0.32, borderBottom: `1px solid ${colors.paperMuted}` }}>
                <span style={{ fontFamily: mono, fontSize: 16, letterSpacing: '0.2em', color: colors.muted, marginLeft: 48, fontVariantNumeric: 'tabular-nums' }}>{r.rank}</span>
                <div style={{ height: 20, width: r.title, borderRadius: 4, background: colors.paperMuted }} />
                <div style={{ height: 18, width: r.count, borderRadius: 4, background: colors.paperMuted, marginLeft: 'auto', marginRight: 48 }} />
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* 底部纸面暗带：给字幕留对比 */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 320, backgroundImage: `linear-gradient(180deg, transparent, ${colors.bg})`, opacity: 0.2 }} />
      <DustField act={7} count={14} seedBase="s44" />
      <PaperGrain opacity={0.06} />
      <Grade id="GR-02" />
      <Caption text="七月，全站阅读最多的一篇不是技术，是《再读〈坐忘歌〉》——1,748 次。" appearAt={96} />
    </AbsoluteFill>
  );
};

export default ShotHotList;
