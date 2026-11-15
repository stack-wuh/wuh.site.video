import type { FC } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { ShotShell } from '../components/ShotShell';
import { Meta } from '../components/Type';
import { EASE, FILM_COLORS, FONTS, GRID, progress } from '../motion-tokens';

/** 门形框三段几何：s25 交出的 06-14 节点位置 → 画面中央 → 放大破画幅 */
const G0 = { x: 1180, y: 300, w: 620, h: 420 } as const;
const GM = { x: 650, y: 330, w: 620, h: 420 } as const;
const GF = { x: -520, y: -500, w: 2960, h: 2080 } as const;

/** 门内：下一幕（四幕）第一枚卡片的上沿 —— s32 从这段卡边长成长条与文章墙 */
const NEXT_CARD = { x: 700, y: 150, w: 520, h: 60 } as const;

const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

/**
 * s31 · 穿门（100f，3200–3300）
 * LAY-08 06-14 门形框沿时间轴移回画面中央（26f）→ LAY-09 门框放大破画幅（26–80f，穿门），
 * 门内露出四幕纸色与下一幕第一枚卡片上沿；CAM-02 沿时间轴右推（机位只跟 2%）；落地 3280。
 * 尾帧：门框破画幅、门内全屏纸色 + 上方一截卡片边（交 s32 长出文章墙）。
 */
const S31: FC = () => {
  const frame = useCurrentFrame();
  const slide = progress(frame, 0, 26, EASE.inOut);
  const thru = progress(frame, 26, 54, EASE.inOut);

  // 先回中，再穿门：两段串联（px 连续）
  const mid = {
    x: lerp(G0.x, GM.x, slide),
    y: lerp(G0.y, GM.y, slide),
    w: lerp(G0.w, GM.w, slide),
    h: lerp(G0.h, GM.h, slide),
  };
  const gate = {
    x: lerp(mid.x, GF.x, thru),
    y: lerp(mid.y, GF.y, thru),
    w: lerp(mid.w, GF.w, thru),
    h: lerp(mid.h, GF.h, thru),
  };

  // 尾帧（80–100）：门内纸色定住，卡边基座 hairline 拉出；CAM-02 只跟 2%
  const push = 1 + 0.02 * progress(frame, 60, 40, EASE.inOut);
  const baseRule = progress(frame, 84, 12, EASE.out);
  // 日期牌随门框回中淡出（0–20）
  const dateOut = 1 - progress(frame, 0, 18, EASE.out);

  return (
    <ShotShell act="ACT 03 · 重启">
      <AbsoluteFill>
        {/* 时间轴 rail（镜头右推 = rail 左移 ≤8% 幅） */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 906,
            width: GRID.W,
            transform: `translateX(${60 - progress(frame, 0, 78, EASE.inOut) * 120}px)`,
          }}
        >
          <div style={{ position: 'absolute', left: -200, top: 0, width: 2320, height: 1, backgroundColor: FILM_COLORS.hairline }} />
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: 140 + i * 240,
                top: -6,
                width: 1,
                height: 12,
                backgroundColor: FILM_COLORS.hairline,
              }}
            />
          ))}
          {/* 06-14 节点：朱红菱形 + 日期 */}
          <div
            style={{
              position: 'absolute',
              left: 980,
              top: -4,
              width: 8,
              height: 8,
              backgroundColor: FILM_COLORS.vermillion,
              transform: 'rotate(45deg)',
              opacity: 0.9,
            }}
          />
          <div style={{ position: 'absolute', left: 1002, top: -34, opacity: 0.85 }}>
            <Meta size={13}>2026-06-14</Meta>
          </div>
        </div>

        {/* 门框（LAY-08 → LAY-09）：border 即门框；内部为下一幕世界（固定于画幅，靠 clip 揭开） */}
        <div
          style={{
            position: 'absolute',
            left: gate.x,
            top: gate.y,
            width: gate.w,
            height: gate.h,
            boxSizing: 'border-box',
            border: `1.5px solid ${FILM_COLORS.vermillion}`,
            overflow: 'hidden',
          }}
        >
          <div style={{ position: 'absolute', left: -gate.x, top: -gate.y, width: GRID.W, height: GRID.H }}>
            <div style={{ position: 'absolute', inset: 0, backgroundColor: FILM_COLORS.paper }} />
            {/* 门内（上线日）比纸面亮：穿过门后即熄灭 */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: FILM_COLORS.card,
                opacity: 0.55 * (1 - thru),
              }}
            />
            {/* 四幕第一枚卡片的上沿：s32 从这条边展开成长条 → 文章墙 */}
            <div
              style={{
                position: 'absolute',
                left: NEXT_CARD.x,
                top: NEXT_CARD.y,
                width: NEXT_CARD.w,
                height: NEXT_CARD.h,
                backgroundColor: FILM_COLORS.card,
                border: `1px solid ${FILM_COLORS.hairline}`,
                boxSizing: 'border-box',
                transform: `scale(${push})`,
                transformOrigin: 'center center',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: NEXT_CARD.x,
                top: NEXT_CARD.y + NEXT_CARD.h + 14,
                width: NEXT_CARD.w * baseRule,
                height: 1,
                backgroundColor: FILM_COLORS.hairline,
              }}
            />
          </div>
        </div>

        {/* 门框的 06-14 日期牌（跟随门框回中，0–18f 淡出；不随穿门放大） */}
        <div style={{ position: 'absolute', left: gate.x + gate.w / 2 - 96, top: gate.y + gate.h + 20, opacity: dateOut }}>
          <div
            style={{
              fontFamily: FONTS.mono,
              fontSize: 15,
              letterSpacing: '0.16em',
              color: FILM_COLORS.muted,
            }}
          >
            2026-06-14 · LAUNCH NODE
          </div>
        </div>
      </AbsoluteFill>
    </ShotShell>
  );
};

export default S31;