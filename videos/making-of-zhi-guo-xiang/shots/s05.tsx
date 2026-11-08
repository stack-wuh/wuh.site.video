/* s05 · 那时候没有画面，没有配音，只有一份素材库。（195f · 6.5s，Act 2，v3.1 再分配）
 *
 * 素材库快照卡：materials 成片母带 + 录音清单 10 行（mono 条目名 + 次级标签 + 发丝线），
 * 列表自下缓滚 144f 后定格（MO-EASE-INOUT），行级 MO-CARD-RISE 错峰入场，
 * 整卡 MO-CARD-RISE 入场 + 全镜缓推近 1→1.03。纸面墨字（colors.paper 底 + colors.ink）。
 * 转场：入「切」/ 出「切」。字幕窗 [12,183]。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { Caption } from '../components/Caption';
import { CLAMP, MO_CARD, MO_EASE } from '../motion-tokens';

const TOTAL = 195;
const VIEW_H = 420; // 列表视口高
const ROW_H = 56; // 行高（10 行 560px，溢出 140px 即滚动行程）
const SCROLL_FROM = 24;
const SCROLL_TO = 168; // 168f 起定格
const ROWS: Array<{ name: string; tag: string }> = [
  { name: '2026110101-zhi-guo-xiang.mp4', tag: 'v8 · 52 镜首渲' },
  { name: '20261102000434-zhi-guo-xiang.mp4', tag: '中间版 A' },
  { name: '20261102145146-zhi-guo-xiang.mp4', tag: '中间版 B' },
  { name: '20261103010105-zhi-guo-xiang.mp4', tag: 'v9 · 245s 定版' },
  { name: '20261107041725-zhi-guo-xiang.mp4', tag: 'v10 · 镜内转场' },
  { name: '20261107044211-zhi-guo-xiang.mp4', tag: 'v11 · 41 镜' },
  { name: 'zhi-guo-xiang-animatic.mp4', tag: '前期 animatic' },
  { name: '20261107082556-zhi-guo-xiang.mp4', tag: 'v12 · 交付' },
  { name: '配音/自己的声音-full.mp3', tag: '真声 · 全片' },
  { name: '配音/开头.m4a', tag: '真声 · 花絮' },
];

const S05: FC = () => {
  const f = useCurrentFrame();
  /* 卡片入场 + 全镜缓推近 */
  const rise = interpolate(f, [0, MO_CARD.riseFrames], [MO_CARD.riseShiftPx, 0], { ...CLAMP, easing: MO_EASE.out });
  const cardIn = interpolate(f, [0, MO_CARD.riseFrames], [0, 1], { ...CLAMP, easing: MO_EASE.out });
  const zoom = interpolate(f, [0, TOTAL], [1, 1.03], { ...CLAMP, easing: MO_EASE.inout });
  /* 列表自下缓滚 → 定格 */
  const scroll = interpolate(f, [SCROLL_FROM, SCROLL_TO], [0, -(ROWS.length * ROW_H - VIEW_H)], {
    ...CLAMP,
    easing: MO_EASE.inout,
  });

  return (
    <AbsoluteFill style={{ background: colors.bg, justifyContent: 'center', alignItems: 'center' }}>
      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          opacity: cardIn,
          transform: `translateY(${rise.toFixed(2)}px) scale(${zoom.toFixed(4)})`,
        }}
      >
        <div style={{ width: 880, background: colors.paper, borderRadius: 6, padding: '42px 52px 46px', color: colors.ink }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontFamily: fontFamilies.serif, fontSize: 30, letterSpacing: 4, fontWeight: 700 }}>素材库</span>
            <span style={{ fontFamily: fontFamilies.mono, fontSize: 15, letterSpacing: 1, opacity: 0.5 }}>
              materials · 母带与录音
            </span>
          </div>
          <div style={{ height: 1, background: colors.ink, opacity: 0.16, margin: '18px 0 0' }} />
          <div style={{ height: VIEW_H, overflow: 'hidden' }}>
            <div style={{ transform: `translateY(${scroll.toFixed(2)}px)` }}>
              {ROWS.map((row, i) => {
                const a = interpolate(f, [6 + i * 3, 18 + i * 3], [0, 1], { ...CLAMP, easing: MO_EASE.out });
                return (
                  <div key={row.name} style={{ height: ROW_H, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'baseline',
                        opacity: a,
                        transform: `translateY(${((1 - a) * 12).toFixed(2)}px)`,
                      }}
                    >
                      <span style={{ fontFamily: fontFamilies.mono, fontSize: 19, letterSpacing: 0.5, opacity: 0.92 }}>
                        {row.name}
                      </span>
                      <span style={{ fontFamily: fontFamilies.sans, fontSize: 16, letterSpacing: 1, opacity: 0.5 }}>
                        {row.tag}
                      </span>
                    </div>
                    <div style={{ height: 1, background: colors.ink, opacity: 0.1 }} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </AbsoluteFill>
      <Caption
        text="那时候没有画面，没有配音，只有一份素材库。"
        start={12}
        end={183}
        duration={TOTAL}
        inSide={0}
        outSide={0}
      />
    </AbsoluteFill>
  );
};

export default S05;
