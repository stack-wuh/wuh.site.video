import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import {
  ANCHORS,
  CURVES,
  TYPE,
  eqBars,
  glowPulse,
  inkRise,
  numRoll,
  paperBreathe,
  sealStamp,
  sealTilt,
  writeFade,
  GRADES,
  WARM_GOLD,
} from '../motion-tokens';
import { DustField } from './Act1';

const serif = fontFamilies.serif;
const mono = fontFamilies.mono;

const CLAMP = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const fade = (f: number, at: number) => interpolate(f, [at, at + 14], [0, 1], CLAMP);
const GOLD = WARM_GOLD; // 暖金光尘（DUST 7）

/* tr-star-toss（§4.2）：柱顶光点抛物线 y = −v·t + ½g·t²，6720 起跨切点 20f，余辉延入镜 43 前 10f */
const tossY = (t: number) => -9 * t + 0.5 * 0.6 * t * t;

/* 镜 42（6550–6730）：年度冲顶 —— 八柱 stagger 生长（6560 起效 step 4f）+ cam-truck → cam-rush（6700→6720, ×1.8）
   + num-roll 收数于 6720 整拍 + tr-star-toss 跨切点 [材料§五·年度浏览量] */
const YEARS = ['2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026'];
const ANNUAL = [3117, 3563, 3935, 2139, 2183, 2319, 0, 4387]; // 合计 21,643
const BAR_W = 74;
const BAR_STEP = 140;
const CHART_BASE = 430;
const MAX_H = 340;
const PEAK = { x: 7 * BAR_STEP + BAR_W / 2, y: CHART_BASE - MAX_H }; // 2026 柱顶 = rush origin

const ShotSummit: FC = () => {
  const frame = useCurrentFrame();
  const local = frame;
  const rushFrom = ANCHORS.rush42.from - ANCHORS.act7; // 150
  const rushTo = ANCHORS.rush42.to - ANCHORS.act7; // 170
  const truck = interpolate(local, [10, rushFrom], [90, 0], { ...CLAMP, easing: CURVES.cineEaseInOut });
  const rush = interpolate(local, [rushFrom, rushTo], [1, ANCHORS.rush42.scale], { ...CLAMP, easing: CURVES.cineEaseIn });
  const roll = numRoll(frame, 130, 40, 0, 4387);
  const t = frame - 170; // 星抛进度（6720 = Act7 局部 170 起跨切点）
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div
        style={{
          position: 'relative',
          width: 7 * BAR_STEP + BAR_W,
          height: 480,
          transform: `translateX(${truck}px) scale(${rush})`,
          transformOrigin: `${PEAK.x}px ${PEAK.y}px`,
        }}
      >
        <div style={{ position: 'absolute', left: 0, width: '100%', top: CHART_BASE, height: 1, background: colors.hairline, opacity: fade(local, 8) }} />
        {ANNUAL.map((v, i) => {
          const start = 10 + i * 4; // 6560 起效，step 4f
          const grow = interpolate(local, [start, start + (i === 7 ? 62 : 30)], [0, 1], { ...CLAMP, easing: CURVES.cineEaseOut });
          const isPeak = i === 7;
          const isZero = v === 0;
          const h = (isZero ? 10 : Math.max(4, (v / 4387) * MAX_H)) * grow;
          return (
            <div
              key={YEARS[i]}
              style={{
                position: 'absolute',
                left: i * BAR_STEP,
                bottom: 480 - CHART_BASE,
                width: BAR_W,
                height: h,
                borderRadius: '4px 4px 0 0',
                background: isPeak ? colors.accent : isZero ? colors.muted : colors.paperMuted,
                opacity: (isPeak ? 0.95 : isZero ? 0.45 : 0.6) * fade(local, start),
                boxShadow: isPeak ? `0 0 ${26 * grow}px ${colors.accent}` : undefined,
              }}
            />
          );
        })}
        {YEARS.map((y, i) => (
          <span
            key={y}
            style={{
              position: 'absolute',
              left: i * BAR_STEP,
              width: BAR_W,
              top: CHART_BASE + 16,
              textAlign: 'center',
              fontFamily: mono,
              fontSize: 15,
              color: i === 7 ? colors.accent : colors.muted,
              opacity: fade(local, 8),
            }}
          >
            {y}
          </span>
        ))}
        {/* 2025 灰柱标 0 */}
        <span style={{ position: 'absolute', left: 6 * BAR_STEP, width: BAR_W, top: CHART_BASE - 42, textAlign: 'center', fontFamily: mono, fontSize: 20, color: colors.muted, opacity: fade(local, 54) }}>0</span>
        {/* 2026 冲顶数字（num-roll 收数于 6720） */}
        <div style={{ position: 'absolute', left: PEAK.x - 90, width: 180, top: PEAK.y - 54, textAlign: 'center', opacity: fade(local, 130) }}>
          <span style={{ fontFamily: mono, fontSize: 40, color: colors.accent, textShadow: `0 0 24px ${colors.accent}` }}>{Math.round(roll).toLocaleString()}</span>
        </div>
        {/* 柱顶光点蓄势 → tr-star-toss 上抛（拖尾三星，跨切点） */}
        {local >= 148 && t < 0 ? (
          <div
            style={{
              position: 'absolute',
              left: PEAK.x,
              top: PEAK.y,
              width: 8,
              height: 8,
              borderRadius: 4,
              background: GOLD,
              transform: 'translate(-50%, -50%)',
              opacity: interpolate(local, [148, 170], [0, 0.9], CLAMP) * (0.7 + 0.3 * Math.sin(frame / 3)),
              boxShadow: `0 0 18px ${GOLD}`,
            }}
          />
        ) : null}
        {t >= 0 && t < 10
          ? [0, -2.2, -4.4].map((dt, k) => {
              const tt = t + dt;
              if (tt < 0) return null;
              const s = 6 - k * 1.4;
              return (
                <div
                  key={k}
                  style={{
                    position: 'absolute',
                    left: PEAK.x,
                    top: PEAK.y + tossY(tt),
                    width: s,
                    height: s,
                    borderRadius: s / 2,
                    background: GOLD,
                    transform: 'translate(-50%, -50%)',
                    opacity: [1, 0.45, 0.2][k],
                    boxShadow: k === 0 ? `0 0 16px ${GOLD}` : undefined,
                  }}
                />
              );
            })
          : null}
      </div>
      <p style={{ position: 'absolute', top: 84, right: 120, fontFamily: mono, fontSize: 17, color: colors.muted, opacity: fade(local, 110) }}>年度合计 21,643</p>
      <div style={{ position: 'absolute', bottom: 92, left: 0, width: '100%', textAlign: 'center', fontFamily: serif, fontSize: 30, color: colors.paper }}>
        <span style={{ opacity: fade(local, 44) }}>2025 · 0</span>
        <span style={{ opacity: fade(local, 120), color: colors.muted }}>　→　</span>
        <span style={{ opacity: fade(local, 170), color: colors.accent }}>2026 · 4,387 · 历史最高</span>
      </div>
    </AbsoluteFill>
  );
};

/* 镜 43（6730–6900）：暖色书房全景 —— 屏幕微光/书架/黑胶/足迹光点同框呼吸（paper-breathe / EQ 低振幅 / 跑马灯 / 热力微闪）
   + 46 篇暖光悬浮（dust-ascend 暖变体）+ 承接镜 42 星点余辉 + 尾段 tr-atomize 光尘化 */
const BOOK_COLORS = [colors.accent, colors.paperMuted, colors.paperDeep, colors.ink, colors.muted];
const shelfBooks = (rowSeed: number): Array<{ x: number; w: number; h: number; c: string; o: number }> => {
  const books: Array<{ x: number; w: number; h: number; c: string; o: number }> = [];
  let x = 0;
  for (let i = 0; i < 18; i++) {
    const seed = rowSeed * 31 + i * 17;
    const w = 14 + (seed % 5) * 4;
    books.push({ x, w, h: 92 + (seed % 7) * 8, c: BOOK_COLORS[seed % BOOK_COLORS.length], o: 0.45 + (seed % 4) * 0.12 });
    x += w + 3;
  }
  return books;
};

const ShotStudy: FC = () => {
  const frame = useCurrentFrame();
  const local = frame - 180;
  const atom = interpolate(local, [130, 170], [0, 1], { ...CLAMP, easing: CURVES.cineEaseOut }); // tr-atomize 40f
  const ox = Math.sin((local / 170) * Math.PI * 2) * 18; // cam-orbit 缓环
  const oy = Math.sin((local / 170) * Math.PI * 2 + 1.1) * 7;
  const or = Math.sin((local / 170) * Math.PI * 2) * 0.35;
  const tossT = local - 10; // 星抛余辉延入本镜（承接镜 42 局部 170 起）
  return (
    <AbsoluteFill>
      {/* 星点余辉（跨切点：t 10–20，屏位与镜 42 末帧连续：基点 1450,390 + 1.8×tossY） */}
      {tossT >= 10 && tossT < 20 ? (
        <div
          style={{
            position: 'absolute',
            left: 1450,
            top: 390 + 1.8 * tossY(tossT),
            width: 6,
            height: 6,
            borderRadius: 3,
            background: GOLD,
            transform: 'translate(-50%, -50%)',
            opacity: interpolate(tossT, [10, 20], [1, 0], CLAMP) * (0.75 + 0.25 * Math.sin(frame / 2)),
            boxShadow: `0 0 ${22 * (1 - (tossT - 10) / 10)}px ${GOLD}`,
          }}
        />
      ) : null}
      <div style={{ position: 'absolute', inset: 0, opacity: 1 - atom, filter: `blur(${atom * 5}px)`, transform: `translateY(${-atom * 16}px)` }}>
        <div style={{ position: 'absolute', inset: 0, transform: `translate(${ox}px, ${oy}px) rotate(${or}deg) scale(1.04) ${paperBreathe(frame).transform ?? ''}` }}>
          {/* 金句 [storyboard 镜 43 原文] */}
          <div style={{ position: 'absolute', left: 0, width: '100%', top: 150, textAlign: 'center' }}>
            <p style={{ ...writeFade(frame, 202), fontFamily: serif, fontSize: 34, color: colors.paper, margin: 0, letterSpacing: '0.06em' }}>日不过三餐，夜不过一宿……</p>
            <p style={{ ...writeFade(frame, 226), fontFamily: serif, fontSize: 27, color: colors.paperMuted, marginTop: 18, letterSpacing: '0.04em' }}>比起物质上的富足我更倾向于精神上的进步。</p>
          </div>
          {/* 屏幕微光 */}
          <div style={{ position: 'absolute', left: 380, top: 560, width: 380, height: 230, background: colors.terminalBg, border: `1px solid ${colors.hairline}`, borderRadius: 10, ...inkRise(frame, 188) }}>
            <div style={{ position: 'absolute', inset: 14, background: `radial-gradient(circle at 50% 40%, rgba(212,163,115,0.32), transparent 72%)`, ...glowPulse(frame, 1, 90) }} />
            {[0, 1, 2, 3].map((l) => (
              <div key={l} style={{ position: 'absolute', left: 30, top: 36 + l * 27, width: 120 + ((l * 67) % 180), height: 5, borderRadius: 2.5, background: colors.muted, opacity: 0.35 }} />
            ))}
          </div>
          {/* 热力微闪 */}
          <div style={{ position: 'absolute', left: 806, top: 596, width: 156, height: 52, opacity: fade(local, 26) }}>
            {Array.from({ length: 48 }).map((_, i) => {
              const col = i % 12;
              const row = Math.floor(i / 12);
              const on = (i * 7) % 5 > 1;
              const flick = 0.5 + 0.5 * Math.sin(frame / 6 + i * 1.3);
              return <div key={i} style={{ position: 'absolute', left: col * 13, top: row * 13, width: 10, height: 10, borderRadius: 2, background: on ? colors.accent : colors.paperMuted, opacity: on ? 0.22 + 0.42 * flick : 0.12 }} />;
            })}
          </div>
          {/* 书架两列 */}
          {[430, 572].map((sy, r) => (
            <div key={r} style={{ position: 'absolute', left: 1180, top: sy, width: 620, height: 150, ...inkRise(frame, 196 + r * 14) }}>
              {shelfBooks(r + 1).map((b, i) => (
                <div key={i} style={{ position: 'absolute', left: b.x, bottom: 0, width: b.w, height: b.h, background: b.c, opacity: b.o, borderRadius: '2px 2px 0 0' }} />
              ))}
              <div style={{ position: 'absolute', left: 0, bottom: -3, width: '100%', height: 3, background: colors.bgLift }} />
            </div>
          ))}
          {/* 足迹光点 */}
          <div style={{ position: 'absolute', left: 1230, top: 130, width: 430, height: 250, background: colors.bgLift, border: `1px solid ${colors.hairline}`, borderRadius: 12, ...inkRise(frame, 204) }}>
            <svg width={430} height={250}>
              <polyline points="60,180 150,120 240,150 320,80" fill="none" stroke={colors.hairline} strokeWidth={2} strokeDasharray="6 6" />
              {[
                [60, 180],
                [150, 120],
                [240, 150],
                [320, 80],
                [370, 190],
              ].map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r={4} fill={i === 2 ? colors.accent : colors.paper} opacity={0.32 + 0.28 * Math.sin((frame + i * 9) / 11)} />
              ))}
            </svg>
            <p style={{ position: 'absolute', left: 20, bottom: 12, fontFamily: mono, fontSize: 13, color: colors.muted }}>足迹 · 365 天</p>
          </div>
          {/* 黑胶（vinyl-spin 匀速例外） */}
          <div style={{ position: 'absolute', left: 830, top: 780, width: 230, height: 170, background: colors.bgLift, border: `1px solid ${colors.hairline}`, borderRadius: 12, ...inkRise(frame, 212) }}>
            <div style={{ position: 'absolute', left: 30, top: 23, width: 124, height: 124, borderRadius: '50%', background: colors.ink, transform: `rotate(${local * 4}deg)` }}>
              <div style={{ position: 'absolute', inset: 12, borderRadius: '50%', border: `1px solid ${colors.hairline}` }} />
              <div style={{ position: 'absolute', inset: 26, borderRadius: '50%', border: `1px solid ${colors.hairline}` }} />
              <div style={{ position: 'absolute', inset: 40, borderRadius: '50%', border: `1px solid ${colors.hairline}` }} />
              <div style={{ position: 'absolute', left: 46, top: 46, width: 32, height: 32, borderRadius: 16, background: colors.accent, opacity: 0.85 }} />
              <div style={{ position: 'absolute', left: 0, top: 61, width: 124, height: 2, background: colors.hairline }} />
            </div>
            <div style={{ position: 'absolute', left: 176, top: 36, width: 3, height: 74, background: colors.muted, borderRadius: 1.5, transform: 'rotate(14deg)', transformOrigin: 'top center' }} />
          </div>
          {/* EQ 低振幅 */}
          <div style={{ position: 'absolute', left: 1102, top: 836, display: 'flex', gap: 7, alignItems: 'flex-end', opacity: fade(local, 26) }}>
            {eqBars(frame).map((v, i) => (
              <div key={i} style={{ width: 10, height: 8 + v * 22, borderRadius: 2, background: colors.accent, opacity: 0.7 }} />
            ))}
          </div>
          {/* 跑马灯慢滚（marquee-drift 匀速例外） */}
          <div style={{ position: 'absolute', left: 0, width: '100%', bottom: 34, overflow: 'hidden', opacity: 0.5 * fade(local, 20) }}>
            <div style={{ whiteSpace: 'nowrap', fontFamily: mono, fontSize: 16, color: colors.muted, transform: `translateX(${-((local * 1.1) % 900)}px)` }}>
              {'wuh.site · 朝朝如念 · 博客 · 音乐 · 足迹 · 设计 · 夜读 · 留言板 · '.repeat(4)}
            </div>
          </div>
          {/* 46 篇文章化作暖光悬浮（dust-ascend 暖变体） */}
          {Array.from({ length: 46 }).map((_, i) => {
            const x = (i * 173 + 60) % 1920;
            const speed = 0.35 + ((i * 29) % 10) / 40;
            const y = 1080 - ((i * 149 + local * speed) % 1250);
            const sway = Math.sin((local + i * 13) / 36) * 18;
            const size = 2 + (i % 4);
            return <div key={i} style={{ position: 'absolute', left: x + sway, top: y, width: size, height: size, borderRadius: size / 2, background: GOLD, opacity: (0.3 + 0.35 * Math.sin((local / 26) * Math.PI * 2 + i)) * fade(local, 10 + (i % 20)) }} />;
          })}
        </div>
      </div>
      {/* tr-atomize：12×7 网格光尘散逸 */}
      {local >= 130
        ? Array.from({ length: 84 }).map((_, i) => {
            const col = i % 12;
            const row = Math.floor(i / 12);
            const cx = col * 160 + 80;
            const cy = row * 155 + 77;
            const p = interpolate(local, [130 + (row + col) * 0.8, 168], [0, 1], { ...CLAMP, easing: CURVES.cineEaseOut });
            const dx = (cx - 960) / 960;
            const dy = (cy - 540) / 540;
            return <div key={i} style={{ position: 'absolute', left: cx + dx * 70 * p, top: cy + dy * 70 * p, width: 3.5, height: 3.5, borderRadius: 2, background: GOLD, opacity: Math.sin(p * Math.PI) * 0.8 }} />;
          })
        : null}
    </AbsoluteFill>
  );
};

/* 镜 44（6900–7030）：急拉骤停 → 光尘 converge 聚拢成墨点（6950–7030）+ surface-tension 微颤 + tr-ink-drop 坠落（7022–7030） */
const ShotInkDrop: FC = () => {
  const frame = useCurrentFrame();
  const local = frame - 350;
  const pull = interpolate(local, [0, 22], [1.14, 1], { ...CLAMP, easing: CURVES.cineEaseOut });
  const dotR = 4 + 14 * interpolate(local, [70, 118], [0, 1], { ...CLAMP, easing: CURVES.cineEaseOut });
  const dotO = interpolate(local, [80, 118], [0, 1], CLAMP);
  const tremble = local >= 112 ? 0.02 * Math.sin((local - 112) * 0.9) : 0;
  const dropY = interpolate(local, [122, 130], [0, 12], { ...CLAMP, easing: CURVES.cineEaseIn });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', transform: `scale(${pull})` }}>
      <AbsoluteFill style={{ background: 'radial-gradient(circle at 50% 50%, transparent 32%, rgba(6,5,5,0.6) 100%)' }} />
      {Array.from({ length: 56 }).map((_, i) => {
        const ang = (i * 137.5 * Math.PI) / 180;
        const r = 320 + ((i * 53) % 380);
        const x0 = 960 + Math.cos(ang) * r;
        const y0 = 540 + Math.sin(ang) * r * 0.62;
        const p = interpolate(local, [50 + (i % 7) * 3, 128], [0, 1], { ...CLAMP, easing: CURVES.cineEaseIn });
        const size = 4.5 - 3 * p;
        return <div key={i} style={{ position: 'absolute', left: x0 + (960 - x0) * p, top: y0 + (540 - y0) * p, width: size, height: size, borderRadius: size / 2, background: GOLD, opacity: fade(local, 4) * 0.75 * (1 - p * 0.25) * (0.7 + 0.3 * Math.sin((local + i * 7) / 5)) }} />;
      })}
      {/* 墨点凝成：暖金光尘收拢，墨核 + 暖缘；表面张力微颤后坠落触纸 */}
      <div
        style={{
          position: 'absolute',
          left: 960,
          top: 540 + dropY,
          width: dotR * 2,
          height: dotR * 2,
          borderRadius: '50%',
          transform: `translate(-50%, -50%) scale(${1 + tremble}, ${1 - tremble})`,
          background: 'radial-gradient(circle, ${GRADES[6].lut.color} 52%, rgba(233,217,174,0.4) 76%, transparent 100%)',
          opacity: dotO,
          boxShadow: '0 0 26px rgba(233,217,174,0.28)',
        }}
      />
    </AbsoluteFill>
  );
};

/* 镜 45（7030–7200）：墨晕成字（7050–7080）+ 打字机快书 3f/字（7080–7143）+ 钤印 22px（7150）
   + gold-drift 环绕渐暗 + bloom-glow 收束；tr-fade-black-final 在 Act 层（7130–7200）合流 */
const MOTTO = '写作是抵抗遗忘的方式，代码是构建世界的语言。';

const ShotFinale: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - ANCHORS.inkDrop; // 7030 = 落版私有网格原点
  const bloom = interpolate(local, [0, 20], [0, 1], { ...CLAMP, easing: CURVES.cineEaseOut });
  const word = interpolate(local, [20, 50], [0, 1], { ...CLAMP, easing: CURVES.cineEaseOut });
  const chars = Math.min(MOTTO.length, Math.max(0, Math.floor((local - 50) / TYPE.fast)));
  const seal = sealStamp(frame, ANCHORS.inkDrop + 120, fps, sealTilt('wuh.site-finale')); // 7150
  const glowOut = interpolate(local, [128, 166], [1, 0], { ...CLAMP, easing: CURVES.cineEaseInOut });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      {/* gold-drift 环绕光尘（渐暗） */}
      {Array.from({ length: 14 }).map((_, i) => {
        const a = ((i * 25.7 + local * 0.5) * Math.PI) / 180;
        const x = 960 + Math.cos(a) * (400 + (i % 3) * 110);
        const y = 512 + Math.sin(a) * (190 + (i % 4) * 48);
        const size = 2 + (i % 3);
        return <div key={i} style={{ position: 'absolute', left: x, top: y, width: size, height: size, borderRadius: size / 2, background: GOLD, opacity: word * (0.18 + 0.14 * Math.sin(local / 9 + i)) * (0.3 + 0.7 * glowOut) }} />;
      })}
      {/* ink-bloom 墨晕触纸 → 晕成标题 */}
      <div
        style={{
          position: 'absolute',
          left: 960,
          top: 552,
          width: 320,
          height: 320,
          borderRadius: '50%',
          transform: `translate(-50%, -50%) scale(${0.3 + bloom * 1.4})`,
          background: 'radial-gradient(circle, ${GRADES[6].lut.color} 30%, rgba(22,19,15,0.5) 55%, transparent 75%)',
          opacity: 0.7 * (1 - word * 0.88),
        }}
      />
      {/* bloom-glow 收束 */}
      <AbsoluteFill style={{ background: 'radial-gradient(circle at 50% 47%, rgba(233,217,174,0.4), transparent 55%)', opacity: word * 0.3 * glowOut, transform: `scale(${1 - (1 - glowOut) * 0.3})` }} />
      <div style={{ position: 'relative', textAlign: 'center', transform: `translateY(-30px) scale(${1 + (1 - word) * 0.14})`, opacity: word, filter: `blur(${(1 - word) * 7}px)` }}>
        <h1 style={{ fontFamily: serif, fontSize: 78, color: colors.paper, margin: 0, letterSpacing: '0.04em' }}>wuh.site · 朝朝如念</h1>
        <p style={{ fontFamily: serif, fontSize: 30, color: colors.paperMuted, marginTop: 48, minHeight: 44, letterSpacing: '0.05em' }}>
          {MOTTO.slice(0, chars)}
          {chars > 0 && chars < MOTTO.length ? <span style={{ display: 'inline-block', width: 3, height: 28, marginLeft: 6, background: colors.accent, opacity: Math.floor(frame / 3) % 2 ? 1 : 0.15 }} /> : null}
        </p>
      </div>
      {/* 钤印 22px 落定（右下） */}
      <div style={{ position: 'absolute', left: 1268, top: 648, width: 22, height: 22, background: colors.accent, boxShadow: `0 0 ${20 * glowOut + 6}px ${colors.accent}`, ...seal }} />
    </AbsoluteFill>
  );
};

const SHOTS: Array<{ from: number; to: number; Board: FC }> = [
  { from: 6550, to: 6730, Board: ShotSummit },
  { from: 6730, to: 6900, Board: ShotStudy },
  { from: 6900, to: 7030, Board: ShotInkDrop },
  { from: 7030, to: 7200, Board: ShotFinale },
];

// Act 7 向好与落版（6550–7200，本地帧 0–650；幕调色 grade-warm-gold 40f 回收至墨黑，与 tr-fade-black-final 合流）
export const Act7: FC = () => {
  const frame = useCurrentFrame();
  const local = frame;
  const shot = SHOTS.find((s) => local >= s.from - ANCHORS.act7 && local < s.to - ANCHORS.act7) ?? SHOTS[0];
  const Board = shot.Board;
  const goldLut = interpolate(local, [0, 40], [0.22, 0], CLAMP);
  const goldVeil = interpolate(local, [0, 40], [0.06, 0], CLAMP);
  const blackMul = interpolate(local, [0, 500], [0, 0.5], CLAMP);
  const blackVeil = interpolate(local, [480, 650], [0, 0.4], CLAMP);
  const dustO = interpolate(local, [0, 350, 470, 560, 630], [0.85, 0.85, 0.15, 0.5, 0], CLAMP); // 光尘收拢至 0
  const aperture = interpolate(local, [580, 650], [0, 1], { ...CLAMP, easing: CURVES.cineEaseInOut }); // 终幕渐黑（纯色渐变，规避全屏动画 radial 崩溃）
  const lastBlack = interpolate(local, [615, 650], [0, 1], { ...CLAMP, easing: CURVES.cineEaseIn });
  const sat = interpolate(local, [0, 120], [1, 0.8], CLAMP);
  const bri = interpolate(local, [0, 120, 580, 650], [1, 0.85, 0.85, 0], CLAMP);
  return (
    <AbsoluteFill style={{ background: colors.bg, filter: `saturate(${sat}) brightness(${bri})` }}>
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Board />
      </AbsoluteFill>
      <div style={{ opacity: dustO }}>
        <DustField act={7} />
      </div>
      {/* grade-warm-gold 残韵 40f 回收 */}
      <AbsoluteFill style={{ background: WARM_GOLD, mixBlendMode: 'soft-light', opacity: goldLut }} />
      <AbsoluteFill style={{ background: GRADES[3].veil.color, mixBlendMode: 'screen', opacity: goldVeil }} />
      {/* grade-fade-black 回收至墨黑 */}
      <AbsoluteFill style={{ background: GRADES[6].lut.color, mixBlendMode: 'multiply', opacity: blackMul }} />
      <AbsoluteFill style={{ background: GRADES[6].veil.color, opacity: blackVeil }} />
      {/* tr-fade-black-final 光圈收缩渐黑（7130–7200，终击 7200 全黑） */}
      <AbsoluteFill style={{ background: GRADES[6].lut.color, opacity: aperture }} />
      <AbsoluteFill style={{ background: GRADES[6].lut.color, opacity: lastBlack }} />
    </AbsoluteFill>
  );
};
