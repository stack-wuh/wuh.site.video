/* S62 · Act 8 此刻 · 末镜 · 局部帧 [0,90) · 90f · 绝对 8170–8260
 *
 * 人物落款：光标在句末停住，纸面右下落定一行小字「吴尒红 · stack-wuh ·
 * a boy just ~」（write-fade 12–32）；名字处一枚极小的墨点落下——与开篇
 * 第一滴墨同形同位（母题闭合，40–52）；缓拉至全纸面（32–70）；
 * 末 20f 收黑（FN-51 fadeBlack：brightness→0 + 暗角收拢，墨点余光保留至 88）。
 * 转场：入「切」，出「切」（交家族片尾）。字幕同文同层（落款即字幕）。
 * 尾帧：全黑、墨点余光将熄。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES } from '../../../brand/motion';
import { FILM_COLORS, fadeBlack } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { DustField } from '../components/DustField';
import { Grade } from '../components/Grade';
import { PaperGrain } from '../components/PaperGrain';

const TOTAL = 90;
const FADE_AT = 70;

const S62: FC = () => {
  const frame = useCurrentFrame();
  const fade = fadeBlack(frame, FADE_AT, 20);
  const pull = interpolate(frame, [32, 70], [1.06, 1.0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const cam = { scale: pull, x: 0, y: 0, rot: 0 };
  const inkIn = interpolate(frame, [40, 52], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });

  return (
    <AbsoluteFill style={{ background: colors.paper, filter: `brightness(${fade.bright})` }}>
      <CameraRig cam={cam}>
        <AbsoluteFill>
          <DustField act={8} count={8} seedBase="s62" />

          {/* 落款行（同文同层：字幕即画面文字，zIndex 30） */}
          <div style={{ position: 'absolute', right: 300, bottom: 240, zIndex: 30, opacity: interpolate(frame, [12, 32], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>
            <span style={{ fontFamily: fontFamilies.serif, fontSize: 40, color: colors.ink, letterSpacing: '0.08em' }}>
              吴尒红
              <span style={{ fontFamily: fontFamilies.mono, fontSize: 30, color: colors.muted }}> · stack-wuh · a boy just ~</span>
            </span>
            {/* 名字处极小墨点（与开篇第一滴墨同形同位——母题闭合） */}
            <span
              style={{
                position: 'absolute',
                left: -34,
                top: -8,
                width: interpolate(inkIn, [0, 1], [4, 20]),
                height: interpolate(inkIn, [0, 1], [4, 20]),
                borderRadius: 10,
                background: colors.ink,
                opacity: inkIn * 0.92,
                boxShadow: `0 0 ${10 * inkIn}px ${3 * inkIn}px rgba(245,233,200,${0.3 * inkIn})`,
              }}
            />
          </div>

          {/* 暗角收拢（fadeBlack veil） */}
          <AbsoluteFill style={{ background: FILM_COLORS.nearBlack, opacity: fade.veil * 0.9, pointerEvents: 'none' }} />
          {/* 墨点余光（保留至 88，交家族片尾） */}
          {frame >= FADE_AT + 8 ? (
            <div
              style={{
                position: 'absolute',
                left: 'calc(100% - 300px)',
                bottom: 240,
                width: 20,
                height: 20,
                borderRadius: 10,
                background: colors.ink,
                opacity: interpolate(frame, [FADE_AT + 8, TOTAL - 2], [inkIn, 0.5], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
                boxShadow: `0 0 18px 6px rgba(245,233,200,0.4)`,
                zIndex: 40,
              }}
            />
          ) : null}
        </AbsoluteFill>
      </CameraRig>
      <PaperGrain opacity={0.05} />
      <Grade id="GR-08" />
    </AbsoluteFill>
  );
};

export default S62;
