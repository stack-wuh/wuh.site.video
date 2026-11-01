/* 样张 · 纸墨材料电影（art-direction v3 路线验证）
   240f / 8s：空纸侧光 → 一滴墨落纸 → 墨沿纸纤维散开长成山脊 → 诗第 1 行以墨渗浮现。
   全部程序化：纸纹、墨团、渗化、光、景深，无任何位图素材。 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, random, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';

const CLAMP = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

/** 墨团：每颗沿自身方向缓慢推进，半径按 1-e^(-t/τ) 长开，alpha 随时间退去。 */
const BLOBS = Array.from({ length: 120 }, (_, i) => {
  const s = `ink-${i}`;
  const a = (random(`${s}-a`) - 0.5) * Math.PI * 2;
  return {
    key: s,
    x0: 960 + (random(`${s}-x`) - 0.5) * 90,
    y0: 430 + (random(`${s}-y`) - 0.5) * 50,
    dir: a,
    speed: 1.4 + random(`${s}-v`) * 5.2,
    size: 28 + random(`${s}-r`) * 130,
    delay: random(`${s}-d`) * 26,
    tau: 26 + random(`${s}-t`) * 46,
    life: 220 + random(`${s}-l`) * 90,
    dark: 0.05 + random(`${s}-o`) * 0.16,
  };
});

/** 山脊：三道横向墨积，随墨扩散依次成形。 */
const RIDGES = [
  { key: 'r1', y: 706, w: 1500, h: 150, at: 62, alpha: 0.2, blur: 34 },
  { key: 'r2', y: 768, w: 1720, h: 190, at: 84, alpha: 0.26, blur: 46 },
  { key: 'r3', y: 860, w: 1900, h: 230, at: 104, alpha: 0.32, blur: 60 },
];

const POEM = '我走过山时，山不说话，';

const S02: FC = () => {
  const f = useCurrentFrame();

  const dropAt = 26;
  const drop = interpolate(f, [dropAt, dropAt + 6, dropAt + 16], [0, 1, 1], CLAMP);
  const dropR = interpolate(f, [dropAt, dropAt + 14], [0, 9], CLAMP);
  const dropFall = interpolate(f, [dropAt - 10, dropAt], [0, 1], CLAMP);
  const light = interpolate(f, [0, 240], [0.9, 1.06], CLAMP);
  const push = interpolate(f, [0, 240], [1.0, 1.05], CLAMP);

  return (
    <AbsoluteFill style={{ background: colors.paper, overflow: 'hidden' }}>
      <AbsoluteFill style={{ transform: `scale(${push})`, transformOrigin: '50% 58%' }}>
        {/* 纸面：暖白 + 侧光 + 极淡的纤维起伏 */}
        <AbsoluteFill style={{ background: `radial-gradient(120% 90% at 30% 18%, ${colors.paper} 0%, ${colors.paperDeep} 62%, ${colors.paperMuted} 100%)`, opacity: light }} />
        <AbsoluteFill
          style={{
            background: `linear-gradient(102deg, transparent 34%, ${colors.paper} 52%, transparent 66%)`,
            opacity: 0.5,
            transform: `translateX(${interpolate(f, [0, 240], [-6, 8], CLAMP)}%)`,
            mixBlendMode: 'soft-light',
          }}
        />

        {/* 墨：逸散的水纹团 */}
        <AbsoluteFill style={{ mixBlendMode: 'multiply' }}>
          {BLOBS.map((b) => {
            const t = f - dropAt - b.delay;
            if (t < 0) return null;
            const grow = 1 - Math.exp(-t / b.tau);
            const r = b.size * grow;
            const x = b.x0 + Math.cos(b.dir) * b.speed * t * 1.6;
            const y = b.y0 + Math.sin(b.dir) * b.speed * t * 1.6 + 0.02 * t * t * 0.6;
            const fade = Math.max(0, 1 - t / b.life);
            return (
              <div
                key={b.key}
                style={{
                  position: 'absolute',
                  left: x - r,
                  top: y - r,
                  width: r * 2,
                  height: r * 2,
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${colors.ink} 0%, rgba(15,14,12,0.55) 46%, transparent 74%)`,
                  opacity: b.dark * fade,
                  filter: `blur(${2 + r * 0.06}px)`,
                }}
              />
            );
          })}
        </AbsoluteFill>

        {/* 山脊：横向墨积逐层压下来 */}
        {RIDGES.map((r) => {
          const t = interpolate(f, [r.at, r.at + 70], [0, 1], CLAMP);
          return (
            <div
              key={r.key}
              style={{
                position: 'absolute',
                left: 960 - (r.w * t) / 2,
                top: r.y - r.h / 2,
                width: r.w * t,
                height: r.h,
                borderRadius: '50%',
                background: `radial-gradient(ellipse at 50% 50%, ${colors.ink} 0%, rgba(15,14,12,0.5) 52%, transparent 78%)`,
                opacity: r.alpha * t,
                filter: `blur(${r.blur}px)`,
                mixBlendMode: 'multiply',
              }}
            />
          );
        })}

        {/* 落墨：一滴墨从上方坠下 */}
        <div
          style={{
            position: 'absolute',
            left: 960 - dropR,
            top: 430 - dropR - (1 - dropFall) * 120,
            width: dropR * 2,
            height: dropR * 2,
            borderRadius: '50%',
            background: colors.ink,
            opacity: 0.9 * drop,
            filter: 'blur(1.5px)',
            mixBlendMode: 'multiply',
          }}
        />

        {/* 诗：墨渗浮现（逐字，模糊收干） */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 190,
            textAlign: 'center',
            fontFamily: 'Songti SC, Noto Serif SC, serif',
            fontSize: 54,
            letterSpacing: 10,
            color: colors.ink,
            opacity: 0.92,
          }}
        >
          {[...POEM].map((ch, i) => {
            const at = 104 + i * 9;
            const k = interpolate(f, [at, at + 26], [0, 1], CLAMP);
            return (
              <span
                key={i}
                style={{
                  display: 'inline-block',
                  opacity: k,
                  filter: `blur(${(1 - k) * 7}px)`,
                  transform: `translateY(${(1 - k) * 5}px)`,
                }}
              >
                {ch}
              </span>
            );
          })}
        </div>

        {/* 景深：画面边缘轻微失焦 */}
        <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 52%, transparent 46%, ${colors.paper} 118%)`, opacity: 0.55 }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export default S02;
