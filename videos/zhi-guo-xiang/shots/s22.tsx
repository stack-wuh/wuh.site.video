/* 镜 22 · 幕三 华山 · local [0,180) · 180f
   华山之巅，云在脚下翻成海；巨岩上两个人影隔三步：他背对，深墨长袍、空袖；她在身后。
   不拍对白、不拍表情，他始终只有背影。 */
import type { FC } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { ArtBase } from '../components/ArtBase';
import { DustField } from '../components/DustField';

const S22: FC = () => {
  const f = useCurrentFrame();
  const cloud = Math.sin(f / 90) * 10;

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <ArtBase name="g09" zoom={[1.0, 1.04]} shiftX={[cloud * 0.4, -cloud * 0.4]}>
        <DustField act={3} count={18} seedBase="s22" />
      </ArtBase>
      <AbsoluteFill style={{ background: colors.paper, opacity: 0.05 }} />
    </AbsoluteFill>
  );
};

export default S22;
