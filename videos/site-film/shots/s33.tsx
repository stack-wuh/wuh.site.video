/* 镜 33 · Act 5 创作人文 · 全局帧 [5000,5250) · 250f */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, GRADES, glowPulse, writeFade } from '../motion-tokens';
import { CameraRig, ParallaxLayer } from '../components/CameraRig';
import { DustField } from '../components/DustField';

const serif = fontFamilies.serif;
const sans = fontFamilies.sans;

const CLAMP = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

const grade = GRADES[4]; // grade-warm-paper：幕级根层 saturate(0.95) 作为镜根 filter 带入（背景由 ShotShell 提供）

/* 坐标保真（幕局部基准 + localStart = 300）：camDrift / glowPulse 为无钳制 Math.sin 振荡器，
   相位依赖幕局部帧 → const frame = useCurrentFrame() + 300，全部断点字面量逐字保留幕局部坐标
   （truck [300,450]、dolly [430,550]、wallBlur [400,480]、pulled [360,400]、spreadP [380,420]、
   closeP [515,550]、ghostP [542,550]、path-draw delay 400+i*40、write-fade delay 450），
   逐帧复现原片渲染，不做镜局部改写。本镜无冻结断点，动画照原样播放。 */

/** cam-drift 减半档：固定机位的呼吸（±2px / ±0.075°，120f 周期） */
const camDrift = (frame: number): { x: number; y: number; rot: number } => ({
  x: Math.sin((frame / 120) * Math.PI * 2 + 1.3) * 2,
  y: Math.cos((frame / 120) * Math.PI * 2 + 1.1) * 2,
  rot: Math.sin((frame / 120) * Math.PI * 2 + 0.6) * 0.075,
});

/** path-draw 慢档（60f）：返回 strokeDashoffset，起收笔呼吸 */
const pathDrawSlow = (frame: number, delay: number, len: number): number =>
  len - interpolate(frame - delay, [0, 60], [0, len], { ...CLAMP, easing: CURVES.cineEaseInOut });

/* ─── 书墙书摘（原 Act5 ShotBookWall，幕局部 300–550 逐字保留） ───
   dof-parallax 书封墙投影层叠 + cam-truck 横移 → cam-dolly-in 缓推抽出的书 +
   path-draw 慢档 ×3（错 40f）+ glow-pulse 微光档；出场 tr-book-to-photo 合拢化作拍立得白框 */
const BOOK_TONES: readonly string[] = [colors.paperDeep, colors.paperMuted, colors.accent, colors.muted];

const Spine: FC<{ i: number; w: number; h: number }> = ({ i, w, h }) => (
  <div
    style={{
      width: w,
      height: h + ((i * 13) % 18),
      borderRadius: '3px 3px 2px 2px',
      background: BOOK_TONES[(i * 7) % BOOK_TONES.length],
      opacity: 0.88,
      boxShadow: `inset 3px 0 0 ${colors.paper}`,
      position: 'relative',
    }}
  >
    <div style={{ position: 'absolute', left: 9, top: 12 + ((i * 11) % 22), width: 2, height: h * 0.34, background: colors.paper, opacity: 0.55 }} />
  </div>
);

const ShotBookWall: FC = () => {
  const frame = useCurrentFrame() + 300; // 幕局部帧（无钳制振荡器保相位 + 断点逐字保真）
  const drift = camDrift(frame);
  const truck = interpolate(frame, [300, 450], [46, -46], { ...CLAMP, easing: CURVES.cineEaseInOut });
  const dolly = interpolate(frame, [430, 550], [0, 0.1], { ...CLAMP, easing: CURVES.cineEaseInOut });
  const cam = { scale: 1 + dolly, x: truck + drift.x, y: drift.y, rot: drift.rot, origin: '58% 44%' };
  const wallBlur = interpolate(frame, [400, 480], [0, 5], CLAMP); // 浅景深：推近时书墙退虚
  const pulled = interpolate(frame, [360, 400], [0, 1], { ...CLAMP, easing: CURVES.cineEaseInOut });
  const spreadP = interpolate(frame, [380, 420], [0, 1], { ...CLAMP, easing: CURVES.cineEaseOut });
  const closeP = interpolate(frame, [515, 550], [0, 1], { ...CLAMP, easing: CURVES.cineEaseInOut }); // tr-book-to-photo 合拢
  const ghostP = interpolate(frame, [542, 550], [0, 1], CLAMP); // 拍立得白框 8f 交叉淡变
  return (
    <AbsoluteFill style={{ filter: `saturate(${grade.filter.saturate})` }}>
      <CameraRig cam={cam}>
        <ParallaxLayer depth={0.6} cam={cam} blurBase={8}>
          {[150, 252].map((top, r) => (
            <div key={top} style={{ position: 'absolute', left: -40, top, display: 'flex', gap: 8, filter: `blur(${wallBlur}px)` }}>
              {Array.from({ length: 26 }).map((_, i) => (
                <Spine key={i} i={i + r * 26} w={56} h={82} />
              ))}
            </div>
          ))}
        </ParallaxLayer>
        <ParallaxLayer depth={1} cam={cam}>
          <div style={{ position: 'absolute', left: -60, top: 368, display: 'flex', gap: 9, alignItems: 'flex-end', filter: `blur(${wallBlur * 0.5}px)` }}>
            {Array.from({ length: 24 }).map((_, i) => (
              <div key={i} style={{ position: 'relative', transform: `translateY(${i === 15 ? pulled * -30 : 0}px)` }}>
                <Spine i={i + 60} w={66} h={96} />
                {i === 15 ? (
                  <span
                    style={{
                      position: 'absolute',
                      top: -26,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      fontFamily: sans,
                      fontSize: 13,
                      whiteSpace: 'nowrap',
                      background: colors.accent,
                      color: colors.ink,
                      borderRadius: 9,
                      padding: '2px 10px',
                      opacity: pulled,
                    }}
                  >
                    阅读中
                  </span>
                ) : null}
              </div>
            ))}
          </div>
          <div style={{ position: 'absolute', left: -80, right: -80, top: 486, height: 8, background: colors.paperMuted, opacity: 0.9 }} />
          {/* 摊开的划线书摘（书墙虚化之上） */}
          <div
            style={{
              position: 'absolute',
              left: 660,
              top: 214,
              width: 600,
              height: 400,
              opacity: spreadP * (1 - ghostP),
              transform: `translateY(${(1 - spreadP) * 26}px) scale(${1 - closeP * 0.03})`,
            }}
          >
            <div style={{ position: 'absolute', left: 30, top: 40, width: 560, height: 380, background: colors.ink, opacity: 0.15, filter: 'blur(24px)', borderRadius: 24 }} />
            <div style={{ ...glowPulse(frame, 0.8, 120), position: 'relative', display: 'flex', width: '100%', height: '100%', background: colors.paper, borderRadius: 6 }}>
              {/* 左页 */}
              <div style={{ width: 300, padding: '40px 28px', borderRight: `1px solid ${colors.paperMuted}`, boxSizing: 'border-box' }}>
                {[214, 242, 186, 238, 204].map((w, i) => (
                  <div key={i} style={{ width: w, height: 12, background: colors.paperDeep, borderRadius: 6, marginBottom: 24 }} />
                ))}
              </div>
              {/* 右页：划线书摘（path-draw 慢档 ×3，错 40f）+ 合拢翻页 */}
              <div
                style={{
                  width: 300,
                  padding: '36px 28px',
                  boxSizing: 'border-box',
                  transformOrigin: 'left center',
                  transform: `rotateY(${-165 * closeP}deg)`,
                  background: colors.paper,
                  borderRadius: '0 6px 6px 0',
                }}
              >
                {[0, 1, 2].map((i) => (
                  <div key={i} style={{ marginBottom: 26 }}>
                    <div style={{ width: [224, 202, 238][i], height: 12, background: colors.paperDeep, borderRadius: 6, marginBottom: 10 }} />
                    <div style={{ width: [188, 168, 200][i], height: 12, background: colors.paperDeep, borderRadius: 6, marginBottom: 12, opacity: 0.6 }} />
                    <svg width={250} height={8}>
                      <line x1={0} y1={4} x2={250} y2={4} stroke={colors.accent} strokeWidth={3} strokeLinecap="round" strokeDasharray={250} strokeDashoffset={pathDrawSlow(frame, 400 + i * 40, 250)} opacity={0.9} />
                    </svg>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* tr-book-to-photo：合拢瞬间拍立得白框落纸（8f crossfade） */}
          <div style={{ position: 'absolute', left: 840, top: 264, width: 240, height: 300, opacity: ghostP, transform: `scale(${0.96 + ghostP * 0.04})` }}>
            <div style={{ position: 'absolute', left: 12, top: 20, width: 220, height: 280, background: colors.ink, opacity: 0.14, filter: 'blur(18px)', borderRadius: 16 }} />
            <div style={{ position: 'relative', width: '100%', height: '100%', background: colors.paper, borderRadius: 6, padding: 12, boxSizing: 'border-box' }}>
              <div style={{ width: '100%', height: '100%', background: colors.paperMuted }} />
            </div>
          </div>
          <p style={{ ...writeFade(frame, 450, true), position: 'absolute', left: 0, right: 0, bottom: 128, textAlign: 'center', fontFamily: serif, fontSize: 34, color: colors.ink, letterSpacing: '0.06em', margin: 0 }}>
            读过的每一行，都长进了骨头里
          </p>
        </ParallaxLayer>
      </CameraRig>
      {/* 幕级常量 overlay（原 Act5 根层分解入镜，保持原渲染次序）：光尘 multiply 层 + grade LUT + veil */}
      <div style={{ position: 'absolute', inset: 0, mixBlendMode: 'multiply' }}>
        <DustField act={5} />
      </div>
      <AbsoluteFill style={{ background: grade.lut.color, mixBlendMode: grade.lut.blend, opacity: grade.lut.opacity }} />
      <AbsoluteFill style={{ background: grade.veil.color, mixBlendMode: grade.veil.blend, opacity: grade.veil.opacity }} />
    </AbsoluteFill>
  );
};

export default ShotBookWall;
