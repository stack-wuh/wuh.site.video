/* s01 · 这条片子，你可能看过。（102f · 3.4s，Act 1）
 *
 * 黑场起 → M8 风陵渡一闪即收回：`seg-v12-fengling-v1` 前 24f 做中段一闪（30–66f 窗内进出），
 *   0–29    黑场（colors.bg），字幕先行；
 *   30–53   一闪播放源帧 0–23：急推 scale 1.0→1.24（30–41，MO-EASE-OUT）→ 急收 1.24→1.02（41–53）；
 *   54–66   源帧 23 定格一帧（Freeze），scale 收到 1.0，末 4f 淡回黑场（62f 前保持满亮）；
 *   67–101  黑场收尾。
 * 角标无。转场：入「切」/ 出「切」。字幕窗 [12,90]。
 */
import type { CSSProperties, FC } from 'react';
import { AbsoluteFill, Freeze, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { Caption } from '../components/Caption';
import { CLAMP, MO_EASE } from '../motion-tokens';

const TOTAL = 102;
const FLASH_IN = 30;
const PLAY = 24; // 一闪源帧数（段前 24f）
const HOLD = 13; // 定格窗 54–66
const SEG = 'making-of-zhi-guo-xiang/segments/seg-v12-fengling-v1.mp4';
const VIDEO: CSSProperties = { width: '100%', height: '100%', objectFit: 'cover' };

const S01: FC = () => {
  const f = useCurrentFrame();
  /* 急推急收：一段三停（30→41 推满、41→53 收回大半），定格段再收平 */
  const push = interpolate(f, [FLASH_IN, FLASH_IN + 11, FLASH_IN + PLAY], [1.0, 1.24, 1.02], {
    ...CLAMP,
    easing: MO_EASE.out,
  });
  const settle = interpolate(f, [FLASH_IN + PLAY, FLASH_IN + PLAY + 2], [1.02, 1.0], CLAMP);
  const scale = f < FLASH_IN + PLAY ? push : settle;
  /* 定格末 4f 淡回黑场（FLASH_IN+PLAY+HOLD-4 = 63 起，此前满亮） */
  const fadeOut = interpolate(f, [FLASH_IN + PLAY + HOLD - 4, FLASH_IN + PLAY + HOLD - 1], [1, 0], CLAMP);

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      {/* 一闪：源帧 0–23 急推急收 */}
      <AbsoluteFill style={{ transform: `scale(${scale.toFixed(4)})` }}>
        <Sequence from={FLASH_IN} durationInFrames={PLAY}>
          <OffthreadVideo src={staticFile(SEG)} startFrom={0} endAt={PLAY} style={VIDEO} />
        </Sequence>
      </AbsoluteFill>
      {/* 定格一帧：源帧 23 冻结微收，淡回黑场 */}
      <AbsoluteFill
        style={{ transform: `scale(${settle.toFixed(4)})`, opacity: f >= FLASH_IN + PLAY ? fadeOut : 0 }}
      >
        <Sequence from={FLASH_IN + PLAY} durationInFrames={HOLD}>
          <Freeze frame={PLAY - 1}>
            <OffthreadVideo src={staticFile(SEG)} startFrom={0} endAt={PLAY} style={VIDEO} />
          </Freeze>
        </Sequence>
      </AbsoluteFill>
      <Caption text="这条片子，你可能看过。" start={12} end={90} duration={TOTAL} inSide={0} outSide={0} />
    </AbsoluteFill>
  );
};

export default S01;
