/* 镜 34 · Act 5 灯亮 · 局部帧 [0,180) · 180f
   承接 S33 纸笺特写+空印位（TR-01）：引文逐行压进纸笺（FN-29 letterpress，每行贴拍）；
   末行落定 120f（全局 4380）朱红钤印 6f 落下（FN-09 + FN-10）、纸面轻震（FN-17）、
   印泥朱红晕开（PT-02）；压印后停 2 拍；CM-11 正俯 + CM-03 1% 级缓推；
   GR-02 纸面 + GR-03 朱红；尾帧钤印朱色晕开成红光（交接 S35：朱红余晖）。 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, random, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, FILM_COLORS, letterpress, paperShake, sealStamp, sealTilt } from '../motion-tokens';
import { Caption } from '../components/Caption';
import { DustField } from '../components/DustField';
import { Grade } from '../components/Grade';
import { PaperGrain } from '../components/PaperGrain';

const CLAMP = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const serif = fontFamilies.serif;
const mono = fontFamilies.mono;

const NOTE = { left: 430, top: 120, w: 1060, h: 800 };
const SEAL_SIZE = 110;
const SEAL_LEFT = NOTE.w - 76 - SEAL_SIZE;
const SEAL_TOP = NOTE.h - 76 - SEAL_SIZE;
const SEAL_CX = NOTE.left + SEAL_LEFT + SEAL_SIZE / 2;
const SEAL_CY = NOTE.top + SEAL_TOP + SEAL_SIZE / 2;

const LINES: Array<{ text: string; start: number; step: number; top: number }> = [
  { text: '……每周发布一篇博客，', start: 38, step: 2.2, top: 320 },
  { text: '无限进步，', start: 66, step: 2.2, top: 402 },
  { text: '开始重启计划~~', start: 94, step: 2.2, top: 484 },
];

const SPATTER = Array.from({ length: 6 }, (_, i) => {
  const seed = `s34-spat-${i}`;
  const ang = random(seed) * Math.PI * 2;
  const r = 72 + random(`${seed}-r`) * 70;
  return { key: seed, x: SEAL_CX + Math.cos(ang) * r, y: SEAL_CY + Math.sin(ang) * r * 0.8, size: 3 + random(`${seed}-s`) * 4 };
});

const ShotRestartQuote: FC = () => {
  const frame = useCurrentFrame();

  /* CM-11 微距正俯 + CM-03 1% 级缓推 */
  const cam = interpolate(frame, [0, 150, 180], [1.03, 1.045, 1.045], { ...CLAMP, easing: CURVES.cineEaseInOut });
  /* FN-17 钤印落定纸面轻震 */
  const shake = paperShake(frame, 122, 2.2, 10);
  /* FN-09 / FN-10 钤印 6f 落下 */
  const seal = sealStamp(frame, 120, 30, sealTilt('s34'));
  const sealDrop = interpolate(frame, [118, 122], [0, 1], { ...CLAMP, easing: CURVES.cineEaseIn });
  const bloom = interpolate(frame, [124, 138, 170], [0, 1, 0.5], { ...CLAMP, easing: CURVES.cineEaseOut });
  const ring = interpolate(frame, [124, 150], [0, 1], { ...CLAMP, easing: CURVES.cineEaseOut });
  const ringIn = interpolate(frame, [120, 124], [0, 1], CLAMP);
  const halo = interpolate(frame, [140, 180], [0, 1], { ...CLAMP, easing: CURVES.cineEaseInOut });
  const spatter = interpolate(frame, [124, 132, 172], [0, 0.55, 0], CLAMP);

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ backgroundColor: colors.bg }} />
      {/* S33 首屏余温：纸笺四周的暖光边缘 */}
      <AbsoluteFill style={{ backgroundImage: `linear-gradient(180deg, ${FILM_COLORS.lampAmber}, transparent 32%)`, mixBlendMode: 'screen', opacity: 0.05 }} />
      <AbsoluteFill style={{ transform: `scale(${cam})`, transformOrigin: 'center' }}>
        <div style={{ position: 'absolute', left: NOTE.left, top: NOTE.top, width: NOTE.w, height: NOTE.h }}>
          <div style={{ position: 'absolute', inset: 0, transform: 'rotate(-0.6deg)' }}>
            <div style={{ ...shake, position: 'absolute', inset: 0 }}>
              <div style={{ position: 'absolute', inset: 0, background: colors.paper, borderRadius: 6, border: `1px solid ${colors.hairline}`, boxShadow: `0 40px 110px ${colors.bg}` }} />
              <div style={{ position: 'absolute', inset: 0, borderRadius: 6, backgroundImage: `linear-gradient(180deg, ${FILM_COLORS.paperMist}, transparent 26%)`, mixBlendMode: 'screen', opacity: 0.55 }} />
              {/* 标题与角标（S33 已落定） */}
              <div style={{ position: 'absolute', left: 76, top: 84, fontFamily: serif, fontSize: 72, lineHeight: 1.2, letterSpacing: '0.04em', color: colors.ink, textShadow: `0 1px 0 ${colors.paperDeep}` }}>《重启计划》</div>
              <div style={{ position: 'absolute', left: 76, top: 196, width: 140, height: 2, background: colors.ink, opacity: 0.4 }} />
              <div style={{ position: 'absolute', top: 78, right: 76 }}>
                <span style={{ display: 'inline-block', fontFamily: mono, fontSize: 15, letterSpacing: '0.08em', color: colors.seal, border: `1px solid ${colors.seal}`, borderRadius: 3, padding: '4px 10px', transform: 'rotate(1.5deg)', fontVariantNumeric: 'tabular-nums' }}>2026-06-21</span>
              </div>
              {/* 纸笺横线 */}
              {Array.from({ length: 6 }, (_, i) => (
                <div key={`rule-${i}`} style={{ position: 'absolute', left: 76, right: 76, top: 300 + i * 66, height: 1, background: colors.paperMuted, opacity: 0.8 }} />
              ))}
              {/* 引文逐行压入（铅字） */}
              {LINES.map((line, li) => (
                <div key={li} style={{ position: 'absolute', left: 76, top: line.top, display: 'flex', whiteSpace: 'pre', fontFamily: serif, fontSize: 46, lineHeight: 1.7, letterSpacing: '0.03em', color: colors.ink }}>
                  {Array.from(line.text).map((ch, ci) => (
                    <span key={`${li}-${ci}`} style={{ ...letterpress(frame, line.start + ci * line.step, line.step), display: 'inline-block' }}>{ch}</span>
                  ))}
                </div>
              ))}
              {/* 页脚空印位（S33 预留） */}
              <div style={{ position: 'absolute', left: SEAL_LEFT, top: SEAL_TOP, width: SEAL_SIZE, height: SEAL_SIZE, border: `1px dashed ${colors.muted}`, borderRadius: 4, opacity: 0.55 }} />
              {/* 钤印：印泥晕开 + 印圈 + 印朱晕光 */}
              <div style={{ position: 'absolute', left: SEAL_LEFT + SEAL_SIZE / 2 - 90, top: SEAL_TOP + SEAL_SIZE / 2 - 90, width: 180, height: 180, borderRadius: '50%', background: `radial-gradient(circle, ${colors.seal} 0%, transparent 66%)`, filter: 'blur(4px)', opacity: 0.5 * bloom }} />
              <div style={{ position: 'absolute', left: SEAL_LEFT + SEAL_SIZE / 2 - 46, top: SEAL_TOP + SEAL_SIZE / 2 - 46, width: 92, height: 92, borderRadius: '50%', border: `2px solid ${colors.seal}`, opacity: 0.45 * (1 - ring) * ringIn, transform: `scale(${1 + ring * 1.8})` }} />
              <div style={{ position: 'absolute', left: SEAL_LEFT, top: SEAL_TOP, width: SEAL_SIZE, height: SEAL_SIZE, transform: `translateY(${(1 - sealDrop) * -34}px)` }}>
                <div style={{ ...seal, position: 'absolute', inset: 0 }}>
                  <div style={{ position: 'absolute', inset: 0, background: colors.seal, borderRadius: 4, boxSizing: 'border-box', padding: 7, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' }}>
                    {['重', '启', '计', '划'].map((c) => (
                      <span key={c} style={{ width: '50%', textAlign: 'center', fontFamily: serif, fontSize: 34, lineHeight: '42px', color: colors.paper }}>{c}</span>
                    ))}
                  </div>
                </div>
              </div>
              {SPATTER.map((s) => (
                <div key={s.key} style={{ position: 'absolute', left: s.x - NOTE.left - s.size / 2, top: s.y - NOTE.top - s.size / 2, width: s.size, height: s.size, borderRadius: '50%', background: colors.seal, opacity: spatter }} />
              ))}
            </div>
          </div>
        </div>
      </AbsoluteFill>
      {/* 尾帧：钤印朱色晕开成红光（局部径向 ≤40% 画幅） */}
      <div style={{ position: 'absolute', left: SEAL_CX - 330, top: SEAL_CY - 330, width: 660, height: 660, borderRadius: '50%', background: `radial-gradient(circle, ${colors.seal} 0%, transparent 64%)`, opacity: 0.38 * halo, mixBlendMode: 'screen', pointerEvents: 'none' }} />
      <DustField act={5} seedBase="s34" />
      <PaperGrain opacity={0.07} />
      <Grade id="GR-02" />
      <Grade id="GR-03" />
      <AbsoluteFill style={{ backgroundColor: colors.seal, mixBlendMode: 'soft-light', opacity: 0.12 * halo, pointerEvents: 'none' }} />
      <Caption text="『……每周发布一篇博客，无限进步，开始重启计划~~』" appearAt={30} bottom={26} />
    </AbsoluteFill>
  );
};

export default ShotRestartQuote;
