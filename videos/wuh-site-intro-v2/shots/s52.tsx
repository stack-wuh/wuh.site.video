/* 镜 52 · Act 8 此刻 · 局部帧 [0,150) · 150f
   光点密轴（TR-02 入场 8f）→ 音乐页：440px 迷你播放器滑入（FN-12），
   连接线连向「自建网易云 API」节点（FN-21）；夜航不可播触发降级（FN-08 播放键变灰、
   显示「不可播」，画面 2% 回拉），随后切到可播曲目，波形与三墨柱 EQ 起（FN-07，全局 6760f）；
   不出现黑胶特写；尾 18f 波形扩散成整页工作流文档（TR-06）；GR-02。 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, cardFly, dyeDrain, eqBars, lightOn, lineReplace, marqueeDrift, pathDraw, writeFade } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { DustField } from '../components/DustField';
import { PaperGrain } from '../components/PaperGrain';
import { Grade } from '../components/Grade';
import { Caption } from '../components/Caption';

const CLAMP = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const DEGRADE = 66;
const SWITCH = 110;
const SPREAD = 132;

const mono = fontFamilies.mono;
const serif = fontFamilies.serif;

const BARS = Array.from({ length: 26 }).map((_, i) => i);

const ShotMusicPlayer: FC = () => {
  const frame = useCurrentFrame();
  /* CM-11 微距对准播放器 → 拉焦 API 线 → 降级 2% 回拉 → 推近播放键 → 释放 */
  const camScale =
    frame < 36
      ? interpolate(frame, [0, 36], [1.06, 1], { ...CLAMP, easing: CURVES.cineEaseInOut })
      : frame < 64
        ? interpolate(frame, [36, 64], [1, 1.025], { ...CLAMP, easing: CURVES.cineEaseInOut })
        : frame < 80
          ? interpolate(frame, [64, 80], [1.025, 1], { ...CLAMP, easing: CURVES.cineEaseInOut })
          : frame < SWITCH
            ? 1
            : frame < 126
              ? interpolate(frame, [SWITCH, 126], [1, 1.04], { ...CLAMP, easing: CURVES.cineEaseInOut })
              : frame < SPREAD
                ? 1.04
                : interpolate(frame, [SPREAD, 150], [1.04, 1], { ...CLAMP, easing: CURVES.cineEaseInOut });
  const camOrigin = frame < 36 ? '22% 74%' : frame < 80 ? '72% 38%' : '24% 78%';

  const playerIn = cardFly(frame, 6, 22, { x: -36, y: 120, rot: -1.2, scale: 0.96 }, { x: 0, y: 0, rot: 0, scale: 1 });
  const apiLine = pathDraw(frame, 30, 16, 940);
  const apiOn = lightOn(frame, 46, 30);
  const unplayable = frame >= DEGRADE && frame < SWITCH;
  const drain = unplayable ? dyeDrain(frame, DEGRADE) : undefined;
  const lr = lineReplace(frame, SWITCH, 12);
  const playing = interpolate(frame, [SWITCH, SWITCH + 8], [0, 1], { ...CLAMP, easing: CURVES.cineEaseOut });
  const eq = eqBars(frame);
  const badgeIn = writeFade(frame, DEGRADE + 6);
  const badgeOut = interpolate(frame, [SWITCH, SWITCH + 6], [1, 0], CLAMP);
  const progress = frame >= SWITCH ? interpolate(frame, [SWITCH, 150], [0, 0.42], CLAMP) : 0.05;
  const enterVeil = interpolate(frame, [0, 10], [0.92, 0], CLAMP);
  const spreadP = interpolate(frame, [SPREAD, 150], [0, 1], { ...CLAMP, easing: CURVES.cineEaseInOut });

  return (
    <AbsoluteFill style={{ background: colors.paper }}>
      <CameraRig cam={{ scale: camScale, x: 0, y: 0, rot: 0, origin: camOrigin }}>
        <AbsoluteFill>
          <DustField act={8} seedBase="s52" />
          {/* 页眉 */}
          <div style={{ position: 'absolute', left: 140, top: 92, fontFamily: mono, fontSize: 15, letterSpacing: '0.16em', color: colors.muted }}>wuh.site / music</div>
          <div style={{ position: 'absolute', right: 140, top: 92, fontFamily: mono, fontSize: 15, letterSpacing: '0.16em', color: colors.muted, fontVariantNumeric: 'tabular-nums' }}>#394 · 2026-09-28</div>
          <div style={{ position: 'absolute', left: 140, right: 140, top: 130, height: 1, background: colors.paperMuted, opacity: 0.6 }} />
          {/* 页面标题 */}
          <div style={{ ...writeFade(frame, 10), position: 'absolute', left: 140, top: 168, fontFamily: serif, fontSize: 46, color: colors.ink }}>音乐年轮</div>
          <div style={{ ...writeFade(frame, 16), position: 'absolute', left: 140, top: 238, fontFamily: mono, fontSize: 14, letterSpacing: '0.16em', color: colors.muted }}>自建 API · 降级兜底 · 440px 迷你播放器</div>
          {/* API 连接线（FN-21） */}
          <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
            <path d="M 580 780 C 880 750 1080 520 1380 400" fill="none" stroke={colors.accent} strokeWidth={1.6} strokeLinecap="round" opacity={0.8} style={apiLine} />
          </svg>
          {/* 自建网易云 API 服务节点 */}
          <div
            style={{
              ...apiOn,
              position: 'absolute',
              left: 1380,
              top: 330,
              width: 320,
              height: 132,
              background: colors.paperDeep,
              border: `1px solid ${colors.paperMuted}`,
              borderRadius: 10,
              padding: '16px 20px',
            }}
          >
            <div style={{ fontFamily: mono, fontSize: 12, letterSpacing: '0.24em', color: colors.accent, fontVariantNumeric: 'tabular-nums' }}>SELF-HOSTED · SERVICE</div>
            <div style={{ marginTop: 8, fontFamily: serif, fontSize: 26, color: colors.ink }}>自建网易云 API</div>
            <div style={{ marginTop: 8, fontFamily: mono, fontSize: 13, color: colors.muted }}>api.wuh.site / music</div>
            <div style={{ position: 'absolute', right: 16, top: 16, width: 8, height: 8, borderRadius: 4, background: colors.accent, boxShadow: `0 0 12px ${colors.accent}` }} />
          </div>
          {/* 440px 迷你播放器（FN-12 滑入） */}
          <div
            style={{
              ...playerIn,
              position: 'absolute',
              left: 140,
              top: 700,
              width: 440,
              height: 232,
              background: colors.paperDeep,
              border: `1px solid ${colors.paperMuted}`,
              borderRadius: 12,
            }}
          >
            {/* 封面：抽象纸面（不出现黑胶特写） */}
            <div
              style={{
                position: 'absolute',
                left: 18,
                top: 18,
                width: 108,
                height: 108,
                borderRadius: 6,
                background: `linear-gradient(135deg, ${colors.accent}, ${colors.seal})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ fontFamily: serif, fontSize: 44, color: colors.paper, opacity: 0.9 }}>音</span>
            </div>
            {/* 曲目 */}
            <div style={{ opacity: lr.opacity, position: 'absolute', left: 144, top: 22, fontFamily: serif, fontSize: 24, color: colors.ink }}>
              {frame < SWITCH + 6 ? '夜航' : '雾中电台'}
            </div>
            <div style={{ position: 'absolute', left: 144, top: 60, fontFamily: mono, fontSize: 13, color: colors.muted }}>
              {frame < SWITCH + 6 ? '未知歌手 · 版权不可用' : 'wuh.site mix · 自建 API'}
            </div>
            {/* 波形 */}
            <div style={{ position: 'absolute', left: 144, top: 88, width: 190, height: 30, display: 'flex', alignItems: 'flex-end', gap: 3 }}>
              {BARS.map((i) => {
                const wave = 0.18 + Math.abs(Math.sin(frame / 5.2 + i * 0.55)) * 0.82;
                return (
                  <div
                    key={i}
                    style={{
                      width: 4,
                      height: 30,
                      borderRadius: 2,
                      background: colors.ink,
                      opacity: 0.22 + playing * 0.58,
                      transform: `scaleY(${0.14 + playing * wave * 0.86})`,
                      transformOrigin: 'bottom',
                    }}
                  />
                );
              })}
            </div>
            {/* 进度与时间 */}
            <div style={{ position: 'absolute', left: 144, top: 130, width: 190, height: 3, borderRadius: 1.5, background: colors.paperMuted }}>
              <div style={{ width: 190, height: 3, borderRadius: 1.5, background: colors.accent, transform: `scaleX(${progress})`, transformOrigin: 'left center' }} />
            </div>
            <div style={{ position: 'absolute', left: 144, top: 140, fontFamily: mono, fontSize: 11, color: colors.muted, fontVariantNumeric: 'tabular-nums' }}>
              {frame < SWITCH ? '0:00 / --:--' : '0:42 / 4:08'}
            </div>
            {/* 不可播降级徽标 */}
            <div
              style={{
                ...badgeIn,
                opacity: Number(badgeIn.opacity ?? 0) * badgeOut,
                position: 'absolute',
                right: 16,
                top: 62,
                fontFamily: mono,
                fontSize: 12,
                color: colors.seal,
                border: `1px solid ${colors.seal}`,
                borderRadius: 3,
                padding: '2px 8px',
              }}
            >
              不可播
            </div>
            {/* 播放键（降级变灰 FN-08；可播起恢复 accent） */}
            <div
              style={{
                position: 'absolute',
                right: 20,
                top: 96,
                width: 56,
                height: 56,
                borderRadius: 28,
                background: unplayable ? colors.paperMuted : colors.accent,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                ...(drain ?? {}),
              }}
            >
              <div style={{ width: 0, height: 0, borderTop: '9px solid transparent', borderBottom: '9px solid transparent', borderLeft: `15px solid ${colors.paper}`, marginLeft: 4 }} />
            </div>
            {/* 三墨柱 EQ */}
            <div style={{ position: 'absolute', right: 92, top: 104, height: 40, display: 'flex', alignItems: 'flex-end', gap: 6, opacity: playing }}>
              {eq.map((v, i) => (
                <div key={i} style={{ width: 8, height: 40, background: colors.ink, opacity: 0.8, transform: `scaleY(${0.2 + v * 0.8})`, transformOrigin: 'bottom' }} />
              ))}
            </div>
            {/* 跑马灯 */}
            <div style={{ position: 'absolute', left: 144, right: 18, bottom: 12, height: 14, overflow: 'hidden', opacity: 0.55 }}>
              <div style={{ fontFamily: mono, fontSize: 11, color: colors.muted, whiteSpace: 'nowrap', ...marqueeDrift(frame, 30) }}>
                wuh.site · 自建网易云 API · 降级兜底 · wuh.site · 自建网易云 API · 降级兜底 · wuh.site · 自建网易云 API
              </div>
            </div>
          </div>
        </AbsoluteFill>
      </CameraRig>
      {/* TR-02 入场：光点密轴 → 纸面 */}
      <AbsoluteFill style={{ background: colors.bg, opacity: enterVeil }} />
      {/* 切曲低强度闪（FN-15 flash 驱动） */}
      <AbsoluteFill style={{ background: colors.paper, opacity: lr.flash * 0.45 }} />
      {/* 尾帧：波形扩散成整页工作流文档（TR-06 预滚） */}
      {spreadP > 0 ? (
        <AbsoluteFill
          style={{
            clipPath: `inset(${72 * (1 - spreadP)}% ${76 * (1 - spreadP)}% ${12 * (1 - spreadP)}% ${16 * (1 - spreadP)}%)`,
            background: colors.paper,
            border: `1px solid ${colors.paperMuted}`,
          }}
        >
          <div style={{ position: 'absolute', left: 140, top: 96, fontFamily: mono, fontSize: 15, letterSpacing: '0.16em', color: colors.muted }}>wuh.site / workflow · #172</div>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 300, textAlign: 'center', fontFamily: serif, fontSize: 42, color: colors.ink }}>Vibe Coding Workflow 概述</div>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 420, textAlign: 'center', fontFamily: mono, fontSize: 18, letterSpacing: '0.08em', color: colors.muted }}>proposal → discuss → apply → review → archive → commit</div>
        </AbsoluteFill>
      ) : null}
      <PaperGrain opacity={0.06} />
      <Grade id="GR-02" />
      <Caption text="九月，音乐播放器能用了——自己接的网易云 API。" appearAt={26} bottom={44} />
    </AbsoluteFill>
  );
};

export default ShotMusicPlayer;
