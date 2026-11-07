/* s02 · 但它的十一个版本，你没见过。（198f · 6.6s，Act 1）
 *
 * 七版同位快闪：首尾各 1f 纸底垫（colors.paper），中间 196f = reel-m1…m7 各 28f（MO-BEAT-FLASH）
 * 硬切串联（各段已取各版开场 2s 处，1+7×28+1=198）。右下角计数角标 01→07 逐态翻动：
 * 数字按 MO-COUNTER-DIGIT-POP 缩放弹跳（0.92→1.0，8f，MO-EASE-BACK 过冲），纸面墨字风格。
 * 转场：入「切」/ 出「切」。字幕窗 [12,186]。
 */
import type { CSSProperties, FC } from 'react';
import { AbsoluteFill, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { Caption } from '../components/Caption';
import { CLAMP, MO_COUNTER, MO_EASE } from '../motion-tokens';

const TOTAL = 198;
const BEAT = 28; // 每版一拍（MO-BEAT-FLASH）
const PAD = 1; // 首尾各 1f 纸底垫
const REELS = ['m1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7'];
const VIDEO: CSSProperties = { width: '100%', height: '100%', objectFit: 'cover' };

const S02: FC = () => {
  const f = useCurrentFrame();
  /* 当前快闪态：f=0/197 落在纸底垫上，夹进首尾态 */
  const idx = Math.max(0, Math.min(REELS.length - 1, Math.floor((f - PAD) / BEAT)));
  const num = String(idx + 1).padStart(2, '0');
  /* 数字弹跳：本态落点（1+i×28）后 8f 内 0.92→1.0，MO-EASE-BACK 过冲 */
  const age = Math.max(0, f - (PAD + idx * BEAT));
  const pop = interpolate(age, [0, MO_COUNTER.digitPopFrames], [MO_COUNTER.digitPopFrom, 1], {
    ...CLAMP,
    easing: MO_EASE.back,
  });
  const badgeIn = interpolate(f, [0, 6], [0, 1], CLAMP);

  return (
    <AbsoluteFill style={{ background: colors.paper }}>
      {REELS.map((m, i) => (
        <Sequence key={m} from={PAD + i * BEAT} durationInFrames={BEAT}>
          <OffthreadVideo
            src={staticFile(`making-of-zhi-guo-xiang/segments/seg-evolution-reel-${m}-v2.mp4`)}
            startFrom={0}
            endAt={BEAT}
            style={VIDEO}
          />
        </Sequence>
      ))}
      {/* 计数角标：纸面墨字，右下角，随每拍翻动弹跳 */}
      <div style={{ position: 'absolute', right: 56, bottom: 52, opacity: badgeIn }}>
        <div
          style={{
            transform: `scale(${pop.toFixed(4)})`,
            transformOrigin: '100% 100%',
            background: colors.paper,
            color: colors.ink,
            borderRadius: 4,
            padding: '10px 20px 12px',
            fontFamily: fontFamilies.serif,
            fontSize: 40,
            lineHeight: 1,
            letterSpacing: 4,
            fontWeight: 700,
          }}
        >
          {num}
        </div>
      </div>
      <Caption text="但它的十一个版本，你没见过。" start={12} end={186} duration={TOTAL} inSide={0} outSide={0} />
    </AbsoluteFill>
  );
};

export default S02;
