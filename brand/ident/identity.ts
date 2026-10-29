/** 家族片头片尾的帧常量与时长公式（90 BPM @30fps） */
export const INTRO = 120; // 4s · 六拍
export const OUTRO = 180; // 6s · 九拍

/** 每支视频的片头片尾文案槽位；视觉与节奏固定，只有文案随片变化 */
export type FilmMeta = {
  title: string;
  subtitle?: string;
  episode?: string;
  credits?: string[];
};

/** 合成总时长 = 片头 + 正片 + 片尾；routes.ts 与 FilmShell 共用此公式（INV-1） */
export const totalFilmFrames = (contentFrames: number): number => INTRO + contentFrames + OUTRO;
