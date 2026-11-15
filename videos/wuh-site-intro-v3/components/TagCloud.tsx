import type { CSSProperties, FC } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { FILM_COLORS, FONTS, GRID, SP, clamp01, progress, rnd, springP } from '../motion-tokens';

export type TagItem = { label: string; count: number };

export type TagCloudProps = {
  tags: readonly TagItem[];
  /** 落定起始帧（默认 0） */
  start?: number;
  /** 落定窗口 f（默认 tags.length×2 → stagger 2f） */
  dur?: number;
  width?: number;
  height?: number;
  style?: CSSProperties;
};

const MAX_SIZE = 72;
const MIN_SIZE = 22;
const PAD_X = 18;
const PAD_Y = 10;

/** 单字符宽度（em；确定性估算，用于防重叠布点） */
const charEm = (ch: string): number => {
  const code = ch.codePointAt(0) ?? 0;
  if (ch === ' ') return 0.3;
  if (code >= 0x2e80) return 1;
  if ('il.,:;!|\'’'.includes(ch)) return 0.32;
  if (ch >= 'A' && ch <= 'Z') return 0.7;
  if (ch >= '0' && ch <= '9') return 0.62;
  return 0.58;
};

const textEm = (text: string): number => {
  let w = 0;
  for (const ch of Array.from(text)) w += charEm(ch);
  return w;
};

/**
 * MO-01 TAG-CLOUD：标签云落定（真实标签 + 数量）。
 * 字号 = clamp(22 + count·3, 22, 72)；位置由 seed 极坐标中心向外生长 + AABB 防重叠（确定性）；
 * springPop stagger 2f（dur 可覆盖）；`#` 前缀朱红，数量 mono muted 上标。
 */
export const TagCloud: FC<TagCloudProps> = ({
  tags,
  start = 0,
  dur,
  width = GRID.content,
  height = 560,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const n = tags.length;
  const settle = dur ?? Math.max(10, n * 2);
  const stagger = n > 0 ? settle / n : 2;

  /* 按数量降序布点：最大的先落中心，其余向外找不重叠位 */
  const order = tags
    .map((t, i) => ({ i, count: t.count }))
    .sort((a, b) => b.count - a.count || a.i - b.i)
    .map((o) => o.i);

  const cx = width / 2;
  const cy = height / 2;
  const placed: Array<{ idx: number; x: number; y: number; w: number; h: number; fs: number }> = [];

  for (const idx of order) {
    const tag = tags[idx];
    const fs = Math.min(MAX_SIZE, Math.max(MIN_SIZE, 22 + tag.count * 3));
    const digits = String(tag.count).length;
    const w = (0.66 + textEm(tag.label) + 0.3 + 0.21 * digits) * fs + PAD_X * 2;
    const h = fs * 1.32 + PAD_Y;
    let x = cx;
    let y = cy;
    for (let k = 0; k < 90; k++) {
      const t = k / 89;
      const angle = rnd('tag-cloud-angle', idx * 97 + k) * Math.PI * 2;
      const radius = Math.pow(t, 0.62);
      const px = cx + Math.cos(angle) * radius * Math.max(0, width / 2 - w / 2 - 12);
      const py = cy + Math.sin(angle) * radius * Math.max(0, height / 2 - h / 2 - 8);
      x = px;
      y = py;
      const hit = placed.some(
        (p) => Math.abs(p.x - px) < (p.w + w) / 2 && Math.abs(p.y - py) < (p.h + h) / 2,
      );
      if (!hit) break;
    }
    placed.push({ idx, x, y, w, h, fs });
  }

  return (
    <div style={{ position: 'relative', width, height, ...style }}>
      {placed.map((p, pos) => {
        const tag = tags[p.idx];
        const delay = start + pos * stagger;
        const s = springP(frame, fps, delay, SP.springPop);
        const opacity = clamp01(progress(frame, delay, 4));
        const color = pos < 3 ? FILM_COLORS.ink : FILM_COLORS.inkSoft;
        return (
          <div
            key={`tag-${p.idx}`}
            style={{
              position: 'absolute',
              left: p.x - p.w / 2,
              top: p.y - p.h / 2,
              width: p.w,
              height: p.h,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              whiteSpace: 'nowrap',
              opacity,
              transform: `scale(${0.86 + 0.14 * s})`,
              transformOrigin: 'center center',
            }}
          >
            <span
              style={{
                fontFamily: FONTS.sans,
                fontSize: p.fs,
                lineHeight: 1.1,
                color,
                letterSpacing: '-0.01em',
              }}
            >
              <span style={{ color: FILM_COLORS.vermillion, fontWeight: 700 }}>#</span>
              {tag.label}
            </span>
            <span
              style={{
                fontFamily: FONTS.mono,
                fontSize: Math.round(p.fs * 0.34),
                color: FILM_COLORS.muted,
                marginLeft: Math.round(p.fs * 0.16),
                letterSpacing: '0.06em',
                alignSelf: 'flex-start',
                marginTop: Math.round(p.fs * 0.06),
              }}
            >
              {tag.count}
            </span>
          </div>
        );
      })}
    </div>
  );
};