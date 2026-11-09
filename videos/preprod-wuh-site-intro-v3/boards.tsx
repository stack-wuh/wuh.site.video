import type { FC, ReactNode } from 'react';
import { Img, staticFile } from 'remotion';
import { colors, fontFamilies } from '../../brand/tokens';
import type { AnimaticShot } from './shots-data';

const serif = fontFamilies.serif;
const mono = fontFamilies.mono;

/** 登记表编号 → public 渲染引用件（与 asset-registry.md 同源；∅ 项不进本表） */
const REG_FILE: Record<string, string> = {
  S01: 'wuh-site-intro-v3/site/s01-home-hero-v1.png',
  S02: 'wuh-site-intro-v3/site/s02-home-timeline-v1.png',
  S03: 'wuh-site-intro-v3/site/s03-post-165-v1.png',
  S04: 'wuh-site-intro-v3/site/s04-weread-v1.png',
  S05: 'wuh-site-intro-v3/site/s05-music-v1.png',
  S06: 'wuh-site-intro-v3/site/s06-guestbook-v1.png',
  S07: 'wuh-site-intro-v3/site/s07-about-barrage-v1.png',
  S08: 'wuh-site-intro-v3/site/s08-about-heatmap-v1.png',
  S09: 'wuh-site-intro-v3/site/s09-footprint-v1.png',
  S10: 'wuh-site-intro-v3/site/s10-design-color-v1.png',
  S11: 'wuh-site-intro-v3/site/s11-topics-v1.png',
  S12: 'wuh-site-intro-v3/site/s12-about-recent-v1.png',
  'p-hero-wordmark': 'wuh-site-intro-v3/site/p-hero-wordmark-v1.png',
  'p-heatmap-crop': 'wuh-site-intro-v3/site/p-heatmap-crop-v1.png',
  'p-post-cover-165': 'wuh-site-intro-v3/site/p-post-cover-165-v1.png',
  'p-music-player': 'wuh-site-intro-v3/site/p-music-player-v1.png',
  'p-init-commit': 'wuh-site-intro-v3/site/gh01-init-commit-v1.png',
  'p-issues-cms': 'wuh-site-intro-v3/site/gh02-issues-blog-v1.png',
};

export const boardAssetOf = (shot: AnimaticShot): string | null => {
  const code = shot.environmentId ?? shot.firstFrameAsset;
  return code && REG_FILE[code] ? REG_FILE[code] : shot.firstFrameAsset && REG_FILE[shot.firstFrameAsset] ? REG_FILE[shot.firstFrameAsset] : null;
};

type Kind = 'seal' | 'count' | 'ink' | 'generic';

/** 纯 Remotion 镜的画面意图关键词 → 简板母题（真实截图镜不走此处） */
const KIND_RULES: Array<[Kind, RegExp]> = [
  ['seal', /印|落款|钤|题记|金句|坐忘歌/],
  ['count', /滚|计数|数字|版本雨|热力|曲线|榜单|档案|知识卡|书墙|脚注/],
  ['ink', /墨点|墨|提交|灯|白闪|火星|雨/],
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
  <svg width={520} height={560} viewBox="0 0 520 560" style={{ position: 'absolute', right: 0, top: 0, opacity: 0.9 }}>
    {children}
  </svg>
);

/** 印章/题记：朱印方章 + 衬线行 */
const SealMotif: FC = () => (
  <MotifSvg>
    <rect x={210} y={190} width={140} height={140} fill="none" stroke={colors.gold} strokeWidth={3} opacity={0.75} />
    <line x1={240} y1={240} x2={320} y2={240} stroke={colors.gold} strokeWidth={2.4} opacity={0.6} />
    <line x1={240} y1={280} x2={320} y2={280} stroke={colors.gold} strokeWidth={2.4} opacity={0.6} />
    <line x1={130} y1={400} x2={430} y2={400} stroke={colors.paper} strokeWidth={0.8} opacity={0.3} />
    <line x1={160} y1={430} x2={400} y2={430} stroke={colors.paper} strokeWidth={0.8} opacity={0.22} />
  </MotifSvg>
);

/** 数据镜：柱格 + 大数字占位 */
const CountMotif: FC = () => (
  <MotifSvg>
    {[340, 300, 260, 220].map((h, i) => (
      <rect key={i} x={150 + i * 70} y={420 - h} width={44} height={h} fill={colors.paper} opacity={0.18 + i * 0.08} />
    ))}
    <text x={360} y={180} textAnchor="middle" fontFamily={mono} fontSize={72} fill={colors.gold} opacity={0.6}>
      0→N
    </text>
  </MotifSvg>
);

/** 墨点母题：一滴 + 涟漪 */
const InkMotif: FC = () => (
  <MotifSvg>
    <circle cx={280} cy={280} r={16} fill={colors.paper} opacity={0.6} />
    <circle cx={280} cy={280} r={44} fill="none" stroke={colors.paper} strokeWidth={1.2} opacity={0.35} />
    <circle cx={280} cy={280} r={78} fill="none" stroke={colors.paper} strokeWidth={0.8} opacity={0.2} />
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
    case 'seal':
      return <SealMotif />;
    case 'count':
      return <CountMotif />;
    case 'ink':
      return <InkMotif />;
    default:
      return <GenericMotif />;
  }
};

/** 真实素材镜：截图简板（降饱和压亮保持 animatic 质感）+ 窗框 + 来源编号 */
const ScreenshotBoard: FC<{ shot: AnimaticShot; file: string }> = ({ shot, file }) => {
  const isP = !shot.environmentId && shot.firstFrameAsset !== null;
  const code = shot.environmentId ?? shot.firstFrameAsset ?? '';
  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: isP ? 340 : 60,
          top: isP ? 90 : 40,
          width: isP ? 460 : 1000,
          height: isP ? 380 : 480,
          border: `1px solid ${colors.hairline}`,
          overflow: 'hidden',
          background: colors.bg,
        }}
      >
        <Img
          src={staticFile(file)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: isP ? 'contain' : 'cover',
            filter: 'grayscale(0.82) brightness(0.72) contrast(0.96)',
            opacity: 0.9,
          }}
        />
        <div style={{ position: 'absolute', inset: 0, background: tintOf(shot.act), opacity: 0.18 }} />
      </div>
      <div
        style={{
          position: 'absolute',
          right: 28,
          top: 24,
          fontFamily: mono,
          fontSize: 12,
          color: colors.gold,
          border: `1px solid ${colors.gold}`,
          padding: '3px 10px',
          opacity: 0.85,
          letterSpacing: '0.14em',
        }}
      >
        真实素材 {code}
      </div>
    </>
  );
};

const labelOf = (shot: AnimaticShot): string => {
  const head = shot.visual.split('。')[0] ?? shot.visual;
  return head.length > 46 ? `${head.slice(0, 46)}…` : head;
};

export const ShotBoard: FC<{ shot: AnimaticShot }> = ({ shot }) => {
  const asset = boardAssetOf(shot);
  return (
    <BoardFrame act={shot.act}>
      {asset ? <ScreenshotBoard shot={shot} file={asset} /> : <Motif kind={boardKindOf(shot)} />}
      <div style={{ position: 'absolute', left: '6%', top: 44, width: asset && !shot.environmentId ? 260 : '52%' }}>
        <div style={{ fontFamily: mono, fontSize: 14, color: colors.accent, letterSpacing: '0.2em' }}>
          ACT {shot.act} · {shot.id.toUpperCase()}
        </div>
        <div style={{ fontFamily: serif, fontSize: 26, lineHeight: 1.5, color: colors.paper, marginTop: 12 }}>{labelOf(shot)}</div>
        {!asset && (
          <div style={{ fontFamily: mono, fontSize: 13, lineHeight: 1.7, color: colors.muted, marginTop: 16 }}>
            {shot.cam.length > 78 ? `${shot.cam.slice(0, 78)}…` : shot.cam}
          </div>
        )}
      </div>
      <div style={{ position: 'absolute', right: '6%', bottom: 36, fontFamily: mono, fontSize: 12, color: colors.muted }}>
        {shot.id.toUpperCase()} · {shot.startFrame}–{shot.startFrame + shot.durationFrames} · {shot.transition}
      </div>
    </BoardFrame>
  );
};
