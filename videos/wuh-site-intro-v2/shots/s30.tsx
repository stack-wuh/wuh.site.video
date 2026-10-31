/* 镜 30 · Act 5 灯亮 · 局部帧 [0,132) · 132f
   承接 S29 湿纸双苔痕（TR-05 纸页展开）：新站首页从湿纸上显影，背景纸柱虚化（CM-12）；
   历史文章卡按半拍一卡从左侧成队飞入内容栏（FN-12 cardFly + FN-13），落位极轻压实；
   CM-07 侧向跟移、焦点锁入位点（CM-13）；尾帧文章列表铺满首屏（交接 S31：满屏列表）。 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, random, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, FILM_COLORS, cardFly } from '../motion-tokens';
import { Caption } from '../components/Caption';
import { DustField } from '../components/DustField';
import { Grade } from '../components/Grade';
import { PaperGrain } from '../components/PaperGrain';

const CLAMP = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const serif = fontFamilies.serif;
const sans = fontFamilies.sans;
const mono = fontFamilies.mono;

/* 2026-05-01 批量入库的旧文（材料 §一 / §5.1；只给密度不给计数） */
const POSTS: Array<{ title: string; date: string; tag: string }> = [
  { title: 'codex 的开发范式', date: '2026-03-07', tag: '技术' },
  { title: '进取', date: '2022-09-25', tag: '随笔' },
  { title: '丧钟为谁而鸣', date: '2022-04-04', tag: '随笔' },
  { title: '2022 年度总结', date: '2022-02-08', tag: '年度' },
  { title: '基于 TS 重构 NextJs 应用', date: '2021-12-05', tag: '技术' },
  { title: '搬山计划', date: '2021-05-07', tag: '随笔' },
  { title: '2021 年度总结', date: '2021-04-08', tag: '年度' },
  { title: '我的生活毁于了忙碌', date: '2020-06-30', tag: '随笔' },
  { title: '我用了 30 天完成了我的个人网站--Express', date: '2020-04-03', tag: '技术' },
  { title: '2018-08-05 【开篇】', date: '2019-07-26', tag: '随笔' },
];

const PAGE = { left: 260, top: 100, w: 1400, h: 860 };
const ROW_TOP = 210;
const ROW_H = 52;
const ROW_GAP = 5;

const COLUMNS = Array.from({ length: 7 }, (_, i) => ({
  x: -60 + i * 292 + random(`s30-col-${i}-x`) * 70,
  w: 92 + random(`s30-col-${i}-w`) * 78,
  h: 420 + random(`s30-col-${i}-h`) * 300,
}));

const ShotArticleMigration: FC = () => {
  const frame = useCurrentFrame();

  /* S29 湿纸余痕淡出 */
  const wet = interpolate(frame, [0, 30], [1, 0], { ...CLAMP, easing: CURVES.cineEaseInOut });
  /* TR-05 纸页自中心展开 */
  const unfold = interpolate(frame, [4, 28], [0, 1], { ...CLAMP, easing: CURVES.cineEaseOut });
  /* CM-07 侧向跟移 + 缓慢推近 */
  const truck = interpolate(frame, [0, 132], [30, -30], { ...CLAMP, easing: CURVES.cineEaseInOut });
  const push = interpolate(frame, [0, 132], [1, 1.03], { ...CLAMP, easing: CURVES.cineEaseInOut });
  const skeleton = interpolate(frame, [24, 40], [0, 1], { ...CLAMP, easing: CURVES.cineEaseOut });
  /* TR-15 入场侧预滚：尾 18f 列表开始失焦压暗（S31 续跑） */
  const tailBlur = interpolate(frame, [114, 132], [0, 2.2], { ...CLAMP, easing: CURVES.cineEaseInOut });
  const tailDark = interpolate(frame, [114, 132], [0, 0.14], { ...CLAMP, easing: CURVES.cineEaseInOut });

  const insetX = (1 - unfold) * 33;
  const insetY = (1 - unfold) * 46;
  const tiltX = (1 - unfold) * 2;
  /* 展开完成后撤掉 clip，让纸面投影完整可见 */
  const pageClip = unfold >= 1 ? undefined : `inset(${insetY}% ${insetX}% ${insetY}% ${insetX}%)`;

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ backgroundColor: colors.bg }} />
      {/* 背景纸柱（CM-12 虚化，轻视差） */}
      <AbsoluteFill style={{ transform: `translateX(${-truck * 0.4}px)`, filter: 'blur(9px)' }}>
        {COLUMNS.map((c, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: c.x,
              top: 1080 - c.h,
              width: c.w,
              height: c.h,
              borderRadius: 20,
              background: colors.paperMuted,
              opacity: 0.1,
            }}
          />
        ))}
      </AbsoluteFill>
      {/* S29 湿纸 + 双苔痕（入场侧承接冻帧） */}
      <AbsoluteFill style={{ opacity: wet }}>
        <AbsoluteFill style={{ backgroundColor: colors.paper }} />
        <div style={{ position: 'absolute', left: 640 - 235, top: 566 - 176, width: 470, height: 352, borderRadius: '50%', background: colors.ink, filter: 'blur(30px)', opacity: 0.24 }} />
        <div style={{ position: 'absolute', left: 1286 - 292, top: 560 - 224, width: 584, height: 448, borderRadius: '50%', background: colors.ink, filter: 'blur(34px)', opacity: 0.4 }} />
        <div style={{ position: 'absolute', left: 640 - 60, top: 566 - 13, width: 120, textAlign: 'center', fontFamily: mono, fontSize: 22, letterSpacing: '0.18em', color: colors.ink, fontVariantNumeric: 'tabular-nums' }}>71</div>
        <div style={{ position: 'absolute', left: 1286 - 60, top: 560 - 13, width: 120, textAlign: 'center', fontFamily: mono, fontSize: 22, letterSpacing: '0.18em', color: colors.paper, fontVariantNumeric: 'tabular-nums' }}>151</div>
        <AbsoluteFill style={{ backgroundImage: `linear-gradient(180deg, ${FILM_COLORS.paperMist}, transparent 34%)`, mixBlendMode: 'screen', opacity: 0.16 }} />
        <AbsoluteFill style={{ backgroundImage: `linear-gradient(180deg, ${colors.bg}, transparent 22%)`, opacity: 0.3 }} />
        <AbsoluteFill style={{ backgroundImage: `linear-gradient(0deg, ${colors.bg}, transparent 26%)`, opacity: 0.42 }} />
      </AbsoluteFill>
      {/* 首页纸面与内容（整页随镜头侧移） */}
      <AbsoluteFill style={{ transform: `translateX(${truck}px) scale(${push})`, transformOrigin: 'center', filter: `blur(${tailBlur}px)` }}>
        <div
          style={{
            position: 'absolute',
            left: PAGE.left,
            top: PAGE.top,
            width: PAGE.w,
            height: PAGE.h,
            borderRadius: 14,
            background: colors.paper,
            border: `1px solid ${colors.hairline}`,
            boxShadow: `0 40px 120px ${colors.bg}`,
            clipPath: pageClip,
            transform: `perspective(1600px) rotateX(${tiltX}deg)`,
            transformOrigin: 'center',
          }}
        />
        <div style={{ position: 'absolute', left: PAGE.left, top: PAGE.top, width: PAGE.w, height: PAGE.h }}>
          {/* 导航 */}
          <div style={{ position: 'absolute', left: 44, right: 44, top: 30, height: 34, display: 'flex', alignItems: 'center', opacity: interpolate(frame, [26, 40], [0, 1], { ...CLAMP, easing: CURVES.cineEaseOut }) }}>
            <div style={{ width: 10, height: 10, background: colors.seal, transform: 'rotate(45deg)', marginRight: 12 }} />
            <span style={{ fontFamily: mono, fontSize: 21, color: colors.ink, letterSpacing: '0.02em' }}>wuh.site</span>
            <span style={{ marginLeft: 'auto', display: 'flex', gap: 28 }}>
              {['首页', '文章', '关于', '音乐'].map((t, i) => (
                <span key={t} style={{ fontFamily: sans, fontSize: 14, color: i === 1 ? colors.seal : colors.muted }}>{t}</span>
              ))}
            </span>
          </div>
          {/* 首屏标题 */}
          <div style={{ position: 'absolute', left: 44, top: 88, display: 'flex', alignItems: 'baseline', gap: 18, opacity: interpolate(frame, [28, 44], [0, 1], { ...CLAMP, easing: CURVES.cineEaseOut }) }}>
            <span style={{ fontFamily: serif, fontSize: 38, color: colors.ink, letterSpacing: '0.06em' }}>朝朝如念</span>
            <span style={{ fontFamily: mono, fontSize: 13, color: colors.muted }}>a boy just ~</span>
          </div>
          <div style={{ position: 'absolute', left: 44, right: 44, top: 176, height: 1, background: colors.ink, opacity: 0.1 * skeleton }} />
          {/* 文章栏：空位骨架 + 成队飞入的旧文卡 */}
          <div style={{ position: 'absolute', left: 44, right: 44, top: ROW_TOP, height: POSTS.length * (ROW_H + ROW_GAP) }}>
            {POSTS.map((p, i) => (
              <div
                key={`slot-${p.title}`}
                style={{ position: 'absolute', left: 0, right: 0, top: i * (ROW_H + ROW_GAP), height: ROW_H, borderRadius: 8, background: colors.paperDeep, opacity: 0.35 * skeleton }}
              />
            ))}
            {POSTS.map((p, i) => {
              const delay = 16 + i * 10;
              const dur = 18;
              const land = delay + dur;
              const fly = cardFly(frame, delay, dur, { x: -1320 - i * 22, y: 14 + ((i % 3) - 1) * 12, rot: -7 + (i % 3) * 2.5, scale: 0.9 }, { x: 0, y: 0, rot: 0, scale: 1 });
              const press = interpolate(frame, [land, land + 6], [3, 0], { ...CLAMP, easing: CURVES.cineEaseOut });
              return (
                <div
                  key={p.title}
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: i * (ROW_H + ROW_GAP),
                    height: ROW_H,
                    borderRadius: 8,
                    background: colors.paperDeep,
                    border: `1px solid ${colors.paperMuted}`,
                    boxShadow: `0 6px 18px ${colors.bg}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    padding: '0 18px',
                    zIndex: 10 + i,
                    opacity: fly.opacity,
                    transform: `${fly.transform ?? ''} translateY(${press}px)`,
                  }}
                >
                  <span style={{ fontFamily: serif, fontSize: 19, color: colors.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.title}</span>
                  <span style={{ marginLeft: 'auto', fontFamily: mono, fontSize: 12, color: colors.muted, fontVariantNumeric: 'tabular-nums' }}>{p.date}</span>
                  <span style={{ fontFamily: mono, fontSize: 11, color: colors.muted, border: `1px solid ${colors.paperMuted}`, borderRadius: 9, padding: '1px 8px' }}>{p.tag}</span>
                </div>
              );
            })}
          </div>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ backgroundColor: colors.bg, opacity: tailDark }} />
      <DustField act={5} seedBase="s30" />
      <PaperGrain opacity={0.06} />
      <AbsoluteFill style={{ backgroundImage: `linear-gradient(180deg, ${colors.bg}, transparent 16%)`, opacity: 0.25 }} />
      <Grade id="GR-04" />
      <Caption text="旧文一篇篇迁进新家。" appearAt={28} bottom={24} />
    </AbsoluteFill>
  );
};

export default ShotArticleMigration;
