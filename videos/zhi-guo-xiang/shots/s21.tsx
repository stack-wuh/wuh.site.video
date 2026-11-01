/* 镜 21 · 幕三 生辰 · local [0,140) · 140f
   水墨底图 + 人群条 + 代码动效（art-direction v2.1 §六样片）。
   底图 base-s21（g08 街头散场，她已烤入）· 贴片 fig-crowd（人群剪影条，向左流出）·
   代码层：烟灰缓落、余光自脸侧退净、天色退暗。字幕 0–120。 */
import type { FC } from 'react';
import { AbsoluteFill, Img, interpolate, random, staticFile, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { Caption } from '../components/Caption';
import { CM, CV, FILM, GRADES } from '../motion-tokens';

const CLAMP = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const BASE = staticFile('zhi-guo-xiang/base-s21.jpg');
const CROWD = staticFile('zhi-guo-xiang/fig-crowd.png');
const TILES = [0, 1, 2];
const ASH = Array.from({ length: 26 }, (_, i) => i);

const S21: FC = () => {
  const f = useCurrentFrame();
  const cam = CM.hold();
  const rim = 1 - CV.hardStep3(Math.min(1, Math.max(0, (f - 110) / 30)));
  const crowdX = interpolate(f, [0, 140], [980, -2100], CLAMP);
  const crowdFade = interpolate(f, [90, 140], [1, 0], CLAMP);
  const grade = GRADES['GR-02'];

  return (
    <AbsoluteFill style={{ background: colors.bg, overflow: 'hidden' }}>
      <AbsoluteFill style={{ transform: `scale(${cam.scale}) translate(${cam.x}px, ${cam.y}px)` }}>
        {/* 底图：街巷散场 */}
        <Img src={BASE} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />

        {/* 人群条：一边散一边还在说前线的事，自右向左流出画 */}
        <div style={{ position: 'absolute', left: 0, bottom: -150, height: 560, opacity: crowdFade }}>
          {TILES.slice(0, 2).map((t) => (
            <Img
              key={t}
              src={CROWD}
              style={{
                position: 'absolute',
                left: t * 900 + crowdX,
                bottom: 0,
                height: '100%',
                width: 'auto',
                mixBlendMode: 'multiply',
              }}
            />
          ))}
        </div>

        {/* 余光自她脸侧退净 */}
        <div
          style={{
            position: 'absolute',
            left: 880,
            top: 380,
            width: 260,
            height: 340,
            background: `linear-gradient(200deg, ${FILM.fireGold}, transparent 62%)`,
            opacity: 0.16 * rim,
            filter: 'blur(26px)',
          }}
        />

        {/* 一地烟灰缓落 */}
        {ASH.map((i) => {
          const s = `s21-ash-${i}`;
          const x0 = random(`${s}-x`) * 1920;
          const speed = 0.5 + random(`${s}-sp`) * 1.1;
          const y = ((random(`${s}-y`) * 1080 + f * speed) % 1080);
          const drift = Math.sin((f + random(`${s}-ph`) * 90) / 46) * 16;
          return (
            <div
              key={s}
              style={{
                position: 'absolute',
                left: x0 + drift,
                top: y,
                width: 1 + random(`${s}-w`) * 2,
                height: 1,
                borderRadius: '50%',
                background: random(`${s}-g`) < 0.3 ? FILM.fireGold : colors.paperMuted,
                opacity: 0.12 + random(`${s}-o`) * 0.22,
              }}
            />
          );
        })}

        {/* 天色退暗 */}
        <AbsoluteFill style={{ background: colors.ink, opacity: interpolate(f, [0, 140], [0.04, 0.16], CLAMP) }} />
      </AbsoluteFill>

      <AbsoluteFill style={{ background: grade.base.color, mixBlendMode: grade.base.blend, opacity: grade.base.opacity * 0.8 }} />
      {grade.veil ? <AbsoluteFill style={{ background: grade.veil.gradient, mixBlendMode: grade.veil.blend, opacity: grade.veil.opacity }} /> : null}

      <Caption text="满城烟火，本是军情。" start={0} end={120} />
    </AbsoluteFill>
  );
};

export default S21;
