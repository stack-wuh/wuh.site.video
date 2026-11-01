import type { FC } from 'react';
import { AscendScene } from '../components/AscendScene';

/**
 * S31（5-1 重放，4080–4320，240f）——4-4 的逐帧重放，TR-11 / FG-04。
 *
 * 同构契约：与 S30 共用同一份 `<AscendScene />`、同一 local 帧 0–239
 * （本镜由 Sequence 从 4080 起播，useCurrentFrame 即 local 0–239），
 * 不叠加任何额外图层、不落任何字幕——「撤掉诗第 4 行」，画面一帧未改。
 * 验收：S30 / S31 第 239 帧像素差分为 0；尾帧＝门缝 6px、光切石阶、将暗未暗。
 *
 * 装配层（ZhiGuoXiang / routes）已统一套 ShotShell；本镜不再自包，
 * 否则纸纹会叠两层，与 S30 的像素比对失准。
 */
const S31: FC = () => <AscendScene />;

export default S31;
