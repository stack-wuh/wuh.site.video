import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { SealStamp } from '../components/SealStamp';
import { ShotShell } from '../components/ShotShell';
import { DataLabel, Meta } from '../components/Type';
import { CURVES, FILM_COLORS, FONTS, GRID, SP, progress, springP } from '../motion-tokens';

/**
 * s56 · 末镜（140f，5560–5700）
 * 承接 s55：人卡右移退出（LAY-12 out-right，0–22f）；
 * 主动作：纸面中央朱红方章压印（INK-04 大章档，白文「七年一座站」，6–8f 压 + 纸面凹陷 1px inset）
 * → 片名「七年，一座站」自章右侧升起并置（TX-08，主落定 40f）
 * → 末 20f 几乎不动（FX-08 amp 0.5：章边 0.5px 呼吸一次，120–132f）。页脚 mono 常驻右下。
 * 尾帧：印章 + 片名 + 页脚静止（交片尾同构纸面）。
 */

const CARD = { x: 500, y: 310, w: 920, h: 430 };
const SEAL_TEXT = '七年一座站';
const TITLE = '七年，一座站';
const SEAL_SIZE = 240;
const SEAL_X = 350;
const SEAL_Y = 420;
const TITLE_X = 654;
const TITLE_Y = 460;

const TITLE_CHARS = Array.from(TITLE);

const S56: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  /** 人卡右移退出 */
  const outX = 1500 * progress(frame, 0, 22, CURVES.cineEaseIn);
  const outOpacity = 1 - progress(frame, 0, 20, CURVES.cineEaseIn);

  /** TX-08 片名升起：18f 起（springPop ~21f 收敛），40f 落定（Y +40→0 / scale 0.98→1） */
  const rise = springP(frame, fps, 18, SP.springPop);
  const titleY = (1 - rise) * 40;
  const titleScale = 0.98 + 0.02 * rise;

  /** FX-08 amp 0.5：末 20f 章边 0.5px 呼吸一次（120–132f） */
  const breath = interpolate(frame, [120, 126, 132], [0, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: CURVES.cineEaseInOut,
  });
  const sealScale = 1 + (0.5 / SEAL_SIZE) * breath;

  const foot = progress(frame, 30, 12, CURVES.cineEaseOut);

  return (
    <ShotShell act="ACT 06 · 签名">
      <AbsoluteFill>
        {/* 人卡右移退出（承接 s55 尾帧同态） */}
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
            opacity: outOpacity,
            transform: `translateX(${outX}px)`,
          }}
        >
          <div style={{ position: 'absolute', right: 48, top: 40 }}>
            <Meta size={14}>wuh.site · 朝朝如念</Meta>
          </div>
          <div style={{ position: 'absolute', left: 64, top: 96 }}>
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
          <div style={{ position: 'absolute', left: 290, top: 100, width: 1, height: 240, backgroundColor: FILM_COLORS.hairline }} />
          <div style={{ position: 'absolute', left: 340, top: 128 }}>
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
            <div style={{ marginTop: 18, fontFamily: FONTS.mono, fontSize: 26, lineHeight: 1.35, color: FILM_COLORS.inkSoft }}>
              深圳 · a boy just ~
            </div>
          </div>
          <div style={{ position: 'absolute', left: 64, right: 64, top: 340, height: 1, backgroundColor: FILM_COLORS.hairline }} />
          <div style={{ position: 'absolute', left: 64, top: 360 }}>
            <Meta size={18}>2019 → 2026 · 7 年</Meta>
          </div>
        </div>

        {/* 上一镜的字幕（随人卡一同退场，保证切点同态） */}
        <div style={{ position: 'absolute', left: GRID.margin, bottom: 176, opacity: outOpacity }}>
          <div style={{ fontFamily: FONTS.serif, fontSize: 44, lineHeight: 1.5, color: FILM_COLORS.ink }}>
            wuh.site · 朝朝如念
          </div>
        </div>

        {/* 纸面压印凹陷（1px inset 唇边，落在章外沿） */}
        <div
          style={{
            position: 'absolute',
            left: SEAL_X - 2,
            top: SEAL_Y - 2,
            width: SEAL_SIZE + 4,
            height: SEAL_SIZE + 4,
            boxShadow: `inset 0 1px 2px ${FILM_COLORS.hairline}`,
            pointerEvents: 'none',
          }}
        />

        {/* INK-04 朱红方章（白文，12f 起压 → 20f 落定） */}
        <div
          style={{
            position: 'absolute',
            left: SEAL_X,
            top: SEAL_Y,
            transform: `scale(${sealScale})`,
            transformOrigin: 'center',
          }}
        >
          <SealStamp text={SEAL_TEXT} size={SEAL_SIZE} variant="seal" start={12} tilt={false} />
        </div>

        {/* TX-08 片名：自章右侧升起并置 */}
        <div
          style={{
            position: 'absolute',
            left: TITLE_X,
            top: TITLE_Y,
            transform: `translateY(${titleY}px) scale(${titleScale})`,
            transformOrigin: 'left center',
            fontFamily: FONTS.serif,
            fontWeight: 700,
            fontSize: 160,
            lineHeight: 1,
            letterSpacing: '0.01em',
            color: FILM_COLORS.ink,
            whiteSpace: 'pre',
            fontVariantNumeric: 'lining-nums',
          }}
        >
          {TITLE_CHARS.map((ch, i) => {
            const p = interpolate(frame, [20 + i * 1.2, 30 + i * 1.2], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: CURVES.cineEaseOut,
            });
            /** 大号字版的全角逗号右侧留白过大——收 0.34em 恢复正常字距 */
            const trim = ch === '，' ? { marginRight: '-0.34em' } : undefined;
            return (
              <span key={`${ch}-${i}`} style={{ display: 'inline-block', opacity: p, ...trim }}>
                {ch}
              </span>
            );
          })}
        </div>

        {/* 页脚 */}
        <div
          style={{
            position: 'absolute',
            right: GRID.margin,
            bottom: 108,
            opacity: foot,
            transform: `translateY(${(1 - foot) * 6}px)`,
          }}
        >
          <Meta size={22}>wuh.site · 2019 → 2026</Meta>
        </div>
      </AbsoluteFill>
    </ShotShell>
  );
};

export default S56;