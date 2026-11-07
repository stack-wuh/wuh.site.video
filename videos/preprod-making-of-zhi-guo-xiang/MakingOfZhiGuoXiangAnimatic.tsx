import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../brand/tokens';
import { FilmShell } from '../../brand/ident/FilmShell';
import type { FilmMeta } from '../../brand/ident/identity';
import { ShotBoard } from './boards';
import { ACTS, SHOTS, TOTAL_FRAMES } from './shots-data';

const CLAMP = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const mono = fontFamilies.mono;
const serif = fontFamilies.serif;

const META: FilmMeta = {
  title: '风陵 · 致郭襄',
  subtitle: '创作历程片 · 十一个版本',
  episode: 'making-of · animatic 简板',
  credits: [],
};

/** 节奏锚点（来自剧本章节边界，评审时以脉冲圈提示） */
const ANCHORS = [
  { frame: 360, label: '素材开始' },
  { frame: 1500, label: '第一版成片' },
  { frame: 2400, label: '故事错了' },
  { frame: 2565, label: '伪托印' },
  { frame: 3450, label: '删镜' },
  { frame: 4350, label: '审核环' },
  { frame: 4830, label: '声音' },
  { frame: 5730, label: '幕后' },
  { frame: 6480, label: '执念' },
  { frame: 7425, label: '落版' },
  { frame: 7679, label: '末帧' },
];

const AnimaticBody: FC = () => {
  const frame = useCurrentFrame();
  const shot = SHOTS.find((s) => frame >= s.startFrame && frame < s.startFrame + s.durationFrames) ?? SHOTS[SHOTS.length - 1];
  const act = ACTS.find((a) => frame >= a.startFrame && frame < a.endFrame) ?? ACTS[ACTS.length - 1];
  const local = frame - shot.startFrame;
  const actFirst = SHOTS.find((s) => s.act === act.act) === shot;
  const captionIn = interpolate(local, [Math.min(12, shot.durationFrames * 0.2), Math.min(28, shot.durationFrames * 0.45)], [0, 1], CLAMP);
  const progress = frame / TOTAL_FRAMES;
  const anchor = ANCHORS.find((a) => Math.abs(frame - a.frame) <= 14);
  const caption = shot.caption === '无' ? '' : shot.caption;
  const cam = shot.cam.length > 46 ? `${shot.cam.slice(0, 46)}…` : shot.cam;

  return (
    <AbsoluteFill style={{ background: colors.bg, justifyContent: 'center', alignItems: 'center' }}>
      <ShotBoard shot={shot} />

      {/* 镜头 slate */}
      <div style={{ position: 'absolute', left: 56, top: 48, fontFamily: mono, color: colors.muted, fontSize: 18, lineHeight: 1.7 }}>
        <div>
          镜 {shot.id.toUpperCase()} · {shot.durationFrames}f · {shot.startFrame}–{shot.startFrame + shot.durationFrames}
        </div>
        <div style={{ color: colors.accent }}>🎥 {cam}</div>
      </div>

      {/* 幕标题（幕首镜） */}
      {actFirst ? (
        <div
          style={{
            position: 'absolute',
            right: 90,
            top: 70,
            textAlign: 'right',
            opacity: interpolate(local, [0, 30, 120, 150], [0, 1, 1, 0.25], CLAMP),
          }}
        >
          <p style={{ fontFamily: mono, fontSize: 20, color: colors.accent, margin: 0, letterSpacing: '0.4em' }}>
            ACT {act.act} / {ACTS.length}
          </p>
          <p style={{ fontFamily: serif, fontSize: 72, color: colors.paper, margin: '10px 0 0', opacity: 0.85 }}>{act.title}</p>
        </div>
      ) : null}

      {/* 字幕卡 */}
      {caption ? (
        <div
          style={{
            position: 'absolute',
            left: 140,
            right: 140,
            bottom: 150,
            textAlign: 'center',
            fontFamily: serif,
            fontSize: caption.length > 40 ? 30 : caption.length > 32 ? 34 : 44,
            color: colors.paper,
            opacity: captionIn,
            textShadow: `0 2px 24px ${colors.bg}`,
          }}
        >
          {caption}
        </div>
      ) : null}

      {/* 卡点脉冲 */}
      {anchor ? (
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', pointerEvents: 'none' }}>
          <div
            style={{
              width: 340,
              height: 340,
              borderRadius: 170,
              border: `2px solid ${colors.accent}`,
              opacity: interpolate(Math.abs(frame - anchor.frame), [0, 14], [0.9, 0], CLAMP),
            }}
          />
          <p style={{ position: 'absolute', top: 150, fontFamily: mono, fontSize: 24, color: colors.accent, margin: 0 }}>
            {anchor.label} @ {anchor.frame}
          </p>
        </AbsoluteFill>
      ) : null}

      {/* 进度 + 幕刻度 */}
      <div style={{ position: 'absolute', bottom: 52, left: 150, right: 150 }}>
        <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
          {ACTS.map((a, i) => (
            <div
              key={a.act}
              style={{
                flex: a.endFrame - (i === 0 ? 0 : ACTS[i - 1].endFrame),
                height: 4,
                background: frame < a.endFrame ? colors.accent : colors.hairline,
                opacity: frame < a.endFrame ? 0.9 : 0.5,
                borderRadius: 2,
              }}
            />
          ))}
        </div>
        <div style={{ height: 3, background: colors.hairline }}>
          <div style={{ width: `${progress * 100}%`, height: 3, background: colors.paper }} />
        </div>
        <p style={{ fontFamily: mono, fontSize: 16, color: colors.muted, marginTop: 10, display: 'flex', justifyContent: 'space-between' }}>
          <span>preprod making-of-zhi-guo-xiang · MakingOfZhiGuoXiangAnimatic</span>
          <span>
            Act {act.act}/{ACTS.length} {act.title} · 帧 {frame} / {TOTAL_FRAMES} · {(frame / 30).toFixed(1)}s / 256.0s
          </span>
        </p>
      </div>
    </AbsoluteFill>
  );
};

/** Animatic 分镜板：FilmShell（120f 片头 + 7200f 正片 + 180f 片尾 = 7500f），正片为单色简板预演 */
export const MakingOfZhiGuoXiangAnimatic: FC = () => (
  <FilmShell meta={META} contentFrames={TOTAL_FRAMES}>
    <AnimaticBody />
  </FilmShell>
);
