/* 镜 03 · S3 海 · 镜内帧 0–239 · 240f ｜ 全局 420–660
   入场 PT-09/PT-10/CM-05；持续 CM-05/CM-10/PT-03；出场 PT-09 收静线 + FN-06 → TR-02 8f 交 S4。
   水纹一段段铺开，速度与 S2 山脊生长同一口气；尾段收成一条静线、留白扩大。
   诗第 2 行 20–200；水不说话，所以只有纹、没有浪。 */
import type { FC } from 'react';
import { AbsoluteFill, random, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { CameraRig } from '../components/CameraRig';
import { Caption } from '../components/Caption';
import { DustField } from '../components/DustField';
import { CM, CV, FILM, FN, GRADES, STROKE } from '../motion-tokens';

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const HORIZON = 520;
const G = GRADES['GR-01'];
const BAND = {
  base: [548, 672, 862],
  span: [104, 176, 176],
  len: [70, 170, 320],
  add: [120, 250, 360],
  op: [0.2, 0.3, 0.18],
  depth: [0.85, 1, 1.25],
};

/** PT-09 水纹：44 段横向 1px 水纹，远疏、中密、近疏；种子化，永不平移抖动 */
type Ripple = { y: number; x: number; len: number; w: number; o: number; delay: number; depth: number; blue: boolean };
const RIPPLE: Ripple[] = Array.from({ length: 44 }).map((_, i) => {
  const b = i < 12 ? 0 : i < 32 ? 1 : 2;
  return {
    y: BAND.base[b] + random(`s03-y-${i}`) * BAND.span[b],
    x: -260 + random(`s03-x-${i}`) * 2440,
    len: BAND.len[b] + random(`s03-len-${i}`) * BAND.add[b],
    w: b === 2 ? STROKE.S1 : STROKE.S0,
    o: BAND.op[b] + random(`s03-o-${i}`) * 0.14,
    delay: 8 + (i % 12) * 6 + b * 10,
    depth: BAND.depth[b],
    blue: random(`s03-c-${i}`) > 0.32,
  };
});

const S03: FC = () => {
  const f = FN.freezeHold(useCurrentFrame(), 239); // FN-06
  const cam = CM.pan(f, 239, -58); // CM-05 横移 3%（plateau，禁线性）
  const pan = cam.x;
  const settle = clamp01((f - 200) / 39); // PT-09 尾 40f 收静线
  const wash = 0.12 * (1 - CV.hardStep3(settle)); // 留白扩大：三档硬切（CV-06）
  return (
    <AbsoluteFill style={{ background: colors.paper }}>
      <CameraRig cam={cam}>
        <div style={{ position: 'absolute', inset: -100, background: colors.paper }} />
        {/* 水：下半一薄层雪青，远处水线与纸面同色 */}
        <div
          style={{
            position: 'absolute',
            left: -100,
            right: -100,
            top: HORIZON,
            bottom: -60,
            backgroundImage: `linear-gradient(180deg, transparent, ${FILM.snowCyan})`,
            opacity: wash,
          }}
        />
        <svg viewBox="0 0 1920 1080" preserveAspectRatio="none" width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
          {RIPPLE.map((r, i) => {
            const p = CV.out(clamp01((f - r.delay) / 36)); // PT-10 逐段生长
            if (p <= 0) return null;
            return (
              <g
                key={i}
                transform={`translate(${(pan * (r.depth - 1)).toFixed(1)} 0)`}
                opacity={r.o * (1 - settle)}
                style={{ filter: r.depth < 1 ? 'blur(0.6px)' : 'none' }}
              >
                <path
                  d={`M${r.x.toFixed(1)} ${r.y.toFixed(1)} q${(r.len / 2).toFixed(1)} ${(Math.sin(i) * 4).toFixed(1)} ${r.len.toFixed(1)} 0`}
                  fill="none"
                  stroke={r.blue ? FILM.nightBlue : FILM.snowCyan}
                  strokeWidth={r.w}
                  strokeDasharray={r.len.toFixed(1)}
                  strokeDashoffset={(r.len * (1 - p)).toFixed(1)}
                  strokeLinecap="round"
                />
              </g>
            );
          })}
          {/* 远处水线：尾帧唯一留下的那条静线（交接态：墨蓝水线） */}
          <line
            x1={-200}
            y1={HORIZON}
            x2={2120}
            y2={HORIZON}
            transform={`translate(${(pan * -0.15).toFixed(1)} 0)`}
            stroke={FILM.nightBlue}
            strokeWidth={STROKE.S0}
            opacity={0.1 + 0.14 * settle}
          />
        </svg>
        <DustField act={1} count={12} seedBase="s03" />
      </CameraRig>
      {/* GR-01 纸白：与 S1 同一纸面、同一光位 */}
      <AbsoluteFill style={{ background: G.base.color, mixBlendMode: G.base.blend, opacity: G.base.opacity }} />
      <AbsoluteFill
        style={{ backgroundImage: G.veil?.gradient, mixBlendMode: G.veil?.blend, opacity: (G.veil?.opacity ?? 0) * 0.45 }}
      />
      {/* 纸白底上 Caption 取 difference：字在纸上成墨，不压暗纸面 */}
      <div style={{ position: 'absolute', inset: 0, mixBlendMode: 'difference' }}>
        <Caption text="我路过海时，海不说话，" start={20} end={200} poem bottom={600} />
      </div>
    </AbsoluteFill>
  );
};

export default S03;
