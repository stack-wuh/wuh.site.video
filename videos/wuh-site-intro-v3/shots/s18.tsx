/* S18 · Act 3 第一行 · 局部帧 [0,108) · 108f · 绝对 2694–2802
 *
 * 拓印成章：代码行被拓成一枚矩形印章（scale 1→0.82 + clip 矩形 + 朱红边框描出 0–22）；
 * 印章 8f 落下（30=绝对 2724 对音，FN-09+FN-10），印面=完整提交原文（等宽原样），
 * 右下小字日期 2024-12-08；落定静止 2 拍；
 * p-init-commit 物证窗自印下亮起（WIN-01，70–90=绝对 2764–2784）；rack focus 印面→物证窗。
 * 转场：入「切」，出「切」。无字幕（画面文字=提交原文）。
 * 尾帧：红印冻帧压在物证窗上。
 */
import type { FC } from 'react';
import { AbsoluteFill, Img, interpolate, useCurrentFrame } from 'remotion';
import { staticFile } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES } from '../../../brand/motion';
import { frameIn, pathDraw } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { DustField } from '../components/DustField';
import { Grade } from '../components/Grade';
import { PaperGrain } from '../components/PaperGrain';

const CODE_LINE = 'feat(init): 基于nextjs构建的monorepos项目';
const SEEL_LAND = 30; // 绝对 2724 对音
/** 朱红边框（rect 等价 path，rx=8 圆角；真长度由 evolvePath 计算，不再猜 2330） */
const BORDER_D = 'M 12 4 H 948 Q 956 4 956 12 V 208 Q 956 216 948 216 H 12 Q 4 216 4 208 V 12 Q 4 4 12 4 Z';

const S18: FC = () => {
  const frame = useCurrentFrame();
  const cam = { scale: 1.04, x: 0, y: 0, rot: 0 };
  // 朱红边框描出（0–22，pathDraw）
  const border = pathDraw(frame, 0, 22, BORDER_D);
  // 印章落下（22–30，8f：scale 1.18→1 + 位移落纸）
  const drop = interpolate(frame, [22, SEEL_LAND], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseIn });
  const sealScale = interpolate(drop, [0, 1], [1.18, 1]);
  const sealY = interpolate(drop, [0, 1], [-46, 0]);
  // rack focus 印面→物证窗（SEEL_LAND+6 → 100）
  const rack = interpolate(frame, [SEEL_LAND + 6, 100], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  // 物证窗（WIN-01，70–90）
  const win = frameIn(frame, 70);

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <CameraRig cam={cam}>
        <AbsoluteFill>
          <DustField act={3} count={10} seedBase="s18" />

          {/* p-init-commit 物证窗（印下亮起，rack 后成为焦点） */}
          <div style={{ position: 'absolute', left: 420, top: 250, width: 1080, height: 640, ...win }}>
            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: colors.bg, filter: `blur(${(1 - rack) * 1.5}px)` }}>
              <Img src={staticFile('wuh-site-intro-v3/site/gh01-init-commit-v1.png')} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
              <div style={{ position: 'absolute', inset: 0, background: colors.bg, opacity: (1 - rack) * 0.45 }} />
            </div>
            <div style={{ position: 'absolute', inset: 0, border: `1px solid ${colors.seal}`, opacity: 0.7 }} />
          </div>

          {/* 矩形印章（印面=提交原文；rack 后退为虚） */}
          <div style={{ position: 'absolute', left: 480, top: 330, width: 960, height: 220, transform: `scale(${sealScale}) translateY(${sealY}px)`, filter: `blur(${rack * 2}px)` }}>
            <div style={{ position: 'absolute', inset: 0, background: colors.seal, opacity: 0.94, borderRadius: 8, boxShadow: '0 18px 40px rgba(0,0,0,0.3)' }} />
            {/* 朱红边框描出（SVG path stroke，真长度驱动；CSSProperties 走 style） */}
            <svg width={960} height={220} style={{ position: 'absolute', inset: 0 }}>
              <path d={BORDER_D} fill="none" stroke={colors.gold} strokeWidth={2.4} style={border} opacity={0.85} />
            </svg>
            <div style={{ position: 'absolute', left: 0, right: 0, top: 56, textAlign: 'center', fontFamily: fontFamilies.mono, fontSize: 40, color: colors.paper, fontVariantNumeric: 'tabular-nums', letterSpacing: '0.02em' }}>
              {CODE_LINE}
            </div>
            <div style={{ position: 'absolute', right: 40, bottom: 28, fontFamily: fontFamilies.mono, fontSize: 20, color: colors.paper, opacity: 0.8, fontVariantNumeric: 'tabular-nums' }}>
              2024-12-08
            </div>
          </div>
        </AbsoluteFill>
      </CameraRig>
      <PaperGrain opacity={0.05} />
      <Grade id="GR-03" />
    </AbsoluteFill>
  );
};

export default S18;
