import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { KineticLine } from '../components/KineticLine';
import { SealStamp } from '../components/SealStamp';
import { ShotShell } from '../components/ShotShell';
import { DataLabel, Kicker, Meta } from '../components/Type';
import { AUDIT_PRS, QUOTES, SCALARS } from '../data';
import { CURVES, FILM_COLORS, FONTS, GRID, draw, fmtInt, progress } from '../motion-tokens';

/**
 * s51 · 金句一（80f，5200–5280）
 * 承接 s50：窄时间带与九枚 PR 章原位淡为纸面底纹（0–12f 退到 5%）；
 * 主动作：第一句金句逐字入画（TX-01，2f/字）→「3 万」发丝下划线（TX-06 underline，draw 40f）
 * → 右下落款 #165 · 2026-07-05（TX-05）。主落定 60f。
 * 尾帧：金句全显 + 下划线在场 + 出处右下（交 s52 上翻 24px）。
 */

/** TX-01 逐字节奏（与 KineticLine 内部同式：2f/字，标点/空格 +2f 气口） */
const FPC = 2;
const PAUSE = new Set(['，', '。', '：', '；', '、', '？', '！', ' ']);
const advance = (s: string): number =>
  Array.from(s).reduce((t, ch) => t + FPC + (PAUSE.has(ch) ? 2 : 0), 0);

const QUOTE = QUOTES[2];
const LINE1 = QUOTE.text.slice(0, QUOTE.text.indexOf('，') + 1);
const LINE2 = QUOTE.text.slice(LINE1.length);
const MARK_AT = LINE1.indexOf('3');
const MARK_END = LINE1.indexOf('万') + 1;
const PRE = LINE1.slice(0, MARK_AT).trimEnd();
const MARK = LINE1.slice(MARK_AT, MARK_END);
const POST = LINE1.slice(MARK_END);

const T_PRE = 4;
const T_MARK = T_PRE + advance(`${PRE} `);
const T_POST = T_MARK + advance(MARK);
const T_LINE2 = T_POST + advance(POST);

const SOURCE = `#${QUOTE.source.slice(QUOTE.source.indexOf('#') + 1)} · ${QUOTE.date}`;

/** s50 交接物：上周窄时间带 + 九枚 PR 章（与 s50 同位同尺寸） */
const BAND_LEFT = 120;
const BAND_TOP = 360;
const BAND_W = 960;
const BAND_H = 56;
const DAYS = ['11-07', '11-08', '11-09', '11-10', '11-11', '11-12', '11-13'] as const;
const PR_GHOSTS = AUDIT_PRS.map((p) => p.pr);
/** 访问口径重置前的旧值（storyboard s50 / materials §〇；data.ts 只保留新口径 5,440） */
const VISITS_BEFORE = 10760;

const S51: FC = () => {
  const frame = useCurrentFrame();
  /** FX-07 去色退底纹：0–12f 从原状压到 5%（纸面底纹） */
  const residue = interpolate(frame, [0, 12], [1, 0.05], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: CURVES.cineEaseOut,
  });
  /** TX-06 underline 40f（18f 起笔 → 58f 收笔，落定 60f） */
  const underline = draw(progress(frame, 18, 40, CURVES.cineEaseInOut));
  /** TX-05 落款：44f 起 12f 入位 */
  const src = progress(frame, 44, 12, CURVES.cineEaseOut);

  return (
    <ShotShell act="ACT 06 · 签名">
      <AbsoluteFill>
        {/* 承接 s50 尾帧：窄时间带 / 九枚 PR 章 / 访问小卡原位退为纸面底纹（0–12f） */}
        <div style={{ position: 'absolute', inset: 0, opacity: residue }}>
          <div style={{ position: 'absolute', left: GRID.margin, top: 118 }}>
            <Kicker>第 05 节 · 上周</Kicker>
          </div>
          <div style={{ position: 'absolute', right: GRID.margin, top: 118 }}>
            <Meta size={12}>2026-11-07 → 2026-11-13</Meta>
          </div>
          <div
            style={{
              position: 'absolute',
              left: BAND_LEFT,
              top: BAND_TOP,
              width: BAND_W,
              height: BAND_H,
              boxSizing: 'border-box',
              backgroundColor: FILM_COLORS.paperDeep,
              border: `1px solid ${FILM_COLORS.hairline}`,
            }}
          />
          {DAYS.map((d, i) => (
            <div key={d} style={{ position: 'absolute', left: BAND_LEFT + (BAND_W / DAYS.length) * i + 10, top: BAND_TOP + BAND_H + 12 }}>
              <Meta size={12}>{d}</Meta>
            </div>
          ))}
          {PR_GHOSTS.map((pr, i) => (
            <div
              key={pr}
              style={{ position: 'absolute', left: BAND_LEFT + i * 113, top: BAND_TOP, width: 56, height: 56 }}
            >
              <SealStamp text={pr} size={56} start={-40} variant="label" />
            </div>
          ))}
          <div style={{ position: 'absolute', left: BAND_LEFT, top: BAND_TOP + BAND_H + 58 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 18 }}>
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
                9
              </div>
              <DataLabel size={18} color={FILM_COLORS.inkSoft}>
                PRS MERGED · 审计 #568 批次 2–7
              </DataLabel>
            </div>
          </div>
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
              }}
            >
              {fmtInt(SCALARS.visits_total)}
            </div>
            <div style={{ marginTop: 20, width: '100%', height: 1, backgroundColor: FILM_COLORS.hairline }} />
            <div style={{ marginTop: 22, display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ position: 'relative', fontFamily: FONTS.mono, fontSize: 22, color: FILM_COLORS.muted }}>
                {fmtInt(VISITS_BEFORE)}
                <div style={{ position: 'absolute', left: 0, top: '52%', width: 84, height: 1.5, backgroundColor: FILM_COLORS.vermillion }} />
              </div>
            </div>
          </div>
        </div>

        {/* 金句一：两行，2f/字逐字入画 */}
        <div style={{ position: 'absolute', left: 260, top: 402, width: 1400 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', whiteSpace: 'pre' }}>
            <KineticLine
              text={PRE}
              start={T_PRE}
              framesPerChar={FPC}
              size={64}
              lineHeight={1.35}
              style={{ whiteSpace: 'pre' }}
            />
            <div style={{ width: 18, flexShrink: 0 }} />
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <KineticLine
                text={MARK}
                start={T_MARK}
                framesPerChar={FPC}
                size={64}
                lineHeight={1.35}
                style={{ whiteSpace: 'pre' }}
              />
              <svg
                width="100%"
                height={6}
                viewBox="0 0 100 6"
                preserveAspectRatio="none"
                style={{ position: 'absolute', left: 0, right: 0, bottom: 4, display: 'block' }}
              >
                <line
                  x1={0.5}
                  y1={3}
                  x2={99.5}
                  y2={3}
                  stroke={FILM_COLORS.vermillion}
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                  {...underline}
                />
              </svg>
            </div>
            <KineticLine
              text={POST}
              start={T_POST}
              framesPerChar={FPC}
              size={64}
              lineHeight={1.35}
              style={{ whiteSpace: 'pre' }}
            />
          </div>
          <KineticLine text={LINE2} start={T_LINE2} framesPerChar={FPC} size={64} lineHeight={1.35} />
        </div>

        {/* 出处：mono 右下 */}
        <div
          style={{
            position: 'absolute',
            right: GRID.margin,
            top: 706,
            opacity: src,
            transform: `translateY(${(1 - src) * 6}px)`,
          }}
        >
          <Meta size={18}>{SOURCE}</Meta>
        </div>
      </AbsoluteFill>
    </ShotShell>
  );
};

export default S51;