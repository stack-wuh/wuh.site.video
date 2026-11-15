import type { FC } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { KineticLine } from '../components/KineticLine';
import { SealStamp } from '../components/SealStamp';
import { ShotShell } from '../components/ShotShell';
import { Meta } from '../components/Type';
import { QUOTES } from '../data';
import { CURVES, FILM_COLORS, FONTS, GRID, draw, progress } from '../motion-tokens';

/**
 * s52 · 金句二 + 朱砂小印（70f，5280–5350）
 * 承接 s51：整页向上翻走 24px（LAY-12 nudge-24px），金句一退为底纹（0.28）；
 * 主动作：第二句自下升起（TX-01，2f/字、行距更松 1.7）→ 句末「此乐何极」朱砂小印落定（INK-04，微旋 +1.6°）。
 * 主落定 60f；尾帧 10f 交 s53（小印退场）。
 */

/** TX-01 逐字节奏（与 KineticLine 内部同式：2f/字，标点/空格 +2f 气口） */
const FPC = 2;
const PAUSE = new Set(['，', '。', '：', '；', '、', '？', '！', ' ']);
const advance = (s: string): number =>
  Array.from(s).reduce((t, ch) => t + FPC + (PAUSE.has(ch) ? 2 : 0), 0);

/** 上一镜的整页（金句一 + 「3 万」下划线），本镜只做整体上移与退底纹 */
const Q1 = QUOTES[2];
const L1 = Q1.text.slice(0, Q1.text.indexOf('，') + 1);
const L2 = Q1.text.slice(L1.length);
const MARK_AT = L1.indexOf('3');
const MARK_END = L1.indexOf('万') + 1;
const PRE = L1.slice(0, MARK_AT).trimEnd();
const MARK = L1.slice(MARK_AT, MARK_END);
const POST = L1.slice(MARK_END);
const SOURCE = `#${Q1.source.slice(Q1.source.indexOf('#') + 1)} · ${Q1.date}`;

/** 本镜金句：句读处断行（行距更松） */
const Q2 = QUOTES[5];
const Q2_BREAK = Q2.text.indexOf('，') + 1;
const Q2_LINE1 = Q2.text.slice(0, Q2_BREAK);
const Q2_LINE2 = Q2.text.slice(Q2_BREAK);
const SEAL_TEXT = '此乐何极';

const S52: FC = () => {
  const frame = useCurrentFrame();
  /** LAY-12 nudge-24px：整页 12f 上翻 24px */
  const nudge = progress(frame, 0, 12, CURVES.cineEaseInOut);
  const dy = -24 * nudge;
  /** 金句一退底纹（0–22f），随后在尾段彻底退净（40–68f，避免切 s53 时残留） */
  const held = progress(frame, 0, 22, CURVES.cineEaseInOut);
  const heldOpacity = (1 - 0.72 * held) * (1 - progress(frame, 40, 28, CURVES.cineEaseIn));

  const floor = 600 + (1 - progress(frame, 8, 18, CURVES.cineEaseOut)) * 26;

  return (
    <ShotShell act="ACT 06 · 签名">
      <AbsoluteFill>
        {/* 上一页：整页上翻 24px、退为纸面底纹 */}
        <div style={{ position: 'absolute', left: 260, top: 402 + dy, width: 1400, opacity: heldOpacity }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              whiteSpace: 'pre',
              fontFamily: FONTS.serif,
              fontSize: 64,
              lineHeight: 1.35,
              color: FILM_COLORS.ink,
            }}
          >
            <span>{PRE}</span>
            <span style={{ display: 'inline-block', width: 18 }} />
            <span style={{ position: 'relative' }}>
              {MARK}
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
                  {...draw(1)}
                />
              </svg>
            </span>
            <span>{POST}</span>
          </div>
          <div style={{ fontFamily: FONTS.serif, fontSize: 64, lineHeight: 1.35, color: FILM_COLORS.ink }}>{L2}</div>
        </div>
        <div style={{ position: 'absolute', right: GRID.margin, top: 706 + dy, opacity: heldOpacity }}>
          <Meta size={18}>{SOURCE}</Meta>
        </div>

        {/* 金句二：自下升起，行距更松 */}
        <div style={{ position: 'absolute', left: 260, top: 600, width: 1400 }}>
          <div style={{ transform: `translateY(${floor - 600}px)` }}>
            <KineticLine
              text={Q2_LINE1}
              start={10}
              framesPerChar={FPC}
              size={64}
              lineHeight={1.7}
            />
            <KineticLine
              text={Q2_LINE2}
              start={10 + advance(Q2_LINE1)}
              framesPerChar={FPC}
              size={64}
              lineHeight={1.7}
            />
          </div>
        </div>

        {/* 句末朱砂小印：+1.6° 藏印，42f 起压 → 60f 落定 */}
        <div style={{ position: 'absolute', left: 850, top: 736 }}>
          <SealStamp text={SEAL_TEXT} size={48} start={42} tilt={false} style={{ transform: 'rotate(1.6deg)' }} />
        </div>
      </AbsoluteFill>
    </ShotShell>
  );
};

export default S52;