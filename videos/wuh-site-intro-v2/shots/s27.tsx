/* 镜 27 · Act 4 留白 · 局部帧 [0,132) · 132f
   承接 s26「海面卡冻结左侧」：第二张照片卡（梧桐山雾，青灰山脊线）自右侧滑入（SP-07 无回弹），
   与海面卡并排对称；坐标「114.23, 22.62」、日期「2025-09-20」；
   并排后镜头 102→100% 缓慢收拢；GR-05。 */
import type { CSSProperties, FC } from 'react';
import { AbsoluteFill, interpolate, random, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, FILM_COLORS } from '../motion-tokens';
import { DustField } from '../components/DustField';
import { PaperGrain } from '../components/PaperGrain';
import { Grade } from '../components/Grade';
import { Caption } from '../components/Caption';

const CARD_W = 660;
const CARD_H = 480;
const CARD_Y = 372;
const SEA_X = 610;
const MTN_X = 1310;
const PHOTO_W = CARD_W - 32;
const PHOTO_H = CARD_H - 32 - 54;

/* 海面卡：与 s26 尾帧同形（波纹线层级） */
const WAVES = [0, 1, 2, 3, 4, 5].map((i) => {
  const y = PHOTO_H * (0.64 + i * 0.055);
  const pts: string[] = [];
  for (let x = 0; x <= PHOTO_W; x += 28) {
    pts.push(`${x} ${(y + Math.sin(x * 0.022 + i * 1.4) * (2 + i * 0.7)).toFixed(2)}`);
  }
  return { d: `M ${pts.join(' L ')}`, op: 0.3 - i * 0.035 };
});

/* 山脊剪影：确定性种子折线（远→近三层，雾中隐现） */
const ridgePath = (seed: string, baseY: number, amp: number): string => {
  const ph = random(`${seed}-ph`) * 6.28;
  const pts: string[] = ['0 394'];
  for (let x = 0; x <= PHOTO_W; x += 28) {
    const y = baseY - (Math.sin(x * 0.012 + ph) * 0.5 + 0.5) * amp - random(`${seed}-j-${x}`) * 14;
    pts.push(`${x} ${y.toFixed(1)}`);
  }
  pts.push(`${PHOTO_W} 394`);
  return `M ${pts.join(' L ')} Z`;
};
const RIDGES = [
  { d: ridgePath('s27-ridge-far', 250, 130), fill: FILM_COLORS.greyMist, opacity: 0.5 },
  { d: ridgePath('s27-ridge-mid', 290, 105), fill: FILM_COLORS.grey, opacity: 0.5 },
  { d: ridgePath('s27-ridge-near', 330, 80), fill: colors.ink, opacity: 0.45 },
];

const stripText: CSSProperties = {
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
};

const ShotMountainPhotoCard: FC = () => {
  const frame = useCurrentFrame();
  /* 相机：承接 s26 尾帧（1.04 / -24），并排后缓慢收拢回 100% */
  const scale = interpolate(frame, [0, 110], [1.04, 1.0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const tx = interpolate(frame, [0, 110], [-24, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  /* 第二张卡：右侧滑入（ease-out，无回弹） */
  const p = interpolate(frame, [8, 34], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  const dx = (1 - p) * 840;
  /* 山脊随卡落定渐显 */
  const ridgeP = interpolate(frame, [12, 38], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `translateX(${tx}px) scale(${scale})` }}>
        <DustField act={4} count={10} seedBase="s27" />
        {/* 海面卡（左，承接 s26 尾帧） */}
        <div style={{ position: 'absolute', left: SEA_X - CARD_W / 2, top: CARD_Y - CARD_H / 2, width: CARD_W, height: CARD_H, boxSizing: 'border-box', padding: 16, background: colors.paper, border: `1px solid ${colors.paperDeep}` }}>
          <div style={{ position: 'relative', width: PHOTO_W, height: PHOTO_H, overflow: 'hidden', backgroundImage: `linear-gradient(180deg, ${FILM_COLORS.greyMist} 0%, ${FILM_COLORS.greyMist} 62%, ${FILM_COLORS.grey} 64%, ${FILM_COLORS.grey} 100%)` }}>
            <svg width={PHOTO_W} height={PHOTO_H} style={{ position: 'absolute', inset: 0 }}>
              {WAVES.map((w, i) => (
                <path key={i} d={w.d} fill="none" stroke={colors.paper} strokeWidth={1.5} opacity={w.op} />
              ))}
            </svg>
            <div style={{ position: 'absolute', left: 0, right: 0, top: '62%', height: 1, background: colors.paper, opacity: 0.4 }} />
          </div>
          <div style={stripText}>
            <span>114.585, 22.55</span>
            <span>2025-08-15</span>
          </div>
        </div>
        {/* 梧桐山雾卡（右，滑入并排） */}
        <div
          style={{
            position: 'absolute',
            left: MTN_X - CARD_W / 2,
            top: CARD_Y - CARD_H / 2,
            width: CARD_W,
            height: CARD_H,
            boxSizing: 'border-box',
            padding: 16,
            background: colors.paper,
            border: `1px solid ${colors.paperDeep}`,
            opacity: Math.min(1, p * 1.6),
            transform: `translateX(${dx}px)`,
          }}
        >
          <div style={{ position: 'relative', width: PHOTO_W, height: PHOTO_H, overflow: 'hidden', backgroundImage: `linear-gradient(180deg, ${FILM_COLORS.greyMist} 0%, ${FILM_COLORS.grey} 72%, ${FILM_COLORS.grey} 100%)` }}>
            <svg width={PHOTO_W} height={PHOTO_H} style={{ position: 'absolute', inset: 0, opacity: ridgeP }}>
              {RIDGES.map((r, i) => (
                <path key={i} d={r.d} fill={r.fill} opacity={r.opacity} />
              ))}
            </svg>
            <div style={{ position: 'absolute', left: 0, right: 0, top: 120, height: 130, backgroundImage: `linear-gradient(180deg, transparent, ${FILM_COLORS.greyMist}, transparent)`, mixBlendMode: 'screen', opacity: 0.5 * ridgeP }} />
            <div style={{ position: 'absolute', left: 0, right: 0, top: 240, height: 110, backgroundImage: `linear-gradient(180deg, transparent, ${FILM_COLORS.greyMist}, transparent)`, mixBlendMode: 'screen', opacity: 0.36 * ridgeP }} />
          </div>
          <div style={stripText}>
            <span>114.23, 22.62</span>
            <span>2025-09-20</span>
          </div>
        </div>
      </AbsoluteFill>
      <PaperGrain opacity={0.07} />
      <Grade id="GR-05" />
      <Caption text="九月，梧桐山。" appearAt={22} />
    </AbsoluteFill>
  );
};

export default ShotMountainPhotoCard;
