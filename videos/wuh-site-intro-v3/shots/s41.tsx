import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { BigNumber } from '../components/BigNumber';
import { KineticLine } from '../components/KineticLine';
import { ShotShell } from '../components/ShotShell';
import { SpineArray } from '../components/SpineArray';
import { DataLabel, Kicker, Meta } from '../components/Type';
import { SCALARS } from '../data';
import { CURVES, FILM_COLORS, FONTS, GRID, progress, roll } from '../motion-tokens';

/**
 * s41 · 书架 146 条书脊（80f，4280–4360 ｜ 主落定 60f）
 * GR-08：146 条等宽书脊按 seed 高矮错落立起（等宽 8px / 间距 3.5px，横贯内容区）；
 * GR-09：19 条读完的书描顶 accent 点亮（2px）→ 右侧巨型 146 落定 + 19 FINISHED。
 * 尾帧：146 条全立、19 条点亮、146 在右 → s42 年轮。
 */

const SHELF_Y = 700;
const NUMBER_X = 1200;
const NUMBER_W = 600;

const S41: FC = () => {
  const frame = useCurrentFrame();

  /* NUM-01：146 滚 36f（14→50），19 滚 30f（20→50）；主落定 60 */
  const finished = Math.round(roll(frame, 20, 30, 0, SCALARS.books_finished));

  /* CAM-01：沿书脊右移（−16 → +16，≤2% 画幅） */
  const truck = interpolate(frame, [6, 56], [-16, 16], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: CURVES.cineEaseInOut,
  });

  return (
    <ShotShell act="ACT 04 · 屋里">
      <AbsoluteFill>
        <div style={{ position: 'absolute', left: GRID.margin, top: 118 }}>
          <Kicker>第 04 节 · 书架</Kicker>
        </div>

        <div style={{ position: 'absolute', inset: 0, transform: `translateX(${truck}px)` }}>
          {/* 上镜七柱退成 paperDeep 底纹（只做空间让位，不重新入场） */}
          <div
            style={{
              position: 'absolute',
              left: GRID.margin,
              top: 290,
              width: 960,
              height: 470,
              backgroundColor: FILM_COLORS.paperDeep,
              opacity: 0.55 * (1 - progress(frame, 0, 16)),
            }}
          />

          {/* 书脊阵列（146 条，19 条读过） */}
          <div style={{ position: 'absolute', left: GRID.margin, bottom: 1080 - SHELF_Y, width: GRID.content }}>
            <SpineArray
              total={SCALARS.bookshelf}
              lit={SCALARS.books_finished}
              seed="s41-spine"
              start={4}
              dur={26}
              width={GRID.content}
            />
          </div>

          {/* 书架 hairline 基座 */}
          <div
            style={{
              position: 'absolute',
              left: GRID.margin,
              top: SHELF_Y,
              width: GRID.content * progress(frame, 4, 22),
              height: 1,
              backgroundColor: FILM_COLORS.ink,
              opacity: 0.55,
            }}
          />
          <div style={{ position: 'absolute', left: GRID.margin, top: SHELF_Y + 18 }}>
            <Meta size={12}>每一条 = 一本书 · 泥金描顶 = 读完</Meta>
          </div>

          {/* 右侧巨型 146 */}
          <div style={{ position: 'absolute', left: NUMBER_X, top: 140, width: NUMBER_W, display: 'flex', justifyContent: 'flex-end' }}>
            <BigNumber
              value={SCALARS.bookshelf}
              label="BOOKS"
              size={190}
              align="right"
              from={0}
              start={14}
              dur={36}
              slamAt={54}
              ruleWidth={240}
            />
          </div>

          {/* 19 FINISHED（量也要滚） */}
          <div
            style={{
              position: 'absolute',
              left: NUMBER_X,
              top: 405,
              width: NUMBER_W,
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'flex-end',
              gap: 14,
            }}
          >
            <div
              style={{
                fontFamily: FONTS.serif,
                fontWeight: 700,
                fontSize: 56,
                lineHeight: 1,
                color: FILM_COLORS.ink,
                fontVariantNumeric: 'tabular-nums lining-nums',
              }}
            >
              {finished}
            </div>
            <DataLabel size={16}>FINISHED</DataLabel>
          </div>
        </div>

        <div style={{ position: 'absolute', left: GRID.margin, bottom: 108, width: 1500 }}>
          <KineticLine text="书架上有 146 本书。" start={18} framesPerChar={2} size={48} />
          <div style={{ marginTop: 16, height: 1, width: 320, backgroundColor: FILM_COLORS.hairline }} />
        </div>
      </AbsoluteFill>
    </ShotShell>
  );
};

export default S41;