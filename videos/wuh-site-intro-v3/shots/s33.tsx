/* S33 · Act 6 入院 · 局部帧 [0,186) · 186f · 绝对 4826–5012
 * V2 深空数据流样片（2026-11-10 科技重构）：八年听歌年轮改写为「年度报告时间线」——
 * 发光时间线横贯画入（TIMELINE-FLOW 6–40）；2018–2025 八个年节点沿落点闪（dot 闪+年份点亮
 * 18+19i 原节奏）；线框数据唱片（同心辉光环自转 2.4°/f 保留）；唱针 12f 落碟心
 * （62–74 落定 74=绝对 4900=拍245 对音，164–170 抬起）；★DAT-04 EQ 辉光柱起势（74–84）；
 * 年度最爱歌名随扫掠点亮；p-music-player 截图降级为证据快闪小窗（114 出现→170 退场）。
 * 转场：入「切」，出「切」。两句字幕 ／ 分序原样保留：句 1 appearAt 20、句 2 appearAt 112。
 * 尾帧：时间线全亮 + 唱针抬起，元素稳定。
 */
import type { FC } from 'react';
import { AbsoluteFill, Img, interpolate, useCurrentFrame } from 'remotion';
import { staticFile } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { CURVES, eqBars, writeFade } from '../../../brand/motion';
import { FILM_COLORS2, glowText, timelineFlow } from '../motion-tokens';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';

/* 年度最爱（八年歌单播放之最；materials v3 §2.8——标识不滚数） */
const YEARS_FAV = [
  { year: 2018, song: '《诱惑的街 (Live)》林志炫' },
  { year: 2019, song: '《腻味》金玟岐' },
  { year: 2020, song: '《少年不凡》刘美麟' },
  { year: 2021, song: '《风月缠绵（金风玉露变奏）》陈致逸' },
  { year: 2022, song: '《归期》钱润玉' },
  { year: 2023, song: '《爱意（金风玉露变奏）》陈致逸' },
  { year: 2024, song: '《爱意（金风玉露变奏）》陈致逸' },
  { year: 2025, song: '《爱意（金风玉露变奏）》陈致逸' },
];

const NEEDLE_LAND = 74; // = 绝对 4900 = 拍245
const TL_X0 = 150;
const TL_X1 = 1770;
const TL_Y = 700;
const NODE_GAP = (TL_X1 - TL_X0) / YEARS_FAV.length;

/** 顺序字幕（两句 ／ 同镜先后衔接，句窗不重叠） */
const SeqCaption: FC<{ text: string; from: number; to: number }> = ({ text, from, to }) => {
  const frame = useCurrentFrame();
  if (frame < from || frame >= to) return null;
  const local = frame - from;
  const out = interpolate(local, [to - from - 12, to - from], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 150, textAlign: 'center', zIndex: 30, opacity: Math.min(1, interpolate(local, [0, 10], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })) * out }}>
      <span style={{ fontFamily: fontFamilies.serif, fontSize: 40, color: FILM_COLORS2.paperWhite, textShadow: `0 2px 18px rgba(2,3,8,0.9), 0 0 26px rgba(212,163,115,0.14)` }}>{text}</span>
    </div>
  );
};

const S33: FC = () => {
  const frame = useCurrentFrame();
  const vinylDeg = (frame * 2.4) % 360; // 黑胶 5s/圈 = 150f/圈 → 2.4°/f
  /* 时间线流动（6–40 画入；节点闪随画线推进） */
  const tl = timelineFlow(frame, 6, 34, YEARS_FAV.length, NODE_GAP);
  /* 年份扫掠（18–170，8 年） */
  const yearK = interpolate(frame, [18, 170], [0, 8], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const yearIdx = Math.min(7, Math.floor(yearK));
  /* 唱针（62–74 落下对音；164–170 抬起） */
  const needleDrop = interpolate(frame, [62, NEEDLE_LAND], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  const needleUp = interpolate(frame, [164, 170], [1, 0.2], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const needle = Math.min(needleDrop, needleUp);
  /* ★DAT-04 EQ 起势（74–84）→ 相位差贴拍 */
  const eqGrow = interpolate(frame, [NEEDLE_LAND, 84], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  const bars = eqBars(frame);
  /* 证据快闪：p-music-player（114–170 辉光小窗） */
  const proofIn = writeFade(frame, 114, true);
  const proofOut = interpolate(frame, [162, 170], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep }}>
      <DeepSpace seed="s33v2" stars={60} grid horizon />

      {/* 时间线（发光主线 + 刻度） */}
      <div style={{ position: 'absolute', left: TL_X0, width: TL_X1 - TL_X0, top: TL_Y, height: 2, background: 'rgba(212,163,115,0.14)' }} />
      <div
        style={{
          position: 'absolute',
          left: TL_X0,
          top: TL_Y,
          height: 2.5,
          width: TL_X1 - TL_X0,
          background: `linear-gradient(90deg, ${FILM_COLORS2.dataDim}, ${FILM_COLORS2.data})`,
          boxShadow: `0 0 14px 3px rgba(212,163,115,0.35)`,
          opacity: 0.9,
          clipPath: `inset(0 ${Math.max(0, (1 - tl.progress)) * 100}% 0 0)`,
        }}
      />

      {/* 八个年节点（年份点亮 18+19i 原节奏；落点闪随线到） */}
      {YEARS_FAV.map((y, i) => {
        const x = TL_X0 + i * NODE_GAP;
        const on = frame >= 18 + i * 19;
        const flash = tl.nodeFlash(i);
        const current = i === yearIdx;
        return (
          <div key={y.year}>
            <div
              style={{
                position: 'absolute',
                left: x - (5 + flash * 3),
                top: TL_Y - (5 + flash * 3),
                width: 10 + flash * 6,
                height: 10 + flash * 6,
                borderRadius: 8,
                background: current ? FILM_COLORS2.data : FILM_COLORS2.paperWhite,
                boxShadow: `0 0 ${12 + flash * 22}px ${3 + flash * 5}px rgba(212,163,115,${0.22 + flash * 0.4})`,
                opacity: on ? 0.95 : 0.3,
              }}
            />
            {/* 年份（当前扫掠位辉光） */}
            <div style={{ position: 'absolute', left: x - 30, top: TL_Y - 96, width: 60, textAlign: 'center' }}>
              <span style={{ fontFamily: fontFamilies.mono, fontSize: 26, fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: current ? FILM_COLORS2.data : FILM_COLORS2.textMuted, opacity: on ? 1 : 0.35, ...(current ? glowText(FILM_COLORS2.data, 0.55) : {}) }}>{y.year}</span>
            </div>
            {/* 年度最爱歌名 */}
            <div style={{ position: 'absolute', left: x - 95, top: TL_Y + 26, width: 190, textAlign: 'center' }}>
              <span style={{ fontFamily: fontFamilies.serif, fontSize: 15, color: FILM_COLORS2.paperWhite, opacity: on ? (current ? 0.95 : 0.6) : 0.25 }}>{on ? y.song : '· · ·'}</span>
            </div>
          </div>
        );
      })}

      {/* 线框数据唱片（同心辉光环自转；唱针 62–74 落碟心对音） */}
      <div style={{ position: 'absolute', left: 1140, top: 170, width: 480, height: 480 }}>
        <div style={{ position: 'absolute', inset: 0, transform: `rotate(${vinylDeg}deg)` }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                inset: 24 + i * 46,
                borderRadius: 240,
                border: `1px solid ${i % 2 === 0 ? FILM_COLORS2.line : FILM_COLORS2.dataDim}`,
                opacity: 0.5 - i * 0.06,
                boxShadow: i === 2 ? `0 0 18px rgba(212,163,115,0.16), inset 0 0 18px rgba(212,163,115,0.1)` : 'none',
              }}
            />
          ))}
          <div style={{ position: 'absolute', left: '50%', top: '50%', width: 12, height: 12, borderRadius: 6, transform: 'translate(-6px,-6px)', background: FILM_COLORS2.data, boxShadow: `0 0 18px 6px rgba(212,163,115,0.5)` }} />
        </div>
        {/* 唱针（线框光针） */}
        <div style={{ position: 'absolute', right: -8, top: 40, width: 150, height: 4, borderRadius: 2, background: `linear-gradient(90deg, ${FILM_COLORS2.dataDim}, ${FILM_COLORS2.data})`, opacity: 0.9, transform: `rotate(${18 + needle * 26}deg)`, transformOrigin: 'right center', boxShadow: `0 0 10px rgba(212,163,115,0.4)` }} />
        <div style={{ position: 'absolute', right: -16, top: 28, width: 24, height: 24, borderRadius: 12, border: `1.5px solid ${FILM_COLORS2.dataDim}`, opacity: 0.8 }} />
      </div>

      {/* ★DAT-04 EQ 辉光柱（74–84 起势 → 相位差贴拍） */}
      <div style={{ position: 'absolute', left: 1690, top: 380, display: 'flex', gap: 22, alignItems: 'flex-end' }}>
        {bars.map((v, i) => (
          <div
            key={i}
            style={{
              width: 30,
              height: eqGrow * (56 + v * 150),
              background: `linear-gradient(180deg, ${FILM_COLORS2.data}, ${FILM_COLORS2.dataDim})`,
              borderRadius: 3,
              boxShadow: `0 0 ${8 + v * 14}px rgba(212,163,115,${0.25 + v * 0.2})`,
              opacity: 0.9,
            }}
          />
        ))}
      </div>

      {/* 证据快闪：p-music-player 迷你播放器（辉光小窗，114 出现 → 170 退场） */}
      <div style={{ position: 'absolute', right: 130, bottom: 150, width: 330, zIndex: 28, opacity: Number(proofIn.opacity ?? 0) * proofOut, transform: `${proofIn.transform} scale(${interpolate(frame, [114, 126], [1.07, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })})` }}>
        <Img
          src={staticFile('wuh-site-intro-v3/site/p-music-player-v1.png')}
          style={{
            width: '100%',
            borderRadius: 8,
            border: `1px solid ${FILM_COLORS2.dataDim}`,
            boxShadow: `0 0 30px rgba(212,163,115,0.22), 0 18px 44px rgba(0,0,0,0.6)`,
            display: 'block',
          }}
        />
        <div style={{ position: 'absolute', left: -1, right: -1, top: -1, bottom: -1, borderRadius: 9, border: `1px solid rgba(212,163,115,0.4)`, opacity: 0.6, pointerEvents: 'none' }} />
      </div>

      <HudChrome label="wuh.site · MUSIC" readout="2018–2025" />
      <Grade2 id="GR2-06" />
      <SeqCaption text="时间的年轮，刻着每一年的歌。" from={20} to={106} />
      <SeqCaption text="黑胶还在转，时光没走远。" from={112} to={168} />
    </AbsoluteFill>
  );
};

export default S33;
