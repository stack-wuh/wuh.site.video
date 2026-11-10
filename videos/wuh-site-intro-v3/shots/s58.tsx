/* S58 · Act 8 此刻 · 局部帧 [0,118) · 118f · 绝对 7732–7850
 *
 * 工具枝：shadow-dev-cli（2026-09-16 · 158 commits · v1.9.0，标签落位即现）；
 * plan 与 execute 两枚步骤牌先后落定（36 / 66），planHash 一行小字确认后
 * 落盘（84）、纸面轻震（84 paperShake）；俯拍微距机位不动。
 * 转场：入「切」，出「切」。字幕安全窗：start≥12、end≤106。
 * 尾帧：枝 4 双牌落定。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { sealStamp, sealTilt, writeFade } from '../../../brand/motion';
import { paperShake, treeGrow } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { Caption } from '../components/Caption';
import { DustField } from '../components/DustField';
import { Grade } from '../components/Grade';
import { PaperGrain } from '../components/PaperGrain';

/** 枝 4（真长度由 evolvePath 计算，不再猜 800） */
const B4_D = 'M 895 600 C 830 520 760 470 640 445';

const S58: FC = () => {
  const frame = useCurrentFrame();
  const b4 = treeGrow(frame, 6, 34, B4_D);
  const shake = paperShake(frame, 84, 1.6, 9);
  const cam = { scale: 1.05, x: 0, y: interpolate(frame, [0, 30], [0, 20], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }), rot: 0 };

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <CameraRig cam={cam}>
        <AbsoluteFill>
          <DustField act={8} count={10} seedBase="s58" />
          {/* 树骨架 + 枝 4（下垂工具枝） */}
          <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            <path d="M 910 520 C 900 640 880 760 850 880" fill="none" stroke={colors.ink} strokeWidth={10} opacity={0.9} />
            <path d="M 880 660 C 700 620 520 600 300 620" fill="none" stroke={colors.ink} strokeWidth={5} opacity={0.85} />
            <path d="M 880 700 C 1060 700 1240 720 1420 700" fill="none" stroke={colors.ink} strokeWidth={5} opacity={0.85} />
            <path d="M 890 620 C 980 520 1090 460 1230 430" fill="none" stroke={colors.ink} strokeWidth={4.5} opacity={0.85} />
            <path d={B4_D} fill="none" stroke={colors.ink} strokeWidth={4.5} {...b4.stroke} opacity={0.85} />
          </svg>

          {/* 枝 4 标签卡 */}
          <div style={{ position: 'absolute', left: 360, top: 330, ...writeFade(frame, 14) }}>
            <div style={{ background: colors.paper, border: `1px solid ${colors.gold}`, borderRadius: 8, padding: '18px 26px', boxShadow: '0 16px 44px rgba(0,0,0,0.35)' }}>
              <div style={{ fontFamily: fontFamilies.mono, fontSize: 22, color: colors.ink }}>shadow-dev-cli</div>
              <div style={{ fontFamily: fontFamilies.mono, fontSize: 15, color: colors.muted, marginTop: 8 }}>2026-09-16 · 158 commits · v1.9.0</div>
            </div>
          </div>

          {/* plan 牌（36 落定） */}
          <div style={{ position: 'absolute', left: 330, top: 520, ...sealStamp(frame, 36, 30, sealTilt('s58-plan')) }}>
            <div style={{ width: 330, height: 130, borderRadius: 8, background: colors.terminalBg, border: `1px solid ${colors.hairline}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <span style={{ fontFamily: fontFamilies.mono, fontSize: 30, color: colors.paper, opacity: 0.9 }}>plan</span>
              <span style={{ fontFamily: fontFamilies.mono, fontSize: 13, color: colors.muted, opacity: 0.75 }}>planHash ✓ 确认后执行</span>
            </div>
          </div>
          {/* execute 牌（66 落定） */}
          <div style={{ position: 'absolute', left: 720, top: 520, ...sealStamp(frame, 66, 30, sealTilt('s58-exec')) }}>
            <div style={{ width: 330, height: 130, borderRadius: 8, background: colors.terminalBg, border: `1px solid ${colors.hairline}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <span style={{ fontFamily: fontFamilies.mono, fontSize: 30, color: colors.paper, opacity: 0.9 }}>execute</span>
              <span style={{ fontFamily: fontFamilies.mono, fontSize: 13, color: colors.muted, opacity: 0.75 }}>{frame >= 84 ? 'planHash ✓ 已落盘' : '等待确认…'}</span>
            </div>
          </div>
          {/* planHash 确认行（84 落盘 + 轻震） */}
          <div style={{ position: 'absolute', left: 380, top: 690, ...writeFade(frame, 84), ...shake }}>
            <span style={{ fontFamily: fontFamilies.mono, fontSize: 16, color: colors.gold, opacity: 0.9 }}>planHash bb96c4de… ✓ 落盘</span>
          </div>
        </AbsoluteFill>
      </CameraRig>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 300, backgroundImage: `linear-gradient(180deg, transparent, ${colors.bg})`, opacity: 0.2 }} />
      <PaperGrain opacity={0.06} />
      <Grade id="GR-08" />
      <Caption text="方法又长成一把工具：plan → execute，确定性地落盘。" appearAt={14} />
    </AbsoluteFill>
  );
};

export default S58;
