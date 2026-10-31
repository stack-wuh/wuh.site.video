import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../brand/tokens';
import { FilmShell } from '../../brand/ident/FilmShell';
import type { FilmMeta } from '../../brand/ident/identity';
import { ShotBoard } from './boards';
import { ACTS, SHOTS, TOTAL_FRAMES } from './shots-data';

const CLAMP = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const serif = fontFamilies.serif;
const mono = fontFamilies.mono;

const META: FilmMeta = {
  title: '雾失楼台，月迷津渡',
  subtitle: '2019 → 2026 · wuh.site 实现历程',
  episode: 'WUH.SITE INTRO V2 · 2026-10',
  credits: [],
};

/** 节奏锚点（来自 storyboard 4.1，评审时以脉冲圈提示） */
const ANCHORS = [
  { frame: 80, label: '墨落' },
  { frame: 2520, label: '第一记重音' },
  { frame: 4000, label: '白闪' },
  { frame: 4380, label: '重启钤印' },
  { frame: 5320, label: '联系钤印' },
  { frame: 6620, label: '版本雨满' },
  { frame: 6960, label: '方法论' },
  { frame: 6990, label: '树起' },
  { frame: 7290, label: '总结' },
];

/** 剧本用「」标记字幕，展示时剥掉最外层一对，避免与内层引号叠成「『…』」 */
const stripOuterQuote = (raw: string): string => {
  const m = raw.match(/^「(.*)」$/);
  return m ? m[1] : raw;
};

const AnimaticBody: FC = () => {
  const frame = useCurrentFrame();
  const shot = SHOTS.find((s) => frame >= s.startFrame && frame < s.startFrame + s.durationFrames) ?? SHOTS[SHOTS.length - 1];
  const act = ACTS.find((a) => frame >= a.startFrame && frame < a.endFrame) ?? ACTS[ACTS.length - 1];
  const local = frame - shot.startFrame;
  const actFirst = SHOTS.find((s) => s.act === act.act) === shot;
  const captionIn = interpolate(local, [Math.min(20, shot.durationFrames * 0.2), Math.min(40, shot.durationFrames * 0.45)], [0, 1], CLAMP);
  const progress = frame / TOTAL_FRAMES;
  const anchor = ANCHORS.find((a) => Math.abs(frame - a.frame) <= 14);
  const caption = shot.caption.startsWith('无（') ? '' : stripOuterQuote(shot.caption);
  const cam = shot.cam.length > 46 ? `${shot.cam.slice(0, 46)}…` : shot.cam;

  return (
    <AbsoluteFill style={{ background: colors.bg, justifyContent: 'center', alignItems: 'center' }}>
      <ShotBoard shot={shot} />

      {/* 镜头 slate */}
      <div style={{ position: 'absolute', left: 56, top: 48, fontFamily: mono, color: colors.muted, fontSize: 18, lineHeight: 1.7 }}>
        <div>
          镜 {String(shot.n).padStart(2, '0')} / {SHOTS.length} · {shot.durationFrames}f · {shot.startFrame}–{shot.startFrame + shot.durationFrames}
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
          <span>preprod board-film · WuhSiteIntroV2Animatic</span>
          <span>
            Act {act.act}/{ACTS.length} {act.title} · 帧 {frame} / {TOTAL_FRAMES} · {(frame / 30).toFixed(1)}s / 240s
          </span>
        </p>
      </div>
    </AbsoluteFill>
  );
};

/** Animatic 分镜板：FilmShell（120f 片头 + 7200f 正片 + 180f 片尾 = 7500f），正片为单色简板预演 */
export const WuhSiteIntroV2Animatic: FC = () => (
  <FilmShell meta={META} contentFrames={TOTAL_FRAMES}>
    <AnimaticBody />
  </FilmShell>
);
