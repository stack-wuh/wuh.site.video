/* S11 · 她的手掌摊开，三枚金针逐枚落下，手指一分一分收拢 210f
 *
 * v12 分镜：微距·俯，动作三段。底图 `p-palm`（她的手，**针由代码画**——针的形制必须对：
 * 细长针身、缠丝针柄、发丝针尖，见 Needles.tsx）。
 *
 * 时间轴（入场墨洇 20f 之后才起手）：
 *   58f / 70f / 82f  三枚针依次落下（间隔 12f，每枚落 8f，越落越快 = 重力）；
 *   66f / 78f / 90f  各自落定，落定那一帧一点火金反光；
 *   66→104f          她的手指随每枚落定收一档（掌形微收 + 内旋 + 指根压影），一共三档；
 *   150→180f         掌中亮一次（火塘的光经过掌面），三枚针的金身横闪一道。
 *
 * 她「收拢手指」在静态底上演不出来，所以用四个弱线索叠：整掌 scale 3%、内旋 1.6°、
 * 指侧 multiply 压影加深、末端掌中火金高光。不重画手指、不画他的袖子。
 * 转场：入「墨洇」，出「墨洇」。
 */
import type { FC } from 'react';
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { ShotSlide } from '../components/e-scene';
import { Caption } from '../components/Caption';
import { Needles } from '../components/Needles';
import { WarmBloom } from '../components/e-firelight';
import { CLAMP, FILM } from '../motion-tokens';

const TOTAL = 210;
const BASE = 'p-palm';

/** 针槽：针柄靠腕侧，针尖朝指尖（左上→右上那条掌轴），三枚散在掌心。
 *  与 Needles 的槽位公式一致：off = (i-1)*SPREAD，angle = TILT + (i-1)*3.2 */
const SLOT = { x: 700, y: 648, len: 400, spread: 44, tilt: -34 };
const FALL = 8;
const RELEASE = [58, 70, 82] as const;
const LAND = RELEASE.map((r) => r + FALL);

const slotOf = (i: number) => {
  const off = (i - 1) * SLOT.spread;
  return { x: SLOT.x + off * 0.35, y: SLOT.y + off, tilt: SLOT.tilt + (i - 1) * 3.2 };
};

const S11: FC = () => {
  const f = useCurrentFrame();

  /* 手指收拢：每落一枚收 1/3，收完再微调一档 */
  const closed =
    interpolate(f, [LAND[0], LAND[1], LAND[2]], [0, 1 / 3, 2 / 3], CLAMP) + interpolate(f, [LAND[2], LAND[2] + 14], [0, 1 / 3], CLAMP);

  /* 掌中高光：150–180f 一次（淡入 8f、峰值 8f、余晖 22f） */
  const glint = interpolate(f, [150, 158, 166, 180], [0, 0.95, 1, 0.5], CLAMP);

  /* 落定反光：落定那一帧起 6f 的短闪 */
  const landGlint = (land: number) => interpolate(f, [land - 1, land, land + 2, land + 6], [0, 1, 0.7, 0], CLAMP);

  return (
    <ShotSlide total={TOTAL} frame={f} zoom={[1.02, 1.07]} origin="54% 56%">
      {/* 底图：她的手。收指时整掌微微内收（scale + 腕部内旋），手指本身不重画 */}
      <AbsoluteFill style={{ overflow: 'hidden' }}>
        <Img
          src={staticFile(`zhi-guo-xiang/scene/${BASE}.jpg`)}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: `scale(${1 + 0.03 * closed}) rotate(${-1.6 * closed}deg)`,
            transformOrigin: '32% 76%',
          }}
        />
      </AbsoluteFill>

      {/* 指侧的收拢压影：手指合过来时，掌面与指腹之间会暗一条 */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 30% 22% at 62% 34%, ${colors.ink} 0%, transparent 68%)`,
          opacity: 0.26 * closed,
          mixBlendMode: 'multiply',
          filter: 'blur(14px)',
          pointerEvents: 'none',
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 26% 14% at 40% 46%, ${colors.ink} 0%, transparent 70%)`,
          opacity: 0.16 * closed,
          mixBlendMode: 'multiply',
          filter: 'blur(17px)',
          pointerEvents: 'none',
        }}
      />

      {/* 正在落下的针：8f 一枚，落定后交给 Needles 真值层 */}
      <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0 }} preserveAspectRatio="none">
        {RELEASE.map((rel, i) => {
          const t = (f - rel) / FALL;
          if (t < 0 || t >= 1) return null;
          const s = slotOf(i);
          const k = t * t; // 重力：越落越快
          const hx = s.x + 40 * (1 - k);
          const hy = s.y - 520 * (1 - k);
          const ang = ((52 + (s.tilt - 52) * t) * Math.PI) / 180;
          const tx = hx + Math.cos(ang) * SLOT.len;
          const ty = hy + Math.sin(ang) * SLOT.len;
          const wx = hx + Math.cos(ang) * SLOT.len * 0.28;
          const wy = hy + Math.sin(ang) * SLOT.len * 0.28;
          return (
            <g key={`fall-${i}`} opacity={0.94}>
              <line x1={hx} y1={hy} x2={tx} y2={ty} stroke={FILM.fireGold} strokeWidth={1.7} strokeLinecap="round" />
              <line x1={hx} y1={hy} x2={wx} y2={wy} stroke={colors.gold} strokeWidth={6.4} strokeLinecap="round" />
              <circle cx={tx} cy={ty} r={1.7} fill={colors.gold} />
            </g>
          );
        })}
      </svg>

      {/* 落定的针：逐枚叠 Needles（单枚模式，槽位与上面一致） */}
      {RELEASE.map((_, i) => {
        const s = slotOf(i);
        return (
          <Needles
            key={`made-${i}`}
            count={1}
            origin={[s.x, s.y]}
            len={SLOT.len}
            spread={0}
            tilt={s.tilt}
            width={2.5}
            opacity={f >= LAND[i] ? 0.96 : 0}
          />
        );
      })}

      {/* 落点的火金反光（落定那一瞬，针身亮一下） */}
      {LAND.map((land, i) => {
        const g = landGlint(land);
        if (g <= 0.01) return null;
        const s = slotOf(i);
        return (
          <WarmBloom
            key={`land-${i}`}
            at={{ x: s.x + SLOT.len * 0.45, y: s.y - SLOT.len * 0.22 }}
            r={120}
            squash={0.42}
            opacity={0.3 * g}
            period={60}
            breath={0}
            blur={16}
          />
        );
      })}

      {/* 掌中高光：火塘的光经过掌面 + 三枚针横闪一道 */}
      <WarmBloom at={{ x: 900, y: 470 }} r={330} squash={0.7} opacity={0.16 * glint} period={60} breath={0} blur={44} />
      <div
        style={{
          position: 'absolute',
          left: 780,
          top: 520,
          width: 330,
          height: 7,
          borderRadius: 4,
          background: colors.gold,
          opacity: 0.5 * glint,
          mixBlendMode: 'screen',
          filter: 'blur(1.4px)',
          transform: 'rotate(-30deg)',
          transformOrigin: 'left center',
          pointerEvents: 'none',
        }}
      />

      {/* 掌下压一点暖影：微距特写下掌面才有厚度 */}
      <AbsoluteFill
        style={{
          background: 'radial-gradient(ellipse 46% 34% at 52% 58%, transparent 52%, rgba(43,38,32,0.2) 100%)',
          mixBlendMode: 'multiply',
          pointerEvents: 'none',
        }}
      />
      <Caption cue="s11" tone="ink" />
    </ShotSlide>
  );
};

export default S11;