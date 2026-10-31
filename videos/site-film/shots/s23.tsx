/* 镜 23 · Act 4 产品巡礼 · 全局帧 [3630,3780) · 150f */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { GRADES, WHITE_FLASH } from '../motion-tokens';
import { DustField } from '../components/DustField';

const serif = fontFamilies.serif;

const fade = (f: number, at: number) =>
  interpolate(f, [at, at + 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

/* 黑胶碟心：vinyl-spin 5s/圈（2.4°/f）+ conic 高光扫唱纹（sweep-light 变体），
   镜局部 140（原幕局部 970 = 全片 3770）预冻（eq-freeze：停转 + saturate 0.92），随后 tr-freeze-cut 直切镜 24
   （原 Act4 镜 23，幕局部 830–980 → 镜局部 0–150；const f = frame - 830 换算为 const f = frame） */
const ShotVinyl: FC = () => {
  const frame = useCurrentFrame();
  const grade = GRADES[3];
  const f = frame; // 0–150
  const spinF = Math.min(f, 140); // 镜局部 140 = 全片 3770 预冻
  const frozen = f >= 140;
  return (
    <AbsoluteFill>
      <DustField act={4} />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', opacity: fade(f, 0), filter: frozen ? 'saturate(0.92)' : undefined }}>
        <div style={{ position: 'relative', width: 430, height: 430 }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: 215, background: `repeating-radial-gradient(circle, ${colors.bg} 0px, ${colors.bg} 3px, ${colors.bgLift} 4px, ${colors.bgLift} 6px)`, border: `1px solid ${colors.hairline}`, transform: `rotate(${spinF * 2.4}deg)` }} />
          {/* conic 高光同速叠转 */}
          <div style={{ position: 'absolute', inset: 0, borderRadius: 215, background: `conic-gradient(from ${spinF * 2.4}deg, transparent 0deg, ${WHITE_FLASH.color} 24deg, transparent 60deg)`, opacity: 0.12, mixBlendMode: 'screen' }} />
          <div style={{ position: 'absolute', left: 155, top: 155, width: 120, height: 120, borderRadius: 60, background: colors.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: serif, fontSize: 26, color: colors.bg }}>2026</span>
          </div>
          <div style={{ position: 'absolute', left: 209, top: 209, width: 12, height: 12, borderRadius: 6, background: colors.bg }} />
        </div>
        <p style={{ position: 'absolute', bottom: 110, width: '100%', textAlign: 'center', fontFamily: serif, fontSize: 32, color: colors.paper, opacity: fade(f, 20) }}>黑胶还在转，时光没走远</p>
      </AbsoluteFill>
      {/* 幕级调色 overlay（原 Act4 全屏层分解入镜）：grade-warm-gold LUT + 雾光 */}
      <AbsoluteFill style={{ background: grade.lut.color, mixBlendMode: grade.lut.blend, opacity: grade.lut.opacity }} />
      <AbsoluteFill style={{ background: grade.veil.color, mixBlendMode: grade.veil.blend, opacity: grade.veil.opacity }} />
    </AbsoluteFill>
  );
};

export default ShotVinyl;
