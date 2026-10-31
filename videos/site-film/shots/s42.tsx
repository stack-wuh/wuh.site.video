/* 镜 42 · Act 7 向好与落版 · 全局帧 [6550,6730) · 180f */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { ANCHORS, CURVES, GRADES, WARM_GOLD, numRoll } from '../motion-tokens';
import { DustField } from '../components/DustField';

const serif = fontFamilies.serif;
const mono = fontFamilies.mono;

const CLAMP = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const fade = (f: number, at: number) => interpolate(f, [at, at + 14], [0, 1], CLAMP);
const GOLD = WARM_GOLD; // 暖金光尘（DUST 7）

/* tr-star-toss（§4.2）：柱顶光点抛物线 y = −v·t + ½g·t²，6720 起跨切点 20f，余辉延入镜 43 前 10f */
const tossY = (t: number) => -9 * t + 0.5 * 0.6 * t * t;

/* 镜 42（6550–6730）：年度冲顶 —— 八柱 stagger 生长（6560 起效 step 4f）+ cam-truck → cam-rush（6700→6720, ×1.8）
   + num-roll 收数于 6720 整拍 + tr-star-toss 跨切点 [材料§五·年度浏览量] */
const YEARS = ['2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026'];
const ANNUAL = [3117, 3563, 3935, 2139, 2183, 2319, 0, 4387]; // 合计 21,643
const BAR_W = 74;
const BAR_STEP = 140;
const CHART_BASE = 430;
const MAX_H = 340;
const PEAK = { x: 7 * BAR_STEP + BAR_W / 2, y: CHART_BASE - MAX_H }; // 2026 柱顶 = rush origin

const ShotSummit: FC = () => {
  const frame = useCurrentFrame(); // 镜局部帧（0 = 幕局 0 = 全局 6550）
  const local = frame;
  const rushFrom = ANCHORS.rush42.from - ANCHORS.act7; // 150
  const rushTo = ANCHORS.rush42.to - ANCHORS.act7; // 170
  const truck = interpolate(local, [10, rushFrom], [90, 0], { ...CLAMP, easing: CURVES.cineEaseInOut });
  const rush = interpolate(local, [rushFrom, rushTo], [1, ANCHORS.rush42.scale], { ...CLAMP, easing: CURVES.cineEaseIn });
  const roll = numRoll(frame, 130, 40, 0, 4387);
  const t = frame - 170; // 星抛进度（6720 = Act7 局部 170 起跨切点）
  /* ── 幕级 overlay（自 Act7 return 分解；本镜 = 幕局 0 起，断点原样） ── */
  const sat = interpolate(local, [0, 120], [1, 0.8], CLAMP);
  const bri = interpolate(local, [0, 120, 580, 650], [1, 0.85, 0.85, 0], CLAMP);
  const dustO = interpolate(local, [0, 350, 470, 560, 630], [0.85, 0.85, 0.15, 0.5, 0], CLAMP); // 光尘收拢至 0
  const goldLut = interpolate(local, [0, 40], [0.22, 0], CLAMP);
  const goldVeil = interpolate(local, [0, 40], [0.06, 0], CLAMP);
  const blackMul = interpolate(local, [0, 500], [0, 0.5], CLAMP);
  return (
    <AbsoluteFill style={{ filter: `saturate(${sat}) brightness(${bri})` }}>
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div
            style={{
              position: 'relative',
              width: 7 * BAR_STEP + BAR_W,
              height: 480,
              transform: `translateX(${truck}px) scale(${rush})`,
              transformOrigin: `${PEAK.x}px ${PEAK.y}px`,
            }}
          >
            <div style={{ position: 'absolute', left: 0, width: '100%', top: CHART_BASE, height: 1, background: colors.hairline, opacity: fade(local, 8) }} />
            {ANNUAL.map((v, i) => {
              const start = 10 + i * 4; // 6560 起效，step 4f
              const grow = interpolate(local, [start, start + (i === 7 ? 62 : 30)], [0, 1], { ...CLAMP, easing: CURVES.cineEaseOut });
              const isPeak = i === 7;
              const isZero = v === 0;
              const h = (isZero ? 10 : Math.max(4, (v / 4387) * MAX_H)) * grow;
              return (
                <div
                  key={YEARS[i]}
                  style={{
                    position: 'absolute',
                    left: i * BAR_STEP,
                    bottom: 480 - CHART_BASE,
                    width: BAR_W,
                    height: h,
                    borderRadius: '4px 4px 0 0',
                    background: isPeak ? colors.accent : isZero ? colors.muted : colors.paperMuted,
                    opacity: (isPeak ? 0.95 : isZero ? 0.45 : 0.6) * fade(local, start),
                    boxShadow: isPeak ? `0 0 ${26 * grow}px ${colors.accent}` : undefined,
                  }}
                />
              );
            })}
            {YEARS.map((y, i) => (
              <span
                key={y}
                style={{
                  position: 'absolute',
                  left: i * BAR_STEP,
                  width: BAR_W,
                  top: CHART_BASE + 16,
                  textAlign: 'center',
                  fontFamily: mono,
                  fontSize: 15,
                  color: i === 7 ? colors.accent : colors.muted,
                  opacity: fade(local, 8),
                }}
              >
                {y}
              </span>
            ))}
            {/* 2025 灰柱标 0 */}
            <span style={{ position: 'absolute', left: 6 * BAR_STEP, width: BAR_W, top: CHART_BASE - 42, textAlign: 'center', fontFamily: mono, fontSize: 20, color: colors.muted, opacity: fade(local, 54) }}>0</span>
            {/* 2026 冲顶数字（num-roll 收数于 6720） */}
            <div style={{ position: 'absolute', left: PEAK.x - 90, width: 180, top: PEAK.y - 54, textAlign: 'center', opacity: fade(local, 130) }}>
              <span style={{ fontFamily: mono, fontSize: 40, color: colors.accent, textShadow: `0 0 24px ${colors.accent}` }}>{Math.round(roll).toLocaleString()}</span>
            </div>
            {/* 柱顶光点蓄势 → tr-star-toss 上抛（拖尾三星，跨切点） */}
            {local >= 148 && t < 0 ? (
              <div
                style={{
                  position: 'absolute',
                  left: PEAK.x,
                  top: PEAK.y,
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  background: GOLD,
                  transform: 'translate(-50%, -50%)',
                  opacity: interpolate(local, [148, 170], [0, 0.9], CLAMP) * (0.7 + 0.3 * Math.sin(frame / 3)),
                  boxShadow: `0 0 18px ${GOLD}`,
                }}
              />
            ) : null}
            {t >= 0 && t < 10
              ? [0, -2.2, -4.4].map((dt, k) => {
                  const tt = t + dt;
                  if (tt < 0) return null;
                  const s = 6 - k * 1.4;
                  return (
                    <div
                      key={k}
                      style={{
                        position: 'absolute',
                        left: PEAK.x,
                        top: PEAK.y + tossY(tt),
                        width: s,
                        height: s,
                        borderRadius: s / 2,
                        background: GOLD,
                        transform: 'translate(-50%, -50%)',
                        opacity: [1, 0.45, 0.2][k],
                        boxShadow: k === 0 ? `0 0 16px ${GOLD}` : undefined,
                      }}
                    />
                  );
                })
              : null}
          </div>
          <p style={{ position: 'absolute', top: 84, right: 120, fontFamily: mono, fontSize: 17, color: colors.muted, opacity: fade(local, 110) }}>年度合计 21,643</p>
          <div style={{ position: 'absolute', bottom: 92, left: 0, width: '100%', textAlign: 'center', fontFamily: serif, fontSize: 30, color: colors.paper }}>
            <span style={{ opacity: fade(local, 44) }}>2025 · 0</span>
            <span style={{ opacity: fade(local, 120), color: colors.muted }}>　→　</span>
            <span style={{ opacity: fade(local, 170), color: colors.accent }}>2026 · 4,387 · 历史最高</span>
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
      <div style={{ opacity: dustO }}>
        <DustField act={7} />
      </div>
      {/* grade-warm-gold 残韵 40f 回收（幕局 [0,40] ⊆ 本镜） */}
      <AbsoluteFill style={{ background: WARM_GOLD, mixBlendMode: 'soft-light', opacity: goldLut }} />
      <AbsoluteFill style={{ background: GRADES[3].veil.color, mixBlendMode: 'screen', opacity: goldVeil }} />
      {/* grade-fade-black 回收至墨黑（幕局 [0,500) 跨四镜，本镜段断点原样） */}
      <AbsoluteFill style={{ background: GRADES[6].lut.color, mixBlendMode: 'multiply', opacity: blackMul }} />
    </AbsoluteFill>
  );
};

export default ShotSummit;
