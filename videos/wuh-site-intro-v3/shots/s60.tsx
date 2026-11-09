/* S60 · Act 8 此刻 · 局部帧 [0,118) · 118f · 绝对 7964–8082
 *
 * 总结·意象收束：自全树收回一张纸（0–16）；六枚母题——墨点/纸页/代码行/
 * 黑胶/灯/钤印——低透明浮雕逐个叠印同一张纸（FN-46 motifOverlay，≤12%，
 * 12f 错峰 ×6）；数字退成画面脚注（FN-48 footnoteStrip r4 纪律：镜内 20f 起、
 * ≥16px、全落定距镜尾 ≥20f、微滚）：1,208 提交 · 46 篇文章 · 119 版本 ·
 * 13,603 格 · 266 归档 · 40 知识卡（DATA 常量，2026-11-08 快照）；
 * 角落一枚本片自己的工单痕迹。转场：入「切」，出「切」。
 * 字幕安全窗：start≥12、end≤106。
 * 尾帧：母题底纹+脚注就位。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, writeFade } from '../../../brand/motion';
import { DATA, footnoteStrip, motifOverlay, ROLL_DUR } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { Caption } from '../components/Caption';
import { DustField } from '../components/DustField';
import { Grade } from '../components/Grade';
import { PaperGrain } from '../components/PaperGrain';

const TOTAL = 118;

const S60: FC = () => {
  const frame = useCurrentFrame();
  const paperIn = interpolate(frame, [0, 16], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  const overlayAt = motifOverlay(frame, 16, 12);
  const foot = footnoteStrip(frame, 0, 6, TOTAL);
  const cam = { scale: 1.02, x: 0, y: 0, rot: 0 };
  const roll = (i: number, from: number, to: number) => Math.round(from + (to - from) * foot(i).roll);

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <CameraRig cam={cam}>
        <AbsoluteFill>
          <DustField act={8} count={10} seedBase="s60" />

          {/* 总结纸页 */}
          <div style={{ position: 'absolute', left: 280, top: 110, width: 1360, height: 860, borderRadius: 8, background: colors.paper, border: `1px solid ${colors.paperMuted}`, opacity: paperIn, boxShadow: '0 30px 80px rgba(0,0,0,0.4)' }}>
            {/* 六枚母题叠印（≤12%，浮雕底纹） */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
              {/* 1 墨点 */}
              <div style={{ position: 'absolute', left: 120, top: 110, width: 90, height: 90, borderRadius: 45, background: colors.ink, opacity: overlayAt(0) * 0.9 }} />
              {/* 2 纸页 */}
              <div style={{ position: 'absolute', left: 330, top: 90, width: 130, height: 170, borderRadius: 6, border: `3px solid ${colors.ink}`, opacity: overlayAt(1) }} />
              {/* 3 代码行 */}
              <div style={{ position: 'absolute', left: 540, top: 110, fontFamily: fontFamilies.mono, fontSize: 44, color: colors.ink, opacity: overlayAt(2) }}>{'< />'}</div>
              {/* 4 黑胶 */}
              <div style={{ position: 'absolute', left: 700, top: 90, width: 130, height: 130, borderRadius: 65, border: `14px solid ${colors.ink}`, opacity: overlayAt(3) }} />
              {/* 5 灯 */}
              <div style={{ position: 'absolute', left: 900, top: 100, width: 0, height: 0, borderLeft: 60, borderRight: 60, borderTop: 100, borderStyle: 'solid', borderColor: `${colors.ink} transparent transparent`, opacity: overlayAt(4) }} />
              {/* 6 钤印 */}
              <div style={{ position: 'absolute', left: 1080, top: 110, width: 110, height: 110, borderRadius: 8, border: `6px solid ${colors.seal}`, opacity: overlayAt(5) }} />
            </div>

            {/* 总结句 */}
            <div style={{ position: 'absolute', left: 0, right: 0, top: 350, textAlign: 'center', zIndex: 30, ...writeFade(frame, 24, true) }}>
              <span style={{ fontFamily: fontFamilies.serif, fontSize: 54, color: colors.ink, opacity: 0.92 }}>写作是根，代码是干；</span>
              <div style={{ marginTop: 18 }}>
                <span style={{ fontFamily: fontFamilies.serif, fontSize: 54, color: colors.ink, opacity: 0.92 }}>方法、工具、桌面与影像，是后来长出的枝。</span>
              </div>
            </div>

            {/* FN-48 数字脚注（微滚 · ≥16px · 距镜尾 ≥20f 全落定） */}
            <div style={{ position: 'absolute', left: 90, right: 90, bottom: 90, display: 'flex', justifyContent: 'space-between', fontFamily: fontFamilies.mono, fontSize: 17, color: colors.muted, fontVariantNumeric: 'tabular-nums' }}>
              {[
                { v: roll(0, 1180, DATA.commits), label: '提交' },
                { v: roll(1, 40, DATA.articles), label: '篇文章' },
                { v: roll(2, 110, DATA.tags), label: '版本' },
                { v: roll(3, 13000, DATA.activity), label: '格活动' },
                { v: roll(4, 250, DATA.archives), label: '归档' },
                { v: roll(5, 35, DATA.knowledge), label: '知识卡' },
              ].map((it, i) => (
                <span key={it.label} style={{ opacity: foot(i).opacity }}>
                  {it.v.toLocaleString('en-US')} {it.label}
                </span>
              ))}
            </div>
            {/* 本片工单痕迹（画面角落，导演定夺项保留） */}
            <div style={{ position: 'absolute', right: 60, bottom: 44, fontFamily: fontFamilies.mono, fontSize: 13, color: colors.muted, opacity: Number(writeFade(frame, 90).opacity ?? 1) * 0.55 }}>
              wuh.site.video · 20261109-feature-wuh-site-intro-v3-production
            </div>
          </div>
        </AbsoluteFill>
      </CameraRig>
      <PaperGrain opacity={0.06} />
      <Grade id="GR-02" />
      <Caption text="写作是根，代码是干；方法、工具、桌面与影像，是后来长出的枝。" appearAt={14} />
    </AbsoluteFill>
  );
};

void ROLL_DUR;
export default S60;
