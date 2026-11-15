import type { FC } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { BarChart } from '../components/BarChart';
import { KineticLine } from '../components/KineticLine';
import { ShotShell } from '../components/ShotShell';
import { DataLabel, Kicker, Meta } from '../components/Type';
import { SCALARS, SERIES, SNAPSHOT_DATE } from '../data';
import { CURVES, FILM_COLORS, FONTS, GRID, fmtInt, progress, roll, shuffled, slam } from '../motion-tokens';

/**
 * s40 · 一周七柱 + 49.8%（100f，4180–4280 ｜ 主落定 80f）
 * GR-02：706 天点阵按「星期几」收成 7 堆（每点是它自己那天的周几），柱再从堆高生长
 * （CH-01 错 3f）→ 周六/周日两柱朱红描边合并高亮（CH-04）→ 巨型 49.8% 里程表 40f 落定。
 * 尾帧：七柱 + 49.8% 定格、周末两柱朱红未熄 → s41 书脊阵列。
 */

/* ── 与 s39 同源的 706 天点阵几何（GR-02 的起点必须逐像素承接） ── */
const daysFromCivil = (y: number, m: number, d: number): number => {
  const yy = m <= 2 ? y - 1 : y;
  const era = Math.floor(yy / 400);
  const yoe = yy - era * 400;
  const mp = m + (m > 2 ? -3 : 9);
  const doy = Math.floor((153 * mp + 2) / 5) + d - 1;
  const doe = yoe * 365 + Math.floor(yoe / 4) - Math.floor(yoe / 100) + doy;
  return era * 146097 + doe - 719468;
};

const civilFromDays = (z0: number): readonly [number, number, number] => {
  const z = z0 + 719468;
  const era = Math.floor(z / 146097);
  const doe = z - era * 146097;
  const yoe = Math.floor((doe - Math.floor(doe / 1460) + Math.floor(doe / 36524) - Math.floor(doe / 146096)) / 365);
  const y = yoe + era * 400;
  const doy = doe - (365 * yoe + Math.floor(yoe / 4) - Math.floor(yoe / 100));
  const mp = Math.floor((5 * doy + 2) / 153);
  const d = doy - Math.floor((153 * mp + 2) / 5) + 1;
  const m = mp < 10 ? mp + 3 : mp - 9;
  return [m <= 2 ? y + 1 : y, m, d] as const;
};

const SNAP = SNAPSHOT_DATE.split('-').map(Number);
const END_DAY = daysFromCivil(SNAP[0], SNAP[1], SNAP[2]) - 1;
const START_DAY = END_DAY - SCALARS.tag_span_days;
const DAYS = SCALARS.tag_span_days + 1;
const OFFSET = (((START_DAY + 4) % 7) + 7) % 7;
const COLS = Math.ceil((DAYS + OFFSET) / 7);
const PITCH = 16;
const BAND_W = COLS * PITCH;
const BAND_LEFT = GRID.margin + (GRID.content - BAND_W) / 2;
const BAND_TOP = 380;

/** 与 s39 完全相同的 117 天选位（同源月度分配 + 同 seed 月内洗牌） */
const MONTHLY = new Map<string, number>(SERIES.monthly_commits_2024_12_to_2026_11.map((m) => [m.month, m.value]));
const MONTH_BUCKETS: ReadonlyArray<{ ym: string; days: number[]; commits: number }> = (() => {
  const out: Array<{ ym: string; days: number[]; commits: number }> = [];
  for (let i = 0; i < DAYS; i++) {
    const [y, m] = civilFromDays(START_DAY + i);
    const ym = `${y}-${String(m).padStart(2, '0')}`;
    const last = out[out.length - 1];
    if (last && last.ym === ym) last.days.push(i);
    else out.push({ ym, days: [i], commits: MONTHLY.get(ym) ?? 0 });
  }
  return out;
})();
const LIT: readonly number[] = (() => {
  const active = MONTH_BUCKETS.filter((b) => b.commits > 0);
  const weight = active.map((b) => Math.pow(b.commits, 0.85));
  const total = weight.reduce((acc, w) => acc + w, 0);
  const raw = weight.map((w) => (SCALARS.commit_days * w) / total);
  const alloc = raw.map((r) => Math.max(1, Math.floor(r)));
  let sum = alloc.reduce((acc, a) => acc + a, 0);
  while (sum < SCALARS.commit_days) {
    let best = 0;
    for (let i = 1; i < alloc.length; i++) if (raw[i] - alloc[i] > raw[best] - alloc[best]) best = i;
    alloc[best] += 1;
    raw[best] = -1;
    sum += 1;
  }
  while (sum > SCALARS.commit_days) {
    let best = 0;
    for (let i = 1; i < alloc.length; i++) if (alloc[i] > alloc[best]) best = i;
    if (alloc[best] <= 1) break;
    alloc[best] -= 1;
    sum -= 1;
  }
  const picked: number[] = [];
  active.forEach((b, i) => {
    const order = shuffled(b.days.length, `s39-mon-${b.ym}`);
    for (let k = 0; k < Math.min(alloc[i], b.days.length); k++) picked.push(b.days[order[k]]);
  });
  return picked.sort((a, b) => a - b);
})();

/* ── 七柱几何（与 BarChart v 模式内部一致：gap 24 / 底部 34 基线） ── */
const CHART_LEFT = GRID.margin;
const CHART_TOP = 290;
const CHART_W = 960;
const CHART_H = 470;
const GAP = 24;
const BAR_W = (CHART_W - GAP * 6) / 7;
const BASELINE = CHART_TOP + CHART_H - 34;
const MAX = Math.max(...SERIES.commit_weekday.map((d) => d.value));

/** 周序：周日 → 周六（数据里顺序是乱的，按 label 取真值重排，不手写数字） */
const WEEK_ORDER = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'] as const;
const BY_LABEL = new Map(SERIES.commit_weekday.map((d) => [d.label, d.value]));
const WEEK = WEEK_ORDER.map((label) => ({ label, value: BY_LABEL.get(label) ?? 0 }));
const WEEKEND = WEEK[0].value + WEEK[6].value; // 619
const WEEKEND_SHARE = (WEEKEND / SCALARS.commits_total) * 100; // 49.7997…

const S40: FC = () => {
  const frame = useCurrentFrame();

  /* GR-02 点阵收拢：18f 内每点飞向自己星期几的柱底 */
  const fly = progress(frame, 0, 18, CURVES.cineEaseInOut);
  const flyOp = 1 - progress(frame, 12, 8);

  /* NUM-01：49.8% 40f 滚动，落定 76 → 主落定 80 */
  const pct = roll(frame, 36, 40, 0, WEEKEND_SHARE);
  const hit = slam(frame, 76);

  /* CAM-02 微推（≤4%），落定后收 */
  const push = 1 + 0.03 * progress(frame, 40, 40, CURVES.cineEaseInOut);

  /* CH-04 周末两柱朱红描边（2f 闪后常亮 0.9） */
  const outline = progress(frame, 34, 3);

  return (
    <ShotShell act="ACT 04 · 屋里" grid>
      <AbsoluteFill>
        <div style={{ position: 'absolute', left: GRID.margin, top: 118 }}>
          <Kicker>第 04 节 · 一周节拍</Kicker>
        </div>
        <div style={{ position: 'absolute', right: GRID.margin, top: 118, textAlign: 'right' }}>
          <DataLabel size={18} style={{ fontVariantNumeric: 'tabular-nums' }}>
            {`WEEKEND · ${WEEKEND}/${fmtInt(SCALARS.commits_total)}`}
          </DataLabel>
          <Meta size={12} style={{ marginTop: 8 }}>
            {`SUN ${WEEK[0].value} + SAT ${WEEK[6].value}`}
          </Meta>
        </div>

        <div style={{ position: 'absolute', left: GRID.margin, top: 240 }}>
          <DataLabel size={15}>COMMITS BY WEEKDAY</DataLabel>
        </div>

        <div
          style={{
            position: 'absolute',
            inset: 0,
            transform: `scale(${push})`,
            transformOrigin: '62% 62%',
          }}
        >
          {/* 上镜点阵底纹（2–12f 淡净） */}
          <div
            style={{
              position: 'absolute',
              left: BAND_LEFT,
              top: BAND_TOP,
              width: BAND_W,
              height: 7 * PITCH,
              backgroundColor: FILM_COLORS.paperDeep,
              opacity: 0.4 * (1 - progress(frame, 2, 10)),
            }}
          />

          {/* GR-02：117 个墨点飞向自己星期几的柱底（点先归类，柱再从堆高生长） */}
          <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0 }}>
            {LIT.map((idx) => {
              const col = Math.floor((idx + OFFSET) / 7);
              const row = (idx + OFFSET) % 7;
              const x0 = BAND_LEFT + col * PITCH + PITCH / 2;
              const y0 = BAND_TOP + row * PITCH + PITCH / 2;
              const x1 = CHART_LEFT + row * (BAR_W + GAP) + BAR_W / 2;
              const y1 = BASELINE;
              return (
                <circle
                  key={`fly-${idx}`}
                  cx={x0 + (x1 - x0) * fly}
                  cy={y0 + (y1 - y0) * fly}
                  r={4.2 - 1.8 * fly}
                  fill={FILM_COLORS.ink}
                  opacity={0.82 * flyOp}
                />
              );
            })}
          </svg>

          <div style={{ position: 'absolute', left: CHART_LEFT, top: CHART_TOP }}>
            <BarChart data={WEEK} mode="v" start={20} dur={22} stagger={3} width={CHART_W} height={CHART_H} valueSize={20} />
          </div>

          {/* 周末两柱朱红描边（只给「最重要的那两个」，同一族的高亮） */}
          {[0, 6].map((i) => {
            const h = (WEEK[i].value / MAX) * (CHART_H - 46);
            return (
              <div
                key={`wk-${i}`}
                style={{
                  position: 'absolute',
                  left: CHART_LEFT + i * (BAR_W + GAP),
                  top: BASELINE - h,
                  width: BAR_W,
                  height: h,
                  boxSizing: 'border-box',
                  border: `2px solid ${FILM_COLORS.vermillion}`,
                  opacity: outline * (0.88 + 0.12 * (1 - progress(frame, 34, 10))),
                }}
              />
            );
          })}

          {/* 巨型 49.8% */}
          <div style={{ position: 'absolute', left: 1120, top: 300 }}>
            <div
              style={{
                fontFamily: FONTS.serif,
                fontWeight: 700,
                fontSize: 176,
                lineHeight: 0.95,
                letterSpacing: '-0.02em',
                color: FILM_COLORS.ink,
                fontVariantNumeric: 'tabular-nums lining-nums',
                whiteSpace: 'nowrap',
                transform: `translate(${hit.dx}px, ${hit.dy}px) scale(${hit.scale})`,
                transformOrigin: 'left bottom',
              }}
            >
              {pct.toFixed(1)}
              <span style={{ fontSize: 96 }}>%</span>
            </div>
            <div
              style={{
                marginTop: 18,
                width: 260,
                height: 1,
                backgroundColor: frame >= 76 ? FILM_COLORS.vermillion : FILM_COLORS.hairline,
              }}
            />
            <div style={{ marginTop: 16 }}>
              <DataLabel size={16}>WEEKEND SHARE</DataLabel>
            </div>
          </div>
        </div>

        <div style={{ position: 'absolute', left: GRID.margin, bottom: 108, width: 1500 }}>
          <KineticLine text="一半的提交，发生在周末。" start={24} framesPerChar={2} size={48} />
          <div style={{ marginTop: 16, height: 1, width: 320, backgroundColor: FILM_COLORS.hairline }} />
        </div>
      </AbsoluteFill>
    </ShotShell>
  );
};

export default S40;