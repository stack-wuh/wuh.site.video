/* S35 · Act 6 入院 · 局部帧 [0,88) · 88f · 绝对 5084–5172
 *
 * V2 深空数据流重写（2026-11-11 品牌暖黑科技）：两种人格（其二）——模块轨道保持
 * 五块亮·05 展开中；S07 About 弹幕聊天室数据流化：左右分列聊天气泡交替弹入
 * （18–66，半拍错峰 18+i*8 窗口原样；左列线框气泡=访客 / 右列 sealRed 边气泡=
 * 站长，两种人格双色读数）；微距俯拍轻微横摇 ±2°（CameraRig yaw 窗口原样）；
 * 两列气泡聚成一点（66–74，converge 变换原样）→ 收束（74–82 淡出）→ 尾段
 * 模块轨道光标移向 06（74–88）。
 * 转场：入「切」，出「切」。字幕安全窗：start≥12、end≤76。
 * 尾帧：模块轨道 01–05 亮、光标停在 06 前（交接态：面板+五块亮）。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { CURVES } from '../../../brand/motion';
import { FILM_COLORS2, glowText } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { Caption } from '../components/Caption';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';

const TOTAL = 88;
const RAIL_PITCH = 74;
const BUBBLES = [
  { side: 'L' as const, name: 'Shadow', text: '潘江陆海，各洒云尔~~' },
  { side: 'R' as const, name: '路人', text: '看着不错来玩一下' },
  { side: 'L' as const, name: '远方的名字', text: '聊天式留言比弹幕更容易回看。' },
  { side: 'R' as const, name: 'shshhhsh', text: '随便输入一点什么东西' },
  { side: 'L' as const, name: 'Shadow', text: '见字如面，各洒云尔~' },
  { side: 'R' as const, name: 'kkaksddd', text: '打招呼' },
];

/** V2 模块轨道（原控制台面板的 HUD 化替身）——交接态语义同 s30 */
const Rail: FC<{ lit: number; at: number; cursorP: number; frame: number }> = ({ lit, at, cursorP, frame }) => (
  <div style={{ position: 'absolute', left: '50%', top: 92, width: 582, marginLeft: -291, zIndex: 26 }}>
    <div style={{ display: 'flex', gap: 10 }}>
      {Array.from({ length: 8 }).map((_, i) => {
        const n = i + 1;
        const on = n <= lit;
        const active = n === at && on;
        return (
          <div key={n} style={{ width: 64 }}>
            <div
              style={{
                textAlign: 'center',
                fontFamily: fontFamilies.mono,
                fontSize: 13,
                letterSpacing: '0.18em',
                color: on ? FILM_COLORS2.data : n === at ? FILM_COLORS2.gold : FILM_COLORS2.textMuted,
                opacity: on ? 0.95 : n === at ? 0.9 : 0.5,
                ...(active ? glowText(FILM_COLORS2.data, 0.4 + 0.15 * Math.sin(frame / 6)) : {}),
              }}
            >
              {String(n).padStart(2, '0')}
            </div>
            <div style={{ marginTop: 6, height: 3, borderRadius: 2, background: on ? FILM_COLORS2.data : FILM_COLORS2.line, boxShadow: on ? `0 0 8px rgba(212,163,115,${active ? 0.4 + 0.2 * Math.sin(frame / 6) : 0.45})` : 'none', opacity: on ? 1 : 0.5 }} />
          </div>
        );
      })}
    </div>
    {at > lit ? (
      <div style={{ position: 'absolute', top: 14, left: (at - 1) * RAIL_PITCH - 14 + cursorP * 8, width: 0, height: 0, borderTop: '5px solid transparent', borderBottom: '5px solid transparent', borderLeft: `7px solid ${FILM_COLORS2.gold}`, opacity: 0.9, filter: 'drop-shadow(0 0 6px rgba(212,163,115,0.6))' }} />
    ) : null}
  </div>
);

const S35: FC = () => {
  const frame = useCurrentFrame();
  // 轻微横摇 ±2°（窗口原样）
  const camYaw = Math.sin(frame / 22) * 0.5;
  const cam = { scale: 1.05, x: camYaw * 12, y: 0, rot: camYaw };
  // 气泡聚点（66–74，变换原样）
  const converge = interpolate(frame, [66, 74], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseIn });
  // 轨道态：五块亮·05 展开中 → 尾段光标移向 06（74–88）
  const tail = frame >= TOTAL - 14;
  const lit = 5;
  const at = tail ? 6 : 5;
  const cursorP = tail ? interpolate(frame, [TOTAL - 14, TOTAL], [0, 0.6], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 0.5;
  // 气泡层收束淡出（74–82）
  const contentOut = interpolate(frame, [74, 82], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep }}>
      <DeepSpace seed="s35v2" stars={36} grid />
      <CameraRig cam={cam}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transform: `translate(${converge * (960 - 800)}px, ${converge * (540 - 500)}px) scale(${1 - converge * 0.985})`,
            opacity: (1 - converge * 0.4) * contentOut,
          }}
        >
          {/* Dialog 气泡交替弹入（18–66，半拍错峰） */}
          {BUBBLES.map((b, i) => {
            const t0 = 18 + i * 8;
            const local = frame - t0;
            if (local < 0) return null;
            const pop = interpolate(local, [0, 8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineAccent });
            const mine = b.side === 'R';
            return (
              <div key={i} style={{ position: 'absolute', left: mine ? undefined : 300, right: mine ? 300 : undefined, top: 170 + i * 86, opacity: pop, transform: `translateY(${(1 - pop) * 14}px)` }}>
                <div style={{ display: 'flex', flexDirection: mine ? 'row-reverse' : 'row', alignItems: 'flex-end', gap: 12 }}>
                  <div
                    style={{
                      maxWidth: 560,
                      background: mine ? `rgba(122,31,22,0.3)` : FILM_COLORS2.panel,
                      border: `1px solid ${mine ? 'rgba(122,31,22,0.8)' : FILM_COLORS2.line}`,
                      boxShadow: mine ? `0 0 18px rgba(122,31,22,0.25)` : `0 0 14px rgba(212,163,115,0.08)`,
                      borderRadius: mine ? '12px 4px 12px 12px' : '4px 12px 12px 12px',
                      padding: '12px 20px',
                    }}
                  >
                    <div style={{ fontFamily: fontFamilies.mono, fontSize: 13, color: mine ? FILM_COLORS2.gold : FILM_COLORS2.textMuted, opacity: 0.85, textAlign: mine ? 'right' : 'left' }}>{b.name}</div>
                    <div style={{ fontFamily: fontFamilies.serif, fontSize: 22, color: FILM_COLORS2.paperWhite, marginTop: 4 }}>{b.text}</div>
                  </div>
                  {/* 小尾巴 */}
                  <div style={{ width: 0, height: 0, border: '8px solid transparent', borderTopColor: mine ? 'rgba(122,31,22,0.8)' : FILM_COLORS2.panel }} />
                </div>
              </div>
            );
          })}
        </div>
      </CameraRig>

      <Rail lit={lit} at={at} cursorP={cursorP} frame={frame} />
      <HudChrome label="wuh.site · DIALOG" readout="MODULE 05 · CHAT" />
      <Grade2 id="GR2-06" />
      <Caption text="两种人格，一间屋子。" appearAt={20} />
    </AbsoluteFill>
  );
};

export default S35;
