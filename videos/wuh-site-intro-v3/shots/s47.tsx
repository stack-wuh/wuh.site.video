/* S47 · Act 7 坐忘 · 局部帧 [0,96) · 96f · 绝对 6428–6524
 *
 * 落款（r4 纪律：背景与镜 46 完全一致——同一四列右起 landed 版式，无 LOWER_TOP）：
 * 底部落款位「——司马承祯《坐忘歌》」笔锋 stroke 生长（20–72=绝对 6448–6500，
 * 小字衬线）；极小「忘」字闲章 4f 落定 72=绝对 6500=拍325；
 * 缓拉 100→102%（76–96）露整页。转场：入「切」，出「切」。无字幕（画面落款）。
 * 尾帧：整页字与印静止。
 */
import type { FC } from 'react';
import { AbsoluteFill, Img, interpolate, useCurrentFrame } from 'remotion';
import { staticFile } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, sealStamp, sealTilt, writeFade } from '../../../brand/motion';
import { DustField } from '../components/DustField';
import { Grade } from '../components/Grade';
import { PaperGrain } from '../components/PaperGrain';

const TOTAL = 96;
/** 与 s46 完全一致的列数据（r4：两镜背景版式逐字对齐） */
const COLS = ['不恼心地清凉。', '不怒百神和畅，', '少思慧烛内光。', '常默元气不伤，'];

const S47: FC = () => {
  const frame = useCurrentFrame();
  const cam = { scale: interpolate(frame, [76, TOTAL], [1.0, 1.02], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }), x: 0, y: 0, rot: 0 };

  return (
    <AbsoluteFill style={{ background: colors.paper }}>
      <div style={{ position: 'absolute', inset: 0, transform: `scale(${cam.scale})` }}>
        {/* 背景与 s46 完全一致：S03 纸纹 + 四列 landed（全部已落定） */}
        <Img src={staticFile('wuh-site-intro-v3/site/s03-post-165-v1.png')} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(14px) brightness(1.06) saturate(0.5)', opacity: 0.4 }} />
        <AbsoluteFill style={{ background: colors.paper, opacity: 0.62 }} />
        <div style={{ position: 'absolute', left: 0, right: 0, top: 380, display: 'flex', justifyContent: 'center', gap: 130 }}>
          {COLS.map((colText, col) => (
            <div key={col} style={{ display: 'flex', gap: 12 }}>
              {colText.split('').map((ch, chIdx) => (
                <span key={chIdx} style={{ fontFamily: fontFamilies.serif, fontSize: 74, color: colors.ink, display: 'inline-block', textShadow: `0 2px 0 rgba(0,0,0,0.08)`, whiteSpace: 'pre' }}>
                  {ch}
                </span>
              ))}
            </div>
          ))}
        </div>
        {/* 落款笔锋生长（20–72） */}
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 190, textAlign: 'center', ...writeFade(frame, 20, true) }}>
          <span style={{ fontFamily: fontFamilies.serif, fontSize: 32, color: colors.ink, opacity: 0.85, letterSpacing: '0.1em' }}>——司马承祯《坐忘歌》</span>
          {/* 笔锋下划线 stroke 生长 */}
          <div style={{ margin: '14px auto 0', width: 380, height: 2, background: colors.ink, opacity: 0.4, transform: `scaleX(${interpolate(frame, [20, 72], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })})` }} />
        </div>
        {/* 极小「忘」字闲章（4f 落定 72=拍325） */}
        <div style={{ position: 'absolute', right: 560, bottom: 150, ...sealStamp(frame, 72, 30, sealTilt('s47-wang')) }}>
          <div style={{ width: 74, height: 74, borderRadius: 6, background: colors.seal, opacity: 0.9, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: fontFamilies.serif, fontSize: 42, color: colors.paper }}>忘</span>
          </div>
        </div>
      </div>
      <DustField act={7} count={10} seedBase="s47" />
      <PaperGrain opacity={0.06} />
      <Grade id="GR-02" />
    </AbsoluteFill>
  );
};

export default S47;
