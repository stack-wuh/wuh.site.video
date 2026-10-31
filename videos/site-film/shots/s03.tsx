/* 镜 03 · Act 1 序章 · 全局帧 [500,700) · 200f */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { inkRise, writeFade } from '../motion-tokens';

const serif = fontFamilies.serif;
const sans = fontFamilies.sans;

/* 品牌落版（原 ShotBrand；localStart 460：原 `local = frame - 460` → `local = frame`，墨升/落笔锚 0/8/16/24 均为 local 相对量不变，
   标题 20f / 标语与双标语、社交胶囊 14f 各自落定；
   幕级 fadeDark 全屏渐暗 overlay（原幕局部 [670,700））归入本镜 → 镜局部 [170,200)，层级在镜内容之上（保持原渲染次序）；
   镜尾帧交接态：黑场（末帧 fadeDark ≈0.97 收黑入 Act 2） */
const ShotBrand: FC = () => {
  const frame = useCurrentFrame();
  const local = frame;
  const fadeDark = interpolate(frame, [170, 200], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ ...inkRise(local, 0), fontFamily: serif, fontSize: 100, color: colors.paper, margin: 0 }}>wuh.site · 朝朝如念</h1>
          <p style={{ ...writeFade(local, 8), fontFamily: sans, fontSize: 30, color: colors.muted, letterSpacing: '0.3em', marginTop: 34 }}>雾失楼台，月迷津渡</p>
          <p style={{ ...writeFade(local, 16), fontFamily: sans, fontSize: 20, color: colors.accent, letterSpacing: '0.2em', marginTop: 22 }}>代码写诗，工具作画</p>
          <div style={{ ...writeFade(local, 24), display: 'flex', gap: 16, justifyContent: 'center', marginTop: 30 }}>
            {['GitHub', '音乐', '博客', 'RSS'].map((s) => (
              <span key={s} style={{ fontFamily: sans, fontSize: 17, color: colors.muted, border: `1px solid ${colors.hairline}`, borderRadius: 16, padding: '6px 18px' }}>{s}</span>
            ))}
          </div>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: colors.bg, opacity: fadeDark }} />
    </AbsoluteFill>
  );
};

export default ShotBrand;
