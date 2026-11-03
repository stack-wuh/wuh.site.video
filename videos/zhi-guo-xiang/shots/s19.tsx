/* S19 · 差一点：山垭雪径，脚印正在被新雪抹平；一片黑羽落下 210f */
import type { FC } from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { Scene } from '../components/SceneKit';
import { DustField } from '../components/DustField';
import { Caption } from '../components/Caption';

/** 雕羽：从右上斜着飘落，一边转一边落；落到脚印上停住。random 不用，纯插值，保证两遍渲染一致。 */
const Feather: FC = () => {
  const f = useCurrentFrame();
  const t = interpolate(f, [12, 168], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const x = interpolate(t, [0, 1], [1430, 1010]);
  const y = interpolate(t, [0, 1], [-90, 612]);
  const rot = interpolate(t, [0, 1], [-22, 148]);
  const sway = Math.sin(t * Math.PI * 2.6) * 30;
  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0 }}>
      <g transform={`translate(${x + sway} ${y}) rotate(${rot})`} opacity={0.94}>
        <path d="M0 -46 L0 46" stroke="#17130f" strokeWidth={1.6} strokeLinecap="round" />
        <path d="M0 -44 C 19 -24, 21 12, 0 44 C -21 12, -19 -24, 0 -44 Z" fill="#221c16" />
        {Array.from({ length: 10 }).map((_, i) => {
          const yy = -34 + i * 7.6;
          const w = 13 - Math.abs(i - 4.5) * 2.2;
          return <path key={i} d={`M0 ${yy} L ${w} ${yy - 6}`} stroke="#0d0a07" strokeWidth={0.7} opacity={0.55} />;
        })}
      </g>
    </svg>
  );
};

const S19: FC = () => (
  <Scene name="p-footprints" zoom={[1.0, 1.05]} driftY={[0, 8]} dim={0.03}>
    <DustField act={4} count={70} seedBase="s19-snow" />
    <Feather />
    <Caption text="有人说，他三天前来过。" start={16} end={194} tone="ink" />
  </Scene>
);

export default S19;
