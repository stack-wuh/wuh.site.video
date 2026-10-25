import type { FC } from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, inkRise, RUSH13, sealStamp, sealTilt, WHITE_FLASH, writeFade , GRADES} from '../motion-tokens';

const serif = fontFamilies.serif;
const sans = fontFamilies.sans;
const mono = fontFamilies.mono;

const fade = (f: number, at: number) =>
  interpolate(f, [at, at + 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

/* 镜 11（0–180）：生成式封面 · 山峦双曲线描边 */
const ShotCover: FC = () => {
  const frame = useCurrentFrame();
  const draw = (delay: number) =>
    interpolate(frame - delay, [0, 70], [1400, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const glow = interpolate(frame, [120, 180], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseIn });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', filter: `blur(${glow * 8}px)`, transform: `scale(${1 + glow * 2.2})` }}>
      <svg width="1000" height="420" viewBox="0 0 1000 420">
        <path d="M0,320 C160,240 300,360 480,270 C660,180 800,340 1000,260" fill="none" stroke={colors.accent} strokeWidth={2.5} strokeDasharray={1400} strokeDashoffset={draw(6)} opacity={0.8} />
        <path d="M0,370 C200,300 360,410 560,340 C740,280 860,380 1000,330" fill="none" stroke={colors.accent} strokeWidth={2} strokeDasharray={1400} strokeDashoffset={draw(50)} opacity={0.5} />
        <text x="500" y="110" textAnchor="middle" fill={colors.paper} fontFamily={serif} fontSize={42} opacity={fade(frame, 40)}>再读《坐忘歌》</text>
        <text x="940" y="396" textAnchor="end" fill={colors.muted} fontFamily={mono} fontSize={17} opacity={fade(frame, 70)}>wuh.site</text>
      </svg>
      <p style={{ fontFamily: sans, fontSize: 22, color: colors.muted, marginTop: 20, opacity: fade(frame, 80) }}>深夜，他重读了自己写过的每一个字。</p>
    </AbsoluteFill>
  );
};

/* 镜 12（180–400）：宣言信纸 · 逐行落墨 */
const ShotManifestoA: FC = () => {
  const frame = useCurrentFrame();
  const lines = ['两天重新读了一下过去写过的博客，', '才发现我已经很久没有继续写博客了。', '……这样不好。'];
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ width: 880, background: colors.paperDeep, borderRadius: 10, padding: '48px 60px', transform: 'rotate(-0.8deg)' }}>
        {lines.map((l, i) => (
          <p key={i} style={{ ...writeFade(frame, 14 + i * 46), fontFamily: serif, fontSize: 30, color: colors.ink, margin: '20px 0' }}>
            {l}
          </p>
        ))}
      </div>
    </AbsoluteFill>
  );
};

/* 镜 13（400–620）：宣言下半 + 急推（2370→2420 = 本地 570→620；急推作用于信纸卡片 1→1.6，规避全屏大倍率 GPU 光栅化崩溃） */
const ShotManifestoB: FC = () => {
  const frame = useCurrentFrame();
  const rush = interpolate(frame, [RUSH13.from - 2200, RUSH13.to - 2200], [1, 1.6], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: RUSH13.easing,
  });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div
        style={{
          position: 'relative',
          width: 880,
          background: colors.paperDeep,
          borderRadius: 10,
          padding: '48px 60px',
          transform: `rotate(-0.8deg) scale(${rush})`,
          transformOrigin: '62% 60%',
        }}
      >
        {['每周发布一篇博客，无限进步，', '开始重启计划~~'].map((l, i) => (
          <p key={i} style={{ ...writeFade(frame, 10 + i * 46), fontFamily: serif, fontSize: 30, color: colors.ink, margin: '20px 0' }}>
            {l}
          </p>
        ))}
        <p style={{ fontFamily: mono, fontSize: 18, color: colors.muted, marginTop: 26, opacity: fade(frame, 120) }}>2026.06.21 · 重启计划</p>
      </div>
    </AbsoluteFill>
  );
};

/* 镜 14（620–810）：钤印落章 + 10,330 光毯复燃（钤印帧 2420 = 本地 0） */
const ShotReignite: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const seal = sealStamp(frame, 0, fps, sealTilt('restart-2026'));
  const blaze = interpolate(frame, [0, 24, 90], [0, 0.85, 0.4], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const camOut = interpolate(frame, [40, 190], [1.35, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const crane = interpolate(frame, [40, 190], [30, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <AbsoluteFill style={{ transform: `translateY(${crane}px) scale(${camOut})` }}>
        <div style={{ display: 'flex', gap: 5, justifyContent: 'center' }}>
          {Array.from({ length: 26 }).map((_, w) => (
            <div key={w} style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {Array.from({ length: 7 }).map((_, d) => {
                const ripple = spring({ frame: frame - (10 + (w + d) * 2), fps, config: { damping: 200 } });
                return <div key={d} style={{ width: 24, height: 24, borderRadius: 5, background: (w + d) % 4 > 1 ? colors.accent : colors.paperMuted, opacity: interpolate(ripple, [0, 1], [0.08, (w + d) % 4 > 1 ? 0.9 : 0.35]), transform: `scale(${ripple})` }} />;
              })}
            </div>
          ))}
        </div>
      </AbsoluteFill>
      {/* 红光晕染 */}
      <AbsoluteFill style={{ background: `radial-gradient(circle, ${GRADES[2].lut.color} 0%, transparent 65%)`, opacity: blaze * 0.8, mixBlendMode: 'screen' }} />
      {/* 钤印 */}
      <div style={{ position: 'absolute', left: '58%', top: '52%', width: 46, height: 46, background: colors.accent, boxShadow: `0 0 ${40 * blaze}px ${colors.accent}`, ...seal }} />
      <p style={{ position: 'absolute', bottom: 140, fontFamily: serif, fontSize: 40, color: colors.paper, opacity: fade(frame, 60) }}>
        10,330 次活动 · 365 天逐日真实
      </p>
    </AbsoluteFill>
  );
};

/* 镜 15（810–1000）：灯笼点亮 + 白闪涨满（白闪剪点 2800 = 本地 1000，跨切点入 Act 4） */
const ShotLaunch: FC = () => {
  const frame = useCurrentFrame();
  const pages = ['/', '/music', '/guestbook', '/footprint', '/topics', '/design', '/weread', '/about', 'wuh.site'];
  const white = interpolate(frame, [940, 990, 996], [0, 1, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.whiteFlashIn });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ display: 'flex', gap: 20 }}>
        {pages.map((p, i) => (
          <div key={p} style={{ width: 158, height: 220, borderRadius: 10, background: colors.bgLift, border: `1px solid ${colors.hairline}`, opacity: fade(frame, 8 + i * 20) * (1 - white), transform: `translateY(${(1 - spring({ frame: frame - (8 + i * 20), fps: 30, config: { damping: 200 } })) * 30}px)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: mono, fontSize: 16, color: colors.muted }}>{p}</span>
          </div>
        ))}
      </div>
      <p style={{ position: 'absolute', bottom: 200, fontFamily: serif, fontSize: 42, color: colors.paper, opacity: fade(frame, 60) * (1 - white) }}>
        2026.06.14 · 流量切换，正式上线
      </p>
      {/* 白闪涨满（跨切点：Act 4 从白释放） */}
      <AbsoluteFill style={{ background: WHITE_FLASH.color, opacity: white }} />
    </AbsoluteFill>
  );
};

const SHOTS: Array<{ from: number; to: number; Board: FC }> = [
  { from: 1800, to: 1980, Board: ShotCover },
  { from: 1980, to: 2200, Board: ShotManifestoA },
  { from: 2200, to: 2420, Board: ShotManifestoB },
  { from: 2420, to: 2610, Board: ShotReignite },
  { from: 2610, to: 2800, Board: ShotLaunch },
];

// Act 3 重启与复燃（1800–2800，本地帧 0–1000；幕调色 grade-seal-red）
export const Act3: FC = () => {
  const frame = useCurrentFrame();
  const local = frame;
  const shot = SHOTS.find((s) => local >= s.from - 1800 && local < s.to - 1800) ?? SHOTS[0];
  const Board = shot.Board;
  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Board />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: GRADES[2].lut.color, mixBlendMode: 'soft-light', opacity: interpolate(frame, [1600, 1800], [0, 0.3], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }} />
      <AbsoluteFill style={{ background: GRADES[2].lut.color, mixBlendMode: 'screen', opacity: 0.1 }} />
    </AbsoluteFill>
  );
};
