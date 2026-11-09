/* S08 · Act 2 旧屋 · 局部帧 [0,168) · 168f · 绝对 972–1140
 *
 * 工具链换代：服务栏三块服务牌——PM2 指示灯先亮（28=拍50）后熄（48–68 曝光 −8%）
 * 整牌退场，Docker 集装箱牌接棒亮起（88=绝对 1060=拍53，回弹），Nginx 底座常亮不动；
 * 末段 rack focus 下移到 2021-04 UI 设计稿（148–168），一闪即收。
 * 转场：入「切」，出「切」。
 * 字幕安全窗：start≥12、end≤156。
 * 尾帧：Docker 与 Nginx 两牌并亮，设计稿收回阴影。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, writeFade } from '../../../brand/motion';
import { CameraRig } from '../components/CameraRig';
import { Caption } from '../components/Caption';
import { DustField } from '../components/DustField';
import { Grade } from '../components/Grade';
import { PaperGrain } from '../components/PaperGrain';

const TOTAL = 168;

/** 服务牌：名字 + 指示灯（亮/熄/常亮三态） */
const ServiceCard: FC<{
  name: string;
  x: number;
  lamp: number; // 0–1 亮度
  dim?: number; // 整牌退场压暗
  container?: boolean;
}> = ({ name, x, lamp, dim = 0, container = false }) => (
  <div style={{ position: 'absolute', left: x, top: 280, opacity: 1 - dim }}>
    <div
      style={{
        position: 'relative',
        width: 400,
        height: 200,
        borderRadius: 6,
        background: colors.paperDeep,
        border: `1px solid ${colors.paperMuted}`,
        boxShadow: lamp > 0.4 ? '0 12px 30px rgba(0,0,0,0.14)' : 'none',
      }}
    >
      {/* 指示灯 */}
      <div
        style={{
          position: 'absolute',
          left: 28,
          top: 28,
          width: 14,
          height: 14,
          borderRadius: 7,
          background: lamp > 0.4 ? FILM_GREEN : colors.muted,
          boxShadow: lamp > 0.4 ? `0 0 12px 3px rgba(111,163,111,0.5)` : 'none',
          opacity: 0.3 + lamp * 0.7,
        }}
      />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 70, textAlign: 'center', fontFamily: fontFamilies.mono, fontSize: 40, color: colors.ink, opacity: 0.85 }}>
        {name}
      </div>
      {container ? (
        <div style={{ position: 'absolute', left: 28, right: 28, bottom: 24, height: 10 }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} style={{ position: 'absolute', left: i * 68, width: 56, height: 10, background: colors.muted, opacity: 0.3 }} />
          ))}
        </div>
      ) : null}
    </div>
  </div>
);

const FILM_GREEN = '#6FA36F';

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
    <AbsoluteFill style={{ background: colors.paper }}>
      <CameraRig cam={cam}>
        <AbsoluteFill style={{ filter: `brightness(${exposure})` }}>
          <DustField act={2} count={24} seedBase="s08" />

          {/* 服务栏标题（写手艺年的服务牌栏） */}
          <div style={{ position: 'absolute', left: 160, top: 150, ...writeFade(frame, 10) }}>
            <span style={{ fontFamily: fontFamilies.mono, fontSize: 18, color: colors.muted, letterSpacing: '0.3em' }}>SERVICES · 2021</span>
          </div>

          {/* 三块服务牌：PM2（熄）· Docker（亮）· Nginx（底座常亮，低强度） */}
          <ServiceCard name="PM2" x={180} lamp={pm2Lamp} dim={pm2Dim} />
          <ServiceCard name="Docker" x={760} lamp={dockerLamp} container />
          <ServiceCard name="Nginx" x={1340} lamp={0.35 + Math.sin(frame / 40) * 0.05} />

          {/* 阴影里的 2021-04 UI 设计稿（rack focus 下移时掠入） */}
          <div style={{ position: 'absolute', left: 480, top: 640, width: 960, height: 300, opacity: rack * 0.85, filter: `blur(${(1 - rack) * 3}px)` }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: 6, background: colors.paperDeep, border: `1px solid ${colors.paperMuted}` }} />
            <div style={{ position: 'absolute', left: 30, top: 30, display: 'flex', gap: 10 }}>
              {[0, 1, 2, 3].map((i) => (
                <div key={i} style={{ width: 44, height: 44, borderRadius: 4, background: [colors.seal, colors.gold, colors.ink, colors.muted][i], opacity: 0.45 }} />
              ))}
              <span style={{ fontFamily: fontFamilies.mono, fontSize: 15, color: colors.muted, alignSelf: 'center', marginLeft: 12 }}>2021-04 · 第一张设计稿</span>
            </div>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ position: 'absolute', left: 30, top: 110 + i * 46, width: 880 - i * 140, height: 14, background: colors.muted, opacity: 0.22 }} />
            ))}
          </div>
        </AbsoluteFill>
      </CameraRig>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 320, backgroundImage: `linear-gradient(180deg, transparent, ${colors.bg})`, opacity: 0.2 }} />
      <PaperGrain opacity={0.07} />
      <Grade id="GR-04" />
      <Caption text="2021 年，旧站长出手艺：PM2 换成 Docker，Nginx 一直没离开。" appearAt={14} />
    </AbsoluteFill>
  );
};

export default S08;
