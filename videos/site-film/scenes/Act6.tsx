import type { FC, ReactNode } from 'react';
import { AbsoluteFill, interpolate, random, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { WARM_GOLD,  CURVES, SPRINGS, inkRise, sealStamp, sealTilt, writeFade , COLD, GRADES} from '../motion-tokens';
import { CameraRig, ParallaxLayer, type CamState } from '../components/CameraRig';

const serif = fontFamilies.serif;
const sans = fontFamilies.sans;
const mono = fontFamilies.mono;

/* Act 6 冷白电蓝局部色（幕调色「冷白电蓝」授权新增，仅本文件使用；钤印金沿用 brand accent，暖金光尘同 motion-tokens WARM_GOLD） */
const COLD_BG = COLD.bg; // 深蓝终端底（本幕基底）
const ELECTRIC = COLD.electric; // 电蓝主色
const ELECTRIC_SOFT = COLD.electricSoft; // 电蓝浅
const COLD_WHITE = COLD.coldWhite; // 冷白（幕纱同源）
const COLD_DIM = COLD.coldDim; // 冷灰蓝次级文字
const ELECTRIC_LINE = 'rgba(77,163,255,0.28)'; // 电蓝描边（含透明度衍生）
const BLEED_BLACK = COLD.bleedBlack; // tr-screen-bleed 化入的黑底（镜 41 同底）

const fade = (f: number, at: number) =>
  interpolate(f, [at, at + 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

/* ─── 镜 36（5600–5750）：终端 initial release —— 命令快档打字 + 字卡 glitch；tr-char-morph 收束（§4.7） ─── */
const TERMINAL_W = 920;
const CHAR_W = 13.2;
const L1 = '$ npx shadow-dev init';
const L2 = '✓ 5 skills · workflow ready';
const L3 = '$ shadow release';

const ShotTerminal: FC<{ f: number }> = ({ f }) => {
  const dolly = interpolate(f, [0, 120], [1, 1.12], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: CURVES.cineEaseInOut,
  });
  const cam: CamState = { scale: dolly, x: 0, y: 0, rot: 0 };
  const morph = interpolate(f, [120, 150], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: CURVES.cineEaseInOut,
  });
  const glitching = f >= 34 && f < 40;
  const gj = random('g36-' + Math.floor(f / 2)) - 0.5;
  const n1 = Math.max(0, Math.min(L1.length, Math.floor((f - 6) / 2.5)));
  const slot = (k: number) => ({
    gx: TERMINAL_W / 2 + ((k % 5) - 2) * 118,
    gy: 292 + Math.floor(k / 5) * 62,
  });
  return (
    <AbsoluteFill>
      <CameraRig cam={cam}>
        {/* 远景层：代码雨字符列（dof-parallax depth 0.4） */}
        <ParallaxLayer cam={cam} depth={0.4} blurBase={4}>
          {[0, 1, 2, 3, 4, 5].map((c) => (
            <p
              key={c}
              style={{
                position: 'absolute',
                left: 140 + c * 330,
                top: 0,
                fontFamily: mono,
                fontSize: 15,
                letterSpacing: 4,
                color: ELECTRIC,
                opacity: 0.06 + (c % 3) * 0.02,
                whiteSpace: 'pre',
                margin: 0,
                transform: `translateY(${((c * 97 + f * 0.8) % 1400) - 700}px)`,
              }}
            >
              {'propose\napply\nreview\nrelease\npublish\npropose\napply'}
            </p>
          ))}
        </ParallaxLayer>
        {/* 主体层：深蓝终端窗 */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '42%',
            transform: 'translate(-50%, -50%)',
            width: TERMINAL_W,
            height: 380,
            borderRadius: 12,
            background: COLD.panel,
            border: `1px solid ${ELECTRIC_LINE}`,
            boxShadow: '0 0 60px rgba(77,163,255,0.12)',
          }}
        >
          <div style={{ height: 44, borderBottom: '1px solid rgba(126,147,180,0.15)', display: 'flex', alignItems: 'center', paddingLeft: 20 }}>
            <span style={{ fontFamily: mono, fontSize: 13, color: COLD_DIM }}>shadow-dev-workflow — zsh</span>
            <span style={{ marginLeft: 'auto', paddingRight: 18, display: 'flex', gap: 6 }}>
              {[0, 1, 2].map((d) => (
                <span key={d} style={{ width: 9, height: 9, borderRadius: 4.5, background: 'rgba(126,147,180,0.3)' }} />
              ))}
            </span>
          </div>
          <p style={{ position: 'absolute', left: 48, top: 76, fontFamily: mono, fontSize: 22, color: COLD_WHITE, margin: 0, whiteSpace: 'pre' }}>{L1.slice(0, n1)}</p>
          <p style={{ position: 'absolute', left: 48, top: 118, fontFamily: mono, fontSize: 17, color: ELECTRIC_SOFT, margin: 0, opacity: fade(f, 62) }}>{L2}</p>
          {/* L3 逐字符：tr-char-morph —— 前 10 字符重排至 5×2 舰位，其余由 data-stream 光点替补 */}
          {(() => {
            let k = -1;
            return L3.split('').map((c, i) => {
              const x0 = 48 + i * CHAR_W;
              const typed = f >= 74 + i * 2.5;
              if (c === ' ') {
                return <span key={i} style={{ position: 'absolute', left: x0, top: 160, opacity: 0, fontFamily: mono, fontSize: 22 }}>{c}</span>;
              }
              k += 1;
              const going = k < 10;
              const { gx, gy } = slot(k);
              return (
                <span
                  key={i}
                  style={{
                    position: 'absolute',
                    left: x0,
                    top: 160,
                    fontFamily: mono,
                    fontSize: 22,
                    color: going && morph > 0 ? ELECTRIC_SOFT : COLD_WHITE,
                    opacity: (typed ? 1 : 0) * (going ? 1 : 1 - morph),
                    transform: going
                      ? `translate(${(gx - x0) * morph}px, ${(gy - 160) * morph}px)`
                      : `translateX(${morph * 420}px)`,
                  }}
                >
                  {c}
                </span>
              );
            });
          })()}
          {/* data-stream 光点替补（被舍弃字符化作光流） */}
          {[0, 1, 2, 3].map((d) => (
            <div
              key={'ds' + d}
              style={{
                position: 'absolute',
                left: 48 + 16.5 * CHAR_W + d * 10,
                top: 166,
                width: 22,
                height: 4,
                borderRadius: 2,
                background: `linear-gradient(90deg, transparent, ${ELECTRIC})`,
                opacity: morph * (1 - morph) * 4 * 0.9,
                transform: `translateX(${morph * (260 + d * 70)}px)`,
                mixBlendMode: 'screen',
              }}
            />
          ))}
          <span style={{ position: 'absolute', left: 48 + L3.length * CHAR_W, top: 160, fontFamily: mono, fontSize: 22, color: ELECTRIC, opacity: f >= 74 && Math.floor(f / 8) % 2 ? 1 : 0.05 }}>▍</span>
        </div>
        {/* 前景层：微光扫痕（dof-parallax depth 1.6） */}
        <ParallaxLayer cam={cam} depth={1.6} blurBase={6}>
          <div style={{ position: 'absolute', left: '30%', top: '8%', width: 700, height: 160, background: 'linear-gradient(105deg, transparent, rgba(220,235,255,0.05), transparent)', transform: 'rotate(-8deg)' }} />
        </ParallaxLayer>
      </CameraRig>
      {/* 字卡 glitch 一闪 + 副字幕 */}
      <p
        style={{
          position: 'absolute',
          top: '73%',
          width: '100%',
          textAlign: 'center',
          fontFamily: mono,
          fontSize: 22,
          letterSpacing: 2,
          color: ELECTRIC_SOFT,
          margin: 0,
          opacity: fade(f, 30),
          transform: glitching ? `translateX(${gj * 6}px)` : undefined,
          textShadow: glitching ? `2px 0 ${ELECTRIC}, -2px 0 ${COLD_WHITE}` : undefined,
        }}
      >
        2026.06.27 · shadow-dev-workflow · initial release
      </p>
      <p style={{ position: 'absolute', top: '80%', width: '100%', textAlign: 'center', fontFamily: serif, fontSize: 34, color: COLD_WHITE, margin: 0, ...inkRise(f, 64) }}>
        他把开发方法本身，也写成了代码
      </p>
    </AbsoluteFill>
  );
};

/* ─── 镜 37（5750–5930）：五段纸舟 —— 五记节拍（本镜 0/40/80/120/160，第四记最重），publish 钤印 + tr-stamp-zoom（§4.4） ─── */
const FLEET = [
  { name: 'propose', zh: '提案卡展开', note: '' },
  { name: 'apply', zh: '双工位并行', note: '分镜师 · UE 大师' },
  { name: 'review', zh: '质量门禁闸门', note: '' },
  { name: 'release', zh: 'PR 光桥', note: '' },
  { name: 'publish', zh: '钤印发版', note: '' },
] as const;
const BEATS = [0, 40, 80, 120, 160];
const BEAT_KICK = [0.014, 0.02, 0.02, 0.05, 0.034];

const Boat: FC<{ i: number; f: number }> = ({ i, f }) => {
  const { fps } = useVideoConfig();
  const seg = FLEET[i];
  const beat = BEATS[i];
  const pop = spring({ frame: f - beat, fps, config: SPRINGS.springPop });
  const lit = f < beat ? 0.22 : interpolate(pop, [0, 1], [0.35, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const flashT = f - beat;
  const flash = flashT >= 0 && flashT < 20 ? Math.pow(1 - flashT / 20, 2) * (i === 3 ? 0.9 : 0.55) : 0;
  return (
    <div
      style={{
        position: 'absolute',
        left: 540 + i * 560 - 110,
        top: 620 - i * 80 - 90 + Math.sin((f + i * 40) / 26) * 8,
        width: 220,
        transform: `scale(${interpolate(pop, [0, 1], [0.94, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })})`,
      }}
    >
      {/* 节拍闪光（第四记 release 最重） */}
      <div style={{ position: 'absolute', left: 45, top: -30, width: 130, height: 130, borderRadius: '50%', background: `radial-gradient(circle, ${COLD_WHITE} 0%, ${ELECTRIC} 40%, transparent 70%)`, opacity: flash, mixBlendMode: 'screen' }} />
      <svg width="220" height="120" viewBox="0 0 220 120" style={{ filter: f >= beat ? `drop-shadow(0 0 ${16 * lit}px ${ELECTRIC})` : undefined }}>
        <line x1="18" y1="78" x2="202" y2="78" stroke={COLD_WHITE} strokeWidth={2.5} opacity={lit} />
        <polygon points="18,78 202,78 162,106 58,106" fill="rgba(77,163,255,0.10)" stroke={ELECTRIC} strokeWidth={2} opacity={lit} />
        <polygon points="108,16 108,78 46,78" fill="rgba(156,200,255,0.08)" stroke={ELECTRIC_SOFT} strokeWidth={2} opacity={lit * 0.95} />
        <polygon points="120,26 120,78 176,78" fill="none" stroke={ELECTRIC} strokeWidth={1.5} opacity={lit * 0.6} />
      </svg>
      <div style={{ textAlign: 'center', marginTop: 6 }}>
        <p style={{ fontFamily: mono, fontSize: 26, letterSpacing: 3, color: COLD_WHITE, margin: 0, opacity: lit }}>{seg.name}</p>
        <p style={{ fontFamily: sans, fontSize: 17, color: COLD_DIM, margin: '4px 0 0', opacity: lit * 0.9 }}>{seg.zh}</p>
        {seg.note ? <p style={{ fontFamily: sans, fontSize: 13, color: ELECTRIC_SOFT, margin: '3px 0 0', opacity: lit * 0.85 }}>{seg.note}</p> : null}
      </div>
      {/* publish 钤印（seal-stamp，第 160 帧拍点） */}
      {i === 4 && f >= 160 ? (
        <div style={{ position: 'absolute', right: -6, top: -22, width: 34, height: 34, background: colors.accent, boxShadow: `0 0 24px ${colors.accent}`, ...sealStamp(f, 160, fps, sealTilt('publish')) }} />
      ) : null}
    </div>
  );
};

const ShotFleet: FC<{ f: number }> = ({ f }) => {
  const camX = interpolate(f, [0, 40, 80, 120, 160, 180], [420, -140, -700, -1260, -1820, -1900], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: CURVES.cineEaseInOut,
  });
  const kick = BEATS.reduce((acc, b, i) => {
    const t = f - b;
    return t >= 0 && t < 14 ? acc + BEAT_KICK[i] * (1 - t / 14) : acc;
  }, 0);
  const stampZoom = interpolate(f, [160, 180], [1, 3], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseIn });
  const bloom = interpolate(f, [168, 180], [0, 0.85], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const cam: CamState = { scale: 1 + kick, x: camX, y: 0, rot: 0 };
  return (
    <AbsoluteFill>
      <CameraRig cam={cam}>
        <div style={{ transform: `scale(${stampZoom})`, transformOrigin: '50% 55%' }}>
          {FLEET.map((seg, i) => (
            <Boat key={seg.name} i={i} f={f} />
          ))}
        </div>
      </CameraRig>
      {/* tr-stamp-zoom：钤印辉光冲满切镜 38 */}
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 55%, ${COLD_WHITE}, transparent 70%)`, opacity: bloom, mixBlendMode: 'screen' }} />
    </AbsoluteFill>
  );
};

/* ─── 镜 38（5930–6120）：归档墙 —— brief 卡瀑布落位（step 渐密，sqrt 落位曲线）+ 40 知识卡星环 orbit；tr-orbit-collapse 收束 ─── */
const ShotArchive: FC<{ f: number }> = ({ f }) => {
  const { fps } = useVideoConfig();
  const truck = interpolate(f, [0, 130], [70, -70], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const pull = interpolate(f, [110, 185], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const collapse = interpolate(f, [165, 190], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseIn });
  const cam: CamState = { scale: 1 - pull * 0.2, x: truck, y: pull * 55, rot: 0 };
  return (
    <AbsoluteFill>
      <CameraRig cam={cam}>
        {/* brief 归档墙（254 格瀑布落位，heavy-glide 基底） */}
        {Array.from({ length: 254 }).map((_, i) => {
          const col = i % 23;
          const row = Math.floor(i / 23);
          const delay = 100 * Math.sqrt(i / 253);
          const p = interpolate(f - delay, [0, 16], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
          const tinted = random('brief-' + i) > 0.78;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: 247 + col * 62,
                top: 360 + row * 46,
                width: 54,
                height: 38,
                borderRadius: 5,
                background: COLD.panelAlt,
                border: `1px solid ${tinted ? ELECTRIC_LINE : 'rgba(126,147,180,0.18)'}`,
                opacity: p * (tinted ? 1 : 0.8),
                transform: `translateY(${(1 - p) * -34}px)`,
                boxShadow: tinted ? '0 0 12px rgba(77,163,255,0.25)' : undefined,
              }}
            />
          );
        })}
        {/* 知识卡星环（40 张 · orbit-drift + tr-orbit-collapse） */}
        <div style={{ position: 'absolute', left: 960, top: 320, transform: 'perspective(1200px) rotateX(55deg)' }}>
          {Array.from({ length: 40 }).map((_, j) => {
            const th = (j / 40) * Math.PI * 2 + (f * Math.PI * 2) / 320 + collapse * collapse * 9;
            const rho = 1 - collapse * 0.96;
            const rise = spring({ frame: f - (90 + j * 1.2), fps, config: SPRINGS.springPop });
            const depth = 0.5 + 0.5 * Math.sin(th);
            return (
              <div
                key={j}
                style={{
                  position: 'absolute',
                  left: Math.cos(th) * 560 * rho - 22,
                  top: Math.sin(th) * 150 * rho - 29,
                  width: 44,
                  height: 58,
                  borderRadius: 6,
                  background: COLD.panelLine,
                  border: `1px solid ${ELECTRIC_LINE}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: rise * (0.35 + 0.65 * depth) * (1 - collapse * 0.3),
                  boxShadow: depth > 0.8 ? '0 0 14px rgba(77,163,255,0.35)' : undefined,
                }}
              >
                <span style={{ fontFamily: mono, fontSize: 15, color: ELECTRIC_SOFT }}>✦</span>
              </div>
            );
          })}
        </div>
        {/* 星环收束亮点 */}
        <div
          style={{
            position: 'absolute',
            left: 934,
            top: 294,
            width: 52,
            height: 52,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${COLD_WHITE}, ${ELECTRIC} 45%, transparent 72%)`,
            opacity: collapse,
            transform: `scale(${0.4 + collapse * 2.4})`,
            mixBlendMode: 'screen',
          }}
        />
      </CameraRig>
      <p style={{ position: 'absolute', top: '84%', width: '100%', textAlign: 'center', fontFamily: mono, fontSize: 16, letterSpacing: 2, color: ELECTRIC_SOFT, margin: 0, opacity: fade(f, 120) }}>
        254 briefs · 40 knowledge cards
      </p>
      <p style={{ position: 'absolute', top: '88%', width: '100%', textAlign: 'center', fontFamily: serif, fontSize: 36, color: COLD_WHITE, margin: 0, opacity: fade(f, 132) }}>
        254 次完整循环 · 40 张知识卡片
      </p>
      {/* 入场余闪（承接 tr-stamp-zoom）+ 收束闪（入镜 39） */}
      <AbsoluteFill style={{ background: COLD_WHITE, opacity: interpolate(f, [0, 12], [0.85, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }), mixBlendMode: 'screen' }} />
      <AbsoluteFill style={{ background: COLD_WHITE, opacity: interpolate(f, [184, 190], [0, 0.9], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }), mixBlendMode: 'screen' }} />
    </AbsoluteFill>
  );
};

/* ─── 镜 39（6120–6240）：双轴交汇 —— path-draw 双时间轴 + data-stream 光点互掷 + tr-converge-burst ─── */
const NODES = [
  { axis: 0, x: 320, label: '06-14 · 上线', at: 36 },
  { axis: 0, x: 1160, label: 'v2.0.0', at: 52 },
  { axis: 1, x: 320, label: '06-27 · 诞生', at: 56 },
  { axis: 1, x: 1160, label: 'v6.3.1', at: 68 },
] as const;
const TOSS = [
  { from: 64, to: 82, x1: 320, y1: 130, x2: 1160, y2: 300, arc: -46 },
  { from: 74, to: 92, x1: 320, y1: 300, x2: 1160, y2: 130, arc: 46 },
] as const;

const ShotAxes: FC<{ f: number }> = ({ f }) => {
  const { fps } = useVideoConfig();
  const dolly = interpolate(f, [0, 90], [1.1, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const cam: CamState = { scale: dolly, x: 0, y: 0, rot: 0 };
  const draw1 = interpolate(f, [8, 42], [1160, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const draw2 = interpolate(f, [26, 60], [1160, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const burst = interpolate(f, [96, 120], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill>
      <CameraRig cam={cam}>
        <svg width="1400" height="420" viewBox="0 0 1400 420" style={{ position: 'absolute', left: 260, top: 330 }}>
          <line x1={120} y1={130} x2={1280} y2={130} stroke={ELECTRIC} strokeWidth={2} strokeDasharray={1160} strokeDashoffset={draw1} opacity={0.9} />
          <line x1={120} y1={300} x2={1280} y2={300} stroke={ELECTRIC_SOFT} strokeWidth={2} strokeDasharray={1160} strokeDashoffset={draw2} opacity={0.75} />
          <text x={40} y={136} fill={COLD_DIM} fontFamily={mono} fontSize={17} opacity={fade(f, 10)}>作品轴</text>
          <text x={40} y={306} fill={COLD_DIM} fontFamily={mono} fontSize={17} opacity={fade(f, 28)}>方法轴</text>
          {NODES.map((n, idx) => {
            const pop = spring({ frame: f - n.at, fps, config: SPRINGS.springPop });
            const y = n.axis === 0 ? 130 : 300;
            return (
              <g key={idx}>
                <circle cx={n.x} cy={y} r={interpolate(pop, [0, 1], [0, 7])} fill={n.axis === 0 ? COLD_WHITE : ELECTRIC_SOFT} opacity={0.95} />
                <text x={n.x} y={n.axis === 0 ? y - 20 : y + 36} textAnchor="middle" fill={ELECTRIC_SOFT} fontFamily={mono} fontSize={18} opacity={Math.min(1, Math.max(0, pop * 6))}>
                  {n.label}
                </text>
              </g>
            );
          })}
        </svg>
        {/* data-stream 光点互掷 ×2 */}
        {TOSS.map((t, i) => {
          const p = interpolate(f, [t.from, t.to], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
          const x = t.x1 + (t.x2 - t.x1) * p;
          const y = t.y1 + (t.y2 - t.y1) * p + t.arc * Math.sin(p * Math.PI);
          const ang = (Math.atan2(t.y2 - t.y1, t.x2 - t.x1) * 180) / Math.PI;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: 260 + x,
                top: 330 + y,
                width: 34,
                height: 5,
                borderRadius: 3,
                background: `linear-gradient(90deg, transparent, ${COLD_WHITE}, ${ELECTRIC})`,
                transform: `translate(-50%, -50%) rotate(${ang}deg)`,
                opacity: p <= 0 ? 0 : 0.95 * (1 - burst),
                mixBlendMode: 'screen',
                filter: `drop-shadow(0 0 8px ${ELECTRIC})`,
              }}
            />
          );
        })}
        {/* tr-converge-burst：交汇爆发（双轴中点） */}
        <div style={{ position: 'absolute', left: 1000, top: 545 }}>
          <div
            style={{
              position: 'absolute',
              left: -110,
              top: -110,
              width: 220,
              height: 220,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${COLD_WHITE} 0%, ${ELECTRIC} 38%, transparent 70%)`,
              opacity: (1 - burst) * 0.95,
              transform: `scale(${0.2 + burst * 3.2})`,
              mixBlendMode: 'screen',
            }}
          />
          {Array.from({ length: 12 }).map((_, r) => (
            <div
              key={r}
              style={{
                position: 'absolute',
                left: -1,
                top: -burst * 150,
                width: 2,
                height: burst * 150,
                background: `linear-gradient(180deg, ${COLD_WHITE}, transparent)`,
                transform: `rotate(${r * 30}deg)`,
                transformOrigin: '50% 100%',
                opacity: (1 - burst) * 0.75,
                mixBlendMode: 'screen',
              }}
            />
          ))}
          {/* 交汇驻点 glow-pulse */}
          <div
            style={{
              position: 'absolute',
              left: -7,
              top: -7,
              width: 14,
              height: 14,
              borderRadius: '50%',
              background: COLD_WHITE,
              opacity: f >= 96 ? 0.5 + 0.2 * Math.sin((f / 60) * Math.PI * 2) : 0,
              boxShadow: `0 0 18px ${ELECTRIC}`,
            }}
          />
        </div>
      </CameraRig>
      <p style={{ position: 'absolute', top: '87%', width: '100%', textAlign: 'center', fontFamily: serif, fontSize: 36, color: COLD_WHITE, margin: 0, opacity: fade(f, 58) }}>
        方法与作品，一起长大
      </p>
      <AbsoluteFill style={{ background: COLD_WHITE, opacity: interpolate(f, [0, 10], [0.9, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }), mixBlendMode: 'screen' }} />
    </AbsoluteFill>
  );
};

/* ─── 镜 40（6240–6450）★ Meta 穿屏 —— recurse-zoom 递归拉出 + 代理铭牌双光标；tr-screen-bleed ★（§4.4） ─── */
const Panel: FC<{ w: number; h: number; opacity?: number; children: ReactNode }> = ({ w, h, opacity = 1, children }) => (
  <div
    style={{
      position: 'absolute',
      left: '50%',
      top: '48%',
      transform: 'translate(-50%, -50%)',
      width: w,
      height: h,
      borderRadius: 14,
      background: COLD.gradient,
      border: `1.5px solid ${ELECTRIC_LINE}`,
      boxShadow: '0 0 40px rgba(77,163,255,0.10)',
      opacity,
      overflow: 'hidden',
    }}
  >
    {children}
  </div>
);

const ShotMeta: FC<{ f: number }> = ({ f }) => {
  const camScale = interpolate(f, [0, 165, 210], [1.18, 0.5, 0.42], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: CURVES.cineEaseInOut,
  });
  const camY = interpolate(f, [0, 165], [0, 44], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const opB = interpolate(f, [26, 58], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const opC = interpolate(f, [88, 128], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const bleed = interpolate(f, [185, 208], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const bezGlow = interpolate(f, [160, 185], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  const cam: CamState = { scale: camScale, x: 0, y: camY, rot: 0 };
  const caret1 = Math.floor(f / 12) % 2 === 0;
  return (
    <AbsoluteFill>
      <CameraRig cam={cam}>
        {/* C：工作台外屏 */}
        <Panel w={820} h={540} opacity={opC}>
          <div style={{ position: 'absolute', left: 170, bottom: 8, width: 480, height: 60, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(77,163,255,0.14), transparent 70%)' }} />
          {/* B：工作流屏（recurse-zoom 预缩层 0.94） */}
          <Panel w={720} h={470} opacity={opB}>
            {/* 代理铭牌 ×2 · caret-glow 双光标协作 */}
            <div style={{ position: 'absolute', left: 20, top: 14, display: 'flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 999, border: `1px solid ${ELECTRIC_LINE}`, background: COLD.pill }}>
              <span style={{ fontFamily: sans, fontSize: 15, color: COLD_WHITE }}>分镜师</span>
              <span style={{ fontFamily: mono, fontSize: 15, color: ELECTRIC, opacity: caret1 ? 1 : 0.08 }}>▍</span>
            </div>
            <div style={{ position: 'absolute', right: 20, top: 14, display: 'flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 999, border: `1px solid ${ELECTRIC_LINE}`, background: COLD.pill }}>
              <span style={{ fontFamily: sans, fontSize: 15, color: COLD_WHITE }}>UE 动效大师</span>
              <span style={{ fontFamily: mono, fontSize: 15, color: ELECTRIC_SOFT, opacity: caret1 ? 0.08 : 1 }}>▍</span>
            </div>
            {/* A：分镜脚本屏（0.94^2 递归层） */}
            <Panel w={620} h={390}>
              <div style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, display: 'flex', flexWrap: 'wrap', gap: 10, padding: '34px 22px 30px', alignContent: 'center', justifyContent: 'center' }}>
                {['镜36', '镜37', '镜38', '镜39', '镜40', '镜41'].map((s, i) => (
                  <div key={s} style={{ width: 172, height: 104, borderRadius: 6, background: COLD.panelDeep, border: `1px solid ${i === 4 ? ELECTRIC : ELECTRIC_LINE}`, position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 8, top: 6, fontFamily: mono, fontSize: 12, color: i === 4 ? ELECTRIC : COLD_DIM }}>{s}</span>
                    <div style={{ position: 'absolute', left: 8, width: '55%', bottom: 18, height: 2, background: 'rgba(126,147,180,0.2)' }} />
                    <div style={{ position: 'absolute', left: 8, right: 8, bottom: 10, height: 2, background: ELECTRIC_LINE }} />
                  </div>
                ))}
              </div>
              <p style={{ position: 'absolute', bottom: 8, width: '100%', textAlign: 'center', fontFamily: mono, fontSize: 11, letterSpacing: 3, color: COLD_DIM, margin: 0 }}>STORYBOARD · SHADOW-DEV-WORKFLOW</p>
            </Panel>
            {/* B 底部时间线 */}
            <div style={{ position: 'absolute', left: 30, right: 30, bottom: 12, height: 3, background: 'rgba(126,147,180,0.18)', borderRadius: 2 }}>
              <div style={{ width: `${interpolate(f, [0, 165], [8, 92], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}%`, height: '100%', background: ELECTRIC, borderRadius: 2 }} />
            </div>
          </Panel>
        </Panel>
      </CameraRig>
      {/* tr-screen-bleed ★：外框辉光涨满 → 边框 scale 1.06 + blur 化入镜 41 黑底（边框即转场遮罩） */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '48%',
          width: 1560,
          height: 940,
          transform: `translate(-50%, -50%) scale(${1 + bleed * 0.06})`,
          borderRadius: 18,
          border: `2px solid ${ELECTRIC}`,
          boxShadow: `0 0 ${30 + bezGlow * 180}px ${bezGlow * 46}px rgba(77,163,255,0.5)`,
          opacity: interpolate(f, [160, 180], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) * (1 - bleed),
          filter: `blur(${bleed * 12}px)`,
        }}
      />
      <p
        style={{
          position: 'absolute',
          top: '87%',
          width: '100%',
          textAlign: 'center',
          fontFamily: serif,
          fontSize: 38,
          color: COLD_WHITE,
          margin: 0,
          opacity: fade(f, 74) * (1 - interpolate(f, [185, 198], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })),
        }}
      >
        这部片子，也是工作流的一次心跳
      </p>
      <AbsoluteFill style={{ background: BLEED_BLACK, opacity: bleed }} />
    </AbsoluteFill>
  );
};

/* ─── 镜 41（6450–6550）：英文落款 —— write-fade + ink-rise；tr-dust-disperse（本镜 65–100，尾填 6540–6560 半拍） ─── */
const ShotSignature: FC<{ f: number }> = ({ f }) => {
  const disperse = interpolate(f, [68, 98], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseIn });
  return (
    <AbsoluteFill style={{ background: BLEED_BLACK }}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: '44%',
          textAlign: 'center',
          opacity: 1 - disperse,
          transform: `translateY(${-disperse * 16}px)`,
          filter: `blur(${disperse * 5}px)`,
        }}
      >
        <p style={{ fontFamily: serif, fontSize: 42, letterSpacing: 1.5, color: COLD_WHITE, margin: 0, ...writeFade(f, 8) }}>
          This film is made with shadow-dev-workflow
        </p>
        <div style={{ width: 64, height: 1, background: colors.accent, opacity: 0.55 * fade(f, 26), margin: '26px auto' }} />
        <p style={{ fontFamily: sans, fontSize: 20, letterSpacing: 8, color: COLD_DIM, margin: 0, ...inkRise(f, 38) }}>
          以工作流之名
        </p>
      </div>
      {/* 字迹化作光尘飘散 */}
      {Array.from({ length: 14 }).map((_, i) => {
        const mx = 560 + random('mote-x' + i) * 800;
        const my = 430 + random('mote-y' + i) * 200;
        const mo = interpolate(f, [70, 82], [0, 0.9], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) * (1 - interpolate(f, [86, 98], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
        return <div key={i} style={{ position: 'absolute', left: mx, top: my - disperse * 46, width: 3, height: 3, borderRadius: 1.5, background: i % 4 === 3 ? colors.accent : COLD_WHITE, opacity: mo }} />;
      })}
    </AbsoluteFill>
  );
};

/* ─── Act 6 光尘：快档 40 颗，冷白 70 / 电蓝 20 / 金 10（§3.1 第六幕配色） ─── */
const ColdDust: FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      {Array.from({ length: 40 }).map((_, i) => {
        const seed = i * 89 + 7;
        const x0 = (seed * 13) % 1920;
        const size = 2 + (seed % 3);
        const roll = seed % 10;
        const tint = roll < 7 ? COLD_WHITE : roll < 9 ? ELECTRIC : WARM_GOLD;
        const y = ((seed * 29 + frame) % 1180) - 60;
        const sway = Math.sin((frame + seed) / 34) * 20;
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
              background: tint,
              opacity: 0.2 + breathe * 0.4,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

const SHOTS: Array<{ from: number; to: number; Board: FC<{ f: number }> }> = [
  { from: 0, to: 150, Board: ShotTerminal },
  { from: 150, to: 330, Board: ShotFleet },
  { from: 330, to: 520, Board: ShotArchive },
  { from: 520, to: 640, Board: ShotAxes },
  { from: 640, to: 850, Board: ShotMeta },
  { from: 850, to: 950, Board: ShotSignature },
];

// Act 6 影子工作流（5600–6550，本地帧 0–950；幕调色 grade-electric-blue：冷白电蓝机械节拍）
export const Act6: FC = () => {
  const frame = useCurrentFrame();
  const local = frame;
  const shot = SHOTS.find((s) => local >= s.from && local < s.to) ?? SHOTS[0];
  const Board = shot.Board;
  return (
    <AbsoluteFill style={{ background: COLD_BG }}>
      <AbsoluteFill style={{ filter: 'saturate(0.85)' }}>
        <Board f={local - shot.from} />
        <ColdDust />
      </AbsoluteFill>
      {/* grade-electric-blue（motion-tokens GRADES[5]）：LUT/雾光见 GRADES[5] + saturate 0.85（内容层） */}
      <AbsoluteFill style={{ background: GRADES[5].lut.color, mixBlendMode: 'multiply', opacity: 0.5 }} />
      <AbsoluteFill style={{ background: COLD.coldWhite, mixBlendMode: 'screen', opacity: 0.1 }} />
    </AbsoluteFill>
  );
};
