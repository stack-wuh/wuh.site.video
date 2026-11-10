/* S51 · Act 8 此刻 · 局部帧 [0,94) · 94f · 绝对 6954–7048
 *
 * 播放器能用了：p-music-player 前景滑入接管画面（0–18）；连接线连向
 * 「自建网易云 API」服务节点（20–40，CHART-DRAW）；一首不可播曲目触发降级
 * （播放键变灰 40–52）随即切到可播曲目（52–60）、三墨柱 EQ 起（★DAT-04，
 * 60–70）；可播起时播放键亮起、画面即停。与入院幕巡礼区分：这里讲的是它能用了。
 * 转场：入「切」，出「切」。字幕安全窗：start≥12、end≤82。
 * 尾帧：波形扩散。
 */
import type { FC } from 'react';
import { AbsoluteFill, Img, interpolate, useCurrentFrame } from 'remotion';
import { staticFile } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, eqBars, inkDraw, writeFade } from '../../../brand/motion';
import { eqBars as _eq } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { Caption } from '../components/Caption';
import { DustField } from '../components/DustField';
import { Grade } from '../components/Grade';
import { PaperGrain } from '../components/PaperGrain';

const TOTAL = 94;
void _eq;

const S51: FC = () => {
  const frame = useCurrentFrame();
  const playerIn = writeFade(frame, 0, true);
  const lineP = interpolate(frame, [20, 40], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  // 连接线（真长度驱动，不再猜 1200）
  const LINK_D = 'M 420 760 Q 760 620 1480 300';
  const grey = frame >= 40 && frame < 52;
  const playOn = frame >= 60;
  const bars = eqBars(frame);
  const cam = { scale: 1.05, x: interpolate(frame, [0, TOTAL], [30, -30], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }), y: 0, rot: 0 };

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <CameraRig cam={cam}>
        <AbsoluteFill>
          <DustField act={8} count={12} seedBase="s51" />

          {/* 「自建网易云 API」服务节点（右上） */}
          <div style={{ position: 'absolute', right: 260, top: 180, opacity: writeFade(frame, 14).opacity, textAlign: 'center' }}>
            <div style={{ width: 180, height: 90, borderRadius: 8, border: `1px solid ${colors.hairline}`, background: colors.terminalBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: fontFamilies.mono, fontSize: 18, color: colors.paper, opacity: 0.85 }}>自建网易云 API</span>
            </div>
          </div>
          {/* 连接线（CHART-DRAW 20–40） */}
          <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            <path d={LINK_D} fill="none" stroke={colors.gold} strokeWidth={2} {...inkDraw(lineP, LINK_D)} opacity={0.8} />
          </svg>

          {/* p-music-player 前景（左下滑入接管） */}
          <div style={{ position: 'absolute', left: 120, bottom: 170, width: 440, ...playerIn }}>
            <Img src={staticFile('wuh-site-intro-v3/site/p-music-player-v1.png')} style={{ width: '100%', borderRadius: 12, border: `1px solid ${colors.hairline}`, boxShadow: '0 24px 60px rgba(0,0,0,0.5)' }} />
            {/* 播放键状态覆盖（降级灰 → 可播亮） */}
            <div style={{ position: 'absolute', left: 218, top: 18, width: 54, height: 54, borderRadius: 27, background: grey ? colors.muted : colors.seal, opacity: 0.9, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: colors.paper, fontSize: 20, marginLeft: grey ? 0 : 3 }}>{grey ? '—' : '▶'}</span>
            </div>
            {/* 不可播提示（40–52） */}
            {grey ? <span style={{ position: 'absolute', left: 96, top: 78, fontFamily: fontFamilies.mono, fontSize: 12, color: colors.muted, opacity: 0.9 }}>不可播 · 降级切歌…</span> : null}
          </div>

          {/* 三墨柱 EQ 起（60–70，可播即停凝住） */}
          {playOn ? (
            <div style={{ position: 'absolute', right: 320, top: 560, display: 'flex', gap: 24, alignItems: 'flex-end' }}>
              {bars.map((v, i) => (
                <div key={i} style={{ width: 30, height: interpolate(frame, [60, 70], [0, 60 + v * 120], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }), background: colors.ink, opacity: 0.85, borderRadius: 4 }} />
              ))}
            </div>
          ) : null}
          {/* 波形扩散（尾帧交接） */}
          {playOn ? (
            <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: interpolate(frame, [80, TOTAL], [0, 0.5], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>
              {[0, 1, 2].map((i) => (
                <circle key={i} cx={960} cy={540} r={120 + i * 90 + (frame - 80) * 3} fill="none" stroke={colors.gold} strokeWidth={1} opacity={0.4 - i * 0.1} />
              ))}
            </svg>
          ) : null}
        </AbsoluteFill>
      </CameraRig>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 300, backgroundImage: `linear-gradient(180deg, transparent, ${colors.bg})`, opacity: 0.22 }} />
      <PaperGrain opacity={0.05} />
      <Grade id="GR-08" />
      <Caption text="九月，音乐播放器能用了——自己接的网易云 API。" appearAt={14} />
    </AbsoluteFill>
  );
};

export default S51;
