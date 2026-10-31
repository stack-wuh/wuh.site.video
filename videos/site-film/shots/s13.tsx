/* 镜 13 · Act 3 重启与复燃 · 全局帧 [2200,2420) · 220f */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { GRADES, RUSH13, writeFade } from '../motion-tokens';

const serif = fontFamilies.serif;
const mono = fontFamilies.mono;

const fade = (f: number, at: number) =>
  interpolate(f, [at, at + 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

/* 宣言下半 + 急推（原 ShotManifestoB；【坐标保真】原式 RUSH13.from-2200 得断点 [170,220]，但原码以幕局部帧求值（镜窗 [400,620)）
   → 急推全程越过断点、冻结在终态 1.6——此为已交付成片的真实渲染（原码注释「本地 570→620」与代码不符，属交付态缺陷）。
   本镜 frame = useCurrentFrame() + 400（幕局部）保真冻结交付态；复活急推（全片第一记重鼓卡点）属内容变更，另立 change。 */
const ShotManifestoB: FC = () => {
  const frame = useCurrentFrame() + 400; // 幕局部帧保真（见头注释）
  const rush = interpolate(frame, [RUSH13.from - 2200, RUSH13.to - 2200], [1, 1.6], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: RUSH13.easing,
  });
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div
          style={{
            position: 'relative',
            width: 880,
            background: colors.paperDeep,
            borderRadius: 10,
            padding: '48px 60px',
            transform: `rotate(-0.8deg) scale(${rush})`,
            transformOrigin: '62% 60%',
          }}
        >
          {['每周发布一篇博客，无限进步，', '开始重启计划~~'].map((l, i) => (
            <p key={i} style={{ ...writeFade(frame, 10 + i * 46), fontFamily: serif, fontSize: 30, color: colors.ink, margin: '20px 0' }}>
              {l}
            </p>
          ))}
          <p style={{ fontFamily: mono, fontSize: 18, color: colors.muted, marginTop: 26, opacity: fade(frame, 120) }}>2026.06.21 · 重启计划</p>
        </div>
      </AbsoluteFill>
      {/* 幕级调色 veil（grade-seal-red · screen 0.1，Act3 全幕常量，跨镜拆分归入各镜，层级在内容之上） */}
      <AbsoluteFill style={{ background: GRADES[2].lut.color, mixBlendMode: 'screen', opacity: 0.1 }} />
    </AbsoluteFill>
  );
};

export default ShotManifestoB;
