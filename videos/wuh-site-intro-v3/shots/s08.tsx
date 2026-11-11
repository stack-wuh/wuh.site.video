/* S08 · Act 2 旧屋 · 局部帧 [0,168) · 168f · 绝对 972–1140
 * V2 暖黑数据流（2026-11-11 风格重构）：「纸面服务牌」改写为「服务状态 HUD 瓦片」——
 * 三块线框状态瓦片：PM2 指示灯先亮（24–34 原窗=拍50）后熄（48–68 原窗，整牌退场压暗
 * 52–72），Docker 接棒起亮（84–100 原窗，88=绝对 1060=拍53 落定），Nginx 底座常亮不动；
 * 状态灯与状态读数（RUNNING/EXITED/ACTIVE）走 HUD 化叙事；曝光 −8% 原窗保留；
 * 末段 rack focus 下移到 2021-04 设计稿线框（148–168 原窗），一闪即收。
 * 转场：入「切」出「切」。字幕安全窗：start≥12、end≤156。
 * 尾帧：Docker 与 Nginx 两瓦片并亮，设计稿收回阴影——交接态语义保持。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { CURVES, writeFade } from '../../../brand/motion';
import { FILM_COLORS2 } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { Caption } from '../components/Caption';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';

const TOTAL = 168;

/** 状态瓦片：名字 + 指示灯 + 状态读数（亮/熄/常亮三态） */
const ServiceTile: FC<{
  name: string;
  x: number;
  lamp: number; // 0–1 亮度
  status: string;
  dim?: number; // 整牌退场压暗
  container?: boolean;
}> = ({ name, x, lamp, status, dim = 0, container = false }) => (
  <div style={{ position: 'absolute', left: x, top: 300, opacity: 1 - dim }}>
    <div
      style={{
        position: 'relative',
        width: 400,
        height: 200,
        borderRadius: 8,
        background: FILM_COLORS2.panel,
        border: `1px solid ${lamp > 0.4 ? FILM_COLORS2.line : FILM_COLORS2.grid}`,
        boxShadow: lamp > 0.4 ? `0 0 24px rgba(212,163,115,0.14), 0 14px 32px rgba(0,0,0,0.45)` : 'none',
      }}
    >
      {/* 指示灯（琥珀状态灯） */}
      <div
        style={{
          position: 'absolute',
          left: 28,
          top: 28,
          width: 14,
          height: 14,
          borderRadius: 7,
          background: lamp > 0.4 ? FILM_COLORS2.data : FILM_COLORS2.textMuted,
          boxShadow: lamp > 0.4 ? `0 0 14px 4px rgba(212,163,115,0.5)` : 'none',
          opacity: 0.3 + lamp * 0.7,
        }}
      />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 70, textAlign: 'center', fontFamily: fontFamilies.mono, fontSize: 40, color: FILM_COLORS2.paperWhite, opacity: 0.9 }}>
        {name}
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 128, textAlign: 'center', fontFamily: fontFamilies.mono, fontSize: 14, letterSpacing: '0.3em', color: lamp > 0.4 ? FILM_COLORS2.data : FILM_COLORS2.textMuted }}>
        {status}
      </div>
      {container ? (
        <div style={{ position: 'absolute', left: 28, right: 28, bottom: 24, height: 10 }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} style={{ position: 'absolute', left: i * 68, width: 56, height: 10, background: FILM_COLORS2.dataDim, opacity: 0.35, borderRadius: 2 }} />
          ))}
        </div>
      ) : null}
    </div>
  </div>
);

const S08: FC = () => {
  const frame = useCurrentFrame();
  const pm2Lamp = interpolate(frame, [24, 34], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) * (1 - interpolate(frame, [48, 68], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseIn }));
  const pm2Dim = interpolate(frame, [52, 72], [0, 0.55], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  // Docker 接棒（88=拍53）：回弹起亮（慢-快-慢）
  const dockerLamp = interpolate(frame, [84, 100], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineAccent });
  // 曝光 −8%（PM2 熄灭时）
  const exposure = 1 - interpolate(frame, [48, 68], [0, 0.08], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  // 末段 rack focus 下移：设计稿掠入即收
  const rack = interpolate(frame, [148, TOTAL], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const cam = {
    scale: interpolate(frame, [0, TOTAL], [1.03, 1.06], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }),
    x: interpolate(frame, [0, 20], [50, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut }),
    y: interpolate(frame, [148, TOTAL], [0, 60], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }),
    rot: 0,
  };

  return (
    <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep }}>
      <DeepSpace seed="s08v2" stars={50} grid />
      <CameraRig cam={cam}>
        <AbsoluteFill style={{ filter: `brightness(${exposure})` }}>
          {/* 服务栏标题 */}
          <div style={{ position: 'absolute', left: 160, top: 130, ...writeFade(frame, 10) }}>
            <span style={{ fontFamily: fontFamilies.mono, fontSize: 17, color: FILM_COLORS2.textMuted, letterSpacing: '0.36em' }}>SERVICES · 2021</span>
          </div>

          {/* 三块状态瓦片：PM2（熄）· Docker（亮）· Nginx（底座常亮，低强度） */}
          <ServiceTile name="PM2" x={180} lamp={pm2Lamp} status={frame >= 68 ? 'EXITED' : 'RUNNING'} dim={pm2Dim} />
          <ServiceTile name="Docker" x={760} lamp={dockerLamp} status={frame >= 100 ? 'ACTIVE' : 'BOOTING'} container />
          <ServiceTile name="Nginx" x={1340} lamp={0.35 + Math.sin(frame / 40) * 0.05} status="RUNNING" />

          {/* 阴影里的 2021-04 UI 设计稿线框（rack focus 下移时掠入） */}
          <div style={{ position: 'absolute', left: 480, top: 640, width: 960, height: 300, opacity: rack * 0.85, filter: `blur(${(1 - rack) * 3}px)` }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: 8, background: FILM_COLORS2.panel, border: `1px solid ${FILM_COLORS2.grid}` }} />
            <div style={{ position: 'absolute', left: 30, top: 30, display: 'flex', gap: 10 }}>
              {[FILM_COLORS2.sealRed, FILM_COLORS2.gold, FILM_COLORS2.data, FILM_COLORS2.textMuted].map((c, i) => (
                <div key={i} style={{ width: 44, height: 44, borderRadius: 5, background: c, opacity: 0.45 }} />
              ))}
              <span style={{ fontFamily: fontFamilies.mono, fontSize: 15, color: FILM_COLORS2.textMuted, alignSelf: 'center', marginLeft: 12 }}>2021-04 · 第一张设计稿</span>
            </div>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ position: 'absolute', left: 30, top: 110 + i * 46, width: 880 - i * 140, height: 12, background: FILM_COLORS2.paperWhite, opacity: 0.12 }} />
            ))}
          </div>
        </AbsoluteFill>
      </CameraRig>
      <HudChrome label="wuh.site · SERVICES" readout={frame >= 100 ? 'DOCKER · ACTIVE' : 'MIGRATING…'} />
      <Grade2 id="GR2-04" />
      <Caption text="2021 年，旧站长出手艺：PM2 换成 Docker，Nginx 一直没离开。" appearAt={14} />
    </AbsoluteFill>
  );
};

export default S08;
