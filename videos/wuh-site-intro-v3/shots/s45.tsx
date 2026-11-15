import type { FC } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { CodePanel } from '../components/CodePanel';
import { ShotShell } from '../components/ShotShell';
import { DataLabel, Kicker, Meta } from '../components/Type';
import { SERIES, TAGS } from '../data';
import { CURVES, FILM_COLORS, GRID, progress, roll } from '../motion-tokens';

/**
 * s45 · MongoDB 窗口（90f，4610–4700 ｜ 主落定 70f）
 * LAY-11：MongoDB 节点（s44 第 3 个节点）放大成窗口；TX-02 行级打出 JSON（8.5f/行）；
 * FL-05：三条同构文档叠放（后两条错位压入）；右上 mono 13 CHECKS（webhook 签名校验项）。
 * 尾帧：JSON 落定、三条叠放、13 CHECKS 在场 → s46 窗口收成 CI 流水线。
 */

const DOC_ISSUE = SERIES.top7_views[0].number; // 165
const DOC_LABEL = TAGS[0].label; // daily
/** webhook 签名校验项数（AUDIT_PRS #582「webhook 签名加固 · 13 项」/ storyboard s45） */
const CHECKS = 13;

const JSON_LINES = [
  { text: '{' },
  { text: `  "issue": ${DOC_ISSUE},` },
  { text: '  "state": "open",' },
  { text: `  "labels": ["${DOC_LABEL}"]` },
  { text: '}' },
] as const;

/* LAY-11 起止矩形：s44 的 Mongo 节点（第 3 个，160px）→ 文档窗 */
const NODE_RECT = { left: GRID.margin + 2 * ((GRID.content - 160) / 4), top: 460, w: 160, h: 160 };
const WIN_RECT = { left: GRID.margin, top: 270, w: 1120, h: 440 };

const S45: FC = () => {
  const frame = useCurrentFrame();

  /* LAY-11 节点 → 窗口（20f 宽高插值，空间连续） */
  const zoom = progress(frame, 0, 20, CURVES.cineEaseInOut);
  const rect = {
    left: NODE_RECT.left + (WIN_RECT.left - NODE_RECT.left) * zoom,
    top: NODE_RECT.top + (WIN_RECT.top - NODE_RECT.top) * zoom,
    w: NODE_RECT.w + (WIN_RECT.w - NODE_RECT.w) * zoom,
    h: NODE_RECT.h + (WIN_RECT.h - NODE_RECT.h) * zoom,
  };

  /* NUM-01：13 项校验 30→70f 滚动，主落定 70 */
  const checks = Math.round(roll(frame, 30, 38, 0, CHECKS));

  /* CAM-02 推进（≤3%） */
  const push = 1 + 0.025 * progress(frame, 40, 40, CURVES.cineEaseInOut);

  return (
    <ShotShell act="ACT 05 · 方法">
      <AbsoluteFill>
        <div style={{ position: 'absolute', left: GRID.margin, top: 118 }}>
          <Kicker>第 05 节 · 文档</Kicker>
        </div>
        <div style={{ position: 'absolute', right: GRID.margin, top: 118, textAlign: 'right' }}>
          <DataLabel size={18} style={{ fontVariantNumeric: 'tabular-nums' }}>{`${checks} CHECKS`}</DataLabel>
          <Meta size={12} style={{ marginTop: 8 }}>
            WEBHOOK 签名校验项
          </Meta>
        </div>

        <div style={{ position: 'absolute', inset: 0, transform: `scale(${push})`, transformOrigin: '44% 52%' }}>
          {/* 放大中的矩形（节点 → 窗口的连续形状）：先承上镜墨块，再退成窗框 */}
          <div
            style={{
              position: 'absolute',
              left: rect.left,
              top: rect.top,
              width: rect.w,
              height: rect.h,
              backgroundColor: FILM_COLORS.ink,
              opacity: 0.9 * (1 - progress(frame, 4, 10)),
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: rect.left,
              top: rect.top,
              width: rect.w,
              height: rect.h,
              boxSizing: 'border-box',
              border: `1.5px solid ${FILM_COLORS.ink}`,
              opacity: 1 - progress(frame, 16, 8),
            }}
          />

          {/* FL-05：后两条同构文档错位压入（behind 前窗） */}
          {[2, 1].map((k) => {
            const at = 40 + (2 - k) * 12;
            const p = progress(frame, at, 12, CURVES.cineEaseOut);
            return (
              <div
                key={`doc-${k}`}
                style={{
                  position: 'absolute',
                  left: WIN_RECT.left + k * 16,
                  top: WIN_RECT.top - k * 16 + (1 - p) * -40,
                  width: WIN_RECT.w,
                  height: WIN_RECT.h,
                  boxSizing: 'border-box',
                  backgroundColor: FILM_COLORS.paperDeep,
                  border: `1px solid ${FILM_COLORS.hairline}`,
                  opacity: 0.55 + 0.35 * p,
                  transform: `scale(${0.96 + 0.04 * p})`,
                  transformOrigin: 'left bottom',
                }}
              >
                <div style={{ position: 'absolute', left: 28, top: 26, width: 220, height: 1, backgroundColor: FILM_COLORS.hairline }} />
                <div style={{ position: 'absolute', left: 28, top: 54, width: 380, height: 1, backgroundColor: FILM_COLORS.hairline }} />
                <div style={{ position: 'absolute', left: 28, top: 82, width: 300, height: 1, backgroundColor: FILM_COLORS.hairline }} />
              </div>
            );
          })}

          {/* 文档窗：JSON 行级打出 */}
          <div style={{ position: 'absolute', left: WIN_RECT.left, top: WIN_RECT.top, opacity: progress(frame, 16, 6) }}>
            <CodePanel
              lines={JSON_LINES}
              start={22}
              framesPerLine={8.5}
              width={WIN_RECT.w}
              height={WIN_RECT.h}
              title="mongo · issues"
              fontSize={26}
            />
          </div>

          {/* 13 项校验：13 枚小方块依次亮起（状态灯，不是数字） */}
          <div style={{ position: 'absolute', left: 1288, top: 270, width: 512 }}>
            <div style={{ height: 1, backgroundColor: FILM_COLORS.hairline }} />
            <div style={{ marginTop: 22, display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {Array.from({ length: CHECKS }, (_, i) => {
                const on = progress(frame, 34 + i * 2.2, 5);
                return (
                  <div
                    key={`ck-${i}`}
                    style={{
                      width: 22,
                      height: 22,
                      boxSizing: 'border-box',
                      border: `1px solid ${on > 0.4 ? FILM_COLORS.vermillion : FILM_COLORS.hairline}`,
                      backgroundColor: on > 0.4 ? FILM_COLORS.ink : 'transparent',
                      opacity: 0.3 + 0.7 * on,
                    }}
                  />
                );
              })}
            </div>
            <div style={{ marginTop: 24 }}>
              <Meta size={12}>SIGNATURE · HMAC · 一一对账</Meta>
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </ShotShell>
  );
};

export default S45;