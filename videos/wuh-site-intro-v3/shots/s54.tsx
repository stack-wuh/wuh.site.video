/* S54 · Act 8 此刻 · 局部帧 [0,106) · 106f · 绝对 7264–7370
 *
 * 最近日志（v3 新增镜·编年最新一笔）：从知识墙拉远，S12 About「最近日志」
 * 一页日志窗点亮展开（WIN-01，0–20）；FN-44 streamMerge 四源汇流——
 * GitHub / 豆瓣 / 微信读书 / 站内流光先后汇入（24–78，stagger 16f），
 * 聚成一页（2026-11-04 · #569；日志条目为标识不滚数）；
 * 角落画面小字「驿寄梅花，鱼传尺素」（题记回声，非字幕——「失渡→传书」对仗）。
 * 转场：入「切」，出「切」。字幕安全窗：start≥12、end≤94。
 * 尾帧：四源汇成一页、流光余辉未散。
 */
import type { FC } from 'react';
import { AbsoluteFill, Img, interpolate, useCurrentFrame } from 'remotion';
import { staticFile } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, writeFade } from '../../../brand/motion';
import { streamMerge } from '../motion-tokens';
import { Caption } from '../components/Caption';
import { DustField } from '../components/DustField';
import { Grade } from '../components/Grade';
import { PaperGrain } from '../components/PaperGrain';

const TOTAL = 106;
const SOURCES = ['GitHub', '豆瓣', '微信读书', '站内'];

const S54: FC = () => {
  const frame = useCurrentFrame();
  const streams = streamMerge(frame, 24, 78, 4);
  const camYaw = interpolate(frame, [24, 78], [0, -1.6], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const cam = { scale: 1.05, x: 0, y: 0, rot: camYaw };

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <div style={{ position: 'absolute', inset: 0, transform: `rotate(${cam.rot * 0.4}deg)` }}>
        {/* S12 日志窗（WIN-01 点亮展开） */}
        <div style={{ position: 'absolute', left: 400, top: 120, width: 1120, height: 840, borderRadius: 10, overflow: 'hidden', border: `1px solid ${colors.seal}`, boxShadow: '0 30px 80px rgba(0,0,0,0.5)', opacity: interpolate(frame, [0, 20], [0.4, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }), transform: `scale(${interpolate(frame, [0, 20], [0.94, 1])})` }}>
          <Img src={staticFile('wuh-site-intro-v3/site/s12-about-recent-v1.png')} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
          <AbsoluteFill style={{ background: colors.bg, opacity: 0.3 }} />

          {/* 四源流光（FN-44：先后汇入；来源标签 + 光径） */}
          {SOURCES.map((src, i) => {
            const s = streams[i];
            const x0 = [140, 420, 700, 980][i];
            return (
              <div key={src}>
                <svg width={1120} height={840} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                  <path d={`M ${x0 - 360} -40 Q ${x0 - 200} 300 ${x0 - 330} 760`} fill="none" stroke={colors.gold} strokeWidth={1.6} strokeDasharray={900} strokeDashoffset={(1 - s.progress) * 900} opacity={0.55 + s.arrive * 0.4} />
                </svg>
                <span style={{ position: 'absolute', left: x0 - 420, top: 40 + i * 44, fontFamily: fontFamilies.mono, fontSize: 16, color: colors.gold, opacity: writeFade(frame, 24 + i * 16).opacity }}>{src}</span>
              </div>
            );
          })}
          {/* 汇流落点（一页日志，标识不滚） */}
          <div style={{ position: 'absolute', left: 80, top: 640, ...writeFade(frame, 78) }}>
            <span style={{ fontFamily: fontFamilies.mono, fontSize: 17, color: colors.paper, opacity: 0.9 }}>最近 90 天 · 聚合</span>
          </div>
          {/* 流光余辉（尾帧） */}
          <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 80%, rgba(245,233,200,0.12), transparent 55%)`, opacity: interpolate(frame, [78, TOTAL], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }), pointerEvents: 'none' }} />
        </div>

        {/* 角落画面小字：驿寄梅花，鱼传尺素（题记回声，非字幕） */}
        <div style={{ position: 'absolute', left: 120, bottom: 110, ...writeFade(frame, 84, true) }}>
          <span style={{ fontFamily: fontFamilies.serif, fontSize: 26, color: colors.paper, opacity: 0.55, letterSpacing: '0.3em' }}>驿寄梅花，鱼传尺素</span>
        </div>
      </div>
      <DustField act={8} count={10} seedBase="s54" />
      <PaperGrain opacity={0.05} />
      <Grade id="GR-08" />
      <Caption text="十一月，GitHub、豆瓣、微信读书，汇进同一页日志。" appearAt={14} />
    </AbsoluteFill>
  );
};

export default S54;
