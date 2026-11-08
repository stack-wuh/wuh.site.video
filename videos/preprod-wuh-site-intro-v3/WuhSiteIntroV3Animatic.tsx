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
  title: '雾失楼台，月迷津渡',
  subtitle: 'wuh.site 介绍片 v3 · 站点真实素材版',
  episode: 'animatic 简板 · 62 镜',
  credits: [],
};

/** 节奏锚点（幕界 + 剧本关键拍，评审时以脉冲圈提示） */
const ACT_ANCHORS = ACTS.map((a) => ({ frame: a.startFrame, label: `Act ${a.act} ${a.title}` }));
const BEAT_RULES: Array<[RegExp, string]> = [
  [/2024 年 12 月 8 日/, '第一记重音 · 第一行代码'],
  [/六月十四日/, '上线白闪'],
  [/重启计划/, '钤印'],
  [/1,842/, '阅读之最'],
  [/118 个版本/, '版本雨'],
  [/汇进同一页日志/, '最近日志（v3 新增）'],
  [/吴尒红/, '落款'],
];
const beatAnchorOf = (): Array<{ frame: number; label: string }> => {
  const out: Array<{ frame: number; label: string }> = [];
  for (const shot of SHOTS) {
    for (const [re, label] of BEAT_RULES) {
      if (re.test(shot.caption) && !out.some((a) => a.label === label)) out.push({ frame: shot.startFrame, label });
    }
  }
  return out;
};
const ANCHORS = [...ACT_ANCHORS, ...beatAnchorOf(), { frame: TOTAL_FRAMES - 1, label: '末帧' }];

const AnimaticBody: FC = () => {
  const frame = useCurrentFrame();
  const shot = SHOTS.find((s) => frame >= s.startFrame && frame < s.startFrame + s.durationFrames) ?? SHOTS[SHOTS.length - 1];
  const act = ACTS.find((a) => frame >= a.startFrame && frame < a.endFrame) ?? ACTS[ACTS.length - 1];
  const local = frame - shot.startFrame;
  const actFirst = SHOTS.find((s) => s.act === act.act) === shot;
  const captionIn = interpolate(local, [Math.min(12, shot.durationFrames * 0.2), Math.min(28, shot.durationFrames * 0.45)], [0, 1], CLAMP);
  const anchor = ANCHORS.find((a) => Math.abs(frame - a.frame) <= 14);
  const caption = shot.caption === '无' ? '' : shot.caption;
  const cam = shot.cam.length > 46 ? `${shot.cam.slice(0, 46)}…` : shot.cam;

  return (
    <AbsoluteFill style={{ background: colors.bg, justifyContent: 'center', alignItems: 'center' }}>
      <ShotBoard shot={shot} />

      {/* 镜头 slate */}
      <div style={{ position: 'absolute', left: 56, top: 20, fontFamily: mono, color: colors.muted, fontSize: 18, lineHeight: 1.7 }}>
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
            top: 40,
            textAlign: 'right',
            opacity: interpolate(local, [0, 30, 120, 150], [0, 1, 1, 0.25], CLAMP),
          }}
        >
          <p style={{ fontFamily: mono, fontSize: 20, color: colors.accent, margin: 0, letterSpacing: '0.4em' }}>
            ACT {act.act} / {ACTS.length}
          </p>
          <p style={{ fontFamily: serif, fontSize: 64, color: colors.paper, margin: '10px 0 0', opacity: 0.85 }}>{act.title}</p>
        </div>
      ) : null}

      {/* 字幕卡 */}
      {caption ? (
        <div
          style={{
            position: 'absolute',
            left: 140,
            right: 140,
            bottom: 118,
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
          <p style={{ position: 'absolute', top: 96, fontFamily: mono, fontSize: 22, color: colors.accent, margin: 0 }}>
            {anchor.label} @ {anchor.frame}
          </p>
        </AbsoluteFill>
      ) : null}

      {/* 进度 + 幕刻度 */}
      <div style={{ position: 'absolute', bottom: 44, left: 150, right: 150 }}>
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
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: mono, fontSize: 12, color: colors.muted }}>
          <span>
            {Math.floor(frame / 30 / 60)}:{String(Math.floor((frame / 30) % 60)).padStart(2, '0')} / {Math.floor(TOTAL_FRAMES / 30 / 60)}:
            {String(Math.floor((TOTAL_FRAMES / 30) % 60)).padStart(2, '0')}
          </span>
          <span>
            wuh-site-intro-v3 · animatic · {SHOTS.length} 镜 · 单色简板（真实素材降饱和占位）
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const WuhSiteIntroV3Animatic: FC = () => (
  <FilmShell meta={META} contentFrames={TOTAL_FRAMES}>
    <AnimaticBody />
  </FilmShell>
);
