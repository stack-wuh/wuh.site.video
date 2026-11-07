import type { FC, ReactNode } from 'react';
import { colors, fontFamilies } from '../../brand/tokens';
import type { AnimaticShot } from './shots-data';

const serif = fontFamilies.serif;
const mono = fontFamilies.mono;

type Kind = 'clip' | 'doc' | 'ci' | 'wave' | 'seal' | 'count' | 'split' | 'generic';

/** 画面意图关键词 → 简板母题（先命中先生效；顺序即优先级） */
const KIND_RULES: Array<[Kind, RegExp]> = [
  ['count', /计数|9060f|versions|「11」/],
  ['split', /对切|同帧位/],
  ['ci', /CI|run |矩阵|任务|日志|兜底|子集|cancelled/],
  ['wave', /波形|漂移|对齐|TTS|录音/],
  ['seal', /印|落版|诗六行/],
  ['doc', /卡：|script|素材库|校对表|design|character|查证/],
  ['clip', /母带|M[1-8]|seg-|实拍|直放|animatic 开场/],
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

/** 素材镜：胶片框 + 播放角标（母带原貌占位） */
const ClipMotif: FC = () => (
  <MotifSvg>
    <rect x={110} y={120} width={320} height={300} fill="none" stroke={colors.paper} strokeWidth={1.6} opacity={0.6} />
    {[140, 180, 220, 260, 300, 340, 380].map((y) => (
      <rect key={y} x={122} y={y} width={10} height={14} fill={colors.paper} opacity={0.3} />
    ))}
    {[140, 180, 220, 260, 300, 340, 380].map((y) => (
      <rect key={`r-${y}`} x={408} y={y} width={10} height={14} fill={colors.paper} opacity={0.3} />
    ))}
    <path d="M250 240 L310 270 L250 300 Z" fill={colors.paper} opacity={0.55} />
  </MotifSvg>
);

/** 文档卡：纸面 + 行线（施工图占位） */
const DocMotif: FC = () => (
  <MotifSvg>
    <rect x={130} y={100} width={280} height={380} fill={colors.paper} opacity={0.1} />
    {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
      <line key={i} x1={160} y1={150 + i * 40} x2={i % 3 === 2 ? 300 : 380 - (i % 2) * 24} y2={150 + i * 40} stroke={colors.paper} strokeWidth={0.9} opacity={0.35} />
    ))}
    <rect x={130} y={100} width={280} height={26} fill={colors.accent} opacity={0.2} />
  </MotifSvg>
);

/** CI 卡：任务网格（并发方块占位） */
const CiMotif: FC = () => (
  <MotifSvg>
    {Array.from({ length: 6 }).map((_, r) =>
      Array.from({ length: 8 }).map((_, c) => (
        <rect
          key={`${r}-${c}`}
          x={140 + c * 34}
          y={140 + r * 44}
          width={24}
          height={24}
          fill={(r * 8 + c) % 5 === 0 ? colors.gold : colors.paper}
          opacity={(r * 8 + c) % 5 === 0 ? 0.5 : 0.18 + ((r + c) % 3) * 0.08}
        />
      )),
    )}
  </MotifSvg>
);

/** 波形卡：错位/对齐的声波线条 */
const WaveMotif: FC = () => (
  <MotifSvg>
    {[170, 280, 390].map((y, row) =>
      Array.from({ length: 22 }).map((_, i) => (
        <rect
          key={`${row}-${i}`}
          x={130 + i * 12}
          y={y - (i % 4 === row % 4 ? 18 : 10) - (row === 1 ? (i % 3) * 6 : 0)}
          width={5}
          height={(i % 4 === row % 4 ? 36 : 20) + (row === 1 ? (i % 3) * 8 : 0)}
          fill={row === 1 ? colors.gold : colors.paper}
          opacity={row === 1 ? 0.55 : 0.3}
        />
      )),
    )}
    <line x1={110} y1={280} x2={470} y2={280} stroke={colors.accent} strokeWidth={0.8} opacity={0.3} />
  </MotifSvg>
);

/** 印章/落版：朱印方章 */
const SealMotif: FC = () => (
  <MotifSvg>
    <rect x={210} y={190} width={140} height={140} fill="none" stroke={colors.gold} strokeWidth={3} opacity={0.75} />
    <line x1={240} y1={240} x2={320} y2={240} stroke={colors.gold} strokeWidth={2.4} opacity={0.6} />
    <line x1={240} y1={280} x2={320} y2={280} stroke={colors.gold} strokeWidth={2.4} opacity={0.6} />
    <line x1={130} y1={400} x2={430} y2={400} stroke={colors.paper} strokeWidth={0.8} opacity={0.3} />
    <line x1={160} y1={430} x2={400} y2={430} stroke={colors.paper} strokeWidth={0.8} opacity={0.22} />
  </MotifSvg>
);

/** 计数角标：大数字 */
const CountMotif: FC = () => (
  <MotifSvg>
    <text x={340} y={330} textAnchor="middle" fontFamily={mono} fontSize={150} fill={colors.paper} opacity={0.5}>
      11
    </text>
    <text x={340} y={380} textAnchor="middle" fontFamily={mono} fontSize={20} fill={colors.muted} opacity={0.7}>
      versions
    </text>
  </MotifSvg>
);

/** 对比镜：左右分屏 + 中缝 */
const SplitMotif: FC = () => (
  <MotifSvg>
    <rect x={110} y={130} width={145} height={280} fill="none" stroke={colors.paper} strokeWidth={1.2} opacity={0.5} />
    <rect x={285} y={130} width={145} height={280} fill="none" stroke={colors.gold} strokeWidth={1.2} opacity={0.5} />
    <line x1={270} y1={110} x2={270} y2={430} stroke={colors.accent} strokeWidth={1} opacity={0.5} />
    <text x={182} y={460} textAnchor="middle" fontFamily={mono} fontSize={18} fill={colors.muted} opacity={0.8}>
      A
    </text>
    <text x={358} y={460} textAnchor="middle" fontFamily={mono} fontSize={18} fill={colors.muted} opacity={0.8}>
      B
    </text>
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
    case 'clip':
      return <ClipMotif />;
    case 'doc':
      return <DocMotif />;
    case 'ci':
      return <CiMotif />;
    case 'wave':
      return <WaveMotif />;
    case 'seal':
      return <SealMotif />;
    case 'count':
      return <CountMotif />;
    case 'split':
      return <SplitMotif />;
    default:
      return <GenericMotif />;
  }
};

const labelOf = (shot: AnimaticShot): string => {
  const head = shot.visual.split('：')[0] ?? shot.visual;
  return head.length > 46 ? `${head.slice(0, 46)}…` : head;
};

export const ShotBoard: FC<{ shot: AnimaticShot }> = ({ shot }) => (
  <BoardFrame act={shot.act}>
    <Motif kind={boardKindOf(shot)} />
    <div style={{ position: 'absolute', left: '8%', top: 54, width: '52%' }}>
      <div style={{ fontFamily: mono, fontSize: 14, color: colors.accent, letterSpacing: '0.2em' }}>
        ACT {shot.act} · {shot.id.toUpperCase()}
      </div>
      <div style={{ fontFamily: serif, fontSize: 30, lineHeight: 1.5, color: colors.paper, marginTop: 14 }}>{labelOf(shot)}</div>
      <div style={{ fontFamily: mono, fontSize: 13, lineHeight: 1.7, color: colors.muted, marginTop: 18 }}>
        {shot.cam.length > 78 ? `${shot.cam.slice(0, 78)}…` : shot.cam}
      </div>
    </div>
    <div style={{ position: 'absolute', right: '8%', bottom: 44, fontFamily: mono, fontSize: 12, color: colors.muted }}>
      {shot.id.toUpperCase()} · {shot.startFrame}–{shot.startFrame + shot.durationFrames}
    </div>
  </BoardFrame>
);
