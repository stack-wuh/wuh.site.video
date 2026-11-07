/* s20 · 最后一版做了个狠决定：删掉一整个镜头。（210f · 7.0s，Act 5 · 转折章起手）
 *
 * 素材镜直放：`seg-v11-needle-hand-v1`（M6 母带 82.0–90.0s，v11 原 S11 整镜 8s = 240f）
 * ——本镜取**前 210f**（startFrom 0 / endAt 210），末 30f 留在段里不播。
 * 入转场 ink（ShotShell 镜首 20f 墨洇），出 cut。
 * 素材镜纪律：不加滤镜不加推拉，保母带原貌（演化对比的真实性优先）。
 * 交接态：入镜首帧在墨下（ink 满遮罩起步），出镜尾帧 = 画面直放态（cut 硬切交 s21 同段特写）。
 */
import type { FC } from 'react';
import { AbsoluteFill, OffthreadVideo, staticFile } from 'remotion';
import { colors } from '../../../brand/tokens';
import { Caption } from '../components/Caption';

const DURATION = 210;

const S20: FC = () => (
  <AbsoluteFill style={{ background: colors.bg }}>
    <OffthreadVideo
      src={staticFile('making-of-zhi-guo-xiang/segments/seg-v11-needle-hand-v1.mp4')}
      startFrom={0}
      endAt={DURATION}
      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
    />
    <Caption
      text="最后一版做了个狠决定：删掉一整个镜头。"
      start={32}
      end={198}
      duration={DURATION}
      inSide={20}
      outSide={0}
    />
  </AbsoluteFill>
);

export default S20;
