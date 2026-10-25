import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, inkRise, TYPE, writeFade , SEAL_RED, WARM_GOLD} from '../motion-tokens';
import { CameraRig, ParallaxLayer } from '../components/CameraRig';

const serif = fontFamilies.serif;
const sans = fontFamilies.sans;

const fade = (f: number, at: number) =>
  interpolate(f, [at, at + 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

/* 光尘粒子场（seed 确定性；密度/速度/暖金配比随幕取 DUST 配置） */
export const DustField: FC<{ act: number; count?: number }> = ({ act, count }) => {
  const frame = useCurrentFrame();
  const speeds = { slow: 8 / 30, mid: 16 / 30, fast: 30 / 30, slowest: 3 / 30 } as const;
  const cfgs = { 1: [70, 'slow', 0.9], 2: [25, 'slow', 0.85], 3: [90, 'mid', 0.7], 4: [60, 'mid', 0.95], 5: [30, 'slowest', 0.9], 6: [40, 'fast', 0.1], 7: [90, 'slow', 0.9] } as const;
  const [n, speed, gold] = cfgs[act as keyof typeof cfgs] ?? cfgs[1];
  const v = speeds[speed as keyof typeof speeds];
  const total = count ?? n;
  return (
    <AbsoluteFill>
      {Array.from({ length: total }).map((_, i) => {
        const seed = i * 97 + act * 13;
        const x0 = (seed * 7) % 1920;
        const size = 2 + (seed % 4);
        const red = seed % 10 >= gold * 10;
        const y = ((seed * 31 + frame * v) % 1100) - 50;
        const sway = Math.sin((frame + seed) / 40) * 24;
        const breathe = 0.55 + 0.45 * Math.sin((frame / 120) * Math.PI * 2 + seed);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x0 + sway,
              top: y,
              width: size,
              height: size,
              borderRadius: size / 2,
              background: red ? SEAL_RED : WARM_GOLD,
              opacity: 0.25 + breathe * 0.45,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

const MOTTO = '写作是抵抗遗忘的方式，代码是构建世界的语言。';

/* 镜 2：打字机宣言（复刻站点 TypewriterMotto：笔尖微光 + 墨点粒子 + 短划线） */
const ShotTypewriter: FC = () => {
  const frame = useCurrentFrame();
  const local = frame - 120;
  const chars = Math.min(MOTTO.length, Math.max(0, Math.floor(local / TYPE.framesPerChar)));
  const done = chars >= MOTTO.length;
  return (
    <AbsoluteFill style={{ justifyContent: 'center' }}>
      <div style={{ padding: '0 140px', position: 'relative' }}>
        <p style={{ fontFamily: serif, fontSize: 52, color: colors.paper, lineHeight: 1.6, minHeight: 170, textShadow: `0 0 30px ${colors.bgLift}` }}>
          {MOTTO.slice(0, chars)}
          <span
            style={{
              display: 'inline-block',
              width: 28,
              height: 28,
              borderRadius: 14,
              background: `radial-gradient(circle, ${colors.accent} 0%, transparent 70%)`,
              filter: 'blur(7px)',
              opacity: 0.5 + 0.4 * Math.sin(local / 4),
              marginLeft: 6,
            }}
          />
        </p>
        {Array.from({ length: Math.min(chars * 2, 30) }).map((_, i) => {
          const born = 126 + Math.floor(i / 2) * TYPE.framesPerChar;
          const life = frame - born;
          if (life < 0 || life > 18) return null;
          const angle = (i * 137) % 360;
          const dist = 6 + ((i * 29) % 22);
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: 140 + (i % 14) * 62 + Math.cos((angle * Math.PI) / 180) * dist * (life / 18),
                top: 430 + Math.sin((angle * Math.PI) / 180) * dist * (life / 18) - life * 0.4,
                width: 3,
                height: 3,
                borderRadius: 1.5,
                background: colors.paperMuted,
                opacity: 1 - life / 18,
              }}
            />
          );
        })}
        <div style={{ width: done ? interpolate(local, [240, 260], [0, 180], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 0, height: 3, background: colors.accent, marginTop: 10 }} />
      </div>
      <div style={{ position: 'absolute', left: 120 + chars * 30, top: 400, width: 28, height: 28, borderRadius: 14, background: `radial-gradient(circle, ${colors.accent}, transparent 70%)`, filter: 'blur(7px)', opacity: 0.55 }} />
    </AbsoluteFill>
  );
};

const ShotDustDesk: FC = () => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, 120], [1, 1.02], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const cam = { scale, x: 0, y: 0, rot: 0 };
  return (
    <CameraRig cam={cam}>
      <ParallaxLayer depth={0.4} cam={cam} blurBase={4}>
        <DustField act={1} count={40} />
      </ParallaxLayer>
      <ParallaxLayer depth={1} cam={cam}>
        <DustField act={1} count={30} />
        <div style={{ position: 'absolute', bottom: 0, left: 340, width: 720, height: 190, background: colors.bgLift, borderTop: `2px solid ${colors.muted}`, opacity: fade(frame, 24) }} />
        <div style={{ position: 'absolute', bottom: 190, left: 900, width: 10, height: 80, background: colors.muted, opacity: fade(frame, 45) }} />
        <div style={{ position: 'absolute', bottom: 268, left: 892, width: 26, height: 12, background: colors.terminalBg, opacity: fade(frame, 52) }} />
        <div style={{ position: 'absolute', right: 320, top: 300, width: 6, height: 6, borderRadius: 3, background: colors.paper, opacity: 0.5 + 0.3 * Math.sin(frame / 14) }} />
      </ParallaxLayer>
    </CameraRig>
  );
};

const ShotBrand: FC = () => {
  const frame = useCurrentFrame();
  const local = frame - 460;
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ ...inkRise(local, 0), fontFamily: serif, fontSize: 100, color: colors.paper, margin: 0 }}>wuh.site · 朝朝如念</h1>
        <p style={{ ...writeFade(local, 8), fontFamily: sans, fontSize: 30, color: colors.muted, letterSpacing: '0.3em', marginTop: 34 }}>雾失楼台，月迷津渡</p>
        <p style={{ ...writeFade(local, 16), fontFamily: sans, fontSize: 20, color: colors.accent, letterSpacing: '0.2em', marginTop: 22 }}>代码写诗，工具作画</p>
        <div style={{ ...writeFade(local, 24), display: 'flex', gap: 16, justifyContent: 'center', marginTop: 30 }}>
          {['GitHub', '音乐', '博客', 'RSS'].map((s) => (
            <span key={s} style={{ fontFamily: sans, fontSize: 17, color: colors.muted, border: `1px solid ${colors.hairline}`, borderRadius: 16, padding: '6px 18px' }}>{s}</span>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const Act1: FC = () => {
  const frame = useCurrentFrame();
  const fadeDark = interpolate(frame, [670, 700], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      {frame < 120 ? <ShotDustDesk /> : null}
      {frame >= 120 && frame < 460 ? <ShotTypewriter /> : null}
      {frame >= 460 ? <ShotBrand /> : null}
      <AbsoluteFill style={{ background: colors.bg, opacity: fadeDark }} />
    </AbsoluteFill>
  );
};
