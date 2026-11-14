import type { FC } from 'react';
import { AbsoluteFill } from 'remotion';
import { Heatmap } from '../components/Heatmap';
import { KineticLine } from '../components/KineticLine';
import { ShotShell } from '../components/ShotShell';
import { DataLabel, Kicker, Meta } from '../components/Type';
import { HEATMAP, SCALARS } from '../data';
import { FILM_COLORS, GRID, T, fmtInt } from '../motion-tokens';

const CELL = 18;
const GAP = 4;
const COL_W = CELL + GAP;
const WEEKS = 53;

/** 供月份轴：每月第一个日期（确定性，来自数据） */
const monthTicks = (): Array<{ label: string; col: number }> => {
  const seen = new Set<string>();
  const out: Array<{ label: string; col: number }> = [];
  const first = HEATMAP.days[0]?.date ?? '2025-11-15';
  const [fy, fm, fd] = first.split('-').map(Number);
  const offset = (() => {
    const yy = fm <= 2 ? fy - 1 : fy;
    const era = Math.floor(yy / 400);
    const yoe = yy - era * 400;
    const mp = fm + (fm > 2 ? -3 : 9);
    const doy = Math.floor((153 * mp + 2) / 5) + fd - 1;
    const doe = yoe * 365 + Math.floor(yoe / 4) - Math.floor(yoe / 100) + doy;
    const days = era * 146097 + doe - 719468;
    return ((days + 4) % 7 + 7) % 7;
  })();
  HEATMAP.days.forEach((d, i) => {
    const ym = d.date.slice(0, 7);
    if (!seen.has(ym)) {
      seen.add(ym);
      out.push({ label: ym, col: Math.floor((i + offset) / 7) });
    }
  });
  return out.filter((_, i) => i % 2 === 0);
};

const TICKS = monthTicks();

/**
 * s37 · 活动热力图（140f，3830–3970）
 * 365 格（53×7 暖金五阶）按 seed 级联点亮 → 峰值格（2026-10-29）最后亮并朱红描边。
 * 尾帧：365 格全亮、峰值格带朱红描边（交 s38 抽峰值卡）。
 */
const S37: FC = () => {
  const x = (GRID.W - WEEKS * COL_W) / 2 + 24;
  const y = 320;

  return (
    <ShotShell act="ACT 04 · 屋里" grid>
      <AbsoluteFill>
        <div style={{ position: 'absolute', left: GRID.margin, top: 118 }}>
          <Kicker>第 04 节 · 过去一年</Kicker>
        </div>
        <div style={{ position: 'absolute', right: GRID.margin, top: 118, textAlign: 'right' }}>
          <DataLabel size={18}>{`${fmtInt(SCALARS.activity_total)} ACTIVITY · 365 D`}</DataLabel>
          <Meta style={{ marginTop: 8 }}>WINDOW 2025-11-15 → 2026-11-14</Meta>
        </div>

        <Heatmap days={HEATMAP.days} x={x} y={y} cell={CELL} gap={GAP} start={16} dur={108} />

        {/* 月份刻度 */}
        {TICKS.map((t) => (
          <div
            key={t.label}
            style={{ position: 'absolute', left: x + t.col * COL_W, top: y + 7 * COL_W + 12 }}
          >
            <Meta size={12}>{t.label.replace('-', '.')}</Meta>
          </div>
        ))}

        {/* 图例 */}
        <div style={{ position: 'absolute', left: x, top: y + 7 * COL_W + 46, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Meta size={12}>少</Meta>
          {[0, 1, 2, 3, 4].map((lv) => (
            <div
              key={lv}
              style={{
                width: 14,
                height: 14,
                borderRadius: 2,
                backgroundColor:
                  lv === 0 ? FILM_COLORS.paperDeep : `rgba(227,181,103,${[0, 0.3, 0.55, 0.75, 1][lv]})`,
                border: '1px solid rgba(42,30,22,0.06)',
              }}
            />
          ))}
          <Meta size={12}>多</Meta>
          <Meta size={12} style={{ marginLeft: 24 }}>{`${SCALARS.activity_active_days} / 365 DAYS ACTIVE`}</Meta>
        </div>

        <div style={{ position: 'absolute', left: GRID.margin, bottom: 118, width: 900 }}>
          <KineticLine text="过去一年，8,437 次活动，156 天有动静。" start={26} framesPerChar={2} size={T.line} />
          <div style={{ marginTop: 18, height: 1, width: 320, backgroundColor: FILM_COLORS.hairline }} />
        </div>
      </AbsoluteFill>
    </ShotShell>
  );
};

export default S37;