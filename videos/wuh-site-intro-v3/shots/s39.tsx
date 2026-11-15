import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { ShotShell } from '../components/ShotShell';
import { DataLabel, Kicker, Meta } from '../components/Type';
import { SCALARS, SERIES, SNAPSHOT_DATE } from '../data';
import { CURVES, FILM_COLORS, GRID, cascadeDelay, fmtInt, progress, roll, shuffled } from '../motion-tokens';

/**
 * s39 · 706 天点阵（100f，4080–4180 ｜ 主落定 80f）
 * 热力网格退成一片 706 天点阵（2024-12-08 → 2026-11-13，每日一点），其中 117 天点亮为墨点。
 * 点阵密度自左向右递增（seed 打分 + 时间偏置，确定性），级联越后越快、末点对拍 4160（镜内 80f）。
 * 尾帧：117 墨点全亮、点阵右端最密 → s40 收拢成一周七柱。
 */

/* ── 纯日期算数（禁 Date；Howard Hinnant days_from_civil） ── */
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

const pad2 = (n: number): string => String(n).padStart(2, '0');
const isoOf = (day: number): string => {
  const [y, m, d] = civilFromDays(day);
  return `${y}-${pad2(m)}-${pad2(d)}`;
};

/* ── 706 天窗口（data.ts 派生：快照日 -1 = 2026-11-13，再减 tag_span_days 705） ── */
const SNAP = SNAPSHOT_DATE.split('-').map(Number);
const END_DAY = daysFromCivil(SNAP[0], SNAP[1], SNAP[2]) - 1;
const START_DAY = END_DAY - SCALARS.tag_span_days;
const DAYS = SCALARS.tag_span_days + 1; // 706
const OFFSET = (((START_DAY + 4) % 7) + 7) % 7; // 0 = 周日（2024-12-08 为周日）
const COLS = Math.ceil((DAYS + OFFSET) / 7); // 101 周列

/* ── 点阵几何 ── */
const PITCH = 16;
const ROWS = 7;
const BAND_W = COLS * PITCH;
const BAND_H = ROWS * PITCH;
const BAND_LEFT = GRID.margin + (GRID.content - BAND_W) / 2;
const BAND_TOP = 380;

const MONTHLY = new Map<string, number>(SERIES.monthly_commits_2024_12_to_2026_11.map((m) => [m.month, m.value]));

/** 按真实月提交量切月桶（2024-12 … 2026-11，24 桶） */
const MONTH_BUCKETS: ReadonlyArray<{ ym: string; days: number[]; commits: number }> = (() => {
  const out: Array<{ ym: string; days: number[]; commits: number }> = [];
  for (let i = 0; i < DAYS; i++) {
    const [y, m] = civilFromDays(START_DAY + i);
    const ym = `${y}-${pad2(m)}`;
    const last = out[out.length - 1];
    if (last && last.ym === ym) last.days.push(i);
    else out.push({ ym, days: [i], commits: MONTHLY.get(ym) ?? 0 });
  }
  return out;
})();

/**
 * 117 个有提交的天：月度提交量 → 每月点亮天数（c^0.85 分配、有提交的月至少 1 天，
 * 配额硬对齐 SCALARS.commit_days），月内用 seed 洗牌定具体哪几天。
 * 确定性：同 seed 同结果（模块级一次算完，不每帧重算）；密度自然左疏右密（2025 只有 4 天）。
 */
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
    raw[best] = -1; // 每桶只补给一次
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

/** 月份刻度：每月首日所在列，隔月取一枚（24 个月 → 8 枚） */
const MONTH_TICKS: ReadonlyArray<{ label: string; col: number }> = (() => {
  const out: Array<{ label: string; col: number }> = [];
  let prev = '';
  for (let i = 0; i < DAYS; i++) {
    const [y, m] = civilFromDays(START_DAY + i);
    const ym = `${y}.${pad2(m)}`;
    if (ym !== prev) {
      prev = ym;
      out.push({ label: ym, col: Math.floor((i + OFFSET) / 7) });
    }
  }
  return out.filter((_, i) => i % 3 === 0);
})();

const S39: FC = () => {
  const frame = useCurrentFrame();

  /* NUM-01：1,243 / 117 / 706 三数滚动，落定 70–76（主落定 80） */
  const commits = Math.round(roll(frame, 22, 52, 0, SCALARS.commits_total));
  const litDays = Math.round(roll(frame, 26, 48, 0, SCALARS.commit_days));
  const totalDays = Math.round(roll(frame, 26, 48, 0, DAYS));

  /* CAM-01 沿点阵左→右横移（≤8% 画幅） */
  const truck = interpolate(frame, [8, 72], [16, -16], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: CURVES.cineEaseInOut,
  });

  /* 承接上镜热力网格：0–16f 收扁淡出（交出底纹给点阵） */
  const ghostOp = 1 - progress(frame, 2, 14);
  const ghostScale = 1 - 0.55 * progress(frame, 2, 16, CURVES.cineEaseInOut);
  /* GR-01 点阵自左向右铺开（列向擦拭，2–28f） */
  const spread = progress(frame, 2, 26, CURVES.cineEaseInOut);

  return (
    <ShotShell act="ACT 04 · 屋里" grid>
      <AbsoluteFill>
        <div style={{ position: 'absolute', left: GRID.margin, top: 118 }}>
          <Kicker>第 04 节 · 提交落点</Kicker>
        </div>
        <div style={{ position: 'absolute', right: GRID.margin, top: 118, textAlign: 'right' }}>
          <DataLabel size={18} style={{ fontVariantNumeric: 'tabular-nums' }}>
            {`${fmtInt(commits)} COMMITS · ${litDays}/${fmtInt(totalDays)} DAYS`}
          </DataLabel>
        </div>

        <div style={{ position: 'absolute', inset: 0, transform: `translateX(${truck}px)` }}>
          {/* 热力网格（上镜残留）收扁 */}
          <div
            style={{
              position: 'absolute',
              left: BAND_LEFT,
              top: BAND_TOP,
              width: BAND_W,
              height: BAND_H,
              backgroundColor: FILM_COLORS.paperDeep,
              opacity: 0.9 * ghostOp,
              transform: `scaleY(${ghostScale})`,
              transformOrigin: 'top center',
            }}
          />

          {/* 时间窗两端（TX-05 标识，不滚） */}
          <div style={{ position: 'absolute', left: BAND_LEFT, top: BAND_TOP - 30 }}>
            <Meta size={12}>{isoOf(START_DAY)}</Meta>
          </div>
          <div style={{ position: 'absolute', left: BAND_LEFT + BAND_W, top: BAND_TOP - 30, transform: 'translateX(-100%)' }}>
            <Meta size={12}>{isoOf(END_DAY)}</Meta>
          </div>

          <svg width={BAND_W} height={BAND_H} style={{ position: 'absolute', left: BAND_LEFT, top: BAND_TOP }}>
            <defs>
              {/* 未提交日：1 枚极淡点 = 1 天（706 点用 pattern 铺，不落 706 个节点） */}
              <pattern id="s39-dim-dot" width={PITCH} height={PITCH} patternUnits="userSpaceOnUse">
                <circle cx={PITCH / 2} cy={PITCH / 2} r={1.8} fill={FILM_COLORS.hairline} />
              </pattern>
            </defs>
            <clipPath id="s39-wipe">
              <rect x={0} y={0} width={BAND_W * spread} height={BAND_H} />
            </clipPath>
            <g clipPath="url(#s39-wipe)">
              <rect x={0} y={0} width={BAND_W} height={BAND_H} fill={FILM_COLORS.paperDeep} opacity={0.55} />
              {/* hairline 格线（7 行） */}
              {Array.from({ length: ROWS + 1 }, (_, r) => (
                <line
                  key={`rowline-${r}`}
                  x1={0}
                  x2={BAND_W}
                  y1={r * PITCH}
                  y2={r * PITCH}
                  stroke={FILM_COLORS.hairline}
                  strokeWidth={1}
                  opacity={0.5}
                />
              ))}
              <rect x={0} y={0} width={BAND_W} height={BAND_H} fill="url(#s39-dim-dot)" />
            </g>

            {/* EN-05：117 个提交日落点为墨点，越后越快、末点对拍 */}
            {LIT.map((idx, k) => {
              const col = Math.floor((idx + OFFSET) / 7);
              const row = (idx + OFFSET) % 7;
              const p = progress(frame, cascadeDelay(k, LIT.length, 14, 82, 0.3), 5);
              return (
                <circle
                  key={`lit-${idx}`}
                  cx={col * PITCH + PITCH / 2}
                  cy={row * PITCH + PITCH / 2}
                  r={2.4 + 2 * p}
                  fill={FILM_COLORS.ink}
                  opacity={0.92 * p}
                />
              );
            })}
          </svg>

          {/* 月份刻度 */}
          {MONTH_TICKS.map((t) => (
            <div key={t.label} style={{ position: 'absolute', left: BAND_LEFT + t.col * PITCH, top: BAND_TOP + BAND_H + 12 }}>
              <Meta size={12}>{t.label}</Meta>
            </div>
          ))}

          {/* 图例（一条 hairline 基座 + 三枚小标签） */}
          <div
            style={{
              position: 'absolute',
              left: BAND_LEFT,
              top: BAND_TOP + BAND_H + 54,
              display: 'flex',
              alignItems: 'center',
              gap: 18,
            }}
          >
            <div style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: FILM_COLORS.ink }} />
            <Meta size={12}>1 天 1 点</Meta>
            <div style={{ width: 80, height: 1, backgroundColor: FILM_COLORS.hairline }} />
            <Meta size={12}>墨点 = 当天有提交</Meta>
            <div style={{ width: 80, height: 1, backgroundColor: FILM_COLORS.hairline }} />
            <Meta size={12}>每列一周 · 行序 日→六</Meta>
          </div>
        </div>
      </AbsoluteFill>
    </ShotShell>
  );
};

export default S39;