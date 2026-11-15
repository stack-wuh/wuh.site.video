import type { FC } from 'react';
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from 'remotion';
import { ShotShell } from '../components/ShotShell';
import { DataLabel } from '../components/Type';
import { FILM_COLORS, FONTS, fmtInt, slam } from '../motion-tokens';

/** 八数（materials v4 §九，2026-11-14 快照） */
const WALL = [
  { value: 1243, label: 'COMMITS' },
  { value: 127, label: 'VERSIONS' },
  { value: 46, label: 'ARTICLES' },
  { value: 64985, label: 'WORDS' },
  { value: 26948, label: 'READS' },
  { value: 8437, label: 'ACTIVITY' },
  { value: 146, label: 'BOOKS' },
  { value: 6, label: 'REPOS' },
] as const;

/** 汇入方向：四边与两角（确定性，按序固定） */
const DIRS: ReadonlyArray<readonly [number, number]> = [
  [-760, -180],
  [720, -320],
  [-520, 420],
  [640, 300],
  [-820, 120],
  [780, -60],
  [-380, -420],
  [500, 380],
];

const WallNumber: FC<{ value: number; label: string; index: number; slamAt: number }> = ({
  value,
  label,
  index,
  slamAt,
}) => {
  const frame = useCurrentFrame();
  const conv = interpolate(frame, [8, 22], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.in(Easing.cubic),
  });
  const s = slam(frame, slamAt);
  const dir = DIRS[index];
  const labelP = interpolate(frame, [slamAt, slamAt + 6], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        transform: `translate(${dir[0] * conv}px, ${dir[1] * conv}px)`,
      }}
    >
      <div
        style={{
          fontFamily: FONTS.serif,
          fontWeight: 700,
          fontSize: 104,
          lineHeight: 1,
          letterSpacing: '-0.02em',
          color: FILM_COLORS.ink,
          fontVariantNumeric: 'tabular-nums lining-nums',
          transform: `translate(${s.dx * 2}px, ${s.dy * 2}px) scale(${s.scale})`,
          transformOrigin: 'left center',
        }}
      >
        {fmtInt(value)}
      </div>
      <div style={{ marginTop: 14, width: 200, height: 1, backgroundColor: s.hit > 0 ? FILM_COLORS.vermillion : FILM_COLORS.hairline }} />
      <div style={{ marginTop: 12, opacity: labelP }}>
        <DataLabel size={17}>{label}</DataLabel>
      </div>
    </div>
  );
};

/**
 * s02 · 数字墙（120f，80–200）
 * Return 键位压下 → 八数自四边两角直线汇入 → SLAM 落成 4×2 墙（错 5f、末枚对拍）。
 * 尾帧：墙满画幅定格（交 s03 收砖）。
 */
const S02: FC = () => {
  const frame = useCurrentFrame();
  const pressed = frame < 4;
  return (
    <ShotShell act="ACT 00 · 冷开场">
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            rowGap: 96,
            columnGap: 40,
            width: 1680,
            paddingLeft: 20,
          }}
        >
          {WALL.map((w, i) => (
            <WallNumber key={w.label} value={w.value} label={w.label} index={i} slamAt={26 + i * 6} />
          ))}
        </div>
      </AbsoluteFill>
      {/* Return 键位：0–4f 压下 */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          bottom: 96,
          width: 68,
          height: 40,
          marginLeft: -34,
          border: `1px solid ${FILM_COLORS.hairline}`,
          borderRadius: 6,
          backgroundColor: FILM_COLORS.card,
          transform: `translateY(${pressed ? 4 : 0}px)`,
          opacity: interpolate(frame, [0, 30], [1, 0.25], { extrapolateRight: 'clamp' }),
          boxShadow: pressed ? `inset 0 2px 0 ${FILM_COLORS.hairline}` : 'none',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: FONTS.mono,
            fontSize: 12,
            letterSpacing: '0.14em',
            color: FILM_COLORS.muted,
          }}
        >
          RETURN
        </div>
      </div>
    </ShotShell>
  );
};

export default S02;