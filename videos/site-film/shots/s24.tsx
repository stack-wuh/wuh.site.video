/* 镜 24 · Act 4 产品巡礼 · 全局帧 [3780,3890) · 110f */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { ANCHORS, GRADES, eqBars } from '../motion-tokens';
import { DustField } from '../components/DustField';

const serif = fontFamilies.serif;

/* EQ 冻结卡点：3780 整拍冻结（scaleY 0.35 保持）→ 3790 半拍再起（eq-bounce）→
   3884 预冻再收敛（镜局部 104），tr-freeze-cut 出场；cam-hold 同框分位 + 歌名 marquee-drift + 书耳迷你播放器
   （原 Act4 镜 24，幕局部 980–1090 → 镜局部 0–110；const f = frame - 980 换算为 const f = frame） */
const ShotEQ: FC = () => {
  const frame = useCurrentFrame();
  const grade = GRADES[3];
  const f = frame; // 0–110
  const hold = ANCHORS.eqReprise - ANCHORS.eqFreeze; // 10f 整拍冻结保持（时长，平移不变）
  const refreeze = f >= 104; // 镜局部 104 = 全片 3884 预冻
  const barVal = (i: number): number => {
    if (f < hold) return 0.35;
    if (f < 104) return eqBars(f - hold)[i];
    return interpolate(f - 104, [0, 6], [eqBars(104 - hold)[i], 0.35], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  };
  const marquee = -((f * 2) % 320);
  return (
    <AbsoluteFill>
      <DustField act={4} />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', filter: f < hold || refreeze ? 'saturate(0.92)' : undefined }}>
        <div style={{ textAlign: 'center', marginTop: -60 }}>
          <div style={{ display: 'flex', gap: 24, alignItems: 'flex-end', height: 150, justifyContent: 'center' }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ width: 26, height: 150, background: colors.accent, borderRadius: 6, transformOrigin: 'bottom', transform: `scaleY(${Math.max(0.06, barVal(i))})`, opacity: 0.9 }} />
            ))}
          </div>
          <p style={{ fontFamily: serif, fontSize: 40, color: colors.paper, marginTop: 34, fontStyle: 'italic' }}>本卷最热 ·《按语》</p>
        </div>
        {/* 左下 440px 迷你播放器：书耳 + 歌名跑马灯 */}
        <div style={{ position: 'absolute', left: 140, bottom: 150, width: 440, height: 76, borderRadius: 12, background: colors.bgLift, border: `1px solid ${colors.hairline}`, overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: 0, top: 0, width: 18, height: 30, background: colors.accent, clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 70%, 0 100%)' }} />
          <div style={{ position: 'absolute', left: 18, top: 0, bottom: 0, right: 26, overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
            <span style={{ fontFamily: serif, fontSize: 20, color: colors.paper, whiteSpace: 'nowrap', transform: `translateX(${marquee}px)` }}>按语 · THE ANNOTATION ·　按语 · THE ANNOTATION ·　</span>
          </div>
        </div>
      </AbsoluteFill>
      {/* 幕级调色 overlay（原 Act4 全屏层分解入镜）：grade-warm-gold LUT + 雾光 */}
      <AbsoluteFill style={{ background: grade.lut.color, mixBlendMode: grade.lut.blend, opacity: grade.lut.opacity }} />
      <AbsoluteFill style={{ background: grade.veil.color, mixBlendMode: grade.veil.blend, opacity: grade.veil.opacity }} />
    </AbsoluteFill>
  );
};

export default ShotEQ;
