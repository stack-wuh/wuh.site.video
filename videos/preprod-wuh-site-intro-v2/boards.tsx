import type { FC, ReactNode } from 'react';
import { colors, fontFamilies } from '../../brand/tokens';
import type { AnimaticShot } from './shots-data';

const serif = fontFamilies.serif;
const mono = fontFamilies.mono;

type Kind = 'seal' | 'vinyl' | 'heat' | 'photo' | 'bars' | 'orbit' | 'timeline' | 'code' | 'list' | 'text' | 'ink' | 'paper' | 'generic';

/** 画面意图关键词 → 简板类型（先命中先生效；顺序即优先级） */
const KIND_RULES: Array<[Kind, RegExp]> = [
  ['seal', /钤印|印章|印面|闲章|压印|盖下/],
  ['vinyl', /黑胶|唱片|唱针/],
  ['heat', /热力/],
  ['photo', /照片/],
  ['bars', /纸柱|柱体|柱顶|柱状/],
  ['orbit', /星轨|版本光点|光点/],
  ['timeline', /时间轴|刻度/],
  ['code', /编辑器|代码|终端|光标|提交|键入/],
  ['list', /榜单|列表|文章卡/],
  ['text', /题记|金句/],
  ['ink', /墨点|墨滴|一滴墨/],
  ['paper', /纸页|纸卡|纸山|纸笺|纸面|纸缘|信纸|纸/],
];

export const boardKindOf = (shot: AnimaticShot): Kind => {
  for (const [kind, re] of KIND_RULES) if (re.test(shot.visual)) return kind;
  return 'generic';
};

const TINT: Record<number, string> = {
  1: colors.bgLift,
  2: colors.terminalBg,
  3: colors.bgLift,
  4: colors.bg,
  5: colors.bgLift,
  6: colors.terminalBg,
  7: colors.bgLift,
};

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
    <div style={{ position: 'absolute', inset: 0, background: TINT[act] ?? colors.bgLift, opacity: 0.35 }} />
    {children}
  </div>
);

const Line: FC<{ top: number; left?: string; width: string; height?: number; color?: string; opacity?: number }> = ({
  top,
  left = '12%',
  width,
  height = 16,
  color = colors.paper,
  opacity = 0.42,
}) => <div style={{ position: 'absolute', left, top, width, height, background: color, opacity }} />;

const InkBoard: FC = () => (
  <BoardFrame act={1}>
    <div style={{ position: 'absolute', left: '50%', top: '46%', width: 18, height: 18, borderRadius: 9, background: colors.accent, transform: 'translate(-50%, -50%)' }} />
    {[120, 200, 290].map((d, i) => (
      <div
        key={d}
        style={{
          position: 'absolute',
          left: '50%',
          top: '46%',
          width: d,
          height: d,
          borderRadius: '50%',
          border: `1px solid ${colors.accent}`,
          opacity: 0.35 - i * 0.09,
          transform: 'translate(-50%, -50%)',
        }}
      />
    ))}
    <Line top={430} left="38%" width="24%" height={2} color={colors.muted} opacity={0.5} />
  </BoardFrame>
);

const TextBoard: FC = () => (
  <BoardFrame act={2}>
    {[0, 1, 2, 3].map((i) => (
      <Line key={i} top={170 + i * 64} left="14%" width={`${70 - i * 10}%`} height={20} opacity={0.5 - i * 0.07} />
    ))}
    <div style={{ position: 'absolute', right: '14%', bottom: 96, width: 30, height: 30, background: colors.seal, opacity: 0.85 }} />
  </BoardFrame>
);

const PaperBoard: FC = () => (
  <BoardFrame act={3}>
    <div style={{ position: 'absolute', left: '18%', top: 90, width: '64%', height: 380, background: colors.paper, opacity: 0.14 }} />
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <Line key={i} top={140 + i * 52} left="24%" width={`${52 - (i % 3) * 8}%`} height={12} opacity={0.34} />
    ))}
  </BoardFrame>
);

const CodeBoard: FC = () => (
  <BoardFrame act={3}>
    <div style={{ position: 'absolute', left: '14%', top: 110, width: '72%', height: 340, background: colors.terminalBg, border: `1px solid ${colors.hairline}` }}>
      <div style={{ display: 'flex', gap: 8, padding: '14px 18px', borderBottom: `1px solid ${colors.hairline}` }}>
        {[colors.seal, colors.accent, colors.paperMuted].map((c) => (
          <div key={c} style={{ width: 10, height: 10, borderRadius: 5, background: c, opacity: 0.8 }} />
        ))}
      </div>
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <Line key={i} top={66 + i * 34} left="8%" width={`${58 - (i % 4) * 9}%`} height={9} color={colors.terminalText} opacity={0.4} />
      ))}
    </div>
  </BoardFrame>
);

const TimelineBoard: FC<{ act: number }> = ({ act }) => (
  <BoardFrame act={act}>
    <div style={{ position: 'absolute', left: '10%', right: '10%', top: '52%', height: 2, background: colors.muted, opacity: 0.45 }} />
    {Array.from({ length: 14 }).map((_, i) => (
      <div
        key={i}
        style={{
          position: 'absolute',
          left: `${12 + i * 5.6}%`,
          top: '52%',
          width: i % 4 === 0 ? 14 : 8,
          height: i % 4 === 0 ? 14 : 8,
          borderRadius: 7,
          background: i % 4 === 0 ? colors.accent : colors.paper,
          opacity: i % 4 === 0 ? 0.9 : 0.4,
          transform: 'translate(-50%, -50%)',
        }}
      />
    ))}
  </BoardFrame>
);

const BarsBoard: FC = () => (
  <BoardFrame act={5}>
    {[0.9, 0.55, 0.72, 0.45, 0.8, 0.62].map((h, i) => (
      <div
        key={i}
        style={{
          position: 'absolute',
          left: `${14 + i * 12}%`,
          bottom: 96,
          width: '7%',
          height: `${h * 300}px`,
          background: colors.paper,
          opacity: 0.28 + i * 0.05,
        }}
      />
    ))}
    <Line top={470} left="12%" width="76%" height={2} color={colors.muted} opacity={0.5} />
  </BoardFrame>
);

const HeatBoard: FC = () => (
  <BoardFrame act={7}>
    {Array.from({ length: 16 * 8 }).map((_, i) => {
      const x = i % 16;
      const y = Math.floor(i / 16);
      const lit = Math.sin(i * 1.7) > 0.2;
      return (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: 110 + x * 56,
            top: 90 + y * 46,
            width: 34,
            height: 28,
            borderRadius: 3,
            background: lit ? colors.accent : colors.paperMuted,
            opacity: lit ? 0.35 + 0.3 * Math.abs(Math.sin(i)) : 0.1,
          }}
        />
      );
    })}
  </BoardFrame>
);

const PhotoBoard: FC = () => (
  <BoardFrame act={4}>
    <div style={{ position: 'absolute', left: '26%', top: 90, width: '48%', height: 380, background: colors.paper, opacity: 0.12 }} />
    <div
      style={{
        position: 'absolute',
        left: '38%',
        top: 170,
        width: 0,
        height: 0,
        borderLeft: '110px solid transparent',
        borderRight: '110px solid transparent',
        borderBottom: `120px solid ${colors.muted}`,
        opacity: 0.45,
      }}
    />
    <Line top={300} left="32%" width="36%" height={2} color={colors.muted} opacity={0.6} />
    <Line top={420} left="32%" width="24%" height={10} color={colors.muted} opacity={0.5} />
  </BoardFrame>
);

const VinylBoard: FC = () => (
  <BoardFrame act={7}>
    <div style={{ position: 'absolute', left: '50%', top: '48%', width: 340, height: 340, borderRadius: '50%', border: `2px solid ${colors.muted}`, opacity: 0.6, transform: 'translate(-50%, -50%)' }} />
    <div style={{ position: 'absolute', left: '50%', top: '48%', width: 110, height: 110, borderRadius: '50%', border: `1px solid ${colors.accent}`, opacity: 0.55, transform: 'translate(-50%, -50%)' }} />
    <div style={{ position: 'absolute', left: '50%', top: '48%', width: 10, height: 10, borderRadius: 5, background: colors.accent, transform: 'translate(-50%, -50%)' }} />
    <div style={{ position: 'absolute', left: '68%', top: '26%', width: 2, height: 190, background: colors.paper, opacity: 0.45, transform: 'rotate(18deg)', transformOrigin: 'top center' }} />
  </BoardFrame>
);

const OrbitBoard: FC = () => (
  <BoardFrame act={7}>
    <div style={{ position: 'absolute', left: '50%', top: '50%', width: 300, height: 300, borderRadius: '50%', border: `1px solid ${colors.accent}`, opacity: 0.4, transform: 'translate(-50%, -50%)' }} />
    {Array.from({ length: 12 }).map((_, i) => {
      const a = (i * 30 * Math.PI) / 180;
      return (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `calc(50% + ${Math.cos(a) * 150}px)`,
            top: `calc(50% + ${Math.sin(a) * 150}px)`,
            width: 8,
            height: 8,
            borderRadius: 4,
            background: i % 3 === 0 ? colors.accent : colors.paper,
            opacity: 0.7,
            transform: 'translate(-50%, -50%)',
          }}
        />
      );
    })}
  </BoardFrame>
);

const SealBoard: FC = () => (
  <BoardFrame act={2}>
    <div style={{ position: 'absolute', left: '50%', top: '48%', width: 170, height: 170, border: `4px solid ${colors.seal}`, opacity: 0.85, transform: 'translate(-50%, -50%)' }} />
    {[0, 1, 2, 3].map((i) => (
      <Line key={i} top={210 + i * 34} left="42%" width="18%" height={10} color={colors.seal} opacity={0.55} />
    ))}
  </BoardFrame>
);

const ListBoard: FC = () => (
  <BoardFrame act={6}>
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} style={{ position: 'absolute', left: '14%', right: '14%', top: 100 + i * 62, display: 'flex', alignItems: 'center', gap: 18 }}>
        <div style={{ width: 28, height: 28, background: i === 0 ? colors.accent : colors.paper, opacity: i === 0 ? 0.85 : 0.35, fontFamily: mono, fontSize: 16, color: colors.bg, textAlign: 'center', lineHeight: '28px' }}>
          {i + 1}
        </div>
        <div style={{ flex: 1, height: 12, background: colors.paper, opacity: i === 0 ? 0.55 : 0.3 }} />
      </div>
    ))}
  </BoardFrame>
);

const GenericBoard: FC<{ label: string }> = ({ label }) => (
  <BoardFrame act={7}>
    <div style={{ position: 'absolute', left: '12%', top: 110, fontFamily: serif, fontSize: 44, color: colors.paper, opacity: 0.8 }}>{label}</div>
    {[0, 1, 2].map((i) => (
      <Line key={i} top={230 + i * 54} left="12%" width={`${58 - i * 12}%`} height={14} opacity={0.32 - i * 0.06} />
    ))}
  </BoardFrame>
);

const labelOf = (shot: AnimaticShot): string => {
  const head = shot.visual.split('。')[0] ?? shot.visual;
  return head.length > 18 ? `${head.slice(0, 18)}…` : head;
};

export const ShotBoard: FC<{ shot: AnimaticShot }> = ({ shot }) => {
  switch (boardKindOf(shot)) {
    case 'ink':
      return <InkBoard />;
    case 'text':
      return <TextBoard />;
    case 'paper':
      return <PaperBoard />;
    case 'code':
      return <CodeBoard />;
    case 'timeline':
      return <TimelineBoard act={shot.act} />;
    case 'bars':
      return <BarsBoard />;
    case 'heat':
      return <HeatBoard />;
    case 'photo':
      return <PhotoBoard />;
    case 'vinyl':
      return <VinylBoard />;
    case 'orbit':
      return <OrbitBoard />;
    case 'seal':
      return <SealBoard />;
    case 'list':
      return <ListBoard />;
    default:
      return <GenericBoard label={labelOf(shot)} />;
  }
};
