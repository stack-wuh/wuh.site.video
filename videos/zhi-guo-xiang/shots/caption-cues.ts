/* 临时置空（v12 制作期）：字幕改为「跟每句旁白走」，等 `vo-pack/` 的实测音频回来，
 * 由新的行级生成器（m01…/f01…）重建本文件。旧的按镜 id 的条目一律不渲染，避免 v11 文案误上屏。 */
export type CaptionCue = { text: string; start: number; end: number };

export const CAPTION_CUES: Record<string, CaptionCue> = {};
