import type { FC } from 'react';
import { DustField as KitDustField } from '../../../brand/film-kit/DustField';
import { DUST } from '../motion-tokens';

/* 影片私有 DUST 密度表（§3.5）注入公共光尘组件——与 v2 同构 */
export const DustField: FC<{ act: number; count?: number; seedBase?: string }> = ({ act, count, seedBase }) => (
  <KitDustField act={act} acts={DUST} count={count} seedBase={seedBase} />
);
