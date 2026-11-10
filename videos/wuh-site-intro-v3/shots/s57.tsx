/* S57 · Act 8 此刻 · 局部帧 [0,120) · 120f · 绝对 7612–7732
 *
 * 桌面枝：wuh.site.desktop（2026-09-13 · 276 commits · v0.1.0，标签落位即现）；
 * 一间桌面书房小窗在枝上打开（8–26），Markdown / GitHub / 插件沙箱 / 四主题
 * 图标依次亮起（30–90）；横移到枝 3。转场：入「切」，出「切」。
 * 字幕安全窗：start≥12、end≤108。
 * 尾帧：枝 3 书房小窗亮。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, writeFade } from '../../../brand/motion';
import { treeGrow } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { Caption } from '../components/Caption';
import { DustField } from '../components/DustField';
import { Grade } from '../components/Grade';
import { PaperGrain } from '../components/PaperGrain';

const TOTAL = 120;
const ICONS = [
  { name: 'Markdown', glyph: 'M↓' },
  { name: 'GitHub', glyph: '' },
  { name: '插件沙箱', glyph: '▣' },
  { name: '四主题', glyph: '◐' },
];
/** 枝 3（真长度由 evolvePath 计算，不再猜 900） */
const B3_D = 'M 890 620 C 980 520 1090 460 1230 430';

const S57: FC = () => {
  const frame = useCurrentFrame();
  const b3 = treeGrow(frame, 6, 36, B3_D);
  const cam = { scale: 1.03, x: interpolate(frame, [0, TOTAL], [-30, 60], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }), y: 0, rot: 0 };

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <CameraRig cam={cam}>
        <AbsoluteFill>
          <DustField act={8} count={12} seedBase="s57" />
          {/* 树骨架 + 枝 1–2（常驻） */}
          <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            <path d="M 910 520 C 900 640 880 760 850 880" fill="none" stroke={colors.ink} strokeWidth={10} opacity={0.9} />
            <path d="M 880 660 C 700 620 520 600 300 620" fill="none" stroke={colors.ink} strokeWidth={5} opacity={0.85} />
            <path d="M 880 700 C 1060 700 1240 720 1420 700" fill="none" stroke={colors.ink} strokeWidth={5} opacity={0.85} />
            {/* 枝 3（上挑） */}
            <path d={B3_D} fill="none" stroke={colors.ink} strokeWidth={4.5} {...b3.stroke} opacity={0.85} />
          </svg>

          {/* 枝 3 标签卡 */}
          <div style={{ position: 'absolute', left: 1210, top: 300, ...writeFade(frame, 16) }}>
            <div style={{ background: colors.paper, border: `1px solid ${colors.gold}`, borderRadius: 8, padding: '18px 26px', boxShadow: '0 16px 44px rgba(0,0,0,0.35)' }}>
              <div style={{ fontFamily: fontFamilies.mono, fontSize: 22, color: colors.ink }}>wuh.site.desktop</div>
              <div style={{ fontFamily: fontFamilies.mono, fontSize: 15, color: colors.muted, marginTop: 8 }}>2026-09-13 · 276 commits · v0.1.0</div>
            </div>
          </div>

          {/* 书房小窗（8–26 打开）+ 图标逐亮（30–90） */}
          <div style={{ position: 'absolute', left: 1210, top: 470, width: 520, height: 330, borderRadius: 10, border: `1px solid ${colors.hairline}`, background: colors.terminalBg, boxShadow: '0 20px 60px rgba(0,0,0,0.5)', opacity: interpolate(frame, [8, 26], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }), transform: `scale(${interpolate(frame, [8, 26], [0.86, 1])})` }}>
            <div style={{ position: 'absolute', left: 20, top: 14, display: 'flex', gap: 8 }}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{ width: 11, height: 11, borderRadius: 6, background: colors.muted, opacity: 0.4 }} />
              ))}
              <span style={{ fontFamily: fontFamilies.mono, fontSize: 13, color: colors.muted, marginLeft: 10, opacity: 0.7 }}>desktop · 书房</span>
            </div>
            <div style={{ position: 'absolute', left: 0, right: 0, top: 100, display: 'flex', justifyContent: 'center', gap: 44 }}>
              {ICONS.map((ic, i) => {
                const lit = interpolate(frame, [30 + i * 15, 42 + i * 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
                return (
                  <div key={ic.name} style={{ textAlign: 'center', opacity: 0.25 + lit * 0.75, transform: `translateY(${(1 - lit) * 8}px)` }}>
                    <div style={{ width: 74, height: 74, borderRadius: 12, border: `1px solid ${lit > 0.5 ? colors.gold : colors.hairline}`, background: `rgba(201,111,74,${lit * 0.12})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontFamily: fontFamilies.mono, fontSize: 28, color: colors.paper }}>{ic.glyph}</span>
                    </div>
                    <div style={{ fontFamily: fontFamilies.mono, fontSize: 13, color: colors.muted, marginTop: 10 }}>{ic.name}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </AbsoluteFill>
      </CameraRig>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 300, backgroundImage: `linear-gradient(180deg, transparent, ${colors.bg})`, opacity: 0.2 }} />
      <PaperGrain opacity={0.06} />
      <Grade id="GR-08" />
      <Caption text="再长出一间桌面书房：Markdown、GitHub、插件沙箱。" appearAt={14} />
    </AbsoluteFill>
  );
};

export default S57;
