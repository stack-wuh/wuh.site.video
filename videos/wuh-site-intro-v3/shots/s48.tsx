import type { FC } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { KineticLine } from '../components/KineticLine';
import { Odometer } from '../components/Odometer';
import { ShotShell } from '../components/ShotShell';
import { DataLabel, Kicker, Meta } from '../components/Type';
import { SCALARS } from '../data';
import { FILM_COLORS, GRID, progress } from '../motion-tokens';

/**
 * s48 · 工作流三数（90f，4900–4990 ｜ 主落定 60f）
 * GR-07：版本轴向左退成底纹；NUM-02：280 / 40 / 13 三台逐位里程表错 8f 落定（16/24/32 起，60 全落）；
 * 每数下一条 hairline + mono 标签（TX-05 标识，不滚）。
 * 尾帧：三数字全落定、三条 hairline → s49 六仓横条。
 */

const COLS = [
  { value: SCALARS.archive_changes, label: 'ARCHIVED CHANGES', start: 16 },
  { value: SCALARS.knowledge_cards, label: 'KNOWLEDGE CARDS', start: 24 },
  { value: SCALARS.skills, label: 'SKILLS', start: 32 },
] as const;

const COL_W = GRID.content / 3; // 560
const NUM_TOP = 408;
const NUM_SIZE = 190;

const S48: FC = () => {
  const frame = useCurrentFrame();

  /* 上镜版本轴退成底纹（0–16f 左移淡出） */
  const retreat = progress(frame, 0, 16);
  const retreatOp = 1 - progress(frame, 2, 14);

  return (
    <ShotShell act="ACT 05 · 方法">
      <AbsoluteFill>
        <div style={{ position: 'absolute', left: GRID.margin, top: 118 }}>
          <Kicker>第 05 节 · 工作流资产</Kicker>
        </div>
        <div style={{ position: 'absolute', right: GRID.margin, top: 118, textAlign: 'right' }}>
          <DataLabel size={18}>WORKFLOW ASSETS</DataLabel>
          <Meta size={12} style={{ marginTop: 8 }}>
            2026-11-14 快照
          </Meta>
        </div>

        {/* 版本轴退成底纹（只做空间让位，不重新入场） */}
        <div
          style={{
            position: 'absolute',
            left: GRID.margin - 220 * retreat,
            top: 690,
            width: GRID.content,
            opacity: 0.32 * retreatOp,
          }}
        >
          <div style={{ height: 1, backgroundColor: FILM_COLORS.ink }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
            {Array.from({ length: 24 }, (_, i) => (
              <div key={`tick-${i}`} style={{ width: 1, height: 8, backgroundColor: FILM_COLORS.hairline }} />
            ))}
          </div>
        </div>

        {/* 三数并置 */}
        {COLS.map((c, i) => {
          const left = GRID.margin + i * COL_W;
          const hairline = progress(frame, c.start + 20, 10);
          return (
            <div key={c.label}>
              <div style={{ position: 'absolute', left, top: NUM_TOP }}>
                <Odometer value={c.value} start={c.start} dur={28} size={NUM_SIZE} />
              </div>
              <div
                style={{
                  position: 'absolute',
                  left,
                  top: NUM_TOP + NUM_SIZE + 26,
                  width: 420 * hairline,
                  height: 1,
                  backgroundColor: FILM_COLORS.ink,
                  opacity: 0.6,
                }}
              />
              <div style={{ position: 'absolute', left, top: NUM_TOP + NUM_SIZE + 44 }}>
                <DataLabel size={16} color={i === 0 ? FILM_COLORS.ink : FILM_COLORS.inkSoft}>
                  {c.label}
                </DataLabel>
              </div>
            </div>
          );
        })}

        <div style={{ position: 'absolute', left: GRID.margin, bottom: 108, width: 1500 }}>
          <KineticLine text="280 份 brief，40 张知识卡。" start={20} framesPerChar={2} size={48} />
          <div style={{ marginTop: 16, height: 1, width: 320, backgroundColor: FILM_COLORS.hairline }} />
        </div>
      </AbsoluteFill>
    </ShotShell>
  );
};

export default S48;