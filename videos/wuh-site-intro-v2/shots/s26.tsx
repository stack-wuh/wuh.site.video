/* 镜 26 · Act 4 留白 · 局部帧 [0,132) · 132f
   承接 s25「大字 0 虚焦」：0 的残影退场（TR-14 入场侧），照片卡自暗场浮现 20f；
   杨梅坑海面以灰调渐变 + 波纹线层级表现（不用照片），坐标 / 日期等宽小字；
   CM-11 微距横移扫过海平线；GR-05（颗粒保留）；尾帧：海面卡冻结画幅左侧。 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, FILM_COLORS } from '../motion-tokens';
import { DustField } from '../components/DustField';
import { PaperGrain } from '../components/PaperGrain';
import { Grade } from '../components/Grade';
import { Caption } from '../components/Caption';

const CARD_W = 660;
const CARD_H = 480;
const CARD_X = 610;
const CARD_Y = 372;
const PHOTO_W = CARD_W - 32;
const PHOTO_H = CARD_H - 32 - 54;

/* 波纹线层级：海平线以下的几道缓波（确定性正弦，非随机） */
const WAVES = [0, 1, 2, 3, 4, 5].map((i) => {
  const y = PHOTO_H * (0.64 + i * 0.055);
  const pts: string[] = [];
  for (let x = 0; x <= PHOTO_W; x += 28) {
    pts.push(`${x} ${(y + Math.sin(x * 0.022 + i * 1.4) * (2 + i * 0.7)).toFixed(2)}`);
  }
  return { d: `M ${pts.join(' L ')}`, op: 0.3 - i * 0.035 };
});

const ShotSeaPhotoCard: FC = () => {
  const frame = useCurrentFrame();
  /* 上镜大字 0 的虚焦残影 */
  const ghost = interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  /* 照片卡浮现 20f（TR-14：blur 8→0） */
  const p = interpolate(frame, [14, 34], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  /* 微距横移扫过海平线 */
  const scale = interpolate(frame, [0, 120], [1.0, 1.04], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const tx = interpolate(frame, [54, 120], [0, -24], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `translateX(${tx}px) scale(${scale})` }}>
        <DustField act={4} count={12} seedBase="s26" />
        {/* 0 的残影：从虚焦里退场 */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 210,
            height: 620,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: fontFamilies.serif,
            fontSize: 520,
            lineHeight: 1,
            fontVariantNumeric: 'tabular-nums',
            color: colors.paper,
            opacity: 0.92 * (1 - ghost),
            filter: `blur(${9 + ghost * 7}px)`,
            transform: `scale(${1 + ghost * 0.04})`,
          }}
        >
          0
        </div>
        {/* 照片卡：杨梅坑海面 */}
        <div
          style={{
            position: 'absolute',
            left: CARD_X - CARD_W / 2,
            top: CARD_Y - CARD_H / 2,
            width: CARD_W,
            height: CARD_H,
            boxSizing: 'border-box',
            padding: 16,
            background: colors.paper,
            border: `1px solid ${colors.paperDeep}`,
            opacity: p,
            transform: `translateY(${(1 - p) * 46}px)`,
            filter: `blur(${(1 - p) * 12}px)`,
          }}
        >
          <div
            style={{
              position: 'relative',
              width: PHOTO_W,
              height: PHOTO_H,
              overflow: 'hidden',
              backgroundImage: `linear-gradient(180deg, ${FILM_COLORS.greyMist} 0%, ${FILM_COLORS.greyMist} 62%, ${FILM_COLORS.grey} 64%, ${FILM_COLORS.grey} 100%)`,
            }}
          >
            <svg width={PHOTO_W} height={PHOTO_H} style={{ position: 'absolute', inset: 0 }}>
              {WAVES.map((w, i) => (
                <path key={i} d={w.d} fill="none" stroke={colors.paper} strokeWidth={1.5} opacity={w.op} />
              ))}
            </svg>
            <div style={{ position: 'absolute', left: 0, right: 0, top: '62%', height: 1, background: colors.paper, opacity: 0.4 }} />
          </div>
          <div
            style={{
              height: 54,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 6px',
              fontFamily: fontFamilies.mono,
              fontSize: 20,
              fontVariantNumeric: 'tabular-nums',
              letterSpacing: '0.04em',
              color: colors.ink,
            }}
          >
            <span>114.585, 22.55</span>
            <span>2025-08-15</span>
          </div>
        </div>
      </AbsoluteFill>
      <PaperGrain opacity={0.07} />
      <Grade id="GR-05" />
      <Caption text="可日子没有停：八月，杨梅坑；" appearAt={26} />
    </AbsoluteFill>
  );
};

export default ShotSeaPhotoCard;
