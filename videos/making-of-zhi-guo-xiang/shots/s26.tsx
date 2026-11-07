/* s26 · 后来不画脸了，画剪影，反而像了。（240f · 8.0s，Act 5 · 对照卡 · 解法镜）
 *
 * 覆盖矩阵 s22d 行：MO-CMP-LABEL 淡入 · 左右分屏对置（左黑底剪影 + 反光点）· 反光点闪烁定格。
 * 左半（黑底 colors.bg）：colors.ink 单色人形侧影剪影（几何化直边 polygon，暗部主义——墨色贴着黑底
 * 若隐若现）；眼部两枚金色反光点（colors.gold，brand/tokens 自带暖金 token）按 64f 周期呼吸闪烁，
 * 116f 起定格满亮（相位对齐：呼吸值恰在 116f=1.0，无跳变）。右半（纸底 colors.paper）：墨字
 * 「剪影暗部主义」标签（MO_CMP.labelFade 6f 淡入）+ 三行小注 MO_CARD-RISE 递进。
 * 交接态：入 cut（承接 s25 证据板定格），出 dry（10f 飞白出，交 s27）。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CLAMP, MO_CARD, MO_CMP, MO_EASE } from '../motion-tokens';
import { Caption } from '../components/Caption';

const rgba = (hex: string, a: number): string => {
  const h = hex.replace('#', '');
  return `rgba(${parseInt(h.slice(0, 2), 16)}, ${parseInt(h.slice(2, 4), 16)}, ${parseInt(h.slice(4, 6), 16)}, ${a})`;
};

const DURATION = 240;
const DOTS_AT = 36; // 反光点亮入
const BREATHE_PERIOD = 64; // 呼吸周期（MO-BREATHE 30–90f 窗内）
const FREEZE_AT = 116; // 呼吸定格点（(116-36)/64 = 1.25 周期，相位峰值 sin=1 → 呼吸值 1.0，定格无跳变）

/** 几何化侧影（朝右）：直边 polygon，一笔剪出额-鼻-唇-颏与颈肩 */
const PROFILE =
  '180,1010 140,800 210,640 235,545 195,420 190,330 280,190 420,225 455,320 443,348 498,398 452,422 472,448 448,464 468,486 438,545 352,606 342,700 560,840 625,1010';

const rise = (frame: number, at: number) => {
  const p = interpolate(frame, [at, at + MO_CARD.riseFrames], [0, 1], { ...CLAMP, easing: MO_EASE.out });
  return { opacity: p, transform: `translateY(${((1 - p) * MO_CARD.riseShiftPx).toFixed(2)}px)` };
};

const NOTES = ['眼部分改代码反光点', '三次特写全走暗部', '不画脸，反而像'];

const S26: FC = () => {
  const frame = useCurrentFrame();
  const silhouetteIn = interpolate(frame, [0, 12], [0, 1], CLAMP);
  // 反光点：36f 弹入（MO-EASE-BACK）→ 呼吸闪烁 → 116f 起定格满亮
  const pop = interpolate(frame, [DOTS_AT, DOTS_AT + 6], [0, 1], { ...CLAMP, easing: MO_EASE.back });
  const breathe = 0.55 + 0.45 * Math.sin(((frame - DOTS_AT) / BREATHE_PERIOD) * Math.PI * 2);
  const dotOpacity = frame < DOTS_AT ? 0 : frame >= FREEZE_AT ? 1 : pop * breathe;
  const dotScale = frame < DOTS_AT ? 0 : pop;
  const labelIn = interpolate(frame, [16, 16 + MO_CMP.labelFade], [0, 1], CLAMP);

  const dot = (cx: number, cy: number, r: number, key: string) => (
    <circle
      key={key}
      cx={cx}
      cy={cy}
      r={(r * dotScale).toFixed(2)}
      fill={colors.gold}
      opacity={dotOpacity.toFixed(3)}
      style={{ filter: `drop-shadow(0 0 14px ${rgba(colors.gold, 0.75)})` }}
    />
  );

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      {/* 左半：黑底侧影 + 金色反光点 */}
      <AbsoluteFill style={{ width: '50%', background: colors.bg }}>
        <svg viewBox="0 0 960 1080" width="100%" height="100%" style={{ display: 'block' }} preserveAspectRatio="xMidYMid slice">
          <polygon points={PROFILE} fill={colors.ink} opacity={silhouetteIn.toFixed(3)} />
          {dot(388, 362, 9, 'eye-main')}
          {dot(410, 350, 5, 'eye-sec')}
        </svg>
      </AbsoluteFill>
      {/* 右半：纸底墨字标签 + 三行小注 */}
      <AbsoluteFill style={{ left: '50%', width: '50%', background: colors.paper }}>
        <div style={{ position: 'absolute', top: 330, left: 130, right: 60 }}>
          <div style={{ opacity: labelIn }}>
            <div style={{ fontFamily: fontFamilies.serif, fontSize: 58, fontWeight: 600, letterSpacing: 10, color: colors.ink }}>
              剪影暗部主义
            </div>
            <div style={{ width: 56, height: 3, marginTop: 26, background: colors.gold }} />
          </div>
          <div style={{ marginTop: 66, display: 'flex', flexDirection: 'column', rowGap: 34 }}>
            {NOTES.map((note, i) => (
              <div key={note} style={{ display: 'flex', alignItems: 'center', columnGap: 18, ...rise(frame, 44 + i * 18) }}>
                <div style={{ width: 20, height: 2, background: rgba(colors.ink, 0.55), flexShrink: 0 }} />
                <div style={{ fontFamily: fontFamilies.sans, fontSize: 29, letterSpacing: 3, color: rgba(colors.ink, 0.78) }}>{note}</div>
              </div>
            ))}
          </div>
        </div>
      </AbsoluteFill>
      <Caption text="后来不画脸了，画剪影，反而像了。" start={12} end={218} duration={DURATION} inSide={0} outSide={10} />
    </AbsoluteFill>
  );
};

export default S26;
