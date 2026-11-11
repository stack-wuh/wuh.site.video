/* S25 · Act 5 灯亮 · 局部帧 [0,150) · 150f · 绝对 3708–3858
 *
 * V2 深空数据流重写（2026-11-11 品牌暖黑科技）：春迁数据雨——★DAT-08 DOT-CASCADE
 * density 窗口原样（三月 71 点 12–62、五月 151 点 72–122），琥珀数据点落进深空
 * 网格洇成两片「数据苔痕」（辉光苔斑 62–72 / 122–132）；71/151 极小等宽字落位即现
 * （112/132，密度编码不滚总数）；低机位先仰后下移（CameraRig 窗口原样：
 * scale 0–110–150 / y 0–100）；尾帧双苔痕静置 + 暖湿光带（122–150，替换旧「湿纸」）。
 * 转场：入「飞白」→ ShotShell 光晕呼吸，出「切」。字幕安全窗：start≥22、end≤138。
 * 尾帧：雨歇双数据苔痕静置（交接态：双苔痕，交 s26 迁入节拍）。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, random, useCurrentFrame } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { CURVES, writeFade } from '../../../brand/motion';
import { FILM_COLORS2 } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { Caption } from '../components/Caption';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';

const TOTAL = 150;

/** 密度编码数据雨：一簇苔痕（中心/半径/点数/落点窗）——点数与落点窗原样保留 */
const MossCluster: FC<{ cx: number; cy: number; count: number; t0: number; t1: number; frame: number; seed: string; deep: number }> = ({ cx, cy, count, t0, t1, frame, seed, deep }) => (
  <>
    {Array.from({ length: count }).map((_, i) => {
      const k = i / (count - 1);
      const land = t0 + k * (t1 - t0);
      if (frame < land) return null;
      const ang = random(`${seed}-a-${i}`) * Math.PI * 2;
      const dist = Math.sqrt(random(`${seed}-d-${i}`)) * 150;
      return (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: cx + Math.cos(ang) * dist - 2.5,
            top: cy + Math.sin(ang) * dist * 0.5 - 2.5,
            width: 5,
            height: 5,
            borderRadius: 2.5,
            background: FILM_COLORS2.data,
            boxShadow: `0 0 7px rgba(212,163,115,0.4)`,
            opacity: interpolate(frame, [land, land + 3, land + 12], [0, 0.8, 0.35 + deep * 0.3], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          }}
        />
      );
    })}
  </>
);

/** 数据苔痕：点落尽后的辉光苔斑（原「洇成苔痕」的 V2 版） */
const MossGlow: FC<{ cx: number; cy: number; rx: number; ry: number; frame: number; t0: number; t1: number; peak: number }> = ({ cx, cy, rx, ry, frame, t0, t1, peak }) => (
  <div
    style={{
      position: 'absolute',
      left: cx - rx,
      top: cy - ry,
      width: rx * 2,
      height: ry * 2,
      borderRadius: ry,
      background: `radial-gradient(ellipse, rgba(212,163,115,${peak}), rgba(212,163,115,0) 72%)`,
      opacity: interpolate(frame, [t0, t1], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
    }}
  />
);

const S25: FC = () => {
  const frame = useCurrentFrame();
  const cam = {
    scale: interpolate(frame, [0, 110, TOTAL], [1.14, 1.06, 1.03], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }),
    x: 0,
    y: interpolate(frame, [0, 100], [-60, 20], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }),
    rot: 0,
  };

  return (
    <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep }}>
      <DeepSpace seed="s25v2" stars={52} grid />
      <CameraRig cam={cam}>
        <AbsoluteFill>
          {/* 三月 71 点（12–62）→ 浅数据苔痕 */}
          <MossCluster cx={620} cy={560} count={71} t0={12} t1={62} frame={frame} seed="s25-mar" deep={0.3} />
          <MossGlow cx={620} cy={560} rx={190} ry={96} frame={frame} t0={62} t1={72} peak={0.14} />
          {/* 五月 151 点（72–122）→ 深数据苔痕 */}
          <MossCluster cx={1300} cy={600} count={151} t0={72} t1={122} frame={frame} seed="s25-may" deep={1} />
          <MossGlow cx={1300} cy={600} rx={230} ry={110} frame={frame} t0={122} t1={132} peak={0.22} />

          {/* 71 / 151 极小等宽字（落位即现，标识不滚） */}
          <div style={{ position: 'absolute', left: 590, top: 548, ...writeFade(frame, 112) }}>
            <span style={{ fontFamily: fontFamilies.mono, fontSize: 18, color: FILM_COLORS2.textMuted, fontVariantNumeric: 'tabular-nums' }}>71</span>
          </div>
          <div style={{ position: 'absolute', left: 1272, top: 588, ...writeFade(frame, 132) }}>
            <span style={{ fontFamily: fontFamilies.mono, fontSize: 18, color: FILM_COLORS2.textMuted, fontVariantNumeric: 'tabular-nums' }}>151</span>
          </div>

          {/* 雨歇暖湿光带（122–150：替换旧「纸面湿润」的暖黑版） */}
          <AbsoluteFill
            style={{
              background: `linear-gradient(180deg, transparent 62%, rgba(212,163,115,0.07))`,
              opacity: interpolate(frame, [122, TOTAL], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
              pointerEvents: 'none',
            }}
          />
        </AbsoluteFill>
      </CameraRig>
      <HudChrome label="wuh.site · COMMITS" readout="SPRING 2026" />
      <Grade2 id="GR2-05" />
      <Caption text="2026 年春天，提交变密；旧文一篇篇迁进新家。" appearAt={22} />
    </AbsoluteFill>
  );
};

export default S25;
