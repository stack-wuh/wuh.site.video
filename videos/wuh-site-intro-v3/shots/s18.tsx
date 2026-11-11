/* S18 · Act 3 第一行 · 局部帧 [0,108) · 108f · 绝对 2694–2802
 *
 * V2 暖黑数据流重写（2026-11-11 品牌暖黑科技）：拓印成章——手作签名点（全镜唯一朱红）：
 * 提交原文拓成一枚矩形钤印（sealRed 印面 + 金边 SVG 描出 0–22 原窗 + 辉光），
 * 印章 8f 落下（30=绝对 2724 对音=ANCHORS.commitSeal），印面=完整提交原文（等宽原样），
 * 右下小字日期 2024-12-08；落定静止 2 拍；
 * gh01 提交页截图降级为「证据快闪」辉光小窗（WIN-01，70–90=绝对 2764–2784 出现，
 * 至镜尾 38f ≤2s 口径；琥珀边+外辉光+深投影，不做整屏主角）；rack focus 印面→物证窗。
 * 转场：入「切」，出「切」。无字幕（画面文字=提交原文）。
 * 尾帧：红印冻帧压在物证窗上（交接态：朱印+物证窗）。
 */
import type { FC } from 'react';
import { AbsoluteFill, Img, interpolate, useCurrentFrame } from 'remotion';
import { staticFile } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { CURVES } from '../../../brand/motion';
import { FILM_COLORS2, frameIn, pathDraw } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';

const CODE_LINE = 'feat(init): 基于nextjs构建的monorepos项目';
const SEEL_LAND = 30; // 绝对 2724 对音
/** 金边（rect 等价 path，rx=8 圆角；真长度由 evolvePath 计算，不再猜 2330） */
const BORDER_D = 'M 12 4 H 948 Q 956 4 956 12 V 208 Q 956 216 948 216 H 12 Q 4 216 4 208 V 12 Q 4 4 12 4 Z';

const S18: FC = () => {
  const frame = useCurrentFrame();
  const cam = { scale: 1.04, x: 0, y: 0, rot: 0 };
  // 金边描出（0–22，pathDraw）
  const border = pathDraw(frame, 0, 22, BORDER_D);
  // 印章落下（22–30，8f：scale 1.18→1 + 位移落纸）
  const drop = interpolate(frame, [22, SEEL_LAND], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseIn });
  const sealScale = interpolate(drop, [0, 1], [1.18, 1]);
  const sealY = interpolate(drop, [0, 1], [-46, 0]);
  // rack focus 印面→物证窗（SEEL_LAND+6 → 100）
  const rack = interpolate(frame, [SEEL_LAND + 6, 100], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  // 证据快闪窗（WIN-01，70–90 出现；琥珀边+辉光+深投影）
  const win = frameIn(frame, 70);

  return (
    <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep }}>
      <DeepSpace seed="s18v2" stars={52} grid />
      <CameraRig cam={cam}>
        <AbsoluteFill>
          {/* 证据快闪：gh01 提交页（辉光小窗，70–90 出现即驻至镜尾 38f；rack 后成为焦点） */}
          <div style={{ position: 'absolute', left: 760, top: 280, width: 660, height: 400, zIndex: 28, ...win }}>
            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: 10, background: FILM_COLORS2.panel, filter: `blur(${(1 - rack) * 1.5}px)` }}>
              <Img src={staticFile('wuh-site-intro-v3/site/gh01-init-commit-v1.png')} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block' }} />
              <div style={{ position: 'absolute', inset: 0, background: FILM_COLORS2.spaceDeep, opacity: (1 - rack) * 0.45 }} />
            </div>
            <div style={{ position: 'absolute', inset: -1, borderRadius: 11, border: `1px solid ${FILM_COLORS2.dataDim}`, boxShadow: `0 0 44px rgba(212,163,115,0.22), 0 24px 60px rgba(0,0,0,0.65)`, pointerEvents: 'none' }} />
          </div>

          {/* 矩形钤印（手作签名；印面=提交原文；rack 后退为虚） */}
          <div style={{ position: 'absolute', left: 480, top: 330, width: 960, height: 220, zIndex: 30, transform: `scale(${sealScale}) translateY(${sealY}px)`, filter: `blur(${rack * 2}px)` }}>
            <div style={{ position: 'absolute', inset: 0, background: FILM_COLORS2.sealRed, opacity: 0.94, borderRadius: 8, boxShadow: `0 18px 40px rgba(0,0,0,0.45), 0 0 34px rgba(122,31,22,0.4)` }} />
            {/* 金边描出（SVG path stroke，真长度驱动；CSSProperties 走 style） */}
            <svg width={960} height={220} style={{ position: 'absolute', inset: 0 }}>
              <path d={BORDER_D} fill="none" stroke={FILM_COLORS2.gold} strokeWidth={2.4} style={border} opacity={0.85} />
            </svg>
            <div style={{ position: 'absolute', left: 0, right: 0, top: 56, textAlign: 'center', fontFamily: fontFamilies.mono, fontSize: 40, color: FILM_COLORS2.paperWhite, fontVariantNumeric: 'tabular-nums', letterSpacing: '0.02em' }}>
              {CODE_LINE}
            </div>
            <div style={{ position: 'absolute', right: 40, bottom: 28, fontFamily: fontFamilies.mono, fontSize: 20, color: FILM_COLORS2.paperWhite, opacity: 0.8, fontVariantNumeric: 'tabular-nums' }}>
              2024-12-08
            </div>
          </div>
        </AbsoluteFill>
      </CameraRig>
      <HudChrome label="wuh.site · PROOF" readout="COMMIT 01 / 7" />
      <Grade2 id="GR2-03" />
    </AbsoluteFill>
  );
};

export default S18;
