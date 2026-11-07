/* e-photo —— 序里那张落日（A 组私有：s02 / s03 / s04）。
 *
 * 用户 2026-11-07 否掉了「他手里拿一张照片」的设计：序不要纸、不要照片实物，就是落日本身。
 * 所以这里用的是**水墨化的落日** `photo-nianian-ink.jpg`（1920×1080，已经是 16:9 整幅），
 * 不是之前那张真实照片 —— 没有纸边、没有照片的厚度、没有贴在纸上的四边。
 *
 * 推近的锚点钉在**树后那轮太阳**（实测 44.5% / 86.1%）：推近时太阳不动，画面从边缘往里收，
 * 读作「镜头一路往那颗太阳里走」，而不是缩放一张图。
 *
 * 确定性：只读传入的 t 与固定常量；无随机。
 */
import type { FC, ReactNode } from 'react';
import { AbsoluteFill, Img, interpolate, staticFile } from 'remotion';
import { CLAMP } from '../motion-tokens';

/** 树后那轮太阳在画幅上的位置（photo-nianian-ink 实测） */
export const INK_SUN = { x: 0.445, y: 0.861 } as const;
const DEFAULT_SRC = 'zhi-guo-xiang/scene/photo-nianian-ink.jpg';

export const PhotoPlate: FC<{
  /** 本镜进度 t（0–1） */
  t: number;
  zoom: [number, number];
  /** 太阳锚点（默认 photo-nianian-ink 实测位置） */
  sun?: { x: number; y: number };
  children?: ReactNode;
}> = ({ t, zoom, sun = INK_SUN, children }) => {
  const scale = interpolate(t, [0, 1], zoom, CLAMP);
  const at = `${sun.x * 100}% ${sun.y * 100}%`;
  return (
    <AbsoluteFill style={{ overflow: 'hidden', background: 'transparent' }}>
      <AbsoluteFill style={{ transform: `scale(${scale})`, transformOrigin: at }}>
        <Img
          src={staticFile(DEFAULT_SRC)}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
        {/* 与片子同温：一层很轻的暖纸色，落日是水墨的，不另调色 */}
        <AbsoluteFill style={{ background: '#e9d9ae', mixBlendMode: 'soft-light', opacity: 0.1 }} />
      </AbsoluteFill>
      {children}
    </AbsoluteFill>
  );
};
