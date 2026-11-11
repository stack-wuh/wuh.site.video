/* S53 · Act 8 此刻 · 局部帧 [0,72) · 72f · 绝对 7192–7264
 *
 * V2 深空数据流重构（2026-11-11）：档案墙降为线框密度底纹（60 格 cascade 0–50，
 * 原窗口、低亮度）；40 张知识卡改线框辉光芯片升起（30–62 原窗口）；
 * 数据主角化——★DAT-03 NUM-SLAM pair「266 / 40」双数同滚同停改全屏大字
 * （44–68，落定 68=绝对 7260=拍363 对音，mono 琥珀辉光，末帧 scale 1.05→1）。
 * 转场：入「切」，出「切」。字幕安全窗：start≥12、end≤60。
 * 尾帧：档案墙+知识卡悬停。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { random } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { CURVES } from '../../../brand/motion';
import { FILM_COLORS2, fmtNum, glowText, slamPair } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { Caption } from '../components/Caption';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';

const TOTAL = 72;
const SLAM_AT = 44;
const SLAM_DUR = 24; // 落定 68 = 拍363
const CARD_NAMES = ['design-system', 'animation-system', 'music-player', 'render-stability-playbook', 'tts-voiceover', 'quality-gate', 'film-identity', 'asset-registry', 'shot-pipeline', 'knowledge-loop'];

const S53: FC = () => {
  const frame = useCurrentFrame();
  const cam = {
    scale: 1.05,
    x: interpolate(frame, [0, TOTAL], [40, -30], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }),
    y: 0,
    rot: 0,
  };
  const slam = slamPair(frame, SLAM_AT, SLAM_DUR, { from: 200, to: 266 }, { from: 20, to: 40 });

  return (
    <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep }}>
      <CameraRig cam={cam}>
        <AbsoluteFill>
          <DeepSpace seed="s53v2" stars={54} grid horizon />

          {/* 档案墙：60 格线框底纹 cascade（由疏到密——低亮度密度底纹） */}
          {Array.from({ length: 60 }).map((_, i) => {
            const col = i % 12;
            const row = Math.floor(i / 12);
            const land = 2 + (row * 12 + col) * 0.8;
            const on = frame >= land;
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: 110 + col * 143,
                  top: 210 + row * 128 - (on ? 0 : 160),
                  width: 130,
                  height: 112,
                  borderRadius: 4,
                  background: FILM_COLORS2.panel,
                  border: `1px solid ${FILM_COLORS2.line}`,
                  opacity: on ? 0.1 + random(`s53-${i}`) * 0.22 : 0,
                  transform: on ? `rotate(${(random(`s53-r-${i}`) - 0.5) * 2}deg)` : 'none',
                }}
              />
            );
          })}

          {/* 40 张知识卡：线框辉光芯片自墙面升起（30–62） */}
          {CARD_NAMES.map((name, i) => {
            const rise = interpolate(frame, [30 + i * 3, 52 + i * 3], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
            const col = i % 5;
            const row = Math.floor(i / 5);
            return (
              <div key={name} style={{ position: 'absolute', left: 250 + col * 310, top: 180 + row * 210 - rise * 46, opacity: rise, transform: `rotate(${(i % 2 ? -1.2 : 1)}deg) translateY(${(1 - rise) * 40}px)` }}>
                <div
                  style={{
                    width: 270,
                    height: 90,
                    borderRadius: 6,
                    background: FILM_COLORS2.panel,
                    border: `1px solid ${FILM_COLORS2.dataDim}`,
                    boxShadow: `0 0 22px rgba(212,163,115,0.18), 0 12px 30px rgba(0,0,0,0.5)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span style={{ fontFamily: fontFamilies.mono, fontSize: 19, color: FILM_COLORS2.paperWhite, opacity: 0.9 }}>{name}</span>
                </div>
              </div>
            );
          })}

          {/* ★DAT-03 双数同滚同停（全屏大字主角，落定 SLAM） */}
          <div style={{ position: 'absolute', left: 0, right: 0, top: 60, textAlign: 'center', zIndex: 30, transform: `scale(${slam.slam})` }}>
            <span style={{ fontFamily: fontFamilies.mono, fontSize: 200, fontWeight: 700, color: FILM_COLORS2.data, fontVariantNumeric: 'tabular-nums', ...glowText(FILM_COLORS2.data, 0.5) }}>{fmtNum(slam.va)}</span>
            <span style={{ fontFamily: fontFamilies.mono, fontSize: 90, color: FILM_COLORS2.textMuted }}> / </span>
            <span style={{ fontFamily: fontFamilies.mono, fontSize: 200, fontWeight: 700, color: FILM_COLORS2.data, fontVariantNumeric: 'tabular-nums', ...glowText(FILM_COLORS2.data, 0.5) }}>{fmtNum(slam.vb)}</span>
          </div>
        </AbsoluteFill>
      </CameraRig>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 300, backgroundImage: `linear-gradient(180deg, transparent, ${FILM_COLORS2.spaceDeep})`, opacity: 0.22 }} />
      <HudChrome label="wuh.site · KNOWLEDGE" readout="266 LOOPS · 40 CARDS" />
      <Grade2 id="GR2-08" />
      <Caption text="266 次完整循环，40 张知识卡片。" appearAt={14} />
    </AbsoluteFill>
  );
};

export default S53;
