/* 镜 50 · Act 8 此刻 · 局部帧 [0,96) · 96f
   承接 Act 7 尾帧：晨光自下缘收拢，远处光点聚成星轨环。
   2026-08-22 刻度先亮（write-fade），release 三节点（构建→传输→上线）连成短线（FN-21），
   随后展开落到环上（FN-28），星轨初转缓慢（CM-10），中心落「v1.0.1」；
   CM-11 微距→星轨全景 40f（CM-03 + CM-13）；GR-01。 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, orbitDrift, pathDraw, writeFade } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { DustField } from '../components/DustField';
import { PaperGrain } from '../components/PaperGrain';
import { Grade } from '../components/Grade';
import { Caption } from '../components/Caption';

const CLAMP = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const CX = 960;
const CY = 500;
const RX = 380;
const RY = 148;
const RING_LEN = 1680;
const SPIN_START = 56;

const mono = fontFamilies.mono;

/* FN-28 静态取样：环上 28 格刻度，每 7 格加长 */
const TICKS = Array.from({ length: 28 }).map((_, i) => {
  const a = (i / 28) * Math.PI * 2;
  const major = i % 7 === 0;
  const inner = orbitDrift(0, CX, CY, RX - (major ? 20 : 10), RY - (major ? 8 : 4), 0, a);
  const outer = orbitDrift(0, CX, CY, RX, RY, 0, a);
  return { x1: inner.x, y1: inner.y, x2: outer.x, y2: outer.y, major };
});

/* 2026-08-22 起点刻度（左下弧） */
const DATE_ANGLE = (5 * Math.PI) / 6;
const DATE_ON_RING = orbitDrift(0, CX, CY, RX, RY, 0, DATE_ANGLE);

const NODE_LABELS = ['构建', '传输', '上线'];

const ShotStarOrbit: FC = () => {
  const frame = useCurrentFrame();
  const camScale = interpolate(frame, [0, 40], [1.14, 1], { ...CLAMP, easing: CURVES.cineEaseInOut });
  const spin = frame < SPIN_START ? 0 : (frame - SPIN_START) * 0.05;
  const dawn = interpolate(frame, [0, 34], [0.12, 0.02], { ...CLAMP, easing: CURVES.cineEaseOut });
  const ringFade = interpolate(frame, [30, 40], [0, 0.55], CLAMP);
  const ringStyle = pathDraw(frame, 32, 26, RING_LEN);
  const dateLit = writeFade(frame, 6, true);
  const center = writeFade(frame, 48, true);
  const kicker = writeFade(frame, 42);
  const chain = writeFade(frame, 56);

  /* release 三节点：中心短线 → 展开落到环上 */
  const nodes = NODE_LABELS.map((label, i) => {
    const end = orbitDrift(0, CX, CY, RX, RY, 0, (i - 1) * 0.24);
    const sx = CX + (i - 1) * 74;
    const sy = 648;
    const p = interpolate(frame, [26 + i * 4, 50 + i * 4], [0, 1], { ...CLAMP, easing: CURVES.cineEaseInOut });
    return {
      label,
      x: sx + (end.x - sx) * p,
      y: sy + (end.y - sy) * p,
      appear: interpolate(frame, [8 + i * 4, 16 + i * 4], [0, 1], { ...CLAMP, easing: CURVES.cineEaseOut }),
    };
  });
  const connFade = interpolate(frame, [6, 14], [0, 0.7], CLAMP) * interpolate(frame, [46, 58], [1, 0], CLAMP);

  return (
    <AbsoluteFill>
      <CameraRig cam={{ scale: camScale, x: 0, y: 0, rot: 0, origin: '50% 60%' }}>
        <AbsoluteFill>
          <DustField act={8} seedBase="s50" />
          {/* 晨光余晖自下缘退去（坐忘 → 此刻） */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              height: 420,
              backgroundImage: `linear-gradient(0deg, ${colors.gold}, transparent 62%)`,
              opacity: dawn,
            }}
          />
          {/* 星轨（慢转） */}
          <div style={{ position: 'absolute', inset: 0, transform: `rotate(${spin}deg)`, transformOrigin: `${CX}px ${CY}px` }}>
            <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
              <ellipse cx={CX} cy={CY} rx={RX - 26} ry={RY - 10} fill="none" stroke={colors.muted} strokeWidth={1} strokeDasharray="3 11" opacity={0.16} />
              <ellipse cx={CX} cy={CY} rx={RX} ry={RY} fill="none" stroke={colors.gold} strokeWidth={1.6} opacity={ringFade} style={ringStyle} />
              {TICKS.map((t, i) => (
                <line
                  key={i}
                  x1={t.x1}
                  y1={t.y1}
                  x2={t.x2}
                  y2={t.y2}
                  stroke={t.major ? colors.gold : colors.muted}
                  strokeWidth={t.major ? 1.6 : 1}
                  opacity={interpolate(frame, [28 + i * 0.7, 36 + i * 0.7], [0, t.major ? 0.6 : 0.3], CLAMP)}
                />
              ))}
              {/* 2026-08-22 刻度亮起 */}
              <circle cx={DATE_ON_RING.x} cy={DATE_ON_RING.y} r={4.5} fill={colors.gold} opacity={Number(dateLit.opacity ?? 0) * 0.9} />
              {/* release 三节点短线（展开中段后淡出） */}
              {connFade > 0.01 ? (
                <>
                  <line x1={nodes[0].x} y1={nodes[0].y} x2={nodes[1].x} y2={nodes[1].y} stroke={colors.accent} strokeWidth={1.5} strokeLinecap="round" opacity={connFade} />
                  <line x1={nodes[1].x} y1={nodes[1].y} x2={nodes[2].x} y2={nodes[2].y} stroke={colors.accent} strokeWidth={1.5} strokeLinecap="round" opacity={connFade} />
                </>
              ) : null}
            </svg>
            {/* 刻度日期 */}
            <div
              style={{
                ...dateLit,
                position: 'absolute',
                left: DATE_ON_RING.x + 16,
                top: DATE_ON_RING.y - 10,
                fontFamily: mono,
                fontSize: 17,
                letterSpacing: '0.16em',
                fontVariantNumeric: 'tabular-nums',
                color: colors.gold,
                whiteSpace: 'nowrap',
              }}
            >
              2026-08-22
            </div>
            {/* 三节点与标签 */}
            {nodes.map((n) => (
              <div key={n.label}>
                <div
                  style={{
                    position: 'absolute',
                    left: n.x - 6,
                    top: n.y - 6,
                    width: 12,
                    height: 12,
                    borderRadius: 6,
                    background: colors.accent,
                    boxShadow: `0 0 14px ${colors.accent}`,
                    opacity: n.appear,
                    transform: `scale(${0.7 + n.appear * 0.3})`,
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    left: n.x,
                    top: n.y + 14,
                    transform: 'translateX(-50%)',
                    fontFamily: mono,
                    fontSize: 17,
                    letterSpacing: '0.12em',
                    color: colors.paperMuted,
                    opacity: n.appear * 0.9,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {n.label}
                </div>
              </div>
            ))}
          </div>
          {/* 中心版本号 */}
          <div style={{ position: 'absolute', left: 0, right: 0, top: 408, textAlign: 'center' }}>
            <div style={{ ...kicker, fontFamily: mono, fontSize: 13, letterSpacing: '0.34em', color: colors.muted, fontVariantNumeric: 'tabular-nums' }}>
              2026-08-22 · RELEASE
            </div>
            <div
              style={{
                ...center,
                marginTop: 16,
                fontFamily: mono,
                fontSize: 62,
                fontWeight: 400,
                letterSpacing: '0.04em',
                fontVariantNumeric: 'tabular-nums',
                color: colors.paper,
              }}
            >
              v1.0.1
            </div>
            <div style={{ ...chain, marginTop: 18, fontFamily: mono, fontSize: 14, letterSpacing: '0.18em', color: colors.muted, opacity: Number(chain.opacity ?? 0) * 0.7 }}>
              构建 → 传输 → 上线
            </div>
          </div>
        </AbsoluteFill>
      </CameraRig>
      <PaperGrain opacity={0.05} />
      <Grade id="GR-01" />
      <Caption text="八月，发布脚本落地。" appearAt={26} />
    </AbsoluteFill>
  );
};

export default ShotStarOrbit;
