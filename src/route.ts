import type { FC } from 'react';

/**
 * 视频单元路由声明：每支视频/套件在自己的 routes.ts 里声明，RemotionRoot 汇总注册。
 * durationInFrames 必须等于成片总帧数；接入 FilmShell 的视频用 totalFilmFrames() 计算（INV-1）。
 */
export type VideoRoute = {
  id: string;
  component: FC;
  durationInFrames: number;
};
