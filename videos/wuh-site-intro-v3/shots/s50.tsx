import type { FC } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { KineticLine } from '../components/KineticLine';
import { ShotShell } from '../components/ShotShell';
import { DataLabel, Kicker, Meta } from '../components/Type';
import { AUDIT_PRS, REPOS, SCALARS } from '../data';
import { CURVES, FILM_COLORS, FONTS, GRID, SP, fmtInt, progress, roll, slam, springP } from '../motion-tokens';

/**
 * s50 · 九枚 PR 章 + 访问口径（120f，5080–5200 ｜ 主落定 80f）
 * LAY-02：六条仓库横条向左收成「上周」窄时间带（11-07 → 11-13，共 7 天）；
 * INK-04：九枚 PR 章依次落下（错 6f，14→62），落定后带下浮出 9 PRs MERGED · 审计 #568 批次 2–7；
 * 右侧「近 90 天访问 5,440」小卡 + TX-06 strike「10,760 → 5,440」（口径重置：数字变小但从此可解释）。
 * 尾帧：九章 + 窄带定格、5,440 小卡在右 → s51 金句。
 */

/** 六条横条（与 s49 同源同序，收拢起点必须承接） */
const ROWS = [...REPOS].sort((a, b) => b.commits - a.commits);
const MAX = Math.max(...ROWS.map((r) => r.commits));
const BAR_X = 460;
const BAR_MAX = 1080;

const BAND_LEFT = GRID.margin;
const BAND_W = 960;
const BAND_TOP = 360;
const BAND_H = 56;
const CHIP_W = 86;
const CHIP_H = 38;
const CHIP_PITCH = (BAND_W - CHIP_W) / (AUDIT_PRS.length - 1);

/** 访问口径重置前的旧值（storyboard s50 / materials §〇；data.ts 只保留新口径 5,440） */
const VISITS_BEFORE = 10760;

const DAYS = ['11-07', '11-08', '11-09', '11-10', '11-11', '11-12', '11-13'] as const;

const S50: FC = () => {
  const frame = useCurrentFrame();

  /* LAY-02：六条 → 窄带（0–16f） */
  const flat = progress(frame, 0, 16, CURVES.cineEaseInOut);
  const bandIn = progress(frame, 10, 10, CURVES.cineEaseOut);

  /* NUM-01：9 / 5,440 / 10,760 */
  const merged = Math.round(roll(frame, 40, 34, 0, AUDIT_PRS.length));
  const visits = Math.round(roll(frame, 42, 34, 0, SCALARS.visits_total));
  const before = Math.round(roll(frame, 44, 32, 0, VISITS_BEFORE));
  const hit = slam(frame, 76);

  /* TX-06 strike：78–102f，1.5px 朱红 */
  const strike = progress(frame, 78, 24, CURVES.cineEaseInOut);

  /* CAM-02 微推 */
  const push = 1 + 0.02 * progress(frame, 60, 40, CURVES.cineEaseInOut);

  return (
    <ShotShell act="ACT 05 · 方法">
      <AbsoluteFill>
        <div style={{ position: 'absolute', left: GRID.margin, top: 118 }}>
          <Kicker>第 05 节 · 上周</Kicker>
        </div>
        <div style={{ position: 'absolute', right: GRID.margin, top: 118, textAlign: 'right' }}>
          <Meta size={12}>2026-11-07 → 2026-11-13</Meta>
        </div>

        <div style={{ position: 'absolute', inset: 0, transform: `scale(${push})`, transformOrigin: '40% 46%' }}>
          {/* 上镜六条横条收成窄带 */}
          {ROWS.map((repo, i) => {
            const w = (repo.commits / MAX) * BAR_MAX;
            const width = w + (BAND_W - w) * flat;
            const height = 26 + (6 - 26) * flat;
            const left = BAR_X + (BAND_LEFT - BAR_X) * flat;
            const top = 300 + i * 76 + 8 + (BAND_TOP + BAND_H / 2 - (300 + i * 76 + 8)) * flat;
            return (
              <div
                key={`bar-${repo.name}`}
                style={{
                  position: 'absolute',
                  left,
                  top,
                  width,
                  height,
                  backgroundColor: FILM_COLORS.ink,
                  opacity: (1 - 0.8 * flat) * 0.82,
                }}
              />
            );
          })}

          {/* 「上周」窄时间带 */}
          <div
            style={{
              position: 'absolute',
              left: BAND_LEFT,
              top: BAND_TOP,
              width: BAND_W,
              height: BAND_H * (0.15 + 0.85 * bandIn),
              backgroundColor: FILM_COLORS.paperDeep,
              border: `1px solid ${FILM_COLORS.hairline}`,
              boxSizing: 'border-box',
              opacity: progress(frame, 10, 8),
            }}
          />
          {DAYS.map((d, i) => (
            <div key={d} style={{ position: 'absolute', left: BAND_LEFT + (BAND_W / DAYS.length) * i + 10, top: BAND_TOP + BAND_H + 12 }}>
              <Meta size={12}>{d}</Meta>
            </div>
          ))}

          {/* INK-04：九枚 PR 章依次落下（错 6f） */}
          {AUDIT_PRS.map((pr, i) => {
            const at = 14 + i * 6;
            const pop = springP(frame, 30, at, SP.badgePop);
            const a = progress(frame, at, 4);
            return (
              <div
                key={pr.pr}
                style={{
                  position: 'absolute',
                  left: BAND_LEFT + i * CHIP_PITCH,
                  top: BAND_TOP + (BAND_H - CHIP_H) / 2,
                  width: CHIP_W,
                  height: CHIP_H,
                  boxSizing: 'border-box',
                  border: `1px solid ${FILM_COLORS.vermillion}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: FONTS.mono,
                  fontSize: 15,
                  letterSpacing: '0.02em',
                  color: FILM_COLORS.vermillion,
                  backgroundColor: FILM_COLORS.card,
                  opacity: a,
                  transform: `scale(${0.72 + 0.28 * pop})`,
                }}
              >
                {pr.pr}
              </div>
            );
          })}

          {/* 合并结果（9 是量，也滚；一行读完） */}
          <div style={{ position: 'absolute', left: BAND_LEFT, top: BAND_TOP + BAND_H + 58, display: 'flex', alignItems: 'baseline', gap: 18 }}>
            <div
              style={{
                fontFamily: FONTS.serif,
                fontWeight: 700,
                fontSize: 76,
                lineHeight: 0.9,
                color: FILM_COLORS.vermillion,
                fontVariantNumeric: 'tabular-nums lining-nums',
              }}
            >
              {merged}
            </div>
            <DataLabel size={18} color={FILM_COLORS.inkSoft}>
              PRS MERGED · 审计 #568 批次 2–7
            </DataLabel>
          </div>
          <div
            style={{
              position: 'absolute',
              left: BAND_LEFT,
              top: BAND_TOP + BAND_H + 152,
              width: 640 * progress(frame, 46, 12),
              height: 1,
              backgroundColor: FILM_COLORS.hairline,
            }}
          />

          {/* 访问小卡（近 90 天） */}
          <div
            style={{
              position: 'absolute',
              left: 1180,
              top: 268,
              width: 620,
              height: 360,
              boxSizing: 'border-box',
              backgroundColor: FILM_COLORS.card,
              border: `1px solid ${FILM_COLORS.hairline}`,
              padding: 30,
              opacity: progress(frame, 24, 10),
            }}
          >
            <Meta size={12}>近 90 天访问</Meta>
            <div
              style={{
                marginTop: 18,
                fontFamily: FONTS.serif,
                fontWeight: 700,
                fontSize: 104,
                lineHeight: 0.95,
                letterSpacing: '-0.02em',
                color: FILM_COLORS.ink,
                fontVariantNumeric: 'tabular-nums lining-nums',
                transform: `translate(${hit.dx}px, ${hit.dy}px) scale(${hit.scale})`,
                transformOrigin: 'left bottom',
              }}
            >
              {fmtInt(visits)}
            </div>
            <div style={{ marginTop: 20, width: '100%', height: 1, backgroundColor: FILM_COLORS.hairline }} />
            <div style={{ marginTop: 22, display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ position: 'relative', fontFamily: FONTS.mono, fontSize: 22, color: FILM_COLORS.muted, fontVariantNumeric: 'tabular-nums' }}>
                {fmtInt(before)}
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: '52%',
                    width: 84 * strike,
                    height: 1.5,
                    backgroundColor: FILM_COLORS.vermillion,
                  }}
                />
              </div>
              <div style={{ fontFamily: FONTS.mono, fontSize: 22, color: FILM_COLORS.muted }}>→</div>
              <div style={{ fontFamily: FONTS.mono, fontSize: 22, color: FILM_COLORS.ink, fontVariantNumeric: 'tabular-nums' }}>
                {fmtInt(SCALARS.visits_total)}
              </div>
            </div>
            <div style={{ marginTop: 18 }}>
              <Meta size={12}>口径重置 · 同一口径去重后</Meta>
            </div>
          </div>
        </div>

        <div style={{ position: 'absolute', left: GRID.margin, bottom: 108, width: 1560 }}>
          <KineticLine text="上周，他合并了 9 个 PR——把访问统计重做了一遍。" start={12} framesPerChar={2} size={48} />
          <div style={{ marginTop: 16, height: 1, width: 320, backgroundColor: FILM_COLORS.hairline }} />
        </div>
      </AbsoluteFill>
    </ShotShell>
  );
};

export default S50;