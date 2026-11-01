import type { FC } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { CV, FILM, GRADES } from '../motion-tokens';
import { DiscipleFigure, XiangFigure } from '../components/Figure';

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const GRADE = GRADES['GR-06'];
const ROWS = [0, 1, 2, 3];
const FOG = [
  { y: 706, w: 980, o: 0.16, from: -80 },
  { y: 774, w: 1320, o: 0.12, from: 70 },
  { y: 838, w: 760, o: 0.18, from: -46 },
];

/**
 * S39（5-5 前段，5220–5320，100f）——晨课：庭中弟子站成两列，素衣，全是背影；她在廊下看着。
 * 落发 + 缁衣 + 内领一线雪青（L1）；阶上薄雾，檐角一点晨光。
 * 固定全景；前 40f 雾流动，其后焦点从弟子行列移到廊下（用明度退场，不模糊人物）。
 */
const S39: FC = () => {
  const frame = useCurrentFrame();
  const drift = CV.out(clamp01(frame / 40));
  const focus = CV.hardStep3(clamp01((frame - 30) / 40));
  const rowDim = 0.9 - 0.32 * focus;
  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <AbsoluteFill style={{ filter: `saturate(${GRADE.saturate})` }}>
        <AbsoluteFill style={{ background: `linear-gradient(180deg, ${colors.muted} 0%, ${colors.bgLift} 42%, ${colors.bg} 100%)`, opacity: 0.82 }} />
        <AbsoluteFill style={{ background: `linear-gradient(180deg, ${colors.accent} 0%, transparent 30%)`, opacity: 0.14 }} />
        {/* 檐与廊 */}
        <div style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 130, background: colors.ink, opacity: 0.95 }} />
        <div style={{ position: 'absolute', left: 0, top: 130, width: 1920, height: 2, background: colors.accent, opacity: 0.55 }} />
        {/* 廊下的墙更亮，衬出她的墨影 */}
        <div style={{ position: 'absolute', left: 1430, top: 132, width: 490, height: 700, background: `linear-gradient(180deg, ${colors.muted} 0%, ${colors.bgLift} 100%)`, opacity: 0.32 + 0.08 * focus }} />
        {[1500, 1702, 1904].map((x) => (
          <div key={x} style={{ position: 'absolute', left: x, top: 132, width: 26, height: 770, background: colors.ink, opacity: 0.92 }} />
        ))}
        {/* 庭院石阶：级高递减 */}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} style={{ position: 'absolute', left: 0, top: 700 + i * 76, width: 1920, height: 76, background: colors.paperDeep, opacity: 0.035 + i * 0.006 }} />
        ))}
        {[700, 776, 852, 928, 1004].map((y, i) => (
          <div key={y} style={{ position: 'absolute', left: 0, top: y, width: 1920, height: 1.2, background: colors.paperMuted, opacity: 0.14 - i * 0.02 }} />
        ))}
        {/* 弟子两列：全是背影，越远越小，向右微收 */}
        {[760, 1120].map((x, col) =>
          ROWS.map((row) => {
            const h = 232 - row * 26;
            const feet = 960 - row * 54;
            const spread = col === 0 ? -1 : 1;
            return (
              <div
                key={`${x}-${row}`}
                style={{
                  position: 'absolute',
                  left: x - 40 - row * 10 * spread,
                  top: feet - h,
                  width: 80,
                  height: h,
                  opacity: rowDim - row * 0.05,
                }}
              >
                <DiscipleFigure style={{ width: '100%', height: '100%' }} />
              </div>
            );
          })
        )}
        {/* 廊下的她：落发 + 缁衣 + 内领一线雪青 */}
        <div style={{ position: 'absolute', left: 1612, top: 652, width: 96, height: 250 }}>
          <XiangFigure age="40b" pose="back" style={{ width: '100%', height: '100%' }} opacity={0.97} />
          <div style={{ position: 'absolute', left: '42%', top: '27%', width: '18%', height: 1.2, background: FILM.snowCyan, opacity: 0.68, transform: 'rotate(16deg)' }} />
          <div style={{ position: 'absolute', left: '42%', top: '27%', width: '18%', height: 1.2, background: FILM.snowCyan, opacity: 0.68, transform: 'rotate(-16deg)' }} />
          <div style={{ position: 'absolute', left: '72%', top: '10%', width: 1.2, height: '38%', background: FILM.snowCyan, opacity: 0.28 }} />
        </div>
        {/* 廊下的一点晨光 */}
        <AbsoluteFill style={{ background: `linear-gradient(250deg, ${colors.paper} 0%, transparent 30%)`, opacity: 0.08 + 0.08 * focus }} />
        {/* 阶上薄雾：前 40f 流动 */}
        {FOG.map((f) => (
          <div key={f.y} style={{ position: 'absolute', left: 200 + f.from * drift, top: f.y, width: f.w, height: 3, background: colors.paper, opacity: f.o, transform: 'skewX(-8deg)' }} />
        ))}
        {FOG.map((f) => (
          <div key={`${f.y}-b`} style={{ position: 'absolute', left: 900 + f.from * drift, top: f.y + 46, width: f.w * 0.6, height: 2, background: colors.paper, opacity: f.o * 0.6 }} />
        ))}
        <AbsoluteFill style={{ background: GRADE.base.color, mixBlendMode: GRADE.base.blend, opacity: GRADE.base.opacity }} />
      </AbsoluteFill>
      {GRADE.veil ? <AbsoluteFill style={{ background: GRADE.veil.gradient, mixBlendMode: GRADE.veil.blend, opacity: GRADE.veil.opacity }} /> : null}
    </AbsoluteFill>
  );
};

export default S39;
