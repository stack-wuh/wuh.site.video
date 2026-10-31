/* 镜 33 · Act 5 灯亮 · 局部帧 [0,144) · 144f
   承接 S32 全亮新站首屏（TR-05 纸页展开）：从首屏文章区 dolly-in 至一页手写感纸笺；
   《重启计划》标题逐字落下（FN-29，落定后镜头按住不动 + FN-17 轻震），
   纸笺边缘 2026-06-21 角标，页脚预留钤印位空着；纸纹与墨色可见（CM-11）；
   尾帧纸笺+空印位就绪（交接 S34：同一纸笺正俯）。 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, FILM_COLORS, letterpress, paperShake, writeFade } from '../motion-tokens';
import { Caption } from '../components/Caption';
import { DustField } from '../components/DustField';
import { Grade } from '../components/Grade';
import { PaperGrain } from '../components/PaperGrain';

const CLAMP = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const serif = fontFamilies.serif;
const sans = fontFamilies.sans;
const mono = fontFamilies.mono;

const NOTE = { left: 430, top: 120, w: 1060, h: 800 };
const TITLE = '《重启计划》';
const SEAL_SIZE = 110;
const ROWS = ['codex 的开发范式', '进取', '丧钟为谁而鸣', '2022 年度总结', '基于 TS 重构 NextJs 应用', '搬山计划', '2021 年度总结'];
const DATES = ['2026-03-07', '2022-09-25', '2022-04-04', '2022-02-08', '2021-12-05', '2021-05-07', '2021-04-08'];

const ShotRestartNote: FC = () => {
  const frame = useCurrentFrame();

  /* TR-05 纸页自文章区展开 */
  const unfold = interpolate(frame, [0, 26], [0, 1], { ...CLAMP, easing: CURVES.cineEaseOut });
  const insetX = (1 - unfold) * 34;
  const insetY = (1 - unfold) * 44;
  const tiltX = (1 - unfold) * 2;
  /* 展开完成后撤掉 clip，让纸笺投影完整可见 */
  const noteClip = unfold >= 1 ? undefined : `inset(${insetY}% ${insetX}% ${insetY}% ${insetX}%)`;
  /* CM-03 dolly-in 至纸笺，标题落定后按住不动 */
  const cam = interpolate(frame, [16, 66, 144], [1, 1.03, 1.03], { ...CLAMP, easing: CURVES.cineEaseInOut });
  const shake = paperShake(frame, 66, 1.4, 10);

  /* S32 首屏余影：随纸笺展开退为虚焦底 */
  const ghost = interpolate(frame, [8, 44], [0.9, 0.25], { ...CLAMP, easing: CURVES.cineEaseInOut });
  const ghostBlur = interpolate(frame, [8, 44], [1, 5], { ...CLAMP, easing: CURVES.cineEaseInOut });

  const rules = interpolate(frame, [40, 70], [0, 1], { ...CLAMP, easing: CURVES.cineEaseOut });
  const underline = interpolate(frame, [54, 70], [0, 1], { ...CLAMP, easing: CURVES.cineEaseOut });
  const tagIn = writeFade(frame, 58);
  const spotIn = writeFade(frame, 66);
  const spotFade = interpolate(frame, [66, 82], [0, 1], { ...CLAMP, easing: CURVES.cineEaseOut });

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ backgroundColor: colors.bg }} />
      {/* S32 首屏余影（全亮新站首屏：导航 / Hero / 文章 / 关于 / 音乐 / 热力条） */}
      <div style={{ position: 'absolute', inset: 0, opacity: ghost, filter: `blur(${ghostBlur}px)`, transform: 'scale(1.045)', transformOrigin: '50% 34%' }}>
        <div style={{ position: 'absolute', left: 130, top: 96, display: 'flex', alignItems: 'center' }}>
          <div style={{ width: 10, height: 10, background: colors.seal, transform: 'rotate(45deg)', marginRight: 14 }} />
          <span style={{ fontFamily: mono, fontSize: 24, color: colors.paper }}>wuh.site</span>
          <span style={{ display: 'flex', gap: 34, marginLeft: 60 }}>
            {['首页', '文章', '关于', '音乐'].map((t, i) => (
              <span key={t} style={{ fontFamily: sans, fontSize: 15, color: i === 1 ? colors.accent : colors.muted }}>{t}</span>
            ))}
          </span>
        </div>
        <div style={{ position: 'absolute', left: 130, top: 198, fontFamily: serif, fontSize: 64, letterSpacing: '0.1em', color: colors.paper }}>朝朝如念</div>
        <div style={{ position: 'absolute', left: 132, top: 300, fontFamily: mono, fontSize: 15, letterSpacing: '0.14em', color: colors.muted }}>a boy just ~</div>
        <div style={{ position: 'absolute', left: 130, top: 396, fontFamily: sans, fontSize: 15, letterSpacing: '0.32em', color: colors.muted }}>文章</div>
        {ROWS.map((r, i) => (
          <div key={r} style={{ position: 'absolute', left: 130, top: 440 + i * 56, width: 960, height: 56, display: 'flex', alignItems: 'center', borderBottom: `1px solid ${colors.hairline}` }}>
            <span style={{ fontFamily: serif, fontSize: 21, color: colors.paperMuted }}>{r}</span>
            <span style={{ marginLeft: 'auto', fontFamily: mono, fontSize: 13, color: colors.muted, fontVariantNumeric: 'tabular-nums' }}>{DATES[i]}</span>
          </div>
        ))}
        <div style={{ position: 'absolute', left: 1130, top: 396, width: 660, height: 240, boxSizing: 'border-box', padding: '24px 28px', background: colors.bgLift, border: `1px solid ${colors.hairline}`, borderRadius: 12 }}>
          <div style={{ fontFamily: mono, fontSize: 13, letterSpacing: '0.2em', color: colors.accent }}>关于</div>
          <div style={{ marginTop: 20, fontFamily: sans, fontSize: 18, color: colors.paperMuted }}>全栈开发者 · 写字的人</div>
          <div style={{ marginTop: 12, fontFamily: sans, fontSize: 16, color: colors.muted }}>深圳</div>
          <div style={{ marginTop: 18, fontFamily: serif, fontSize: 20, color: colors.paper }}>代码写诗，工具作画</div>
        </div>
        <div style={{ position: 'absolute', left: 1130, top: 672, width: 660, height: 210, boxSizing: 'border-box', padding: '24px 28px', background: colors.bgLift, border: `1px solid ${colors.hairline}`, borderRadius: 12 }}>
          <div style={{ fontFamily: mono, fontSize: 13, letterSpacing: '0.2em', color: colors.accent }}>音乐</div>
          <div style={{ position: 'absolute', right: 36, top: 40, width: 96, height: 96, borderRadius: '50%', border: `2px solid ${colors.muted}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: colors.seal }} />
          </div>
        </div>
        <div style={{ position: 'absolute', left: 130, top: 886, display: 'flex', gap: 4 }}>
          {Array.from({ length: 80 }, (_, i) => (
            <div key={`gh-${i}`} style={{ width: 16, height: 26, borderRadius: 3, background: colors.accent, opacity: 0.08 + ((i * 37) % 11) / 20 }} />
          ))}
        </div>
      </div>
      {/* 纸笺 */}
      <AbsoluteFill style={{ transform: `scale(${cam})`, transformOrigin: 'center' }}>
        <div style={{ position: 'absolute', left: NOTE.left, top: NOTE.top, width: NOTE.w, height: NOTE.h, perspective: 1400 }}>
          <div style={{ position: 'absolute', inset: 0, clipPath: noteClip, transform: `rotateX(${tiltX}deg)`, transformOrigin: 'center' }}>
            <div style={{ position: 'absolute', inset: 0, transform: 'rotate(-0.6deg)' }}>
              <div style={{ ...shake, position: 'absolute', inset: 0 }}>
                <div style={{ position: 'absolute', inset: 0, background: colors.paper, borderRadius: 6, border: `1px solid ${colors.hairline}`, boxShadow: `0 40px 110px ${colors.bg}` }} />
                <div style={{ position: 'absolute', inset: 0, borderRadius: 6, backgroundImage: `linear-gradient(180deg, ${FILM_COLORS.paperMist}, transparent 26%)`, mixBlendMode: 'screen', opacity: 0.55 }} />
                {/* 标题逐字落下 */}
                <div style={{ position: 'absolute', left: 76, top: 84, display: 'flex', whiteSpace: 'pre' }}>
                  {Array.from(TITLE).map((ch, i) => (
                    <span key={`${ch}-${i}`} style={{ ...letterpress(frame, 34 + i * 4.5, 4.5), display: 'inline-block', fontFamily: serif, fontSize: 72, lineHeight: 1.2, letterSpacing: '0.04em', color: colors.ink }}>{ch}</span>
                  ))}
                </div>
                <div style={{ position: 'absolute', left: 76, top: 196, width: 140, height: 2, background: colors.ink, opacity: 0.4, transform: `scaleX(${underline})`, transformOrigin: 'left center' }} />
                {/* 2026-06-21 角标 */}
                <div style={{ ...tagIn, position: 'absolute', top: 78, right: 76 }}>
                  <span style={{ display: 'inline-block', fontFamily: mono, fontSize: 15, letterSpacing: '0.08em', color: colors.seal, border: `1px solid ${colors.seal}`, borderRadius: 3, padding: '4px 10px', transform: 'rotate(1.5deg)', fontVariantNumeric: 'tabular-nums' }}>2026-06-21</span>
                </div>
                {/* 纸笺横线（手写纸感） */}
                {Array.from({ length: 6 }, (_, i) => (
                  <div key={`rule-${i}`} style={{ position: 'absolute', left: 76, right: 76, top: 300 + i * 66, height: 1, background: colors.paperMuted, opacity: 0.8 * rules }} />
                ))}
                {/* 页脚预留钤印位（空） */}
                <div style={{ ...spotIn, position: 'absolute', left: NOTE.w - 76 - SEAL_SIZE, top: NOTE.h - 76 - SEAL_SIZE, width: SEAL_SIZE, height: SEAL_SIZE, border: `1px dashed ${colors.muted}`, borderRadius: 4, opacity: 0.55 * spotFade }} />
              </div>
            </div>
          </div>
        </div>
      </AbsoluteFill>
      <DustField act={5} seedBase="s33" />
      <PaperGrain opacity={0.07} />
      <AbsoluteFill style={{ backgroundImage: `linear-gradient(0deg, ${colors.bg}, transparent 30%)`, opacity: 0.5 }} />
      <Grade id="GR-02" />
      <Caption text="一周后，他写下《重启计划》：" appearAt={26} bottom={30} />
    </AbsoluteFill>
  );
};

export default ShotRestartNote;
