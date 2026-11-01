/* 镜 49 · Act 6 像极了 · 局部帧 [0,180) · 180f
   女弟子抬头看天：抬头 8°（30f 到位，FN-11），L2——只给下颌 + 颈线，无眼、无嘴；
   风把她的发与袖吹向同一侧；40f rack focus 由她移到天（只模糊景别层）；末 40f 画面里只剩天。
   剪影 ink + 1px gold 侧光，光从她抬起的方向来（FILM.fireGold）；GR-08。
   字幕「风陵师太，峨眉第二代掌门。」0–160。尾帧：晚霞满天（TR-08 0f → S50）。 */
import type { FC } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { CM, CV, FILM, FN, GRADES, STROKE } from '../motion-tokens';
import { Caption } from '../components/Caption';
import { DuskSky } from './s50';

const GRADE = GRADES['GR-08'];
const TEXT = '风陵师太，峨眉第二代掌门。';
/** 云相位取镜尾对齐 S50 首帧：TR-08 硬切前后是同一片天（同一蓝块、同一云形）。 */
const SKY_PHASE = 179;

const S49: FC = () => {
  const frame = useCurrentFrame();
  const cam = CM.drift(frame, 2);
  const lift = FN.headLift(frame, 8, 30);
  const p = lift / 8;
  const sway = FN.clothSway(frame, 10, 0);
  const skyBlur = CM.focusPull(Math.max(0, frame - 60), 40);
  // 模糊越大越放大，防景深在画框边缘露底；焦点落到天上时回到 1.0，与 S50 首帧同尺寸
  const skyScale = 1 + 0.03 * (skyBlur / 8);
  const vanish = 1 - CV.hardStep3(Math.max(0, Math.min(1, (frame - 108) / 32)));
  const veil = GRADE.veil;
  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      {/* 天际：焦点先在她、再移到天；相位与 S50 首帧同源（放大随模糊收敛，防露底） */}
      <AbsoluteFill style={{ filter: `blur(${skyBlur}px)`, transform: `scale(${skyScale})` }}>
        <DuskSky f={frame - SKY_PHASE} />
      </AbsoluteFill>
      {/* 她的肩背与下颌：L2，无眼无嘴 */}
      <AbsoluteFill style={{ opacity: vanish, transform: `translate(${cam.x}px, ${cam.y}px)` }}>
        <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0 }} preserveAspectRatio="none">
          {/* 肩背整体压向画左：给中下部的字幕留出亮天 */}
          <g transform="translate(-210 0)">
            <path d="M-60 1080 L-60 812 Q 150 736 360 748 Q 560 754 700 818 Q 820 872 880 1080 Z" fill={colors.ink} />
            <path d="M700 818 Q 820 872 880 1080" fill="none" stroke={FILM.fireGold} strokeWidth={STROKE.S1} opacity={0.35} transform={`translate(${sway * 0.4} 0)`} />
            <path d="M520 560 L640 560 L656 800 L500 800 Z" fill={colors.ink} />
            <path d="M300 806 Q 500 748 672 812" fill="none" stroke={FILM.snowCyan} strokeWidth={STROKE.S1} opacity={0.3} />
            <g transform={`translate(0 ${-6 * p}) rotate(${lift} 646 712)`}>
              <circle cx={560} cy={470} r={150} fill={colors.ink} />
              <circle cx={470} cy={366} r={44} fill={colors.ink} />
              <circle cx={648} cy={362} r={44} fill={colors.ink} />
              <g transform={`translate(${sway} 0)`}>
                <path d="M620 360 Q 760 330 884 348" fill="none" stroke={colors.ink} strokeWidth={STROKE.S2} />
                <path d="M600 400 Q 770 380 902 414" fill="none" stroke={colors.ink} strokeWidth={STROKE.S1} />
              </g>
              {/* 下颌 + 颈线：唯一的 1px gold 侧光 */}
              <path d="M701.8 500.1 A145 145 0 0 1 604.8 607.9 L648 706" fill="none" stroke={FILM.fireGold} strokeWidth={STROKE.S1} opacity={0.85} />
            </g>
          </g>
        </svg>
      </AbsoluteFill>
      <Caption text={TEXT} start={0} end={160} tone="ink" />
      <AbsoluteFill style={{ background: GRADE.base.color, mixBlendMode: GRADE.base.blend, opacity: GRADE.base.opacity, pointerEvents: 'none' }} />
      {veil ? <AbsoluteFill style={{ background: veil.gradient, mixBlendMode: veil.blend, opacity: veil.opacity, pointerEvents: 'none' }} /> : null}
    </AbsoluteFill>
  );
};

export default S49;
