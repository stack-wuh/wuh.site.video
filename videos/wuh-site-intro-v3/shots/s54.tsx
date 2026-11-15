import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { ShotShell } from '../components/ShotShell';
import { DataLabel, Meta } from '../components/Type';
import { QUOTES } from '../data';
import { CURVES, FILM_COLORS, FONTS, GRID, draw, progress, springP } from '../motion-tokens';

/**
 * s54 · 最近日志（60f，5440–5500）
 * 承接 s53：题记行上移成页眉（LAY-12，0–16f，56px→32px 收到页眉位）；
 * 主动作：「最近日志」跨平台竖轴（CH-03 描画 6–38f）+ 三枚来源标签（GITHUB / 豆瓣 / 微信读书）
 * + 两个日期节点自下而上依次点亮（EN-05：2026-11-08 → 2026-11-04）。主落定 40f。
 * 无字幕（数据镜）。尾帧：竖轴 + 两节点 + 三来源标签（交 s55 收成人卡）。
 */

const MOTTO = QUOTES[6].text;

const AXIS_X = 940;
const AXIS_TOP = 268;
const AXIS_BOTTOM = 838;

const SOURCES = ['GITHUB', '豆瓣', '微信读书'] as const;

const NODES = [
  {
    date: '2026-11-04',
    title: '最近日志聚合上线',
    tag: '#569',
    y: 430,
    delay: 24,
  },
  {
    date: '2026-11-08',
    title: '最近在读《中国古代文化常识》',
    tag: null,
    y: 690,
    delay: 12,
  },
] as const;

const S54: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  /** 题记 → 页眉（LAY-12） */
  const head = progress(frame, 0, 16, CURVES.cineEaseInOut);
  const mottoSize = 56 - 24 * head;
  const mottoLeft = 344 - 224 * head;
  const mottoTop = 476 - 376 * head;
  const cursorOpacity = 1 - progress(frame, 0, 6);
  const ruleTop = 579 - (579 - 158) * head;
  const ruleWidth = 1232 + (1680 - 1232) * head;

  /** 竖轴描画（CH-03） */
  const axis = draw(progress(frame, 6, 32, CURVES.cineEaseInOut));
  /** 沿时间线自下而上的轻微机位抬升（CAM-01） */
  const cam = 14 * (1 - progress(frame, 0, 40, CURVES.cineEaseInOut));

  return (
    <ShotShell act="ACT 06 · 签名">
      <AbsoluteFill>
        {/* 页眉：题记行（承接 s53 尾帧同态） */}
        <div style={{ position: 'absolute', left: mottoLeft, top: mottoTop }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              fontFamily: FONTS.serif,
              fontSize: mottoSize,
              lineHeight: 1.45,
              color: FILM_COLORS.ink,
              whiteSpace: 'pre',
            }}
          >
            <span>{MOTTO}</span>
            <span
              style={{
                display: 'inline-block',
                width: 3,
                height: mottoSize * 0.86,
                marginLeft: 4,
                backgroundColor: FILM_COLORS.vermillion,
                opacity: cursorOpacity,
              }}
            />
          </div>
        </div>
        <div
          style={{
            position: 'absolute',
            left: mottoLeft,
            top: ruleTop,
            width: ruleWidth,
            height: 1,
            backgroundColor: FILM_COLORS.hairline,
          }}
        />
        <div style={{ position: 'absolute', right: GRID.margin, top: 112, textAlign: 'right', opacity: head }}>
          <DataLabel size={18}>RECENT LOGS · 3 SOURCES</DataLabel>
        </div>

        {/* 跨平台日志时间线 */}
        <div style={{ position: 'absolute', inset: 0, transform: `translateY(${cam}px)` }}>
          {SOURCES.map((label, i) => {
            const p = springP(frame, fps, 4 + i * 4);
            const y = 298 + i * 230;
            const c = interpolate(frame, [6 + i * 4, 20 + i * 4], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: CURVES.cineEaseInOut,
            });
            return (
              <div key={label}>
                <div
                  style={{
                    position: 'absolute',
                    left: 340,
                    top: y,
                    width: 300,
                    height: 64,
                    boxSizing: 'border-box',
                    backgroundColor: FILM_COLORS.card,
                    border: `1px solid ${FILM_COLORS.hairline}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: interpolate(frame, [4 + i * 4, 10 + i * 4], [0, 1], {
                      extrapolateLeft: 'clamp',
                      extrapolateRight: 'clamp',
                    }),
                    transform: `translateY(${(1 - p) * 10}px)`,
                  }}
                >
                  <DataLabel size={19}>{label}</DataLabel>
                </div>
                <div
                  style={{
                    position: 'absolute',
                    left: 640,
                    top: y + 31.5,
                    width: 300 * c,
                    height: 1,
                    backgroundColor: FILM_COLORS.hairline,
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    left: AXIS_X - 3,
                    top: y + 28,
                    width: 6,
                    height: 6,
                    backgroundColor: c > 0.94 ? FILM_COLORS.accent : FILM_COLORS.hairline,
                    transform: 'rotate(45deg)',
                  }}
                />
              </div>
            );
          })}

          {/* 竖轴 */}
          <svg
            width={2}
            height={AXIS_BOTTOM - AXIS_TOP}
            style={{ position: 'absolute', left: AXIS_X - 1, top: AXIS_TOP, overflow: 'visible' }}
          >
            <line
              x1={1}
              y1={0}
              x2={1}
              y2={AXIS_BOTTOM - AXIS_TOP}
              stroke={FILM_COLORS.hairline}
              strokeWidth={1}
              {...axis}
            />
          </svg>

          {/* 两个日期节点（自下而上依次点亮） */}
          {NODES.map((n) => {
            const s = springP(frame, fps, n.delay);
            const lamp = interpolate(frame, [n.delay, n.delay + 8], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: CURVES.cineEaseOut,
            });
            return (
              <div key={n.date}>
                <div
                  style={{
                    position: 'absolute',
                    left: AXIS_X - 6,
                    top: n.y - 6,
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    backgroundColor: FILM_COLORS.vermillion,
                    opacity: lamp,
                    transform: `scale(${0.6 + 0.4 * s})`,
                    boxShadow: `0 0 0 5px ${FILM_COLORS.paper}`,
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    left: AXIS_X + 42,
                    top: n.y - 52,
                    opacity: lamp,
                    transform: `translateY(${(1 - s) * 8}px)`,
                  }}
                >
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
            );
          })}
        </div>
      </AbsoluteFill>
    </ShotShell>
  );
};

export default S54;