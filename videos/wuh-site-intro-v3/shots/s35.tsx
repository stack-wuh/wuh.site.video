import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { KineticLine } from '../components/KineticLine';
import { ShotShell } from '../components/ShotShell';
import { DataLabel, Meta } from '../components/Type';
import { SCALARS, SERIES } from '../data';
import { EASE, FILM_COLORS, FONTS, GRID, SP, clamp01, fmtInt, progress, roll, springP } from '../motion-tokens';

/** 热度榜 top7（data.ts SERIES.top7_views：1,912 / 1,567 / 1,447 / 1,357 / 1,319 / 1,202 / 1,165） */
const TOP = SERIES.top7_views;
const MAX_V = TOP[0].views;

const ROW_H = 62;
const ROW_TOP = 236;
const RANK_X = GRID.margin;
const TITLE_X = GRID.margin + 76;
const BAR_X = GRID.margin + 740;
const BAR_MAX = 600;
const VIEWS_X = GRID.margin + 1340;
const VIEWS_W = 340;

/** 横条生长错 5f，冠军条最后（CH-04 峰值唯一） */
const growAt = (i: number): number => 14 + (6 - i) * 5;
/** 阅读数滚动 22f，各自落定：冠军 80 拍 */
const endAt = (i: number): number => 56 + (6 - i) * 4;

/**
 * s35 · 热度榜 top7（110f，3620–3730）
 * NUM-05 两数退成左上两枚小刻度 → CH-01 七条横条错 5f 生长（条长按 values 等比）
 * + NUM-01 阅读数逐个滚动落定 + CH-04 冠军条朱红（76–80 描边脉冲）+ CAM-01 自上而下扫（−18→0）。
 * 尾帧：七条全立、冠军条最长且朱红未熄（交 s36 抽条成卡）。
 */
const S35: FC = () => {
  const frame = useCurrentFrame();
  const scan = 1 - progress(frame, 0, 50, EASE.inOut);
  const headerIn = progress(frame, 4, 14, EASE.out);
  const tickIn = progress(frame, 0, 14, EASE.out);
  const accent = interpolate(frame, [76, 78, 82], [0, 1, 0.85], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <ShotShell act="ACT 04 · 屋里">
      <AbsoluteFill>
        <div style={{ position: 'absolute', inset: 0, transform: `translateY(${scan * -18}px)` }}>
          {/* NUM-05：上一镜两个大数退成两枚小刻度（左上） */}
          <div style={{ position: 'absolute', left: GRID.margin, top: 94, display: 'flex', gap: 40, opacity: tickIn }}>
            {[
              { n: SCALARS.views_all_issues, l: 'READS' },
              { n: SCALARS.total_words, l: 'WORDS' },
            ].map((t) => (
              <div key={t.l} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 1, height: 14, backgroundColor: FILM_COLORS.vermillion, opacity: 0.8 }} />
                <Meta size={12}>{`${fmtInt(t.n)} · ${t.l}`}</Meta>
              </div>
            ))}
          </div>

          {/* 榜头 mono */}
          <div style={{ position: 'absolute', left: GRID.margin, top: 152, opacity: headerIn }}>
            <DataLabel size={20}>TOP 7 · BY READS</DataLabel>
            <div style={{ marginTop: 10, width: 210, height: 1, backgroundColor: FILM_COLORS.hairline }} />
          </div>

          {TOP.map((row, i) => {
            const at = growAt(i);
            const s = clamp01(springP(frame, 30, at, SP.dotDrop));
            const barW = Math.max(6, (row.views / MAX_V) * BAR_MAX) * s;
            const v = roll(frame, endAt(i) - 22, 22, 0, row.views);
            const isTop = i === 0;
            const y = ROW_TOP + i * ROW_H;
            return (
              <div key={row.number}>
                {/* 行分隔 hairline */}
                <div
                  style={{
                    position: 'absolute',
                    left: GRID.margin,
                    top: y + ROW_H - 12,
                    width: GRID.content,
                    height: 1,
                    backgroundColor: FILM_COLORS.hairline,
                    opacity: clamp01(progress(frame, at, 10)) * 0.9,
                  }}
                />
                {/* 名次（身份不滚，TX-05） */}
                <div
                  style={{
                    position: 'absolute',
                    left: RANK_X,
                    top: y + 4,
                    width: 56,
                    fontFamily: FONTS.mono,
                    fontSize: 20,
                    color: isTop ? FILM_COLORS.vermillion : FILM_COLORS.muted,
                    opacity: clamp01(progress(frame, at, 8)),
                  }}
                >
                  {row.rank}
                </div>
                {/* 标题（真实文章标题） */}
                <div
                  style={{
                    position: 'absolute',
                    left: TITLE_X,
                    top: y + 2,
                    width: 620,
                    fontFamily: FONTS.serif,
                    fontSize: 26,
                    fontWeight: isTop ? 700 : 400,
                    color: isTop ? FILM_COLORS.ink : FILM_COLORS.inkSoft,
                    whiteSpace: 'nowrap',
                    opacity: clamp01(progress(frame, at, 8)),
                  }}
                >
                  {row.title}
                </div>
                {/* 横条：条长按阅读数等比；冠军朱红 */}
                <div
                  style={{
                    position: 'absolute',
                    left: BAR_X,
                    top: y + 18,
                    width: barW,
                    height: 14,
                    backgroundColor: isTop ? FILM_COLORS.vermillion : FILM_COLORS.ink,
                  }}
                />
                {/* CH-04 冠军条描边脉冲（76–82，2f 起） */}
                {isTop ? (
                  <div
                    style={{
                      position: 'absolute',
                      left: BAR_X - 3,
                      top: y + 15,
                      width: barW + 6,
                      height: 20,
                      border: `1px solid ${FILM_COLORS.vermillion}`,
                      opacity: accent,
                      boxSizing: 'border-box',
                    }}
                  />
                ) : null}
                {/* 阅读数（NUM-01 滚动落定） */}
                <div
                  style={{
                    position: 'absolute',
                    left: VIEWS_X,
                    top: y + 4,
                    width: VIEWS_W,
                    textAlign: 'right',
                    fontFamily: FONTS.mono,
                    fontSize: 22,
                    color: isTop ? FILM_COLORS.vermillion : FILM_COLORS.ink,
                    fontVariantNumeric: 'tabular-nums',
                    opacity: clamp01(progress(frame, endAt(i) - 22, 4)),
                  }}
                >
                  {fmtInt(v)}
                </div>
              </div>
            );
          })}

          {/* 字幕（2f/字；19 字，56f 起笔、末字 104f 前显影） */}
          <div style={{ position: 'absolute', left: GRID.margin, top: 872, width: 1500 }}>
            <KineticLine text="读得最多的一篇，是《再读〈坐忘歌〉》。" start={56} framesPerChar={2} size={44} />
          </div>
        </div>
      </AbsoluteFill>
    </ShotShell>
  );
};

export default S35;