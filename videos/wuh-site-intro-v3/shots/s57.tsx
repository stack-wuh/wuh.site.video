/* S57 · Act 8 此刻 · 局部帧 [0,120) · 120f · 绝对 7612–7732
 *
 * V2 深空数据流重构（2026-11-11）：桌面枝 wuh.site.desktop 琥珀墨线生长
 * （6–36 原窗口）；标签改线框数据卡（16 落位即现，标识不滚）：
 * 2026-09-13 · 276 commits · v0.1.0；一间桌面书房 = 线框数据小窗
 * （8–26 打开，panel 底+琥珀边+辉光），Markdown / GitHub / 插件沙箱 / 四主题
 * 图标芯片依次亮起（30–90 原窗口）；横移到枝 3。转场：入「切」，出「切」。
 * 字幕安全窗：start≥12、end≤108。
 * 尾帧：枝 3 书房小窗亮。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { CURVES, writeFade } from '../../../brand/motion';
import { FILM_COLORS2, glowText, treeGrow } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { Caption } from '../components/Caption';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';

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
    <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep }}>
      <CameraRig cam={cam}>
        <AbsoluteFill>
          <DeepSpace seed="s57v2" stars={52} grid horizon />
          {/* 树骨架 + 枝 1–2（常驻，琥珀墨） */}
          <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            <path d="M 910 520 C 900 640 880 760 850 880" fill="none" stroke="rgba(212,163,115,0.16)" strokeWidth={18} />
            <path d="M 910 520 C 900 640 880 760 850 880" fill="none" stroke={FILM_COLORS2.data} strokeWidth={9} opacity={0.92} />
            <path d="M 880 660 C 700 620 520 600 300 620" fill="none" stroke="rgba(212,163,115,0.14)" strokeWidth={12} />
            <path d="M 880 660 C 700 620 520 600 300 620" fill="none" stroke={FILM_COLORS2.data} strokeWidth={4.5} opacity={0.88} />
            <path d="M 880 700 C 1060 700 1240 720 1420 700" fill="none" stroke="rgba(212,163,115,0.14)" strokeWidth={12} />
            <path d="M 880 700 C 1060 700 1240 720 1420 700" fill="none" stroke={FILM_COLORS2.data} strokeWidth={4.5} opacity={0.88} />
            {/* 枝 3（上挑，琥珀墨线生长） */}
            <path d={B3_D} fill="none" stroke="rgba(212,163,115,0.14)" strokeWidth={11} {...b3.stroke} />
            <path d={B3_D} fill="none" stroke={FILM_COLORS2.data} strokeWidth={4} {...b3.stroke} opacity={0.88} />
          </svg>

          {/* 枝 3 标签卡（线框数据卡） */}
          <div style={{ position: 'absolute', left: 1210, top: 300, ...writeFade(frame, 16) }}>
            <div
              style={{
                background: FILM_COLORS2.panel,
                border: `1px solid ${FILM_COLORS2.dataDim}`,
                borderRadius: 8,
                padding: '18px 26px',
                boxShadow: `0 0 26px rgba(212,163,115,0.16), 0 16px 44px rgba(0,0,0,0.55)`,
              }}
            >
              <div style={{ fontFamily: fontFamilies.mono, fontSize: 22, color: FILM_COLORS2.paperWhite, ...glowText(FILM_COLORS2.data, 0.2) }}>wuh.site.desktop</div>
              <div style={{ fontFamily: fontFamilies.mono, fontSize: 15, color: FILM_COLORS2.textMuted, marginTop: 8 }}>2026-09-13 · 276 commits · v0.1.0</div>
            </div>
          </div>

          {/* 书房小窗（8–26 打开，线框数据窗）+ 图标芯片逐亮（30–90） */}
          <div
            style={{
              position: 'absolute',
              left: 1210,
              top: 470,
              width: 520,
              height: 330,
              borderRadius: 10,
              border: `1px solid ${FILM_COLORS2.dataDim}`,
              background: FILM_COLORS2.panel,
              boxShadow: `0 0 34px rgba(212,163,115,0.16), 0 20px 60px rgba(0,0,0,0.6)`,
              opacity: interpolate(frame, [8, 26], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
              transform: `scale(${interpolate(frame, [8, 26], [0.86, 1])})`,
            }}
          >
            <div style={{ position: 'absolute', left: 20, top: 14, display: 'flex', gap: 8, alignItems: 'center' }}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{ width: 11, height: 11, borderRadius: 6, border: `1px solid ${FILM_COLORS2.dataDim}`, opacity: 0.5 }} />
              ))}
              <span style={{ fontFamily: fontFamilies.mono, fontSize: 13, color: FILM_COLORS2.textMuted, marginLeft: 10, letterSpacing: '0.18em', opacity: 0.8 }}>desktop · 书房</span>
            </div>
            <div style={{ position: 'absolute', left: 0, right: 0, top: 100, display: 'flex', justifyContent: 'center', gap: 44 }}>
              {ICONS.map((ic, i) => {
                const lit = interpolate(frame, [30 + i * 15, 42 + i * 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
                return (
                  <div key={ic.name} style={{ textAlign: 'center', opacity: 0.25 + lit * 0.75, transform: `translateY(${(1 - lit) * 8}px)` }}>
                    <div
                      style={{
                        width: 74,
                        height: 74,
                        borderRadius: 12,
                        border: `1px solid ${lit > 0.5 ? FILM_COLORS2.dataDim : FILM_COLORS2.line}`,
                        background: `rgba(212,163,115,${lit * 0.1})`,
                        boxShadow: lit > 0.5 ? `0 0 ${8 + lit * 14}px rgba(212,163,115,${0.16 * lit})` : 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <span style={{ fontFamily: fontFamilies.mono, fontSize: 28, color: FILM_COLORS2.paperWhite }}>{ic.glyph}</span>
                    </div>
                    <div style={{ fontFamily: fontFamilies.mono, fontSize: 13, color: FILM_COLORS2.textMuted, marginTop: 10 }}>{ic.name}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </AbsoluteFill>
      </CameraRig>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 300, backgroundImage: `linear-gradient(180deg, transparent, ${FILM_COLORS2.spaceDeep})`, opacity: 0.2 }} />
      <HudChrome label="wuh.site · GRAPH" readout="BRANCH 3 · DESKTOP" />
      <Grade2 id="GR2-08" />
      <Caption text="再长出一间桌面书房：Markdown、GitHub、插件沙箱。" appearAt={14} />
    </AbsoluteFill>
  );
};

export default S57;
