import type { CSSProperties, FC } from 'react';
import { AbsoluteFill, interpolateColors, useCurrentFrame, useVideoConfig } from 'remotion';
import { SealStamp } from '../components/SealStamp';
import { ShotShell } from '../components/ShotShell';
import { Meta } from '../components/Type';
import { SERIES } from '../data';
import { CURVES, FILM_COLORS, FONTS, SP, blink, progress, springP, typedCount } from '../motion-tokens';

const YEAR_2021 = SERIES.yearly_writing_2019_2026[2].year;

/** 三槽版式（与 s09 同几何，交接态逐像素可续） */
const SLOT = { w: 380, h: 240, y: 380, xs: [380, 800, 1220] as const };
const NODE_POS = { x: 200, y: 500 } as const;
const BAND = { x: 528, top: 136, w: 864, h: 28 } as const;

/** 一行 TS 代码：关键词 ink、类型名朱红（逐字打出，2.5f/字 = TX-02 的 code 档） */
const CODE = [
  { text: 'type ', color: FILM_COLORS.ink },
  { text: 'Shot', color: FILM_COLORS.vermillion },
  { text: ' = { id: string }', color: FILM_COLORS.ink },
] as const;
let ACC = 0;
const SEGS = CODE.map((seg) => {
  const start = ACC;
  ACC += seg.text.length;
  return { ...seg, start };
});
const CODE_LEN = ACC;

const codeCard: CSSProperties = {
  position: 'absolute',
  left: 240,
  top: 676,
  width: 1440,
  height: 216,
  boxSizing: 'border-box',
  backgroundColor: FILM_COLORS.card,
  border: `1px solid ${FILM_COLORS.hairline}`,
};

/**
 * s10 · TYPESCRIPT（100f，1030–1130）
 * 承接 s09 两空槽 → 第二槽填入 TYPESCRIPT：TX-02 一行代码 `type Shot = { id: string }` 逐字打出
 * （关键词 ink、类型名朱红）→ INK-04 TYPESCRIPT 朱砂藏印落定 → EN-02 cover 槽盖扣合。
 * CAM-02 推进（1 → 1.03，代码行 → 槽位）。
 * 主落定 90（槽盖扣合，全片 1120 · 拍 56）。
 * 尾帧：DOCKER / TYPESCRIPT 两槽已填、代码行停最后一行、第三槽仍空 → 交 s11 填 GITHUB ACTIONS。
 */
const S10: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  /* EN-02 槽盖扣合（Y −40 → 0，落定 90） */
  const lid = springP(frame, fps, 78, SP.cover);
  const slotBorder = interpolateColors(lid, [0, 1], [FILM_COLORS.hairline, FILM_COLORS.inkSoft]);
  /* CAM-02 推进 1 → 1.03（20–90） */
  const push = 1 + 0.03 * progress(frame, 20, 70, CURVES.cineEaseInOut);
  /* 承接态横带退场（0–16） */
  const bandOut = progress(frame, 0, 16, CURVES.cineEaseIn);
  /* TX-02 逐字（12 起，2.5f/字） */
  const count = typedCount(frame, 12, 2.5, CODE_LEN);
  const done = count >= CODE_LEN;
  const cursorOn = done ? blink(frame, 6) : true;

  return (
    <ShotShell act="ACT 01 · 起点">
      <AbsoluteFill>
        <div style={{ position: 'absolute', inset: 0, transform: `scale(${push})`, transformOrigin: 'center center' }}>
          {/* 承接态：s09 尾帧的横带底纹 */}
          <div
            style={{
              position: 'absolute',
              left: BAND.x,
              top: BAND.top,
              width: BAND.w,
              height: BAND.h,
              boxSizing: 'border-box',
              border: `1px solid ${FILM_COLORS.hairline}`,
              backgroundColor: FILM_COLORS.paperDeep,
              opacity: 0.5 * (1 - bandOut),
            }}
          />

          {/* 2021 节点 + 三枚槽 */}
          <div
            style={{
              position: 'absolute',
              left: NODE_POS.x - 5,
              top: NODE_POS.y - 5,
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: FILM_COLORS.accent,
            }}
          />
          <div style={{ position: 'absolute', left: NODE_POS.x - 40, top: NODE_POS.y + 22, width: 80 }}>
            <Meta size={20} style={{ textAlign: 'center' }} color={FILM_COLORS.inkSoft}>
              {YEAR_2021}
            </Meta>
          </div>
          <div style={{ position: 'absolute', left: NODE_POS.x + 10, top: NODE_POS.y - 0.5, width: SLOT.xs[0] - NODE_POS.x - 10, height: 1, backgroundColor: FILM_COLORS.hairline }} />

          {SLOT.xs.map((x, i) => (
            <div
              key={`slot-${i}`}
              style={{
                position: 'absolute',
                left: x,
                top: SLOT.y,
                width: SLOT.w,
                height: SLOT.h,
                boxSizing: 'border-box',
                border: `1px ${i === 1 && frame >= 78 ? 'solid' : 'dashed'} ${i === 1 ? slotBorder : FILM_COLORS.hairline}`,
              }}
            />
          ))}

          {/* 槽 1：DOCKER 藏印（承接 s09 尾帧） */}
          <div style={{ position: 'absolute', left: SLOT.xs[0] + (SLOT.w - 48) / 2, top: SLOT.y + (SLOT.h - 48) / 2 }}>
            <SealStamp text="DOCKER" size={48} start={-60} />
          </div>

          {/* 槽 2：TYPESCRIPT 朱砂藏印（横向，>6 字走横排版式） */}
          <div style={{ position: 'absolute', left: SLOT.xs[1] + 40, top: SLOT.y + 96, width: SLOT.w - 80 }}>
            <div style={{ textAlign: 'center' }}>
              <SealStamp text="TYPESCRIPT" size={48} start={56} />
            </div>
          </div>

          {/* 槽 2 槽盖：EN-02 cover（Y −40 → 0，扣合 90） */}
          <div
            style={{
              position: 'absolute',
              left: SLOT.xs[1],
              top: SLOT.y - 40 + 40 * lid,
              width: SLOT.w,
              height: 26,
              boxSizing: 'border-box',
              backgroundColor: FILM_COLORS.card,
              border: `1px solid ${FILM_COLORS.inkSoft}`,
              boxShadow: lid > 0.98 ? `inset 0 1px 0 ${FILM_COLORS.hairline}` : 'none',
            }}
          />

          {/* TX-02 一行代码（白底卡 + mono 行 + 逐字 + 光标） */}
          <div style={codeCard} />
          <div
            style={{
              position: 'absolute',
              left: 288,
              top: 736,
              fontFamily: FONTS.mono,
              fontSize: 56,
              lineHeight: 1.6,
              whiteSpace: 'pre',
              color: FILM_COLORS.ink,
            }}
          >
            {SEGS.map((seg) => {
              const n = Math.max(0, Math.min(seg.text.length, count - seg.start));
              if (n <= 0) return null;
              return (
                <span key={seg.text} style={{ color: seg.color }}>
                  {seg.text.slice(0, n)}
                </span>
              );
            })}
            <span
              style={{
                display: 'inline-block',
                width: 6,
                height: 52,
                marginLeft: 2,
                verticalAlign: 'text-bottom',
                backgroundColor: FILM_COLORS.vermillion,
                opacity: cursorOn ? 1 : 0,
              }}
            />
          </div>
        </div>
      </AbsoluteFill>
    </ShotShell>
  );
};

export default S10;