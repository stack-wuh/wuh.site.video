/* s22 · 删掉的八秒，分给了别人的戏。（165f · 5.5s，Act 5）
 *
 * 删镜前后对切（MO-CUT-FLIP）：`seg-v11-needle-hand-v1`（删前，v11 原 S11）↔ `seg-v12-wanbeast-long-v1`
 * （删后，同一时间位换成万兽山庄扩段）——两段**同段位**（各自 local 0 起对齐），镜内硬切 2 次，
 * 间隔 MO_CMP.flipGap = 15f：v11 [0,90) → v12 闪现 15f [90,105) → 回 v11 [105,165)。
 * 跳切纪律：只在镜内硬切，不做跨镜图层（正片 v10 已证跨镜图层在逐镜渲链路里产 0 像素）。
 * 左上角角标「v11 / v12」MO_CMP.labelFade 淡入（6f）。
 * 字幕按 script.md 句21 / shots-manifest title：「删掉的八秒」（删的是 240f 整镜 = 8s；preprod shots-data 旧文案「四秒」已废弃）。
 * 交接态：入 cut（承接 s21 特写定格），出 cut（v11 直放态交 s23 帧数卡）。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, OffthreadVideo, staticFile, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CLAMP, MO_CMP } from '../motion-tokens';
import { Caption } from '../components/Caption';

const DURATION = 165;
/** 对切节拍：flip1 起 v12 闪现，flipGap（15f）后 flip2 回 v11 */
const FLIP_1 = 90;
const FLIP_2 = FLIP_1 + MO_CMP.flipGap;
/** 角标淡入（MO-CMP-LABEL：淡入 6f） */
const LABEL_AT = 8;

const S22: FC = () => {
  const frame = useCurrentFrame();
  const showV12 = frame >= FLIP_1 && frame < FLIP_2;
  const labelOpacity = interpolate(frame, [LABEL_AT, LABEL_AT + MO_CMP.labelFade], [0, 1], CLAMP);
  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      {showV12 ? (
        <OffthreadVideo
          src={staticFile('making-of-zhi-guo-xiang/segments/seg-v12-wanbeast-long-v1.mp4')}
          startFrom={0}
          endAt={DURATION}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        <OffthreadVideo
          src={staticFile('making-of-zhi-guo-xiang/segments/seg-v11-needle-hand-v1.mp4')}
          startFrom={0}
          endAt={DURATION}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      )}
      {/* 对比角标：左上角小字「v11 / v12」 */}
      <div
        style={{
          position: 'absolute',
          top: 36,
          left: 40,
          padding: '8px 18px',
          borderRadius: 6,
          background: colors.ink,
          color: colors.paper,
          fontFamily: fontFamilies.mono,
          fontSize: 22,
          letterSpacing: 3,
          opacity: labelOpacity * 0.88,
        }}
      >
        v11 / v12
      </div>
      <Caption text="删掉的八秒，分给了别人的戏。" start={12} end={153} duration={DURATION} inSide={0} outSide={0} />
    </AbsoluteFill>
  );
};

export default S22;
