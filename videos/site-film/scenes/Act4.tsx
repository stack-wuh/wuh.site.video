import type { FC } from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import {
  ANCHORS,
  CURVES,
  GRADES,
  SPRINGS,
  WHITE_FLASH,
  eqBars,
  glowPulse,
  inkRise,
  numRoll,
  paperBreathe,
  sealStamp,
  sealTilt,
  writeFade,
  SEAL_RED,
} from '../motion-tokens';
import { CameraRig, ParallaxLayer } from '../components/CameraRig';
import type { CamState } from '../components/CameraRig';
import { DustField } from './Act1';

const serif = fontFamilies.serif;
const sans = fontFamilies.sans;
const mono = fontFamilies.mono;
const RED = SEAL_RED; // 红晕（约束允许的例外色）

const fade = (f: number, at: number) =>
  interpolate(f, [at, at + 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

/* 镜 16（本地 0–120）首页全景：cam-crane 纵向下移巡阅，板块 ink-rise 依次入画，tr-cursor-lead 光标牵引收尾 */
const REPOS: Array<[string, string, number]> = [
  ['wuh.site', 'TypeScript', 128],
  ['ink-flow', 'Rust', 64],
  ['shadow-workflow', 'Go', 96],
];

const ShotHome: FC = () => {
  const frame = useCurrentFrame();
  const cam: CamState = {
    scale: 1.06,
    x: 0,
    y: interpolate(frame, [0, 120], [-70, 60], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }),
    rot: 0,
  };
  // tr-cursor-lead：光标沿路径滑向时间轴首点（100–115），落点亮起 glow-pulse 一记
  const lead = interpolate(frame, [100, 115], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const curX = interpolate(lead, [0, 1], [760, 496]);
  const curY = interpolate(lead, [0, 1], [320, 470]);
  const dotGlow = glowPulse(frame - 108, 1, 60).opacity ?? 1;
  return (
    <AbsoluteFill>
      <CameraRig cam={cam}>
        <ParallaxLayer depth={0.5} cam={cam} blurBase={2}>
          <DustField act={4} count={22} />
        </ParallaxLayer>
        <ParallaxLayer depth={1} cam={cam}>
          <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ width: 940 }}>
              <h1 style={{ ...inkRise(frame, 2), fontFamily: serif, fontSize: 64, color: colors.paper, margin: 0 }}>wuh.site · 朝朝如念</h1>
              <div style={{ ...writeFade(frame, 14), display: 'flex', alignItems: 'center', gap: 18, margin: '26px 0' }}>
                <div style={{ height: 1, flex: 1, background: colors.hairline }} />
                <div style={{ width: 12, height: 12, background: colors.accent, transform: 'rotate(45deg)' }} />
                <div style={{ height: 1, flex: 1, background: colors.hairline }} />
              </div>
              {/* 墨点时间轴（首枚点位亮） */}
              <div style={{ position: 'relative', height: 12, marginTop: 10 }}>
                <div style={{ position: 'absolute', top: 5, left: 0, right: 0, height: 1, background: colors.hairline }} />
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} style={{ position: 'absolute', left: 4 + i * 46, top: i === 0 ? 1 : 2, width: i === 0 ? 10 : 8, height: i === 0 ? 10 : 8, borderRadius: 5, background: i === 0 ? colors.accent : colors.muted, opacity: fade(frame, 20 + i * 4) * (i === 0 ? dotGlow : 1) }} />
                ))}
              </div>
              {/* 精选项目卡（仓库名 + 语言 + ☆N） */}
              <div style={{ display: 'flex', gap: 22, marginTop: 38 }}>
                {REPOS.map(([name, lang, star], i) => (
                  <div key={name} style={{ ...inkRise(frame, 30 + i * 12), flex: 1, background: colors.bgLift, border: `1px solid ${colors.hairline}`, borderRadius: 12, padding: '20px 24px' }}>
                    <p style={{ fontFamily: mono, fontSize: 20, color: colors.paper, margin: 0 }}>{name}</p>
                    <p style={{ fontFamily: mono, fontSize: 15, color: colors.muted, marginTop: 12 }}>
                      <span style={{ color: colors.accent }}>●</span> {lang}　☆ {star}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </AbsoluteFill>
        </ParallaxLayer>
      </CameraRig>
      <div style={{ position: 'absolute', left: curX, top: curY, width: 14, height: 14, borderRadius: 7, background: colors.accent, boxShadow: `0 0 18px ${colors.accent}`, opacity: fade(frame, 96) }} />
      <p style={{ position: 'absolute', bottom: 110, width: '100%', textAlign: 'center', fontFamily: serif, fontSize: 34, color: colors.paper, opacity: fade(frame, 46) }}>一座用代码写成的小院</p>
      <p style={{ position: 'absolute', bottom: 72, width: '100%', textAlign: 'center', fontFamily: sans, fontSize: 18, color: colors.accent, letterSpacing: '0.2em', opacity: fade(frame, 60) }}>开源是一种信仰</p>
    </AbsoluteFill>
  );
};

/* 镜 17（120–230）墨点时间轴 hover：hover-dye 染色左移 + cam-truck 跟光标，出场 tr-item-zoom 条目放大接镜 */
const POSTS: Array<[string, string, string]> = [
  ['重启计划', '随笔', '1,673 浏览'],
  ['再读〈坐忘歌〉', '诗', '1,204 浏览'],
  ['上班下班', '生活', '986 浏览'],
  ['欲望，是最恐怖的东西', '随想', '852 浏览'],
  ['人生一世', '随想', '733 浏览'],
];

const ShotTimeline: FC = () => {
  const frame = useCurrentFrame();
  const f = frame - 120; // 0–110
  const hover = Math.min(POSTS.length - 1, Math.max(0, Math.floor((f - 4) / 16)));
  // tr-item-zoom（f 85–110）：被选条目 scale 1→2.4（cine-ease-in），周边 blur 退散
  const zoomP = interpolate(f, [85, 110], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseIn });
  const truck = interpolate(f, [0, 85], [40, -30], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', transform: `translateX(${truck}px)` }}>
      <div style={{ width: 860 }}>
        {POSTS.map(([title, tag, views], i) => {
          const visited = i <= hover;
          const isHover = i === hover;
          return (
            <div key={title} style={{
              display: 'flex', alignItems: 'center', gap: 20, margin: '18px 0',
              opacity: (isHover ? 1 : visited ? 0.75 : 0.45) * fade(f, 2 + i * 4) * (1 - zoomP * (isHover ? 0 : 0.9)),
              filter: !isHover && zoomP > 0 ? `blur(${zoomP * 3}px)` : undefined,
              transform: `translateX(${isHover ? -6 : 0}px) scale(${isHover ? 1 + zoomP * 1.4 : 1})`,
              transformOrigin: 'left center',
            }}>
              <div style={{ width: 9, height: 9, borderRadius: 5, background: isHover ? colors.accent : colors.muted, flexShrink: 0 }} />
              <span style={{ fontFamily: serif, fontSize: isHover ? 30 : 26, color: isHover ? colors.accent : visited ? colors.paper : colors.muted }}>{title}</span>
              <span style={{ fontFamily: mono, fontSize: 14, color: isHover ? colors.accent : colors.muted, border: `1px solid ${isHover ? colors.accent : colors.hairline}`, borderRadius: 10, padding: '2px 10px' }}>{tag}</span>
              <span style={{ fontFamily: mono, fontSize: 15, color: colors.muted, marginLeft: 'auto' }}>{views}</span>
            </div>
          );
        })}
        <p style={{ fontFamily: serif, fontSize: 32, color: colors.paper, marginTop: 34, opacity: fade(f, 20) * (1 - zoomP) }}>46 篇文章，一枚枚墨点</p>
      </div>
    </AbsoluteFill>
  );
};

/* 镜 18（230–320）微信读书书架：骨架 shimmer-sweep 横扫（36f）→ 书封 flip-reveal 落架（cascade step 3f），出场 tr-flip-swap 翻转换景 */
const ShotShelf: FC = () => {
  const frame = useCurrentFrame();
  const f = frame - 230; // 0–90
  const shimmerX = interpolate(f, [0, 36], [-400, 1000], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const truck = interpolate(f, [0, 90], [-36, 36], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const swapP = interpolate(f, [70, 90], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', transform: `translateX(${truck}px)` }}>
      <div style={{ position: 'relative', width: 900 }}>
        {/* 骨架屏 + shimmer 扫光 */}
        <div style={{ position: 'absolute', left: 0, top: 10, width: '100%', height: 54, display: 'flex', gap: 12, opacity: Math.max(0, 1 - f / 30) }}>
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} style={{ width: 36, height: 54, borderRadius: 4, background: colors.paperMuted, opacity: 0.18 }} />
          ))}
        </div>
        <div style={{ position: 'absolute', left: shimmerX - 120, top: 0, width: 240, height: 74, background: `linear-gradient(90deg, transparent, ${colors.paper}, transparent)`, opacity: 0.16, mixBlendMode: 'screen' }} />
        {/* 书封落架（flip-reveal，step 3f）+ 阅读状态 */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', perspective: 1200, position: 'relative' }}>
          {Array.from({ length: 20 }).map((_, i) => {
            const flip = spring({ frame: f - (26 + i * 3), fps: 30, config: SPRINGS.heavyGlide });
            const status = i % 4 === 1 ? '阅读中' : i % 4 === 3 ? '已读完' : null;
            const swapping = i === 12 ? swapP : 0;
            return (
              <div key={i} style={{ position: 'relative' }}>
                <div style={{ width: 36, height: 54, borderRadius: 4, background: i % 3 === 0 ? colors.accent : i % 3 === 1 ? colors.paperDeep : colors.paperMuted, opacity: flip * 0.9, transform: `rotateY(${(1 - flip) * 90 + swapping * 90}deg) translateY(${(1 - flip) * -14}px)`, transformOrigin: 'left center', boxShadow: `0 6px 14px ${colors.bg}` }} />
                {status ? (
                  <span style={{ position: 'absolute', left: '50%', bottom: -22, transform: 'translateX(-50%)', fontFamily: mono, fontSize: 11, whiteSpace: 'nowrap', color: status === '阅读中' ? colors.accent : colors.muted, opacity: flip }}>{status}</span>
                ) : null}
              </div>
            );
          })}
        </div>
        <div style={{ height: 2, background: colors.hairline, marginTop: 2 }} />
        <p style={{ fontFamily: serif, fontSize: 32, color: colors.paper, marginTop: 48, opacity: fade(f, 40) * (1 - swapP) }}>读过的书，都站在这里</p>
      </div>
    </AbsoluteFill>
  );
};

/* 镜 19（320–460）生成式封面：画中画缓推 cam-dolly-in，双曲线 path-draw 生长 + 大标题 ink-rise + bloom-glow，出场 tr-page-curl 封面向左翻卷 */
const ShotCover: FC = () => {
  const frame = useCurrentFrame();
  const f = frame - 320; // 0–140
  const dolly = interpolate(f, [0, 140], [1, 1.14], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const draw = (delay: number) =>
    interpolate(f - delay, [0, 70], [1400, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const curl = interpolate(f, [110, 140], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const glow = 0.22 + 0.1 * Math.sin(f / 20);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', transform: `scale(${dolly})` }}>
      <div style={{ position: 'relative', perspective: 1400 }}>
        {/* bloom-glow 底光 */}
        <div style={{ position: 'absolute', inset: -40, borderRadius: 24, background: colors.accent, filter: 'blur(46px)', opacity: glow, mixBlendMode: 'screen' }} />
        <div style={{ position: 'relative', width: 880, height: 420, borderRadius: 14, background: colors.bgLift, border: `1px solid ${colors.hairline}`, transformOrigin: 'left center', transform: `rotateY(${-curl * 90}deg)`, overflow: 'hidden' }}>
          <svg width="880" height="420" viewBox="0 0 880 420">
            <path d="M40,300 C200,230 340,340 480,262 C620,186 740,320 840,250" fill="none" stroke={colors.accent} strokeWidth={2.5} strokeDasharray={1400} strokeDashoffset={draw(4)} opacity={0.85} />
            <path d="M40,352 C220,290 380,392 540,330 C680,278 780,364 840,318" fill="none" stroke={colors.accent} strokeWidth={2} strokeDasharray={1400} strokeDashoffset={draw(40)} opacity={0.5} />
          </svg>
          <p style={{ position: 'absolute', top: 64, width: '100%', textAlign: 'center', fontFamily: serif, fontSize: 44, color: colors.paper, margin: 0, ...inkRise(f, 26) }}>重启计划</p>
          <p style={{ position: 'absolute', right: 28, bottom: 20, fontFamily: mono, fontSize: 16, color: colors.accent, margin: 0, opacity: fade(f, 60), transform: `rotate(${sealTilt('cover-seal')}deg)` }}>wuh.site</p>
          {/* 卷边阴影位移（page-curl 等效） */}
          <div style={{ position: 'absolute', top: 0, bottom: 0, right: 0, width: 260, background: `linear-gradient(90deg, transparent, ${colors.bg})`, opacity: curl, transform: `translateX(${curl * 40}px)` }} />
        </div>
      </div>
      <p style={{ position: 'absolute', bottom: 116, width: '100%', textAlign: 'center', fontFamily: serif, fontSize: 32, color: colors.paper, opacity: fade(f, 30) * (1 - curl) }}>每一篇，都有一幅只属于它的山水</p>
    </AbsoluteFill>
  );
};

/* 镜 20（460–580）目录纸卷：TOC active 居中点亮（glow-pulse）+ 文首标签 seal-tilt 藏印微旋 + cam-crane 纵移，出场 tr-scroll-bleed 冲出下缘 */
const ShotToc: FC = () => {
  const frame = useCurrentFrame();
  const f = frame - 460; // 0–120
  const active = Math.min(5, Math.max(0, Math.floor((f - 6) / 16)));
  const crane = interpolate(f, [0, 100], [26, -26], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const bleed = interpolate(f, [105, 120], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseIn });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', transform: `translateY(${crane + bleed * bleed * 900}px)` }}>
      <div style={{ display: 'flex', gap: 70, alignItems: 'center' }}>
        <div>
          {Array.from({ length: 6 }).map((_, i) => (
            <p key={i} style={{ fontFamily: sans, fontSize: i === active ? 28 : 21, color: i === active ? colors.accent : colors.muted, margin: '16px 0', transform: `translateX(${i === active ? 14 : 0}px)`, opacity: (i === active ? glowPulse(f, 1, 60).opacity ?? 1 : 0.8) * fade(f, 4) }}>
              {String(i + 1).padStart(2, '0')} · 章节标题
            </p>
          ))}
        </div>
        <div style={{ position: 'relative', width: 400, borderRadius: 12, background: colors.paperDeep, padding: '30px 34px', ...paperBreathe(frame) }}>
          {/* 文首标签藏印（seal-tilt ±1.6°） */}
          <div style={{ position: 'absolute', left: -14, top: -14, width: 22, height: 22, background: colors.accent, transform: `rotate(${sealTilt('toc-tag')}deg)`, opacity: fade(f, 8) }} />
          <p style={{ fontFamily: serif, fontSize: 22, color: colors.ink, margin: 0 }}>第 12 / 46 篇 · 约 8 分钟读</p>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} style={{ height: 9, width: `${92 - i * 14}%`, background: colors.ink, opacity: 0.16 + fade(f, 14 + i * 8) * 0.14, borderRadius: 4, marginTop: 14 }} />
          ))}
        </div>
      </div>
      <p style={{ position: 'absolute', bottom: 96, width: '100%', textAlign: 'center', fontFamily: serif, fontSize: 32, color: colors.paper, opacity: fade(f, 26) }}>目录如纸卷，随呼吸展开</p>
    </AbsoluteFill>
  );
};

/* 镜 21（580–680）点赞急推：6 圆钮 cascade（580–620），cam-rush 3440→3460 ×1.9（ANCHORS.rush21，cine-ease-in），
   3460 气泡 spring-pop + num-roll「已赞 N」，红心起光；出场 tr-heart-zoom 短变体（660–680） */
const ShotLike: FC = () => {
  const frame = useCurrentFrame();
  const f = frame - 580; // 0–100
  const rushFrom = ANCHORS.rush21.from - ANCHORS.act4;
  const rushTo = ANCHORS.rush21.to - ANCHORS.act4;
  const rush = interpolate(f, [rushFrom, rushTo], [1, ANCHORS.rush21.scale], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseIn });
  const pop = spring({ frame: f - 80, fps: 30, config: SPRINGS.springPop });
  const likes = Math.round(numRoll(f, 80, 25, 120, 128));
  const heartZoom = interpolate(f, [80, 100], [1, 4], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineAccent });
  const heartBlur = interpolate(f, [84, 100], [0, 6], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <CameraRig cam={{ scale: rush, x: 0, y: 0, rot: 0, origin: '72% 64%' }}>
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ width: 760, marginTop: -60 }}>
          <p style={{ fontFamily: mono, fontSize: 16, color: colors.muted, letterSpacing: '0.1em', opacity: fade(f, 2) }}>LICENSE · 分享</p>
          <div style={{ display: 'flex', gap: 18, marginTop: 22 }}>
            {['微', 'Q', '豆', '云', '邮', 'R'].map((s, i) => (
              <div key={s} style={{ ...inkRise(f, 2 + i * 7), width: 52, height: 52, borderRadius: 26, background: colors.bgLift, border: `1px solid ${colors.hairline}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: serif, fontSize: 22, color: colors.paper }}>{s}</div>
            ))}
          </div>
          {/* 分享图悬浮落位（heavy-glide） */}
          <div style={{ width: 150, height: 96, borderRadius: 8, background: colors.paperDeep, marginTop: 34, transform: `rotate(-2deg) translateY(${(1 - spring({ frame: f - 40, fps: 30, config: SPRINGS.heavyGlide })) * -12}px)`, opacity: fade(f, 40) }} />
        </div>
        {/* 点赞浮钮 + 已赞气泡 */}
        <div style={{ position: 'absolute', left: '68%', top: '58%' }}>
          <div style={{ width: 88, height: 88, borderRadius: 44, background: colors.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${heartZoom})`, filter: `blur(${heartBlur}px)`, boxShadow: `0 0 ${46 * Math.max(0, pop)}px ${colors.accent}` }}>
            <span style={{ fontSize: 38, color: colors.bg }}>♥</span>
          </div>
          <div style={{ position: 'absolute', left: 104, top: -6, background: colors.paperDeep, borderRadius: 10, padding: '8px 16px', transformOrigin: 'left center', transform: `scale(${interpolate(pop, [0, 1], [0.6, 1])})`, opacity: Math.min(1, Math.max(0, pop)) }}>
            <span style={{ fontFamily: mono, fontSize: 18, color: colors.ink }}>已赞 {likes}</span>
          </div>
        </div>
      </AbsoluteFill>
      <p style={{ position: 'absolute', bottom: 100, width: '100%', textAlign: 'center', fontFamily: serif, fontSize: 36, color: colors.paper, opacity: fade(f, 18) * (1 - interpolate(f, [80, 96], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })) }}>点赞吧~</p>
    </CameraRig>
  );
};

/* 镜 22（680–830）音乐年轮：年份刻度带 orbit-drift（按角距缩放缩淡）+ 巨型年份水印 6% 视差（dof-parallax），
   cam-orbit 环绕弧线；真实年度最爱（wuh.site /api/music 八年歌单播放之最，2026-10-25 抓取）；出场 tr-vinyl-swap（rotate −120° 交叉溶解 811–830 → 本地 131–150） */
const YEAR_FAVS: Array<[string, string, string]> = [
  ['2018', '诱惑的街 (Live)', '林志炫'],
  ['2019', '腻味', '金玟岐'],
  ['2020', '少年不凡', '刘美麟'],
  ['2021', '风月缠绵（金风玉露变奏）', '陈致逸'],
  ['2022', '归期', '钱润玉'],
  ['2023', '爱意 (金风玉露变奏)', '陈致逸'],
  ['2024', '爱意 (金风玉露变奏)', '陈致逸'],
  ['2025', '爱意 (金风玉露变奏)', '陈致逸'],
];
const ShotYearRing: FC = () => {
  const frame = useCurrentFrame();
  const f = frame - 680; // 0–150
  // 聚焦 4 个代表年 × 每年 32f（约 1.1s，看清为止）；环形刻度仍展示全部 8 年
  const FEATURED: Array<[string, string, string]> = [
    ['2018', '诱惑的街 (Live)', '林志炫'],
    ['2021', '风月缠绵（金风玉露变奏）', '陈致逸'],
    ['2022', '归期', '钱润玉'],
    ['2025', '爱意 (金风玉露变奏)', '陈致逸'],
  ];
  const active = Math.min(Math.floor(f / 32), FEATURED.length - 1); // 每 32f 一年
  const winStart = active * 32;
  const [selYear, selSong, selArtist] = FEATURED[active];
  const songIn = interpolate(f - winStart, [0, 8, 24, 32], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const swap = interpolate(f, [131, 150], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const cam: CamState = { scale: 1, x: Math.sin(f / 40) * 60, y: 0, rot: Math.sin(f / 50) * 1.2 };
  return (
    <AbsoluteFill>
      <CameraRig cam={cam}>
        {/* 巨型年份水印（远层视差，随选中年轮换） */}
        <ParallaxLayer depth={0.4} cam={cam} blurBase={1}>
          <p style={{ ...inkRise(f, 10), position: 'absolute', left: '50%', top: '38%', transform: 'translate(-50%,-50%)', fontFamily: serif, fontSize: 210, color: colors.paper, opacity: 0.06, margin: 0 }}>{selYear}</p>
        </ParallaxLayer>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ position: 'relative', width: 900, height: 420, transform: `rotate(${-swap * 120}deg)`, opacity: 1 - swap }}>
            {YEAR_FAVS.map(([y], i) => {
              const theta = (i / YEAR_FAVS.length) * Math.PI * 2 - Math.PI / 2 + f * 0.003;
              const front = (Math.sin(theta) + 1) / 2; // 0 远 → 1 近
              const sel = y === selYear;
              return (
                <p key={y} style={{ position: 'absolute', left: 450 + Math.cos(theta) * 380, top: 210 + Math.sin(theta) * 150, transform: `translate(-50%,-50%) scale(${sel ? 1.5 : 0.6 + front * 0.5})`, fontFamily: serif, fontSize: sel ? 64 : 34, color: sel ? colors.accent : colors.paper, opacity: sel ? 1 : 0.25 + front * 0.35, margin: 0 }}>{y}</p>
              );
            })}
          </div>
          {/* 选中年的真实最爱 */}
          <p style={{ position: 'absolute', bottom: 178, width: '100%', textAlign: 'center', fontFamily: serif, fontSize: 30, color: colors.accent, opacity: songIn * (1 - swap), margin: 0 }}>
            《{selSong}》 — {selArtist}
          </p>
        </AbsoluteFill>
      </CameraRig>
      <p style={{ position: 'absolute', bottom: 100, width: '100%', textAlign: 'center', fontFamily: serif, fontSize: 32, color: colors.paper, opacity: fade(f, 24) * (1 - swap) }}>时间的年轮，刻着每一年的歌</p>
    </AbsoluteFill>
  );
};

/* 镜 23（830–980）黑胶碟心：vinyl-spin 5s/圈（2.4°/f）+ conic 高光扫唱纹（sweep-light 变体），
   3770 预冻（eq-freeze：停转 + saturate 0.92），随后 tr-freeze-cut 直切镜 24 */
const ShotVinyl: FC = () => {
  const frame = useCurrentFrame();
  const f = frame - 830; // 0–150
  const spinF = Math.min(f, 140); // 本地 970 = 全片 3770 预冻
  const frozen = f >= 140;
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', opacity: fade(f, 0), filter: frozen ? 'saturate(0.92)' : undefined }}>
      <div style={{ position: 'relative', width: 430, height: 430 }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: 215, background: `repeating-radial-gradient(circle, ${colors.bg} 0px, ${colors.bg} 3px, ${colors.bgLift} 4px, ${colors.bgLift} 6px)`, border: `1px solid ${colors.hairline}`, transform: `rotate(${spinF * 2.4}deg)` }} />
        {/* conic 高光同速叠转 */}
        <div style={{ position: 'absolute', inset: 0, borderRadius: 215, background: `conic-gradient(from ${spinF * 2.4}deg, transparent 0deg, ${WHITE_FLASH.color} 24deg, transparent 60deg)`, opacity: 0.12, mixBlendMode: 'screen' }} />
        <div style={{ position: 'absolute', left: 155, top: 155, width: 120, height: 120, borderRadius: 60, background: colors.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontFamily: serif, fontSize: 26, color: colors.bg }}>2026</span>
        </div>
        <div style={{ position: 'absolute', left: 209, top: 209, width: 12, height: 12, borderRadius: 6, background: colors.bg }} />
      </div>
      <p style={{ position: 'absolute', bottom: 110, width: '100%', textAlign: 'center', fontFamily: serif, fontSize: 32, color: colors.paper, opacity: fade(f, 20) }}>黑胶还在转，时光没走远</p>
    </AbsoluteFill>
  );
};

/* 镜 24（980–1090）EQ 冻结卡点：3780 整拍冻结（scaleY 0.35 保持）→ 3790 半拍再起（eq-bounce）→
   3884 预冻再收敛，tr-freeze-cut 出场；cam-hold 同框分位 + 歌名 marquee-drift + 书耳迷你播放器 */
const ShotEQ: FC = () => {
  const frame = useCurrentFrame();
  const f = frame - 980; // 0–110
  const hold = ANCHORS.eqReprise - ANCHORS.eqFreeze; // 10f 整拍冻结保持
  const refreeze = f >= 104; // 3884 预冻
  const barVal = (i: number): number => {
    if (f < hold) return 0.35;
    if (f < 104) return eqBars(f - hold)[i];
    return interpolate(f - 104, [0, 6], [eqBars(104 - hold)[i], 0.35], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  };
  const marquee = -((f * 2) % 320);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', filter: f < hold || refreeze ? 'saturate(0.92)' : undefined }}>
      <div style={{ textAlign: 'center', marginTop: -60 }}>
        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-end', height: 150, justifyContent: 'center' }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ width: 26, height: 150, background: colors.accent, borderRadius: 6, transformOrigin: 'bottom', transform: `scaleY(${Math.max(0.06, barVal(i))})`, opacity: 0.9 }} />
          ))}
        </div>
        <p style={{ fontFamily: serif, fontSize: 40, color: colors.paper, marginTop: 34, fontStyle: 'italic' }}>本卷最热 ·《按语》</p>
      </div>
      {/* 左下 440px 迷你播放器：书耳 + 歌名跑马灯 */}
      <div style={{ position: 'absolute', left: 140, bottom: 150, width: 440, height: 76, borderRadius: 12, background: colors.bgLift, border: `1px solid ${colors.hairline}`, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: 0, top: 0, width: 18, height: 30, background: colors.accent, clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 70%, 0 100%)' }} />
        <div style={{ position: 'absolute', left: 18, top: 0, bottom: 0, right: 26, overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
          <span style={{ fontFamily: serif, fontSize: 20, color: colors.paper, whiteSpace: 'nowrap', transform: `translateX(${marquee}px)` }}>按语 · THE ANNOTATION ·　按语 · THE ANNOTATION ·　</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* 镜 25（1090–1210）信笺留言板：1px 纵线 path-draw 生长 + 节点 cascade ink-rise（当日 accent），
   cam-crane 沿纵线下行；出场 tr-page-turn（translateX −40 + rotateY 12° + 右缘阴影扫过） */
const ShotLetter: FC = () => {
  const frame = useCurrentFrame();
  const f = frame - 1090; // 0–120
  const lineDraw = interpolate(f, [0, 34], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const crane = interpolate(f, [0, 100], [-14, 30], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const turn = interpolate(f, [90, 120], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const msgs: Array<[string, string]> = [
    ['今天', '见字如面。'],
    ['昨天', '朝朝如念。'],
    ['前天', '路过，留个脚印。'],
    ['3 天前', '再来一卷歌单。'],
  ];
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', perspective: 1200, transform: `translateY(${crane - turn * 40}px) rotateY(${turn * 12}deg)`, transformOrigin: 'left center' }}>
      <div style={{ position: 'relative', width: 720, height: 380 }}>
        <div style={{ position: 'absolute', left: 150, top: 0, width: 1, height: 380, background: colors.accent, opacity: 0.5, transform: `scaleY(${lineDraw})`, transformOrigin: 'top' }} />
        {msgs.map(([day, text], i) => (
          <div key={day} style={{ position: 'absolute', top: 16 + i * 92, left: 0, width: '100%', ...inkRise(f, 10 + i * 20) }}>
            <div style={{ position: 'absolute', left: 146, top: 8, width: 9, height: 9, borderRadius: 5, background: i === 0 ? colors.accent : colors.muted }} />
            <p style={{ margin: '0 0 0 180px', fontFamily: serif, fontStyle: 'italic', fontSize: 20, color: colors.accent }}>{day}</p>
            <p style={{ margin: '6px 0 0 180px', fontFamily: serif, fontSize: 26, color: colors.paper }}>{text}</p>
          </div>
        ))}
      </div>
      <p style={{ position: 'absolute', bottom: 96, width: '100%', textAlign: 'center', fontFamily: serif, fontSize: 34, color: colors.paper, opacity: fade(f, 40) * (1 - turn) }}>驿寄梅花，鱼传尺素</p>
      {/* 纸页右缘阴影扫过 */}
      <div style={{ position: 'absolute', top: 0, bottom: 0, right: 0, width: 320, background: `linear-gradient(90deg, transparent, ${colors.bg})`, opacity: turn * 0.9, transform: `translateX(${(1 - turn) * 160}px)` }} />
    </AbsoluteFill>
  );
};

/* 镜 26（1210–1320）弹幕聊天室：触发卡 spring-pop 成 1120×720 大窗 + cam-dolly-in 推入 + cam-drift 微摇，
   气泡左右交替滑入 + 发送三态轮显（chat-bubble）；出场 tr-bubble-gather 聚拢成光点 */
const ShotChat: FC = () => {
  const frame = useCurrentFrame();
  const f = frame - 1210; // 0–110
  const open = spring({ frame: f, fps: 30, config: SPRINGS.springPop });
  const dolly = interpolate(f, [0, 110], [1, 1.08], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const gather = interpolate(f, [80, 110], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseIn });
  const msgs: Array<[string, boolean]> = [
    ['路过，留个脚印。', false],
    ['朝朝如念。', true],
    ['字字用心。', false],
    ['天才向左，疯子向右。', true],
    ['再来一卷歌单。', false],
  ];
  const states = ['发送中', '已发', '已读'];
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', transform: `scale(${dolly}) translateX(${Math.sin(f / 40) * 6}px)` }}>
      <div style={{ width: 1120, height: 660, borderRadius: 18, background: colors.bgLift, border: `1px solid ${colors.hairline}`, overflow: 'hidden', position: 'relative', transform: `scale(${interpolate(open, [0, 1], [0.6, 1])})` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '22px 32px', borderBottom: `1px solid ${colors.hairline}` }}>
          <div style={{ width: 30, height: 30, borderRadius: 15, background: colors.accent }} />
          <div style={{ width: 30, height: 30, borderRadius: 15, background: colors.paperMuted }} />
          <span style={{ fontFamily: sans, fontSize: 18, color: colors.muted, marginLeft: 8 }}>About · 弹幕聊天室</span>
        </div>
        <div style={{ position: 'relative', height: 540 }}>
          {msgs.map(([text, right], i) => {
            const born = 10 + i * 14;
            const pop = spring({ frame: f - born, fps: 30, config: SPRINGS.springPop });
            const status = states[Math.min(2, Math.max(0, Math.floor((f - born - 8) / 12)))];
            return (
              <div key={text} style={{ position: 'absolute', left: right ? undefined : 46, right: right ? 46 : undefined, top: 26 + i * 88, opacity: Math.min(1, Math.max(0, pop)), transform: `translate(${(right ? 1 : -1) * (1 - pop) * 40 + gather * (right ? 300 : -160)}px, ${gather * (280 - (26 + i * 88))}px) scale(${1 - gather * 0.8})` }}>
                <div style={{ background: right ? colors.accent : colors.paperDeep, borderRadius: 12, padding: '12px 20px' }}>
                  <span style={{ fontFamily: sans, fontSize: 21, color: right ? colors.bg : colors.ink }}>{text}</span>
                </div>
                <p style={{ fontFamily: mono, fontSize: 12, color: colors.muted, textAlign: right ? 'right' : 'left', margin: '6px 4px 0' }}>{status}</p>
              </div>
            );
          })}
          {/* 聚拢合体光点（bloom-glow） */}
          <div style={{ position: 'absolute', left: 534, top: 300, width: 26, height: 26, borderRadius: 13, background: colors.accent, opacity: gather, boxShadow: `0 0 ${70 * gather}px ${colors.accent}`, transform: `scale(${gather})`, mixBlendMode: 'screen' }} />
        </div>
      </div>
      <p style={{ position: 'absolute', bottom: 92, width: '100%', textAlign: 'center', fontFamily: serif, fontSize: 32, color: colors.paper, opacity: fade(f, 30) * (1 - gather) }}>两种人格，一间屋子</p>
    </AbsoluteFill>
  );
};

/* 镜 27（1320–1440）About 全家桶：热力图 heat-wave 逐格波浪点亮（col+row 波次）+ 广角 cam-pan + dof-parallax 板块视差；
   出场 tr-dive-through（scale 1→1.7 + translateY 冲向地图 + 前景 blur 冲屏） */
const ShotAbout: FC = () => {
  const frame = useCurrentFrame();
  const f = frame - 1320; // 0–120
  const pan = interpolate(f, [0, 90], [90, -110], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const dive = interpolate(f, [90, 120], [1, 1.7], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseIn });
  const diveY = interpolate(f, [90, 120], [0, 190], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseIn });
  const fgBlur = interpolate(f, [114, 120], [0, 6], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const cam: CamState = { scale: dive, x: pan, y: diveY, rot: 0, origin: '78% 62%' };
  return (
    <AbsoluteFill>
      <CameraRig cam={cam}>
        <ParallaxLayer depth={0.6} cam={cam} blurBase={1.5}>
          <div style={{ position: 'absolute', left: 220, top: 260, width: 520, height: 300, borderRadius: '50%', background: colors.paperMuted, opacity: 0.1, filter: 'blur(2px)' }} />
        </ParallaxLayer>
        <ParallaxLayer depth={1} cam={cam}>
          <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', filter: `blur(${fgBlur}px)` }}>
            <div style={{ display: 'flex', gap: 44, alignItems: 'flex-start' }}>
              {/* GitHub 资料行 + 平台卡 + 时间线筛选 */}
              <div style={{ width: 300 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 54, height: 54, borderRadius: 27, background: colors.accent }} />
                  <div>
                    <p style={{ fontFamily: mono, fontSize: 22, color: colors.paper, margin: 0 }}>wuhong</p>
                    <p style={{ fontFamily: mono, fontSize: 14, color: colors.muted, margin: '6px 0 0' }}>1,168 commits · 107 tags</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
                  {['GitHub', 'B 站', '豆瓣'].map((p) => (
                    <span key={p} style={{ fontFamily: mono, fontSize: 13, color: colors.muted, border: `1px solid ${colors.hairline}`, borderRadius: 10, padding: '4px 12px' }}>{p}</span>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 18 }}>
                  {['全部', '按年', '按月'].map((t, i) => (
                    <span key={t} style={{ fontFamily: sans, fontSize: 13, color: i === 0 ? colors.accent : colors.muted, background: i === 0 ? colors.bgLift : undefined, borderRadius: 8, padding: '4px 12px', border: `1px solid ${colors.hairline}` }}>{t}</span>
                  ))}
                </div>
              </div>
              {/* 10,330 逐格真数据热力图（heat-wave） */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(24, 20px)', gap: 4 }}>
                {Array.from({ length: 24 * 7 }).map((_, i) => {
                  const col = i % 24;
                  const row = Math.floor(i / 24);
                  const g = spring({ frame: f - 4 - (col + row) * 0.9, fps: 30, config: { damping: 200 } });
                  const lit = (i * 7) % 10 < 7;
                  return <div key={i} style={{ width: 20, height: 20, borderRadius: 4, background: lit ? colors.accent : colors.paperMuted, opacity: g * (lit ? 0.35 + ((i * 13) % 10) / 16 : 0.2), transform: `scaleY(${interpolate(g, [0, 1], [0.2, 1])})` }} />;
                })}
              </div>
              {/* 380px 足迹地图 */}
              <div style={{ position: 'relative', width: 300, height: 260, borderRadius: 14, background: colors.bgLift, border: `1px solid ${colors.hairline}` }}>
                {[[90, 70], [190, 140], [130, 200]].map(([x, y], i) => (
                  <div key={i} style={{ position: 'absolute', left: x, top: y, width: 12, height: 12, borderRadius: 6, background: colors.accent, opacity: fade(f, 50 + i * 14), boxShadow: `0 0 12px ${colors.accent}` }} />
                ))}
                <p style={{ position: 'absolute', left: 18, bottom: 12, fontFamily: mono, fontSize: 13, color: colors.muted, margin: 0 }}>足迹 · 380px</p>
              </div>
            </div>
          </AbsoluteFill>
        </ParallaxLayer>
      </CameraRig>
      <p style={{ position: 'absolute', bottom: 96, width: '100%', textAlign: 'center', fontFamily: serif, fontSize: 34, color: colors.paper, opacity: fade(f, 26) * (1 - interpolate(f, [104, 116], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })) }}>10,330 次活动 · 365 天 · 逐格真实</p>
    </AbsoluteFill>
  );
};

/* 镜 28（1440–1560）足迹俯冲：cam-dive 落定（承接 27 俯冲）+ 双标记 ripple-bloom 绽开（错 8f）+
   照片九宫格 cascade + B 站角标；出场 tr-grid-scatter 九格向九方向化整为零（35f） */
const ShotFootprint: FC = () => {
  const frame = useCurrentFrame();
  const f = frame - 1440; // 0–120
  const settle = interpolate(f, [0, 28], [1.42, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  const settleY = interpolate(f, [0, 28], [70, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  const scatter = interpolate(f, [85, 120], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  const marks: Array<[string, string, number, number, number]> = [
    ['梧桐山', '2025-09-20', 620, 330, 4],
    ['杨梅坑', '2025-08-15', 940, 470, 12],
  ];
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', transform: `scale(${settle}) translateY(${settleY}px)` }}>
      {/* 地图底：等高线圆环 */}
      <div style={{ position: 'absolute', left: 300, top: 120, width: 900, height: 680 }}>
        {[420, 330, 240, 150].map((r) => (
          <div key={r} style={{ position: 'absolute', left: 450 - r, top: 340 - r, width: r * 2, height: r * 2, borderRadius: r, border: `1px solid ${colors.hairline}` }} />
        ))}
      </div>
      {marks.map(([name, date, x, y, born]) => (
        <div key={name} style={{ position: 'absolute', left: x, top: y }}>
          {/* ripple-bloom 双环错 8f */}
          {[0, 8].map((off) => {
            const p = interpolate(f - born - off, [0, 24], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
            return <div key={off} style={{ position: 'absolute', left: -18, top: -18, width: 36, height: 36, borderRadius: 18, border: `2px solid ${colors.accent}`, opacity: f < born + off || p >= 1 ? 0 : 0.6 * (1 - p), transform: `scale(${0.2 + p * 2.8})` }} />;
          })}
          <div style={{ position: 'absolute', left: -7, top: -7, width: 14, height: 14, borderRadius: 7, background: colors.accent, boxShadow: `0 0 16px ${colors.accent}`, opacity: fade(f, born) }} />
          <div style={{ position: 'absolute', left: 16, top: -14, opacity: fade(f, born + 6) }}>
            <p style={{ fontFamily: serif, fontSize: 24, color: colors.paper, margin: 0, whiteSpace: 'nowrap' }}>{name}</p>
            <p style={{ fontFamily: mono, fontSize: 13, color: colors.muted, margin: '4px 0 0', whiteSpace: 'nowrap' }}>{date}</p>
          </div>
        </div>
      ))}
      {/* 照片九宫格（cascade 展开 → grid-scatter 散开，方向角均分） */}
      <div style={{ position: 'absolute', left: 170, top: 470, display: 'grid', gridTemplateColumns: 'repeat(3, 86px)', gap: 8 }}>
        {Array.from({ length: 9 }).map((_, i) => {
          const g = spring({ frame: f - (44 + i * 4), fps: 30, config: { damping: 200 } });
          const ang = ((i * 40 + 15) * Math.PI) / 180;
          return (
            <div key={i} style={{ position: 'relative', width: 86, height: 86, borderRadius: 8, background: i % 3 === 0 ? colors.paperDeep : colors.paperMuted, opacity: g * (1 - scatter), transform: `translate(${Math.cos(ang) * scatter * 120}px, ${Math.sin(ang) * scatter * 120}px) rotate(${(i % 2 ? 1 : -1) * scatter * 6}deg)` }}>
              {i === 4 ? <span style={{ position: 'absolute', right: 4, bottom: 4, fontFamily: mono, fontSize: 10, color: colors.bg, background: colors.accent, borderRadius: 4, padding: '1px 5px' }}>B 站</span> : null}
            </div>
          );
        })}
      </div>
      <div style={{ position: 'absolute', bottom: 84, width: '100%', textAlign: 'center' }}>
        <p style={{ fontFamily: serif, fontSize: 27, color: colors.paper, margin: 0, opacity: fade(f, 30) }}>上班就好好上班……下班了就好好生活，</p>
        <p style={{ fontFamily: serif, fontSize: 27, color: colors.paper, margin: '8px 0 0', opacity: fade(f, 44) }}>玩游戏、写代码、找朋友聊天，玩累了就看看书、写写字。此乐何极~</p>
      </div>
    </AbsoluteFill>
  );
};

/* 镜 29（1560–1670）主题换装：酒红/素雅分屏 A/B + 全阶色卡 cascade + hover-dye 换色 A/B + 「试墨」drag-follow 游走，
   cam-truck 微甩变体（首尾 6f blur 脉冲）；出场 tr-band-sweep 色带全屏横扫 */
const ShotTheme: FC = () => {
  const frame = useCurrentFrame();
  const f = frame - 1560; // 0–110
  const whip = interpolate(f, [0, 110], [-70, 70], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const blurIn = interpolate(f, [0, 6], [3, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const blurOut = interpolate(f, [104, 110], [0, 3], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const band = interpolate(f, [80, 110], [-100, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseIn });
  // 「试墨」块预烘焙轨迹（drag-follow 手感：缓动跟随 + 低幅游移）
  const inkX = interpolate(f, [12, 96], [210, 690], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }) + Math.sin(f / 7) * 6;
  const inkY = 66 + Math.sin(f / 11) * 26;
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', transform: `translateX(${whip}px)`, filter: `blur(${Math.max(blurIn, blurOut)}px)` }}>
      <div style={{ display: 'flex', gap: 26 }}>
        {/* A 酒红 */}
        <div style={{ width: 430, height: 300, borderRadius: 16, background: colors.bgLift, border: `1px solid ${colors.hairline}`, padding: '38px 44px' }}>
          <p style={{ fontFamily: serif, fontSize: 46, color: RED, margin: 0 }}>酒红</p>
          <p style={{ fontFamily: sans, fontSize: 18, color: colors.muted, marginTop: 16, letterSpacing: '0.2em' }}>暗 · 跟随系统</p>
          <div style={{ width: 88, height: 30, borderRadius: 15, background: colors.bg, border: `1px solid ${colors.hairline}`, marginTop: 24, position: 'relative' }}>
            <div style={{ position: 'absolute', right: 3, top: 3, width: 22, height: 22, borderRadius: 11, background: RED }} />
          </div>
        </div>
        {/* B 素雅 */}
        <div style={{ width: 430, height: 300, borderRadius: 16, background: colors.paper, padding: '38px 44px' }}>
          <p style={{ fontFamily: serif, fontSize: 46, color: colors.ink, margin: 0 }}>素雅</p>
          <p style={{ fontFamily: sans, fontSize: 18, color: colors.muted, marginTop: 16, letterSpacing: '0.2em' }}>明 · 日光纸色</p>
          <div style={{ width: 88, height: 30, borderRadius: 15, background: colors.paperDeep, marginTop: 24, position: 'relative' }}>
            <div style={{ position: 'absolute', left: 3, top: 3, width: 22, height: 22, borderRadius: 11, background: colors.accent }} />
          </div>
        </div>
      </div>
      {/* 100–900 全阶色卡（stagger 展开 + 换色 A/B：f=40 起逐卡由琥珀渡向酒红） */}
      <div style={{ display: 'flex', gap: 10, marginTop: 34 }}>
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} style={{ ...inkRise(f, 6 + i * 4), position: 'relative', width: 84, height: 96, borderRadius: 8, background: colors.accent, overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, background: RED, opacity: interpolate(f, [40 + i * 2, 50 + i * 2], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }} />
            <span style={{ position: 'absolute', left: 0, right: 0, bottom: 6, textAlign: 'center', fontFamily: mono, fontSize: 12, color: colors.bg }}>{(i + 1) * 100}</span>
          </div>
        ))}
      </div>
      {/* 试墨块 */}
      <div style={{ position: 'absolute', left: inkX, top: inkY, width: 48, height: 48, borderRadius: 10, background: colors.accent, boxShadow: `0 6px 18px ${colors.bg}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontFamily: serif, fontSize: 16, color: colors.bg }}>试墨</span>
      </div>
      <p style={{ position: 'absolute', bottom: 88, width: '100%', textAlign: 'center', fontFamily: serif, fontSize: 32, color: colors.paper, opacity: fade(f, 24) * (1 - band / 100) }}>换一种墨色，换一种心情</p>
      {/* tr-band-sweep：色带横扫（translateX −100%→0，cine-ease-in） */}
      <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(90deg, ${RED}, ${colors.accent}, ${colors.paperMuted})`, transform: `translateX(${band}%)` }} />
    </AbsoluteFill>
  );
};

/* 镜 30（1670–1780）全站漫游：页面序列四连击（4480/4500/4520/4540 → 本地 10/30/50/70）+
   .reveal 元素书写显现（entry 0→35%）+ 高速 cam-dolly-in + 三语标识 glitch-flick 低振幅；
   出场 tr-soft-bloom（非白闪，D-3：brightness 正脉冲 1→1.6→1） */
const writeReveal = (f: number, at: number) =>
  interpolate(f, [at, at + 10], [0, 35], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

const ShotRoam: FC = () => {
  const frame = useCurrentFrame();
  const f = frame - 1670; // 0–110
  const dolly = interpolate(f, [0, 110], [1, 1.5], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseIn });
  const bloom = interpolate(f, [95, 103, 110], [1, 1.6, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseIn });
  const pages = ['/', '/music', '/guestbook', '/footprint', '/topics'];
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', transform: `scale(${dolly})`, filter: `brightness(${bloom})` }}>
      <div style={{ display: 'flex', gap: 24 }}>
        {pages.map((p, i) => {
          const born = i === 0 ? 2 : 10 + i * 20; // 1680/1700/1720/1740 四连击
          const inP = spring({ frame: f - born, fps: 30, config: { damping: 200 } });
          const flick = Math.floor(f / 3) % 7 === 0;
          return (
            <div key={p} style={{ width: 190, height: 260, borderRadius: 12, background: colors.bgLift, border: `1px solid ${colors.hairline}`, opacity: inP, transform: `translateY(${(1 - inP) * 30}px) scale(${0.86 + inP * 0.14})`, padding: '20px 18px', position: 'relative' }}>
              <p style={{ fontFamily: mono, fontSize: 15, color: colors.accent, margin: 0 }}>{p}</p>
              {[0, 1, 2, 3].map((l) => (
                <div key={l} style={{ height: 7, width: `${writeReveal(f, born + 6 + l * 5)}%`, background: colors.paperMuted, opacity: 0.4, borderRadius: 4, marginTop: 12 }} />
              ))}
              {i === pages.length - 1 ? (
                <span style={{ position: 'absolute', right: 10, bottom: 10, fontFamily: mono, fontSize: 11, color: colors.muted, opacity: flick ? 0.35 : 1, transform: `translateX(${flick ? -2 : 0}px)` }}>中 / EN / 日</span>
              ) : null}
            </div>
          );
        })}
      </div>
      <p style={{ position: 'absolute', bottom: 100, width: '100%', textAlign: 'center', fontFamily: serif, fontSize: 32, color: colors.paper, opacity: fade(f, 26) }}>每一页，都在呼吸</p>
    </AbsoluteFill>
  );
};

/* 镜 31（1780–1900）联系钤印：纸卡 spring-pop 展开 + 8 社交图标围合 cascade + 22px 方形钤印落章（seal-stamp），
   cam-dolly-in 俯拍轻急推；red-blaze 晕起渐衰入暖纸（tr-blaze-spread 晕开变体，grade 交叉入 Act 5） */
const ShotContact: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - 1780; // 0–120
  const open = spring({ frame: f - 2, fps, config: SPRINGS.springPop });
  const dolly = interpolate(f, [0, 120], [1, 1.12], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const icons = ['微', 'GH', 'B', '豆', '邮', 'R', 'Q', '云'];
  const seal = sealStamp(f, 50, fps, sealTilt('contact-2026'));
  // red-blaze：50 晕起 → 66 后 40f 渐衰且色温转暖（晕开入暖纸变体）
  const blazeRise = interpolate(f, [50, 66], [0, 0.8], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const blazeDecay = interpolate(f, [66, 120], [0.8, 0.12], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  const warmRise = interpolate(f, [70, 120], [0, 0.5], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', transform: `scale(${dolly})` }}>
      {/* 8 社交图标围合 */}
      {icons.map((s, i) => {
        const theta = (i / icons.length) * Math.PI * 2 - Math.PI / 2;
        return (
          <div key={s} style={{ position: 'absolute', left: `calc(50% + ${Math.cos(theta) * 470}px)`, top: `calc(50% + ${Math.sin(theta) * 300}px)`, transform: 'translate(-50%,-50%)', ...writeFade(f, 6 + i * 6), width: 54, height: 54, borderRadius: 12, background: colors.bgLift, border: `1px solid ${colors.hairline}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: serif, fontSize: 20, color: colors.paper }}>{s}</span>
          </div>
        );
      })}
      {/* 纸卡（spring-pop 展开 + paper-breathe 呼吸） */}
      <div style={{ transform: `scale(${interpolate(open, [0, 1], [0.6, 1])})` }}>
        <div style={{ ...paperBreathe(frame), width: 600, borderRadius: 14, background: colors.paperDeep, padding: '46px 56px', textAlign: 'center' }}>
          <p style={{ fontFamily: serif, fontSize: 38, color: colors.ink, margin: 0 }}>代码写诗，工具作画</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, justifyContent: 'center', marginTop: 20 }}>
            <div style={{ height: 1, width: 60, background: colors.ink, opacity: 0.2 }} />
            <p style={{ fontFamily: sans, fontSize: 18, color: colors.muted, margin: 0, letterSpacing: '0.15em' }}>开源是一种信仰</p>
            <div style={{ height: 1, width: 60, background: colors.ink, opacity: 0.2 }} />
          </div>
        </div>
      </div>
      {/* 22px 方形钤印落章 */}
      <div style={{ position: 'absolute', left: '58%', top: '58%', ...seal, width: 22, height: 22, background: colors.accent }} />
      {/* red-blaze 红晕 → 暖金晕（交叉入 Act 5 grade-warm-paper） */}
      <AbsoluteFill style={{ background: `radial-gradient(circle at 58% 58%, ${RED} 0%, transparent 62%)`, opacity: f < 66 ? blazeRise : blazeDecay, mixBlendMode: 'screen' }} />
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 52%, ${colors.accent} 0%, transparent 70%)`, opacity: warmRise, mixBlendMode: 'screen' }} />
    </AbsoluteFill>
  );
};

/* 镜 16–31（起止为 Act 本地帧 = 全片绝对帧 − 2800） */
const SHOTS: Array<{ from: number; to: number; Board: FC }> = [
  { from: 0, to: 120, Board: ShotHome }, // 16 首页全景（2800–2920）
  { from: 120, to: 230, Board: ShotTimeline }, // 17 墨点时间轴 hover（2920–3030）
  { from: 230, to: 320, Board: ShotShelf }, // 18 书架 shimmer（3030–3120）
  { from: 320, to: 460, Board: ShotCover }, // 19 生成式封面（3120–3260）
  { from: 460, to: 580, Board: ShotToc }, // 20 目录纸卷（3260–3380）
  { from: 580, to: 680, Board: ShotLike }, // 21 点赞急推（3380–3480）
  { from: 680, to: 830, Board: ShotYearRing }, // 22 音乐年轮（3480–3630）
  { from: 830, to: 980, Board: ShotVinyl }, // 23 黑胶碟心（3630–3780）
  { from: 980, to: 1090, Board: ShotEQ }, // 24 EQ 冻结卡点（3780–3890）
  { from: 1090, to: 1210, Board: ShotLetter }, // 25 信笺（3890–4010）
  { from: 1210, to: 1320, Board: ShotChat }, // 26 弹幕（4010–4120）
  { from: 1320, to: 1440, Board: ShotAbout }, // 27 About 全家桶（4120–4240）
  { from: 1440, to: 1560, Board: ShotFootprint }, // 28 足迹俯冲（4240–4360）
  { from: 1560, to: 1670, Board: ShotTheme }, // 29 主题换装（4360–4470）
  { from: 1670, to: 1780, Board: ShotRoam }, // 30 全站漫游（4470–4580）
  { from: 1780, to: 1900, Board: ShotContact }, // 31 联系钤印（4580–4700）
];

// Act 4 产品巡礼（全片 2800–4700；挂载于 Sequence from=2800，useCurrentFrame 即本地帧；
// 幕调色 grade-warm-gold（GRADES[3]）免挂）
export const Act4: FC = () => {
  const frame = useCurrentFrame();
  const shot = SHOTS.find((s) => frame >= s.from && frame < s.to) ?? SHOTS[0];
  const Board = shot.Board;
  // tr-white-flash 跨切点收尾：2800 剪点后 12f cine-ease-out 释放（涨满段在 Act 3 镜 15）
  const white = interpolate(frame, [0, 12], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  const grade = GRADES[3];
  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <DustField act={4} />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Board />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: grade.lut.color, mixBlendMode: grade.lut.blend, opacity: grade.lut.opacity }} />
      <AbsoluteFill style={{ background: grade.veil.color, mixBlendMode: grade.veil.blend, opacity: grade.veil.opacity }} />
      <AbsoluteFill style={{ background: WHITE_FLASH.color, opacity: white }} />
    </AbsoluteFill>
  );
};
