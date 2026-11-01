/* 镜 53 · Act 8 此刻 · 局部帧 [0,190) · 190f
   播放器淡出为工作流页面（TR-06 承接）：六阶段 proposal → discuss → apply → review →
   archive → commit 横向排开、缓慢左移（FN-13 传送带 + 半拍高亮流过）；
   金句两段式落定——前半「不是当加速器」先出，后半「而是给 AI 装上边界和刹车」
   局部 160f（全局 6960f 第 349 拍）压轴落定、镜头停推（CM-03 + CM-15）；
   尾 24f 六阶段沉为底纹（TR-07 同配方）；GR-02。 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, writeFade } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { DustField } from '../components/DustField';
import { PaperGrain } from '../components/PaperGrain';
import { Grade } from '../components/Grade';
import { Caption } from '../components/Caption';

const CLAMP = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const QUOTE_END = 160;

const mono = fontFamilies.mono;
const serif = fontFamilies.serif;

const STAGES = ['proposal', 'discuss', 'apply', 'review', 'archive', 'commit'];
const BOX_W = 200;
const ARROW_W = 44;

const ShotWorkflowPage: FC = () => {
  const frame = useCurrentFrame();
  /* CM-03 正面缓推至金句落定即停 */
  const push = interpolate(frame, [0, QUOTE_END], [1, 1.045], { ...CLAMP, easing: CURVES.cineEaseInOut });
  /* 六阶段传送带：缓慢左移（CM-15 缓档） */
  const conveyor = interpolate(frame, [0, QUOTE_END], [0, -96], { ...CLAMP, easing: CURVES.cineEaseInOut });
  const active = Math.min(STAGES.length - 1, Math.floor(frame / 16));
  /* 金句：前半先出、后半压轴 */
  const line1 = writeFade(frame, 36, true);
  const line2 = writeFade(frame, QUOTE_END - 28, true);
  const underline = interpolate(frame, [QUOTE_END - 10, QUOTE_END], [0, 1], { ...CLAMP, easing: CURVES.cineEaseOut });
  const citation = writeFade(frame, QUOTE_END - 4);
  const head = writeFade(frame, 8);
  /* 入场：承接 s52 尾帧工作流文档（TR-06 镜头内显影） */
  const enter = interpolate(frame, [0, 10], [0, 1], { ...CLAMP, easing: CURVES.cineEaseOut });
  /* 尾段：六阶段沉为底纹 */
  const sink = interpolate(frame, [166, 190], [0, 1], { ...CLAMP, easing: CURVES.cineEaseInOut });

  return (
    <AbsoluteFill style={{ background: colors.paper }}>
      <CameraRig cam={{ scale: push, x: 0, y: 0, rot: 0 }}>
        <AbsoluteFill style={{ opacity: 0.45 + 0.55 * enter, filter: `blur(${(1 - enter) * 5}px)` }}>
          <DustField act={8} seedBase="s53" />
          {/* 页眉 */}
          <div style={{ ...head, position: 'absolute', left: 140, top: 92, fontFamily: mono, fontSize: 15, letterSpacing: '0.16em', color: colors.muted }}>wuh.site / topics</div>
          <div style={{ ...head, position: 'absolute', right: 140, top: 92, fontFamily: mono, fontSize: 15, letterSpacing: '0.16em', color: colors.muted, fontVariantNumeric: 'tabular-nums' }}>#172 · 2026-10-07</div>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 150, textAlign: 'center', ...head, fontFamily: serif, fontSize: 40, color: colors.ink }}>Vibe Coding Workflow 概述</div>
          <div style={{ position: 'absolute', left: 900, top: 208, width: 120, height: 1, background: colors.ink, opacity: 0.35 * Number(head.opacity ?? 0) }} />
          {/* 六阶段传送带 */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 690,
              transform: `translateX(${250 + conveyor}px) scale(${1 - sink * 0.02})`,
              transformOrigin: 'center',
              opacity: 1 - sink * 0.78,
              filter: `blur(${sink * 2}px)`,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {STAGES.map((s, i) => (
              <div key={s} style={{ display: 'flex', alignItems: 'center' }}>
                <div
                  style={{
                    width: BOX_W,
                    height: 96,
                    boxSizing: 'border-box',
                    border: `1px solid ${i === active ? colors.accent : colors.paperMuted}`,
                    background: colors.paperDeep,
                    borderRadius: 4,
                    padding: '12px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <span style={{ fontFamily: mono, fontSize: 11, letterSpacing: '0.2em', color: colors.muted, fontVariantNumeric: 'tabular-nums' }}>0{i + 1}</span>
                  <span style={{ fontFamily: mono, fontSize: 21, letterSpacing: '0.04em', color: colors.ink }}>{s}</span>
                  <span style={{ display: 'block', height: 2, width: '58%', borderRadius: 1, background: colors.accent, opacity: i === active ? 0.9 : 0.15 }} />
                </div>
                {i < STAGES.length - 1 ? (
                  <div style={{ width: ARROW_W, textAlign: 'center', fontFamily: mono, fontSize: 22, color: colors.muted, opacity: 0.55 }}>→</div>
                ) : null}
              </div>
            ))}
          </div>
          {/* 金句：两段式落定 */}
          <div style={{ position: 'absolute', left: 0, right: 0, top: 300, textAlign: 'center' }}>
            <div style={{ ...line1, fontFamily: serif, fontSize: 58, lineHeight: 1.4, letterSpacing: '0.02em', color: colors.ink }}>工作流存在的意义不是当加速器，</div>
            <div style={{ ...line2, marginTop: 30, fontFamily: serif, fontSize: 62, lineHeight: 1.4, letterSpacing: '0.02em', color: colors.ink }}>而是给 AI 装上边界和刹车。</div>
            <div style={{ width: 620, height: 2, margin: '22px auto 0', background: colors.accent, opacity: 0.75, transform: `scaleX(${underline})`, transformOrigin: 'center' }} />
            <div style={{ ...citation, marginTop: 20, fontFamily: mono, fontSize: 14, letterSpacing: '0.1em', color: colors.muted, fontVariantNumeric: 'tabular-nums' }}>
              ──《Vibe Coding Workflow 概述》· 2026-10-07
            </div>
          </div>
        </AbsoluteFill>
      </CameraRig>
      <PaperGrain opacity={0.05} />
      <Grade id="GR-02" />
      <Caption text="十月，他写道：『工作流存在的意义不是当加速器，而是给 AI 装上边界和刹车。』" appearAt={30} />
    </AbsoluteFill>
  );
};

export default ShotWorkflowPage;
