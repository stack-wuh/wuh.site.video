import type { FC } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { CV, FILM, FN, RH } from '../motion-tokens';
import { XiangFigure } from './Figure';
import { Gate } from './Objects';

/**
 * 4-4（S30）与 5-1（S31）共用的标准上山背影（character-design §2.3 / FG-04）。
 * 同一组件、同一 local 帧：S30 从 3840 起、S31 从 4080 起，两镜各自的 local 0–239 逐帧一致；
 * 判词字幕在 S30 外部叠加，S31 不落字幕——底层画面像素差分 0。
 * 空手、无伞、无剑、无包袱；40f/步五步，200–239 立定；门缝 1→6px，缝光 ≤6px 不扩散。
 */
export const AscendScene: FC = () => {
  const frame = useCurrentFrame();
  const walked = CV.sineOut(Math.min(1, frame / 200));
  const footY = 929 - 259 * walked;
  const scale = 0.9375 - 0.075 * walked;
  const gap = FN.doorGap(frame, frame);
  /* PT-07 云移 / FN-09 衣摆 / FN-10 布巾滞后：两镜同一 local 帧，差分仍为 0 */
  const cloudX = FN.cloudSlow(frame, 240) * 1920;
  const hem = FN.clothSway(frame, 2);
  const tail = FN.ribbonLag(frame, 6, 1);
  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      {/* 远山与雾：linear-gradient，不用全屏 radial */}
      <AbsoluteFill style={{ background: `linear-gradient(180deg, ${FILM.nightBlue} 0%, ${colors.bg} 56%)` }} />
      <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0 }} preserveAspectRatio="none">
        <path d="M0 430 L260 300 L420 380 L620 240 L860 400 L1080 290 L1320 410 L1600 330 L1920 430" fill="none" stroke={colors.muted} strokeWidth={1.2} opacity={0.5} />
        <path d="M0 500 L320 390 L520 470 L760 350 L980 470 L1220 380 L1480 480 L1740 410 L1920 470" fill="none" stroke={colors.muted} strokeWidth={0.8} opacity={0.28} />
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
          <rect key={i} x={576 + i * 6} y={1010 - i * 42} width={768 - i * 12} height={12} fill={colors.paperDeep} opacity={0.12 + i * 0.012} />
        ))}
        <g transform={`translate(${-cloudX * 0.5}, 0)`}>
          <ellipse cx={960} cy={650} rx={420} ry={34} fill={colors.paper} opacity={0.05} />
          <ellipse cx={960} cy={720} rx={520} ry={26} fill={colors.paper} opacity={0.04} />
        </g>
      </svg>
      {/* 山门：灭点 960,238；门缝 1→6px，光只落阶不扩散 */}
      <Gate gap={gap} style={{ position: 'absolute', left: 800, top: 238, width: 320, height: 320, opacity: 0.9 }} />
      <div
        style={{
          position: 'absolute',
          left: 960 - Math.max(1, gap) / 2,
          top: 288,
          width: Math.max(1, gap),
          height: 270,
          background: colors.paper,
          opacity: 0.55,
        }}
      />
      {/* 标准背影：脚底 929→670，300→276px；40f/步，200–239 立定 */}
      <div
        style={{
          position: 'absolute',
          left: 884 - 60,
          top: footY - 320,
          width: 120,
          height: 320,
          transform: `scale(${scale})`,
          transformOrigin: 'bottom center',
        }}
      >
        <XiangFigure age="40a" pose="walk" flow={{ hem, tail }} style={{ width: '100%', height: '100%' }} />
      </div>
    </AbsoluteFill>
  );
};

export const ASCEND_END = 239;
export const ASCEND_STEP = RH.step;
