import type { FC } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { KineticLine } from '../components/KineticLine';
import { SealStamp } from '../components/SealStamp';
import { ShotShell } from '../components/ShotShell';
import { DataLabel, Meta } from '../components/Type';
import { SERIES } from '../data';
import { CURVES, FILM_COLORS, progress, springIn } from '../motion-tokens';

/** 2021（引自 data.ts 年度序列，第三年） */
const YEAR_2021 = SERIES.yearly_writing_2019_2026[2].year;

/** 三槽版式（s09 / s10 / s11 共用几何：版面切换逐像素可续） */
const SLOT = { w: 380, h: 240, y: 380, xs: [380, 800, 1220] as const };

/** 承接 s08 的四卡阵（压扁成横带退到画面上沿） */
const CARD = { x: 528, y: 300, w: 400, h: 210, gap: 64 } as const;
const STACK = ['NODE', 'EXPRESS', 'MONGODB', 'NGINX'] as const;
/** 四卡中心 542 → 横带中心 150（scaleY 0.06 后高 29） */
const BAND_TOP = 136;
const BAND_H = 28;

const NODE_POS = { x: 200, y: 500 } as const;

/**
 * s09 · 工具换代（110f，920–1030）
 * 承接 s08 四卡阵 → LAY-02 压扁成一条横带退到画面上沿 → EN-01 2021 刻度节点亮起
 * + 节点右侧三枚空槽 → LAY-13 槽内旧 PM2 三方块进程图被容器框同位替换（overlap 4f，旧件不残留）
 * → INK-04 DOCKER 以朱砂藏印样式落定（微旋 ±1.6°）。
 * 主落定 60（DOCKER 藏印落定，全片 980 · 拍 49）。
 * 尾帧：2021 亮、DOCKER 槽已填、另两槽空 → 交 s10 填 TYPESCRIPT。
 */
const S09: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  /* LAY-02 四卡 → 横带（0–20，方向单一不回弹） */
  const flat = progress(frame, 0, 20, CURVES.cineEaseInOut);
  /* 2021 节点 EN-01 入场 */
  const nodeIn = springIn(frame, fps, 10);
  /* 三枚空槽浮出 */
  const slotIn = progress(frame, 18, 14, CURVES.cineEaseOut);
  /* LAY-13 旧 PM2 退（26–38，scale 0.92）／容器框进（30–42，overlap 4f） */
  const pm2Out = progress(frame, 26, 12, CURVES.cineEaseIn);
  const frameIn = progress(frame, 30, 12, CURVES.cineEaseOut);

  return (
    <ShotShell act="ACT 01 · 起点">
      <AbsoluteFill>
        {/* 承接态：s08 的 2×2 四卡压成横带（退成上沿底纹） */}
        <div
          style={{
            position: 'absolute',
            left: CARD.x,
            top: CARD.y,
            width: CARD.w * 2 + CARD.gap,
            height: CARD.h * 2 + CARD.gap,
            transform: `translateY(${-392 * flat}px) scaleY(${1 - 0.94 * flat})`,
            transformOrigin: 'center center',
            opacity: 1 - flat,
            filter: `brightness(${1 + 0.06 * (1 - progress(frame, 0, 12, CURVES.cineEaseOut))})`,
          }}
        >
          {STACK.map((label, i) => (
            <div
              key={label}
              style={{
                position: 'absolute',
                left: (i % 2) * (CARD.w + CARD.gap),
                top: Math.floor(i / 2) * (CARD.h + CARD.gap),
                width: CARD.w,
                height: CARD.h,
                boxSizing: 'border-box',
                border: `1px solid ${FILM_COLORS.hairline}`,
                backgroundColor: FILM_COLORS.card,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <DataLabel size={34} color={FILM_COLORS.inkSoft}>
                {label}
              </DataLabel>
            </div>
          ))}
        </div>

        {/* 压扁后的横带（尾帧交接态：四卡阵退成上沿一条 band） */}
        <div
          style={{
            position: 'absolute',
            left: CARD.x,
            top: BAND_TOP,
            width: CARD.w * 2 + CARD.gap,
            height: BAND_H,
            boxSizing: 'border-box',
            border: `1px solid ${FILM_COLORS.hairline}`,
            backgroundColor: FILM_COLORS.paperDeep,
            opacity: 0.5 * progress(frame, 8, 12, CURVES.cineEaseOut),
          }}
        />

        {/* 2021 刻度节点（节点右侧接三枚空槽） */}
        <div
          style={{
            position: 'absolute',
            left: NODE_POS.x - 5,
            top: NODE_POS.y - 5,
            width: 10,
            height: 10,
            borderRadius: '50%',
            backgroundColor: FILM_COLORS.accent,
            ...nodeIn,
          }}
        />
        <div style={{ position: 'absolute', left: NODE_POS.x - 40, top: NODE_POS.y + 22, width: 80, ...nodeIn }}>
          <Meta size={20} style={{ textAlign: 'center' }} color={FILM_COLORS.inkSoft}>
            {YEAR_2021}
          </Meta>
        </div>
        <div
          style={{
            position: 'absolute',
            left: NODE_POS.x + 10,
            top: NODE_POS.y - 0.5,
            width: (SLOT.xs[0] - NODE_POS.x - 10) * slotIn,
            height: 1,
            backgroundColor: FILM_COLORS.hairline,
          }}
        />

        {/* 三枚空槽（第一槽将填入 DOCKER，另两槽留白） */}
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
              border: `1px dashed ${FILM_COLORS.hairline}`,
              opacity: slotIn,
            }}
          />
        ))}

        {/* LAY-13：旧 PM2 三方块进程图（槽 1）→ 容器框同位替换 */}
        <div
          style={{
            position: 'absolute',
            left: SLOT.xs[0],
            top: SLOT.y,
            width: SLOT.w,
            height: SLOT.h,
            opacity: progress(frame, 16, 8, CURVES.cineEaseOut) * (1 - pm2Out),
            transform: `scale(${1 - 0.08 * pm2Out})`,
            transformOrigin: 'center center',
          }}
        >
          {[0, 1, 2].map((k) => (
            <div
              key={`pm2-${k}`}
              style={{
                position: 'absolute',
                left: 86 + k * 76,
                top: 70,
                width: 56,
                height: 56,
                boxSizing: 'border-box',
                border: `1px solid ${FILM_COLORS.hairline}`,
                backgroundColor: FILM_COLORS.paperDeep,
              }}
            />
          ))}
          <div style={{ position: 'absolute', left: 0, top: 148, width: SLOT.w }}>
            <Meta size={16} style={{ textAlign: 'center' }}>
              PM2
            </Meta>
          </div>
        </div>
        {/* 容器框（替换 PM2 的容器化语义） */}
        <div
          style={{
            position: 'absolute',
            left: SLOT.xs[0] + 18,
            top: SLOT.y + 18,
            width: SLOT.w - 36,
            height: SLOT.h - 36,
            boxSizing: 'border-box',
            border: `1px solid ${FILM_COLORS.inkSoft}`,
            opacity: frameIn * 0.55 * (1 - progress(frame, 76, 16, CURVES.cineEaseOut)),
          }}
        />

        {/* INK-04 DOCKER 朱砂藏印（落定帧 60） */}
        <div style={{ position: 'absolute', left: SLOT.xs[0] + (SLOT.w - 48) / 2, top: SLOT.y + (SLOT.h - 48) / 2 }}>
          <SealStamp text="DOCKER" size={48} start={44} />
        </div>

        {/* 动能字幕 */}
        <div style={{ position: 'absolute', left: 200, top: 862, width: 1400 }}>
          <KineticLine text="2021 年，工具换代：" start={50} framesPerChar={2} size={46} />
        </div>
      </AbsoluteFill>
    </ShotShell>
  );
};

export default S09;