/* 镜 54 · Act 8 此刻 · 局部帧 [0,180) · 180f
   知识库：257 张 brief 档案卡自上方 cascade 落位，铺成 25×11 的档案墙；
   39 张真实知识卡从墙面升起、沿浅透视缓环绕漂（FN-28 orbit-drift），
   近处卡显示真实卡名，远处只留 K 记与细线；末 20f 墙面向左下收拢出墨点，
   交 S55 衍生树。GR-02；字幕为事实性数字。 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, random, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, orbitDrift, writeFade } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { DustField } from '../components/DustField';
import { PaperGrain } from '../components/PaperGrain';
import { Grade } from '../components/Grade';
import { Caption } from '../components/Caption';

const CLAMP = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const mono = fontFamilies.mono;
const serif = fontFamilies.serif;

const COLS = 25;
const ROWS = 11;
const CARD = { w: 60, h: 38, gx: 6, gy: 4 };
const WALL_W = COLS * (CARD.w + CARD.gx);
const WALL_X = (1920 - WALL_W) / 2;
const WALL_Y = 300;
const BRIEFS = 257;

/* 39 张真实知识卡名（各项目 shadow-docs/knowledge 与 workflow knowledge 的真实卡名） */
const KNOWLEDGE = [
  'design-system', 'animation-system', 'cursor-system', 'homepage-data', 'blog-display',
  'blog-detail', 'blog-code-highlighting', 'content-api', 'music-player', 'guestbook-barrage',
  'guestbook-virtual-scroll', 'about-activity', 'admin-console', 'desktop-app-architecture',
  'desktop-plugin-architecture', 'plugin-architecture', 'editor', 'i18n-locale', 'icon-system',
  'component-standard', 'layout-components', 'footer-design', 'contact-dialog', 'error-pages',
  'first-load-performance', 'pagination', 'post-cover', 'repos-api', 'issue-body-contract',
  'brief-state-commit', 'plan-credential-chain', 'cli-output-contract', 'release-artifact-pipeline',
  'distribution-capability-contract', 'multi-host-plugin-distribution', 'domain-driven-shadow-dev',
  'bug-investigation', 'render-stability-playbook', 'video-production-flow',
] as const;

const CardWall: FC<{ frame: number }> = ({ frame }) => (
  <>
    {Array.from({ length: BRIEFS }).map((_, i) => {
      const col = i % COLS;
      const row = Math.floor(i / COLS);
      const delay = 76 * Math.sqrt(i / (BRIEFS - 1));
      const p = interpolate(frame - delay, [0, 14], [0, 1], { ...CLAMP, easing: CURVES.cineEaseOut });
      const tinted = random('brief-' + i) > 0.82;
      const fade = interpolate(frame, [158, 180], [1, 0.88], CLAMP);
      return (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: WALL_X + col * (CARD.w + CARD.gx),
            top: WALL_Y + row * (CARD.h + CARD.gy),
            width: CARD.w,
            height: CARD.h,
            boxSizing: 'border-box',
            borderRadius: 3,
            background: colors.paperDeep,
            border: `1px solid ${tinted ? colors.seal : colors.paperMuted}`,
            opacity: p * fade * (tinted ? 1 : 0.86),
            transform: `translateY(${(1 - p) * -26}px)`,
            boxShadow: tinted ? `0 0 10px ${colors.seal}22` : undefined,
            padding: '5px 6px',
          }}
        >
          <div style={{ width: '58%', height: 2, background: colors.ink, opacity: 0.32 }} />
          <div style={{ width: '86%', height: 2, background: colors.ink, opacity: 0.18, marginTop: 4 }} />
          <div style={{ width: '70%', height: 2, background: colors.ink, opacity: 0.12, marginTop: 3 }} />
        </div>
      );
    })}
  </>
);

const KnowledgeOrbit: FC<{ frame: number }> = ({ frame }) => {
  const { fps } = useVideoConfig();
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transform: 'perspective(1400px) rotateX(20deg)', transformOrigin: '960px 430px' }}>
      {KNOWLEDGE.map((title, j) => {
        const th = (j / KNOWLEDGE.length) * Math.PI * 2 + (frame * Math.PI * 2) / 720;
        const depth = 0.5 + 0.5 * Math.sin(th);
        const { x, y } = { x: 960 + Math.cos(th) * 660, y: 430 + Math.sin(th) * 150 };
        const rise = spring({ frame: frame - (34 + j * 1.4), fps, config: { damping: 18, stiffness: 90, mass: 0.8 } });
        const settle = interpolate(frame, [150, 180], [1, 0.85], CLAMP);
        const scale = 0.82 + depth * 0.28;
        return (
          <div
            key={title}
            style={{
              position: 'absolute',
              left: x - 48,
              top: y - 62,
              width: 96,
              height: 124,
              boxSizing: 'border-box',
              borderRadius: 4,
              background: colors.paper,
              border: `1px solid ${depth > 0.82 ? colors.seal : colors.paperMuted}`,
              boxShadow: depth > 0.82 ? `0 6px 18px ${colors.ink}29` : `0 3px 10px ${colors.ink}14`,
              opacity: rise * (0.3 + 0.7 * depth) * settle,
              transform: `scale(${scale * (0.94 + rise * 0.06)})`,
              padding: '9px 9px 7px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ width: '100%', height: 2, background: depth > 0.82 ? colors.seal : colors.ink, opacity: depth > 0.82 ? 0.8 : 0.25 }} />
            <div style={{ fontFamily: mono, fontSize: 9, lineHeight: 1.35, letterSpacing: '0.01em', color: colors.ink, opacity: depth > 0.55 ? 0.9 : 0.25, wordBreak: 'break-all' }}>
              {depth > 0.55 ? title : '✦'}
            </div>
            <div style={{ fontFamily: mono, fontSize: 7, letterSpacing: '0.18em', color: colors.muted, opacity: 0.55 }}>KNOWLEDGE</div>
          </div>
        );
      })}
    </div>
  );
};

const ShotKnowledgeBase: FC = () => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 16], [0, 1], { ...CLAMP, easing: CURVES.cineEaseOut });
  const camX = interpolate(frame, [0, 150], [30, -30], { ...CLAMP, easing: CURVES.cineEaseInOut });
  const camScale = interpolate(frame, [0, 180], [1.035, 1], { ...CLAMP, easing: CURVES.cineEaseInOut });
  const dot = interpolate(frame, [158, 178], [0, 1], { ...CLAMP, easing: CURVES.cineEaseIn });
  const num = writeFade(frame, 92);
  const kicker = writeFade(frame, 84);

  return (
    <AbsoluteFill style={{ background: colors.paper }}>
      <CameraRig cam={{ scale: camScale, x: camX, y: 0, rot: 0 }}>
        <AbsoluteFill style={{ opacity: 0.4 + 0.6 * enter, filter: `blur(${(1 - enter) * 4}px)` }}>
          <DustField act={8} seedBase="s54" />
          {/* 页眉 */}
          <div style={{ position: 'absolute', left: 140, top: 92, fontFamily: mono, fontSize: 15, letterSpacing: '0.16em', color: colors.muted, opacity: enter }}>x.wuh.site / shadow-docs</div>
          <div style={{ position: 'absolute', right: 140, top: 92, fontFamily: mono, fontSize: 15, letterSpacing: '0.16em', color: colors.muted, opacity: enter, fontVariantNumeric: 'tabular-nums' }}>knowledge · 2026-10-31</div>
          <CardWall frame={frame} />
          <KnowledgeOrbit frame={frame} />
          {/* 大数字：257 / 39（画面数据，不占字幕） */}
          <div style={{ ...num, position: 'absolute', left: 300, top: 712, fontFamily: serif, fontSize: 92, lineHeight: 1, color: colors.ink, fontVariantNumeric: 'tabular-nums' }}>257</div>
          <div style={{ ...kicker, position: 'absolute', left: 306, top: 812, fontFamily: mono, fontSize: 13, letterSpacing: '0.18em', color: colors.muted }}>BRIEFS ARCHIVED</div>
          <div style={{ ...num, position: 'absolute', right: 300, top: 712, fontFamily: serif, fontSize: 92, lineHeight: 1, color: colors.seal, fontVariantNumeric: 'tabular-nums' }}>39</div>
          <div style={{ ...kicker, position: 'absolute', right: 306, top: 812, fontFamily: mono, fontSize: 13, letterSpacing: '0.18em', color: colors.muted, textAlign: 'right' }}>KNOWLEDGE CARDS</div>
          {/* 收拢墨点（交 S55 生根） */}
          <div style={{ position: 'absolute', left: 294, top: 894 - 14 * dot, width: 12, height: 16, borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%', background: colors.ink, opacity: dot }} />
        </AbsoluteFill>
      </CameraRig>
      <PaperGrain opacity={0.06} />
      <Grade id="GR-02" />
      <Caption text="257 次完整循环，39 张知识卡片。" appearAt={70} />
    </AbsoluteFill>
  );
};

export default ShotKnowledgeBase;
