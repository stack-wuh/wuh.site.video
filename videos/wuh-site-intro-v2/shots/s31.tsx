/* 镜 31 · Act 5 灯亮 · 局部帧 [0,96) · 96f
   承接 S30 满屏文章列表（TR-15）：18f 快速拉焦（CM-13）到日期「2026-06-14」，随后 40f 缓慢压暗；
   日期像发布前最后一次看表；末 10f 白光一线（TR-16，全局 3986–3996）0→30%，
   1–2px 横线宽 0→40%，禁止铺满；GR-01；尾帧黑场+白光线（交接 S32：白闪峰值 4000f）。 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, FILM_COLORS, whiteFlashOpacity } from '../motion-tokens';
import { Caption } from '../components/Caption';
import { DustField } from '../components/DustField';
import { Grade } from '../components/Grade';
import { PaperGrain } from '../components/PaperGrain';

const CLAMP = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const serif = fontFamilies.serif;
const mono = fontFamilies.mono;

/* 与 S30 同一批旧文（交接满屏列表） */
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

const ShotCutoverDate: FC = () => {
  const frame = useCurrentFrame();

  /* CM-13 18f 快速拉焦：列表虚焦、日期实焦（承接 S30 尾 2.2px 预滚） */
  const blur = interpolate(frame, [0, 18], [2.2, 7.5], { ...CLAMP, easing: CURVES.cineEaseOut });
  const zoom = interpolate(frame, [0, 60], [1.01, 1.045], { ...CLAMP, easing: CURVES.cineEaseInOut });
  /* CM-15 40f 缓慢压暗（前段先压出暗场，日期才浮得出来） */
  const dark = interpolate(frame, [8, 24, 52, 80], [0.14, 0.62, 0.9, 0.94], { ...CLAMP, easing: CURVES.cineEaseInOut });

  const dateIn = interpolate(frame, [6, 24], [0, 1], { ...CLAMP, easing: CURVES.cineEaseOut });
  const dateBlur = interpolate(frame, [6, 24], [8, 0], { ...CLAMP, easing: CURVES.cineEaseOut });
  const dateLift = interpolate(frame, [6, 24], [10, 0], { ...CLAMP, easing: CURVES.cineEaseOut });
  const dateOut = interpolate(frame, [78, 92], [1, 0], CLAMP);
  const rules = interpolate(frame, [16, 36], [0, 1], { ...CLAMP, easing: CURVES.cineEaseOut });

  /* TR-16 末 10f 一线白光（全局 3986–3996 → 局部 86–96） */
  const line = interpolate(frame, [86, 96], [0, 1], { ...CLAMP, easing: CURVES.cineEaseOut });
  const lineOpacity = whiteFlashOpacity(3900 + frame);

  const dust = Math.round(interpolate(frame, [0, 55, 82], [50, 22, 10], CLAMP));

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ backgroundColor: colors.paper }}>
        <div style={{ position: 'absolute', inset: 0, transform: `scale(${zoom})`, filter: `blur(${blur}px)`, opacity: 0.92 }}>
          {POSTS.map((p, i) => (
            <div
              key={p.title}
              style={{
                position: 'absolute',
                left: 190,
                top: 62 + i * 92,
                width: 1540,
                height: 84,
                borderRadius: 10,
                background: colors.paperDeep,
                border: `1px solid ${colors.paperMuted}`,
                display: 'flex',
                alignItems: 'center',
                gap: 24,
                padding: '0 28px',
              }}
            >
              <span style={{ fontFamily: serif, fontSize: 25, color: colors.ink, whiteSpace: 'nowrap' }}>{p.title}</span>
              <span style={{ marginLeft: 'auto', fontFamily: mono, fontSize: 15, color: colors.muted, fontVariantNumeric: 'tabular-nums' }}>{p.date}</span>
              <span style={{ fontFamily: mono, fontSize: 12, color: colors.muted, border: `1px solid ${colors.paperMuted}`, borderRadius: 10, padding: '2px 10px' }}>{p.tag}</span>
            </div>
          ))}
        </div>
      </AbsoluteFill>
      {/* 压暗：列表沉入暗场，日期留在暗场之上 */}
      <AbsoluteFill style={{ backgroundColor: colors.bg, opacity: dark }} />
      <AbsoluteFill style={{ backgroundImage: `linear-gradient(180deg, ${colors.bg}, transparent 18%)`, opacity: 0.5 }} />
      <AbsoluteFill style={{ backgroundImage: `linear-gradient(0deg, ${colors.bg}, transparent 22%)`, opacity: 0.55 }} />
      {/* 日期：从列表缝隙里浮出 */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 410,
          textAlign: 'center',
          fontFamily: mono,
          fontSize: 64,
          letterSpacing: '0.22em',
          color: colors.paper,
          fontVariantNumeric: 'tabular-nums',
          opacity: dateIn * dateOut,
          filter: `blur(${dateBlur}px)`,
          transform: `translateY(${dateLift}px)`,
          textShadow: `0 2px 30px ${colors.bg}`,
        }}
      >
        2026-06-14
      </div>
      <div style={{ position: 'absolute', left: 700, top: 505, width: 520, height: 1, background: colors.muted, opacity: 0.5 * rules, transform: `scaleX(${rules})`, transformOrigin: 'center' }} />
      {/* 末 10f 白光一线：宽 0→40%、opacity 0→0.3，不铺满 */}
      <div
        style={{
          position: 'absolute',
          left: 576,
          top: 539,
          width: 768,
          height: 2,
          background: FILM_COLORS.flashWhite,
          boxShadow: `0 0 24px ${FILM_COLORS.flashWhite}`,
          opacity: lineOpacity,
          transform: `scaleX(${line})`,
          transformOrigin: 'center',
        }}
      />
      <DustField act={5} count={dust} seedBase="s31" />
      <PaperGrain opacity={0.05} />
      <Grade id="GR-01" />
      <Caption text="六月十四日，流量切到新站。" appearAt={26} bottom={150} />
    </AbsoluteFill>
  );
};

export default ShotCutoverDate;
