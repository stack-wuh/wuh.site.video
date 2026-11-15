import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { KineticLine } from '../components/KineticLine';
import { SealStamp } from '../components/SealStamp';
import { ShotShell } from '../components/ShotShell';
import { DataLabel, Meta } from '../components/Type';
import { EASE, FILM_COLORS, draw, progress } from '../motion-tokens';

/**
 * s20 · 生活没有停：杨梅坑 / 梧桐山（90f，2200–2290）
 * 承接 s19 空白格带：两格浮出（INK-06 纸晕）→ 两枚朱砂藏印地名 + 日期落定（INK-04，±1.6° 确定性微旋），
 * 格阵其余保持空；FX-06 纸面回暖两档（12% → 0，30f）；CAM-02 推至两标签之间（+2%）。
 * 落定 2260 = 镜内 60f。数据：materials v4 §三 足迹 — 杨梅坑 2025-08-15（114.585, 22.55）／梧桐山 2025-09-20（114.23, 22.62）。
 */

const CELL = 14;
const GAP = 5;
const STEP = CELL + GAP;
const ROWS = 12;
const COLS = 31;
const BX = 620;
const BY = 150;

const cellLeft = (col: number): number => BX + col * STEP;
const cellTop = (row: number): number => BY + row * STEP;

/** 两枚足迹格：（月 0–11, 日 0–30）→ 杨梅坑 8 月 15 日 / 梧桐山 9 月 20 日 */
const FOOTPRINTS = [
  { row: 7, col: 14, place: '杨梅坑', date: '2025-08-15', sealX: 372, sealY: 236 },
  { row: 8, col: 19, place: '梧桐山', date: '2025-09-20', sealX: 1336, sealY: 300 },
] as const;

const S20: FC = () => {
  const frame = useCurrentFrame();

  /* FX-06 纸面回暖两档：12% 压暗 → 0（承 s19 暗场） */
  const warm = interpolate(frame, [20, 60], [0.12, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  /* CAM-02 推至两标签之间（+2%） */
  const push = interpolate(frame, [16, 90], [1, 1.03], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE.inOut,
  });

  return (
    <ShotShell act="ACT 02 · 沉默">
      <AbsoluteFill>
        <AbsoluteFill style={{ backgroundColor: FILM_COLORS.ink, opacity: warm }} />

        <div style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transform: `scale(${push})`, transformOrigin: '50% 42%' }}>
          {/* 格阵（承 s19，其余保持空） */}
          {Array.from({ length: ROWS * COLS }, (_, k) => {
            const row = Math.floor(k / COLS);
            const col = k % COLS;
            const fp = FOOTPRINTS.findIndex((f) => f.row === row && f.col === col);
            /* 两格浮出：格线由暗到墨（INK-06 前半） */
            const fill = fp >= 0 ? progress(frame, 8 + fp * 6, 10) : 0;
            return (
              <div
                key={`c-${row}-${col}`}
                style={{
                  position: 'absolute',
                  left: cellLeft(col),
                  top: cellTop(row),
                  width: CELL,
                  height: CELL,
                  boxSizing: 'border-box',
                  border: `1px solid ${FILM_COLORS.hairline}`,
                  opacity: 0.5,
                }}
              >
                {fp >= 0 ? (
                  <div
                    style={{
                      position: 'absolute',
                      inset: -1,
                      backgroundColor: FILM_COLORS.ink,
                      border: `1px solid ${FILM_COLORS.ink}`,
                      opacity: fill,
                    }}
                  />
                ) : null}
              </div>
            );
          })}
          {Array.from({ length: ROWS }, (_, row) => (
            <Meta
              key={`m-${row}`}
              size={11}
              style={{ position: 'absolute', left: BX - 34, top: cellTop(row) + 2, opacity: 0.9 }}
            >
              {String(row + 1).padStart(2, '0')}
            </Meta>
          ))}

          {/* 两格纸晕（INK-06） */}
          {FOOTPRINTS.map((f, i) => {
            const b = progress(frame, 8 + i * 6, 10);
            const size = 36;
            return (
              <div
                key={`bloom-${f.place}`}
                style={{
                  position: 'absolute',
                  left: cellLeft(f.col) + CELL / 2 - size / 2,
                  top: cellTop(f.row) + CELL / 2 - size / 2,
                  width: size,
                  height: size,
                  borderRadius: '50%',
                  border: `1px solid ${FILM_COLORS.vermillion}`,
                  opacity: (1 - b) * 0.4,
                  transform: `scale(${0.4 + b * 0.6})`,
                }}
              />
            );
          })}

          {/* 引线：从藏印到格位 */}
          <svg style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080 }} viewBox="0 0 1920 1080" fill="none">
            {FOOTPRINTS.map((f, i) => {
              const fromX = i === 0 ? f.sealX + 96 : f.sealX;
              const fromY = f.sealY + 48;
              const toX = cellLeft(f.col) + CELL / 2;
              const toY = cellTop(f.row) + CELL / 2;
              return (
                <line
                  key={`lead-${f.place}`}
                  x1={fromX}
                  y1={fromY}
                  x2={toX}
                  y2={toY}
                  stroke={FILM_COLORS.hairline}
                  strokeWidth={1}
                  {...draw(progress(frame, 18 + i * 8, 14))}
                />
              );
            })}
          </svg>

          {/* 两枚朱砂藏印地名（INK-04）+ 日期 */}
          {FOOTPRINTS.map((f, i) => {
            const at = 34 + i * 6;
            const p = progress(frame, at, 8);
            return (
              <div key={`seal-${f.place}`} style={{ position: 'absolute', left: f.sealX, top: f.sealY, opacity: p }}>
                <SealStamp text={f.place} size={96} start={at} />
                <div style={{ marginTop: 16, marginLeft: 4 }}>
                  <Meta size={15}>{f.date}</Meta>
                </div>
              </div>
            );
          })}
        </div>

        {/* 字幕：但生活没有停：杨梅坑、梧桐山。 */}
        <div style={{ position: 'absolute', left: 120, top: 902, width: 1660 }}>
          <KineticLine text="但生活没有停：杨梅坑、梧桐山。" start={24} framesPerChar={2} size={44} />
          <div style={{ marginTop: 14, width: 320, height: 1, backgroundColor: FILM_COLORS.hairline }} />
        </div>

        <div style={{ position: 'absolute', left: 120, top: 128 }}>
          <DataLabel size={15}>FOOTPRINTS · 2</DataLabel>
        </div>
      </AbsoluteFill>
    </ShotShell>
  );
};

export default S20;