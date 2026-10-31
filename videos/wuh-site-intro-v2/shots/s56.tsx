/* 镜 56 · Act 8 此刻 · 局部帧 [0,132) · 132f
   总结纸页翻起、回到开篇的纸面：打字机标语逐字打出
   「写作是抵抗遗忘的方式，代码是构建世界的语言。」（FN-03 typeCharsAt，5f/字，10–120f），
   笔尖 28px 径向微光（FN-22）跟随，每字溅 2–3 颗 3px 墨点（PT-04，seed=s56-speck-c-i）；
   末字落定后 100→104% 缓推（CM-03）；与 S2 题记同一张纸；GR-02。 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, random, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, penGlow, typeCharsAt } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { DustField } from '../components/DustField';
import { PaperGrain } from '../components/PaperGrain';
import { Grade } from '../components/Grade';
import { Caption } from '../components/Caption';

const CLAMP = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const TEXT1 = '写作是抵抗遗忘的方式，';
const TEXT2 = '代码是构建世界的语言。';
const LINE1_Y = 380;
const LINE2_Y = 523;
const CHAR_W = 84;
const X0 = 498;
const START = 10;
const FPC = 5;
const TOTAL = TEXT1.length + TEXT2.length;

const serif = fontFamilies.serif;

/* PT-04 打字机溅墨：每字 2–3 颗 3px，初速向上外侧 + 微重力，life 18f */
const SPECKS = Array.from({ length: TOTAL }).flatMap((_, c) => {
  const count = 2 + (random(`s56-speck-${c}-n`) > 0.5 ? 1 : 0);
  return Array.from({ length: count }).map((__, s) => {
    const seed = `s56-speck-${c}-${s}`;
    return {
      c,
      seed,
      vx: (random(`${seed}-vx`) - 0.5) * 34,
      vy: -(16 + random(`${seed}-vy`) * 22),
      x: X0 + (c % 11) * CHAR_W + 42,
      y: (c < 11 ? LINE1_Y : LINE2_Y) + 24,
    };
  });
});

const ShotTypewriter: FC = () => {
  const frame = useCurrentFrame();
  const typed = typeCharsAt(frame, TOTAL, START, FPC);

  /* 笔尖位置：字格中心（逐字右移，跨行折返） */
  const t = Math.min(TOTAL, typed);
  const row = t < TEXT1.length ? 0 : 1;
  const col = row === 0 ? t : t - TEXT1.length;
  const penX = X0 + col * CHAR_W;
  const penY = (row === 0 ? LINE1_Y : LINE2_Y) + 71;
  const glowAmp = frame < 118 ? 1 : interpolate(frame, [118, 132], [0.9, 0.4], CLAMP);
  const pg = penGlow(frame, penX, penY);
  /* 末字落定后缓推 104%（CM-03） */
  const push = interpolate(frame, [120, 132], [1, 1.04], { ...CLAMP, easing: CURVES.cineEaseOut });
  const follow = -(penX - 960) * 0.045;

  return (
    <AbsoluteFill style={{ background: colors.paper }}>
      <CameraRig cam={{ scale: push, x: follow, y: 0, rot: 0 }}>
        <AbsoluteFill>
          <DustField act={8} seedBase="s56" />
          <div style={{ position: 'absolute', left: 0, right: 0, top: LINE1_Y, textAlign: 'center', fontFamily: serif, fontSize: 84, lineHeight: '143px', color: colors.ink, whiteSpace: 'pre' }}>
            {Array.from(TEXT1).map((ch, i) => (
              <span key={i} style={{ opacity: i < typed ? 1 : 0 }}>{ch}</span>
            ))}
          </div>
          <div style={{ position: 'absolute', left: 0, right: 0, top: LINE2_Y, textAlign: 'center', fontFamily: serif, fontSize: 84, lineHeight: '143px', color: colors.ink, whiteSpace: 'pre' }}>
            {Array.from(TEXT2).map((ch, j) => (
              <span key={j} style={{ opacity: TEXT1.length + j < typed ? 1 : 0 }}>{ch}</span>
            ))}
          </div>
          {/* 每字 2–3 颗 3px 墨点（PT-04） */}
          {SPECKS.map((p) => {
            const age = frame - (START + p.c * FPC);
            if (age < 0 || age > 18) return null;
            const prog = age / 18;
            const t6 = age / 6;
            return (
              <div
                key={p.seed}
                style={{
                  position: 'absolute',
                  left: p.x - 1.5,
                  top: p.y - 1.5,
                  width: 3,
                  height: 3,
                  borderRadius: 1.5,
                  background: colors.ink,
                  opacity: (1 - prog) * 0.75,
                  transform: `translate(${p.vx * t6}px, ${p.vy * t6 + 7 * t6 * t6}px)`,
                }}
              />
            );
          })}
          {/* 起笔前光标（承接 s55 尾帧），首字落纸即让位 */}
          <div style={{ position: 'absolute', left: penX - 1.5, top: penY - 30, width: 3, height: 60, background: colors.ink, opacity: typed === 0 ? 0.9 : 0 }} />
          {/* 笔尖微光 */}
          <div style={{ ...pg, opacity: Number(pg.opacity ?? 1) * glowAmp }} />
        </AbsoluteFill>
      </CameraRig>
      <PaperGrain opacity={0.06} />
      <Grade id="GR-02" />
      <Caption text="写作是抵抗遗忘的方式，代码是构建世界的语言。" appearAt={14} />
    </AbsoluteFill>
  );
};

export default ShotTypewriter;
