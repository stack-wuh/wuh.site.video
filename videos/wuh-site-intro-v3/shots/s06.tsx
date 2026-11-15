import type { CSSProperties, FC } from 'react';
import {
  AbsoluteFill,
  interpolate,
  interpolateColors,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { KineticLine } from '../components/KineticLine';
import { ShotShell } from '../components/ShotShell';
import { Kicker, Meta } from '../components/Type';
import { ARTICLES, SERIES } from '../data';
import { CURVES, FILM_COLORS, FONTS, SP, T, clamp01, progress, springP } from '../motion-tokens';

/** 年份刻度（引自 data.ts） */
const YEARS = SERIES.yearly_writing_2019_2026.map((y) => y.year);
/** 第 1 篇（按创建日倒序排最后一条）：#1「2018-08-05 【开篇】」/ 2019-07-26 */
const FIRST = ARTICLES[ARTICLES.length - 1];

const RAIL_Y = 300;
const DOT_X = 200;
const NEXT_X = 430;

/** 文首块矩形 */
const BLOCK = { x: 200, y: 348, w: 1240, h: 210 } as const;

const cardStyle: CSSProperties = {
  position: 'absolute',
  left: BLOCK.x,
  top: BLOCK.y,
  width: BLOCK.w,
  height: BLOCK.h,
  boxSizing: 'border-box',
  backgroundColor: FILM_COLORS.card,
  border: `1px solid ${FILM_COLORS.hairline}`,
};

/**
 * s06 · 起点 2019（110f，600–710）
 * FX-01 镜内首 3f 纸白满屏（card → paper 底色切换，不叠 overlay）→ INK-01 rail 自画外进入
 * → EN-04 墨点落 2019 刻度（4f 落定 + INK-06 纸晕 10f）→ 墨点展开成文首块 #1「2018-08-05 【开篇】」
 * + 日期 2019-07-26 + 朱红章节眉线。CAM-02 微推 2%。
 * 主落定 20（墨点落 2019，全片 620 · 拍 31）。
 * 尾帧：2019 节点亮、页首块在场、rail 停在 2020 刻度前 → 交 s07 倒滚 30。
 */
const S06: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  /* FX-01 白闪：0–3f 纸白满屏 → 3–15f 释放到纸面（底色切换，非白色 overlay） */
  const bg = interpolateColors(frame, [0, 3, 15], [FILM_COLORS.card, FILM_COLORS.card, FILM_COLORS.paper]);
  /* INK-01 rail 自画外进入（0–16） */
  const railIn = progress(frame, 0, 16, CURVES.cineEaseOut);
  /* CAM-02 微推 2%（20–90） */
  const push = interpolate(frame, [20, 90], [1, 1.02], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: CURVES.cineEaseInOut,
  });
  /* EN-04 墨点落定（spring 落体，落定 20；4f squash） */
  const dropS = clamp01(springP(frame, fps, 6, SP.dotDrop));
  const squash = progress(frame, 16, 4, CURVES.cineEaseOut);
  /* INK-06 纸晕（双层错 4f） */
  const bloom1 = progress(frame, 16, 10, CURVES.cineEaseOut);
  const bloom2 = progress(frame, 20, 10, CURVES.cineEaseOut);
  /* 墨点展开成文首块（22–40） */
  const unfold = progress(frame, 22, 20, CURVES.cineEaseInOut);

  return (
    <ShotShell act="ACT 01 · 起点">
      <AbsoluteFill>
        <div style={{ position: 'absolute', inset: 0, backgroundColor: bg }} />

        <div style={{ position: 'absolute', inset: 0, transform: `scale(${push})`, transformOrigin: 'center center' }}>
          {/* INK-01 时间轴左端 rail（自画外进入，止于 2020 刻度前） */}
          <div
            style={{
              position: 'absolute',
              left: -160,
              top: RAIL_Y - 0.75,
              width: 570,
              height: 1.5,
              backgroundColor: FILM_COLORS.ink,
              transform: `translateX(${-420 * (1 - railIn)}px)`,
            }}
          />
          {/* 2019 刻度 */}
          <div
            style={{
              position: 'absolute',
              left: DOT_X - 0.5,
              top: RAIL_Y - 6,
              width: 1,
              height: 12,
              backgroundColor: FILM_COLORS.ink,
              opacity: railIn * 0.6,
            }}
          />
          <div style={{ position: 'absolute', left: DOT_X - 60, top: RAIL_Y + 18, width: 120, opacity: railIn }}>
            <Meta size={18} style={{ textAlign: 'center' }}>
              {YEARS[0]}
            </Meta>
          </div>
          {/* 2020 刻度（rail 停在它之前，留白给下一镜） */}
          <div
            style={{
              position: 'absolute',
              left: NEXT_X - 0.5,
              top: RAIL_Y - 6,
              width: 1,
              height: 12,
              backgroundColor: FILM_COLORS.ink,
              opacity: railIn * 0.22,
            }}
          />
          <div style={{ position: 'absolute', left: NEXT_X - 60, top: RAIL_Y + 18, width: 120, opacity: railIn * 0.4 }}>
            <Meta size={18} style={{ textAlign: 'center' }}>
              {YEARS[1]}
            </Meta>
          </div>

          {/* 墨点：落定 4f squash + 纸晕 */}
          <div
            style={{
              position: 'absolute',
              left: DOT_X - 9,
              top: RAIL_Y - 9 + (1 - dropS) * -28,
              width: 18,
              height: 18,
              borderRadius: '50%',
              border: `1px solid ${FILM_COLORS.accent}`,
              opacity: (1 - bloom1) * 0.4,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: DOT_X - 26,
              top: RAIL_Y - 26 + (1 - dropS) * -28,
              width: 52,
              height: 52,
              borderRadius: '50%',
              border: `1px solid ${FILM_COLORS.accent}`,
              opacity: (1 - bloom2) * 0.22,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: DOT_X - 6,
              top: RAIL_Y - 6 + (1 - dropS) * -28,
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: FILM_COLORS.ink,
              transform: `scale(${1 + 0.04 * (1 - squash)}, ${0.92 + 0.08 * squash})`,
            }}
          />

          {/* 文首块：#1 标题 + 日期（墨点展开） */}
          <div
            style={{
              ...cardStyle,
              opacity: unfold,
              transform: `scale(${0.94 + 0.06 * unfold})`,
              transformOrigin: 'top left',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: BLOCK.x,
              top: BLOCK.y,
              width: 2,
              height: BLOCK.h * unfold,
              backgroundColor: FILM_COLORS.vermillion,
            }}
          />
          <div style={{ position: 'absolute', left: BLOCK.x + 26, top: BLOCK.y + 24, opacity: unfold }}>
            <Kicker>第 01 节 · 起点</Kicker>
          </div>
          <div style={{ position: 'absolute', left: BLOCK.x + BLOCK.w - 86, top: BLOCK.y + 22, opacity: unfold }}>
            <Meta size={20} color={FILM_COLORS.vermillion}>{`#${FIRST.number}`}</Meta>
          </div>
          <div
            style={{
              position: 'absolute',
              left: BLOCK.x + 26,
              top: BLOCK.y + 56,
              fontFamily: FONTS.serif,
              fontSize: T.data,
              fontWeight: 700,
              lineHeight: 1.3,
              color: FILM_COLORS.ink,
              opacity: unfold,
            }}
          >
            {FIRST.title}
          </div>
          <div
            style={{
              position: 'absolute',
              left: BLOCK.x + 26,
              top: BLOCK.y + 116,
              width: 240 * unfold,
              height: 1,
              backgroundColor: FILM_COLORS.hairline,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: BLOCK.x + 26,
              top: BLOCK.y + 134,
              fontFamily: FONTS.mono,
              fontSize: 22,
              letterSpacing: '0.12em',
              color: FILM_COLORS.inkSoft,
              opacity: unfold,
            }}
          >
            {FIRST.date}
          </div>

          {/* 动能字幕 */}
          <div style={{ position: 'absolute', left: 200, top: 862, width: 1400 }}>
            <KineticLine
              text="2019 年 7 月 26 日，博客有了第一篇。"
              start={24}
              framesPerChar={2}
              size={46}
            />
          </div>
        </div>
      </AbsoluteFill>
    </ShotShell>
  );
};

export default S06;