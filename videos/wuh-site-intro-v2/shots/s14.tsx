/* 镜 14 · Act 2 旧屋 · 局部帧 [0,132) · 132f
   TR-09：编辑器缩为终端旁窗；GitHub Actions 流水线纵向展开，构建 / 测试 / 部署三节点 44/76/108f 依次转绿
   （statusGreen 全片仅此镜）；末段 100→105% 推近绿灯，其余界面沉入暗部；字幕「十二月，GitHub Actions 第一次替他部署。」。 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, FILM_COLORS, pipelineNode } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { Caption } from '../components/Caption';
import { DustField } from '../components/DustField';
import { PaperGrain } from '../components/PaperGrain';
import { Grade } from '../components/Grade';

const NODES = [
  { label: '构建', status: 'build · node 16', y: 348, at: 44 },
  { label: '测试', status: 'test · 142 passed', y: 500, at: 76 },
  { label: '部署', status: 'deploy · pages', y: 652, at: 108 },
] as const;

const ShotActionsDeploy: FC = () => {
  const frame = useCurrentFrame();
  const shrink = interpolate(frame, [0, 18], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const panelIn = interpolate(frame, [8, 26], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  const dim = interpolate(frame, [110, 130], [1, 0.14], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const darken = interpolate(frame, [110, 132], [0, 0.72], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const lightP = interpolate(frame, [108, 120], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  const cam = {
    scale: interpolate(frame, [108, 132], [1, 1.05], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }),
    x: 0,
    y: interpolate(frame, [0, 28, 100, 132], [40, 32, -46, -52], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }),
    rot: 0,
    origin: '46% 60%',
  };

  return (
    <AbsoluteFill>
      <CameraRig cam={cam}>
        <div style={{ position: 'absolute', inset: -90, background: colors.paper }} />

        <div
          style={{
            position: 'absolute',
            left: 520,
            top: 240,
            width: 880,
            height: 600,
            transform: `translate(${-shrink * 372}px, ${-shrink * 96}px) scale(${1 - shrink * 0.66})`,
            transformOrigin: 'top left',
            opacity: (1 - shrink * 0.3) * dim,
            filter: `blur(${shrink * 0.7}px)`,
          }}
        >
          <div style={{ position: 'absolute', inset: 0, borderRadius: 8, background: colors.terminalBg, border: `1px solid ${colors.hairline}`, boxShadow: `0 22px 48px ${colors.bg}` }} />
          <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 44, borderBottom: `1px solid ${colors.hairline}`, display: 'flex', alignItems: 'center', gap: 8, padding: '0 18px', fontFamily: fontFamilies.mono, fontSize: 14, color: colors.muted }}>
            {[0, 1, 2].map((i) => (
              <span key={i} style={{ width: 9, height: 9, borderRadius: 5, background: colors.muted, opacity: 0.5 }} />
            ))}
            <span style={{ marginLeft: 12 }}>src/PostList.ts</span>
          </div>
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: 26 + (i % 3) * 18,
                top: 76 + i * 46,
                width: 520 - (i % 4) * 90,
                height: 11,
                borderRadius: 2,
                background: colors.terminalText,
                opacity: 0.22 - i * 0.02,
              }}
            />
          ))}
        </div>

        <div style={{ position: 'absolute', left: 420, top: 132, width: 1080, height: 816, opacity: panelIn * dim }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: 8, background: colors.terminalBg, border: `1px solid ${colors.hairline}` }} />
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              height: 58,
              borderBottom: `1px solid ${colors.hairline}`,
              display: 'flex',
              alignItems: 'center',
              padding: '0 26px',
              fontFamily: fontFamilies.mono,
              fontSize: 16,
              letterSpacing: '0.16em',
              color: colors.muted,
            }}
          >
            <span>GITHUB ACTIONS · deploy.yml</span>
            <span style={{ marginLeft: 'auto', color: frame >= 108 ? FILM_COLORS.statusGreen : colors.muted }}>{frame >= 108 ? 'completed' : frame >= 30 ? 'running' : 'queued'}</span>
          </div>
          <div style={{ position: 'absolute', left: 879, top: 388, width: 2, height: 224, background: colors.hairline }} />
          {[
            { at: 76, from: 388, to: 460 },
            { at: 108, from: 540, to: 612 },
          ].map((s) => (
            <div
              key={s.at}
              style={{
                position: 'absolute',
                left: 879,
                top: s.from,
                width: 2,
                height: s.to - s.from,
                background: FILM_COLORS.statusGreen,
                opacity: 0.85,
                transform: `scaleY(${interpolate(frame, [s.at, s.at + 10], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut })})`,
                transformOrigin: 'top',
              }}
            />
          ))}
          {NODES.map((n, i) => {
            const pn = pipelineNode(frame, n.at, 30);
            const done = frame >= n.at;
            return (
              <div key={n.label} style={{ position: 'absolute', left: 840, top: n.y - 40, transform: pn.transform }}>
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: 80,
                    height: 80,
                    borderRadius: 40,
                    border: `2px solid ${done ? FILM_COLORS.statusGreen : colors.hairline}`,
                    background: colors.terminalBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span style={{ fontFamily: fontFamilies.mono, fontSize: 23, color: done ? FILM_COLORS.statusGreen : colors.muted, opacity: done ? 0.35 + pn.green * 0.65 : 0.7 }}>
                    {done ? '✓' : `0${i + 1}`}
                  </span>
                </div>
                <div style={{ position: 'absolute', left: 116, top: 10, width: 380 }}>
                  <div style={{ fontFamily: fontFamilies.serif, fontSize: 30, color: colors.paper, opacity: 0.92 }}>{n.label}</div>
                  <div style={{ marginTop: 8, fontFamily: fontFamilies.mono, fontSize: 16, letterSpacing: '0.08em', color: done ? FILM_COLORS.statusGreen : colors.muted, opacity: done ? 0.45 + pn.green * 0.55 : 0.6 }}>
                    {done ? 'success' : 'queued'} · {n.status}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ position: 'absolute', inset: 0, background: colors.bg, opacity: darken }} />
        <div
          style={{
            position: 'absolute',
            left: 810,
            top: 698,
            width: 140,
            height: 26,
            borderRadius: 13,
            background: FILM_COLORS.statusGreen,
            opacity: 0.16 * lightP,
            filter: 'blur(9px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 865,
            top: 637,
            width: 30,
            height: 30,
            borderRadius: 15,
            background: FILM_COLORS.statusGreen,
            opacity: lightP,
            boxShadow: `0 0 26px ${FILM_COLORS.statusGreen}`,
          }}
        />
        <DustField act={2} seedBase="s14" />
      </CameraRig>
      <PaperGrain opacity={0.06} />
      <Grade id="GR-01" />
      <Caption text="十二月，GitHub Actions 第一次替他部署。" appearAt={26} />
    </AbsoluteFill>
  );
};

export default ShotActionsDeploy;
