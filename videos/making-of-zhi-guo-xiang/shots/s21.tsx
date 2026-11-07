/* s21 · 线描的手掌，和水墨不是一个族。（150f · 5.0s，Act 5）
 *
 * 素材镜特写：同段 `seg-v11-needle-hand-v1`（M6 母带 82.0–90.0s 整镜 240f）取**异窗** [54, 204)
 * ——与 s20 的前 210f 窗错开，特写落在整镜中后段的手掌戏上。
 * 整段急推特写：scale 1 → 1.6，MO_EASE.out（急推后定住：54f 推完即钳住，余 96f 特写定格）。
 * transform-origin 对准画面中心偏手掌处（手镜构图手掌居中略偏下 → 取 52% 46%；段帧核验后只需调这一个值）。
 * 素材镜纪律：不调色不加滤镜，唯本镜按分镜表做「急推特写」运镜（覆盖矩阵 s20 行：MO-EASE-OUT 急推 · 特写定住）。
 * 交接态：入 cut（承接 s20 尾帧同段画面），出 cut（画面停在 1.6× 特写态交 s22 对切）。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, OffthreadVideo, staticFile, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { CLAMP, MO_EASE } from '../motion-tokens';
import { Caption } from '../components/Caption';

const DURATION = 150;
/** 急推窗：前 54f 推完（MO_EASE.out 前快后极慢，观感即「猛一推、定住」），其余 96f 特写定格 */
const PUSH_END = 54;
/** 段内异窗：与 s20（0–210）错开 */
const SEG_FROM = 54;
const SEG_TO = SEG_FROM + DURATION;

const S21: FC = () => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, PUSH_END], [1, 1.6], { ...CLAMP, easing: MO_EASE.out });
  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <AbsoluteFill style={{ transform: `scale(${scale.toFixed(4)})`, transformOrigin: '52% 46%' }}>
        <OffthreadVideo
          src={staticFile('making-of-zhi-guo-xiang/segments/seg-v11-needle-hand-v1.mp4')}
          startFrom={SEG_FROM}
          endAt={SEG_TO}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </AbsoluteFill>
      <Caption text="线描的手掌，和水墨不是一个族。" start={12} end={138} duration={DURATION} inSide={0} outSide={0} />
    </AbsoluteFill>
  );
};

export default S21;
