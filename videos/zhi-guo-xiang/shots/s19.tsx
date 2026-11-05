/* S19 · 差一点：山垭雪径，脚印正在被新雪抹平；远处一个米粒大的人影，一片雕羽落在他走过的最后一个脚印上 */
import type { FC } from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { Scene } from '../components/SceneKit';
import { DustField } from '../components/DustField';
import { Caption } from '../components/Caption';

/** 远处的人影：脚印的尽头已在山垭口上（底图实测 x≈1185 / 脊线 y≈455），
 *  身高只给 16px——观众要和他一样「看不清是谁」，杨过永远不给脸。 */
const DistantFigure: FC = () => {
  const f = useCurrentFrame();
  const o = interpolate(f, [8, 52], [0, 0.72], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0 }}>
      <g transform="translate(1185 455)" opacity={o}>
        <path d="M0 0 L0 -11" stroke="#221c16" strokeWidth={1.6} strokeLinecap="round" />
        <circle cx={0} cy={-13.4} r={1.7} fill="#221c16" />
        <path d="M0 -9 L-2.6 -1" stroke="#221c16" strokeWidth={1} strokeLinecap="round" opacity={0.8} />
        <path d="M0 -9 L2.4 -2" stroke="#221c16" strokeWidth={1} strokeLinecap="round" opacity={0.8} />
      </g>
    </svg>
  );
};

/** 雕羽：从右上斜着飘落，一边转一边落，落在他走过的最后一个脚印上（底图实测 x≈1169 / y≈543）。
 *  旧版羽身 92px、opacity 0.94，在雪径上读成一个洞；缩到三分之一并让落点踩脚印。 */
const Feather: FC = () => {
  const f = useCurrentFrame();
  const t = interpolate(f, [12, 168], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const x = interpolate(t, [0, 1], [1430, 1163]);
  const y = interpolate(t, [0, 1], [-60, 543]);
  const rot = interpolate(t, [0, 1], [-22, 148]);
  const sway = Math.sin(t * Math.PI * 2.6) * 22;
  const o = interpolate(t, [0, 0.9, 1], [0.7, 0.7, 0.5]);
  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0 }}>
      <g transform={`translate(${x + sway} ${y}) rotate(${rot})`} opacity={o}>
        <path d="M0 -15 L0 15" stroke="#17130f" strokeWidth={1} strokeLinecap="round" />
        <path d="M0 -14 C 6 -8, 7 4, 0 14 C -7 4, -6 -8, 0 -14 Z" fill="#221c16" />
        {Array.from({ length: 5 }).map((_, i) => {
          const yy = -11 + i * 5.2;
          const w = 4 - Math.abs(i - 2) * 0.9;
          return <path key={i} d={`M0 ${yy} L ${w} ${yy - 2}`} stroke="#0d0a07" strokeWidth={0.5} opacity={0.5} />;
        })}
      </g>
    </svg>
  );
};

const S19: FC = () => (
  <Scene name="p-footprints" zoom={[1.0, 1.05]} driftY={[0, 8]} dim={0.03}>
    <DustField act={4} count={70} seedBase="s19-snow" />
    <DistantFigure />
    <Feather />
    <Caption text="有人说，他三天前来过。" start={16} end={194} tone="ink" />
  </Scene>
);

export default S19;
