import type { FC } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { BigNumber } from '../components/BigNumber';
import { KineticLine } from '../components/KineticLine';
import { ShotShell } from '../components/ShotShell';
import { DataLabel } from '../components/Type';
import { SCALARS } from '../data';
import { EASE, FILM_COLORS, FONTS, GRID, fmtInt, progress } from '../motion-tokens';

/** 64,985 的缩前/缩后位（NUM-05 连续插值，数值恒定不重建） */
const BIG_POS = { left: 854, top: 372, size: 280 } as const;
const SMALL_POS = { left: 1560, top: 92, size: 40 } as const;

const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

/** 字幕逐字取 storyboard：「被读过 26,948 次。」（数字由 data.ts 派生） */
const CAPTION = `被读过 ${fmtInt(SCALARS.views_all_issues)} 次。`;

/**
 * s34 · 26,948 落定（100f，3520–3620）
 * NUM-05 64,985 缩成右上角小号（0–40f 连续插值）→ NUM-01 26,948 滚 55f（25–80）+ NUM-03 末 4f SLAM
 * → TX-05 `READS` 与「46 篇公开文章 · 26,408」对照小字；字幕 62f 起逐字。
 * 尾帧：26,948 落定居中、64,985 缩在右上（交 s35 退刻度）。
 */
const S34: FC = () => {
  const frame = useCurrentFrame();
  const shrink = progress(frame, 0, 40, EASE.inOut);
  const left = lerp(BIG_POS.left, SMALL_POS.left, shrink);
  const top = lerp(BIG_POS.top, SMALL_POS.top, shrink);
  const size = lerp(BIG_POS.size, SMALL_POS.size, shrink);
  // s33 的「WORDS · 64,985」标签随数字缩小退场
  const oldLabel = 1 - progress(frame, 0, 14, EASE.out);
  const wordsLabel = progress(frame, 34, 10, EASE.out);
  // 字幕句末基座 hairline（92–102 拉出，尾帧不静止）
  const capRule = progress(frame, 92, 12, EASE.out);

  return (
    <ShotShell act="ACT 04 · 屋里">
      <AbsoluteFill>
        {/* NUM-05：64,985 巨号 → 右上角标（数值恒定、连续可见） */}
        <div
          style={{
            position: 'absolute',
            left,
            top,
            fontFamily: FONTS.serif,
            fontWeight: 700,
            fontSize: size,
            lineHeight: 1,
            letterSpacing: '-0.02em',
            color: FILM_COLORS.ink,
            fontVariantNumeric: 'tabular-nums lining-nums',
            whiteSpace: 'nowrap',
          }}
        >
          {fmtInt(SCALARS.total_words)}
        </div>
        <div style={{ position: 'absolute', left: BIG_POS.left, top: BIG_POS.top + 300, opacity: oldLabel }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 120, height: 1, backgroundColor: FILM_COLORS.hairline }} />
            <DataLabel>{`WORDS · ${fmtInt(SCALARS.total_words)}`}</DataLabel>
          </div>
        </div>
        <div style={{ position: 'absolute', left: SMALL_POS.left, top: SMALL_POS.top + 44, opacity: wordsLabel }}>
          <DataLabel size={12}>WORDS</DataLabel>
        </div>

        {/* 中央主数：26,948（滚 55f，落定 80 拍 + 末 4f SLAM） */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 300,
            display: 'flex',
            justifyContent: 'center',
            opacity: progress(frame, 22, 6, EASE.out),
          }}
        >
          <BigNumber
            value={SCALARS.views_all_issues}
            from={0}
            start={25}
            dur={55}
            slamAt={76}
            size={250}
            label="READS"
            sub={`${SCALARS.articles_public} 篇公开文章 · ${fmtInt(SCALARS.views_public)}`}
            ruleWidth={220}
          />
        </div>

        {/* 字幕（2f/字；13 字 → 62f 起笔、末字 100f 前显影） */}
        <div style={{ position: 'absolute', left: GRID.margin, top: 880, width: 1400 }}>
          <KineticLine text={CAPTION} start={62} framesPerChar={2} size={44} />
          <div
            style={{
              marginTop: 14,
              width: 300 * capRule,
              height: 1,
              backgroundColor: FILM_COLORS.vermillion,
              opacity: 0.7,
            }}
          />
        </div>
      </AbsoluteFill>
    </ShotShell>
  );
};

export default S34;