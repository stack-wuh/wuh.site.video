/* 镜 18 · Act 3 第一行 · 局部帧 [0,234) · 234f
   TR-03 承接纸页流；FN-42 五句金句随页翻出（20f 起，句间 34/30/27/24/21f，pageTurnDur 10）；
   PT-12 纸页 12 张做翻飞/堆叠（不建 89 节点）；FN-43 汇总页（局部 156–214f）落「89 篇」；
   224–234f 骤停留白（2342–2352 全局）；尾帧纸山 + 山顶页光；GR-04。 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, random, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, FILM_COLORS, glowPulse, numRoll, pageFlip, quoteTurn, sumPage } from '../motion-tokens';
import { Caption } from '../components/Caption';
import { DustField } from '../components/DustField';
import { PaperGrain } from '../components/PaperGrain';
import { Grade } from '../components/Grade';

const INTERVALS = [34, 30, 27, 24, 21] as const;
const START = 20;
const QUOTES = [
  '人生一世不过 3 万多天，实在是太短了。',
  '欲望，是最恐怖的东西。',
  '日不过三餐，夜不过一宿，四季的衣服 8 套已经足够了。',
  '上班就好好上班……下班了就好好生活。',
  '玩累了就看看书、写写字。',
] as const;

const SHEET_W = 520;
const SHEET_H = 340;

const SHEETS = Array.from({ length: 12 }).map((_, i) => {
  const rr = random(`s18-sheet-${i}`);
  const land = 66 + i * 10;
  const fx = 1180 + Math.sin(i * 1.9 + 0.7) * (200 - i * 10);
  const fy = 872 - i * 17;
  const frot = (rr - 0.5) * 10;
  const dx = 1560 + rr * 380 - fx;
  const dy = 120 + random(`s18-sheet-y-${i}`) * 480 - fy;
  const drot = 26 + rr * 16 - frot;
  return { enter: land - 46 - (i % 3) * 6, land, fx, fy, frot, dx, dy, drot };
});

const ShotQuoteTurn: FC = () => {
  const frame = useCurrentFrame();
  const tf = Math.min(frame, 224);
  const camX = Math.sin(tf / 47) * 10;
  const camY = Math.sin(tf / 61 + 1.2) * 6 + interpolate(tf, [150, 200], [0, -26], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const sum = sumPage(frame, 156, 58);
  const big = Math.round(numRoll(frame, 158, 36, 9, 89));
  const summit = interpolate(frame, [156, 178], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  const glow = 0.22 * summit * glowPulse(tf, 0.6).opacity;
  const capIn = interpolate(frame, [186, 202], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, perspective: 1600 }}>
        <div style={{ position: 'absolute', inset: -60, transform: `translate(${camX}px, ${camY}px) rotateX(6deg) scale(1.04)`, transformOrigin: '50% 45%' }}>
          {/* 案面与纸光 */}
          <div style={{ position: 'absolute', left: -100, top: -100, width: 2120, height: 1280, background: colors.bgLift }} />
          <div style={{ position: 'absolute', left: 320, top: 430, width: 1560, height: 760, borderRadius: '50%', background: colors.paper, filter: 'blur(110px)', opacity: 0.05 }} />

          {/* PT-12 纸页流：12 张代表页翻飞后堆成小山 */}
          {SHEETS.map((s, i) => {
            const p = interpolate(frame, [s.enter, s.land], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
            const appear = interpolate(frame, [s.enter, s.enter + 8], [0, 0.96], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
            return (
              <div
                key={`sheet-${i}`}
                style={{
                  position: 'absolute',
                  left: s.fx - SHEET_W / 2,
                  top: s.fy - SHEET_H / 2,
                  width: SHEET_W,
                  height: SHEET_H,
                  background: [FILM_COLORS.blankPaper, FILM_COLORS.paperMist, FILM_COLORS.paperDeep][i % 3],
                  boxShadow: `0 22px 50px ${colors.bg}`,
                  opacity: appear,
                  transform: `translate(${s.dx * (1 - p)}px, ${s.dy * (1 - p)}px) rotate(${s.frot + s.drot * (1 - p)}deg) scale(${1 + (1 - p) * 0.06})`,
                  zIndex: 10 + i,
                }}
              >
                <div style={{ position: 'absolute', left: 36, top: 44, width: 300, height: 12, borderRadius: 3, background: FILM_COLORS.greyMist, opacity: 0.24 }} />
                <div style={{ position: 'absolute', left: 36, top: 78, width: 380, height: 12, borderRadius: 3, background: FILM_COLORS.greyMist, opacity: 0.2 }} />
                <div style={{ position: 'absolute', left: 36, top: 112, width: 260, height: 12, borderRadius: 3, background: FILM_COLORS.greyMist, opacity: 0.18 }} />
                <div style={{ position: 'absolute', left: 36, top: 146, width: 340, height: 12, borderRadius: 3, background: FILM_COLORS.greyMist, opacity: 0.16 }} />
              </div>
            );
          })}

          {/* TR-03 承接：s17 的暖句纸页掀角后翻走 */}
          <div style={{ position: 'absolute', left: 140, top: 250, width: 940, height: 460, background: FILM_COLORS.blankPaper, boxShadow: `0 30px 80px ${colors.bg}`, zIndex: 32, ...pageFlip(frame, 0, 16, 'left') }}>
            <div style={{ position: 'absolute', left: 80, right: 80, top: 130, fontFamily: fontFamilies.serif, fontSize: 44, lineHeight: 1.7, letterSpacing: '0.05em', color: colors.ink }}>
              不要停步不前，<br />每一天都要做出一点改变。
            </div>
          </div>

          {/* FN-42 五句金句随页翻出、停住、被带走 */}
          {QUOTES.map((q, i) => {
            const qt = quoteTurn(frame, i, INTERVALS, START, 10);
            const base = (random(`s18-card-${i}`) - 0.5) * 3;
            return (
              <div key={`quote-${i}`} style={{ position: 'absolute', left: 140, top: 250, width: 940, height: 460, transform: `rotate(${base}deg)`, zIndex: 30 }}>
                <div style={{ position: 'absolute', inset: 0, background: FILM_COLORS.blankPaper, boxShadow: `0 30px 80px ${colors.bg}`, ...qt.page }}>
                  <div style={{ position: 'absolute', left: 80, top: 58, width: 64, height: 3, background: colors.seal, opacity: 0.45 }} />
                  <div style={{ position: 'absolute', left: 80, right: 80, top: 130, fontFamily: fontFamilies.serif, fontSize: 50, lineHeight: 1.7, letterSpacing: '0.05em', color: colors.ink, fontVariantNumeric: 'tabular-nums', ...qt.text }}>{q}</div>
                  {/* 出处与发布日期：标注来源、不推进时间线 */}
                  <div style={{ position: 'absolute', left: 80, bottom: 46, fontFamily: fontFamilies.mono, fontSize: 17, letterSpacing: '0.1em', color: colors.muted, fontVariantNumeric: 'tabular-nums', ...qt.text }}>
                    #165《再读〈坐忘歌〉》· 2026-07-05
                  </div>
                </div>
              </div>
            );
          })}

          {/* 山顶页光 */}
          <div style={{ position: 'absolute', left: 880, top: 196, width: 600, height: 220, borderRadius: '50%', background: colors.gold, filter: 'blur(64px)', opacity: glow, zIndex: 39 }} />

          {/* FN-43 汇总页：大数 89 篇 + 分解小字 */}
          <div style={{ position: 'absolute', left: 790, top: 250, width: 780, height: 440, zIndex: 40, ...sum.page }}>
            <div style={{ position: 'absolute', inset: 0, background: FILM_COLORS.blankPaper, boxShadow: `0 30px 80px ${colors.bg}` }} />
            <div style={{ position: 'absolute', left: 70, top: 76, fontFamily: fontFamilies.serif, fontSize: 168, lineHeight: 1, color: colors.ink, fontVariantNumeric: 'tabular-nums', ...sum.big }}>
              {big}<span style={{ fontSize: 64, marginLeft: 10 }}>篇</span>
            </div>
            <div style={{ position: 'absolute', left: 74, top: 306, width: 420, height: 1, background: FILM_COLORS.wireGrey, opacity: 0.5 }} />
            <div style={{ position: 'absolute', left: 74, top: 330, fontFamily: fontFamilies.mono, fontSize: 23, letterSpacing: '0.14em', color: colors.muted, fontVariantNumeric: 'tabular-nums', ...sum.small }}>2023 · 30｜2024 · 59</div>
          </div>
        </div>
      </div>
      <DustField act={3} seedBase="s18" />
      <PaperGrain opacity={0.05} />
      <Grade id="GR-04" />
      {/* 字幕底衬：纸山脚下压一层暗坡，保证字幕可读 */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 250, backgroundImage: `linear-gradient(0deg, ${colors.bg}, transparent)`, opacity: 0.6 * capIn }} />
      <Caption text="他还是继续写。2023 年 30 篇，2024 年 59 篇。" appearAt={186} />
    </AbsoluteFill>
  );
};

export default ShotQuoteTurn;
