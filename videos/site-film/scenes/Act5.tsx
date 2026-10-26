import type { FC, CSSProperties } from 'react';
import { AbsoluteFill, interpolate, random, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, glowPulse, GRADES, inkRise, paperBreathe, writeFade } from '../motion-tokens';
import { CameraRig, ParallaxLayer } from '../components/CameraRig';
import { DustField } from './Act1';

const serif = fontFamilies.serif;
const sans = fontFamilies.sans;
const mono = fontFamilies.mono;

const CLAMP = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

/* ─── §5.7 极简呼吸档 · 慢档令牌实现（write-fade 慢档/ink-rise/paper-breathe/glow-pulse 复用 motion-tokens） ─── */

/** ink-bloom 洇开慢档（90f）：三层 blur 墨团错峰洇开，墨入纸纤维 */
const inkBloom = (frame: number, delay: number, layer: 0 | 1 | 2): CSSProperties => {
  const p = interpolate(frame - delay, [0, 90], [0, 1], { ...CLAMP, easing: CURVES.cineEaseOut });
  const layers = [
    { blur: 12, op: 0.055, grow: 74 },
    { blur: 6, op: 0.042, grow: 46 },
    { blur: 2, op: 0.03, grow: 24 },
  ] as const;
  const c = layers[layer];
  return { filter: `blur(${c.blur}px)`, opacity: c.op * p, transform: `scale(${0.2 + p * (c.grow / 100)})` };
};

/** path-draw 慢档（60f）：返回 strokeDashoffset，起收笔呼吸 */
const pathDrawSlow = (frame: number, delay: number, len: number): number =>
  len - interpolate(frame - delay, [0, 60], [0, len], { ...CLAMP, easing: CURVES.cineEaseInOut });

/** photo-develop 拍立得显影（45f）：过曝 → 成像 */
const photoDevelop = (frame: number, delay: number): CSSProperties => {
  const p = interpolate(frame - delay, [0, 45], [0, 1], { ...CLAMP, easing: CURVES.cineEaseOut });
  return { filter: `brightness(${1.5 - p * 0.5}) saturate(${p}) blur(${(1 - p) * 3}px)` };
};

/** heavy-glide 拍立得落纸（≤40f）：过阻尼滑落 + 落定 ±1° 微旋归正 + 2px 微沉降，无回弹 */
const polaroidLand = (frame: number, delay: number, dropY: number, tilt: number): CSSProperties => {
  const t = frame - delay;
  const fall = interpolate(t, [0, 30], [0, 1], { ...CLAMP, easing: CURVES.cineEaseOut });
  const sink = interpolate(t, [30, 35, 40], [0, 2, 0], CLAMP);
  const rot = interpolate(t, [0, 30, 40], [tilt * 2.2, tilt, 0], { ...CLAMP, easing: CURVES.cineEaseOut });
  return {
    transform: `translateY(${(1 - fall) * dropY + sink}px) rotate(${rot}deg)`,
    opacity: interpolate(t, [0, 3], [0, 1], CLAMP),
  };
};

/** cam-drift 减半档：固定机位的呼吸（±2px / ±0.075°，120f 周期） */
const camDrift = (frame: number): { x: number; y: number; rot: number } => ({
  x: Math.sin((frame / 120) * Math.PI * 2 + 1.3) * 2,
  y: Math.cos((frame / 120) * Math.PI * 2 + 1.1) * 2,
  rot: Math.sin((frame / 120) * Math.PI * 2 + 0.6) * 0.075,
});

/* ─── 镜 32（4700–5000 · 本地 0–300）坐忘歌诗影 —— 全片最慢一镜 ───
   事件预算 4/5：句 1 显影 40（4740）、句 2 显影 160（4860，句级间隔 120f ≥ 90f）、
   角落小字 ink-rise 230（4930）、tr-verse-fold 起势 260（4960）；其余交给纸面呼吸 + 墨洇 + 光尘极缓漂浮 */
const VERSE = ['不怒百神和畅，', '不恼心地清凉。'] as const;

const ShotVerse: FC = () => {
  const frame = useCurrentFrame();
  const drift = camDrift(frame);
  const dolly = interpolate(frame, [0, 300], [0, 0.005], { ...CLAMP, easing: CURVES.cineEaseInOut }); // cam-dolly-in 超慢档 0.5%
  const fold = interpolate(frame, [260, 300], [0, 1], { ...CLAMP, easing: CURVES.cineEaseInOut }); // tr-verse-fold ★
  const cam = { scale: 1 + dolly, x: drift.x, y: drift.y, rot: drift.rot, origin: '50% 46%' };
  return (
    <CameraRig cam={cam}>
      {/* 前景一炷虚化光尘（gold-drift 极缓档，景深虚化层） */}
      <ParallaxLayer depth={0.45} cam={cam} blurBase={7}>
        <div
          style={{
            position: 'absolute',
            left: 1330 + Math.sin((frame / 240) * Math.PI * 2) * 18,
            top: -90,
            width: 320,
            height: 1260,
            background: `radial-gradient(ellipse at 50% 32%, ${colors.accent}, transparent 72%)`,
            opacity: 0.1,
            filter: 'blur(34px)',
          }}
        />
      </ParallaxLayer>
      <ParallaxLayer depth={1} cam={cam}>
        <div style={{ ...paperBreathe(frame, 0.5) }}>
          <div style={{ position: 'absolute', left: 460, top: 330, width: 1000, perspective: 1400 }}>
            <div style={{ transform: `rotateY(${-90 * fold}deg)`, transformOrigin: 'left center', position: 'relative' }}>
              {VERSE.map((line, i) => {
                const delay = i === 0 ? 40 : 160;
                return (
                  <div key={line} style={{ position: 'relative', margin: '36px 0', transform: `translateY(${-10 * fold}px)`, opacity: 1 - fold * 0.7 }}>
                    <div style={{ position: 'absolute', left: -36, top: -30, width: 620, height: 128, ...inkBloom(frame, delay, 0) }} />
                    <div style={{ position: 'absolute', left: -20, top: -16, width: 560, height: 104, ...inkBloom(frame, delay, 1) }} />
                    <div style={{ position: 'absolute', left: -6, top: -4, width: 500, height: 84, ...inkBloom(frame, delay, 2) }} />
                    <p style={{ ...writeFade(frame, delay, true), position: 'relative', fontFamily: serif, fontSize: 62, lineHeight: 1.4, color: colors.ink, letterSpacing: '0.16em', margin: 0 }}>
                      {line}
                    </p>
                  </div>
                );
              })}
              {/* 纸缘阴影（翻动时右缘投影位移） */}
              <div style={{ position: 'absolute', right: 0, top: 0, width: 12, height: '100%', background: colors.ink, opacity: 0.08 * fold, filter: 'blur(6px)' }} />
            </div>
          </div>
        </div>
        {/* 角落小字（4930 = 本地 230，ink-rise） */}
        <p style={{ ...inkRise(frame, 230), position: 'absolute', right: 150, bottom: 128, fontFamily: mono, fontSize: 17, color: colors.muted }}>
          《再读〈坐忘歌〉》 · 1,673 次阅读
        </p>
      </ParallaxLayer>
    </CameraRig>
  );
};

/* ─── 镜 33（5000–5250 · 本地 300–550）书墙书摘 ───
   dof-parallax 书封墙投影层叠 + cam-truck 横移 → cam-dolly-in 缓推抽出的书 +
   path-draw 慢档 ×3（错 40f）+ glow-pulse 微光档；出场 tr-book-to-photo 合拢化作拍立得白框 */
const BOOK_TONES: readonly string[] = [colors.paperDeep, colors.paperMuted, colors.accent, colors.muted];

const Spine: FC<{ i: number; w: number; h: number }> = ({ i, w, h }) => (
  <div
    style={{
      width: w,
      height: h + ((i * 13) % 18),
      borderRadius: '3px 3px 2px 2px',
      background: BOOK_TONES[(i * 7) % BOOK_TONES.length],
      opacity: 0.88,
      boxShadow: `inset 3px 0 0 ${colors.paper}`,
      position: 'relative',
    }}
  >
    <div style={{ position: 'absolute', left: 9, top: 12 + ((i * 11) % 22), width: 2, height: h * 0.34, background: colors.paper, opacity: 0.55 }} />
  </div>
);

const ShotBookWall: FC = () => {
  const frame = useCurrentFrame();
  const drift = camDrift(frame);
  const truck = interpolate(frame, [300, 450], [46, -46], { ...CLAMP, easing: CURVES.cineEaseInOut });
  const dolly = interpolate(frame, [430, 550], [0, 0.1], { ...CLAMP, easing: CURVES.cineEaseInOut });
  const cam = { scale: 1 + dolly, x: truck + drift.x, y: drift.y, rot: drift.rot, origin: '58% 44%' };
  const wallBlur = interpolate(frame, [400, 480], [0, 5], CLAMP); // 浅景深：推近时书墙退虚
  const pulled = interpolate(frame, [360, 400], [0, 1], { ...CLAMP, easing: CURVES.cineEaseInOut });
  const spreadP = interpolate(frame, [380, 420], [0, 1], { ...CLAMP, easing: CURVES.cineEaseOut });
  const closeP = interpolate(frame, [515, 550], [0, 1], { ...CLAMP, easing: CURVES.cineEaseInOut }); // tr-book-to-photo 合拢
  const ghostP = interpolate(frame, [542, 550], [0, 1], CLAMP); // 拍立得白框 8f 交叉淡变
  return (
    <CameraRig cam={cam}>
      <ParallaxLayer depth={0.6} cam={cam} blurBase={8}>
        {[150, 252].map((top, r) => (
          <div key={top} style={{ position: 'absolute', left: -40, top, display: 'flex', gap: 8, filter: `blur(${wallBlur}px)` }}>
            {Array.from({ length: 26 }).map((_, i) => (
              <Spine key={i} i={i + r * 26} w={56} h={82} />
            ))}
          </div>
        ))}
      </ParallaxLayer>
      <ParallaxLayer depth={1} cam={cam}>
        <div style={{ position: 'absolute', left: -60, top: 368, display: 'flex', gap: 9, alignItems: 'flex-end', filter: `blur(${wallBlur * 0.5}px)` }}>
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} style={{ position: 'relative', transform: `translateY(${i === 15 ? pulled * -30 : 0}px)` }}>
              <Spine i={i + 60} w={66} h={96} />
              {i === 15 ? (
                <span
                  style={{
                    position: 'absolute',
                    top: -26,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontFamily: sans,
                    fontSize: 13,
                    whiteSpace: 'nowrap',
                    background: colors.accent,
                    color: colors.ink,
                    borderRadius: 9,
                    padding: '2px 10px',
                    opacity: pulled,
                  }}
                >
                  阅读中
                </span>
              ) : null}
            </div>
          ))}
        </div>
        <div style={{ position: 'absolute', left: -80, right: -80, top: 486, height: 8, background: colors.paperMuted, opacity: 0.9 }} />
        {/* 摊开的划线书摘（书墙虚化之上） */}
        <div
          style={{
            position: 'absolute',
            left: 660,
            top: 214,
            width: 600,
            height: 400,
            opacity: spreadP * (1 - ghostP),
            transform: `translateY(${(1 - spreadP) * 26}px) scale(${1 - closeP * 0.03})`,
          }}
        >
          <div style={{ position: 'absolute', left: 30, top: 40, width: 560, height: 380, background: colors.ink, opacity: 0.15, filter: 'blur(24px)', borderRadius: 24 }} />
          <div style={{ ...glowPulse(frame, 0.8, 120), position: 'relative', display: 'flex', width: '100%', height: '100%', background: colors.paper, borderRadius: 6 }}>
            {/* 左页 */}
            <div style={{ width: 300, padding: '40px 28px', borderRight: `1px solid ${colors.paperMuted}`, boxSizing: 'border-box' }}>
              {[214, 242, 186, 238, 204].map((w, i) => (
                <div key={i} style={{ width: w, height: 12, background: colors.paperDeep, borderRadius: 6, marginBottom: 24 }} />
              ))}
            </div>
            {/* 右页：划线书摘（path-draw 慢档 ×3，错 40f）+ 合拢翻页 */}
            <div
              style={{
                width: 300,
                padding: '36px 28px',
                boxSizing: 'border-box',
                transformOrigin: 'left center',
                transform: `rotateY(${-165 * closeP}deg)`,
                background: colors.paper,
                borderRadius: '0 6px 6px 0',
              }}
            >
              {[0, 1, 2].map((i) => (
                <div key={i} style={{ marginBottom: 26 }}>
                  <div style={{ width: [224, 202, 238][i], height: 12, background: colors.paperDeep, borderRadius: 6, marginBottom: 10 }} />
                  <div style={{ width: [188, 168, 200][i], height: 12, background: colors.paperDeep, borderRadius: 6, marginBottom: 12, opacity: 0.6 }} />
                  <svg width={250} height={8}>
                    <line x1={0} y1={4} x2={250} y2={4} stroke={colors.accent} strokeWidth={3} strokeLinecap="round" strokeDasharray={250} strokeDashoffset={pathDrawSlow(frame, 400 + i * 40, 250)} opacity={0.9} />
                  </svg>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* tr-book-to-photo：合拢瞬间拍立得白框落纸（8f crossfade） */}
        <div style={{ position: 'absolute', left: 840, top: 264, width: 240, height: 300, opacity: ghostP, transform: `scale(${0.96 + ghostP * 0.04})` }}>
          <div style={{ position: 'absolute', left: 12, top: 20, width: 220, height: 280, background: colors.ink, opacity: 0.14, filter: 'blur(18px)', borderRadius: 16 }} />
          <div style={{ position: 'relative', width: '100%', height: '100%', background: colors.paper, borderRadius: 6, padding: 12, boxSizing: 'border-box' }}>
            <div style={{ width: '100%', height: '100%', background: colors.paperMuted }} />
          </div>
        </div>
        <p style={{ ...writeFade(frame, 450, true), position: 'absolute', left: 0, right: 0, bottom: 128, textAlign: 'center', fontFamily: serif, fontSize: 34, color: colors.ink, letterSpacing: '0.06em', margin: 0 }}>
          读过的每一行，都长进了骨头里
        </p>
      </ParallaxLayer>
    </CameraRig>
  );
};

/* ─── 镜 34（5250–5500 · 本地 550–800）足迹拍立得 ───
   heavy-glide 落纸（5300/5380 = 本地 600/680）+ photo-develop（45f 各随其后）+
   cam-hold/drift/dolly-in 缓慢微推 + glow-pulse 极淡档地图光点；出场 tr-photo-ascend 升散 */
const SeaScene: FC = () => (
  <div style={{ position: 'relative', width: '100%', height: '100%', background: `linear-gradient(${colors.paper} 0%, ${colors.paperMuted} 58%, ${colors.accent} 62%, ${colors.muted} 100%)` }}>
    <div style={{ position: 'absolute', right: 44, top: 24, width: 42, height: 42, borderRadius: 21, background: colors.accent, opacity: 0.9 }} />
    <div style={{ position: 'absolute', left: -26, bottom: -34, width: 210, height: 120, background: colors.ink, opacity: 0.3, borderRadius: '58% 42% 0 0', transform: 'rotate(5deg)' }} />
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 66, height: 2, background: colors.paper, opacity: 0.7 }} />
  </div>
);

const MountainScene: FC = () => (
  <div style={{ position: 'relative', width: '100%', height: '100%', background: `linear-gradient(${colors.paper} 0%, ${colors.paperMuted} 68%, ${colors.accent} 100%)` }}>
    <svg width="100%" height="100%" viewBox="0 0 308 212" preserveAspectRatio="none">
      <polygon points="0,212 98,72 192,212" fill={colors.muted} opacity={0.55} />
      <polygon points="112,212 208,44 308,212" fill={colors.ink} opacity={0.32} />
      <rect x="0" y="148" width="308" height="28" fill={colors.paper} opacity={0.5} />
    </svg>
  </div>
);

const FootprintCard: FC<{
  label: string;
  date: string;
  delay: number;
  tilt: number;
  x: number;
  y: number;
  scene: 'sea' | 'mountain';
}> = ({ label, date, delay, tilt, x, y, scene }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: 'absolute', left: x, top: y, ...polaroidLand(frame, delay, 130, tilt) }}>
      <div style={{ position: 'absolute', left: 14, top: 30, width: 312, height: 250, background: colors.ink, opacity: 0.13, filter: 'blur(22px)', borderRadius: 20 }} />
      <div style={{ position: 'relative', width: 336, background: colors.paper, borderRadius: 4, padding: 14, boxSizing: 'border-box' }}>
        <div style={{ width: 308, height: 212, overflow: 'hidden', ...photoDevelop(frame, delay) }}>{scene === 'sea' ? <SeaScene /> : <MountainScene />}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '14px 4px 0' }}>
          <span style={{ fontFamily: serif, fontSize: 21, color: colors.ink }}>{label}</span>
          <span style={{ fontFamily: mono, fontSize: 14, color: colors.muted }}>{date}</span>
        </div>
      </div>
    </div>
  );
};

const ShotFootprints: FC = () => {
  const frame = useCurrentFrame();
  const drift = camDrift(frame);
  const dolly = interpolate(frame, [550, 800], [0, 0.06], { ...CLAMP, easing: CURVES.cineEaseInOut }); // 缓慢微推
  const ascend = interpolate(frame, [760, 800], [0, 1], { ...CLAMP, easing: CURVES.cineEaseOut }); // tr-photo-ascend（40f）
  const cam = { scale: 1 + dolly, x: drift.x, y: drift.y, rot: drift.rot, origin: '50% 48%' };
  return (
    <CameraRig cam={cam}>
      {/* 背景极淡的地图光点呼吸（glow-pulse 极淡档） */}
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} style={{ ...glowPulse(frame, 0.4, [80, 100, 120][i % 3]), position: 'absolute', left: 280 + ((i * 173) % 1340), top: 170 + ((i * 97) % 660) }}>
          <div style={{ position: 'absolute', left: -8, top: -8, width: 23 + (i % 3) * 2, height: 23 + (i % 3) * 2, borderRadius: '50%', background: colors.accent, opacity: 0.1, filter: 'blur(5px)' }} />
          <div style={{ width: 7 + (i % 3) * 2, height: 7 + (i % 3) * 2, borderRadius: '50%', background: colors.accent, opacity: 0.16 }} />
        </div>
      ))}
      {/* 照片与字幕：升散出画（translateY −60 + blur + fade） */}
      <div style={{ position: 'absolute', inset: 0, opacity: 1 - ascend, transform: `translateY(${-60 * ascend}px)`, filter: `blur(${4 * ascend}px)` }}>
        <FootprintCard label="杨梅坑" date="2025-08-15" delay={600} tilt={-1.1} x={420} y={252} scene="sea" />
        <FootprintCard label="梧桐山" date="2025-09-20" delay={680} tilt={1.2} x={986} y={330} scene="mountain" />
        <p style={{ ...writeFade(frame, 700, true), position: 'absolute', left: 0, right: 0, bottom: 138, textAlign: 'center', fontFamily: serif, fontSize: 34, color: colors.ink, letterSpacing: '0.05em', margin: 0 }}>
          2025，网站沉默的那一年——他仍在认真地生活
        </p>
      </div>
      {/* 光尘升散（dust-ascend 暖变体，40 颗确定性粒子） */}
      {Array.from({ length: 40 }).map((_, i) => {
        const t0 = 762 + (i % 12) * 3;
        const p = interpolate(frame, [t0, t0 + 36], [0, 1], { ...CLAMP, easing: CURVES.cineEaseOut });
        if (p <= 0 || p >= 1) return null;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 400 + ((i * 211) % 1120),
              top: 300 + ((i * 137) % 430) - 90 * p,
              width: 3 + (i % 3),
              height: 3 + (i % 3),
              borderRadius: '50%',
              background: i % 10 === 9 ? colors.paperMuted : colors.accent,
              opacity: (1 - p) * 0.8,
            }}
          />
        );
      })}
    </CameraRig>
  );
};

/* ─── 镜 35（5500–5600 · 本地 800–900）光标承转 ───
   converge-point 纵深灭点变体 + cam-dolly-out 缓慢后拉入暗；
   tr-cursor-cut ★：光标三闪 820/840/860（各 6f），第三记亮起保持至 900 硬切入 Act 6 */
const ShotCursorHandover: FC = () => {
  const frame = useCurrentFrame();
  const local = frame;
  const dark = interpolate(frame, [800, 834], [0, 1], { ...CLAMP, easing: CURVES.cineEaseInOut }); // 纸底溶入黑暗
  const pull = interpolate(frame, [800, 900], [0, 1], { ...CLAMP, easing: CURVES.cineEaseInOut });
  const dim = interpolate(frame, [866, 900], [0, 0.3], CLAMP); // 缓慢入暗（溶解档）
  const flashOn = (local >= 20 && local < 26) || (local >= 40 && local < 46) || local >= 60;
  return (
    <AbsoluteFill style={{ background: colors.bg, opacity: dark }}>
      <AbsoluteFill style={{ transform: `scale(${1 - pull * 0.06})` }}>
        {/* converge-point（纵深灭点变体）：光尘向屏幕深处聚去 */}
        {Array.from({ length: 36 }).map((_, i) => {
          const sx = 960 + (random(`a5cx${i}`) - 0.5) * 1760;
          const sy = 540 + (random(`a5cy${i}`) - 0.5) * 1000;
          const p = interpolate(frame, [806 + (i % 6) * 6, 896], [0, 1], { ...CLAMP, easing: CURVES.cineEaseIn });
          const size = (2 + random(`a5cs${i}`) * 3) * (1 - p * 0.65);
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: sx + (960 - sx) * p,
                top: sy + (486 - sy) * p,
                width: size,
                height: size,
                borderRadius: '50%',
                background: i % 10 === 9 ? colors.paperMuted : colors.accent,
                opacity: 0.55 - p * 0.35,
              }}
            />
          );
        })}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 38 }}>
          <p style={{ ...writeFade(frame, 812, true), fontFamily: serif, fontSize: 40, color: colors.paper, letterSpacing: '0.08em', margin: 0 }}>
            然后，他把这些热爱，写成了方法。
          </p>
          <div style={{ position: 'relative', width: 20, height: 30 }}>
            <div style={{ position: 'absolute', left: -15, top: -17, width: 50, height: 64, borderRadius: 25, background: colors.accent, opacity: flashOn ? 0.5 : 0.06, filter: 'blur(16px)' }} />
            <div style={{ position: 'relative', width: 20, height: 30, borderRadius: 3, background: colors.accent, opacity: flashOn ? 1 : 0.12 }} />
          </div>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: colors.bg, opacity: dim }} />
    </AbsoluteFill>
  );
};

const SHOTS: Array<{ from: number; to: number; Board: FC }> = [
  { from: 0, to: 300, Board: ShotVerse },
  { from: 300, to: 550, Board: ShotBookWall },
  { from: 550, to: 800, Board: ShotFootprints },
  { from: 800, to: 900, Board: ShotCursorHandover },
];

// Act 5 创作人文（4700–5600，镜 32–35；SiteFilm 以 <Sequence from={4700}> 挂载，镜内帧已归零）
// 本地帧 = 绝对帧 − 4700；§5.7 极简呼吸档：禁弹性过冲/急推/强光效/glitch，句级事件间隔 ≥90f，镜 32 事件预算 ≤5
// 幕调色 grade-warm-paper（GRADES[4]）：soft-light 30% + 纸白 screen 8% + saturate 0.95，宣纸质感提亮为主背景
export const Act5: FC = () => {
  const frame = useCurrentFrame();
  const shot = SHOTS.find((s) => frame >= s.from && frame < s.to) ?? SHOTS[0];
  const Board = shot.Board;
  const grade = GRADES[4];
  return (
    <AbsoluteFill style={{ background: colors.paper, filter: `saturate(${grade.filter.saturate})` }}>
      <Board />
      <div style={{ position: 'absolute', inset: 0, mixBlendMode: 'multiply' }}>
        <DustField act={5} />
      </div>
      <AbsoluteFill style={{ background: grade.lut.color, mixBlendMode: grade.lut.blend, opacity: grade.lut.opacity }} />
      <AbsoluteFill style={{ background: grade.veil.color, mixBlendMode: grade.veil.blend, opacity: grade.veil.opacity }} />
      {/* 开场 24f 溶解：由暗入暖纸（镜 31→32 晕开入暖纸的收尾呼吸） */}
      <AbsoluteFill style={{ background: colors.bg, opacity: interpolate(frame, [0, 24], [0.85, 0], { ...CLAMP, easing: CURVES.cineEaseOut }) }} />
    </AbsoluteFill>
  );
};
