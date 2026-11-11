/* S54 · Act 8 此刻 · 局部帧 [0,106) · 106f · 绝对 7264–7370
 *
 * V2 深空数据流重构（2026-11-11）：S12 日志截图退役，日志页改线框数据窗
 * （WIN-01 点亮展开 0–20 原窗口，panel 底+琥珀边+辉光+深投影）；FN-44
 * streamMerge 四源汇流——GitHub / 豆瓣 / 微信读书 / 站内 流光先后汇入
 * （24–78，stagger 16f 原窗口，琥珀光径+来源标签）；汇流落点「最近 90 天 ·
 * 聚合 · 2026-11-04 · #569」（78 起，日志条目为标识不滚数）；
 * 角落画面小字「驿寄梅花，鱼传尺素」（题记回声，非字幕——「失渡→传书」对仗）。
 * 转场：入「切」，出「切」。字幕安全窗：start≥12、end≤94。
 * 尾帧：四源汇成一页、流光余辉未散。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { writeFade } from '../../../brand/motion';
import { FILM_COLORS2, glowText, inkDraw, streamMerge } from '../motion-tokens';
import { Caption } from '../components/Caption';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';

const TOTAL = 106;
const SOURCES = ['GitHub', '豆瓣', '微信读书', '站内'];

const S54: FC = () => {
  const frame = useCurrentFrame();
  const streams = streamMerge(frame, 24, 78, 4);
  const camYaw = interpolate(frame, [24, 78], [0, -1.6], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const cam = { scale: 1.05, x: 0, y: 0, rot: camYaw };

  return (
    <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep }}>
      <DeepSpace seed="s54v2" stars={52} grid />
      <div style={{ position: 'absolute', inset: 0, transform: `rotate(${cam.rot * 0.4}deg)` }}>
        {/* 线框日志窗（WIN-01 点亮展开 0–20） */}
        <div
          style={{
            position: 'absolute',
            left: 400,
            top: 120,
            width: 1120,
            height: 840,
            borderRadius: 10,
            overflow: 'hidden',
            border: `1px solid ${FILM_COLORS2.dataDim}`,
            boxShadow: `0 0 44px rgba(212,163,115,0.16), 0 30px 80px rgba(0,0,0,0.6)`,
            background: FILM_COLORS2.panel,
            opacity: interpolate(frame, [0, 20], [0.4, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
            transform: `scale(${interpolate(frame, [0, 20], [0.94, 1])})`,
          }}
        >
          {/* 窗头（数据行，非仿真浏览器 chrome） */}
          <div style={{ position: 'absolute', left: 36, top: 28, display: 'flex', alignItems: 'baseline', gap: 16 }}>
            <span style={{ fontFamily: fontFamilies.mono, fontSize: 16, letterSpacing: '0.26em', color: FILM_COLORS2.data, opacity: 0.85 }}>RECENT LOGS</span>
            <span style={{ fontFamily: fontFamilies.mono, fontSize: 14, color: FILM_COLORS2.textMuted, opacity: 0.8 }}>wuh.site/about</span>
          </div>
          <div style={{ position: 'absolute', left: 36, right: 36, top: 66, height: 1, background: FILM_COLORS2.line, opacity: 0.7 }} />

          {/* 四源流光（FN-44：先后汇入；来源标签 + 光径） */}
          {SOURCES.map((src, i) => {
            const s = streams[i];
            const x0 = [140, 420, 700, 980][i];
            const arcD = `M ${x0 - 360} -40 Q ${x0 - 200} 300 ${x0 - 330} 760`; // 真长度驱动，不再猜 900
            return (
              <div key={src}>
                <svg width={1120} height={840} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                  <path d={arcD} fill="none" stroke="rgba(212,163,115,0.28)" strokeWidth={5} {...inkDraw(s.progress, arcD)} />
                  <path d={arcD} fill="none" stroke={FILM_COLORS2.data} strokeWidth={1.6} {...inkDraw(s.progress, arcD)} opacity={0.55 + s.arrive * 0.4} />
                </svg>
                <span style={{ position: 'absolute', left: x0 - 420, top: 40 + i * 44, fontFamily: fontFamilies.mono, fontSize: 16, color: FILM_COLORS2.data, opacity: Number(writeFade(frame, 24 + i * 16).opacity ?? 0) }}>{src}</span>
              </div>
            );
          })}

          {/* 汇流落点（一页日志，标识不滚） */}
          <div style={{ position: 'absolute', left: 80, top: 600, ...writeFade(frame, 78) }}>
            <span style={{ fontFamily: fontFamilies.mono, fontSize: 17, color: FILM_COLORS2.paperWhite, opacity: 0.9 }}>最近 90 天 · 聚合</span>
            <div style={{ marginTop: 14, fontFamily: fontFamilies.mono, fontSize: 15, color: FILM_COLORS2.textMuted, opacity: 0.85 }}>2026-11-04 · #569</div>
          </div>
          {/* 日志行（落点显影后点亮，线框读数） */}
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ position: 'absolute', left: 80, top: 706 + i * 36, width: 960 - i * 120, height: 8, borderRadius: 2, background: FILM_COLORS2.dataDim, opacity: interpolate(frame, [82 + i * 5, 92 + i * 5], [0, 0.3], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }} />
          ))}
          {/* 流光余辉（尾帧） */}
          <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 80%, rgba(212,163,115,0.12), transparent 55%)`, opacity: interpolate(frame, [78, TOTAL], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }), pointerEvents: 'none' }} />
        </div>

        {/* 角落画面小字：驿寄梅花，鱼传尺素（题记回声，非字幕） */}
        <div style={{ position: 'absolute', left: 120, bottom: 110, ...writeFade(frame, 84, true) }}>
          <span style={{ fontFamily: fontFamilies.serif, fontSize: 26, color: FILM_COLORS2.paperWhite, opacity: 0.55, letterSpacing: '0.3em', ...glowText(FILM_COLORS2.data, 0.16) }}>驿寄梅花，鱼传尺素</span>
        </div>
      </div>
      <HudChrome label="wuh.site · LOGS" readout="4 SOURCES → 1 PAGE" />
      <Grade2 id="GR2-08" />
      <Caption text="十一月，GitHub、豆瓣、微信读书，汇进同一页日志。" appearAt={14} />
    </AbsoluteFill>
  );
};

export default S54;
