/* S53 · Act 8 此刻 · 局部帧 [0,72) · 72f · 绝对 7192–7264
 *
 * 知识库：266 张 brief 档案卡自上方 cascade 落位成档案墙（0–50，由疏到密）；
 * 40 张知识卡自墙面升起（30–62）；★DAT-03 NUM-SLAM pair「266 / 40」双数同滚
 * 同停（44–68，落定 68=绝对 7260=拍363 对音，末帧 scale 1.05→1）；
 * 卡面真实知识卡名。转场：入「切」，出「切」。字幕安全窗：start≥12、end≤60。
 * 尾帧：档案墙+知识卡悬停。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { random } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES } from '../../../brand/motion';
import { fmtNum, slamPair } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { Caption } from '../components/Caption';
import { DustField } from '../components/DustField';
import { Grade } from '../components/Grade';
import { PaperGrain } from '../components/PaperGrain';

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
    <AbsoluteFill style={{ background: colors.bg }}>
      <CameraRig cam={cam}>
        <AbsoluteFill>
          <DustField act={8} count={16} seedBase="s53" />

          {/* 档案墙：266 卡 cascade（由疏到密——前 60 张可见代表，其余密度底纹） */}
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
                  background: colors.paperDeep,
                  border: `1px solid ${colors.hairline}`,
                  opacity: on ? 0.16 + random(`s53-${i}`) * 0.3 : 0,
                  transform: on ? `rotate(${(random(`s53-r-${i}`) - 0.5) * 2}deg)` : 'none',
                }}
              />
            );
          })}

          {/* 40 张知识卡自墙面升起（30–62） */}
          {CARD_NAMES.map((name, i) => {
            const rise = interpolate(frame, [30 + i * 3, 52 + i * 3], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
            const col = i % 5;
            const row = Math.floor(i / 5);
            return (
              <div key={name} style={{ position: 'absolute', left: 250 + col * 310, top: 180 + row * 210 - rise * 46, opacity: rise, transform: `rotate(${(i % 2 ? -1.2 : 1)}deg) translateY(${(1 - rise) * 40}px)` }}>
                <div style={{ width: 270, height: 90, borderRadius: 6, background: colors.paper, border: `1px solid ${colors.gold}`, boxShadow: '0 12px 30px rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontFamily: fontFamilies.mono, fontSize: 19, color: colors.ink, opacity: 0.85 }}>{name}</span>
                </div>
              </div>
            );
          })}

          {/* ★DAT-03 双数同滚同停 */}
          <div style={{ position: 'absolute', left: 0, right: 0, top: 96, textAlign: 'center', zIndex: 30, transform: `scale(${slam.slam})` }}>
            <span style={{ fontFamily: fontFamilies.serif, fontSize: 84, color: colors.gold, fontVariantNumeric: 'tabular-nums' }}>{fmtNum(slam.va)}</span>
            <span style={{ fontFamily: fontFamilies.serif, fontSize: 50, color: colors.muted }}> / </span>
            <span style={{ fontFamily: fontFamilies.serif, fontSize: 84, color: colors.gold, fontVariantNumeric: 'tabular-nums' }}>{fmtNum(slam.vb)}</span>
          </div>
        </AbsoluteFill>
      </CameraRig>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 300, backgroundImage: `linear-gradient(180deg, transparent, ${colors.bg})`, opacity: 0.22 }} />
      <PaperGrain opacity={0.06} />
      <Grade id="GR-08" />
      <Caption text="266 次完整循环，40 张知识卡片。" appearAt={14} />
    </AbsoluteFill>
  );
};

export default S53;
