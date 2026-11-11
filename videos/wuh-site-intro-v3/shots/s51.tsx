/* S51 · Act 8 此刻 · 局部帧 [0,94) · 94f · 绝对 6954–7048
 *
 * V2 深空数据流重构（2026-11-11）：p-music-player 截图降级为证据快闪辉光小窗
 * （0 显影 → 48–58 退场，≤2s 口径）；主角 = 线框服务节点「自建网易云 API」
 * 与连接线（20–40 CHART-DRAW 真长度）；不可播降级→HUD 读数 FALLBACK（40–52）
 * 随即切可播（52）、播放键朱红亮起（本镜唯一朱红=手作签名）、EQ 三柱起
 * （★DAT-04，60–70）；波形扩散（80–94，交接态：波形扩散成页）。
 * 与入院幕巡礼区分：这里讲的是它能用了。
 * 转场：入「切」，出「切」。字幕安全窗：start≥12、end≤82。
 * 尾帧：波形扩散。
 */
import type { FC } from 'react';
import { AbsoluteFill, Img, interpolate, useCurrentFrame } from 'remotion';
import { staticFile } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { CURVES, eqBars, inkDraw, writeFade } from '../../../brand/motion';
import { FILM_COLORS2, glowText } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { Caption } from '../components/Caption';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';

const TOTAL = 94;
// 连接线（真长度驱动，不再猜 1200）
const LINK_D = 'M 420 760 Q 760 620 1480 300';

const S51: FC = () => {
  const frame = useCurrentFrame();
  const proofIn = writeFade(frame, 0, true);
  const proofOut = interpolate(frame, [48, 58], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const lineP = interpolate(frame, [20, 40], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const grey = frame >= 40 && frame < 52;
  const playOn = frame >= 60;
  const bars = eqBars(frame);
  const cam = { scale: 1.05, x: interpolate(frame, [0, TOTAL], [30, -30], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }), y: 0, rot: 0 };

  return (
    <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep }}>
      <CameraRig cam={cam}>
        <AbsoluteFill>
          <DeepSpace seed="s51v2" stars={52} grid horizon />

          {/* 「自建网易云 API」服务节点（右上，线框 + 辉光） */}
          <div style={{ position: 'absolute', right: 260, top: 180, opacity: Number(writeFade(frame, 14).opacity ?? 0), textAlign: 'center' }}>
            <div
              style={{
                width: 220,
                height: 90,
                borderRadius: 8,
                border: `1px solid ${FILM_COLORS2.dataDim}`,
                background: FILM_COLORS2.panel,
                boxShadow: `0 0 26px rgba(212,163,115,0.16), 0 16px 40px rgba(0,0,0,0.55)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ fontFamily: fontFamilies.mono, fontSize: 19, color: FILM_COLORS2.paperWhite, ...glowText(FILM_COLORS2.data, 0.22) }}>自建网易云 API</span>
            </div>
          </div>
          {/* 连接线（CHART-DRAW 20–40，真长度；辉光双层描边） */}
          <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            <path d={LINK_D} fill="none" stroke="rgba(212,163,115,0.28)" strokeWidth={7} {...inkDraw(lineP, LINK_D)} />
            <path d={LINK_D} fill="none" stroke={FILM_COLORS2.data} strokeWidth={2} {...inkDraw(lineP, LINK_D)} opacity={0.9} />
          </svg>

          {/* 证据快闪：p-music-player 辉光小窗（0 显影 → 48–58 退场） */}
          <div
            style={{
              position: 'absolute',
              left: 120,
              bottom: 170,
              width: 330,
              zIndex: 28,
              opacity: Number(proofIn.opacity ?? 0) * proofOut,
              transform: `${proofIn.transform} scale(${interpolate(frame, [0, 12], [1.07, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })})`,
            }}
          >
            <Img
              src={staticFile('wuh-site-intro-v3/site/p-music-player-v1.png')}
              style={{
                width: '100%',
                borderRadius: 8,
                border: `1px solid ${FILM_COLORS2.dataDim}`,
                boxShadow: `0 0 30px rgba(212,163,115,0.22), 0 18px 44px rgba(0,0,0,0.6)`,
                display: 'block',
              }}
            />
            {/* 播放键状态覆盖（降级灰 → 可播朱红亮） */}
            <div
              style={{
                position: 'absolute',
                left: 152,
                top: 12,
                width: 44,
                height: 44,
                borderRadius: 22,
                background: grey ? FILM_COLORS2.textMuted : FILM_COLORS2.sealRed,
                opacity: 0.92,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: grey ? 'none' : `0 0 16px rgba(122,31,22,0.55)`,
              }}
            >
              <span style={{ color: FILM_COLORS2.paperWhite, fontSize: 17, marginLeft: grey ? 0 : 2 }}>{grey ? '—' : '▶'}</span>
            </div>
            {/* 不可播提示（40–52） */}
            {grey ? <span style={{ position: 'absolute', left: 60, bottom: -24, fontFamily: fontFamilies.mono, fontSize: 12, color: FILM_COLORS2.textMuted, opacity: 0.9 }}>不可播 · 降级切歌…</span> : null}
          </div>

          {/* EQ 三柱（60–70 起，可播即停凝住；琥珀辉光） */}
          {playOn ? (
            <div style={{ position: 'absolute', right: 320, top: 560, display: 'flex', gap: 24, alignItems: 'flex-end' }}>
              {bars.map((v, i) => (
                <div
                  key={i}
                  style={{
                    width: 30,
                    height: interpolate(frame, [60, 70], [0, 60 + v * 120], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
                    background: `linear-gradient(180deg, ${FILM_COLORS2.data}, ${FILM_COLORS2.dataDim})`,
                    opacity: 0.9,
                    borderRadius: 4,
                    boxShadow: `0 0 ${10 + v * 14}px rgba(212,163,115,${0.25 + v * 0.2})`,
                  }}
                />
              ))}
            </div>
          ) : null}
          {/* 波形扩散（尾帧交接） */}
          {playOn ? (
            <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: interpolate(frame, [80, TOTAL], [0, 0.5], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>
              {[0, 1, 2].map((i) => (
                <circle key={i} cx={960} cy={540} r={120 + i * 90 + (frame - 80) * 3} fill="none" stroke={FILM_COLORS2.data} strokeWidth={1} opacity={0.4 - i * 0.1} />
              ))}
            </svg>
          ) : null}
        </AbsoluteFill>
      </CameraRig>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 300, backgroundImage: `linear-gradient(180deg, transparent, ${FILM_COLORS2.spaceDeep})`, opacity: 0.22 }} />
      <HudChrome label="wuh.site · PLAYER" readout={frame < 40 ? 'CONNECTING · API' : frame < 60 ? 'FALLBACK · 切歌' : 'PLAYING · 可用'} />
      <Grade2 id="GR2-08" />
      <Caption text="九月，音乐播放器能用了——自己接的网易云 API。" appearAt={14} />
    </AbsoluteFill>
  );
};

export default S51;
