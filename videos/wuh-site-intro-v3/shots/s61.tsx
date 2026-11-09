/* S61 · Act 8 此刻 · 局部帧 [0,88) · 88f · 绝对 8082–8170
 *
 * 题记回环（同文同层：字幕即打字机画面文字）：总结纸页翻起，画幅回到开篇的
 * 纸面（与镜 1 同一张纸、同一束光）；打字机标语逐字打出（UE 裁定 2.7f/字，
 * 22 字 ≈ 60f 内打完，字幕整句随打随显），笔尖微光、每字溅 2–3 颗墨点粒子。
 * 转场：入「切」，出「切」。末字落定后粒子浮游。
 * 尾帧：整句停住、粒子未落尽。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { random } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES } from '../../../brand/motion';
import { typeCharsAt, writeFade } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { DustField } from '../components/DustField';
import { Grade } from '../components/Grade';
import { PaperGrain } from '../components/PaperGrain';

const TOTAL = 88;
const LINE = '写作是抵抗遗忘的方式，代码是构建世界的语言。';
const TYPE_START = 10;
const FPC = 2.7;

const S61: FC = () => {
  const frame = useCurrentFrame();
  const chars = typeCharsAt(frame, LINE.length, TYPE_START, FPC);
  const penX = 480 + chars * 36;
  const cam = { scale: 1.02 + interpolate(frame, [0, TOTAL], [0, 0.015], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }), x: interpolate(frame, [0, TOTAL], [0, -24], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }), y: 0, rot: 0 };

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <CameraRig cam={cam}>
        <AbsoluteFill>
          <DustField act={8} count={16} seedBase="s61" />

          {/* 开篇同款纸面（同一张纸、同一束光：暖黑 → 暖纸渐变底） */}
          <AbsoluteFill style={{ background: colors.bg }} />
          <div style={{ position: 'absolute', left: 260, right: 260, top: 300, bottom: 300, borderRadius: 6, background: colors.paper, border: `1px solid ${colors.paperMuted}`, boxShadow: '0 30px 90px rgba(0,0,0,0.45)' }} />

          {/* 打字机标语（同文同层 zIndex 30） */}
          <div style={{ position: 'absolute', left: 480, top: 480, zIndex: 30, whiteSpace: 'nowrap' }}>
            {LINE.split('').slice(0, chars).map((ch, i) => (
              <span key={i} style={{ ...writeFade(TYPE_START + i * FPC > frame ? -1 : TYPE_START + i * FPC), display: 'inline-block', fontFamily: fontFamilies.serif, fontSize: 56, color: colors.ink, whiteSpace: 'pre' }}>
                {ch}
              </span>
            ))}
            {/* 笔尖微光（跟随行尾，末字后停在句尾呼吸） */}
            <span
              style={{
                position: 'absolute',
                left: penX - 480 + 6,
                top: 40,
                width: 10,
                height: 10,
                borderRadius: 5,
                background: colors.gold,
                opacity: frame < TYPE_START + LINE.length * FPC ? 0.9 : 0.5 + Math.sin(frame / 9) * 0.2,
                boxShadow: `0 0 16px 5px rgba(245,233,200,0.5)`,
              }}
            />
          </div>

          {/* 每字溅 2–3 颗墨点粒子（浮游未落尽） */}
            {LINE.split('').map((_, i) => {
            const t0 = TYPE_START + i * FPC;
            if (frame < t0) return null;
            const n = 2 + (i % 2);
            return Array.from({ length: n }).map((_, k) => {
              const ang = random(`s61-${i}-${k}`) * Math.PI * 2;
              const dist = 12 + random(`s61-d-${i}-${k}`) * 26;
              // float 窗同款自适应（v12-B2）：t0+30 同样可能越镜长
              const fB = Math.min(t0 + 30, TOTAL - 0.5);
              const fC = Math.max(fB + 0.5, TOTAL);
              const float = interpolate(frame, [t0, fB, fC], [0, 1, 1.4], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
              // 渐变窗自适应（shot-spec v12-B2 教训）：t0+60 可能越过镜长，夹到 TOTAL 并保持严格递增
              const tMid = Math.min(t0 + 8, TOTAL - 0.5);
              const tEnd = Math.max(tMid + 0.5, Math.min(t0 + 60, TOTAL));
              return (
                <div
                  key={`${i}-${k}`}
                  style={{
                    position: 'absolute',
                    left: 480 + i * 36 + Math.cos(ang) * dist * float,
                    top: 520 + Math.sin(ang) * dist * float * 0.7,
                    width: 4,
                    height: 4,
                    borderRadius: 2,
                    background: colors.ink,
                    opacity: interpolate(frame, [t0, tMid, tEnd], [0, 0.7, 0.2], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
                  }}
                />
              );
            });
          })}
        </AbsoluteFill>
      </CameraRig>
      <PaperGrain opacity={0.05} />
      <Grade id="GR-01" />
    </AbsoluteFill>
  );
};

export default S61;
