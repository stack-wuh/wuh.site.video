/* 镜 43 · Act 7 向好与落版 · 全局帧 [6730,6900) · 170f */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, GRADES, WARM_GOLD, eqBars, glowPulse, inkRise, paperBreathe, writeFade } from '../motion-tokens';
import { DustField } from '../components/DustField';

const serif = fontFamilies.serif;
const mono = fontFamilies.mono;

const CLAMP = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const fade = (f: number, at: number) => interpolate(f, [at, at + 14], [0, 1], CLAMP);
const GOLD = WARM_GOLD; // 暖金光尘（DUST 7）

/* tr-star-toss（§4.2）：柱顶光点抛物线 y = −v·t + ½g·t²，6720 起跨切点 20f，余辉延入镜 43 前 10f */
const tossY = (t: number) => -9 * t + 0.5 * 0.6 * t * t;

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
  const frame = useCurrentFrame(); // 镜局部帧（0 = 幕局 180 = 全局 6730）
  const local = frame; // 原 frame − 180，镜局化后即 frame
  const atom = interpolate(local, [130, 170], [0, 1], { ...CLAMP, easing: CURVES.cineEaseOut }); // tr-atomize 40f
  const ox = Math.sin((local / 170) * Math.PI * 2) * 18; // cam-orbit 缓环
  const oy = Math.sin((local / 170) * Math.PI * 2 + 1.1) * 7;
  const or = Math.sin((local / 170) * Math.PI * 2) * 0.35;
  const tossT = local - 10; // 星抛余辉延入本镜（承接镜 42 局部 170 起）
  /* ── 幕级 overlay（自 Act7 return 分解，断点帧平移 −180） ── */
  const sat = interpolate(local, [-180, -60], [1, 0.8], CLAMP);
  const bri = interpolate(local, [-180, -60, 400, 470], [1, 0.85, 0.85, 0], CLAMP);
  const dustO = interpolate(local, [-180, 170, 290, 380, 450], [0.85, 0.85, 0.15, 0.5, 0], CLAMP); // 光尘收拢至 0
  const blackMul = interpolate(local, [-180, 320], [0, 0.5], CLAMP);
  return (
    <AbsoluteFill style={{ filter: `saturate(${sat}) brightness(${bri})` }}>
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
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
              {/* 金句 [storyboard 镜 43 原文]（writeFade 锚点已帧平移 −180） */}
              <div style={{ position: 'absolute', left: 0, width: '100%', top: 150, textAlign: 'center' }}>
                <p style={{ ...writeFade(frame, 22), fontFamily: serif, fontSize: 34, color: colors.paper, margin: 0, letterSpacing: '0.06em' }}>日不过三餐，夜不过一宿……</p>
                <p style={{ ...writeFade(frame, 46), fontFamily: serif, fontSize: 27, color: colors.paperMuted, marginTop: 18, letterSpacing: '0.04em' }}>比起物质上的富足我更倾向于精神上的进步。</p>
              </div>
              {/* 屏幕微光 */}
              <div style={{ position: 'absolute', left: 380, top: 560, width: 380, height: 230, background: colors.terminalBg, border: `1px solid ${colors.hairline}`, borderRadius: 10, ...inkRise(frame, 8) }}>
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
                <div key={r} style={{ position: 'absolute', left: 1180, top: sy, width: 620, height: 150, ...inkRise(frame, 16 + r * 14) }}>
                  {shelfBooks(r + 1).map((b, i) => (
                    <div key={i} style={{ position: 'absolute', left: b.x, bottom: 0, width: b.w, height: b.h, background: b.c, opacity: b.o, borderRadius: '2px 2px 0 0' }} />
                  ))}
                  <div style={{ position: 'absolute', left: 0, bottom: -3, width: '100%', height: 3, background: colors.bgLift }} />
                </div>
              ))}
              {/* 足迹光点 */}
              <div style={{ position: 'absolute', left: 1230, top: 130, width: 430, height: 250, background: colors.bgLift, border: `1px solid ${colors.hairline}`, borderRadius: 12, ...inkRise(frame, 24) }}>
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
              <div style={{ position: 'absolute', left: 830, top: 780, width: 230, height: 170, background: colors.bgLift, border: `1px solid ${colors.hairline}`, borderRadius: 12, ...inkRise(frame, 32) }}>
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
      </AbsoluteFill>
      <div style={{ opacity: dustO }}>
        <DustField act={7} />
      </div>
      {/* grade-fade-black 回收至墨黑（幕局 [0,500) 跨四镜，本镜段 [−180,320)） */}
      <AbsoluteFill style={{ background: GRADES[6].lut.color, mixBlendMode: 'multiply', opacity: blackMul }} />
    </AbsoluteFill>
  );
};

export default ShotStudy;
