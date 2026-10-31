import type { FC, ReactNode } from 'react';
import { colors, fontFamilies } from '../../brand/tokens';
import type { AnimaticShot } from './shots-data';

const serif = fontFamilies.serif;
const mono = fontFamilies.mono;

type Kind = 'console' | 'seal' | 'vinyl' | 'heat' | 'photo' | 'bars' | 'orbit' | 'timeline' | 'code' | 'list' | 'quote' | 'text' | 'ink' | 'paper' | 'generic';

/** 画面意图关键词 → 简板类型（先命中先生效；顺序即优先级） */
const KIND_RULES: Array<[Kind, RegExp]> = [
  ['console', /控制台|面板|功能块/],
  ['seal', /钤印|印章|印面|闲章|压印|盖下/],
  ['vinyl', /黑胶|唱片|唱针/],
  ['heat', /热力/],
  ['photo', /照片/],
  ['bars', /纸柱|柱体|柱顶|柱状/],
  ['orbit', /星轨|版本光点|光点/],
  ['timeline', /时间轴|刻度/],
  ['code', /编辑器|代码|终端|光标|提交|键入/],
  ['list', /榜单|列表|文章卡/],
  ['quote', /金句随页|写过的话/],
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

const CONSOLE_TILES = ['首页', '封面', '书架', '音乐', '留言板', '热力图', '设计系统', '页面漫游'];

const ConsoleBoard: FC<{ active: number }> = ({ active }) => (
  <BoardFrame act={6}>
    <div style={{ position: 'absolute', inset: 28, border: `1px solid ${colors.hairline}`, background: colors.terminalBg }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 16px', borderBottom: `1px solid ${colors.hairline}`, fontFamily: mono, fontSize: 14, color: colors.muted, letterSpacing: '0.2em' }}>
        <span>WUH.SITE · FEATURES</span>
        <span>08</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, padding: 18 }}>
        {CONSOLE_TILES.map((label, i) => {
          const lit = i < active;
          const cur = i === Math.max(0, active);
          return (
            <div
              key={label}
              style={{
                height: 148,
                border: `1px solid ${cur ? colors.seal : colors.hairline}`,
                background: cur ? colors.bgLift : 'transparent',
                opacity: cur ? 1 : lit ? 0.75 : 0.45,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: 12,
              }}
            >
              <span style={{ fontFamily: mono, fontSize: 12, color: cur ? colors.accent : colors.muted }}>0{i + 1}</span>
              <span style={{ fontFamily: serif, fontSize: 20, color: colors.paper }}>{label}</span>
              <span style={{ height: 3, width: '60%', background: colors.accent, opacity: lit || cur ? 0.8 : 0 }} />
            </div>
          );
        })}
      </div>
      <div style={{ position: 'absolute', left: '50%', top: '76%', width: 10, height: 10, borderRadius: 5, background: colors.accent, boxShadow: `0 0 14px ${colors.accent}` }} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: '40%', height: 1, background: colors.accent, opacity: 0.12 }} />
    </div>
  </BoardFrame>
);

const QUOTE_SAMPLES = ['人生一世不过 3 万多天，实在是太短了。', '欲望，是最恐怖的东西。', '日不过三餐，夜不过一宿'];

const QuoteBoard: FC = () => (
  <BoardFrame act={3}>
    {[3, 2, 1].map((i) => (
      <div
        key={i}
        style={{ position: 'absolute', left: `${13 + i * 2}%`, top: 66 + i * 14, width: '54%', height: 420, background: colors.paper, opacity: 0.05 + i * 0.03 }}
      />
    ))}
    <div style={{ position: 'absolute', left: '15%', top: 78, width: '54%', height: 420, background: colors.bgLift, border: `1px solid ${colors.hairline}` }}>
      {QUOTE_SAMPLES.map((q, i) => (
        <div key={q} style={{ position: 'absolute', left: 26, top: 64 + i * 96, fontFamily: serif, fontSize: 25, color: colors.paper, opacity: 0.72 - i * 0.17 }}>
          {q}
        </div>
      ))}
      <div style={{ position: 'absolute', left: 26, bottom: 26, fontFamily: mono, fontSize: 12, color: colors.muted, letterSpacing: '0.18em' }}>1 / 5</div>
    </div>
    <div style={{ position: 'absolute', right: '11%', top: '34%', textAlign: 'right' }}>
      <div style={{ fontFamily: serif, fontSize: 104, lineHeight: 1, color: colors.paper, opacity: 0.88 }}>89</div>
      <div style={{ fontFamily: mono, fontSize: 15, color: colors.muted, letterSpacing: '0.1em', marginTop: 10 }}>篇 · 2023 30 / 2024 59</div>
    </div>
  </BoardFrame>
);

const labelOf = (shot: AnimaticShot): string => {
  const head = shot.visual.split('。')[0] ?? shot.visual;
  return head.length > 18 ? `${head.slice(0, 18)}…` : head;
};

export const ShotBoard: FC<{ shot: AnimaticShot }> = ({ shot }) => {
  switch (boardKindOf(shot)) {
    case 'console':
      return <ConsoleBoard active={shot.n - 35} />;
    case 'ink':
      return <InkBoard />;
    case 'quote':
      return <QuoteBoard />;
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
