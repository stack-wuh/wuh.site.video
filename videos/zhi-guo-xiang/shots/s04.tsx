/* 镜 04 · S4 年老的手搁笔 · 镜内帧 0–59 · 60f ｜ 全局 660–720
   TR-02 8f 由 S3 的墨蓝水线溶入纸面静物；CM-09 微距俯拍 15° + CM-02；
   FG-01(old) 只给右手：paper 填充 + 1.2px ink 收口 + 4 条折线；FN-13 落笔 → 停 1 拍 → 退出 10f。
   尾帧只余笔与砚（FN-06）→ TR-04 20f 交 S5。L0：全片第一张「脸」是一只手。 */
import type { FC } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { CameraRig } from '../components/CameraRig';
import { CM, CV, FILM, FN, GRADES, STROKE } from '../motion-tokens';

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const HORIZON = 520;
const G = GRADES['GR-01'];

/** 砚、笔、右手：砚里墨已干、只剩一圈旧痕；笔搁在砚边；手自右下方入画 */
const StillLife: FC<{ hx: number; hy: number; bx: number; by: number }> = ({ hx, hy, bx, by }) => (
  <svg viewBox="0 0 1920 1080" preserveAspectRatio="none" width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
    <g transform="rotate(-8 1010 790)">
      <ellipse cx={1010} cy={790} rx={236} ry={128} fill={colors.paperDeep} stroke={colors.muted} strokeWidth={STROKE.S2} />
      <ellipse cx={1010} cy={790} rx={172} ry={86} fill="none" stroke={colors.ink} strokeWidth={STROKE.S1} opacity={0.3} />
      <ellipse cx={952} cy={806} rx={64} ry={26} fill={colors.ink} opacity={0.04} />
    </g>
    {/* 笔：只管落定，不随退出的手走 */}
    <g transform={`translate(${bx.toFixed(1)} ${by.toFixed(1)})`}>
      <path d="M888 704 q-28 -4 -46 18 q22 16 48 4 z" fill={colors.ink} />
      <line x1={900} y1={720} x2={1404} y2={694} stroke={colors.ink} strokeWidth={STROKE.S2} strokeLinecap="round" />
      <line x1={1008} y1={714} x2={1034} y2={713} stroke={colors.paperMuted} strokeWidth={STROKE.S2} />
      <circle cx={1400} cy={694} r={5} fill={colors.paperMuted} stroke={colors.ink} strokeWidth={STROKE.S0} />
    </g>
    {/* FG-01(old) 右手：折线即年龄 */}
    <g transform={`translate(${hx.toFixed(1)} ${hy.toFixed(1)})`}>
      <rect x={1600} y={880} width={520} height={300} rx={26} transform="rotate(-16 1600 880)" fill={colors.paperMuted} stroke={colors.ink} strokeWidth={STROKE.S1} />
      <ellipse cx={1565} cy={815} rx={134} ry={106} transform="rotate(-26 1565 815)" fill={colors.paper} stroke={colors.ink} strokeWidth={STROKE.S1} />
      <rect x={1300} y={612} width={250} height={56} rx={28} transform="rotate(20 1300 612)" fill={colors.paper} stroke={colors.ink} strokeWidth={STROKE.S1} />
      <rect x={1330} y={676} width={220} height={58} rx={29} transform="rotate(14 1330 676)" fill={colors.paper} stroke={colors.ink} strokeWidth={STROKE.S1} />
      <rect x={1350} y={790} width={190} height={72} rx={36} transform="rotate(22 1350 790)" fill={colors.paper} stroke={colors.ink} strokeWidth={STROKE.S1} />
      {['M1480 770 q32 -10 60 4', 'M1490 802 q34 -8 66 6', 'M1504 834 q34 -6 62 10', 'M1520 864 q30 -6 56 8'].map((d) => (
        <path key={d} d={d} fill="none" stroke={colors.ink} strokeWidth={STROKE.S0} opacity={0.45} />
      ))}
    </g>
  </svg>
);

const S04: FC = () => {
  const f = FN.freezeHold(useCurrentFrame(), 59); // FN-06
  const land = CV.out(clamp01(f / 22)); // FN-13 brush-rest：22f 落笔
  const exit = CV.inOut(clamp01((f - 40) / 10)); // FN-13 手退出 10f（40–50）
  const dissolve = CV.inOut(clamp01(f / 8)); // TR-02 8f 溶入
  const cam = { ...CM.drift(f, 1.5), scale: CM.macro(f, 60, 1.12, 1.12).scale }; // CM-02 + CM-09 固定微距
  const bx = -18 * (1 - land);
  const by = -64 * (1 - land);
  return (
    <AbsoluteFill style={{ background: colors.paper }}>
      {/* S3 尾帧的墨蓝水线：8f 内溶出，静止物接手 */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: HORIZON, height: 1, background: FILM.nightBlue, opacity: 0.24 * (1 - dissolve) }} />
      <CameraRig cam={cam}>
        <div style={{ position: 'absolute', inset: -40, background: colors.paper }} />
        <div style={{ position: 'absolute', inset: 0, opacity: dissolve }}>
          <StillLife hx={bx + 120 * exit} hy={by + 640 * exit} bx={bx} by={by} />
        </div>
      </CameraRig>
      {/* GR-01 纸白：与 S1–S3 同一纸面 */}
      <AbsoluteFill style={{ background: G.base.color, mixBlendMode: G.base.blend, opacity: G.base.opacity }} />
      <AbsoluteFill
        style={{ backgroundImage: G.veil?.gradient, mixBlendMode: G.veil?.blend, opacity: (G.veil?.opacity ?? 0) * 0.45 }}
      />
    </AbsoluteFill>
  );
};

export default S04;
