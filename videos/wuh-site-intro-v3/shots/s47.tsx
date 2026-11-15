import type { FC } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { KineticLine } from '../components/KineticLine';
import { ShotShell } from '../components/ShotShell';
import { DataLabel, Kicker, Meta } from '../components/Type';
import { PROJECTS, SCALARS, SERIES } from '../data';
import { CURVES, FILM_COLORS, GRID, fmtInt, noise2D, progress, rnd, roll } from '../motion-tokens';

/**
 * s47 · 版本雨（100f，4800–4900 ｜ 主落定 80f）
 * FL-04：127 个版本号自上方斜落（noise2D 三参漂移），落成 2024-12-08 → 2026-11-13 的版本时间轴（705 天）；
 * CH-03：轴与月份刻度描画；版本号字符串本身不滚（TX-05），只有 127 / 705 两个计数滚（NUM-01）。
 * 尾帧：127 枚版本点落成时间轴、127 VERSIONS · 705 DAYS 在场 → s48 三数并置。
 */

const AXIS_L = 160;
const AXIS_R = 1760;
const AXIS_Y = 690;
const N = SCALARS.tags_total; // 127
const SPAN = SCALARS.tag_span_days; // 705
const LAST_TAG = PROJECTS[0].latestTag; // v1.4.107
const FIRST_TAG = 'v1.0.1';

/** 轴位：按版本序均布（真实 tag 日期不在快照内，刻度由月序列承担） */
const xOf = (i: number): number => AXIS_L + (i / (N - 1)) * (AXIS_R - AXIS_L);

/** 月份刻度：直接取 data.ts 的真实月序列（24 个月，隔月取一枚） */
const MONTHS = SERIES.monthly_commits_2024_12_to_2026_11.map((m) => m.month);
const MONTH_TICKS = MONTHS.map((label, i) => ({
  label,
  x: AXIS_L + (i / MONTHS.length) * (AXIS_R - AXIS_L),
})).filter((_, i) => i % 3 === 0);

const S47: FC = () => {
  const frame = useCurrentFrame();

  /* NUM-01：127 / 705 滚动落定 76（主落定 80） */
  const versions = Math.round(roll(frame, 38, 38, 0, N));
  const days = Math.round(roll(frame, 42, 34, 0, SPAN));

  /* CH-03 轴描画 20–60f */
  const axis = progress(frame, 20, 40, CURVES.cineEaseInOut);

  /* CAM-02 微推 */
  const push = 1 + 0.022 * progress(frame, 44, 36, CURVES.cineEaseInOut);

  return (
    <ShotShell act="ACT 05 · 方法">
      <AbsoluteFill>
        <div style={{ position: 'absolute', left: GRID.margin, top: 118 }}>
          <Kicker>第 05 节 · 版本</Kicker>
        </div>
        <div style={{ position: 'absolute', right: GRID.margin, top: 118, textAlign: 'right' }}>
          <DataLabel size={18} style={{ fontVariantNumeric: 'tabular-nums' }}>
            {`${fmtInt(versions)} VERSIONS · ${fmtInt(days)} DAYS`}
          </DataLabel>
        </div>

        <div style={{ position: 'absolute', inset: 0, transform: `scale(${push})`, transformOrigin: '50% 68%' }}>
          {/* 上镜 CI 三节点退场（墨块余影，10f 内淡净） */}
          {[GRID.margin, 840, 1560].map((x, i) => (
            <div
              key={`ci-out-${i}`}
              style={{
                position: 'absolute',
                left: x,
                top: 620,
                width: 240,
                height: 140,
                backgroundColor: FILM_COLORS.ink,
                opacity: 0.14 * (1 - progress(frame, 0, 10)),
              }}
            />
          ))}

          {/* 时间轴基座 */}
          <div
            style={{
              position: 'absolute',
              left: AXIS_L,
              top: AXIS_Y + 2,
              width: (AXIS_R - AXIS_L) * axis,
              height: 5,
              backgroundColor: FILM_COLORS.paperDeep,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: AXIS_L,
              top: AXIS_Y,
              width: (AXIS_R - AXIS_L) * axis,
              height: 1.5,
              backgroundColor: FILM_COLORS.ink,
              opacity: 0.7,
            }}
          />

          {/* 月份刻度（轴先稳，数据后动） */}
          {MONTH_TICKS.map((t, i) => {
            const p = progress(frame, 30 + i * 2, 8);
            return (
              <div key={t.label}>
                <div
                  style={{
                    position: 'absolute',
                    left: t.x,
                    top: AXIS_Y + 6,
                    width: 1,
                    height: 10,
                    backgroundColor: FILM_COLORS.hairline,
                    opacity: p,
                  }}
                />
                <div style={{ position: 'absolute', left: t.x, top: AXIS_Y + 22, opacity: p }}>
                  <Meta size={12}>{t.label.replace('-', '.')}</Meta>
                </div>
              </div>
            );
          })}

          {/* FL-04 版本雨：127 点斜落 */}
          {Array.from({ length: N }, (_, i) => {
            const at = 4 + (i / (N - 1)) * 34 + rnd('s47-ver', i) * 8;
            const p = progress(frame, at, 22, CURVES.cineEaseIn);
            const landY = AXIS_Y + (rnd('s47-ver-y', i) - 0.5) * 8;
            const drift = (noise2D(`s47-ver-${i}`, i * 3.1, frame / 22) - 0.5) * 18 * (1 - p);
            return (
              <div
                key={`ver-${i}`}
                style={{
                  position: 'absolute',
                  left: xOf(i) + drift - 2.4,
                  top: -140 + (landY + 140) * p - 2.4,
                  width: 4.8,
                  height: 4.8,
                  borderRadius: '50%',
                  backgroundColor: FILM_COLORS.ink,
                  opacity: 0.55 + 0.35 * p,
                }}
              />
            );
          })}

          {/* 版本号两端（TX-05 标识，不滚） */}
          <div style={{ position: 'absolute', left: AXIS_L, top: AXIS_Y - 52, opacity: progress(frame, 54, 10) }}>
            <Meta size={14} style={{ letterSpacing: '0.18em' }}>
              {FIRST_TAG}
            </Meta>
          </div>
          <div
            style={{
              position: 'absolute',
              left: AXIS_R,
              top: AXIS_Y - 52,
              transform: 'translateX(-100%)',
              textAlign: 'right',
              opacity: progress(frame, 58, 10),
            }}
          >
            <Meta size={14} style={{ letterSpacing: '0.18em' }}>
              {LAST_TAG}
            </Meta>
          </div>

          {/* 时间窗 + 图例 */}
          <div style={{ position: 'absolute', left: AXIS_L, top: AXIS_Y + 58 }}>
            <Meta size={12}>2024-12-08 → 2026-11-13 · 每点 = 一个版本号</Meta>
          </div>
        </div>

        <div style={{ position: 'absolute', left: GRID.margin, bottom: 108, width: 1500 }}>
          <KineticLine text="705 天，127 个版本。" start={24} framesPerChar={2} size={48} />
          <div style={{ marginTop: 16, height: 1, width: 320, backgroundColor: FILM_COLORS.hairline }} />
        </div>
      </AbsoluteFill>
    </ShotShell>
  );
};

export default S47;