/* 镜 42 · Act 6 入院 · 局部帧 [0,150) · 150f
   16+118+16：面板（litSet={1,2,3,4,5,6,7}）→ 光标点开块 8「页面漫游与钤印」→ 窗口最大化；
   持续（v1 表达）：五张页面卡（/ → /music → /guestbook → /footprint → /topics）半拍连击入场，
   每页的 reveal 行 0→35% 自己写出来，镜头连续 dolly 推进；末段联系弹窗 8 图标围合、22px 钤印落章；
   出场：反向收束回块 8 → 面板八块全亮（扫描线加速）→ 收束成朱红晕光 + 纸页边缘（交 S43 推窗）。 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, inkRise, sealStamp, sealTilt } from '../motion-tokens';
import { Caption } from '../components/Caption';
import { ConsoleCursor, ConsolePanel, ConsoleWindow, TILE_RECTS } from '../components/Console';
import { DustField } from '../components/DustField';
import { Grade } from '../components/Grade';
import { PaperGrain } from '../components/PaperGrain';

const DUR = 150;
const IN = 16;
const OUT = DUR - IN; // 134
const CLICK = 9;
const TILE = 7;
const CLAMP = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

const mono = fontFamilies.mono;
const serif = fontFamilies.serif;

const tileCenter = (i: number) => ({ x: TILE_RECTS[i].x + TILE_RECTS[i].w / 2, y: TILE_RECTS[i].y + TILE_RECTS[i].h / 2 });

const PAGES = ['/', '/music', '/guestbook', '/footprint', '/topics'];

const writeReveal = (f: number, at: number) =>
  interpolate(f, [at, at + 10], [0, 35], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

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

const ShotPageBreath: FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;
  const to = tileCenter(TILE);
  const panelCenter = { x: 960, y: 540 };

  const cursorIn = interpolate(frame, [0, 7], [0, 1], { ...CLAMP, easing: CURVES.cineEaseInOut });
  const ripple = interpolate(frame, [CLICK, CLICK + 18], [0, 1], CLAMP);
  const progress =
    frame < OUT
      ? interpolate(frame, [CLICK, IN], [0, 1], { ...CLAMP, easing: CURVES.cineEaseInOut })
      : interpolate(frame, [OUT, OUT + 12], [1, 0], { ...CLAMP, easing: CURVES.cineEaseInOut });

  const panelOpacity = interpolate(frame, [0, 10], [0, 1], CLAMP);
  const cursorOpacity = interpolate(frame, [0, 4], [0, 1], CLAMP);
  const lit = frame >= CLICK ? [0, 1, 2, 3, 4, 5, 6, 7] : [0, 1, 2, 3, 4, 5, 6];
  const active = frame >= 6 && frame < OUT ? TILE : -1;

  const dolly = interpolate(frame, [16, 110], [1, 1.14], { ...CLAMP, easing: CURVES.cineEaseIn });
  const dim = interpolate(frame, [92, 106], [0, 0.55], CLAMP);
  const contactIn = interpolate(frame, [98, 112], [0, 1], { ...CLAMP, easing: CURVES.cineEaseOut });
  const seal = sealStamp(frame, 110, fps, sealTilt('s42'));
  const haloT = interpolate(frame, [138, 150], [0, 0.5], { ...CLAMP, easing: CURVES.cineEaseOut });
  const edge = interpolate(frame, [140, 150], [0, 1], { ...CLAMP, easing: CURVES.cineEaseOut });

  return (
    <AbsoluteFill>
      <ConsolePanel lit={lit} active={active} style={{ opacity: panelOpacity }} scanBoost={frame > 134 ? 1 : 0} />
      <Grade id="GR-01" />
      <DustField act={6} count={24} seedBase="s42" />
      <ConsoleCursor x={frame < OUT ? panelCenter.x + (to.x - panelCenter.x) * cursorIn : to.x} y={frame < OUT ? panelCenter.y + (to.y - panelCenter.y) * cursorIn : to.y} hover={frame >= 6 && frame < OUT} ripple={ripple} opacity={cursorOpacity} />

      <ConsoleWindow tile={TILE} progress={progress}>
        <AbsoluteFill style={{ transform: `scale(${dolly})`, transformOrigin: 'center' }}>
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
            <span>08 / 页面漫游 · PAGES</span>
            <span>@view-transition · 零 JS</span>
          </div>

          {/* v1 表达：五张页面卡半拍连击入场，reveal 行 0→35% 书写显现 */}
          <div style={{ position: 'absolute', left: 0, right: 0, top: 250, display: 'flex', justifyContent: 'center', gap: 24, opacity: 1 - dim }}>
            {PAGES.map((p, i) => {
              const born = i === 0 ? 18 : 30 + i * 11;
              const inP = spring({ frame: frame - born, fps: 30, config: { damping: 200 } });
              return (
                <div
                  key={p}
                  style={{
                    width: 190,
                    height: 260,
                    borderRadius: 12,
                    background: colors.paperMuted,
                    border: `1px solid ${colors.paperDeep}`,
                    opacity: inP,
                    transform: `translateY(${(1 - inP) * 30}px) scale(${0.86 + inP * 0.14})`,
                    padding: '20px 18px',
                    position: 'relative',
                  }}
                >
                  <div style={{ fontFamily: mono, fontSize: 15, color: colors.seal, letterSpacing: '0.06em' }}>{p}</div>
                  {[0, 1, 2, 3].map((l) => (
                    <div key={l} style={{ height: 7, width: `${writeReveal(frame, born + 6 + l * 5)}%`, background: colors.paperDeep, opacity: 0.9, borderRadius: 4, marginTop: 12 }} />
                  ))}
                  {i === PAGES.length - 1 ? (
                    <span style={{ position: 'absolute', right: 10, bottom: 10, fontFamily: mono, fontSize: 11, color: colors.muted }}>中 / EN / 日</span>
                  ) : null}
                </div>
              );
            })}
          </div>

          {/* 联系弹窗：8 图标围合 + 22px 钤印 */}
          <div style={{ position: 'absolute', left: 760, top: 330, width: 400, height: 340, opacity: contactIn, transform: `translateY(${(1 - contactIn) * 16}px)` }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: 14, background: colors.paperMuted, border: `1px solid ${colors.paperDeep}`, boxShadow: `0 22px 50px ${colors.bg}` }} />
            <div style={{ position: 'absolute', left: 0, right: 0, top: 40, textAlign: 'center', fontFamily: serif, fontSize: 34, color: colors.ink }}>联系</div>
            {Array.from({ length: 8 }).map((_, i) => {
              const a = (i / 8) * Math.PI * 2 - Math.PI / 2 + frame * 0.004;
              return (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    left: 200 + Math.cos(a) * 118 - 17,
                    top: 190 + Math.sin(a) * 108 - 17,
                    width: 34,
                    height: 34,
                    borderRadius: 17,
                    background: colors.paperDeep,
                    border: `1px solid ${colors.paperMuted}`,
                    opacity: contactIn * (0.65 + 0.35 * Math.sin(frame / 18 + i)),
                  }}
                />
              );
            })}
            <div style={{ position: 'absolute', left: 189, top: 96, width: 22, height: 22, background: colors.seal, boxShadow: `0 0 12px ${colors.seal}`, ...seal }} />
          </div>

          {/* 面板收束：朱红晕光 + 纸页边缘（交 S43） */}
          <div style={{ position: 'absolute', left: 580, top: 160, width: 760, height: 760, borderRadius: '50%', background: `radial-gradient(circle, ${colors.seal}, transparent 68%)`, opacity: haloT, mixBlendMode: 'screen', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', left: 940, top: 0, width: 40, height: 1080, background: colors.paperMuted, opacity: edge * 0.5, transform: `translateY(${(1 - edge) * 300}px)` }} />
        </AbsoluteFill>
        <PaperGrain opacity={0.05} />
        <Grade id="GR-02" />
      </ConsoleWindow>

      <CaptionPlate appearAt={32} />
      <Caption text="每一页，都在呼吸。" appearAt={32} bottom={214} />
      <Caption text="代码写诗，工具作画。" appearAt={48} bottom={142} />
    </AbsoluteFill>
  );
};

export default ShotPageBreath;
