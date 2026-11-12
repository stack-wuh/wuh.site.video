/* S59 · Act 8 此刻 · 局部帧 [0,114) · 114f · 绝对 7850–7964
 *
 * 审计重定义（2026-11-12 批次 E 返工单）：影像枝 = 胶片框微缩件×3 依次点亮（24/44/64 原节奏：
 * 每枚真实胶片框——框线 + 上下齿孔 + 片名条《朝朝如念》4:00 / intro v2 4:46 / 《风陵·致郭襄》4:52，
 * springIn 位移弹亮 + 落定闪光，原地淡入小签退役）；枝尖胶片框 74–96 点亮（原窗口），
 * [96–114] 枝 5 胶片光最亮（brightness 1→1.35 + 金辉光增益压过全部微缩件）
 * + 全树辉光渐起（manifest 尾帧契约「五枝全树成形、枝 5 胶片光最亮」字面兑现）。
 *
 * 编排四问：
 * ① 承接——s58 尾帧交出「树+枝 1–4（落盘定格）」：全树常驻，枝 5 最右生长。
 * ② 触发——枝尖一格胶片框先透光（74 起），三枚长片微缩件沿枝依次点亮回溯（24/44/64）。
 * ③ 展开——[6–32] 枝 5 生长 / [12] 标签卡 springIn / [24/44/64] 三枚胶片框 springIn 依次点亮
 *   （位移+旋转微落定，落定闪 9f）/ [74–96] 枝尖框点亮 / [96–114] 枝 5 光最亮 + 全树辉光。
 * ④ 交接——尾帧：五枝全树成形、枝 5 胶片光最亮（endFrameDesc 契约原样，交 s60 总结纸页）。
 *
 * 逐拍帧表（局部帧，fps=30）：
 * [6–32]    枝 5 treeGrow 生长（辉光双层描边）；[12] 标签卡 springIn（2026-10-24 · 234 commits）；
 * [24/44/64] 胶片框微缩件×3 springIn 依次点亮（沿枝向枝尖递进：400→484→568），落定闪光 + 片名条显影；
 * [74–96]   枝尖胶片框点亮（filmGlow 0→1，原窗口）；[96–114] tipBright 1→1.35 枝 5 光最亮
 *           + 全树 radial 辉光渐起 = 交接态。
 * 时间轴零改动：114f / 枝 5 6–32 / 点亮拍 24/44/64 / 枝尖 74–96 / Caption（文本+appearAt 14）原样；
 * 无 <Sequence>；FILM_COLORS2 only；random(seed) only；springIn fps 取 useVideoConfig()。
 * 转场：入「切」，出「切」。字幕安全窗：start≥12、end≤102。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { CURVES } from '../../../brand/motion';
import { FILM_COLORS2, glowText, springIn, treeGrow } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { Caption } from '../components/Caption';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';

const TOTAL = 114;
const GOLD = '233,217,174';
const FILMS = [
  { name: '朝朝如念', dur: '4:00', x: 1040, y: 400 },
  { name: 'intro v2', dur: '4:46', x: 1160, y: 484 },
  { name: '风陵·致郭襄', dur: '4:52', x: 1280, y: 568 },
];
const FILM_LANDS = [24, 44, 64]; // 原节奏不动
/** 枝 5（真长度由 evolvePath 计算） */
const B5_D = 'M 905 560 C 1010 470 1130 420 1300 400';

/** 胶片框微缩件（框线 + 上下齿孔 + 片名条；纯排版） */
const FilmFrame: FC<{ name: string; dur: string; lit: number; flash: number }> = ({ name, dur, lit, flash }) => (
  <div
    style={{
      width: 190,
      height: 120,
      borderRadius: 6,
      border: `2px solid ${FILM_COLORS2.gold}`,
      background: FILM_COLORS2.panel,
      boxShadow: `0 0 ${8 + lit * 14 + flash * 22}px ${2 + flash * 6}px rgba(${GOLD},${0.14 * lit + flash * 0.3})`,
      position: 'relative',
      overflow: 'hidden',
    }}
  >
    {/* 上下齿孔 */}
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={`t${i}`} style={{ position: 'absolute', left: 12 + i * 28, top: 5, width: 12, height: 6, borderRadius: 1.5, background: FILM_COLORS2.dataDim, opacity: 0.6 }} />
    ))}
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={`b${i}`} style={{ position: 'absolute', left: 12 + i * 28, bottom: 5, width: 12, height: 6, borderRadius: 1.5, background: FILM_COLORS2.dataDim, opacity: 0.6 }} />
    ))}
    {/* 片名条 */}
    <div style={{ position: 'absolute', left: 10, right: 10, top: 22, bottom: 22, borderRadius: 3, border: `1px solid ${FILM_COLORS2.line}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, opacity: interpolate(lit, [0.3, 1], [0.3, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>
      <span style={{ fontFamily: fontFamilies.serif, fontSize: 17, color: FILM_COLORS2.paperWhite, opacity: 0.92, whiteSpace: 'nowrap' }}>《{name}》</span>
      <span style={{ fontFamily: fontFamilies.mono, fontSize: 12, color: FILM_COLORS2.data, letterSpacing: '0.16em' }}>{dur}</span>
    </div>
  </div>
);

const S59: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b5 = treeGrow(frame, 6, 32, B5_D);
  const cardP = springIn(frame, 12, fps);
  /* 枝尖胶片框：74–96 点亮（原窗口），96–114 光最亮（brightness + 辉光增益） */
  const filmGlow = interpolate(frame, [74, 96], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  const tipBright = interpolate(frame, [96, TOTAL], [1, 1.35], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const tipPulse = 0.85 + 0.15 * Math.sin(frame / 5);
  /* 末段全树辉光渐起（交接态） */
  const treeGlow = interpolate(frame, [96, TOTAL], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const cam = { scale: 1.04, x: interpolate(frame, [0, TOTAL], [10, -60], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }), y: 0, rot: 0 };

  return (
    <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep }}>
      <CameraRig cam={cam}>
        <AbsoluteFill>
          <DeepSpace seed="s59v2" stars={52} grid horizon />
          {/* 全树常驻（琥珀墨）+ 枝 5（最右，生长） */}
          <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            <path d="M 910 520 C 900 640 880 760 850 880" fill="none" stroke="rgba(212,163,115,0.16)" strokeWidth={18} />
            <path d="M 910 520 C 900 640 880 760 850 880" fill="none" stroke={FILM_COLORS2.data} strokeWidth={9} opacity={0.92} />
            <path d="M 880 660 C 700 620 520 600 300 620" fill="none" stroke="rgba(212,163,115,0.14)" strokeWidth={12} />
            <path d="M 880 660 C 700 620 520 600 300 620" fill="none" stroke={FILM_COLORS2.data} strokeWidth={4.5} opacity={0.88} />
            <path d="M 880 700 C 1060 700 1240 720 1420 700" fill="none" stroke="rgba(212,163,115,0.14)" strokeWidth={12} />
            <path d="M 880 700 C 1060 700 1240 720 1420 700" fill="none" stroke={FILM_COLORS2.data} strokeWidth={4.5} opacity={0.88} />
            <path d="M 890 620 C 980 520 1090 460 1230 430" fill="none" stroke="rgba(212,163,115,0.14)" strokeWidth={11} />
            <path d="M 890 620 C 980 520 1090 460 1230 430" fill="none" stroke={FILM_COLORS2.data} strokeWidth={4} opacity={0.88} />
            <path d="M 895 600 C 830 520 760 470 640 445" fill="none" stroke="rgba(212,163,115,0.14)" strokeWidth={11} />
            <path d="M 895 600 C 830 520 760 470 640 445" fill="none" stroke={FILM_COLORS2.data} strokeWidth={4} opacity={0.88} />
            <path d={B5_D} fill="none" stroke="rgba(212,163,115,0.14)" strokeWidth={11} {...b5.stroke} />
            <path d={B5_D} fill="none" stroke={FILM_COLORS2.data} strokeWidth={4} {...b5.stroke} opacity={0.88} />
          </svg>

          {/* 枝 5 标签卡（12 springIn，线框数据卡） */}
          <div style={{ position: 'absolute', left: 890, top: 300, opacity: Math.min(1, cardP * 1.5), transform: `translateY(${(1 - cardP) * 22}px) scale(${0.94 + cardP * 0.06})` }}>
            <div
              style={{
                background: FILM_COLORS2.panel,
                border: `1px solid ${FILM_COLORS2.dataDim}`,
                borderRadius: 8,
                padding: '18px 26px',
                boxShadow: `0 0 26px rgba(212,163,115,0.16), 0 16px 44px rgba(0,0,0,0.55)`,
                whiteSpace: 'nowrap',
              }}
            >
              <div style={{ fontFamily: fontFamilies.mono, fontSize: 22, color: FILM_COLORS2.paperWhite, ...glowText(FILM_COLORS2.data, 0.2) }}>wuh.site.video</div>
              <div style={{ fontFamily: fontFamilies.mono, fontSize: 15, color: FILM_COLORS2.textMuted, marginTop: 8 }}>2026-10-24 · 234 commits</div>
            </div>
          </div>

          {/* 三部长片胶片框微缩件（24/44/64 依次点亮，springIn 位移弹亮 + 落定闪光） */}
          {FILMS.map((f, i) => {
            const p = springIn(frame, FILM_LANDS[i], fps);
            const lit = interpolate(frame, [FILM_LANDS[i], FILM_LANDS[i] + 10], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
            const flash = interpolate(frame, [FILM_LANDS[i] + 12, FILM_LANDS[i] + 14, FILM_LANDS[i] + 24], [0, 0.85, 0.12], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
            if (frame < FILM_LANDS[i]) return null;
            return (
              <div key={f.name} style={{ position: 'absolute', left: f.x, top: f.y, opacity: Math.min(1, p * 1.6), transform: `translateY(${(1 - p) * -20}px) rotate(${(1 - p) * (i % 2 ? 3 : -3)}deg)`, filter: `brightness(${1 + flash * 0.5})` }}>
                <FilmFrame name={f.name} dur={f.dur} lit={lit} flash={flash} />
              </div>
            );
          })}

          {/* 枝尖胶片框（74–96 点亮；96–114 枝 5 光最亮：brightness 1→1.35 + 金辉光增益） */}
          <div style={{ position: 'absolute', left: 1420, top: 300, width: 190, height: 130, opacity: filmGlow, filter: `brightness(${tipBright})` }}>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: 6,
                border: `2px solid ${FILM_COLORS2.gold}`,
                boxShadow: `0 0 ${24 * filmGlow * tipPulse + 26 * treeGlow}px ${8 * filmGlow + 10 * treeGlow}px rgba(${GOLD},${(0.3 * filmGlow + 0.22 * treeGlow) * tipPulse})`,
              }}
            />
            <div style={{ position: 'absolute', left: 14, right: 14, top: 14, bottom: 14, background: `repeating-linear-gradient(0deg, rgba(233,217,174,0.28) 0 6px, transparent 6px 16px)` }} />
          </div>

          {/* 末段全树辉光渐起（交接态：全树+胶片光最亮） */}
          <AbsoluteFill style={{ background: `radial-gradient(ellipse 62% 52% at 50% 52%, rgba(212,163,115,0.1), transparent 70%)`, opacity: treeGlow, pointerEvents: 'none' }} />
        </AbsoluteFill>
      </CameraRig>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 300, backgroundImage: `linear-gradient(180deg, transparent, ${FILM_COLORS2.spaceDeep})`, opacity: 0.2 }} />
      <HudChrome label="wuh.site · GRAPH" readout={frame >= 96 ? 'BRANCH 5 · FILM LIT' : 'BRANCH 5 · VIDEO'} />
      <Grade2 id="GR2-08" />
      <Caption text="最后是一间视频工作室——三部长片之后，这部片子也是它做的。" appearAt={14} />
    </AbsoluteFill>
  );
};

export default S59;
