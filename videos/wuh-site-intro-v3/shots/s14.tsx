/* S14 · Act 3 第一行 · 局部帧 [0,210) · 210f · 绝对 2142–2352
 *
 * 继续写：纸页连续翻飞（侧面低机位·轻跟纸流），五句金句随页翻出、停住、被下一页
 * 带走（FN-40 句窗 38f 含翻页交叠：局部 18–208），每页角落小字标出处
 * 「#165《再读〈坐忘歌〉》· 2026-07-05」（画面文字：标注出处、不推进时间线）；
 * 看过的页越叠越高（错峰 +8px），末段纸页叠成小山、山顶页微光。
 * 转场：入「纸翻」（18f），出「切」。
 * 字幕安全窗：start≥30、end≤198。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, writeFade } from '../../../brand/motion';
import { pageFlip } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { Caption } from '../components/Caption';
import { DustField } from '../components/DustField';
import { Grade } from '../components/Grade';
import { PaperGrain } from '../components/PaperGrain';

const TOTAL = 210;
const WINDOW = 38; // 句窗（含翻页交叠）
const QUOTES = [
  '「人生一世不过 3 万多天，实在是太短了。」',
  '「欲望，是最恐怖的东西。」',
  '「日不过三餐，夜不过一宿，四季的衣服 8 套已经足够了。」',
  '「上班就好好上班……下班了就好好生活。」',
  '「玩累了就看看书、写写字。」',
];

const S14: FC = () => {
  const frame = useCurrentFrame();
  const cam = {
    scale: interpolate(frame, [0, TOTAL], [1.05, 1.02], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }),
    x: interpolate(frame, [0, TOTAL], [20, -30], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }),
    y: 0,
    rot: 0,
  };

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <CameraRig cam={cam}>
        <AbsoluteFill>
          <DustField act={3} count={20} seedBase="s14" />

          {/* 五句金句页：句窗 18 + i*38，翻出（0–8）→ 停住 → 被带走（30–38） */}
          {QUOTES.map((q, i) => {
            const t0 = 18 + i * WINDOW;
            const local = frame - t0;
            if (local < -4 || local > WINDOW + 6) return null;
            const pageIn = interpolate(local, [0, 8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
            const pageOut = interpolate(local, [WINDOW - 8, WINDOW], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseIn });
            const visible = pageIn > 0 && pageOut < 1;
            return (
              <div key={i} style={{ position: 'absolute', left: 380, top: 190, width: 1160, height: 560, opacity: visible ? 1 : 0 }}>
                {/* 纸页 */}
                <div style={{ position: 'absolute', inset: 0, ...pageFlip(frame, t0 + WINDOW - 8, 8, 'left'), borderRadius: 6, background: colors.paper, border: `1px solid ${colors.paperMuted}`, boxShadow: '0 16px 44px rgba(0,0,0,0.22)', transform: `${pageFlip(frame, t0 + WINDOW - 8, 8, 'left').transform} translateY(${(1 - pageIn) * -24}px)` }}>
                  <div style={{ position: 'absolute', left: 90, right: 90, top: 150 }}>
                    <div style={{ ...writeFade(local, 8, true), fontFamily: fontFamilies.serif, fontSize: 42, lineHeight: 1.75, color: colors.ink, opacity: writeFade(local, 8, true).opacity * (1 - pageOut) }}>{q}</div>
                    {/* 出处小字（画面文字：标注出处、不推进时间线） */}
                    <div style={{ position: 'absolute', right: 0, top: 170, fontFamily: fontFamilies.mono, fontSize: 15, color: colors.muted, opacity: 0.65 * (1 - pageOut) }}>#165《再读〈坐忘歌〉》· 2026-07-05</div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* 看过的页越叠越高（错峰 +8px → 纸山半成） */}
          {QUOTES.map((_, i) => {
            const t0 = 18 + i * WINDOW + WINDOW - 8;
            const shown = frame >= t0;
            if (!shown) return null;
            return (
              <div key={`stack-${i}`} style={{ position: 'absolute', left: 380 + i * 10, top: 190 + i * 22, width: 1160 - i * 24, height: 560 - i * 30, borderRadius: 6, background: colors.paperDeep, border: `1px solid ${colors.paperMuted}`, opacity: 0.9, transform: `rotate(${(i % 2 === 0 ? -1 : 1) * 0.7}deg)` }} />
            );
          })}
          {/* 山顶页微光 */}
          <AbsoluteFill style={{ background: colors.gold, mixBlendMode: 'soft-light', opacity: interpolate(frame, [190, TOTAL], [0, 0.1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }), pointerEvents: 'none' }} />
        </AbsoluteFill>
      </CameraRig>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 300, backgroundImage: `linear-gradient(180deg, transparent, ${colors.bg})`, opacity: 0.24 }} />
      <PaperGrain opacity={0.07} />
      <Grade id="GR-02" />
      <Caption text="他还是继续写。2023 年 30 篇，2024 年 59 篇。" appearAt={30} />
    </AbsoluteFill>
  );
};

export default S14;
