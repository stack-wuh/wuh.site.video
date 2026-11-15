import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { KineticLine } from '../components/KineticLine';
import { ShotShell } from '../components/ShotShell';
import { DataLabel, Meta } from '../components/Type';
import { QUOTES } from '../data';
import { CURVES, FILM_COLORS, FONTS, GRID, draw, progress, springP } from '../motion-tokens';

/**
 * s55 · 人卡（60f，5500–5560）
 * 承接 s54：最近日志时间线收成一张人卡（LAY-01，时间线向卡心收拢 0–14f）；
 * 卡面：左 mono「吴尒红」+ 右两行 `stack-wuh` / `深圳 · a boy just ~`；
 * 卡右上站点字标「wuh.site · 朝朝如念」；卡底 mono 页脚「2019 → 2026 · 7 年」。
 * 主落定 40f；字幕 KineticLine。尾帧：人卡定格（交 s56 右移退出）。
 */

const MOTTO = QUOTES[6].text;
const SOURCES = ['GITHUB', '豆瓣', '微信读书'] as const;
const NODES = [
  { date: '2026-11-04', title: '最近日志聚合上线', tag: '#569' as string | null, y: 430 },
  { date: '2026-11-08', title: '最近在读《中国古代文化常识》', tag: null as string | null, y: 690 },
] as const;

const CARD = { x: 500, y: 310, w: 920, h: 430 };

const S55: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  /** 时间线收拢（LAY-01） */
  const pull = progress(frame, 0, 14, CURVES.cineEaseInOut);
  const land = springP(frame, fps, 12);
  const cardIn = progress(frame, 10, 12, CURVES.cineEaseOut);
  const nameP = interpolate(frame, [16, 28], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: CURVES.cineEaseOut,
  });
  const linesP = interpolate(frame, [22, 34], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: CURVES.cineEaseOut,
  });
  const markP = interpolate(frame, [26, 38], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: CURVES.cineEaseOut,
  });
  const footP = interpolate(frame, [28, 40], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: CURVES.cineEaseOut,
  });

  return (
    <ShotShell act="ACT 06 · 签名">
      <AbsoluteFill>
        {/* 页眉（承接 s54 尾帧） */}
        <div style={{ position: 'absolute', left: GRID.margin, top: 100, opacity: 1 - pull }}>
          <div style={{ fontFamily: FONTS.serif, fontSize: 32, lineHeight: 1.45, color: FILM_COLORS.ink }}>{MOTTO}</div>
        </div>
        <div
          style={{
            position: 'absolute',
            left: GRID.margin,
            top: 158,
            width: GRID.content,
            height: 1,
            backgroundColor: FILM_COLORS.hairline,
            opacity: 1 - pull,
          }}
        />

        {/* 时间线向卡心收拢（0–14f） */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 1 - progress(frame, 0, 12, CURVES.cineEaseIn),
            transform: `scale(${1 - 0.36 * pull})`,
            transformOrigin: `${CARD.x + CARD.w / 2}px ${CARD.y + CARD.h / 2}px`,
          }}
        >
          {SOURCES.map((label, i) => (
            <div
              key={label}
              style={{
                position: 'absolute',
                left: 340,
                top: 298 + i * 230,
                width: 300,
                height: 64,
                boxSizing: 'border-box',
                backgroundColor: FILM_COLORS.card,
                border: `1px solid ${FILM_COLORS.hairline}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <DataLabel size={19}>{label}</DataLabel>
            </div>
          ))}
          <svg width={2} height={570} style={{ position: 'absolute', left: 939, top: 268, overflow: 'visible' }}>
            <line
              x1={1}
              y1={0}
              x2={1}
              y2={570}
              stroke={FILM_COLORS.hairline}
              strokeWidth={1}
              {...draw(1)}
            />
          </svg>
          {NODES.map((n) => (
            <div key={n.date}>
              <div
                style={{
                  position: 'absolute',
                  left: 934,
                  top: n.y - 6,
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: FILM_COLORS.vermillion,
                  boxShadow: `0 0 0 5px ${FILM_COLORS.paper}`,
                }}
              />
              <div style={{ position: 'absolute', left: 982, top: n.y - 52 }}>
                <Meta size={19} color={FILM_COLORS.muted}>
                  {n.date}
                </Meta>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 18, marginTop: 6 }}>
                  <div style={{ fontFamily: FONTS.serif, fontSize: 34, lineHeight: 1.3, color: FILM_COLORS.ink }}>
                    {n.title}
                  </div>
                  {n.tag ? (
                    <div
                      style={{
                        fontFamily: FONTS.mono,
                        fontSize: 17,
                        letterSpacing: '0.14em',
                        color: FILM_COLORS.muted,
                        border: `1px solid ${FILM_COLORS.hairline}`,
                        padding: '3px 9px',
                      }}
                    >
                      {n.tag}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 人卡 */}
        <div
          style={{
            position: 'absolute',
            left: CARD.x,
            top: CARD.y,
            width: CARD.w,
            height: CARD.h,
            boxSizing: 'border-box',
            backgroundColor: FILM_COLORS.card,
            border: `1px solid ${FILM_COLORS.hairline}`,
            opacity: cardIn,
            transform: `scale(${0.965 + 0.035 * land})`,
            transformOrigin: 'center',
          }}
        >
          {/* 站点字标 */}
          <div style={{ position: 'absolute', right: 48, top: 40, opacity: markP }}>
            <Meta size={14}>wuh.site · 朝朝如念</Meta>
          </div>

          {/* 左：mono 大名 */}
          <div style={{ position: 'absolute', left: 64, top: 96, opacity: nameP }}>
            <DataLabel size={12}>AUTHOR</DataLabel>
            <div
              style={{
                marginTop: 10,
                fontFamily: FONTS.mono,
                fontSize: 64,
                lineHeight: 1.2,
                letterSpacing: '0.04em',
                color: FILM_COLORS.ink,
              }}
            >
              吴尒红
            </div>
          </div>

          {/* 中缝 */}
          <div
            style={{
              position: 'absolute',
              left: 290,
              top: 100,
              width: 1,
              height: 240,
              backgroundColor: FILM_COLORS.hairline,
              opacity: linesP,
            }}
          />

          {/* 右：两行 */}
          <div style={{ position: 'absolute', left: 340, top: 128, opacity: linesP }}>
            <div
              style={{
                fontFamily: FONTS.mono,
                fontSize: 34,
                lineHeight: 1.2,
                letterSpacing: '0.02em',
                color: FILM_COLORS.ink,
              }}
            >
              stack-wuh
            </div>
            <div
              style={{
                marginTop: 18,
                fontFamily: FONTS.mono,
                fontSize: 26,
                lineHeight: 1.35,
                color: FILM_COLORS.inkSoft,
              }}
            >
              深圳 · a boy just ~
            </div>
          </div>

          {/* 卡底页脚 */}
          <div
            style={{
              position: 'absolute',
              left: 64,
              right: 64,
              top: 340,
              height: 1,
              backgroundColor: FILM_COLORS.hairline,
              opacity: footP,
            }}
          />
          <div style={{ position: 'absolute', left: 64, top: 360, opacity: footP }}>
            <Meta size={18}>2019 → 2026 · 7 年</Meta>
          </div>
        </div>

        {/* 字幕 */}
        <div style={{ position: 'absolute', left: GRID.margin, bottom: 176 }}>
          <KineticLine text="wuh.site · 朝朝如念" start={12} framesPerChar={2} size={44} />
        </div>
      </AbsoluteFill>
    </ShotShell>
  );
};

export default S55;