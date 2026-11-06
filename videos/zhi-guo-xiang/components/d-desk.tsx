/* D 组 · v11 S33/S34 案头四件（design-v11 §3.11，用户意见 16「那支毛笔是什么鬼」）。
 *
 * 这两镜整张重做：「笔」从画面里彻底消失，只剩「笔已搁下」的纸面。会动的东西全部在这儿：
 *   · PaperFlap   纸角被穿堂风掀起（把同一张纸图裁一个角、轻轻抬起来；纸下面那层深色木案
 *                 用两笔深色 blur 垫出来，抬多少露多少）—— 两次，各 34f；
 *   · WetInkSheen 湿墨在灯下的高光：一小片暖白反光，210f 里慢慢缩、慢慢淡（墨在变干）；
 *   · InkDrop     墨珠「先凝后落」：8px→14px 凝 30f，脱手落 6f（free-fall 二次曲线），
 *                 落点就是第五行行末那个字的心；落完交给 InkBloom；
 *   · RaggedBloom InkBloom 只给圆润的墨团，渗纸的毛刺由这一层补（SVG 抖动多边形 +
 *                 feTurbulence 位移，seed 定值，无 Math.random），压在 InkBloom 上一起洇。
 * 颜色/时长只取 brand/tokens + motion-tokens。
 */
import type { FC } from 'react';
import { interpolate } from 'remotion';
import { colors } from '../../../brand/tokens';
import { FILM, CLAMP } from '../motion-tokens';


/** S33/S34 共用的纸面排版（两镜必须同机位同口径，改一处两镜一起变）：
 *  诗第五行 = POEM_COLS[6] + [7]，写满 15 字停在「霞」前（15/17）。 */
export const DESK_TEXT = { size: 68, right: '20%', top: '14%', progress: 15 / 17 } as const;
/** 第五行末字「和」的字心（1920×1080，未套推镜）：InkPaper 竖排实测，
 *  第 2 列右边 = 1920 − (20%×1920 + 68×1.5) = 1434，字心 x ≈ 1434 − 1.08×68/2；
 *  字心 y ≈ 14%×1080 + 6.5×(68×1.06)。墨珠落点、墨洇中心都用这一个点。 */
export const DESK_LAST_CHAR = { x: 1397, y: 620 } as const;

/** 纸的左上角（底图 p-paper-lamp 实测：左边沿 x = 505 − 0.308·(y−220)，
 *  上边沿 y = 93 + 0.0727·(x−560)；两线交点 (544,92) 是纸角）。 */
const CORNER = { x: 544, y: 92 };

export const PaperFlap: FC<{
  frame: number;
  /** 掀起的帧段，每段 [起, 止]；段内 14f 起、14f 落 */
  lifts: ReadonlyArray<readonly [number, number]>;
}> = ({ frame, lifts }) => {
  const lift = lifts.reduce((acc, [start, end]) => {
    if (frame < start || frame > end) return acc;
    return Math.max(acc, interpolate(frame, [start, start + 14, end - 14, end], [0, 1, 1, 0], CLAMP));
  }, 0);
  if (lift <= 0.002) return null;
  /* 风过纸角：不裁三角、不贴色块（那会读成一张贴纸），只做两件纸该有的反应——
   *  ① 纸角被吹得抬起来一点：角上多吃一线灯光的反光（screen）；
   *  ② 抬起来的那一角把影子投到案面上：纸沿外侧一线柔影（multiply，跟着风走）。
   * 都是软光，宁少不多；判据是「风过去了」，不是「看见一个三角形」。 */
  const drift = lift * 14;
  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: CORNER.x - 250 - drift,
          top: CORNER.y - 170 - drift * 0.6,
          width: 520,
          height: 420,
          borderRadius: '50%',
          background: `radial-gradient(ellipse at 52% 46%, ${colors.paper} 0%, transparent 66%)`,
          mixBlendMode: 'screen',
          opacity: 0.16 * lift,
          filter: 'blur(6px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: CORNER.x - 330 - drift,
          top: CORNER.y - 120,
          width: 240,
          height: 460,
          borderRadius: '50%',
          background: `radial-gradient(ellipse at 60% 50%, ${colors.ink} 0%, transparent 68%)`,
          mixBlendMode: 'multiply',
          opacity: 0.3 * lift,
          filter: 'blur(9px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: CORNER.x - 210,
          top: CORNER.y - 250 - drift,
          width: 460,
          height: 200,
          borderRadius: '50%',
          background: `radial-gradient(ellipse at 50% 62%, ${colors.ink} 0%, transparent 66%)`,
          mixBlendMode: 'multiply',
          opacity: 0.22 * lift,
          filter: 'blur(9px)',
        }}
      />
    </>
  );
};

/** 湿墨高光：灯下的反光，随墨变干慢慢缩、慢慢淡。at 是墨迹中心，w/h 是覆盖范围。 */
export const WetInkSheen: FC<{
  frame: number;
  from: number;
  to: number;
  at: { x: number; y: number };
  w: number;
  h: number;
}> = ({ frame, from, to, at, w, h }) => {
  const p = interpolate(frame, [from, to], [0, 1], CLAMP);
  const opacity = 0.5 * (1 - p) + 0.05;
  const shrink = 1 - 0.1 * p;
  return (
    <div
      style={{
        position: 'absolute',
        left: at.x - (w * shrink) / 2,
        top: at.y - (h * shrink) / 2,
        width: w * shrink,
        height: h * shrink,
        borderRadius: '48%',
        background: `radial-gradient(ellipse at 44% 36%, ${colors.paper} 0%, ${FILM.fireGold} 26%, transparent 72%)`,
        mixBlendMode: 'screen',
        opacity,
        filter: 'blur(7px)',
      }}
    />
  );
};

/** 墨珠：砚池边（本镜没有实砚入画）凝在第五行行末的湿墨上，8px→14px 凝住，脱手落 6f。 */
export const InkDrop: FC<{
  frame: number;
  /** 落点（字心，1920×1080 基准，未套纸面 zoom） */
  at: { x: number; y: number };
  /** 凝结帧段 [起, 止] */
  gather: readonly [number, number];
  /** 下落帧段 [起, 止]，6f */
  fall: readonly [number, number];
}> = ({ frame, at, gather, fall }) => {
  if (frame < gather[0] || frame > fall[1]) return null;
  const attachY = at.y - 46;
  const falling = frame >= fall[0];
  const fp = falling ? Math.min(1, (frame - fall[0]) / Math.max(1, fall[1] - fall[0])) : 0;
  const d = falling ? 14 : 8 + 6 * ((frame - gather[0]) / Math.max(1, gather[1] - gather[0]));
  const y = falling ? attachY + (at.y - attachY) * fp * fp : attachY;
  const near = Math.max(0, 1 - (at.y - y) / 46);
  return (
    <>
      {/* 纸上的接触影：越接近落点越实 */}
      <div
        style={{
          position: 'absolute',
          left: at.x - d * 0.9,
          top: at.y - d * 0.22,
          width: d * 1.8,
          height: d * 0.44,
          borderRadius: '50%',
          background: `radial-gradient(ellipse at 50% 50%, ${colors.ink} 0%, transparent 70%)`,
          opacity: 0.1 + 0.22 * near,
          filter: 'blur(2px)',
        }}
      />
      {/* 墨珠本体：白心一点点 + 墨身，珠子不是一块死黑 */}
      <div
        style={{
          position: 'absolute',
          left: at.x - d / 2,
          top: y - (d / 2) * 1.15,
          width: d,
          height: d * 1.15,
          borderRadius: '50%',
          background: `radial-gradient(circle at 34% 30%, ${colors.paperMuted} 0%, ${FILM.snowCyan} 16%, ${colors.ink} 42%, ${colors.ink} 100%)`,
          opacity: 0.94,
          boxShadow: `0 1px 3px rgba(24,21,18,0.32)`,
        }}
      />
    </>
  );
};

/** 渗纸毛刺：InkBloom 的径向渐变是光滑的，纸纤维的碎边由这层补。
 *  多边形半径用三条正弦扰动（相位定值），再套 feTurbulence 位移，得到「洇进纸里」的毛边。 */
export const RaggedBloom: FC<{
  progress: number;
  at: { x: number; y: number };
  r?: number;
  opacity?: number;
}> = ({ progress, at, r = 92, opacity = 0.9 }) => {
  if (progress <= 0) return null;
  const R = r;
  const pts = Array.from({ length: 96 }, (_, i) => {
    const a = (i / 96) * Math.PI * 2;
    const w = 0.86 + 0.09 * Math.sin(a * 3 + 0.7) + 0.05 * Math.sin(a * 7 + 2.1) + 0.035 * Math.sin(a * 13 + 4.3);
    const rr = R * w * progress;
    return `${(at.x + Math.cos(a) * rr).toFixed(2)},${(at.y + Math.sin(a) * rr * 0.94).toFixed(2)}`;
  }).join(' ');
  const box = R * 2.4 * progress + 40;
  return (
    <svg
      width={box * 2}
      height={box * 2}
      viewBox={`${at.x - box} ${at.y - box} ${box * 2} ${box * 2}`}
      style={{ position: 'absolute', left: at.x - box, top: at.y - box, overflow: 'visible', mixBlendMode: 'multiply', opacity }}
    >
      <defs>
        <filter id="d-ink-bleed" x="-40%" y="-40%" width="180%" height="180%">
          <feTurbulence type="fractalNoise" baseFrequency="0.055" numOctaves={3} seed={7} result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale={13} xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <radialGradient id="d-ink-mass" cx="50%" cy="46%" r="52%">
          <stop offset="0" stopColor={colors.ink} stopOpacity={1} />
          <stop offset="0.66" stopColor={colors.ink} stopOpacity={0.92} />
          <stop offset="1" stopColor={colors.ink} stopOpacity={0.55} />
        </radialGradient>
      </defs>
      <g filter="url(#d-ink-bleed)">
        <polygon points={pts} fill="url(#d-ink-mass)" />
      </g>
    </svg>
  );
};