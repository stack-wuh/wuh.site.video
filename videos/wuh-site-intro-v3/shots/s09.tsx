/* S09 · Act 2 旧屋 · 局部帧 [0,204) · 204f · 绝对 1140–1344
 *
 * 《搬山计划》：遮罩纸页落下展开为木桌俯拍（0–14 pageFlip 承接），正俯缓降 8%；
 * 左边工位便签一叠、右边诗集与一杯茶，两摞纸被推到桌心并排（30–70）；
 * 竖排小楷标题《搬山计划》落定（80=绝对 1220=拍61，静 2 拍），
 * 宣言逐行浮现（100/130/160）——工作和生活被摆上同一张桌子。
 * 转场：入「纸翻」（18f），出「切」。
 * 字幕安全窗：start≥30、end≤192。
 * 尾帧：宣言落定，桌角笔电掀盖、屏幕微亮（184–204）。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, writeFade } from '../../../brand/motion';
import { CameraRig } from '../components/CameraRig';
import { Caption } from '../components/Caption';
import { DustField } from '../components/DustField';
import { Grade } from '../components/Grade';
import { PaperGrain } from '../components/PaperGrain';

const TOTAL = 204;
const QUOTE_LINES = ['『除了工作就是工作，', '是时候做出一点点改变了，', '去玩生活去』'];

const S09: FC = () => {
  const frame = useCurrentFrame();
  const drop = interpolate(frame, [0, 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  const cam = {
    scale: interpolate(frame, [0, TOTAL], [1.1, 1.02], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }),
    x: 0,
    y: interpolate(frame, [18, 60], [0, 40], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }),
    rot: 0,
  };
  // 两摞纸推移（30–70）：左摞右移、右摞左移，到桌心并排
  const push = interpolate(frame, [30, 70], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  // 竖排标题落定（80=拍61）
  const titleP = interpolate(frame, [70, 80], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineAccent });
  // 笔电掀盖屏幕微亮（184–204）
  const laptop = interpolate(frame, [184, TOTAL], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <CameraRig cam={cam}>
        <AbsoluteFill>
          <DustField act={2} count={16} seedBase="s09" />

          {/* 木桌俯拍底：暖纸桌面 + 木纹横线 */}
          <AbsoluteFill style={{ background: colors.paper }}>
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} style={{ position: 'absolute', left: 0, right: 0, top: 150 + i * 190, height: 2, background: colors.muted, opacity: 0.14 }} />
            ))}
          </AbsoluteFill>

          {/* 左：工位便签一叠（右移到桌心） */}
          <div style={{ position: 'absolute', left: 300 + push * 190, top: 420, width: 300 }}>
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: i * 6,
                  top: i * 10,
                  width: 280,
                  height: 170,
                  borderRadius: 4,
                  background: colors.paper,
                  border: `1px solid ${colors.paperMuted}`,
                  boxShadow: '0 8px 18px rgba(0,0,0,0.12)',
                  transform: `rotate(${i % 2 === 0 ? -1.4 : 1.2}deg)`,
                }}
              >
                <div style={{ position: 'absolute', left: 24, top: 28, width: 180, height: 12, background: colors.ink, opacity: 0.28 }} />
                <div style={{ position: 'absolute', left: 24, top: 54, width: 140, height: 10, background: colors.muted, opacity: 0.22 }} />
                <div style={{ position: 'absolute', left: 24, top: 76, width: 160, height: 10, background: colors.muted, opacity: 0.18 }} />
              </div>
            ))}
            <span style={{ position: 'absolute', left: 20, top: -40, fontFamily: fontFamilies.mono, fontSize: 16, color: colors.muted, letterSpacing: '0.2em' }}>工 位</span>
          </div>

          {/* 右：诗集与一杯茶（左移到桌心） */}
          <div style={{ position: 'absolute', left: 1300 - push * 190, top: 420, width: 320 }}>
            <div style={{ position: 'absolute', left: 30, top: 20, width: 240, height: 170, borderRadius: 4, background: colors.paperDeep, border: `1px solid ${colors.paperMuted}`, boxShadow: '0 10px 20px rgba(0,0,0,0.14)', transform: 'rotate(1.6deg)' }}>
              <div style={{ position: 'absolute', left: 0, right: 0, top: 60, textAlign: 'center', fontFamily: fontFamilies.serif, fontSize: 28, color: colors.ink, opacity: 0.8, letterSpacing: '0.3em' }}>诗 集</div>
            </div>
            <div style={{ position: 'absolute', left: 210, top: 120, width: 92, height: 110 }}>
              <div style={{ position: 'absolute', inset: 0, borderRadius: '8px 8px 14px 14px', border: `2px solid ${colors.muted}`, opacity: 0.6 }} />
              {/* 茶汤 */}
              <div style={{ position: 'absolute', left: 10, right: 10, top: 16, height: 60, borderRadius: 40, background: colors.gold, opacity: 0.4 }} />
              {/* 热气一线 */}
              <div style={{ position: 'absolute', left: 44, top: -46, width: 2, height: 44, background: `linear-gradient(180deg, transparent, ${colors.muted})`, opacity: 0.4 + Math.sin(frame / 30) * 0.12 }} />
            </div>
            <span style={{ position: 'absolute', left: 60, top: -40, fontFamily: fontFamilies.mono, fontSize: 16, color: colors.muted, letterSpacing: '0.2em' }}>生 活</span>
          </div>

          {/* 竖排小楷标题《搬山计划》（落定 80=拍61，静 2 拍） */}
          <div
            style={{
              position: 'absolute',
              left: 790,
              top: 130,
              writingMode: 'vertical-rl',
              fontFamily: fontFamilies.serif,
              fontSize: 64,
              color: colors.ink,
              letterSpacing: '0.28em',
              opacity: titleP,
              transform: `translateY(${(1 - titleP) * -30}px)`,
              textShadow: `0 2px 12px ${colors.bg}`,
            }}
          >
            搬山计划
          </div>

          {/* 宣言逐行（100/130/160，write-fade） */}
          <div style={{ position: 'absolute', left: 460, top: 620, zIndex: 30 }}>
            {QUOTE_LINES.map((line, i) => (
              <div key={i} style={{ ...writeFade(frame, 100 + i * 30, true), marginBottom: 16 }}>
                <span style={{ fontFamily: fontFamilies.serif, fontSize: 34, color: colors.ink, opacity: 0.92 }}>{line}</span>
              </div>
            ))}
          </div>

          {/* 桌角笔电掀盖（184–204，屏幕微亮——尾帧交接） */}
          <div style={{ position: 'absolute', right: 260, top: 660, width: 380, height: 220, opacity: interpolate(frame, [184, 196], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>
            <div style={{ position: 'absolute', left: 20, top: 0, width: 340, height: 12, borderRadius: 3, background: colors.ink, opacity: 0.7, transform: `perspective(800px) rotateX(${(1 - laptop) * -70}deg)`, transformOrigin: 'bottom center' }} />
            <div style={{ position: 'absolute', left: 0, top: 12, width: 380, height: 16, borderRadius: 4, background: colors.paperDeep, border: `1px solid ${colors.paperMuted}` }} />
            {frame >= 196 ? <div style={{ position: 'absolute', left: 30, top: -70, width: 320, height: 80, background: FILM_BLUE, opacity: laptop * 0.16, filter: 'blur(10px)' }} /> : null}
          </div>
        </AbsoluteFill>
      </CameraRig>

      {/* 遮罩纸页落下展开（0–14 承接语汇） */}
      {frame < 15 ? (
        <AbsoluteFill style={{ pointerEvents: 'none', background: colors.paper, clipPath: `inset(0 0 ${(1 - drop) * 100}% 0)` }} />
      ) : null}

      <PaperGrain opacity={0.07} />
      <Grade id="GR-02" />
      <Caption text="五月，他写《搬山计划》：『除了工作就是工作，是时候做出一点点改变了，去玩生活去』" appearAt={104} bottom={110} />
    </AbsoluteFill>
  );
};

const FILM_BLUE = '#9DB4C8';

export default S09;
