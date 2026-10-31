/* 镜 25 · Act 4 产品巡礼 · 全局帧 [3890,4010) · 120f */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, GRADES, inkRise } from '../motion-tokens';
import { DustField } from '../components/DustField';

const serif = fontFamilies.serif;

const fade = (f: number, at: number) =>
  interpolate(f, [at, at + 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

/* 信笺留言板：1px 纵线 path-draw 生长 + 节点 cascade ink-rise（当日 accent），
   cam-crane 沿纵线下行；出场 tr-page-turn（translateX −40 + rotateY 12° + 右缘阴影扫过）
   （原 Act4 镜 25，幕局部 1090–1210 → 镜局部 0–120；const f = frame - 1090 换算为 const f = frame） */
const ShotLetter: FC = () => {
  const frame = useCurrentFrame();
  const grade = GRADES[3];
  const f = frame; // 0–120
  const lineDraw = interpolate(f, [0, 34], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const crane = interpolate(f, [0, 100], [-14, 30], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const turn = interpolate(f, [90, 120], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const msgs: Array<[string, string]> = [
    ['今天', '见字如面。'],
    ['昨天', '朝朝如念。'],
    ['前天', '路过，留个脚印。'],
    ['3 天前', '再来一卷歌单。'],
  ];
  return (
    <AbsoluteFill>
      <DustField act={4} />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', perspective: 1200, transform: `translateY(${crane - turn * 40}px) rotateY(${turn * 12}deg)`, transformOrigin: 'left center' }}>
        <div style={{ position: 'relative', width: 720, height: 380 }}>
          <div style={{ position: 'absolute', left: 150, top: 0, width: 1, height: 380, background: colors.accent, opacity: 0.5, transform: `scaleY(${lineDraw})`, transformOrigin: 'top' }} />
          {msgs.map(([day, text], i) => (
            <div key={day} style={{ position: 'absolute', top: 16 + i * 92, left: 0, width: '100%', ...inkRise(f, 10 + i * 20) }}>
              <div style={{ position: 'absolute', left: 146, top: 8, width: 9, height: 9, borderRadius: 5, background: i === 0 ? colors.accent : colors.muted }} />
              <p style={{ margin: '0 0 0 180px', fontFamily: serif, fontStyle: 'italic', fontSize: 20, color: colors.accent }}>{day}</p>
              <p style={{ margin: '6px 0 0 180px', fontFamily: serif, fontSize: 26, color: colors.paper }}>{text}</p>
            </div>
          ))}
        </div>
        <p style={{ position: 'absolute', bottom: 96, width: '100%', textAlign: 'center', fontFamily: serif, fontSize: 34, color: colors.paper, opacity: fade(f, 40) * (1 - turn) }}>驿寄梅花，鱼传尺素</p>
        {/* 纸页右缘阴影扫过 */}
        <div style={{ position: 'absolute', top: 0, bottom: 0, right: 0, width: 320, background: `linear-gradient(90deg, transparent, ${colors.bg})`, opacity: turn * 0.9, transform: `translateX(${(1 - turn) * 160}px)` }} />
      </AbsoluteFill>
      {/* 幕级调色 overlay（原 Act4 全屏层分解入镜）：grade-warm-gold LUT + 雾光 */}
      <AbsoluteFill style={{ background: grade.lut.color, mixBlendMode: grade.lut.blend, opacity: grade.lut.opacity }} />
      <AbsoluteFill style={{ background: grade.veil.color, mixBlendMode: grade.veil.blend, opacity: grade.veil.opacity }} />
    </AbsoluteFill>
  );
};

export default ShotLetter;
