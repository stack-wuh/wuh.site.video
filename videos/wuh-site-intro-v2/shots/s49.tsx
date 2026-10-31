/* 镜 49 · Act 7 坐忘 · 局部帧 [0,132) · 132f
   书页被风合上（左页绕书脊翻合，封面浮现）；晨光移向画面右缘并收拢（GR-06）；
   时间轴墨点自 2026-06 走进 07、再向前；CM-07+CM-03 组合横移缓推，CM-13 焦点由书桌移向远处，
   散落光点聚成星轨环（PT-10 预聚）；无字幕；交接八月。 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, random, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, orbitDrift } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { DustField } from '../components/DustField';
import { PaperGrain } from '../components/PaperGrain';
import { Grade } from '../components/Grade';

const RING = { cx: 1040, cy: 306, rx: 224, ry: 74 };
const STAR_COUNT = 12;

/* 星轨环目标点（静态环）与散落起点（seed 确定性） */
const STARS = Array.from({ length: STAR_COUNT }).map((_, i) => {
  const target = orbitDrift(0, RING.cx, RING.cy, RING.rx, RING.ry, 0, (i / STAR_COUNT) * Math.PI * 2);
  return {
    i,
    target,
    sx: 420 + random(`s49-star-${i}-x`) * 1080,
    sy: 120 + random(`s49-star-${i}-y`) * 330,
  };
});

const LINES = [0, 1, 2, 3, 4, 5, 6, 7, 8];

const PageLines: FC = () => (
  <>
    {LINES.map((i) => (
      <div
        key={i}
        style={{
          height: 8,
          width: `${58 + ((i * 17) % 34)}%`,
          marginBottom: 22,
          borderRadius: 3,
          background: colors.paperMuted,
          opacity: 0.6,
        }}
      />
    ))}
  </>
);

const ShotBookCloseStarTrail: FC = () => {
  const frame = useCurrentFrame();
  const closeLeft = interpolate(frame, [4, 40], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  const cover = interpolate(frame, [28, 48], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const line = interpolate(frame, [26, 62], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const walk = interpolate(frame, [58, 106], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const starIn = interpolate(frame, [80, 96], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  const gather = interpolate(frame, [96, 130], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const deskBlur = interpolate(frame, [100, 132], [0, 2.4], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const starBlur = interpolate(frame, [88, 126], [5, 0.4], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const camScale = interpolate(frame, [0, 132], [1.02, 1.08], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const camX = interpolate(frame, [0, 132], [0, -36], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const lightShift = interpolate(frame, [0, 110], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <CameraRig cam={{ scale: camScale, x: camX, y: 0, rot: 0 }}>
        {/* 书桌（收尾时焦点移走，桌面沉入虚焦） */}
        <AbsoluteFill style={{ filter: `blur(${deskBlur}px)` }}>
          <AbsoluteFill style={{ background: `linear-gradient(135deg, ${colors.paperMuted} 0%, ${colors.paperDeep} 55%, ${colors.paperMuted} 100%)` }} />

          {/* 晨光：移向画面右缘 */}
          <AbsoluteFill style={{ mixBlendMode: 'screen', opacity: 0.3 - lightShift * 0.12, pointerEvents: 'none' }}>
            <div
              style={{
                position: 'absolute',
                left: -600,
                top: -700,
                width: 3400,
                height: 2100,
                background: `linear-gradient(180deg, ${colors.gold} 0%, transparent 40%)`,
                transform: `translateX(${lightShift * 420}px) rotate(10deg)`,
              }}
            />
          </AbsoluteFill>
          <AbsoluteFill style={{ background: `linear-gradient(90deg, transparent 58%, ${colors.gold} 100%)`, opacity: 0.16 + lightShift * 0.22, mixBlendMode: 'screen' }} />

          {/* 被风合上的书：右页留存，左页绕书脊翻合，闭书封面浮现 */}
          <div style={{ position: 'absolute', left: 520, top: 360, width: 840, height: 520, perspective: 1400 }}>
            <div
              style={{
                position: 'absolute',
                left: 420,
                top: 0,
                width: 420,
                height: 520,
                background: `linear-gradient(255deg, ${colors.paper} 0%, ${colors.paperDeep} 100%)`,
                borderRadius: '0 8px 8px 0',
                padding: '50px 44px',
                overflow: 'hidden',
              }}
            >
              <PageLines />
            </div>
            <div
              style={{
                position: 'absolute',
                left: 420,
                top: 0,
                width: 420,
                height: 520,
                background: `linear-gradient(180deg, ${colors.paperDeep} 0%, ${colors.paperMuted} 100%)`,
                border: `1px solid ${colors.paperMuted}`,
                borderRadius: '2px 8px 8px 2px',
                opacity: cover,
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: 420,
                height: 520,
                transformOrigin: 'right center',
                transform: `rotateY(${-closeLeft * 180}deg)`,
                backfaceVisibility: 'hidden',
                background: `linear-gradient(105deg, ${colors.paper} 0%, ${colors.paperDeep} 100%)`,
                borderRadius: '8px 0 0 8px',
                padding: '50px 44px',
                overflow: 'hidden',
                filter: `brightness(${1 - closeLeft * 0.12})`,
              }}
            >
              <PageLines />
            </div>
          </div>

          {/* 时间轴：墨点自 2026-06 走进 07、再向前 */}
          <div style={{ position: 'absolute', left: 460, top: 764, width: 1000, height: 2, background: colors.ink, opacity: 0.42 * line, transform: `scaleX(${line})`, transformOrigin: 'left' }} />
          <div style={{ position: 'absolute', left: 698, top: 752, width: 2, height: 14, background: colors.ink, opacity: 0.5 * line }} />
          <div style={{ position: 'absolute', left: 898, top: 752, width: 2, height: 14, background: colors.ink, opacity: 0.5 * line }} />
          <div style={{ position: 'absolute', left: 640, top: 786, fontFamily: fontFamilies.mono, fontSize: 15, letterSpacing: '0.18em', color: colors.muted, opacity: line, fontVariantNumeric: 'tabular-nums' }}>
            2026-06
          </div>
          <div style={{ position: 'absolute', left: 840, top: 786, fontFamily: fontFamilies.mono, fontSize: 15, letterSpacing: '0.18em', color: colors.muted, opacity: line, fontVariantNumeric: 'tabular-nums' }}>
            2026-07
          </div>
          <div style={{ position: 'absolute', left: 694, top: 759, width: 12, height: 12, borderRadius: 6, background: colors.ink, opacity: line, transform: `translateX(${walk * 380}px)`, boxShadow: `0 0 14px ${colors.accent}` }} />

          <DustField act={7} count={13} seedBase="s49" />
        </AbsoluteFill>

        {/* 远处光点聚成星轨环（PT-10） */}
        <AbsoluteFill style={{ filter: `blur(${starBlur}px)` }}>
          {STARS.map((s) => (
            <div
              key={s.i}
              style={{
                position: 'absolute',
                left: s.sx - 2.5,
                top: s.sy - 2.5,
                width: 5,
                height: 5,
                borderRadius: 3,
                background: colors.gold,
                opacity: starIn * (0.55 + (s.i % 3) * 0.15),
                transform: `translate(${(s.target.x - s.sx) * gather}px, ${(s.target.y - s.sy) * gather}px)`,
              }}
            />
          ))}
          <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, opacity: gather * 0.35 }}>
            <ellipse cx={RING.cx} cy={RING.cy} rx={RING.rx} ry={RING.ry} fill="none" stroke={colors.accent} strokeWidth={1.2} />
          </svg>
        </AbsoluteFill>
      </CameraRig>
      <PaperGrain opacity={0.05} />
      <Grade id="GR-06" />
    </AbsoluteFill>
  );
};

export default ShotBookCloseStarTrail;
