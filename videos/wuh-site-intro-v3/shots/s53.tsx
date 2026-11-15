import type { FC } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { SealStamp } from '../components/SealStamp';
import { ShotShell } from '../components/ShotShell';
import { Typewriter } from '../components/Typewriter';
import { QUOTES } from '../data';
import { FILM_COLORS, FONTS, blink, clamp01, progress, rnd, typedCount } from '../motion-tokens';

/**
 * s53 · 站点题记（90f，5350–5440）
 * 承接 s52：朱砂小印退场（0–8f）；主动作：题记句打字机逐字打出（TX-02，3f/字，4f→70f 落定），
 * 笔尖 28px 径向微光跟随字位 + 每字 2–3 颗墨点粒子（INK-05，确定性 rnd、上限 66、life 18f）；
 * 句末光标常亮（TX-03）。尾帧：整句 + 句末光标（交 s54 上移成页眉）。
 */

const Q = QUOTES[6];
const TEXT = Q.text;
const CHARS = Array.from(TEXT);

const START = 4;
const FPC = 3;
const DONE = START + CHARS.length * FPC; // 70f 落定
const LEFT = 344;
const TOP = 476;
const SIZE = 56;
/** 笔尖 / 光标用的字位推进（Noto Serif SC 汉字与全角标点均为 1em 全宽） */
const ADV = SIZE;
const BASE_Y = TOP + 40;

const LIFE = 18;
const CAP = 66;

type Ink = { char: number; k: number };

/** 每字 2–3 颗墨点（确定性），总数封顶 66 */
const INKS: Ink[] = (() => {
  const out: Ink[] = [];
  for (let i = 0; i < CHARS.length && out.length < CAP; i++) {
    const n = 2 + (rnd('s53-ink-n', i) < 0.5 ? 0 : 1);
    for (let k = 0; k < n && out.length < CAP; k++) out.push({ char: i, k });
  }
  return out;
})();

const S53: FC = () => {
  const frame = useCurrentFrame();
  const count = typedCount(frame, START, FPC, CHARS.length);
  const penX = LEFT + count * ADV;
  const typing = frame >= START && count < CHARS.length;
  const pen = frame < START ? 0 : typing ? 1 : 1 - progress(frame, DONE, 8);
  const cursorOn = frame < START ? blink(frame, 2) : true;
  const exit = progress(frame, 0, 8); // 小印退场
  const base = progress(frame, DONE - 8, 12);

  const inks: Array<{ key: string; x: number; y: number; o: number }> = [];
  for (const p of INKS) {
    const age = frame - (START + p.char * FPC);
    if (age < 0 || age > LIFE) continue;
    const s = p.char * 3 + p.k;
    const vx = (rnd('s53-spray', s) - 0.5) * 1.2;
    const vy = -0.35 - rnd('s53-lift', s) * 0.8;
    const x = LEFT + (p.char + 1) * ADV + vx * age + (rnd('s53-drift', s) - 0.5) * age * 0.1;
    const y = BASE_Y + 8 + vy * age + 0.075 * age * age;
    inks.push({ key: `${p.char}-${p.k}`, x, y, o: clamp01(1 - age / LIFE) * 0.6 });
  }

  return (
    <ShotShell act="ACT 06 · 签名">
      <AbsoluteFill>
        {/* 朱砂小印退场（同位承接 s52） */}
        <div
          style={{
            position: 'absolute',
            left: 850,
            top: 736 - exit * 10,
            opacity: 1 - exit,
          }}
        >
          <SealStamp text="此乐何极" size={48} start={-30} tilt={false} style={{ transform: 'rotate(1.6deg)' }} />
        </div>

        {/* 题记句：打字机 */}
        <div style={{ position: 'absolute', left: LEFT, top: TOP }}>
          <Typewriter
            text={TEXT}
            start={START}
            framesPerChar={FPC}
            cursor="none"
            fontSize={SIZE}
            color={FILM_COLORS.ink}
            fontFamily={FONTS.serif}
            lineHeight={1.45}
          />
          {/* 光标：起笔前闪烁，落笔后常亮 */}
          <div
            style={{
              position: 'absolute',
              left: count * ADV,
              top: 22,
              width: 3,
              height: SIZE * 0.86,
              backgroundColor: FILM_COLORS.vermillion,
              opacity: cursorOn ? 1 : 0,
            }}
          />
        </div>

        {/* 笔尖：28px 径向微光（静态渐变，只移动不重绘） */}
        {pen > 0 ? (
          <div
            style={{
              position: 'absolute',
              left: penX - 14,
              top: BASE_Y - 14,
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${FILM_COLORS.accent} 0%, transparent 72%)`,
              opacity: pen * 0.85,
              pointerEvents: 'none',
            }}
          />
        ) : null}

        {/* 墨点粒子：落定即散 */}
        {inks.map((p) => (
          <div
            key={p.key}
            style={{
              position: 'absolute',
              left: p.x,
              top: p.y,
              width: 3,
              height: 3,
              borderRadius: '50%',
              backgroundColor: FILM_COLORS.ink,
              opacity: p.o,
            }}
          />
        ))}

        {/* 题记基线（落定后 2f 起，纸面收束） */}
        <div
          style={{
            position: 'absolute',
            left: LEFT,
            top: TOP + SIZE * 1.45 + 22,
            width: CHARS.length * ADV,
            height: 1,
            backgroundColor: FILM_COLORS.hairline,
            opacity: base,
          }}
        />
      </AbsoluteFill>
    </ShotShell>
  );
};

export default S53;