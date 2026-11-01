/* 镜 52 · Act 6 像极了 · 局部帧 [0,160) · 160f（正片末镜，末帧 7199）
   叠印不动：取 S51 尾帧（GOLD_TAIL）冻结；第 6 行落在两片金之间，压在中下部、避开最亮处；
   末字落在 7199，最后一帧仍是完整的叠印，不黑；7200 起交 FilmShell 片尾。
   只有字的落下与极轻的呼吸（FN-05）；GR-05；PT-01 纸纹由 ShotShell 承担。 */
import type { FC } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { FN } from '../motion-tokens';
import { Caption } from '../components/Caption';
import { GOLD_TAIL, GoldSuperimpose } from './s51';

const TEXT = '像极了十六岁那年的烟花。';
const CAPTION_END = 159;

const S52: FC = () => {
  const frame = useCurrentFrame();
  // 呼吸只在 1.0 以上发生：首帧与 S51 尾帧同尺寸，且缩放不回落到画框外
  const breathe = Math.max(1, FN.paperBreathe(frame, 0.4));
  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <AbsoluteFill style={{ transform: `scale(${breathe})`, transformOrigin: 'center' }}>
        <GoldSuperimpose f={GOLD_TAIL} />
      </AbsoluteFill>
      <Caption text={TEXT} start={0} end={CAPTION_END} poem bottom={210} tone="ink" fadeOut={false} />
    </AbsoluteFill>
  );
};

export default S52;
