import type { CSSProperties, FC } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { FILM_COLORS, FONTS, GRID, SP, T, clamp01, progress, springP } from '../motion-tokens';

export type FlowNode = { label: string; sub?: string };

export type FlowDiagramProps = {
  nodes: readonly FlowNode[];
  /** 起始帧（默认 0） */
  start?: number;
  /** 总宽（默认 GRID.content） */
  width?: number;
  /** 节点方块边长（默认 120） */
  nodeSize?: number;
  /** 节点间距（缺省则按 width 均分） */
  gap?: number;
  style?: CSSProperties;
};

const RAIL_DUR = 40;
const NODE_PAUSE = 2;

/**
 * FL-01 FLOW-RAIL + FL-02 FLOW-NODE：数据流节点图。
 * 水平 rail 40f 从左画出（节点处停 2f 再续）——直线 rail 用「分段宽度插值」等价于 evolvePath 的真长度描画
 * （@remotion/paths 未在本仓 package.json 声明，避免 CI frozen-lockfile 解析不到；见交付说明）。
 * 节点按 rail 到达顺序 springPop 点亮：fill 0→1 + 2px 朱红勾边，末节点对拍；节点下 mono 标签。
 */
export const FlowDiagram: FC<FlowDiagramProps> = ({
  nodes,
  start = 0,
  width = GRID.content,
  nodeSize = 120,
  gap,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const n = nodes.length;
  const spacing = gap !== undefined ? nodeSize + gap : n > 1 ? (width - nodeSize) / (n - 1) : 0;
  const totalW = nodeSize + spacing * Math.max(0, n - 1);
  const originX = gap !== undefined ? (width - totalW) / 2 : 0;
  const leftOf = (i: number) => originX + i * spacing;
  const railY = nodeSize / 2;
  const segCount = Math.max(1, n - 1);
  const segDur = Math.max(4, (RAIL_DUR - NODE_PAUSE * (segCount - 1)) / segCount);
  const hasSub = nodes.some((nd) => nd.sub !== undefined);
  const height = nodeSize + (hasSub ? 44 : 0);

  return (
    <div style={{ position: 'relative', width, height, ...style }}>
      {Array.from({ length: Math.max(0, n - 1) }, (_, i) => {
        const segStart = start + i * (segDur + NODE_PAUSE);
        const p = progress(frame, segStart, segDur);
        const segLen = spacing - nodeSize;
        return (
          <div
            key={`seg-${i}`}
            style={{
              position: 'absolute',
              left: leftOf(i) + nodeSize,
              top: railY - 0.75,
              width: Math.max(0, segLen) * p,
              height: 1.5,
              backgroundColor: FILM_COLORS.ink,
              opacity: 0.85,
            }}
          />
        );
      })}

      {nodes.map((node, i) => {
        /* 点亮时刻 = rail 抵达该节点（首节点在 start+2，末节点与 40f 描画对拍） */
        const litAt = start + (i === 0 ? 2 : (i - 1) * (segDur + NODE_PAUSE) + segDur);
        const s = clamp01(springP(frame, fps, litAt, SP.badgePop));
        const lit = clamp01(progress(frame, litAt, 10));
        const appear = progress(frame, litAt, 4);
        return (
          <div
            key={`node-${i}`}
            style={{
              position: 'absolute',
              left: leftOf(i),
              top: 0,
              width: nodeSize,
              height: nodeSize,
              boxSizing: 'border-box',
              border: `1px solid ${FILM_COLORS.hairline}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: Math.round(nodeSize * 0.1),
              opacity: appear,
              transform: `scale(${0.94 + 0.06 * s})`,
              transformOrigin: 'center center',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: FILM_COLORS.paperDeep,
                opacity: 0.9 * lit,
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                border: `2px solid ${FILM_COLORS.vermillion}`,
                opacity: lit,
                boxSizing: 'border-box',
              }}
            />
            <div
              style={{
                position: 'relative',
                fontFamily: FONTS.serif,
                fontSize: Math.round(nodeSize * 0.19),
                lineHeight: 1.3,
                color: FILM_COLORS.ink,
                textAlign: 'center',
                wordBreak: 'break-word',
              }}
            >
              {node.label}
            </div>
            {node.sub ? (
              <div
                style={{
                  position: 'absolute',
                  top: nodeSize + 12,
                  left: -20,
                  right: -20,
                  textAlign: 'center',
                  fontFamily: FONTS.mono,
                  fontSize: T.meta,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: FILM_COLORS.muted,
                  whiteSpace: 'nowrap',
                }}
              >
                {node.sub}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};