import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { SealStamp } from '../components/SealStamp';
import { ShotShell } from '../components/ShotShell';
import { DataLabel, Hairline, Meta, Serif } from '../components/Type';
import { ARTICLES, SCALARS, SERIES } from '../data';
import { EASE, FILM_COLORS, FONTS, GRID, SP, clamp01, fmtInt, progress, roll, springP } from '../motion-tokens';

/** 2026 年有提交的月份：03 → 11（storyboard「3→11 月」；零提交的 01/02 不上阵） */
const MONTHS = SERIES.monthly_commits_2024_12_to_2026_11.filter((m) => m.month >= '2026-03');
const MAX_V = Math.max(...MONTHS.map((m) => m.value));
/** 2026 占比：1,208 / 1,243 = 97.2%（由 SCALARS 派生，不写字面量） */
const RATIO = (SCALARS.commits_2026 / SCALARS.commits_total) * 100;

/** 正面：s29 交出的《重启计划》标题卡（同一矩形，翻面前的同态） */
const CARD = { x: 360, y: 290, w: 1200, h: 500 } as const;
const POST = ARTICLES[2];

/** 柱阵几何：内容区 1680 宽、9 柱、柱距 24；baseline 780、最高 288 映射 380px */
const BASE_Y = 780;
const MAX_H = 380;
const GAP = 24;
const BAR_W = (GRID.content - GAP * (MONTHS.length - 1)) / MONTHS.length;

/**
 * s30 · 标题卡翻转成 2026 柱阵（90f，3110–3200）
 * LAY-07 CARD-FLIP：卡 0→90°（10f cineEaseIn）→ 换面 → 背面 90→0°（10f cineEaseOut），背面先画柱阵骨架；
 * CH-01 九柱自基线生长（错 3f，末柱 11 月 53 停）+ NUM-01 1,208 / 97.2%（80 落定）+ CAM-01 自左扫到右。
 * 尾帧：九柱全立、末柱与 2026 标签在场（交 s31 门框回中）。
 */
const S30: FC = () => {
  const frame = useCurrentFrame();
  // LAY-07 翻面：0–10 翻出，10–20 翻入
  const flipOut = progress(frame, 0, 10, EASE.in);
  const flipIn = progress(frame, 10, 10, EASE.out);
  const frontAngle = 90 * flipOut;
  const backAngle = -90 + 90 * flipIn;
  const truck = -(1 - progress(frame, 0, 70, EASE.inOut)) * 26;
  // 右上 mono：NUM-01 18f 微滚，70 落定（与末柱同时）
  const total = roll(frame, 48, 22, 0, SCALARS.commits_2026);
  const ratio = roll(frame, 48, 22, 0, RATIO);
  // 末柱（11 月）partial：落定后一次 1px hairline 闪（尾帧仍可读）
  const lastFlash = interpolate(frame, [74, 76, 80], [0, 1, 0.35], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <ShotShell act="ACT 03 · 重启">
      <AbsoluteFill>
        <div style={{ position: 'absolute', inset: 0, transform: `translateX(${truck}px)` }}>
          {/* ── 背面：2026 柱阵（先画骨架，翻入时已在） ── */}
          <div style={{ position: 'absolute', inset: 0, opacity: frame >= 9 ? 1 : 0 }}>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                transform: `perspective(1600px) rotateY(${backAngle}deg)`,
                backfaceVisibility: 'hidden',
                transformOrigin: 'center center',
              }}
            >
              {/* CH-02 轴先立：baseline + 月份刻度位 */}
              <div style={{ position: 'absolute', left: GRID.margin, top: BASE_Y, width: GRID.content, height: 1, backgroundColor: FILM_COLORS.hairline }} />

              {MONTHS.map((m, i) => {
                const at = 20 + i * 3;
                const s = clamp01(springP(frame, 30, at, SP.dotDrop));
                const v = roll(frame, 46 + i * 3 - 18, 18, 0, m.value);
                const h = Math.max(2, (m.value / MAX_V) * MAX_H) * s;
                const partial = m.partial;
                const left = GRID.margin + i * (BAR_W + GAP);
                return (
                  <div key={m.month}>
                    {/* 柱体：11 月为未走完的 partial（纸深底 + hairline 边） */}
                    <div
                      style={{
                        position: 'absolute',
                        left,
                        top: BASE_Y - h,
                        width: BAR_W,
                        height: h,
                        backgroundColor: partial ? FILM_COLORS.paperDeep : FILM_COLORS.ink,
                        border: partial ? `1px solid ${FILM_COLORS.hairline}` : undefined,
                        boxSizing: 'border-box',
                      }}
                    />
                    {/* partial 顶上一道朱红 hairline（尾帧闪） */}
                    {partial ? (
                      <div
                        style={{
                          position: 'absolute',
                          left,
                          top: BASE_Y - h - 2,
                          width: BAR_W,
                          height: 1,
                          backgroundColor: FILM_COLORS.vermillion,
                          opacity: lastFlash,
                        }}
                      />
                    ) : null}
                    {/* 柱顶数字（NUM-01，20f 内落定，末柱对拍 70） */}
                    <div
                      style={{
                        position: 'absolute',
                        left,
                        top: BASE_Y - h - 40,
                        width: BAR_W,
                        textAlign: 'center',
                        fontFamily: FONTS.mono,
                        fontSize: 20,
                        color: partial ? FILM_COLORS.muted : FILM_COLORS.ink,
                        fontVariantNumeric: 'tabular-nums',
                        opacity: clamp01(progress(frame, 28 + i * 3, 6)),
                      }}
                    >
                      {fmtInt(v)}
                    </div>
                    {/* 月份刻度 */}
                    <div style={{ position: 'absolute', left, top: BASE_Y + 16, width: BAR_W, textAlign: 'center' }}>
                      <Meta size={14}>{m.month.slice(5)}</Meta>
                    </div>
                  </div>
                );
              })}

              {/* 右上 mono：2026 · 1,208 COMMITS · 97.2% */}
              <div
                style={{
                  position: 'absolute',
                  right: GRID.margin,
                  top: 118,
                  textAlign: 'right',
                  opacity: progress(frame, 46, 4),
                }}
              >
                <DataLabel size={18}>
                  {`2026 · ${fmtInt(total)} COMMITS · ${ratio.toFixed(1)}%`}
                </DataLabel>
                <div style={{ marginTop: 10, marginLeft: 'auto', width: 220 }}>
                  <Hairline />
                </div>
              </div>

              {/* 左下：chart 脚注（数据出处的口径，非装饰） */}
              <div style={{ position: 'absolute', left: GRID.margin, top: BASE_Y + 62 }}>
                <Meta size={13}>{`MONTHLY · ${MONTHS.length} BARS · ${fmtInt(SCALARS.commits_2026)} / ${fmtInt(SCALARS.commits_total)}`}</Meta>
              </div>
            </div>
          </div>

          {/* ── 正面：标题卡（s29 尾帧同态，翻出） ── */}
          <div
            style={{
              position: 'absolute',
              left: CARD.x,
              top: CARD.y,
              width: CARD.w,
              height: CARD.h,
              transform: `perspective(1500px) rotateY(${frontAngle}deg)`,
              transformOrigin: 'center center',
              backfaceVisibility: 'hidden',
              backgroundColor: FILM_COLORS.card,
              border: `1px solid ${FILM_COLORS.hairline}`,
              boxSizing: 'border-box',
            }}
          >
            <div style={{ position: 'absolute', left: 64, top: 96 }}>
              <Serif size={64} weight={700}>{`《${POST.title}》`}</Serif>
            </div>
            <div style={{ position: 'absolute', left: 64, top: 196, width: 268, height: 1, backgroundColor: FILM_COLORS.hairline }} />
            <div style={{ position: 'absolute', left: 64, top: 226 }}>
              <Meta size={18}>2026-06-27 · PUBLISHED</Meta>
            </div>
            <div style={{ position: 'absolute', left: 64, top: 268 }}>
              <DataLabel size={16}>{`#${POST.number} · RESTART PLAN · WEEKLY`}</DataLabel>
            </div>
            <div style={{ position: 'absolute', left: CARD.w - 236, top: CARD.h - 108 }}>
              <SealStamp text="CHANGELOG" size={44} start={-40} />
            </div>
            <div style={{ position: 'absolute', left: CARD.w + 44, top: CARD.h / 2 - 34 }}>
              <Meta size={26}>{`#${POST.number}`}</Meta>
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </ShotShell>
  );
};

export default S30;