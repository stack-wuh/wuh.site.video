import type { FC } from 'react';
import { AscendScene } from '../components/AscendScene';
import { Caption } from '../components/Caption';

/**
 * 镜 30 · 上山（local 0–239）· 诗第 4 行 · 一镜到底，不拆。
 * 画面 = 共用的 AscendScene（FG-04 标准上山背影）：固定远景、五步 40f/步、200–239 立定、
 * 门缝 1px→6px、一线 paper 光落阶 ≤6px、不扩散；空手，无伞无剑无包袱。
 * 同构约束：S31（4080–4320）以同一组件、同一 local 0–239 重放；本镜除字幕外不叠任何层
 * （无 ShotShell、无调色/尘粒/相机层——装配层统一套 ShotShell），第 239 帧像素差分为 0（TR-11）。
 */
const S30: FC = () => (
  <>
    <AscendScene />
    <Caption text="大家都说我因为爱着杨过大侠，才在峨嵋山上出了家，" start={20} end={220} poem />
  </>
);

export default S30;
