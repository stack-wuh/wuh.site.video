import type { FC } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { FlowDiagram } from '../components/FlowDiagram';
import { KineticLine } from '../components/KineticLine';
import { ShotShell } from '../components/ShotShell';
import { TagCloud } from '../components/TagCloud';
import { Kicker, Meta } from '../components/Type';
import { TAGS } from '../data';
import { CURVES, FILM_COLORS, GRID, progress } from '../motion-tokens';

/**
 * s44 · 数据流五节点（110f，4500–4610 ｜ 主落定 80f）
 * MO-01 scatter：上镜标签云向右上散成一条线（20f 收 + scale 0.6）；
 * FL-01：rail 自左生长 40f；FL-02：五节点依次点亮（墨块 + 2px 朱红勾边，不用绿）；
 * FL-03：webhook 节点右上压一枚签名校验小锁（锁梁 2f 闭合）。
 * 尾帧：五节点连成完整数据流、全部点亮 → s45 放大 MongoDB 节点。
 */

const NODES = [
  { label: 'Issue' },
  { label: 'sync / webhook' },
  { label: 'MongoDB' },
  { label: '统一 API' },
  { label: '前端' },
] as const;

const NODE_SIZE = 160;
const FLOW_TOP = 460;
const FLOW_START = 36; // rail 36→76，末节点对拍 80
const LOCK_I = 1; // webhook 节点

const S44: FC = () => {
  const frame = useCurrentFrame();

  /* MO-01 scatter：标签云向右上收成一条线 */
  const sc = progress(frame, 0, 20, CURVES.cineEaseInOut);
  const scOp = 1 - progress(frame, 4, 18);

  /* FL-03 小锁：节点亮后 8f 落位、锁梁 2f 闭合 */
  const lockP = progress(frame, 48, 8);
  const shackle = progress(frame, 52, 2);

  /* CAM-01 沿数据流右移 */
  const truck = -26 * progress(frame, 30, 50, CURVES.cineEaseInOut);

  return (
    <ShotShell act="ACT 05 · 方法">
      <AbsoluteFill>
        <div style={{ position: 'absolute', left: GRID.margin, top: 118 }}>
          <Kicker>第 05 节 · 数据流</Kicker>
        </div>
        <div style={{ position: 'absolute', right: GRID.margin, top: 118, textAlign: 'right' }}>
          <Meta size={12}>ISSUES AS CMS · 3 段同步</Meta>
        </div>

        {/* 上镜标签云散场（进入动效，不是本镜主体） */}
        <div
          style={{
            position: 'absolute',
            left: GRID.margin,
            top: 272,
            opacity: scOp,
            transform: `translate(${560 * sc}px, ${-240 * sc}px) scale(${1 - 0.4 * sc})`,
            transformOrigin: 'right top',
          }}
        >
          <TagCloud tags={TAGS} start={-240} dur={22} width={GRID.content} height={540} />
        </div>

        <div style={{ position: 'absolute', inset: 0, transform: `translateX(${truck}px)` }}>
          <div style={{ position: 'absolute', left: GRID.margin, top: FLOW_TOP }}>
            <FlowDiagram nodes={NODES} start={FLOW_START} width={GRID.content} nodeSize={NODE_SIZE} />
          </div>

          {/* FL-03 签名校验小锁（只在 webhook 节点右上） */}
          <div
            style={{
              position: 'absolute',
              left: GRID.margin + LOCK_I * ((GRID.content - NODE_SIZE) / (NODES.length - 1)) + NODE_SIZE - 16,
              top: FLOW_TOP - 18,
              opacity: lockP,
              transform: `scale(${0.7 + 0.3 * lockP})`,
              transformOrigin: 'center bottom',
            }}
          >
            <svg width={28} height={34}>
              <path
                d="M6 14 V10 a8 8 0 0 1 16 0 v4"
                fill="none"
                stroke={FILM_COLORS.ink}
                strokeWidth={2.4}
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - shackle}
              />
              <rect x={1} y={14} width={26} height={19} rx={2} fill={FILM_COLORS.vermillion} />
              <circle cx={14} cy={22} r={2.4} fill={FILM_COLORS.paper} />
              <rect x={12.9} y={22} width={2.2} height={6} fill={FILM_COLORS.paper} />
            </svg>
          </div>

          {/* 节点下方 mono 关系行（真实架构顺序） */}
          <div style={{ position: 'absolute', left: GRID.margin, top: FLOW_TOP + NODE_SIZE + 48 }}>
            <Meta size={14} style={{ letterSpacing: '0.2em' }}>
              ISSUE → SYNC/WEBHOOK → MONGO → API → SITE
            </Meta>
          </div>
          <div
            style={{
              position: 'absolute',
              left: GRID.margin,
              top: FLOW_TOP + NODE_SIZE + 84,
              width: 760,
              height: 1,
              backgroundColor: FILM_COLORS.hairline,
            }}
          />
        </div>

        <div style={{ position: 'absolute', left: GRID.margin, bottom: 108, width: 1500 }}>
          <KineticLine text="写作即提 Issue，Issue 就是文章。" start={24} framesPerChar={2} size={48} />
          <div style={{ marginTop: 16, height: 1, width: 320, backgroundColor: FILM_COLORS.hairline }} />
        </div>
      </AbsoluteFill>
    </ShotShell>
  );
};

export default S44;