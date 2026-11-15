import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { BigNumber } from '../components/BigNumber';
import { KineticLine } from '../components/KineticLine';
import { ShotShell } from '../components/ShotShell';
import { DataLabel } from '../components/Type';
import { REPOS, SCALARS } from '../data';
import { CURVES, FILM_COLORS, FONTS, fmtInt, progress } from '../motion-tokens';

/** 数字墙八数（与 s02 尾帧同源同序：承接交接态，数值全部引自 data.ts） */
const WALL = [
  { value: SCALARS.commits_total, label: 'COMMITS' },
  { value: SCALARS.tags_total, label: 'VERSIONS' },
  { value: SCALARS.articles_public, label: 'ARTICLES' },
  { value: SCALARS.total_words, label: 'WORDS' },
  { value: SCALARS.views_all_issues, label: 'READS' },
  { value: SCALARS.activity_total, label: 'ACTIVITY' },
  { value: SCALARS.bookshelf, label: 'BOOKS' },
  { value: REPOS.length, label: 'REPOS' },
] as const;

/** 数据砖矩形（占画幅约 1/3，居画面中上） */
const BRICK = { x: 680, y: 214, w: 560, h: 306 } as const;

/**
 * s03 · 数据砖（100f，200–300）
 * 承接 s02 尾帧的 4×2 数字墙 → EN-07 纸面一次吸气 → LAY-01 整墙收成中央数据砖（1,243 + COMMITS）
 * → 砖下动能字幕逐字入画。CAM-03 后拉 1→0.96 露出留白。
 * 主落定 40（砖成型，全片 240 · 拍 12）／副落定 80（字幕句末停，全片 280 · 拍 14）。
 * 尾帧：砖居画面中上 + 整句静止于 hairline 基座 → 交 s04 压线。
 */
const S03: FC = () => {
  const frame = useCurrentFrame();

  /* EN-07 纸面单次呼吸 1.00 → 0.96 → 1.00（40f，单次吸气；周期正弦会留惯性尾巴） */
  const breathe = interpolate(frame, [0, 20, 40], [1, 0.96, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: CURVES.cineEaseInOut,
  });
  /* LAY-01 墙 → 砖：整墙缩向砖位（40f，10–50） */
  const shrink = progress(frame, 10, 40, CURVES.cineEaseInOut);
  /* CAM-03 后拉 1 → 0.96（8–60） */
  const pull = interpolate(frame, [8, 60], [1, 0.96], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: CURVES.cineEaseInOut,
  });
  /* 砖入场（24 起，落定 40 对拍） */
  const brickIn = progress(frame, 24, 16, CURVES.cineEaseOut);
  const wallOut = interpolate(frame, [24, 46], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <ShotShell act="ACT 00 · 冷开场">
      <AbsoluteFill>
        <div style={{ position: 'absolute', inset: 0, transform: `scale(${pull})` }}>
          {/* 数字墙（承接 s02 尾帧） */}
          <div
            style={{
              position: 'absolute',
              left: 120,
              top: 341,
              width: 1680,
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              rowGap: 96,
              columnGap: 40,
              paddingLeft: 20,
              opacity: wallOut,
              transform: `translateY(${-173 * shrink}px) scale(${breathe * (1 - 0.66 * shrink)})`,
              transformOrigin: 'center center',
            }}
          >
            {WALL.map((w) => (
              <div key={w.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <div
                  style={{
                    fontFamily: FONTS.serif,
                    fontWeight: 700,
                    fontSize: 104,
                    lineHeight: 1,
                    letterSpacing: '-0.02em',
                    color: FILM_COLORS.ink,
                    fontVariantNumeric: 'tabular-nums lining-nums',
                  }}
                >
                  {fmtInt(w.value)}
                </div>
                <div style={{ marginTop: 14, width: 200, height: 1, backgroundColor: FILM_COLORS.hairline }} />
                <div style={{ marginTop: 12 }}>
                  <DataLabel size={17}>{w.label}</DataLabel>
                </div>
              </div>
            ))}
          </div>

          {/* 数据砖：砖内只留 1,243 与 COMMITS 两行 */}
          <div
            style={{
              position: 'absolute',
              left: BRICK.x,
              top: BRICK.y,
              width: BRICK.w,
              height: BRICK.h,
              boxSizing: 'border-box',
              backgroundColor: FILM_COLORS.card,
              border: `1px solid ${FILM_COLORS.hairline}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: brickIn,
              transform: `scale(${1.14 - 0.14 * brickIn})`,
            }}
          >
            <BigNumber value={SCALARS.commits_total} label="COMMITS" size={128} ruleWidth={200} align="center" />
          </div>

          {/* 动能字幕（砖下 hairline 基座上；2f/字 + 句末顿 10f，句末落 80） */}
          <div style={{ position: 'absolute', left: 560, top: 556, width: 800 }}>
            <KineticLine text="所有答案，都在这座站里。" start={46} framesPerChar={2} size={46} align="center" />
          </div>
          <div
            style={{
              position: 'absolute',
              left: 660,
              top: 640,
              width: 600,
              height: 1,
              backgroundColor: FILM_COLORS.hairline,
            }}
          />
        </div>
      </AbsoluteFill>
    </ShotShell>
  );
};

export default S03;