/* S39 · Act 6 入院 · 局部帧 [0,60) · 60f · 绝对 5434–5494
 *
 * 漫游起手：光标移 08→点击→最大化（0–14）→页面漫游开始——首页卡迎面而来
 * （CM-03 dolly-in traveling，S01 卡面真实截图），页中字一行行自己写出来
 * （FN-50 cardReveal，reveal 0→35%）。转场：入「切」，出「切」（漫游连击）。
 * 字幕安全窗：start≥12。
 * 尾帧：首页卡让位、/music 卡入场在即。
 */
import type { FC } from 'react';
import { AbsoluteFill, Img, interpolate, useCurrentFrame } from 'remotion';
import { staticFile } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES } from '../../../brand/motion';
import { cardReveal } from '../motion-tokens';
import { Caption } from '../components/Caption';
import { DustField } from '../components/DustField';
import { Grade } from '../components/Grade';
import { PaperGrain } from '../components/PaperGrain';

const TOTAL = 60;

const S39: FC = () => {
  const frame = useCurrentFrame();
  // dolly-in：首页卡迎面推近（scale 0.5→1.15）
  const dolly = interpolate(frame, [8, TOTAL], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const scale = interpolate(dolly, [0, 1], [0.5, 1.18]);
  const cam = { scale: 1.02, x: 0, y: 0, rot: 0 };
  const rows = [0, 1, 2];

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <CameraRigStatic cam={cam} />
      <DustField act={6} count={8} seedBase="s39" />
      {/* 首页卡（S01 卡面）迎面推近 */}
      <div
        style={{
          position: 'absolute',
          left: 560,
          top: 170,
          width: 800,
          height: 520,
          borderRadius: 10,
          overflow: 'hidden',
          border: `1px solid ${colors.hairline}`,
          boxShadow: '0 30px 90px rgba(0,0,0,0.5)',
          transform: `scale(${scale})`,
          opacity: interpolate(dolly, [0, 0.2], [0.3, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        }}
      >
        <Img src={staticFile('wuh-site-intro-v3/site/s01-home-hero-v1.png')} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 25%' }} />
        <AbsoluteFill style={{ background: colors.bg, opacity: 0.16 }} />
        {/* FN-50 页中字 reveal（0→35% mask 扫过） */}
        {rows.map((r) => {
          const { mask, ink } = cardReveal(frame, 20 + r * 10, r);
          return (
            <div key={r} style={{ position: 'absolute', left: 60, top: 340 + r * 50, width: 640, height: 30, overflow: 'hidden' }}>
              <div style={{ width: `${mask}%`, height: 14, background: colors.paper, opacity: ink * 0.55 }} />
            </div>
          );
        })}
        <span style={{ position: 'absolute', left: 60, bottom: 30, fontFamily: fontFamilies.mono, fontSize: 15, color: colors.paper, opacity: 0.7, letterSpacing: '0.2em' }}>首页 · HOME</span>
      </div>
      <PaperGrain opacity={0.05} />
      <Grade id="GR-01" />
      <Caption text="每一页，都在呼吸。" appearAt={14} />
    </AbsoluteFill>
  );
};

function CameraRigStatic({ cam }: { cam: { scale: number; x: number; y: number; rot: number } }) {
  void cam;
  return null;
}

export default S39;
