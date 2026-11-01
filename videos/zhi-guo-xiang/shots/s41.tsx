import type { FC } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { CV, FILM, FN } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { DiscipleFigure, XiangFigure } from '../components/Figure';
import { DustField } from '../components/DustField';

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const WALKERS = [
  { x: 880, y: 936, h: 224, dir: -1, delay: 0, speed: 7.6 },
  { x: 980, y: 920, h: 210, dir: 1, delay: 6, speed: 8.8 },
  { x: 1080, y: 944, h: 230, dir: 1, delay: 2, speed: 9.4 },
  { x: 760, y: 912, h: 202, dir: -1, delay: 14, speed: 7.2 },
  { x: 1180, y: 928, h: 214, dir: -1, delay: 8, speed: 9.6 },
  { x: 660, y: 940, h: 220, dir: 1, delay: 18, speed: 10.2 },
  { x: 1280, y: 908, h: 196, dir: 1, delay: 20, speed: 8.6 },
];

/**
 * S41（5-5 后段，5480–5640，160f）——弟子散去，走过庭中石阶；她在廊下目送（落发、缁衣，L1），只有背影；
 * 晨光把她的影子拉长到阶上。固定全景，弟子从画面前流过；末 40f CM-04 极缓后拉 2%，庭院变大。
 * 尾帧：庭院空下来、影子还长——交给 S42 的 TR-02 8f 溶解。
 */
const S41: FC = () => {
  const frame = useCurrentFrame();
  const pull = CV.sineOut(clamp01((frame - 120) / 40));
  const cam = { scale: 1 - 0.02 * pull, x: 0, y: 0, rot: 0 };
  const shadow = CV.out(clamp01(frame / 120));
  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <CameraRig cam={cam}>
        <AbsoluteFill>
          <AbsoluteFill style={{ background: `linear-gradient(180deg, ${colors.muted} 0%, ${colors.bgLift} 42%, ${colors.bg} 100%)`, opacity: 0.82 }} />
          <AbsoluteFill style={{ background: `linear-gradient(180deg, ${colors.accent} 0%, transparent 30%)`, opacity: 0.14 }} />
          <AbsoluteFill style={{ background: `linear-gradient(90deg, ${colors.paper} 0%, transparent 42%)`, opacity: 0.07 }} />
          {/* 檐与廊 */}
          <div style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 130, background: colors.ink, opacity: 0.95 }} />
          <div style={{ position: 'absolute', left: 0, top: 130, width: 1920, height: 2, background: colors.accent, opacity: 0.55 }} />
          <div style={{ position: 'absolute', left: 1430, top: 132, width: 490, height: 700, background: `linear-gradient(180deg, ${colors.muted} 0%, ${colors.bgLift} 100%)`, opacity: 0.3 }} />
          {[1500, 1702, 1904].map((x) => (
            <div key={x} style={{ position: 'absolute', left: x, top: 132, width: 26, height: 770, background: colors.ink, opacity: 0.92 }} />
          ))}
          {/* 庭中石阶 */}
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} style={{ position: 'absolute', left: 0, top: 700 + i * 76, width: 1920, height: 76, background: colors.paperDeep, opacity: 0.035 + i * 0.006 }} />
          ))}
          {[700, 776, 852, 928, 1004].map((y, i) => (
            <div key={y} style={{ position: 'absolute', left: 0, top: y, width: 1920, height: 1.2, background: colors.paperMuted, opacity: 0.14 - i * 0.02 }} />
          ))}
          {/* 她的影子：从廊下被晨光拉到阶上，越拉越长 */}
          <div style={{ position: 'absolute', inset: 0, transform: `scaleX(${0.55 + 0.45 * shadow})`, transformOrigin: '1614px 906px' }}>
            <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0 }} preserveAspectRatio="none">
              <path d="M1600 906 L1650 906 L1180 1080 L720 1080 Z" fill={colors.ink} opacity={0.3} />
            </svg>
          </div>
          {/* 弟子散去：从庭中流过画幅 */}
          {WALKERS.map((w, i) => {
            const travel = Math.max(0, frame - w.delay) * w.speed * w.dir;
            const x = w.x + travel;
            const bob = FN.gaitWalk(frame + i * 9, 34).bob;
            const fade = clamp01((x + 120) / 220) * clamp01((2040 - x) / 220);
            return (
              <div key={`${w.x}-${w.dir}`} style={{ position: 'absolute', left: x, top: w.y - w.h + bob, width: 78, height: w.h, opacity: 0.7 * fade }}>
                <DiscipleFigure style={{ width: '100%', height: '100%' }} />
              </div>
            );
          })}
          {/* 廊下目送的背影 */}
          <div style={{ position: 'absolute', left: 1612, top: 646, width: 96, height: 260 }}>
            <XiangFigure age="40b" pose="back" style={{ width: '100%', height: '100%' }} opacity={0.97} />
            <div style={{ position: 'absolute', left: '43%', top: '18%', width: '14%', height: '7%', background: colors.ink }} />
            <div style={{ position: 'absolute', left: '42%', top: '27%', width: '18%', height: 1.2, background: FILM.snowCyan, opacity: 0.65, transform: 'rotate(16deg)' }} />
            <div style={{ position: 'absolute', left: '42%', top: '27%', width: '18%', height: 1.2, background: FILM.snowCyan, opacity: 0.65, transform: 'rotate(-16deg)' }} />
            <div style={{ position: 'absolute', left: '72%', top: '10%', width: 1.2, height: '38%', background: FILM.snowCyan, opacity: 0.28 }} />
          </div>
          <AbsoluteFill style={{ background: `linear-gradient(250deg, ${colors.paper} 0%, transparent 30%)`, opacity: 0.06 }} />
          <DustField act={5} count={18} seedBase="s41" />
        </AbsoluteFill>
      </CameraRig>
    </AbsoluteFill>
  );
};

export default S41;
