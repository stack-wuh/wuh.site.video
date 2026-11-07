/* S03 · 继续推近到树后那轮太阳 180f
 *
 * v12 分镜（用户 2026-11-07 改）：微距·推。底图是水墨落日 `photo-nianian-ink.jpg` 整幅铺满，
 * 没有纸边、没有照片厚度。s02 推到 1.24 停，本镜从 1.24 接着推到 1.58（硬切处尺度连得上），
 * 锚点仍是那颗太阳——观众感觉是镜头一路往太阳里走。
 *
 * 代码只加两样：
 *   ① 太阳的光晕随推近一点点涨（落日本身不动，光在纸上漫开）；
 *   ② 一道很淡的斜光从右上擦过画面（云被光刷亮的那一下）。
 * 推近到底等于 s04 的起点（1.58），s04 从那里开始被墨吃掉。
 * 转场：入「切」，出「切」。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { PhotoPlate, INK_SUN } from '../components/e-photo';
import { Caption } from '../components/Caption';
import { WarmBloom } from '../components/e-firelight';
import { DustField } from '../components/DustField';
import { CLAMP } from '../motion-tokens';

const TOTAL = 210;
/** 起点 = s02 的终点（1.24）；终点 = s04 的起点（1.58） */
const ZOOM: [number, number] = [1.24, 1.58];
const SUN = { x: INK_SUN.x * 1920, y: INK_SUN.y * 1080 };

const S03: FC = () => {
  const f = useCurrentFrame();
  const t = f / (TOTAL - 1);
  /* 光晕随推近涨一档；末尾 20f 收一点，为 s04 的墨洇留呼吸 */
  const halo = interpolate(f, [0, 120, TOTAL - 1], [0.1, 0.18, 0.14], CLAMP);

  return (
    <PhotoPlate t={t} zoom={ZOOM}>
      {/* ① 太阳的光晕 */}
      <WarmBloom at={SUN} r={430} squash={0.76} opacity={halo} period={96} breath={0.4} blur={64} />
      {/* ② 斜光：很淡地从右上擦过（云被刷亮的一下），不做全屏泛白 */}
      <AbsoluteFill
        style={{
          background: 'linear-gradient(118deg, transparent 34%, rgba(245,240,232,0.42) 50%, transparent 64%)',
          opacity: interpolate(f, [20, 70, 150], [0, 0.13, 0.2], CLAMP),
          mixBlendMode: 'screen',
          pointerEvents: 'none',
        }}
      />
      {/* 逆光浮尘 */}
      <DustField act={1} count={12} seedBase="s03-motes" wind={4} />
      <Caption cue="s03" tone="paper" />
    </PhotoPlate>
  );
};

export default S03;