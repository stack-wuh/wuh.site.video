import type { FC } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { KineticLine } from '../components/KineticLine';
import { ShotShell } from '../components/ShotShell';
import { DataLabel, Kicker, Meta } from '../components/Type';
import { REPOS } from '../data';
import { CURVES, FILM_COLORS, FONTS, GRID, fmtInt, progress, roll } from '../motion-tokens';

/**
 * s49 · 六仓横条（90f，4990–5080 ｜ 主落定 70f）
 * CH-01 mode h：六根仓库横条按提交数等比生长（错 5f，18 起 / 43 起 / 26f），条右端各标 mono 数字；
 * 底部 mono 合计 6 REPOS · 2,655 COMMITS（合计由 data.ts 求和，不手写）。
 * 尾帧：六条全立、合计在场 → s50 收成「上周」窄时间带。
 */

const ROWS = [...REPOS].sort((a, b) => b.commits - a.commits);
const TOTAL = ROWS.reduce((s, r) => s + r.commits, 0);
const MAX = Math.max(...ROWS.map((r) => r.commits));

const ROW_TOP = 300;
const ROW_H = 76;
const LABEL_X = GRID.margin;
const BAR_X = 460;
const BAR_MAX = 1080;

const S49: FC = () => {
  const frame = useCurrentFrame();

  const total = Math.round(roll(frame, 36, 34, 0, TOTAL));

  /* CAM-01 自上而下扫（≤1.5% 画幅） */
  const truck = -12 * progress(frame, 30, 40, CURVES.cineEaseInOut);

  return (
    <ShotShell act="ACT 05 · 方法">
      <AbsoluteFill>
        <div style={{ position: 'absolute', left: GRID.margin, top: 118 }}>
          <Kicker>第 05 节 · 六个仓库</Kicker>
        </div>
        <div style={{ position: 'absolute', right: GRID.margin, top: 118, textAlign: 'right' }}>
          <DataLabel size={18}>BY COMMITS</DataLabel>
          <Meta size={12} style={{ marginTop: 8 }}>
            2026-11-14 · 默认分支
          </Meta>
        </div>

        <div style={{ position: 'absolute', inset: 0, transform: `translateY(${truck}px)` }}>
          {/* 上镜三数收成三枚小刻度（0–12f） */}
          {[0, 1, 2].map((i) => (
            <div
              key={`tick-out-${i}`}
              style={{
                position: 'absolute',
                left: GRID.margin + i * (GRID.content / 3),
                top: 600,
                width: 1,
                height: 34,
                backgroundColor: FILM_COLORS.ink,
                opacity: 0.5 * (1 - progress(frame, 0, 12)),
              }}
            />
          ))}

          {/* 左轴 */}
          <div style={{ position: 'absolute', left: BAR_X - 1, top: ROW_TOP - 18, width: 1, height: ROWS.length * ROW_H + 6, backgroundColor: FILM_COLORS.hairline }} />

          {ROWS.map((repo, i) => {
            const at = 14 + i * 5;
            const grow = progress(frame, at, 24, CURVES.cineEaseOut);
            const w = (repo.commits / MAX) * BAR_MAX;
            const value = Math.round(roll(frame, at + 12, 18, 0, repo.commits));
            const top = ROW_TOP + i * ROW_H;
            return (
              <div key={repo.name}>
                <div style={{ position: 'absolute', left: LABEL_X, top: top + 4, width: 320 }}>
                  <DataLabel size={18} color={i === 0 ? FILM_COLORS.ink : FILM_COLORS.inkSoft}>
                    {repo.name}
                  </DataLabel>
                </div>
                <div
                  style={{
                    position: 'absolute',
                    left: BAR_X,
                    top: top + 8,
                    width: w * grow,
                    height: 26,
                    backgroundColor: FILM_COLORS.ink,
                    opacity: i === 0 ? 0.92 : 0.72 - i * 0.05,
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    left: BAR_X + w + 16,
                    top: top + 7,
                    fontFamily: FONTS.mono,
                    fontSize: 24,
                    letterSpacing: '0.04em',
                    color: i === 0 ? FILM_COLORS.ink : FILM_COLORS.inkSoft,
                    fontVariantNumeric: 'tabular-nums',
                    opacity: progress(frame, at + 12, 8),
                  }}
                >
                  {fmtInt(value)}
                </div>
              </div>
            );
          })}

          {/* 合计 */}
          <div style={{ position: 'absolute', left: GRID.margin, top: ROW_TOP + ROWS.length * ROW_H + 28 }}>
            <DataLabel size={18} style={{ fontVariantNumeric: 'tabular-nums' }}>
              {`${ROWS.length} REPOS · ${fmtInt(total)} COMMITS`}
            </DataLabel>
          </div>
        </div>

        <div style={{ position: 'absolute', left: GRID.margin, bottom: 108, width: 1500 }}>
          <KineticLine text="六个仓库，2,655 次提交。" start={20} framesPerChar={2} size={48} />
          <div style={{ marginTop: 16, height: 1, width: 320, backgroundColor: FILM_COLORS.hairline }} />
        </div>
      </AbsoluteFill>
    </ShotShell>
  );
};

export default S49;