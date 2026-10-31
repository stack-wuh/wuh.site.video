/* 镜 28 · Act 4 留白 · 局部帧 [0,132) · 132f
   承接 s27「海雾双卡并排」：双卡沉为底，双卡下方 2025-12 刻度亮起（FN-24）；
   21 颗提交火花聚成一簇（PT-11，火苗短促），计数「21」滚定（FN-04）；
   余光向上延展成顶部暖光带（CM-08 上摇 3%）；尾帧：火簇 + 暖带；GR-06。 */
import type { CSSProperties, FC } from 'react';
import { AbsoluteFill, interpolate, random, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, FILM_COLORS, inkRise, lightOn, numRoll, pathDraw, writeFade } from '../motion-tokens';
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

const TICK_X = 960;
const TICK_Y = 840;
const CLUSTER = { x: 960, y: 688 };

const WAVES = [0, 1, 2, 3, 4, 5].map((i) => {
  const y = PHOTO_H * (0.64 + i * 0.055);
  const pts: string[] = [];
  for (let x = 0; x <= PHOTO_W; x += 28) {
    pts.push(`${x} ${(y + Math.sin(x * 0.022 + i * 1.4) * (2 + i * 0.7)).toFixed(2)}`);
  }
  return { d: `M ${pts.join(' L ')}`, op: 0.3 - i * 0.035 };
});

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
  { d: ridgePath('s28-ridge-far', 250, 130), fill: FILM_COLORS.greyMist, opacity: 0.5 },
  { d: ridgePath('s28-ridge-mid', 290, 105), fill: FILM_COLORS.grey, opacity: 0.5 },
  { d: ridgePath('s28-ridge-near', 330, 80), fill: colors.ink, opacity: 0.45 },
];

/* PT-11：21 颗火花从散点向 2025-12 刻度上方聚拢 */
const SPARKS = Array.from({ length: 21 }).map((_, i) => {
  const seed = `s28-spark-${i}`;
  const ang = (i / 21) * Math.PI * 2;
  const rad = 18 + random(`${seed}-r`) * 12;
  return {
    x0: 960 + (random(seed) - 0.5) * 430,
    y0: 700 + (random(`${seed}-y`) - 0.5) * 170,
    tx: CLUSTER.x + Math.cos(ang) * rad * 1.3,
    ty: CLUSTER.y + Math.sin(ang) * rad * 0.85,
    delay: 26 + random(`${seed}-d`) * 12,
    size: 2.4 + random(`${seed}-s`) * 1.6,
    phase: random(`${seed}-p`) * 6.28,
    seal: random(`${seed}-c`) > 0.9,
  };
});

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

const ShotSparksTwentyOne: FC = () => {
  const frame = useCurrentFrame();
  /* 双卡沉为底纹（TR-07 镜内同配方） */
  const sink = interpolate(frame, [36, 84], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const cardStyle = {
    opacity: 1 - sink * 0.62,
    filter: `blur(${sink * 1.4}px)`,
    transform: `translateY(${sink * 8}px) scale(${1 - sink * 0.01})`,
  };
  /* CM-08：随火星升腾上摇 3% */
  const ty = interpolate(frame, [64, 132], [0, 32], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });

  const tickGlow = interpolate(frame, [16, 34], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  const count = Math.round(numRoll(frame, 58, 34, 0, 21));
  const clusterGlow = interpolate(frame, [40, 84], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  const column = interpolate(frame, [56, 104], [0, 0.28], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  const band = interpolate(frame, [76, 122], [0, 0.8], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  const bandY = interpolate(frame, [76, 122], [-26, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  const underline = interpolate(frame, [92, 100], [0, 0.7], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `translateY(${ty}px)` }}>
        <DustField act={4} count={16} seedBase="s28" />
        {/* 海面卡（左） */}
        <div style={{ ...cardStyle, position: 'absolute', left: SEA_X - CARD_W / 2, top: CARD_Y - CARD_H / 2, width: CARD_W, height: CARD_H, boxSizing: 'border-box', padding: 16, background: colors.paper, border: `1px solid ${colors.paperDeep}` }}>
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
        {/* 梧桐山雾卡（右） */}
        <div style={{ ...cardStyle, position: 'absolute', left: MTN_X - CARD_W / 2, top: CARD_Y - CARD_H / 2, width: CARD_W, height: CARD_H, boxSizing: 'border-box', padding: 16, background: colors.paper, border: `1px solid ${colors.paperDeep}` }}>
          <div style={{ position: 'relative', width: PHOTO_W, height: PHOTO_H, overflow: 'hidden', backgroundImage: `linear-gradient(180deg, ${FILM_COLORS.greyMist} 0%, ${FILM_COLORS.grey} 72%, ${FILM_COLORS.grey} 100%)` }}>
            <svg width={PHOTO_W} height={PHOTO_H} style={{ position: 'absolute', inset: 0 }}>
              {RIDGES.map((r, i) => (
                <path key={i} d={r.d} fill={r.fill} opacity={r.opacity} />
              ))}
            </svg>
            <div style={{ position: 'absolute', left: 0, right: 0, top: 120, height: 130, backgroundImage: `linear-gradient(180deg, transparent, ${FILM_COLORS.greyMist}, transparent)`, mixBlendMode: 'screen', opacity: 0.5 }} />
            <div style={{ position: 'absolute', left: 0, right: 0, top: 240, height: 110, backgroundImage: `linear-gradient(180deg, transparent, ${FILM_COLORS.greyMist}, transparent)`, mixBlendMode: 'screen', opacity: 0.36 }} />
          </div>
          <div style={stripText}>
            <span>114.23, 22.62</span>
            <span>2025-09-20</span>
          </div>
        </div>
        {/* 2025-12 刻度：时间轴短线 + 刻度亮起 */}
        <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
          <path d={`M 700 ${TICK_Y} L 1220 ${TICK_Y}`} fill="none" stroke={colors.muted} strokeWidth={2} opacity={0.55} style={pathDraw(frame, 4, 18, 520)} />
        </svg>
        <div style={{ position: 'absolute', left: TICK_X - 1, top: TICK_Y - 18, width: 2, height: 18, background: colors.muted, opacity: 0.35 * interpolate(frame, [0, 10], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }} />
        <div style={{ ...lightOn(frame, 16, 30), position: 'absolute', left: TICK_X - 45, top: TICK_Y - 45, width: 90, height: 90, borderRadius: '50%', background: `radial-gradient(circle, ${colors.accent} 0%, transparent 70%)`, opacity: 0.3 * tickGlow }} />
        <div style={{ ...lightOn(frame, 16, 30), position: 'absolute', left: TICK_X - 1, top: TICK_Y - 18, width: 2, height: 18, background: colors.accent }} />
        <div style={{ ...inkRise(frame, 24), position: 'absolute', left: 790, top: 800, width: 150, textAlign: 'right', fontFamily: fontFamilies.mono, fontSize: 20, fontVariantNumeric: 'tabular-nums', letterSpacing: '0.06em', color: colors.muted }}>
          2025-12
        </div>
        {/* 21 颗火花聚拢 */}
        <div style={{ position: 'absolute', left: CLUSTER.x - 85, top: CLUSTER.y - 85, width: 170, height: 170, borderRadius: '50%', background: `radial-gradient(circle, ${FILM_COLORS.dawnLight} 0%, transparent 65%)`, opacity: 0.3 * clusterGlow }} />
        {SPARKS.map((s, i) => {
          const p = interpolate(frame, [s.delay, s.delay + 30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
          const x = s.x0 + (s.tx - s.x0) * p;
          const y = s.y0 + (s.ty - s.y0) * p;
          const flick = 0.55 + 0.45 * Math.sin(frame / 5 + s.phase);
          const flame = Math.sin(frame / 4.2 + s.phase) * 1.8;
          const stretch = 1.9 + 0.45 * Math.sin(frame / 4.2 + s.phase);
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: s.x0 - s.size / 2,
                top: s.y0 - s.size / 2,
                width: s.size,
                height: s.size,
                borderRadius: s.size / 2,
                background: s.seal ? colors.seal : colors.gold,
                opacity: p * flick,
                transform: `translate(${x - s.x0}px, ${y - s.y0 + flame}px) scaleY(${stretch})`,
              }}
            />
          );
        })}
        {/* 计数 21 */}
        <div style={{ ...writeFade(frame, 56), position: 'absolute', left: 1080, top: 646, fontFamily: fontFamilies.mono, fontSize: 76, fontVariantNumeric: 'tabular-nums', letterSpacing: '0.02em', color: colors.gold }}>
          {count}
        </div>
        <div style={{ position: 'absolute', left: 1082, top: 740, width: 46, height: 2, background: colors.accent, opacity: underline }} />
        {/* 余光向上延展：光柱 → 顶部暖光带 */}
        <div style={{ position: 'absolute', left: 900, top: 240, width: 120, height: 470, backgroundImage: `linear-gradient(0deg, ${FILM_COLORS.dawnLight} 0%, transparent 82%)`, opacity: column }} />
        <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 170, backgroundImage: `linear-gradient(180deg, ${FILM_COLORS.dawnLight}, transparent)`, opacity: band, transform: `translateY(${bandY}px)` }} />
      </AbsoluteFill>
      <PaperGrain opacity={0.05} />
      <AbsoluteFill style={{ opacity: interpolate(frame, [70, 126], [1, 0.55], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>
        <Grade id="GR-01" />
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: interpolate(frame, [64, 122], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>
        <Grade id="GR-06" />
      </AbsoluteFill>
      <Caption text="十二月，他回来了：21 个提交。" appearAt={28} />
    </AbsoluteFill>
  );
};

export default ShotSparksTwentyOne;
