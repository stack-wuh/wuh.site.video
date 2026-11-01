import type { CSSProperties, FC } from 'react';
import { colors } from '../../../brand/tokens';
import { FILM } from '../motion-tokens';

/** 物（character-design §5）：人如墨影，物如刀刻；正片全片无红。 */

export const Donkey: FC<{ style?: CSSProperties; opacity?: number }> = ({ style, opacity = 1 }) => (
  <svg viewBox="0 0 200 160" style={style} opacity={opacity}>
    <ellipse cx={100} cy={78} rx={52} ry={30} fill={colors.ink} />
    <path d="M48 88 L40 150 L52 150 L60 96 M92 96 L88 150 L100 150 L104 92 M116 92 L122 150 L134 150 L128 90" stroke={colors.ink} strokeWidth={8} strokeLinecap="round" />
    <path d="M142 58 Q164 44 172 58 L164 78" fill={colors.ink} />
    <path d="M156 48 L150 24 L162 22 L166 48 M168 48 L174 26 L186 30 L178 50" fill={colors.ink} />
    <path d="M46 68 Q30 78 26 96" fill="none" stroke={colors.ink} strokeWidth={4} strokeLinecap="round" />
    {/* FG-10 边光：只给背线与颈背，≤1.2px */}
    <path d="M54 70 Q100 44 146 70" fill="none" stroke={FILM.snowCyan} strokeWidth={1.2} opacity={0.5} />
    <path d="M145 56 Q162 45 170 57" fill="none" stroke={FILM.snowCyan} strokeWidth={1.2} opacity={0.45} />
  </svg>
);

export const Sword: FC<{ state?: 'back' | 'snow' | 'wall'; style?: CSSProperties; opacity?: number }> = ({
  state = 'back',
  style,
  opacity = 1,
}) => (
  <svg viewBox="0 0 60 260" style={style} opacity={opacity}>
    <rect x={24} y={34} width={12} height={186} fill={colors.ink} />
    <rect x={20} y={30} width={20} height={8} fill={colors.paperMuted} />
    <rect x={24} y={220} width={12} height={10} fill={colors.paperMuted} />
    <path d="M30 230 Q24 242 30 256 Q36 242 30 230" fill={colors.paperMuted} />
    {state === 'snow' ? (
      <>
        <path d="M24 90 L36 96 M24 120 L36 114 M24 150 L36 156" stroke={colors.paper} strokeWidth={1.5} opacity={0.55} />
      </>
    ) : null}
    {state === 'wall' ? <path d="M36 52 L48 52" stroke={colors.muted} strokeWidth={1.2} /> : null}
  </svg>
);

export const Ferry: FC<{ style?: CSSProperties; opacity?: number }> = ({ style, opacity = 1 }) => (
  <svg viewBox="0 0 520 220" style={style} opacity={opacity}>
    {[0, 1, 2, 3, 4].map((i) => (
      <path key={i} d={`M0 ${120 + i * 18} Q 130 ${104 + i * 18} 260 ${120 + i * 18} T 520 ${120 + i * 18}`} fill="none" stroke={colors.muted} strokeWidth={0.8} opacity={0.35 - i * 0.05} />
    ))}
    <path d="M150 110 Q260 142 370 110 L350 132 Q260 156 170 132 Z" fill={colors.ink} />
    {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
      <path key={i} d={`M${30 + i * 16} 140 L${36 + i * 16} ${70 + (i % 3) * 18}`} stroke={FILM.snowCyan} strokeWidth={1.2} opacity={0.6} />
    ))}
  </svg>
);

export const Gate: FC<{ gap?: number; style?: CSSProperties; opacity?: number }> = ({ gap = 1, style, opacity = 1 }) => (
  <svg viewBox="0 0 320 320" style={style} opacity={opacity}>
    <rect x={40} y={40} width={26} height={260} fill={colors.ink} />
    <rect x={254} y={40} width={26} height={260} fill={colors.ink} />
    <rect x={34} y={30} width={252} height={18} fill={colors.ink} />
    <rect x={70} y={64} width={88} height={236} fill={colors.ink} opacity={0.92} />
    <rect x={162} y={64} width={88} height={236} fill={colors.ink} opacity={0.92} />
    <rect x={158} y={64} width={Math.max(1, gap)} height={236} fill={colors.paper} opacity={0.85} />
  </svg>
);

export const Scripture: FC<{ style?: CSSProperties; opacity?: number }> = ({ style, opacity = 1 }) => (
  <svg viewBox="0 0 260 120" style={style} opacity={opacity}>
    <rect x={10} y={16} width={240} height={88} fill={colors.paperMuted} />
    {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
      <path key={i} d={`M${30} ${30 + i * 9} L${30 + 180 - (i % 3) * 24} ${30 + i * 9}`} stroke={colors.ink} strokeWidth={1} opacity={0.5} />
    ))}
  </svg>
);

export const Buddha: FC<{ style?: CSSProperties; opacity?: number }> = ({ style, opacity = 1 }) => (
  <svg viewBox="0 0 240 260" style={style} opacity={opacity}>
    <path d="M60 120 Q120 40 180 120" fill="none" stroke={colors.paperMuted} strokeWidth={2} />
    <path d="M40 190 Q120 130 200 190" fill="none" stroke={colors.paperMuted} strokeWidth={1.4} opacity={0.7} />
    <path d="M92 178 Q120 160 148 178" fill="none" stroke={colors.paperMuted} strokeWidth={1.2} opacity={0.6} />
    <circle cx={120} cy={118} r={4} fill={FILM.fireGold} opacity={0.8} />
  </svg>
);

export const IronArhat: FC<{ style?: CSSProperties; opacity?: number }> = ({ style, opacity = 1 }) => (
  <svg viewBox="0 0 60 80" style={style} opacity={opacity}>
    <circle cx={30} cy={18} r={12} fill={colors.ink} />
    <path d="M18 34 L42 34 L46 70 L14 70 Z" fill={colors.ink} />
    <path d="M22 40 L18 62 M38 40 L42 62" stroke={colors.accent} strokeWidth={1.2} />
    <path d="M26 50 Q30 44 34 50" fill="none" stroke={colors.accent} strokeWidth={1} />
  </svg>
);

/* FG-17：针长 46、身 0.8、尖一点、三枚并排间距 10；尖金 ≤2px */
export const Needles: FC<{ style?: CSSProperties; opacity?: number }> = ({ style, opacity = 1 }) => (
  <svg viewBox="0 0 170 40" style={style} opacity={opacity}>
    {[0, 1, 2].map((i) => {
      const x = 10 + i * 56;
      return (
        <g key={i}>
          <path d={`M${x} 20 L${x + 46} 20`} stroke={colors.paperMuted} strokeWidth={0.8} />
          <circle cx={x + 46} cy={20} r={1} fill={colors.gold} />
        </g>
      );
    })}
  </svg>
);
