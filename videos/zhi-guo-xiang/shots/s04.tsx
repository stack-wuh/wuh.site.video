/* S04 · 墨从太阳边缘洇开，吃掉整幅落日，落进黄河渡口 180f
 *
 * v12 分镜（用户 2026-11-07 改）：微距·推 + 墨洇。序与「风陵渡」的接缝镜——落日在这里化成黄河。
 *
 * 三层叠，谁也不重画谁：
 *   ① 底下：`p-ferry` 黄河渡口（镜头一直在动，1.0 → 1.10）；
 *   ② 上面：水墨落日从太阳边缘被**挖空**（PhotoPlate 的 eaten 遮罩，0.05→0.64 走完），
 *      交界处有湿边；露出的正是底下的渡口——读作「落日化成了黄河落日」；
 *   ③ 边角墨：4 团墨从画面四角往中间洇，帮着把落日的**边**吃掉（不是剪掉，是吃掉）。
 *      墨团在中段最浓、末段退干净（不能让渡口的画被压黑）。
 * 渡口那一层自己有水纹（WaveField）与雾（MistFlow），所以落日吃完时画面已经是「活」的。
 *
 * 转场：入「切」，出「墨洇」（s05 的 inbound，20f ×2 归 ShotShell）。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { ShotScene } from '../components/e-scene';
import { PhotoPlate } from '../components/e-photo';
import { InkBloom } from '../components/InkBloom';
import { WaveField } from '../components/WaveField';
import { MistFlow } from '../components/b-mistflow';
import { CLAMP } from '../motion-tokens';

const TOTAL = 180;
/** 落日推近：1.58（接 s03 终点）→ 1.74，一路不停 */
const ZOOM: [number, number] = [1.58, 1.74];
/** 墨洇吃掉落日的区间（t 的 0–1） */
const EAT: [number, number] = [0.05, 0.64];
/** 四角墨团的位置（1920×1080） */
const BLOBS = [
  { x: 150, y: 120, r: 300 },
  { x: 1800, y: 170, r: 280 },
  { x: 210, y: 980, r: 280 },
  { x: 1770, y: 940, r: 300 },
] as const;

const S04: FC = () => {
  const f = useCurrentFrame();
  const t = f / (TOTAL - 1);
  /* 边角墨的浓淡：0.10 起，0.42 最浓，0.66 退干净 */
  const blot = interpolate(t, [0.1, 0.42, 0.66], [0, 1, 0], CLAMP);
  /* 渡口起雾：落日被吃掉的同时，河上的雾先漫上来（先有雾、后有岸） */
  const mist = interpolate(t, [0.3, 0.8], [0.2, 1], CLAMP);

  return (
    <AbsoluteFill>
      {/* ① 底下：黄河渡口（镜头继续向前） */}
      <ShotScene name="p-ferry" total={TOTAL} frame={f} zoom={[1.0, 1.1]} warm={0.1}>
        <WaveField seed="s04-river" band={[0.55, 0.8]} amp={4} speed={0.1} opacity={0.24} rows={8} />
        <MistFlow seed="s04-mist" intensity={mist} period={220} count={4} />
      </ShotScene>

      {/* ② 落日：从太阳边缘被墨挖空 */}
      <PhotoPlate t={t} zoom={ZOOM} eaten={EAT} />

      {/* ③ 四角墨：把落日的边吃掉（墨从画面外侧往里长，不是从中间缩） */}
      {blot > 0.001
        ? BLOBS.map((b) => (
            <InkBloom
              key={`${b.x}-${b.y}`}
              progress={0.3 + 0.9 * blot}
              at={{ x: b.x, y: b.y, r: b.r }}
              color="#241f1a"
              opacity={0.42 * blot}
              blur={12}
            />
          ))
        : null}
    </AbsoluteFill>
  );
};

export default S04;