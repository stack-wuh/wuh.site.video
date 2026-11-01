/* 镜 10 · Act 2 旧屋 · 局部帧 [0,126) · 126f
   正面中景横移（慢-快-慢）：PM2 指示灯 44f 亮、94f 熄并整牌退场，曝光降 8%；
   Docker 集装箱牌 94f 接棒亮起（CV-04 微回弹），Nginx 底座常亮不动；字幕「2021 年，旧站长出手艺：PM2 换成 Docker，」。 */
import type { CSSProperties, FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, glowPulse, lightOn } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { Caption } from '../components/Caption';
import { DustField } from '../components/DustField';
import { PaperGrain } from '../components/PaperGrain';
import { Grade } from '../components/Grade';

const PM2_ON = 44;
const SWAP = 94;

const Lamp: FC<{ on: boolean; style?: CSSProperties }> = ({ on, style }) => (
  <div
    style={{
      width: 18,
      height: 18,
      borderRadius: 9,
      background: on ? colors.accent : colors.muted,
      opacity: on ? 1 : 0.35,
      boxShadow: on ? `0 0 16px ${colors.accent}` : 'none',
      ...style,
    }}
  />
);

const ShotServiceSwap: FC = () => {
  const frame = useCurrentFrame();
  const pan = interpolate(frame, [0, 30, 96, 126], [16, 24, -22, -14], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const dip = interpolate(frame, [SWAP, SWAP + 6, SWAP + 18], [0, 0.08, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const exit = interpolate(frame, [SWAP, 114], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseIn });
  const pm2On = frame >= PM2_ON && frame < SWAP;
  const dockerOn = frame >= SWAP;
  const cam = { scale: 1.04, x: pan, y: 0, rot: 0 };

  return (
    <AbsoluteFill>
      <CameraRig cam={cam}>
        <AbsoluteFill style={{ background: colors.paper, filter: `brightness(${1 - dip})` }}>
          <div style={{ position: 'absolute', left: 150, right: 150, top: 92, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontFamily: fontFamilies.serif, fontSize: 44, color: colors.ink, opacity: 0.9 }}>服务</span>
            <span style={{ fontFamily: fontFamilies.mono, fontSize: 19, letterSpacing: '0.18em', color: colors.ink, opacity: 0.5, fontVariantNumeric: 'tabular-nums' }}>2021-03-19 · SERVICES</span>
          </div>
          <div style={{ position: 'absolute', left: 150, right: 150, top: 190, height: 1, background: colors.ink, opacity: 0.12 }} />

          <div
            style={{
              position: 'absolute',
              left: 470,
              top: 316,
              width: 360,
              height: 264,
              transform: `translateX(${-exit * 880}px) rotate(${-exit * 5}deg)`,
              opacity: 1 - exit * 0.85,
            }}
          >
            <div style={{ position: 'absolute', inset: 0, borderRadius: 10, background: colors.paperDeep, border: `1px solid ${colors.hairline}`, boxShadow: `0 24px 50px ${colors.bg}` }} />
            <div style={{ position: 'absolute', left: 28, top: 26, fontFamily: fontFamilies.mono, fontSize: 24, letterSpacing: '0.26em', color: colors.ink, opacity: 0.8 }}>PM2</div>
            <div style={{ position: 'absolute', left: 28, top: 88, display: 'flex', alignItems: 'center', gap: 16 }}>
              <Lamp on={pm2On} style={pm2On ? lightOn(frame, PM2_ON, 30) : undefined} />
              <span style={{ fontFamily: fontFamilies.mono, fontSize: 18, letterSpacing: '0.16em', color: colors.ink, opacity: 0.66, fontVariantNumeric: 'tabular-nums' }}>
                {frame < PM2_ON ? 'STANDBY' : frame < SWAP ? 'RUNNING' : 'STOPPED'}
              </span>
            </div>
            <div style={{ position: 'absolute', left: 28, right: 28, bottom: 66, height: 8, borderRadius: 2, background: colors.ink, opacity: 0.08 }} />
            <div style={{ position: 'absolute', left: 28, bottom: 28, fontFamily: fontFamilies.mono, fontSize: 15, letterSpacing: '0.1em', color: colors.ink, opacity: 0.36, fontVariantNumeric: 'tabular-nums' }}>cluster · pid 3291</div>
          </div>

          <div style={{ position: 'absolute', left: 1046, top: 316, width: 360, height: 264 }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: 10, background: colors.paperDeep, border: `1px solid ${colors.hairline}`, boxShadow: `0 24px 50px ${colors.bg}` }} />
            <div style={{ position: 'absolute', left: 28, top: 26, fontFamily: fontFamilies.mono, fontSize: 24, letterSpacing: '0.26em', color: colors.ink, opacity: 0.8 }}>DOCKER</div>
            <div style={{ position: 'absolute', right: 30, top: 28, display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
              {[78, 58, 40].map((w) => (
                <div key={w} style={{ width: w, height: 16, borderRadius: 2, border: `1px solid ${colors.ink}`, opacity: 0.22 }} />
              ))}
            </div>
            <div style={{ position: 'absolute', left: 28, top: 88, display: 'flex', alignItems: 'center', gap: 16 }}>
              <Lamp on={dockerOn} style={dockerOn ? lightOn(frame, SWAP, 30) : undefined} />
              <span style={{ fontFamily: fontFamilies.mono, fontSize: 18, letterSpacing: '0.16em', color: colors.ink, opacity: 0.66, fontVariantNumeric: 'tabular-nums' }}>{dockerOn ? 'RUNNING' : 'QUEUED'}</span>
            </div>
            <div style={{ position: 'absolute', left: 28, right: 28, bottom: 66, height: 8, borderRadius: 2, background: colors.ink, opacity: 0.08 }} />
            <div style={{ position: 'absolute', left: 28, bottom: 28, fontFamily: fontFamilies.mono, fontSize: 15, letterSpacing: '0.1em', color: colors.ink, opacity: 0.36, fontVariantNumeric: 'tabular-nums' }}>container · 2021-03</div>
          </div>

          <div style={{ position: 'absolute', left: 700, top: 660, width: 560, height: 196 }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: 12, background: colors.paperMuted, border: `1px solid ${colors.hairline}`, boxShadow: `0 20px 44px ${colors.bg}` }} />
            <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 12, borderRadius: '0 0 12px 12px', background: colors.ink, opacity: 0.16 }} />
            <div style={{ position: 'absolute', left: 32, top: 26, fontFamily: fontFamilies.mono, fontSize: 24, letterSpacing: '0.26em', color: colors.ink, opacity: 0.8 }}>NGINX</div>
            <div style={{ position: 'absolute', left: 32, top: 88, display: 'flex', alignItems: 'center', gap: 16 }}>
              <Lamp on style={glowPulse(frame, 0.4)} />
              <span style={{ fontFamily: fontFamilies.mono, fontSize: 18, letterSpacing: '0.16em', color: colors.ink, opacity: 0.66 }}>STABLE · 常亮</span>
            </div>
            <div style={{ position: 'absolute', right: 32, top: 34, fontFamily: fontFamilies.mono, fontSize: 15, letterSpacing: '0.1em', color: colors.ink, opacity: 0.36 }}>reverse proxy · since 2020</div>
          </div>

          <div style={{ position: 'absolute', left: 150, right: 150, top: 952, height: 1, background: colors.ink, opacity: 0.1 }} />
        </AbsoluteFill>
        <DustField act={2} seedBase="s10" />
      </CameraRig>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 320, background: `linear-gradient(0deg, ${colors.bg} 0%, transparent 55%)`, opacity: 0.45, pointerEvents: 'none' }} />
      <PaperGrain opacity={0.07} />
      <Grade id="GR-01" />
      <Grade id="GR-04" />
      <Caption text="2021 年，旧站长出手艺：PM2 换成 Docker，" appearAt={26} />
    </AbsoluteFill>
  );
};

export default ShotServiceSwap;
