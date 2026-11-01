/* 镜 38 · Act 6 入院 · 局部帧 [0,150) · 150f
   18+114+18：面板（litSet={1,2,3}）→ 光标点开块 4「音乐」→ 窗口最大化；
   持续：黑胶 5s/圈（150f 恰好整圈，线性）、唱针 12f 落定（局部 30f = 4920f，第 247 拍）、
   年份刻度环从 2018 走到 2025（每 13f 一年），每到一年亮出该年年度最爱（歌名 + 演唱者，八年真实数据）；
   三墨柱 EQ 相位差 + 440px 迷你播放器跑马灯同步曲名；
   出场：唱针抬起、碟面退暗，反向收束回块 4（点亮），光标移向块 5。 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, eqBars, inkRise, marqueeDrift, needleSettle, vinylSpin, writeFade } from '../motion-tokens';
import { Caption } from '../components/Caption';
import { ConsoleCursor, ConsolePanel, ConsoleWindow, TILE_RECTS } from '../components/Console';
import { DustField } from '../components/DustField';
import { Grade } from '../components/Grade';
import { PaperGrain } from '../components/PaperGrain';

const DUR = 150;
const IN = 18;
const OUT = DUR - IN; // 132
const CLICK = 11;
const TILE = 3;
const CLAMP = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

const mono = fontFamilies.mono;
const serif = fontFamilies.serif;

const tileCenter = (i: number) => ({ x: TILE_RECTS[i].x + TILE_RECTS[i].w / 2, y: TILE_RECTS[i].y + TILE_RECTS[i].h / 2 });

/* 年度最爱（v1 2026-10-25 抓取，八年歌单播放之最；材料 §2.8） */
const YEAR_FAVS: Array<{ year: string; song: string; artist: string }> = [
  { year: '2018', song: '诱惑的街 (Live)', artist: '林志炫' },
  { year: '2019', song: '腻味', artist: '金玟岐' },
  { year: '2020', song: '少年不凡', artist: '刘美麟' },
  { year: '2021', song: '风月缠绵（金风玉露变奏）', artist: '陈致逸' },
  { year: '2022', song: '归期', artist: '钱润玉' },
  { year: '2023', song: '爱意（金风玉露变奏）', artist: '陈致逸' },
  { year: '2024', song: '爱意（金风玉露变奏）', artist: '陈致逸' },
  { year: '2025', song: '爱意（金风玉露变奏）', artist: '陈致逸' },
];
const YEAR_START = 18;
const YEAR_STEP = 13;

const DISC = { x: 600, y: 520, r: 224 };

const CaptionPlate: FC<{ appearAt: number }> = ({ appearAt }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [appearAt, appearAt + 16], [0, 1], CLAMP);
  return (
    <div
      style={{
        position: 'absolute',
        left: 380,
        right: 380,
        bottom: 96,
        height: 200,
        background: `linear-gradient(180deg, transparent, ${colors.bg} 20%, ${colors.bg} 80%, transparent)`,
        opacity: p * 0.5,
        pointerEvents: 'none',
      }}
    />
  );
};

const ShotYearDisc: FC = () => {
  const frame = useCurrentFrame();
  const to = tileCenter(TILE);
  const next = tileCenter(TILE + 1);
  const panelCenter = { x: 960, y: 540 };

  const cursorIn = interpolate(frame, [0, 7], [0, 1], { ...CLAMP, easing: CURVES.cineEaseInOut });
  const cursorOut = interpolate(frame, [OUT + 6, DUR], [0, 1], { ...CLAMP, easing: CURVES.cineEaseInOut });
  const cx = frame < OUT + 6 ? panelCenter.x + (to.x - panelCenter.x) * cursorIn : to.x + (next.x - to.x) * 0.34 * cursorOut;
  const cy = frame < OUT + 6 ? panelCenter.y + (to.y - panelCenter.y) * cursorIn : to.y + (next.y - to.y) * 0.34 * cursorOut;

  const ripple = interpolate(frame, [CLICK, CLICK + 18], [0, 1], CLAMP);
  const progress =
    frame < OUT
      ? interpolate(frame, [CLICK, IN], [0, 1], { ...CLAMP, easing: CURVES.cineEaseInOut })
      : interpolate(frame, [OUT, OUT + 12], [1, 0], { ...CLAMP, easing: CURVES.cineEaseInOut });

  const panelOpacity = interpolate(frame, [0, 10], [0, 1], CLAMP);
  const cursorOpacity = interpolate(frame, [0, 4], [0, 1], CLAMP);
  const lit = frame >= CLICK ? [0, 1, 2, 3] : [0, 1, 2];
  const active = frame >= 6 && frame < OUT ? TILE : -1;

  const activeYear = Math.max(0, Math.min(YEAR_FAVS.length - 1, Math.floor((frame - YEAR_START) / YEAR_STEP)));
  const fav = YEAR_FAVS[activeYear];
  const yearIn = interpolate(frame, [YEAR_START, YEAR_START + 8], [0, 1], CLAMP);
  const songKey = `song-${activeYear}`;

  const spin = vinylSpin(frame, 150); // 5s/圈，150f 整圈
  const needle = needleSettle(frame, 30); // 局部 30f = 4920f 落定
  const arm = interpolate(frame, [26, 30], [-6, 0], { ...CLAMP, easing: CURVES.cineEaseOut });
  const up = interpolate(frame, [OUT - 2, OUT + 8], [0, 1], { ...CLAMP, easing: CURVES.cineEaseInOut });
  const discDim = interpolate(frame, [OUT, OUT + 10], [1, 0.6], { ...CLAMP, easing: CURVES.cineEaseInOut });
  const eq = eqBars(frame);

  return (
    <AbsoluteFill>
      <ConsolePanel lit={lit} active={active} style={{ opacity: panelOpacity }} />
      <Grade id="GR-01" />
      <DustField act={6} count={24} seedBase="s38" />
      <ConsoleCursor x={cx} y={cy} hover={frame >= 6 && frame < OUT} ripple={ripple} opacity={cursorOpacity} />

      <ConsoleWindow tile={TILE} progress={progress}>
        <AbsoluteFill>
          <div
            style={{
              position: 'absolute',
              left: 140,
              top: 58,
              right: 140,
              display: 'flex',
              justifyContent: 'space-between',
              fontFamily: mono,
              fontSize: 15,
              letterSpacing: '0.24em',
              color: colors.muted,
              ...inkRise(frame, 20),
            }}
          >
            <span>04 / 音乐 · MUSIC</span>
            <span style={{ fontVariantNumeric: 'tabular-nums' }}>5s / 圈 · 2018—2025</span>
          </div>

          {/* 黑胶 + 年份刻度环 */}
          <div style={{ position: 'absolute', left: DISC.x - DISC.r, top: DISC.y - DISC.r, width: DISC.r * 2, height: DISC.r * 2 }}>
            {[1, 0.86, 0.72, 0.58].map((k) => (
              <div key={k} style={{ position: 'absolute', left: DISC.r * (1 - k), top: DISC.r * (1 - k), width: DISC.r * 2 * k, height: DISC.r * 2 * k, borderRadius: '50%', border: `1px solid ${colors.hairline}` }} />
            ))}
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: colors.ink, opacity: 0.92 * discDim }} />
            <div
              style={{
                position: 'absolute',
                inset: 24,
                borderRadius: '50%',
                background: `conic-gradient(from ${spin}deg, transparent, ${colors.paperMuted}, transparent 42%)`,
                opacity: 0.16 * discDim,
                mixBlendMode: 'screen',
              }}
            />
            <div style={{ position: 'absolute', left: DISC.r - 64, top: DISC.r - 64, width: 128, height: 128, borderRadius: 64, background: colors.seal, opacity: 0.9 * discDim, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: serif, fontSize: 30, color: colors.paper, letterSpacing: '0.2em' }}>{fav.year}</span>
            </div>
            {/* 唱针（12f 落定于局部 30f） */}
            <div
              style={{
                position: 'absolute',
                right: -54,
                top: DISC.r - 190,
                width: 2,
                height: 190,
                background: colors.paperMuted,
                opacity: 0.7,
                transform: `rotate(${18 + arm + needle + up * 10}deg)`,
                transformOrigin: 'top center',
              }}
            />
            <div style={{ position: 'absolute', right: -60, top: DISC.r - 200, width: 14, height: 14, borderRadius: 7, background: colors.muted }} />
          </div>

          {/* 年份刻度环：2018—2025 依次点亮 */}
          {YEAR_FAVS.map((y, i) => {
            const ang = (i / YEAR_FAVS.length) * Math.PI * 2 - Math.PI / 2;
            const rx = DISC.r + 56;
            const on = i === activeYear;
            return (
              <div
                key={y.year}
                style={{
                  position: 'absolute',
                  left: DISC.x + Math.cos(ang) * rx - 34,
                  top: DISC.y + Math.sin(ang) * rx - 12,
                  width: 68,
                  textAlign: 'center',
                  fontFamily: mono,
                  fontSize: on ? 20 : 15,
                  color: on ? colors.seal : colors.muted,
                  opacity: (frame >= YEAR_START + i * YEAR_STEP ? 0.95 : 0.4) * yearIn,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {y.year}
              </div>
            );
          })}

          {/* 年度最爱题签 */}
          <div style={{ position: 'absolute', left: 1040, top: 170, width: 720 }}>
            <div style={{ fontFamily: mono, fontSize: 14, letterSpacing: '0.32em', color: colors.muted, ...writeFade(frame, 22) }}>THE FAVORITE OF THE YEAR</div>
            <div style={{ fontFamily: serif, fontSize: 150, lineHeight: 1, color: colors.paperDeep, marginTop: 4, opacity: 0.32, fontVariantNumeric: 'tabular-nums', ...writeFade(frame, 22) }}>
              {fav.year}
            </div>
            <div key={songKey} style={{ marginTop: 6, ...writeFade(frame, YEAR_START + activeYear * YEAR_STEP, true) }}>
              <div style={{ fontFamily: serif, fontSize: 46, lineHeight: 1.35, color: colors.ink }}>{fav.song}</div>
              <div style={{ fontFamily: mono, fontSize: 19, color: colors.muted, marginTop: 10, letterSpacing: '0.08em' }}>{fav.artist}</div>
              <div style={{ display: 'inline-block', marginTop: 16, padding: '4px 12px', borderRadius: 3, background: colors.seal, fontFamily: serif, fontSize: 14, color: colors.paper, letterSpacing: '0.24em' }}>当年最爱</div>
            </div>
          </div>

          {/* 440px 迷你播放器：封面 / 曲名跑马灯 / EQ */}
          <div style={{ position: 'absolute', left: 140, bottom: 84, width: 440, height: 132, borderRadius: 10, background: colors.paperMuted, border: `1px solid ${colors.paperDeep}`, ...inkRise(frame, 24) }}>
            <div style={{ position: 'absolute', left: 14, top: 14, width: 104, height: 104, borderRadius: 6, background: colors.seal, opacity: 0.85, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: serif, fontSize: 40, color: colors.paper }}>音</span>
            </div>
            <div style={{ position: 'absolute', left: 136, top: 20, right: 14, overflow: 'hidden', height: 26 }}>
              <div style={{ whiteSpace: 'nowrap', fontFamily: serif, fontSize: 21, color: colors.ink, ...marqueeDrift(frame, 26) }}>
                {`${fav.song} — ${fav.artist}　　${fav.song} — ${fav.artist}　　`}
              </div>
            </div>
            <div style={{ position: 'absolute', left: 136, top: 56, display: 'flex', alignItems: 'flex-end', gap: 5, height: 30 }}>
              {eq.map((v, i) => (
                <div key={i} style={{ width: 5, height: 30 * v, background: colors.seal, opacity: 0.85 }} />
              ))}
            </div>
            <div style={{ position: 'absolute', left: 136, top: 96, fontFamily: mono, fontSize: 12, color: colors.muted, fontVariantNumeric: 'tabular-nums', letterSpacing: '0.14em' }}>
              {fav.year} · WUH.SITE MUSIC
            </div>
          </div>
        </AbsoluteFill>
        <PaperGrain opacity={0.05} />
        <Grade id="GR-02" />
      </ConsoleWindow>

      <CaptionPlate appearAt={28} />
      <Caption text="时间的年轮，刻着每一年的歌。" appearAt={28} bottom={214} />
      <Caption text="黑胶还在转，时光没走远。" appearAt={44} bottom={142} />
    </AbsoluteFill>
  );
};

export default ShotYearDisc;
