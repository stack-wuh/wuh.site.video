/* A 组（shots-a：S09–S12）私有小工具：单图裁切窗。
 * `<Scene>` 只能整图铺满；S09 需要把同一张底图里的某一块（p-sleeve 的「他 + 空袖」、
 * p-her-up 的「她」）单独裁出来、缩放到指定位置，再各自上滤镜（虚焦 / 压暗 / 镜像）。
 * 坐标一律用 1920×1080 画面基准像素；src 与 box 的宽高比必须一致（不一致会拉伸，这里不做 cover 兜底）。
 * 只被 A 组的镜头引用，不改动公共组件行为。 */
import type { CSSProperties, FC } from 'react';
import { Img, staticFile } from 'remotion';

const FRAME = { w: 1920, h: 1080 } as const;

export const CropImg: FC<{
  /** public/zhi-guo-xiang/scene/<name>.jpg */
  name: string;
  /** 源图取景框（1920×1080 基准） */
  src: { x: number; y: number; w: number; h: number };
  /** 落位框（1920×1080 基准） */
  box: { x: number; y: number; w: number; h: number };
  /** 水平镜像（S09 的她：原图朝左看，镜成朝右上） */
  flipX?: boolean;
  opacity?: number;
  /** 直接给 CSS filter：blur / brightness / saturate / contrast 组合（虚焦与压暗都走这里） */
  filter?: string;
  blend?: CSSProperties['mixBlendMode'];
  /** CSS mask（羽化裁切边：虚焦模糊在硬边框上会切出一条直线，用径向/线性渐变把它化进纸里） */
  extraMask?: string;
}> = ({ name, src, box, flipX = false, opacity = 1, filter, blend, extraMask }) => {
  const s = box.w / src.w;
  const left = flipX ? FRAME.w - box.x - box.w : box.x;
  return (
    <div
      style={{
        position: 'absolute',
        left,
        top: box.y,
        width: box.w,
        height: box.h,
        overflow: 'hidden',
        opacity,
        filter,
        mixBlendMode: blend,
        maskImage: extraMask,
        WebkitMaskImage: extraMask,
      }}
    >
      <div style={{ position: 'absolute', inset: 0, transform: flipX ? 'scaleX(-1)' : undefined }}>
        <Img
          src={staticFile(`zhi-guo-xiang/scene/${name}.jpg`)}
          style={{
            position: 'absolute',
            width: FRAME.w * s,
            height: FRAME.h * s,
            left: -src.x * s,
            top: -src.y * s,
            maxWidth: 'none',
          }}
        />
      </div>
    </div>
  );
};