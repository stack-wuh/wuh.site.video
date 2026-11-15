import type { CSSProperties, FC } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { sealStamp } from '../../../brand/motion';
import { FILM_COLORS, FONTS, sealTilt } from '../motion-tokens';

export type SealStampProps = {
  /** 竖排/横排短字（≤6 字竖排两列） */
  text: string;
  /** 边长（默认 48） */
  size?: number;
  /** 落章帧（默认 0） */
  start?: number;
  /** 微旋 ±1.6°（默认 true，seed=text） */
  tilt?: boolean;
  /** label=朱红细框藏印；seal=实心朱红白文 */
  variant?: 'label' | 'seal';
  style?: CSSProperties;
};

const isCjk = (ch: string): boolean => (ch.codePointAt(0) ?? 0) >= 0x2e80;

/**
 * INK-04 SEAL-STAMP：印章/藏印标签（站点同源朱砂藏印语汇）。
 * 落章用品牌 `sealStamp`（18f squash + sealTilt(text) ±1.6°）+ 双框印边（外 1px 48%、内 1px 20%）。
 * ≤6 字竖排两列（首列在右，传统直读），>6 字英文横排（格宽自动，不挤进方块）。
 */
export const SealStamp: FC<SealStampProps> = ({
  text,
  size = 48,
  start = 0,
  tilt = true,
  variant = 'label',
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const chars = Array.from(text);
  const n = chars.length;
  const vertical = n <= 6;
  const angle = tilt ? sealTilt(text) : 0;
  const stamp = sealStamp(frame, start, fps, angle);

  const seal = variant === 'seal';
  const textColor = seal ? FILM_COLORS.paper : FILM_COLORS.vermillion;

  const body: CSSProperties = vertical
    ? {
        width: size,
        height: size,
        display: 'flex',
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'center',
        gap: size * 0.05,
      }
    : {
        width: 'auto',
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: `0 ${size * 0.22}px`,
        whiteSpace: 'nowrap',
      };

  /* 竖排：单字居中；2–4 字每列 2 字，5–6 字每列 3 字（首列在右） */
  const perCol = vertical ? (n <= 1 ? 1 : n <= 4 ? 2 : 3) : 0;
  const columns: string[][] = vertical
    ? n <= 1
      ? [chars]
      : [chars.slice(0, Math.ceil(n / 2)), chars.slice(Math.ceil(n / 2))]
    : [];
  const vFont = Math.max(size * 0.18, Math.min(size * 0.38, (size * 0.78) / (perCol * 1.08)));
  const hFont = size * 0.3;
  const latin = !Array.from(text).some(isCjk);

  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
        backgroundColor: seal ? FILM_COLORS.seal : 'transparent',
        ...style,
        /* 调用方的 transform/opacity 与落章变换叠加（style 常用来定位，不吞掉落章 squash） */
        opacity: (typeof style?.opacity === 'number' ? style.opacity : 1) * (typeof stamp.opacity === 'number' ? stamp.opacity : 1),
        transform: `${style?.transform ?? ''} ${stamp.transform ?? ''}`.trim(),
      }}
    >
      <div style={body}>
        {vertical
          ? columns.map((col, ci) => (
              <div key={`col-${ci}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {col.map((ch, ri) => (
                  <span
                    key={`ch-${ci}-${ri}`}
                    style={{
                      fontFamily: latin ? FONTS.mono : FONTS.serif,
                      fontSize: vFont,
                      lineHeight: 1.08,
                      letterSpacing: '0.02em',
                      color: textColor,
                      display: 'block',
                    }}
                  >
                    {ch}
                  </span>
                ))}
              </div>
            ))
          : (
              <span
                style={{
                  fontFamily: latin ? FONTS.mono : FONTS.serif,
                  fontSize: hFont,
                  letterSpacing: '0.14em',
                  color: textColor,
                  fontWeight: seal ? 700 : 400,
                }}
              >
                {text}
              </span>
            )}
      </div>

      {/* 双框印边：外 1px 48%，内 1px 20%（实心章用纸色内框，白文印边） */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          border: `1px solid ${seal ? FILM_COLORS.paper : FILM_COLORS.vermillion}`,
          opacity: seal ? 0.35 : 0.48,
          boxSizing: 'border-box',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 3,
          border: `1px solid ${seal ? FILM_COLORS.paper : FILM_COLORS.vermillion}`,
          opacity: 0.2,
          boxSizing: 'border-box',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};