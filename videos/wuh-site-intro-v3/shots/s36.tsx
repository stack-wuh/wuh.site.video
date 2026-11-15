import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { BigNumber } from '../components/BigNumber';
import { ShotShell } from '../components/ShotShell';
import { Meta } from '../components/Type';
import { ARTICLES, SERIES } from '../data';
import { EASE, FILM_COLORS, FONTS, GRID, progress } from '../motion-tokens';

/** 冠军：#165《再读《坐忘歌》》1,912 阅读（top7 第 1 名 ↔ ARTICLES[1]，编号对得上） */
const CHAMP = SERIES.top7_views[0];
const POST = ARTICLES[1];
/** 抽出行（承接 s35 第 1 行）与标题卡矩形 */
const ROW = { x: GRID.margin, y: 236, w: GRID.content, h: 62 } as const;
const CARD = { x: 360, y: 270, w: 1200, h: 520 } as const;

const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

/**
 * s36 · 冠军条抽出成标题卡（100f，3730–3830）
 * CH-05 CHART-EXTRACT：冠军条矩形 25f 连续插值到卡矩形 + 其余六条 8f 退灰（FX-07）
 * → EN-01 标题/编号小签 + NUM-01 1,912 微滚（66–70 落定）+ FX-08 朱红描边脉冲。
 * 尾帧：标题卡与 1,912 定格中央、六条灰阶在背景（交 s37 热力）。
 */
const S36: FC = () => {
  const frame = useCurrentFrame();
  const morph = progress(frame, 0, 25, EASE.inOut);
  const rowOut = 1 - progress(frame, 0, 12, EASE.out);
  const cardIn = progress(frame, 20, 12, EASE.out);
  const dye = progress(frame, 0, 8, EASE.out);
  const title = progress(frame, 22, 10, EASE.out);
  const no = progress(frame, 28, 10, EASE.out);
  const cardRule = progress(frame, 74, 12, EASE.out);
  // FX-08 朱红描边脉冲（66–70，2f 起）
  const pulse = interpolate(frame, [66, 68, 72], [0, 1, 0.75], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const box = {
    left: lerp(ROW.x, CARD.x, morph),
    top: lerp(ROW.y, CARD.y, morph),
    width: lerp(ROW.w, CARD.w, morph),
    height: lerp(ROW.h, CARD.h, morph),
  };

  return (
    <ShotShell act="ACT 04 · 屋里">
      <AbsoluteFill>
        {/* FX-07：其余六条退成灰阶底纹（布局不动） */}
        <div style={{ position: 'absolute', inset: 0, filter: `grayscale(${dye * 0.85}) brightness(${1 - dye * 0.1})`, opacity: 1 - dye * 0.65 }}>
          {SERIES.top7_views.slice(1).map((row, k) => {
            const y = ROW.y + (k + 1) * ROW.h;
            return (
              <div key={row.number}>
                <div style={{ position: 'absolute', left: GRID.margin, top: y + ROW.h - 12, width: GRID.content, height: 1, backgroundColor: FILM_COLORS.hairline }} />
                <div style={{ position: 'absolute', left: GRID.margin, top: y + 4, width: 56, fontFamily: FONTS.mono, fontSize: 20, color: FILM_COLORS.muted }}>{row.rank}</div>
                <div style={{ position: 'absolute', left: GRID.margin + 76, top: y + 2, width: 620, fontFamily: FONTS.serif, fontSize: 26, color: FILM_COLORS.inkSoft, whiteSpace: 'nowrap' }}>{row.title}</div>
                <div style={{ position: 'absolute', left: GRID.margin + 740, top: y + 18, width: (row.views / SERIES.top7_views[0].views) * 600, height: 14, backgroundColor: FILM_COLORS.ink }} />
                <div style={{ position: 'absolute', left: GRID.margin + 1340, top: y + 4, width: 340, textAlign: 'right', fontFamily: FONTS.mono, fontSize: 22, color: FILM_COLORS.ink, fontVariantNumeric: 'tabular-nums' }}>{row.views}</div>
              </div>
            );
          })}
        </div>

        {/* CH-05 抽出盒：冠军条 → 标题卡（几何连续，内容交叉淡出/入） */}
        <div
          style={{
            position: 'absolute',
            left: box.left,
            top: box.top,
            width: box.width,
            height: box.height,
            overflow: 'hidden',
            backgroundColor: FILM_COLORS.card,
            border: `1px solid ${FILM_COLORS.hairline}`,
            boxSizing: 'border-box',
          }}
        >
          {/* 行内容（0–12f 退场） */}
          <div style={{ position: 'absolute', inset: 0, opacity: rowOut }}>
            <div style={{ position: 'absolute', left: 0, top: 4, width: 56, fontFamily: FONTS.mono, fontSize: 20, color: FILM_COLORS.vermillion }}>{CHAMP.rank}</div>
            <div style={{ position: 'absolute', left: 76, top: 2, width: 620, fontFamily: FONTS.serif, fontSize: 26, fontWeight: 700, color: FILM_COLORS.ink, whiteSpace: 'nowrap' }}>{CHAMP.title}</div>
            <div style={{ position: 'absolute', left: 740, top: 18, width: 600, height: 14, backgroundColor: FILM_COLORS.vermillion }} />
            <div style={{ position: 'absolute', left: 1340, top: 4, width: 340, textAlign: 'right', fontFamily: FONTS.mono, fontSize: 22, color: FILM_COLORS.vermillion, fontVariantNumeric: 'tabular-nums' }}>{CHAMP.views}</div>
          </div>

          {/* 卡内容（20f 后入位）：标题 + 1,912 + #165 小签 */}
          <div style={{ position: 'absolute', left: 64, top: 88, opacity: cardIn * title, transform: `translateY(${(1 - title) * 8}px)` }}>
            <Meta size={14}>TOP 1 · BY READS</Meta>
            <div style={{ marginTop: 14 }}>
              <div style={{ fontFamily: FONTS.serif, fontSize: 56, fontWeight: 700, color: FILM_COLORS.ink, lineHeight: 1.3, whiteSpace: 'nowrap' }}>
                {POST.title}
              </div>
            </div>
          </div>
          <div style={{ position: 'absolute', left: 64, top: 212, opacity: cardIn * progress(frame, 44, 4, EASE.out) }}>
            <BigNumber
              value={CHAMP.views}
              from={0}
              start={46}
              dur={20}
              slamAt={66}
              size={168}
              align="left"
              ruleWidth={280}
              label="READS"
            />
          </div>
          <div style={{ position: 'absolute', right: 64, top: 96, opacity: cardIn * no }}>
            <div
              style={{
                fontFamily: FONTS.mono,
                fontSize: 18,
                letterSpacing: '0.14em',
                color: FILM_COLORS.vermillion,
                border: `1px solid ${FILM_COLORS.vermillion}`,
                padding: '6px 12px',
                whiteSpace: 'nowrap',
              }}
            >
              {`#${POST.number}`}
            </div>
          </div>
          <div style={{ position: 'absolute', left: 64, top: 176, width: 280 * cardRule, height: 1, backgroundColor: FILM_COLORS.hairline }} />
        </div>

        {/* FX-08 冠军卡朱红描边（脉冲一次；尾帧 0.75） */}
        <div
          style={{
            position: 'absolute',
            left: CARD.x - 2,
            top: CARD.y - 2,
            width: CARD.w + 4,
            height: CARD.h + 4,
            border: `1.5px solid ${FILM_COLORS.vermillion}`,
            opacity: pulse,
            boxSizing: 'border-box',
            pointerEvents: 'none',
          }}
        />
      </AbsoluteFill>
    </ShotShell>
  );
};

export default S36;