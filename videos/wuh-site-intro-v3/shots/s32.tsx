import type { FC } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { KineticLine } from '../components/KineticLine';
import { ShotShell } from '../components/ShotShell';
import { Tape } from '../components/Tape';
import { DataLabel, Hairline } from '../components/Type';
import { ARTICLES, SCALARS } from '../data';
import { EASE, FILM_COLORS, GRID, fmtInt, progress, roll } from '../motion-tokens';

/** 46 篇真实标题（顺序固定，不洗牌 —— motion-spec §7.1 `s32-title-*`） */
const TITLES = ARTICLES.map((a) => a.title);
/** 5 行分片：9 + 10 + 9 + 9 + 9 = 46 */
const SLICES = [9, 10, 9, 9, 9] as const;
/** GR-06：−3px/f 基准流速，行间 ±0.15 差值 + 内容起始位错开（独立相位，防整墙同步） */
const SPEEDS = [2.75, 2.9, 3.05, 3.2, 3.35] as const;

/** 字幕逐字取 storyboard，数字由 data.ts 派生 */
const CAPTION = `${SCALARS.articles_public} 篇文章，${fmtInt(SCALARS.total_words)} 个字。`;

const FONT = 34;
const ROW_H = FONT * 1.35;
const ROW_GAP = 40;
const WALL_H = 5 * ROW_H + 4 * ROW_GAP;
const WALL_TOP = 240;
/** 门内交出的那一截卡片边（与 s31 尾帧同坐标） */
const EDGE = { x: 700, y: 150, w: 520, h: 60 } as const;

const rotate = (arr: readonly string[], k: number): string[] => [...arr.slice(k), ...arr.slice(0, k)];

/** 按分片切出 5 行标题（顺序固定；每行起始位错开 r·2 枚做独立相位） */
const ROW_ITEMS: string[][] = (() => {
  const out: string[][] = [];
  let at = 0;
  SLICES.forEach((n, r) => {
    out.push(rotate(TITLES.slice(at, at + n), r * 2));
    at += n;
  });
  return out;
})();

/**
 * s32 · 文章墙（120f，3300–3420）
 * LAY-05 GROW-WALL：门内卡片边宽展 12f → 高长出 5 行（18f）→ 内容 clip 揭示；
 * GR-06 TAPE-DRIFT：5 行 46 条真实标题 −3px/f 无缝流动（每行独立相位与流速）；
 * NUM-01 `46 ARTICLES` 微滚（80 落定）；字幕「46 篇文章，64,985 个字。」
 * 尾帧：标题墙满画幅流动（交 s33 退窄带）。
 */
const S32: FC = () => {
  const frame = useCurrentFrame();
  const wide = progress(frame, 0, 12, EASE.inOut);
  const tall = progress(frame, 10, 20, EASE.inOut);
  const wallTop = EDGE.y + (WALL_TOP - EDGE.y) * progress(frame, 6, 20, EASE.inOut);
  const w = EDGE.w + (GRID.content - EDGE.w) * wide;
  const h = EDGE.h + (WALL_H - EDGE.h) * tall;
  const left = GRID.W / 2 - w / 2;
  const contentP = progress(frame, 6, 16, EASE.out);
  // NUM-01：46 微滚 20f，80 落定
  const count = roll(frame, 60, 20, 0, ARTICLES.length);

  return (
    <ShotShell act="ACT 04 · 屋里">
      <AbsoluteFill>
        {/* 墙（clip 容器：从一截卡边长到 1680×5 行） */}
        <div
          style={{
            position: 'absolute',
            left,
            top: wallTop,
            width: w,
            height: h,
            overflow: 'hidden',
            backgroundColor: FILM_COLORS.card,
            border: `1px solid ${FILM_COLORS.hairline}`,
            boxSizing: 'border-box',
            opacity: contentP,
          }}
        >
          <div style={{ position: 'absolute', left: 24, top: 0, width: GRID.content, height: WALL_H, opacity: contentP }}>
            {ROW_ITEMS.map((items, r) => (
              <div key={`row-${r}`} style={{ position: 'absolute', left: 0, top: r * (ROW_H + ROW_GAP) }}>
                <Tape items={items} rows={1} speed={SPEEDS[r]} fontSize={FONT} rowGap={0} width={GRID.content} />
              </div>
            ))}
          </div>
        </div>

        {/* 墙左上 mono：46 ARTICLES（计数才滚，落定 80 拍；58f 起才入画，不留 "0"） */}
        <div style={{ position: 'absolute', left: GRID.margin, top: WALL_TOP - 62, opacity: progress(frame, 58, 4) }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <DataLabel size={20}>{`${Math.round(count)} ARTICLES`}</DataLabel>
            <div style={{ width: 96 * contentP, height: 1, backgroundColor: FILM_COLORS.vermillion, opacity: 0.8 }} />
          </div>
        </div>

        {/* 墙下 hairline 基座 */}
        <div style={{ position: 'absolute', left: GRID.margin, top: WALL_TOP + WALL_H + 22, width: GRID.content }}>
          <Hairline width={GRID.content * contentP} />
        </div>

        {/* 字幕（画面内动能排版，2f/字） */}
        <div style={{ position: 'absolute', left: GRID.margin, top: 900, width: 1400 }}>
          <KineticLine text={CAPTION} start={62} framesPerChar={2} size={48} />
        </div>
      </AbsoluteFill>
    </ShotShell>
  );
};

export default S32;