/* S54 · Act 8 此刻 · 局部帧 [0,106) · 106f · 绝对 7264–7370
 *
 * 审计重定义（2026-11-12 批次 E 返工单）：保留 FN-44 streamMerge 四源流光结构（24–78 原窗口），
 * 补「节点标签亮起」（四源 springIn 弹出：node dot 闪 + 标签位移入场，原地淡入退役）
 * 与「落点冲击」（78 汇流瞬间：暖金双环 + 金粒锚在汇流点，聚合行 lightOn 同拍落位）。
 * 角落题记「驿寄梅花，鱼传尺素」上移出字幕安全区（bottom 110→170，镜内文字禁入 bottom 150px）。
 *
 * 编排四问：
 * ① 承接——s53 尾帧交出「知识墙」：0–20 线框日志窗点亮展开（WIN-01 原窗口），四源在窗外待发。
 * ② 触发——24 起四源流光先后出发（stagger 16f 原窗口），每个源头 node dot 弹亮 + 标签 springIn。
 * ③ 展开——流光 pathDraw 真长度画入（24–78）；[78] 四流抵达同一页 = 落点冲击（双环+金粒）
 *   + 「最近 90 天 · 聚合」lightOn 落位；[82–96] 三行日志条点亮；[84] 题记 springIn。
 * ④ 交接——尾帧：四源汇成一页、流光余辉未散（manifest endFrameDesc 契约「交接态：日志页+余辉」原样）。
 *
 * 逐拍帧表（局部帧，fps=30）：
 * [0–20]    日志窗点亮展开（opacity 0.4→1 + scale 0.94→1 原窗口）；窗头 RECENT LOGS；
 * [24/40/56/72] 四源节点 dot+标签 springIn 依次弹亮（GitHub / 豆瓣 / 微信读书 / 站内）；
 * [24–78]   四条流光 inkDraw 真长度画入（stagger 16f， arrive 增亮）；
 * [78]      落点冲击：shockwave 暖金双环 + sparkBurst('s54-burst',14 金粒) + 聚合行 lightOn；
 * [82–96]   三行日志条错峰点亮（82+i*5）；[84] 题记 springIn（bottom 170 安全区上）；
 * [78–106]  流光余辉 radial 渐起 = 交接态。
 * 时间轴零改动：106f / 流光 24–78 / Caption（文本+appearAt 14）原样；无 <Sequence>；
 * FILM_COLORS2 only；random(seed) only；springIn fps 取 useVideoConfig()。
 * 转场：入「切」，出「切」。字幕安全窗：start≥12、end≤94。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { FILM_COLORS2, inkDraw, lightOn, shockwave, sparkBurst, springIn, streamMerge } from '../motion-tokens';
import { Caption } from '../components/Caption';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';

const TOTAL = 106;
const MERGE_AT = 78;
const SOURCES = ['GitHub', '豆瓣', '微信读书', '站内'];
const GOLD = '233,217,174';

const S54: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const streams = streamMerge(frame, 24, MERGE_AT, 4);
  /* 落点冲击（78）：锚窗内汇流点 (480,700) → 画面 (880,820)，在字幕安全区之上 */
  const wave = shockwave(frame, MERGE_AT, GOLD);
  const burst = sparkBurst('s54-burst', frame, MERGE_AT, 14, true);
  const camYaw = interpolate(frame, [24, MERGE_AT], [0, -1.6], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
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

          {/* 四源节点标签亮起（springIn 弹出：dot 闪 + 标签位移入场）+ 流光（FN-44 原结构） */}
          {SOURCES.map((src, i) => {
            const s = streams[i];
            const nodeP = springIn(frame, 24 + i * 16, fps);
            const nodeFlash = interpolate(frame, [24 + i * 16, 26 + i * 16, 35 + i * 16], [0, 0.9, 0.2], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
            const x0 = [140, 420, 700, 980][i];
            const arcD = `M ${x0 - 360} -40 Q ${x0 - 200} 300 ${x0 - 330} 760`; // 真长度驱动
            return (
              <div key={src}>
                <svg width={1120} height={840} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                  <path d={arcD} fill="none" stroke="rgba(212,163,115,0.28)" strokeWidth={5} {...inkDraw(s.progress, arcD)} />
                  <path d={arcD} fill="none" stroke={FILM_COLORS2.data} strokeWidth={1.6} {...inkDraw(s.progress, arcD)} opacity={0.55 + s.arrive * 0.4} />
                </svg>
                {/* 节点 dot（弹亮 + 闪） */}
                <div
                  style={{
                    position: 'absolute',
                    left: x0 - 446,
                    top: 46 + i * 44,
                    width: 12,
                    height: 12,
                    borderRadius: 6,
                    background: FILM_COLORS2.data,
                    opacity: Math.min(1, nodeP * 1.6),
                    transform: `scale(${0.6 + nodeP * 0.4})`,
                    boxShadow: nodeFlash > 0.15 ? `0 0 12px 3px rgba(212,163,115,${nodeFlash * 0.55})` : `0 0 6px rgba(212,163,115,0.3)`,
                  }}
                />
                {/* 源标签（位移入场） */}
                <span
                  style={{
                    position: 'absolute',
                    left: x0 - 426,
                    top: 40 + i * 44,
                    fontFamily: fontFamilies.mono,
                    fontSize: 16,
                    color: FILM_COLORS2.data,
                    opacity: Math.min(1, nodeP * 1.4),
                    transform: `translateX(${(1 - nodeP) * -16}px)`,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {src}
                </span>
              </div>
            );
          })}

          {/* 汇流落点（一页日志，78 lightOn 同拍落位，标识不滚） */}
          <div style={{ position: 'absolute', left: 80, top: 600, ...lightOn(frame, MERGE_AT, fps) }}>
            <span style={{ fontFamily: fontFamilies.mono, fontSize: 17, color: FILM_COLORS2.paperWhite, opacity: 0.9, textShadow: `0 0 12px rgba(212,163,115,0.35)` }}>最近 90 天 · 聚合</span>
            <div style={{ marginTop: 14, fontFamily: fontFamilies.mono, fontSize: 15, color: FILM_COLORS2.textMuted, opacity: 0.85 }}>2026-11-04 · #569</div>
          </div>
          {/* 日志行（落点显影后点亮，线框读数） */}
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ position: 'absolute', left: 80, top: 706 + i * 36, width: 960 - i * 120, height: 8, borderRadius: 2, background: FILM_COLORS2.dataDim, opacity: interpolate(frame, [82 + i * 5, 92 + i * 5], [0, 0.3], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }} />
          ))}
          {/* 流光余辉（尾帧） */}
          <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 80%, rgba(212,163,115,0.12), transparent 55%)`, opacity: interpolate(frame, [MERGE_AT, TOTAL], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }), pointerEvents: 'none' }} />
        </div>

        {/* 落点冲击（78）：双环 + 金粒，窗内汇流点 (480,700) → 画面 (880,820) */}
        {frame >= MERGE_AT ? (
          <div style={{ position: 'absolute', left: 880, top: 820, width: 0, height: 0, zIndex: 30, pointerEvents: 'none' }}>
            {wave ? <div style={wave.ring1} /> : null}
            {wave ? <div style={wave.ring2} /> : null}
            {burst.map((p, i) => (
              <div key={i} style={p.style} />
            ))}
          </div>
        ) : null}

        {/* 角落画面小字：驿寄梅花，鱼传尺素（题记回声，非字幕；84 springIn；bottom 170 避开字幕安全区） */}
        <div style={{ position: 'absolute', left: 120, bottom: 170, opacity: Math.min(1, springIn(frame, 84, fps) * 1.4), transform: `translateY(${(1 - springIn(frame, 84, fps)) * 16}px)` }}>
          <span style={{ fontFamily: fontFamilies.serif, fontSize: 26, color: FILM_COLORS2.paperWhite, opacity: 0.55, letterSpacing: '0.3em', textShadow: `0 0 18px rgba(212,163,115,0.18)` }}>驿寄梅花，鱼传尺素</span>
        </div>
      </div>
      <HudChrome label="wuh.site · LOGS" readout={frame >= MERGE_AT ? '4 SOURCES → 1 PAGE' : 'STREAMING…'} />
      <Grade2 id="GR2-08" />
      <Caption text="十一月，GitHub、豆瓣、微信读书，汇进同一页日志。" appearAt={14} />
    </AbsoluteFill>
  );
};

export default S54;
