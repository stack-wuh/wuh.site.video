import type { FC } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { CV, FILM, FN, GRADES } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { Caption } from '../components/Caption';
import { XiangFigure } from '../components/Figure';
import { Gate } from '../components/Objects';

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const STEPS = Array.from({ length: 11 }, (_, i) => i);
const GRADE = GRADES['GR-05'];

/**
 * S32（5-2 越点，4320–4500，180f）——承接断点同一帧：门不再暗下去，继续开。
 * 入场 TR-06：f0 门缝 6px（同 S31 f239），90f 开到 60°；光从缝内扩出，11 级石阶 4f 错峰、2f 硬切。
 * 她（40a 白袍 / 单髻 / 空手）从 S31 末帧 footY 670、scale 0.8625 接着走，进光、被光吞掉；
 * 门开到 60°（local 90）后 CM-03 极缓前推 4%（全片唯一一次推过断点），caption 是诗第 5 行。
 */
const S32: FC = () => {
  const frame = useCurrentFrame();
  const open = CV.inOut(clamp01(frame / 90));
  const push = clamp01((frame - 90) / 90);
  const cam = { scale: 1 + 0.04 * CV.inOut(push), x: 0, y: 0, rot: 0, origin: '960px 430px' };
  const walked = CV.sineOut(clamp01(frame / 140));
  const footY = 670 - 92 * walked + FN.gaitWalk(frame, 40).bob;
  const spineX = 884 + 62 * walked;
  const scale = 0.8625 - 0.02 * walked;
  const lightStep = (i: number) => clamp01((frame - 6 - i * 4) / 2);
  const spill = CV.out(clamp01((frame - 4) / 45));
  const glow = CV.hardStep3(clamp01(frame / 50));
  const gone = 1 - CV.hardStep3(clamp01((frame - 118) / 46));
  const whiteout = 0.9 * CV.hardStep3(clamp01((frame - 132) / 47));
  const doorW = 6 + 168 * open;
  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <CameraRig cam={cam}>
        <AbsoluteFill style={{ filter: `saturate(${GRADE.saturate})` }}>
          <AbsoluteFill style={{ background: `linear-gradient(180deg, ${FILM.nightBlue} 0%, ${colors.bg} 56%)` }} />
          <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0 }} preserveAspectRatio="none">
            <path d="M0 430 L260 300 L420 380 L620 240 L860 400 L1080 290 L1320 410 L1600 330 L1920 430" fill="none" stroke={colors.muted} strokeWidth={1.2} opacity={0.5} />
            <path d="M0 500 L320 390 L520 470 L760 350 L980 470 L1220 380 L1480 480 L1740 410 L1920 470" fill="none" stroke={colors.muted} strokeWidth={0.8} opacity={0.28} />
            {STEPS.map((i) => (
              <rect key={`step-${i}`} x={576 + i * 6} y={1010 - i * 42} width={768 - i * 12} height={12} fill={colors.paperDeep} opacity={0.12 + i * 0.012} />
            ))}
            {STEPS.map((i) => (
              <rect key={`lit-${i}`} x={576 + i * 6} y={1010 - i * 42} width={768 - i * 12} height={12} fill={colors.paper} opacity={0.42 * lightStep(i)} />
            ))}
            <ellipse cx={960} cy={650} rx={420} ry={34} fill={colors.paper} opacity={0.05} />
            <ellipse cx={960} cy={720} rx={520} ry={26} fill={colors.paper} opacity={0.04} />
          </svg>
          <Gate gap={6} style={{ position: 'absolute', left: 800, top: 238, width: 320, height: 320, opacity: 0.9 }} />
          {/* 门内光：固定尺寸矩形，靠 scaleX 从 6px 缝扩到 60°，不做 width 动画 */}
          <div
            style={{
              position: 'absolute',
              left: 870,
              top: 288,
              width: 180,
              height: 270,
              background: colors.paper,
              opacity: 0.55 + 0.37 * CV.hardStep3(open),
              transform: `scaleX(${doorW / 180})`,
              transformOrigin: 'center',
            }}
          />
          <div style={{ position: 'absolute', inset: 0, clipPath: `inset(${(1 - spill) * 100}% 0 0 0)` }}>
            <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0 }} preserveAspectRatio="none">
              <path d="M900 545 L1020 545 L1660 1010 L260 1010 Z" fill={colors.paper} opacity={0.1 + 0.2 * glow} />
            </svg>
          </div>
          {/* 她：S31 f239 的脚底 670 / scale 0.8625 原样起步，走进门中轴 */}
          <div
            style={{
              position: 'absolute',
              left: spineX - 60,
              top: footY - 320,
              width: 120,
              height: 320,
              transform: `scale(${scale})`,
              transformOrigin: 'bottom center',
              opacity: gone,
            }}
          >
            <XiangFigure age="40a" pose="walk" style={{ width: '100%', height: '100%' }} />
          </div>
        </AbsoluteFill>
      </CameraRig>
      <AbsoluteFill style={{ background: GRADE.base.color, mixBlendMode: GRADE.base.blend, opacity: GRADE.base.opacity }} />
      {GRADE.veil ? <AbsoluteFill style={{ background: GRADE.veil.gradient, mixBlendMode: GRADE.veil.blend, opacity: GRADE.veil.opacity }} /> : null}
      <AbsoluteFill style={{ background: colors.paper, opacity: whiteout }} />
      <Caption text="其实我只是爱上了峨嵋山上的云和霞，" start={0} end={180} poem tone="ink" />
    </AbsoluteFill>
  );
};

export default S32;
