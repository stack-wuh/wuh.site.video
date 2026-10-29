import type { FC } from 'react';
import { AbsoluteFill } from 'remotion';
import { colors, fontFamilies } from '../tokens';
import { FilmShell } from './FilmShell';

/** 家族标识预览合成：片头 + 内容占位 + 片尾（420f），同时也是套件的出片验收入口 */
export const BrandIdent: FC = () => (
  <FilmShell
    meta={{
      title: '家族标识 · 预览',
      subtitle: '每一支视频，从这里开始',
      episode: 'BRAND IDENT v1',
      credits: ['片头片尾 · wuh.site brand/ident'],
    }}
    contentFrames={120}
  >
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <p style={{ fontFamily: fontFamilies.serif, fontSize: 36, color: colors.paperMuted, letterSpacing: '0.08em' }}>
        正片内容区 · 由调用方填充
      </p>
    </AbsoluteFill>
  </FilmShell>
);
