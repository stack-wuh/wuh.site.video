import type { FC } from 'react';
import { DustField as KitDustField } from '../../../brand/film-kit/DustField';
import { DUST } from '../motion-tokens';

/* 影片私有 DUST 密度表（表 3.5.1）注入公共光尘组件——既有 import 与像素零变化 */
export const DustField: FC<{ act: number; count?: number; seedBase?: string }> = ({ act, count, seedBase }) => (
  <KitDustField act={act} acts={DUST} count={count} seedBase={seedBase} />
);
