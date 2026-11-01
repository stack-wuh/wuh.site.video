import type { FC } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { CV, FILM, FN } from '../motion-tokens';
import { Caption } from '../components/Caption';
import { DiscipleFigure, XiangFigure } from '../components/Figure';
import { Scripture } from '../components/Objects';

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const FLAGS = [0, 1, 2, 3, 4];

/**
 * S40（5-5 中段，5320–5480，160f）——她手里的书卷合上，抬起头，开口（不出声）；前排弟子点头；
 * 廊下经幡被风吹动。中景固定：合卷 20f（FN-23 fold）、抬头 15f（FN-11）；末 30f 弟子点头，焦点留在合起的书卷上。
 * 落发 + 缁衣 + 内领一线雪青（L1）；字幕是白话第 13 条，不是诗行。
 */
const S40: FC = () => {
  const frame = useCurrentFrame();
  const fold = CV.out(clamp01(frame / 20));
  const headUp = 10 * (1 - CV.out(clamp01((frame - 20) / 15)));
  const hold = CV.hardStep3(clamp01((frame - 110) / 40));
  const prayer = (i: number) => FN.clothSway(frame, 4, i * 0.9);
  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <AbsoluteFill style={{ background: `linear-gradient(180deg, ${colors.bgLift} 0%, ${colors.bg} 52%, ${colors.bgLift} 100%)` }} />
      <AbsoluteFill style={{ background: `linear-gradient(180deg, ${colors.muted} 0%, transparent 36%)`, opacity: 0.14 }} />
      {/* 檐下经幡：风吹动 */}
      <div style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 132, background: colors.ink, opacity: 0.92 }} />
      <div style={{ position: 'absolute', left: 0, top: 132, width: 1920, height: 2, background: colors.accent, opacity: 0.4 }} />
      {FLAGS.map((i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: 236 + i * 62,
            top: 140,
            width: 22,
            height: 92 + (i % 2) * 14,
            background: colors.paperMuted,
            opacity: 0.5,
            transform: `rotate(${prayer(i) * 0.8}deg)`,
            transformOrigin: 'top center',
          }}
        />
      ))}
      {/* 庭院与阶 */}
      {[0, 1, 2, 3].map((i) => (
        <div key={i} style={{ position: 'absolute', left: 0, top: 690 + i * 82, width: 1920, height: 82, background: colors.paperDeep, opacity: 0.014 + i * 0.004 }} />
      ))}
      {[690, 772, 854, 936].map((y, i) => (
        <div key={y} style={{ position: 'absolute', left: 0, top: y, width: 1920, height: 1.2, background: colors.paperMuted, opacity: 0.1 - i * 0.015 }} />
      ))}
      {/* 前排弟子：点头落在末 30f，前排错峰 4f */}
      {[560, 760, 980, 1200].map((x, i) => {
        const t = clamp01((frame - 118 - i * 4) / 24);
        const nod = Math.sin(t * Math.PI);
        return (
          <div
            key={x}
            style={{
              position: 'absolute',
              left: x,
              top: 704 - i * 4,
              width: 84,
              height: 232,
              opacity: 0.72 - hold * 0.14,
              transform: `translateY(${nod * 5}px) rotate(${nod * 2.4}deg)`,
              transformOrigin: 'bottom center',
            }}
          >
            <DiscipleFigure style={{ width: '100%', height: '100%' }} />
          </div>
        );
      })}
      {/* 她：廊下，背身；合卷后直身抬头（整体 0.6° 回正 + 抬起 2px），书卷在身前合上 */}
      <div
        style={{
          position: 'absolute',
          left: 1040,
          top: 306,
          width: 260,
          height: 640,
          transform: `translateY(${-headUp * 0.22}px) rotate(${-headUp * 0.06}deg)`,
          transformOrigin: 'bottom center',
        }}
      >
        <XiangFigure age="40b" pose="pray" style={{ width: '100%', height: '100%' }} />
        <div style={{ position: 'absolute', left: '40.8%', top: '18.4%', width: '18.5%', height: '8.4%', background: colors.ink }} />
        <div style={{ position: 'absolute', left: '41%', top: '27%', width: '18%', height: 1.4, background: FILM.snowCyan, opacity: 0.6, transform: 'rotate(16deg)' }} />
        <div style={{ position: 'absolute', left: '41%', top: '27%', width: '18%', height: 1.4, background: FILM.snowCyan, opacity: 0.6, transform: 'rotate(-16deg)' }} />
      </div>
      {/* 书卷：20f 合起，焦点留在它上面 */}
      <div style={{ position: 'absolute', left: 680, top: 620, width: 300, height: 139, transformOrigin: 'left center', transform: `scaleX(${1 - 0.62 * fold})` }}>
        <Scripture style={{ width: '100%', height: '100%' }} opacity={0.92} />
      </div>
      <div style={{ position: 'absolute', left: 680, top: 620, width: 70, height: 139, background: colors.paperMuted, opacity: 0.85 * fold, border: `1.2px solid ${colors.ink}`, boxSizing: 'border-box' }}>
        {[28, 56, 84, 112].map((y) => (
          <div key={y} style={{ position: 'absolute', left: 6, right: 6, top: y, height: 1, background: colors.ink, opacity: 0.35 }} />
        ))}
      </div>
      {/* 托卷的手：paper 填充 + ink 1.2 轮廓，袖口在下方 */}
      <svg width={56} height={48} viewBox="0 0 56 48" style={{ position: 'absolute', left: 736, top: 644, opacity: 0.4 + 0.6 * fold }}>
        <path d="M12 16 Q12 6 21 5 L40 5 Q49 9 48 18 Q47 32 36 36 L18 36 Q12 27 12 16 Z" fill={colors.paper} stroke={colors.ink} strokeWidth={1.2} />
        <path d="M18 15 Q28 19 39 15 M18 24 Q28 28 39 24" fill="none" stroke={colors.ink} strokeWidth={1} opacity={0.5} />
        <path d="M14 36 L16 46 M22 36 L23 46" stroke={colors.ink} strokeWidth={1.1} opacity={0.55} />
      </svg>
      <div style={{ position: 'absolute', left: 738, top: 686, width: 46, height: 30, background: colors.paperMuted, opacity: 0.8 }} />
      <AbsoluteFill style={{ background: `linear-gradient(240deg, ${colors.accent} 0%, transparent 40%)`, opacity: 0.05 + 0.06 * hold }} />
      <Caption text="后来，我开始教人。" start={0} end={160} />
    </AbsoluteFill>
  );
};

export default S40;
