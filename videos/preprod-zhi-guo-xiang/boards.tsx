import type { FC, ReactNode } from 'react';
import { colors, fontFamilies } from '../../brand/tokens';
import type { AnimaticShot } from './shots-data';

const serif = fontFamilies.serif;
const mono = fontFamilies.mono;

type Kind = 'ascent' | 'sword' | 'light' | 'temple' | 'hand' | 'water' | 'mountain' | 'crowd' | 'paper' | 'generic';

/** 画面意图关键词 → 简板母题（先命中先生效；顺序即优先级） */
const KIND_RULES: Array<[Kind, RegExp]> = [
  ['hand', /铁罗汉|掌心|金针|搁笔|笔搁|砚|缰绳/],
  ['ascent', /石阶|上山|门缝|门开|山门/],
  ['sword', /剑|雪|断墙/],
  ['light', /烟花|火金|金屑|云霞|灯|夜空|光/],
  ['temple', /经卷|佛像|禅房|缁衣|落发|佛前/],
  ['water', /海|水纹|浪|渡口|渡船|芦苇|河面/],
  ['mountain', /山|远山|雾/],
  ['crowd', /人群|人圈|市井|城门口|弟子|城头/],
  ['paper', /纸|页|字|说书|传抄/],
];

export const boardKindOf = (shot: AnimaticShot): Kind => {
  for (const [kind, re] of KIND_RULES) if (re.test(shot.visual)) return kind;
  return 'generic';
};

const tintOf = (act: number): string => (act % 3 === 1 ? colors.bgLift : act % 3 === 2 ? colors.terminalBg : colors.bg);

const BoardFrame: FC<{ act: number; children: ReactNode }> = ({ act, children }) => (
  <div
    style={{
      position: 'relative',
      width: 1120,
      height: 560,
      background: colors.bgLift,
      border: `1px solid ${colors.hairline}`,
      overflow: 'hidden',
    }}
  >
    <div style={{ position: 'absolute', inset: 0, background: tintOf(act), opacity: 0.35 }} />
    {children}
  </div>
);

const MotifSvg: FC<{ children: ReactNode }> = ({ children }) => (
  <svg
    width={520}
    height={560}
    viewBox="0 0 520 560"
    style={{ position: 'absolute', right: 0, top: 0, opacity: 0.9 }}
  >
    {children}
  </svg>
);

const MountainMotif: FC = () => (
  <MotifSvg>
    <path d="M0 430 L90 300 L150 360 L230 210 L310 380 L390 270 L470 390 L520 340" fill="none" stroke={colors.paper} strokeWidth={1.2} opacity={0.55} />
    <path d="M0 480 L120 400 L200 450 L300 340 L380 450 L460 400 L520 440" fill="none" stroke={colors.muted} strokeWidth={0.8} opacity={0.35} />
  </MotifSvg>
);

const WaterMotif: FC = () => (
  <MotifSvg>
    {[150, 210, 270, 330, 390, 450].map((y, i) => (
      <path
        key={y}
        d={`M0 ${y} Q 90 ${y - 14} 180 ${y} T 360 ${y} T 520 ${y}`}
        fill="none"
        stroke={i % 2 === 0 ? colors.paper : colors.muted}
        strokeWidth={i % 2 === 0 ? 1.2 : 0.8}
        opacity={0.45 - i * 0.04}
      />
    ))}
  </MotifSvg>
);

const LightMotif: FC = () => (
  <MotifSvg>
    {[{ x: 300, y: 170, r: 7 }, { x: 360, y: 230, r: 5 }, { x: 250, y: 260, r: 4 }, { x: 410, y: 300, r: 3 }].map((d) => (
      <circle key={`${d.x}-${d.y}`} cx={d.x} cy={d.y} r={d.r} fill={colors.gold} opacity={0.9} />
    ))}
    {[120, 150, 180, 210, 240, 270].map((y, i) => (
      <line key={y} x1={i % 2 === 0 ? 180 : 220} y1={y} x2={i % 2 === 0 ? 470 : 500} y2={y} stroke={colors.accent} strokeWidth={0.8} opacity={0.22} />
    ))}
  </MotifSvg>
);

const SwordMotif: FC = () => (
  <MotifSvg>
    <line x1={330} y1={120} x2={330} y2={430} stroke={colors.paper} strokeWidth={2} opacity={0.75} />
    <line x1={310} y1={430} x2={350} y2={430} stroke={colors.paper} strokeWidth={3} opacity={0.75} />
    {[60, 90, 120, 150, 180, 210, 240, 270, 300, 330, 360, 390, 420, 450, 480, 510].map((y, i) => (
      <circle key={y} cx={i % 3 === 0 ? 280 : 380} cy={y} r={1.6} fill={colors.paper} opacity={0.5} />
    ))}
  </MotifSvg>
);

const HandMotif: FC = () => (
  <MotifSvg>
    <path d="M240 360 Q 300 320 360 350 Q 400 370 400 420 Q 360 470 280 460 Q 220 440 240 360" fill="none" stroke={colors.paper} strokeWidth={1.4} opacity={0.65} />
    {[0, 1, 2].map((i) => (
      <line key={i} x1={270 + i * 28} y1={400} x2={270 + i * 28} y2={350} stroke={colors.gold} strokeWidth={1.2} opacity={0.8} />
    ))}
  </MotifSvg>
);

const TempleMotif: FC = () => (
  <MotifSvg>
    <path d="M180 300 Q 260 220 340 300" fill="none" stroke={colors.paper} strokeWidth={1.4} opacity={0.7} />
    <path d="M210 330 Q 260 300 310 330" fill="none" stroke={colors.muted} strokeWidth={1} opacity={0.5} />
    <circle cx={260} cy={250} r={6} fill={colors.gold} opacity={0.9} />
    <line x1={260} y1={250} x2={260} y2={290} stroke={colors.accent} strokeWidth={0.8} opacity={0.35} />
  </MotifSvg>
);

const AscentMotif: FC = () => (
  <MotifSvg>
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <rect key={i} x={150 + i * 20} y={450 - i * 34} width={220 - i * 20} height={12} fill={colors.paper} opacity={0.18 + i * 0.05} />
    ))}
    <rect x={370} y={170} width={90} height={230} fill="none" stroke={colors.paper} strokeWidth={1.2} opacity={0.55} />
    <line x1={415} y1={170} x2={415} y2={400} stroke={colors.paper} strokeWidth={0.8} opacity={0.35} />
    <circle cx={330} cy={300} r={7} fill={colors.ink} stroke={colors.paper} strokeWidth={1} opacity={0.9} />
    <line x1={330} y1={307} x2={330} y2={350} stroke={colors.paper} strokeWidth={1.4} opacity={0.75} />
  </MotifSvg>
);

const CrowdMotif: FC = () => (
  <MotifSvg>
    {Array.from({ length: 14 }).map((_, i) => (
      <g key={i} opacity={0.35 + (i % 4) * 0.08}>
        <circle cx={80 + i * 28} cy={330 + (i % 3) * 12} r={5} fill={colors.paper} />
        <line x1={80 + i * 28} y1={338 + (i % 3) * 12} x2={80 + i * 28} y2={390 + (i % 3) * 12} stroke={colors.paper} strokeWidth={2} />
      </g>
    ))}
  </MotifSvg>
);

const PaperMotif: FC = () => (
  <MotifSvg>
    <rect x={130} y={110} width={280} height={380} fill={colors.paper} opacity={0.12} />
    {[0, 1, 2, 3, 4, 5, 6].map((i) => (
      <line key={i} x1={160} y1={160 + i * 42} x2={380 - (i % 3) * 28} y2={160 + i * 42} stroke={colors.paper} strokeWidth={0.9} opacity={0.35} />
    ))}
  </MotifSvg>
);

const GenericMotif: FC = () => (
  <MotifSvg>
    {[170, 240, 310, 380].map((y, i) => (
      <line key={y} x1={220} y1={y} x2={480 - i * 26} y2={y} stroke={colors.paper} strokeWidth={1} opacity={0.28 - i * 0.04} />
    ))}
  </MotifSvg>
);

const Motif: FC<{ kind: Kind }> = ({ kind }) => {
  switch (kind) {
    case 'ascent':
      return <AscentMotif />;
    case 'sword':
      return <SwordMotif />;
    case 'light':
      return <LightMotif />;
    case 'temple':
      return <TempleMotif />;
    case 'hand':
      return <HandMotif />;
    case 'water':
      return <WaterMotif />;
    case 'mountain':
      return <MountainMotif />;
    case 'crowd':
      return <CrowdMotif />;
    case 'paper':
      return <PaperMotif />;
    default:
      return <GenericMotif />;
  }
};

const labelOf = (shot: AnimaticShot): string => {
  const head = shot.visual.split('。')[0] ?? shot.visual;
  return head.length > 46 ? `${head.slice(0, 46)}…` : head;
};

export const ShotBoard: FC<{ shot: AnimaticShot }> = ({ shot }) => (
  <BoardFrame act={shot.act}>
    <Motif kind={boardKindOf(shot)} />
    <div style={{ position: 'absolute', left: '8%', top: 54, width: '52%' }}>
      <div style={{ fontFamily: mono, fontSize: 14, color: colors.accent, letterSpacing: '0.2em' }}>
        ACT {shot.act} · S{String(shot.n).padStart(2, '0')}
      </div>
      <div style={{ fontFamily: serif, fontSize: 30, lineHeight: 1.5, color: colors.paper, marginTop: 14 }}>{labelOf(shot)}</div>
      <div style={{ fontFamily: mono, fontSize: 13, lineHeight: 1.7, color: colors.muted, marginTop: 18 }}>
        {shot.cam.length > 78 ? `${shot.cam.slice(0, 78)}…` : shot.cam}
      </div>
    </div>
    <div style={{ position: 'absolute', right: '8%', bottom: 44, fontFamily: mono, fontSize: 12, color: colors.muted }}>
      S{shot.n} · {shot.startFrame}–{shot.startFrame + shot.durationFrames}
    </div>
  </BoardFrame>
);
