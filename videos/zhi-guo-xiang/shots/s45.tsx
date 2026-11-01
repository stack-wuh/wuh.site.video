/* 镜 45 · 幕六 窗 · local [0,120) · 120f
   禅房的窗：窗框素净，窗外晚霞刚起；窗台上放着一页空纸。末 30f 极缓推 1.5%，让晚霞占更多画幅。 */
import type { FC } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { ArtBase } from '../components/ArtBase';

const S45: FC = () => {
  const f = useCurrentFrame();
  const push = 1 + (f / 120) * 0.015;

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <div style={{ position: 'absolute', inset: 0, transform: `scale(${push})`, transformOrigin: '60% 46%' }}>
        <ArtBase name="g18" zoom={[1.0, 1.02]} />
      </div>
      {/* 窗框（代码）：素净木框 + 一横一竖 */}
      <div style={{ position: 'absolute', left: '8%', right: '8%', top: '10%', bottom: '12%', border: `18px solid ${colors.ink}`, opacity: 0.82 }} />
      <div style={{ position: 'absolute', left: '50%', top: '10%', bottom: '12%', width: 10, background: colors.ink, opacity: 0.7 }} />
      <div style={{ position: 'absolute', left: '8%', right: '8%', top: '52%', height: 8, background: colors.ink, opacity: 0.6 }} />
      <div style={{ position: 'absolute', left: '8%', right: '8%', bottom: '9%', height: 14, background: colors.ink, opacity: 0.35 }} />
    </AbsoluteFill>
  );
};

export default S45;
