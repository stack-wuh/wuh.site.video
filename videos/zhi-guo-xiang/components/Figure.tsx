import type { CSSProperties, FC } from 'react';
import { colors } from '../../../brand/tokens';
import { FILM } from '../motion-tokens';

/** 人物剪影（character-design §2–§4）：全身是剪影，手是第二张脸。
 *  v10（art-direction §十一/§十二）：**杨过永远不给脸**（她拿唯一一次机会换了一张脸，观众仍然不给）；
 *  郭襄全片只给三次脸（S05/S13/S26，走贴片与眼部反光，不在本组件里给）。旧注释「全片无正脸」已废止。
 *  age 五段：16 双环髻 / 20 单髻 / 30 单髻 / 40a 单髻白袍 / 40b 落发缁衣 / old 白发。
 */
export type Age = '16' | '20' | '30' | '40a' | '40b' | 'old';
export type Pose = 'stand' | 'walk' | 'back' | 'pray';

const ROBE: Record<Age, string> = {
  '16': FILM.snowCyan,
  '20': FILM.snowCyan,
  '30': colors.paperMuted,
  '40a': colors.paper,
  '40b': colors.ink,
  old: colors.paperMuted,
};

const HAIR: Record<Age, 'double' | 'single' | 'shaved' | 'white'> = {
  '16': 'double',
  '20': 'single',
  '30': 'single',
  '40a': 'single',
  '40b': 'shaved',
  old: 'white',
};

const LEGS: Record<Pose, string> = {
  stand: 'M48 248 L46 310 L58 310 L60 256 L62 310 L74 310 L72 248 Z',
  walk: 'M48 248 L36 310 L50 310 L60 256 L70 310 L84 310 L72 248 Z',
  back: 'M48 248 L46 310 L58 310 L60 256 L62 310 L74 310 L72 248 Z',
  pray: 'M48 248 L46 310 L58 310 L60 256 L62 310 L74 310 L72 248 Z',
};

/* 两条手臂分开画（同一 stroke 样式，默认像素与旧版单体 path 一致）：S21 只抬右手、另一只不动。 */
const ARM_L: Record<Pose, string> = {
  stand: 'M36 92 L30 194',
  walk: 'M36 92 L26 186',
  back: 'M36 92 L30 194',
  pray: 'M36 92 Q60 146 84 92',
};

const ARM_R: Record<Pose, string> = {
  stand: 'M84 92 L90 194',
  walk: 'M84 92 L94 186',
  back: 'M84 92 L90 194',
  pray: '',
};

export const XiangFigure: FC<{
  age: Age;
  pose?: Pose;
  style?: CSSProperties;
  opacity?: number;
  /** hem：衣摆横移；tail：发髻/布巾滞后（S30/S31 上山背影用） */
  flow?: { hem?: number; tail?: number };
  /** 0–1：右手从垂直接到举针位（S21「她举着金针」）。默认 0 时像素与旧版一致。 */
  raise?: number;
  /** 0–1：举起的右手里那枚金针的不透明度（针灸针、无针眼）。默认 0。 */
  needle?: number;
}> = ({ age, pose = 'stand', style, opacity = 1, flow, raise = 0, needle = 0 }) => {
  const robe = ROBE[age];
  const hair = HAIR[age];
  const hem = flow?.hem ?? 0;
  const tail = flow?.tail ?? 0;
  /* 举针位：肩 (84,92) → 手 (100,58)；垂手位按 pose 取旧路径终点 */
  const baseEnd = pose === 'walk' ? { x: 94, y: 186 } : { x: 90, y: 194 };
  const midX = (84 + baseEnd.x) / 2;
  const midY = (92 + baseEnd.y) / 2;
  const endX = baseEnd.x + (100 - baseEnd.x) * raise;
  const endY = baseEnd.y + (58 - baseEnd.y) * raise;
  const ctrlX = midX + (96 - midX) * raise;
  const ctrlY = midY + (78 - midY) * raise;
  const armR =
    pose === 'pray' ? ARM_R[pose] : raise > 0 ? `M84 92 Q${ctrlX} ${ctrlY} ${endX} ${endY}` : ARM_R[pose];
  /* 金针：从手里朝右上方举出 20 个 viewBox 单位；柄短而粗、针身细直、针尖一点亮，整根无针眼 */
  const needleAngle = (-64 * Math.PI) / 180;
  const needleTip = { x: endX + Math.cos(needleAngle) * 20, y: endY + Math.sin(needleAngle) * 20 };
  const needleWrap = { x: endX + Math.cos(needleAngle) * 5, y: endY + Math.sin(needleAngle) * 5 };
  return (
    <svg viewBox="0 0 120 320" style={style} opacity={opacity}>
      {/* 颈：补头（cy42 r18）与衣领（y68–82）之间的空隙 */}
      <path d="M54 56 L66 56 L66 80 L54 80 Z" fill={robe} />
      <g transform={`translate(${hem} 0)`}>
        <path d="M40 82 Q60 68 80 82 L92 250 Q60 264 28 250 Z" fill={robe} />
        <path d={LEGS[pose]} fill={robe} />
      </g>
      <path d={ARM_L[pose]} fill="none" stroke={robe} strokeWidth={9} strokeLinecap="round" />
      <path d={armR} fill="none" stroke={robe} strokeWidth={9} strokeLinecap="round" />
      <circle cx={60} cy={42} r={18} fill={robe} />
      {hair === 'double' ? (
        <>
          <circle cx={44 + tail} cy={26} r={7} fill={robe} />
          <circle cx={76 + tail} cy={26} r={7} fill={robe} />
        </>
      ) : null}
      {hair === 'single' ? <circle cx={60 + tail} cy={24} r={8} fill={robe} /> : null}
      {hair === 'white' ? <circle cx={60 + tail} cy={24} r={8} fill={colors.paper} /> : null}
      {raise > 0 && needle > 0 ? (
        <g opacity={needle}>
          <path d={`M${endX} ${endY} L${needleTip.x} ${needleTip.y}`} stroke={colors.accent} strokeWidth={0.9} strokeLinecap="round" />
          <path d={`M${endX} ${endY} L${needleWrap.x} ${needleWrap.y}`} stroke={FILM.fireGold} strokeWidth={2.4} strokeLinecap="round" />
          <circle cx={needleTip.x} cy={needleTip.y} r={1.1} fill={colors.gold} />
        </g>
      ) : null}
    </svg>
  );
};

/** 杨过：只给背影、空袖、半束长发；无正脸、无剑（character-design §3）。
 *  v10 §十二.1 补回**面具形制**：脑后系带 + 系结双尾（背影可读），抬到面具那一下给一线镜边冷光。
 *  raise 只动**仅存的左臂**（画面左）；右袖始终空垂——这是「独臂」的形制，不能改成右臂。
 *  默认 raise=0 / mask=0 时像素与旧版一致。 */
export const YangGuoFigure: FC<{
  style?: CSSProperties;
  opacity?: number;
  /** 0–1：左臂从垂直接到面具侧 */
  raise?: number;
  /** 0–1：面具系带与镜边（S21 传 1） */
  mask?: number;
}> = ({ style, opacity = 1, raise = 0, mask = 0 }) => {
  const endX = 42 + (43 - 42) * raise;
  const endY = 202 + (38 - 202) * raise;
  const ctrlX = 34 + (25 - 34) * raise;
  const ctrlY = 132 + (56 - 132) * raise;
  const arm = raise === 0 ? 'M40 74 Q34 132 42 202' : `M40 74 Q${ctrlX} ${ctrlY} ${endX} ${endY}`;
  return (
    <svg viewBox="0 0 120 360" style={style} opacity={opacity}>
      {/* 深墨长袍 */}
      <path d="M40 70 Q60 56 80 70 L94 250 Q60 264 26 250 Z" fill={colors.ink} />
      {/* 右袖空垂。旧版是一根细长硬条（在雪径上会读成剑，杨过全片无剑）；
          v10 形制（mask>0）换成软塌的空袖管，袖口圆垂。mask=0 保持旧像素。 */}
      {mask > 0 ? (
        <>
          <path d="M80 74 Q94 118 98 156" fill="none" stroke={colors.ink} strokeWidth={18} strokeLinecap="round" />
          <path d="M84 88 Q91 122 94 150" fill="none" stroke={colors.paper} strokeWidth={1.1} strokeLinecap="round" opacity={0.1} />
        </>
      ) : (
        <path d="M80 74 L102 168 L110 166 L90 72 Z" fill={colors.ink} />
      )}
      {/* 仅存的左臂：垂着 → 抬到面具；右袖不动 */}
      <path d={arm} fill="none" stroke={colors.ink} strokeWidth={3 + 3.2 * raise} strokeLinecap="round" />
      {/* 头与半束长发 */}
      <circle cx={60} cy={34} r={18} fill={colors.ink} />
      <path d="M44 20 Q60 2 76 20 Q70 46 60 48 Q50 46 44 20" fill={colors.ink} />
      {/* 面具形制：脑后系带 + 系结双尾 */}
      {mask > 0 ? (
        <>
          <path d="M43.5 26 Q60 19 76.5 26" fill="none" stroke={colors.paperMuted} strokeWidth={1.6} opacity={0.55 * mask} />
          <path d="M76 26 Q84 33 86 43" fill="none" stroke={colors.paperMuted} strokeWidth={1.1} opacity={0.45 * mask} />
          <path d="M75 28 Q83 37 82 50" fill="none" stroke={colors.paperMuted} strokeWidth={0.9} opacity={0.34 * mask} />
        </>
      ) : null}
      {/* 抬手到面具为止：手在头轮廓外鼓出一点，镜边一线冷光——脸始终不给 */}
      {raise > 0 ? (
        <>
          <circle cx={endX - 1.5} cy={endY - 1} r={4.2 * raise} fill={colors.ink} />
          {mask > 0 ? (
            <path d="M44 27 Q39 36 44 47" fill="none" stroke={colors.paperMuted} strokeWidth={1.2} opacity={0.6 * mask * raise} />
          ) : null}
        </>
      ) : null}
    </svg>
  );
};

/** 风陵师太：与 16 岁郭襄同源剪影 ×0.93（character-design §4）。
 *  形制以 §四「天光」为准：ink 剪影 + 1px gold 侧光（只给下颌与肩）+ 内领一线雪青；
 *  单层衣、无腰带结、无手、发线 2 条、衣褶 1 条。 */
export const FenglingFigure: FC<{ style?: CSSProperties; opacity?: number; sway?: number }> = ({
  style,
  opacity = 1,
  sway = 0,
}) => (
  <svg viewBox="0 0 120 320" style={style} opacity={opacity}>
    <path d="M54 56 L66 56 L66 80 L54 80 Z" fill={colors.ink} />
    <path d="M40 82 Q60 68 80 82 L92 250 Q60 264 28 250 Z" fill={colors.ink} />
    <path d="M48 248 L46 310 L58 310 L60 256 L62 310 L74 310 L72 248 Z" fill={colors.ink} />
    <g transform={`translate(${sway} 0)`}>
      <path d="M36 92 L30 194 M84 92 L90 194" fill="none" stroke={colors.ink} strokeWidth={9} strokeLinecap="round" />
    </g>
    <circle cx={60} cy={42} r={18} fill={colors.ink} />
    <circle cx={44} cy={26} r={7} fill={colors.ink} />
    <circle cx={76} cy={26} r={7} fill={colors.ink} />
    <path d="M52 82 L60 96 L68 82" fill="none" stroke={FILM.snowCyan} strokeWidth={1} opacity={0.9} />
    <path d="M48 50 Q60 62 72 50" fill="none" stroke={colors.gold} strokeWidth={1} opacity={0.55} />
    <path d="M40 82 Q60 68 80 82" fill="none" stroke={colors.gold} strokeWidth={1} opacity={0.5} />
    <path d="M52 34 Q60 28 68 34" fill="none" stroke={colors.paper} strokeWidth={1} opacity={0.16} />
    <path d="M42 40 Q60 31 78 40" fill="none" stroke={colors.paper} strokeWidth={1} opacity={0.12} />
    <path d="M60 100 Q56 170 60 246" fill="none" stroke={colors.paper} strokeWidth={1} opacity={0.14} />
  </svg>
);

/** 人群：只给背影与剪影，无个体正脸（FG-18）。 */
export const CrowdFigure: FC<{ count?: number; style?: CSSProperties; opacity?: number }> = ({
  count = 12,
  style,
  opacity = 0.8,
}) => (
  <div style={{ position: 'absolute', inset: 0, ...style }}>
    {Array.from({ length: count }).map((_, i) => (
      <svg
        key={i}
        viewBox="0 0 40 120"
        style={{
          position: 'absolute',
          left: `${(i / Math.max(1, count - 1)) * 100}%`,
          bottom: 0,
          width: 40,
          height: 96 + (i % 3) * 14,
          opacity,
          transform: 'translateX(-50%)',
        }}
      >
        <circle cx={20} cy={18} r={9} fill={colors.ink} />
        <path d="M10 30 Q20 24 30 30 L34 118 Q20 122 6 118 Z" fill={colors.ink} />
      </svg>
    ))}
  </div>
);

/** 弟子两列（FG-19）：素衣背影，不抢焦点。 */
export const DiscipleFigure: FC<{ style?: CSSProperties; opacity?: number }> = ({ style, opacity = 0.75 }) => (
  <XiangFigure age="20" pose="back" style={style} opacity={opacity} />
);