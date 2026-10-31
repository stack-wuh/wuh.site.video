/* 镜 42 · Act 6 入院 · 局部帧 [0,114) · 114f
   16+82+16：面板 01–07 亮，光标自块 7 移到块 8、悬停、点击 → 窗口最大化；
   持续：五个页面矩形纵深穿越（pageDepth，首页→/music→/guestbook→/footprint→/topics）、灯次第亮、
   联系弹窗 8 图标围合、22px 钤印落章（局部 70f＝全局 5320f，入院唯一重音）；
   出场：反向收束→八块全亮、扫描线加速一次→面板收束成朱红晕光+纸页边缘。
   字幕两行「每一页，都在呼吸。」／「代码写诗，工具作画。」。 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, FILM_COLORS, inkRise, lightOn, orbitDrift, pageDepth, paperShake, sealStamp, sealTilt } from '../motion-tokens';
import { Caption } from '../components/Caption';
import { ConsoleCursor, ConsolePanel, ConsoleWindow, TILE_RECTS } from '../components/Console';
import { DustField } from '../components/DustField';
import { Grade } from '../components/Grade';
import { PaperGrain } from '../components/PaperGrain';

const DUR = 114;
const IN = 16;
const OUT = DUR - IN; // 98
const CLICK = 9;
const TILE = 7;
const STAMP = 70; // 全局 5320f（第 267 拍）
const WIN_OUT = 92;
const CLAMP = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

const mono = fontFamilies.mono;
const serif = fontFamilies.serif;

const tileCenter = (i: number) => ({ x: TILE_RECTS[i].x + TILE_RECTS[i].w / 2, y: TILE_RECTS[i].y + TILE_RECTS[i].h / 2 });

const PAGES = [
  { route: '/', name: '朝朝如念' },
  { route: '/music', name: '音乐' },
  { route: '/guestbook', name: '留言板' },
  { route: '/footprint', name: '足迹' },
  { route: '/topics', name: '主题' },
];

const ICONS = ['GH', 'ML', 'RS', 'X', 'B', 'WB', '♪', 'W'];

const CaptionPlate: FC<{ appearAt: number }> = ({ appearAt }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [appearAt, appearAt + 16], [0, 1], CLAMP);
  return (
    <div
      style={{
        position: 'absolute',
        left: 470,
        right: 470,
        bottom: 70,
        height: 340,
        background: `linear-gradient(180deg, transparent, ${colors.bg} 20%, ${colors.bg} 80%, transparent)`,
        opacity: p * 0.5,
        pointerEvents: 'none',
      }}
    />
  );
};

const ShotPageRoam: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const prev = tileCenter(TILE - 1);
  const to = tileCenter(TILE);
  const panelCenter = { x: 960, y: 540 };

  const fIn = interpolate(frame, [0, 7], [0.34, 1], { ...CLAMP, easing: CURVES.cineEaseInOut });
  const fOut = interpolate(frame, [98, 108], [0, 1], { ...CLAMP, easing: CURVES.cineEaseInOut });
  const cx = frame < 98 ? prev.x + (to.x - prev.x) * fIn : to.x + (panelCenter.x - to.x) * fOut;
  const cy = frame < 98 ? prev.y + (to.y - prev.y) * fIn : to.y + (panelCenter.y - to.y) * fOut;

  const ripple = interpolate(frame, [CLICK, CLICK + 18], [0, 1], CLAMP);
  const progress =
    frame < WIN_OUT
      ? interpolate(frame, [CLICK, IN], [0, 1], { ...CLAMP, easing: CURVES.cineEaseInOut })
      : interpolate(frame, [WIN_OUT, WIN_OUT + 10], [1, 0], { ...CLAMP, easing: CURVES.cineEaseInOut });

  const lit = frame >= CLICK ? [0, 1, 2, 3, 4, 5, 6, 7] : [0, 1, 2, 3, 4, 5, 6];
  const active = frame >= 6 && frame < OUT ? TILE : -1;
  const scanBoost = interpolate(frame, [94, 108], [0, 1.2], CLAMP);
  const panelOpacity = interpolate(frame, [104, DUR], [1, 0], { ...CLAMP, easing: CURVES.cineEaseInOut });
  const panelScale = interpolate(frame, [104, DUR], [1, 0.95], { ...CLAMP, easing: CURVES.cineEaseInOut });
  const halo = interpolate(frame, [100, DUR], [0, 0.55], { ...CLAMP, easing: CURVES.cineEaseOut });
  const edge = interpolate(frame, [100, DUR], [0, 1], { ...CLAMP, easing: CURVES.cineEaseOut });
  const sweep = interpolate(frame, [98, 108], [0, 1], { ...CLAMP, easing: CURVES.cineEaseIn });

  const fly = interpolate(frame, [22, 64], [0, 1], { ...CLAMP, easing: CURVES.cineEaseInOut });
  const modalP = interpolate(frame, [54, 64], [0, 1], { ...CLAMP, easing: CURVES.cineEaseOut });

  return (
    <AbsoluteFill>
      <ConsolePanel lit={lit} active={active} scanBoost={scanBoost} style={{ opacity: panelOpacity, transform: `scale(${panelScale})` }} />
      <Grade id="GR-01" />
      <DustField act={6} count={26} seedBase="s42" />
      <ConsoleCursor x={cx} y={cy} hover={frame >= 6 && frame < OUT} ripple={ripple} />

      <ConsoleWindow tile={TILE} progress={progress}>
        <AbsoluteFill style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, ...paperShake(frame, STAMP, 2, 12) }}>
          <div style={{ position: 'absolute', left: 140, top: 58, right: 140, display: 'flex', justifyContent: 'space-between', fontFamily: mono, fontSize: 15, letterSpacing: '0.24em', color: colors.muted, ...inkRise(frame, 18) }}>
            <span>08 / 页面漫游与钤印 · VIEW TRANSITION</span>
            <span>NO-JS · 5 PAGES</span>
          </div>

          <div style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, transform: `scale(${1 + fly * 0.5})`, transformOrigin: '50% 44%' }}>
            {[4, 3, 2, 1, 0].map((i) => {
              const pass = Math.min(1, Math.max(0, (fly - 0.12 - i * 0.17) / 0.22));
              const base = 1 - i * 0.16;
              return (
                <div
                  key={PAGES[i].route}
                  style={{
                    position: 'absolute',
                    left: 730,
                    top: 320,
                    width: 460,
                    height: 300,
                    transform: `scale(${base * (1 + pass * 0.45)})`,
                    opacity: 1 - pass,
                  }}
                >
                  <div style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, background: colors.paper, border: `1px solid ${colors.paperMuted}`, borderRadius: 12, ...pageDepth(frame, 20, 60, i), opacity: 1 }}>
                    <span style={{ position: 'absolute', left: 18, top: 14, fontFamily: mono, fontSize: 14, color: colors.muted, letterSpacing: '0.12em' }}>{PAGES[i].route}</span>
                    <div style={{ position: 'absolute', right: 18, top: 18, width: 10, height: 10, borderRadius: 5, background: FILM_COLORS.lampAmber, ...lightOn(frame, 24 + i * 8, fps) }} />
                    <span style={{ position: 'absolute', left: 0, right: 0, top: 128, textAlign: 'center', fontFamily: serif, fontSize: 32, color: colors.ink, letterSpacing: '0.1em' }}>{PAGES[i].name}</span>
                    <span style={{ position: 'absolute', left: 18, bottom: 16, fontFamily: mono, fontSize: 11, color: colors.muted, letterSpacing: '0.2em' }}>WUH.SITE</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div
            style={{
              position: 'absolute',
              left: 680,
              top: 250,
              width: 560,
              height: 440,
              background: colors.paper,
              border: `1px solid ${colors.paperMuted}`,
              borderRadius: 16,
              opacity: modalP,
              transform: `scale(${0.88 + modalP * 0.12})`,
            }}
          >
            <div style={{ position: 'absolute', left: 0, right: 0, top: 28, textAlign: 'center', fontFamily: serif, fontSize: 34, color: colors.ink, letterSpacing: '0.3em' }}>联系</div>
            <div style={{ position: 'absolute', left: 0, right: 0, top: 78, textAlign: 'center', fontFamily: mono, fontSize: 11, color: colors.muted, letterSpacing: '0.32em' }}>CONTACT · 8 LINKS</div>

            {ICONS.map((icon, i) => {
              const pt = orbitDrift(frame, 280, 258, 158, 128, 0, (i / ICONS.length) * Math.PI * 2 - Math.PI / 2);
              return (
                <div
                  key={icon}
                  style={{
                    position: 'absolute',
                    left: pt.x - 27,
                    top: pt.y - 27,
                    width: 54,
                    height: 54,
                    borderRadius: 27,
                    background: colors.paperDeep,
                    border: `1px solid ${colors.paperMuted}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: mono,
                    fontSize: 13,
                    color: colors.ink,
                    ...lightOn(frame, 56 + i * 1.5, fps),
                  }}
                >
                  {icon}
                </div>
              );
            })}

            <div
              style={{
                position: 'absolute',
                left: 424 - 30,
                top: 300 - 30,
                width: 172,
                height: 172,
                borderRadius: '50%',
                background: `radial-gradient(circle, ${colors.seal}, transparent 70%)`,
                opacity: interpolate(frame, [STAMP, STAMP + 16], [0.45, 0], CLAMP),
              }}
            />
            <div style={{ position: 'absolute', left: 424, top: 300, width: 112, height: 112 }}>
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: 112,
                  height: 112,
                  border: `2px solid ${colors.seal}`,
                  borderRadius: 4,
                  color: colors.seal,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 2,
                  ...sealStamp(frame, STAMP, fps, sealTilt('s42')),
                }}
              >
                <span style={{ fontFamily: serif, fontSize: 22, lineHeight: 1.2, letterSpacing: '0.08em' }}>代码写诗</span>
                <span style={{ fontFamily: serif, fontSize: 22, lineHeight: 1.2, letterSpacing: '0.08em' }}>工具作画</span>
              </div>
            </div>
          </div>
        </AbsoluteFill>
        <PaperGrain opacity={0.05} />
        <Grade id="GR-02" />
      </ConsoleWindow>

      {/* 出场：朱红晕光（局部径向）+ 纸页边缘 */}
      <div
        style={{
          position: 'absolute',
          left: 580,
          top: 160,
          width: 760,
          height: 760,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${colors.seal}, transparent 68%)`,
          opacity: halo * 0.6,
          mixBlendMode: 'screen',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 260,
          right: 260,
          bottom: 0,
          height: 260,
          background: FILM_COLORS.blankPaper,
          borderTop: `2px solid ${colors.seal}`,
          borderRadius: '10px 10px 0 0',
          transform: `translateY(${(1 - edge) * 260}px)`,
          opacity: edge,
        }}
      />
      {/* 扫描线加速一次 */}
      <div
        style={{
          position: 'absolute',
          left: 90,
          top: 90,
          width: 1740,
          height: 2,
          background: colors.accent,
          opacity: frame >= 98 ? 0.3 * (1 - sweep) : 0,
          transform: `translateY(${sweep * 900}px)`,
        }}
      />

      <CaptionPlate appearAt={26} />
      <Caption text="每一页，都在呼吸。" appearAt={26} bottom={214} />
      <Caption text="代码写诗，工具作画。" appearAt={34} bottom={142} />
    </AbsoluteFill>
  );
};

export default ShotPageRoam;
