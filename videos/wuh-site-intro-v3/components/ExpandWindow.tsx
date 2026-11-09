import type { FC, ReactNode } from 'react';
import { AbsoluteFill, Img, interpolate } from 'remotion';
import { staticFile } from 'remotion';
import { colors } from '../../../brand/tokens';
import { blockRect } from './ConsolePanel';

/* 展开窗（FN-38/WIN-01）：墨点光标点击后窗口由块边界最大化铺满全屏（14f），
 * 展开态由 children/S 截图打底；collapse 从块边界反向收束（末 14f）。
 * 素材像素不变形——只对窗容器做等比 scale/位移；窗内截图 object-fit cover。
 * props:
 *   startAt    点击帧（局部帧）——0 表示开局已展开（承接前镜）
 *   total      本镜总帧
 *   expandDur  最大化时长（默认 14）
 *   asset      S/P 资产 public 路径（staticFile），可空（纯 Remotion 窗）
 *   objectPos  截图 objectPosition
 *   dim        截图压暗（0–1）
 *   chrome     是否保留面板边框残留（四角）
 */
export const ExpandWindow: FC<{
  startAt: number;
  total: number;
  expandDur?: number;
  block: number;
  asset?: string | null;
  objectPos?: string;
  dim?: number;
  chrome?: boolean;
  children?: ReactNode;
  onTop?: ReactNode;
}> = ({ startAt, total, expandDur = 14, block, asset, objectPos = 'center', dim = 0.18, chrome = true, children, onTop }) => {
  const rect = blockRect(block);
  const expand = interpolate(startAt > 0 ? startAt + 2 : 0, [0, expandDur], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  // 反向收束（末 expandDur 帧）：1→0
  const collapse = interpolate(total - expandDur, [total - expandDur, total - 1], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const k = Math.min(expand, collapse);
  const x = rect.x + (rect.w / 2);
  const y = rect.y + (rect.h / 2);
  const scale = interpolate(k, [0, 1], [rect.w / 1920, 1]);
  const left = interpolate(k, [0, 1], [x, 960]);
  const top = interpolate(k, [0, 1], [y, 540]);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        transform: `translate(${left - 960}px, ${top - 540}px) scale(${scale})`,
        opacity: Math.min(1, k * 3),
      }}
    >
      <AbsoluteFill style={{ background: colors.bg, border: `1px solid ${colors.seal}`, opacity: 0.95 }}>
        {asset ? (
          <Img src={staticFile(asset)} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: objectPos, opacity: 1 - dim * 0.5 }} />
        ) : null}
        <AbsoluteFill style={{ background: colors.bg, opacity: dim }} />
        {children}
        {chrome ? (
          <>
            <div style={{ position: 'absolute', left: 0, top: 0, width: 60, height: 60, borderLeft: `1px solid ${colors.hairline}`, borderTop: `1px solid ${colors.hairline}`, opacity: 0.7 }} />
            <div style={{ position: 'absolute', right: 0, top: 0, width: 60, height: 60, borderRight: `1px solid ${colors.hairline}`, borderTop: `1px solid ${colors.hairline}`, opacity: 0.7 }} />
            <div style={{ position: 'absolute', left: 0, bottom: 0, width: 60, height: 60, borderLeft: `1px solid ${colors.hairline}`, borderBottom: `1px solid ${colors.hairline}`, opacity: 0.7 }} />
            <div style={{ position: 'absolute', right: 0, bottom: 0, width: 60, height: 60, borderRight: `1px solid ${colors.hairline}`, borderBottom: `1px solid ${colors.hairline}`, opacity: 0.7 }} />
          </>
        ) : null}
      </AbsoluteFill>
      {onTop}
    </div>
  );
};
