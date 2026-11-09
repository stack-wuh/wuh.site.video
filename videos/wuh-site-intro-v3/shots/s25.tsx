/* S25 · Act 5 灯亮 · 局部帧 [0,150) · 150f · 绝对 3708–3858
 *
 * 春雨·提交变密：纸面由暖转青（GR-02+rainCool ramp 0–22）；★DAT-08 DOT-CASCADE
 * density——三月 71 点先落（12–62，细点 PT-01）洇成浅苔痕（62–72），
 * 五月 151 点更密（72–122）落成深苔痕；71/151 以极小等宽字落位即现
 * （112/132，密度编码不滚总数）；低机位先仰后下移 + 雨势加大后拉。
 * 转场：入「飞白」（10f，火星余光扫入春雨），出「切」。
 * 字幕安全窗：start≥22、end≤138。
 * 尾帧：雨歇双苔痕静置、纸面湿润。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { random } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, writeFade } from '../../../brand/motion';
import { CameraRig } from '../components/CameraRig';
import { Caption } from '../components/Caption';
import { DustField } from '../components/DustField';
import { Grade } from '../components/Grade';
import { PaperGrain } from '../components/PaperGrain';

const TOTAL = 150;

/** 密度编码墨点雨：一簇苔痕（中心/半径/点数/落点窗） */
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
            background: colors.ink,
            opacity: interpolate(frame, [land, land + 3, land + 12], [0, 0.75, 0.3 + deep * 0.3], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          }}
        />
      );
    })}
  </>
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
    <AbsoluteFill style={{ background: colors.bg }}>
      <CameraRig cam={cam}>
        <AbsoluteFill>
          <DustField act={5} count={30} seedBase="s25" />

          {/* 三月 71 点（12–62）→ 浅苔痕 */}
          <MossCluster cx={620} cy={560} count={71} t0={12} t1={62} frame={frame} seed="s25-mar" deep={0.3} />
          {/* 五月 151 点（72–122）→ 深苔痕 */}
          <MossCluster cx={1300} cy={600} count={151} t0={72} t1={122} frame={frame} seed="s25-may" deep={1} />

          {/* 71 / 151 极小等宽字（落位即现，标识不滚） */}
          <div style={{ position: 'absolute', left: 590, top: 548, ...writeFade(frame, 112) }}>
            <span style={{ fontFamily: fontFamilies.mono, fontSize: 18, color: colors.muted, fontVariantNumeric: 'tabular-nums' }}>71</span>
          </div>
          <div style={{ position: 'absolute', left: 1272, top: 588, ...writeFade(frame, 132) }}>
            <span style={{ fontFamily: fontFamilies.mono, fontSize: 18, color: colors.muted, fontVariantNumeric: 'tabular-nums' }}>151</span>
          </div>

          {/* 纸面湿润（雨歇：3830–3858 → 局部 122–150，低光泽层） */}
          <AbsoluteFill style={{ background: `linear-gradient(180deg, transparent 60%, rgba(180,200,190,0.1))`, opacity: interpolate(frame, [122, TOTAL], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }), pointerEvents: 'none' }} />
        </AbsoluteFill>
      </CameraRig>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 300, backgroundImage: `linear-gradient(180deg, transparent, ${colors.bg})`, opacity: 0.22 }} />
      <PaperGrain opacity={0.07} />
      <Grade id="GR-02" />
      <Caption text="2026 年春天，提交变密；旧文一篇篇迁进新家。" appearAt={22} />
    </AbsoluteFill>
  );
};

export default S25;
