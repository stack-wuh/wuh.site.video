/* S02 · 落日：天空、云、树后那轮太阳，整幅铺满 16:9，缓推 180f
 *
 * v12 分镜（用户 2026-11-07 改）：特·微距，极缓推。
 * 不再用真实照片：底图是**水墨化的落日** `photo-nianian-ink.jpg`（1920×1080，已经是 16:9 整幅），
 * 没有纸边、没有照片的厚度——它就是落日本身。
 *
 * 推近的锚点钉在树后那轮太阳（实测 44.5% / 86.1%）：太阳不动，画面从边缘往里收，
 * 读作镜头一路往那颗太阳里走。s02 推到 1.24，s03 从 1.24 接着推到 1.58（硬切处尺度接得上）。
 *
 * 代码只加两样：太阳的柔光（不改变落日的颜色，只把光往画面里带）与逆光里的浮尘。
 * 转场：入「切」，出「切」。
 */
import type { FC } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { PhotoPlate, INK_SUN } from '../components/e-photo';
import { WarmBloom } from '../components/e-firelight';
import { DustField } from '../components/DustField';

const TOTAL = 180;
/** 推近的终点 = s03 的起点（1.24） */
const ZOOM: [number, number] = [1.0, 1.24];

const S02: FC = () => {
  const f = useCurrentFrame();
  const t = f / (TOTAL - 1);

  return (
    <PhotoPlate t={t} zoom={ZOOM}>
      {/* 太阳的柔光：落日本身已经很亮，这里只把它的光晕往画面里带一点 */}
      <WarmBloom at={{ x: INK_SUN.x * 1920, y: INK_SUN.y * 1080 }} r={340} squash={0.72} opacity={0.1} period={110} breath={0.4} blur={54} />
      {/* 逆光里的浮尘：极慢、极小，读作空气里的尘而不是粒子特效 */}
      <DustField act={1} count={14} seedBase="s02-motes" wind={3} />
      {/* 极轻的角晕 */}
      <AbsoluteFill
        style={{
          background: 'radial-gradient(ellipse 88% 84% at 55% 62%, transparent 52%, rgba(43,38,32,0.18) 100%)',
          mixBlendMode: 'multiply',
          pointerEvents: 'none',
        }}
      />
    </PhotoPlate>
  );
};

export default S02;