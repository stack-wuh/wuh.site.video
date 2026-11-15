import type { FC } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { KineticLine } from '../components/KineticLine';
import { ShotShell } from '../components/ShotShell';
import { TagCloud } from '../components/TagCloud';
import { Kicker, Meta } from '../components/Type';
import { TAGS } from '../data';
import { CURVES, FILM_COLORS, FONTS, GRID, noise2D, progress } from '../motion-tokens';

/**
 * s43 · 弹幕飞过 → 话题标签云（80f，4420–4500 ｜ 主落定 60f）
 * GR-10：4 条弹幕气泡（对角缺口 + 纸底朱红细边）自右向左飞过，0–44f 内退净（弹幕只是进入动效）；
 * MO-01：气泡退净后话题标签云按真实数量分级字号落定（50–80f，可读主体 = 标签云）。
 * 尾帧：标签云落定满画幅、弹幕已退净 → s44 向右上散成一条线。
 */

/** 站点真实题记短句（storyboard §2 s43；不虚构留言内容） */
const BARRAGE = ['朝朝如念', '雾失楼台，月迷津渡', '代码写诗，工具作画', '驿寄梅花，鱼传尺素'] as const;

const SPEED = 78; // px/f：0–44f 内四条全部退净
const BUBBLE_TOP = 236;
const BUBBLE_GAP = 132;

const RING_CX = 760;
const RING_CY = 560;

const S43: FC = () => {
  const frame = useCurrentFrame();

  /* 承接 s42：年轮收小淡出（0–12f） */
  const ringsOut = progress(frame, 0, 12, CURVES.cineEaseIn);

  return (
    <ShotShell act="ACT 04 · 屋里">
      <AbsoluteFill>
        <div style={{ position: 'absolute', left: GRID.margin, top: 118 }}>
          <Kicker>第 04 节 · 留言与话题</Kicker>
        </div>

        {/* 上镜年轮退场（8 环，收小淡出） */}
        <svg
          width={720}
          height={720}
          style={{
            position: 'absolute',
            left: RING_CX - 360,
            top: RING_CY - 360,
            opacity: 0.55 * (1 - ringsOut),
            transform: `scale(${1 - 0.14 * ringsOut})`,
            transformOrigin: 'center center',
          }}
        >
          {Array.from({ length: 8 }, (_, i) => (
            <circle
              key={`ring-out-${i}`}
              cx={360}
              cy={360}
              r={60 + i * 40}
              fill="none"
              stroke={FILM_COLORS.ink}
              strokeWidth={i === 7 ? 1.6 : 1}
              opacity={0.3 + 0.5 * (i / 7)}
            />
          ))}
        </svg>

        {/* MO-01 标签云（50f 起落定；弹幕退净后才可见） */}
        <div style={{ position: 'absolute', left: GRID.margin, top: 272, opacity: progress(frame, 44, 8) }}>
          <TagCloud tags={TAGS} start={50} dur={22} width={GRID.content} height={540} />
        </div>
        <div style={{ position: 'absolute', left: GRID.margin, top: 872 }}>
          <Meta size={12}>TOPICS · {TAGS.length} 枚 · 字号按篇数分级</Meta>
        </div>

        {/* GR-10 弹幕气泡：自右向左，轻微有机漂移（noise2D 三参） */}
        {BARRAGE.map((text, i) => {
          const x = 1980 + i * 260 - frame * SPEED;
          const drift = (noise2D(`s43-bar-${i}`, i * 7.3, frame / 30) - 0.5) * 12;
          const top = BUBBLE_TOP + i * BUBBLE_GAP + drift;
          const opacity = progress(frame, 0, 4) * (1 - progress(frame, 38, 6));
          return (
            <div
              key={text}
              style={{
                position: 'absolute',
                left: x,
                top,
                padding: '14px 26px',
                backgroundColor: FILM_COLORS.card,
                border: `1px solid ${FILM_COLORS.vermillion}`,
                borderRadius: '3px 12px 3px 12px',
                whiteSpace: 'nowrap',
                opacity,
              }}
            >
              <span
                style={{
                  fontFamily: FONTS.serif,
                  fontSize: 34,
                  lineHeight: 1.2,
                  color: FILM_COLORS.ink,
                }}
              >
                {text}
              </span>
            </div>
          );
        })}

        <div style={{ position: 'absolute', left: GRID.margin, bottom: 108, width: 1500 }}>
          <KineticLine text="音乐、留言、话题——都在这间屋里。" start={24} framesPerChar={2} size={48} />
          <div style={{ marginTop: 16, height: 1, width: 320, backgroundColor: FILM_COLORS.hairline }} />
        </div>
      </AbsoluteFill>
    </ShotShell>
  );
};

export default S43;