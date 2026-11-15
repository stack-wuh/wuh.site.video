import type { CSSProperties, FC, PropsWithChildren } from 'react';
import { FILM_COLORS, FONTS, GRID, T } from '../motion-tokens';

export type PanelProps = PropsWithChildren<{
  /** 卡片宽度（默认 GRID.content） */
  width?: number;
  /** 卡片高度（默认由内容撑开） */
  height?: number;
  /** 顶栏 mono 标题（如 `mongo · issues`）；缺省则无顶栏 */
  title?: string;
  style?: CSSProperties;
}>;

/**
 * LAY / 数据卡通用壳：card 底 + 1px hairline 边 + 24 内边距 + 可选顶栏 mono 标题。
 * 纯展示容器，不带入场动效（入场由调用方镜文件按令牌做，避免组件自带动效抢主动作）。
 * 纪律：卡内边距 24 = GRID.gutter，顶栏标题 22px mono 字距 0.18em。
 */
export const Panel: FC<PanelProps> = ({ children, width = GRID.content, height, title, style }) => {
  return (
    <div
      style={{
        width,
        height,
        boxSizing: 'border-box',
        backgroundColor: FILM_COLORS.card,
        border: `1px solid ${FILM_COLORS.hairline}`,
        padding: GRID.gutter,
        display: 'flex',
        flexDirection: 'column',
        ...style,
      }}
    >
      {title ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18, flexShrink: 0 }}>
          <div
            style={{
              width: 7,
              height: 7,
              backgroundColor: FILM_COLORS.vermillion,
              transform: 'rotate(45deg)',
              flexShrink: 0,
            }}
          />
          <div
            style={{
              fontFamily: FONTS.mono,
              fontSize: T.label,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: FILM_COLORS.muted,
              whiteSpace: 'nowrap',
            }}
          >
            {title}
          </div>
          <div style={{ flex: 1, height: 1, backgroundColor: FILM_COLORS.hairline }} />
        </div>
      ) : null}
      <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>{children}</div>
    </div>
  );
};