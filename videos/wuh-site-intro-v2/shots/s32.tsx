/* 镜 32 · Act 5 灯亮 · 局部帧 [0,120) · 120f
   承接 S31 黑场白线（TR-17）：前 19f 用 whiteFlashOpacity（全局 3996–4015 → 局部 0–19）覆盖，
   4000f 峰值纯白、4015 后显影；新站首屏夜里开楼：导航 / 文章 / 关于 / 音乐等 10 盏灯
   lightOn 次第亮（FN-24 每拍一盏），CM-03 缓推 Hero；尾帧整页灯全亮、暖光稳定，GR-07 灯火。 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, random, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, FILM_COLORS, eqBars, lightOn, whiteFlashOpacity } from '../motion-tokens';
import { Caption } from '../components/Caption';
import { DustField } from '../components/DustField';
import { Grade } from '../components/Grade';
import { PaperGrain } from '../components/PaperGrain';

const CLAMP = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const serif = fontFamilies.serif;
const sans = fontFamilies.sans;
const mono = fontFamilies.mono;

const ROWS: Array<{ title: string; date: string }> = [
  { title: 'codex 的开发范式', date: '2026-03-07' },
  { title: '进取', date: '2022-09-25' },
  { title: '丧钟为谁而鸣', date: '2022-04-04' },
  { title: '2022 年度总结', date: '2022-02-08' },
  { title: '基于 TS 重构 NextJs 应用', date: '2021-12-05' },
  { title: '搬山计划', date: '2021-05-07' },
  { title: '2021 年度总结', date: '2021-04-08' },
];

const HEAT = Array.from({ length: 80 }, (_, i) => ({ key: `s32-heat-${i}`, v: random(`s32-heat-${i}`) }));

const ShotLightsOn: FC = () => {
  const frame = useCurrentFrame();

  const white = whiteFlashOpacity(3996 + frame);
  const skeleton = interpolate(frame, [7, 22], [0, 0.5], { ...CLAMP, easing: CURVES.cineEaseOut });
  const cam = interpolate(frame, [0, 120], [1, 1.045], { ...CLAMP, easing: CURVES.cineEaseInOut });
  const warm = interpolate(frame, [96, 120], [0, 0.15], { ...CLAMP, easing: CURVES.cineEaseInOut });
  const lineStretch = interpolate(frame, [0, 6], [1, 1.5], { ...CLAMP, easing: CURVES.cineEaseOut });

  const on = (delay: number) => lightOn(frame, delay, 30);
  const lamp = (delay: number) => {
    const p = interpolate(frame, [delay, delay + 8], [0, 1], { ...CLAMP, easing: CURVES.cineEaseOut });
    return (
      <>
        <div style={{ position: 'absolute', right: -10, top: -8, width: 6, height: 6, borderRadius: 3, background: FILM_COLORS.lampAmber, boxShadow: `0 0 12px ${FILM_COLORS.lampAmber}`, opacity: p }} />
        <div style={{ position: 'absolute', right: -68, top: -66, width: 140, height: 140, borderRadius: '50%', background: `radial-gradient(circle, ${FILM_COLORS.lampAmber} 0%, transparent 66%)`, opacity: 0.22 * p, mixBlendMode: 'screen', pointerEvents: 'none' }} />
      </>
    );
  };

  const bars = eqBars(frame);

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ backgroundColor: colors.bg }} />
      <AbsoluteFill style={{ transform: `scale(${cam})`, transformOrigin: '50% 34%' }}>
        {/* 页面骨架：白闪释放时显影 */}
        <div style={{ position: 'absolute', left: 96, top: 70, right: 96, bottom: 56, border: `1px solid ${colors.hairline}`, borderRadius: 6, opacity: skeleton }} />
        {/* 灯 1 · 导航 */}
        <div style={{ position: 'absolute', left: 130, top: 96, width: 1660, height: 56, display: 'flex', alignItems: 'center', ...on(19) }}>
          {lamp(19)}
          <div style={{ width: 11, height: 11, background: colors.seal, transform: 'rotate(45deg)', marginRight: 14 }} />
          <span style={{ fontFamily: mono, fontSize: 24, color: colors.paper, letterSpacing: '0.02em' }}>wuh.site</span>
          <span style={{ marginLeft: 'auto', display: 'flex', gap: 34 }}>
            {['首页', '文章', '关于', '音乐'].map((t, i) => (
              <span key={t} style={{ fontFamily: sans, fontSize: 16, color: i === 1 ? colors.accent : colors.muted }}>{t}</span>
            ))}
          </span>
        </div>
        {/* 灯 2 · Hero 标题 */}
        <div style={{ position: 'absolute', left: 130, top: 198, width: 1100, ...on(28) }}>
          {lamp(28)}
          <div style={{ fontFamily: serif, fontSize: 64, lineHeight: 1.2, letterSpacing: '0.1em', color: colors.paper }}>朝朝如念</div>
        </div>
        {/* 灯 3 · Hero 副行 */}
        <div style={{ position: 'absolute', left: 132, top: 300, width: 520, ...on(37) }}>
          {lamp(37)}
          <div style={{ fontFamily: mono, fontSize: 15, letterSpacing: '0.14em', color: colors.muted }}>a boy just ~</div>
        </div>
        {/* 灯 4 · 文章栏题 */}
        <div style={{ position: 'absolute', left: 130, top: 396, width: 420, ...on(46) }}>
          {lamp(46)}
          <div style={{ fontFamily: sans, fontSize: 15, letterSpacing: '0.32em', color: colors.muted }}>文章</div>
        </div>
        {/* 灯 5 · 文章列表 */}
        <div style={{ position: 'absolute', left: 130, top: 440, width: 960, ...on(55) }}>
          {lamp(55)}
          {ROWS.map((r, i) => (
            <div key={r.title} style={{ position: 'relative', height: 56, display: 'flex', alignItems: 'center', borderBottom: `1px solid ${colors.hairline}` }}>
              <span style={{ fontFamily: serif, fontSize: 21, color: colors.paperMuted }}>{r.title}</span>
              <span style={{ marginLeft: 'auto', fontFamily: mono, fontSize: 13, color: colors.muted, fontVariantNumeric: 'tabular-nums' }}>{r.date}</span>
            </div>
          ))}
        </div>
        {/* 灯 6 · 关于卡 */}
        <div style={{ position: 'absolute', left: 1130, top: 396, width: 660, height: 240, boxSizing: 'border-box', padding: '24px 28px', background: colors.bgLift, border: `1px solid ${colors.hairline}`, borderRadius: 12, ...on(64) }}>
          {lamp(64)}
          <div style={{ fontFamily: mono, fontSize: 13, letterSpacing: '0.2em', color: colors.accent }}>关于</div>
          <div style={{ marginTop: 20, fontFamily: sans, fontSize: 18, color: colors.paperMuted }}>全栈开发者 · 写字的人</div>
          <div style={{ marginTop: 12, fontFamily: sans, fontSize: 16, color: colors.muted }}>深圳</div>
          <div style={{ marginTop: 18, fontFamily: serif, fontSize: 20, color: colors.paper }}>代码写诗，工具作画</div>
        </div>
        {/* 灯 7 · 音乐卡 */}
        <div style={{ position: 'absolute', left: 1130, top: 672, width: 660, height: 210, boxSizing: 'border-box', padding: '24px 28px', background: colors.bgLift, border: `1px solid ${colors.hairline}`, borderRadius: 12, ...on(73) }}>
          {lamp(73)}
          <div style={{ fontFamily: mono, fontSize: 13, letterSpacing: '0.2em', color: colors.accent }}>音乐</div>
          <div style={{ position: 'absolute', right: 36, top: 40, width: 96, height: 96, borderRadius: '50%', border: `2px solid ${colors.muted}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: colors.seal, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: colors.bg }} />
            </div>
          </div>
          <div style={{ position: 'absolute', left: 28, bottom: 26, display: 'flex', alignItems: 'flex-end', gap: 8, height: 54 }}>
            {bars.map((v, i) => (
              <div key={i} style={{ width: 10, height: 54, borderRadius: 2, background: colors.accent, opacity: 0.8, transform: `scaleY(${0.18 + v * 0.82})`, transformOrigin: 'bottom' }} />
            ))}
          </div>
          <div style={{ position: 'absolute', left: 28, right: 200, bottom: 92, height: 1, background: colors.hairline }} />
        </div>
        {/* 灯 8 · 热力条 */}
        <div style={{ position: 'absolute', left: 130, top: 886, width: 1660, height: 40, ...on(82) }}>
          {lamp(82)}
          <div style={{ display: 'flex', gap: 4 }}>
            {HEAT.map((c) => (
              <div key={c.key} style={{ width: 16, height: 26, borderRadius: 3, background: colors.accent, opacity: 0.08 + c.v * 0.5, marginTop: 4 }} />
            ))}
          </div>
        </div>
        {/* 灯 9 · 页脚 */}
        <div style={{ position: 'absolute', left: 130, top: 962, width: 1660, ...on(91) }}>
          {lamp(91)}
          <div style={{ height: 1, background: colors.hairline }} />
          <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', fontFamily: mono, fontSize: 12, letterSpacing: '0.14em', color: colors.muted, fontVariantNumeric: 'tabular-nums' }}>
            <span>wuh.site</span>
            <span>2026</span>
          </div>
        </div>
        {/* 灯 10 · 角印 */}
        <div style={{ position: 'absolute', left: 1744, top: 1002, width: 20, height: 20, ...on(100) }}>
          {lamp(100)}
          <div style={{ width: 20, height: 20, borderRadius: 3, background: colors.seal, transform: 'rotate(6deg)' }} />
        </div>
      </AbsoluteFill>
      <DustField act={5} seedBase="s32" />
      <PaperGrain opacity={0.05} />
      <AbsoluteFill style={{ backgroundImage: `linear-gradient(180deg, ${FILM_COLORS.lampAmber}, transparent 36%)`, mixBlendMode: 'screen', opacity: warm }} />
      <Grade id="GR-07" />
      {/* 白闪：全局 3996–4015 → 局部 0–19，峰值 4000f（局部 4） */}
      <AbsoluteFill style={{ backgroundColor: FILM_COLORS.flashWhite, opacity: white, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', left: 576, top: 539, width: 768, height: 2, background: FILM_COLORS.flashWhite, boxShadow: `0 0 28px ${FILM_COLORS.flashWhite}`, opacity: white, transform: `scaleX(${lineStretch})`, transformOrigin: 'center' }} />
      <Caption text="灯，次第亮起。" appearAt={30} bottom={150} />
    </AbsoluteFill>
  );
};

export default ShotLightsOn;
