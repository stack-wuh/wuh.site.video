import type { FC } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { FlowDiagram } from '../components/FlowDiagram';
import { SealStamp } from '../components/SealStamp';
import { ShotShell } from '../components/ShotShell';
import { Meta } from '../components/Type';
import { SERIES } from '../data';
import { CURVES, FILM_COLORS, progress } from '../motion-tokens';

const YEAR_2021 = SERIES.yearly_writing_2019_2026[2].year;

/** 三槽版式（与 s09 / s10 同几何；首帧 = s10 尾帧） */
const SLOT = { w: 380, h: 240, y: 380, xs: [380, 800, 1220] as const };
const NODE_POS = { x: 200, y: 500 } as const;
const SEAL = { top: 476, inset: 40, w: 300 } as const;
/** 合并后的技术栈条矩形（横贯画面上沿） */
const BAR = { x: 120, y: 150, w: 1680, h: 120 } as const;
/** CI 三节点流水线（node → build → deploy），末块落定帧 70 */
const PIPE = [{ label: 'node' }, { label: 'build' }, { label: 'deploy' }] as const;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * s11 · GITHUB ACTIONS（100f，1130–1230）
 * 承接 s10 第三空槽 → INK-04 GITHUB ACTIONS 朱砂藏印填入第三槽 → FL-01 水平流水线自槽内画出
 * + FL-02 node / build / deploy 三块逐块点亮（墨块 + 2px 朱红勾边，**禁绿**），末块对拍 70
 * → LAY-04 三槽合成一行技术栈条横贯上沿。CAM-01 沿流水线右移（收尾回位）+ 承接 s10 的推进回拉成 1。
 * 主落定 70（流水线末块对拍，全片 1200 · 拍 60）。
 * 尾帧：三槽全填、技术栈条横贯上沿、2021 节点在条左端 → 交 s12 退成底纹。
 */
const S11: FC = () => {
  const frame = useCurrentFrame();

  /* 承接 s10：推进 1.03 回拉成 1（0–24），尾帧与 s12 首帧同尺度 */
  const scaleIn = lerp(1.03, 1, progress(frame, 0, 24, CURVES.cineEaseInOut));
  /* 承接态退场：s10 代码卡（0–16） */
  const codeOut = progress(frame, 0, 16, CURVES.cineEaseIn);
  /* LAY-04 三槽合成技术栈条（70–90） */
  const merge = progress(frame, 70, 20, CURVES.cineEaseInOut);
  /* FL 流水线在合并时退场（70–82） */
  const pipeOut = 1 - progress(frame, 70, 12, CURVES.cineEaseIn);
  /* CAM-01 沿流水线右移 50px，合并前回位（尾帧逐像素交接） */
  const truck = -50 * progress(frame, 30, 40, CURVES.cineEaseInOut) * (1 - progress(frame, 74, 18, CURVES.cineEaseInOut));

  return (
    <ShotShell act="ACT 01 · 起点">
      <AbsoluteFill>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transform: `translateX(${truck}px) scale(${scaleIn})`,
            transformOrigin: 'center center',
          }}
        >
          {/* 技术栈条（三槽合并而成；border 随 merge 亮起） */}
          <div
            style={{
              position: 'absolute',
              left: lerp(SLOT.xs[0], BAR.x, merge),
              top: lerp(SLOT.y, BAR.y, merge),
              width: lerp(SLOT.xs[2] + SLOT.w - SLOT.xs[0], BAR.w, merge),
              height: lerp(SLOT.h, BAR.h, merge),
              boxSizing: 'border-box',
              backgroundColor: FILM_COLORS.card,
              border: `1px solid ${FILM_COLORS.inkSoft}`,
              opacity: merge,
            }}
          />

          {/* 2021 节点（合并后停在技术栈条左端） */}
          <div
            style={{
              position: 'absolute',
              left: NODE_POS.x - 5,
              top: lerp(NODE_POS.y, BAR.y + BAR.h / 2, merge) - 5,
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: FILM_COLORS.accent,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 160,
              top: lerp(NODE_POS.y + 22, BAR.y + BAR.h / 2 + 18, merge),
              width: 80,
            }}
          >
            <Meta size={20} style={{ textAlign: 'center' }} color={FILM_COLORS.inkSoft}>
              {YEAR_2021}
            </Meta>
          </div>

          {/* 三槽（合并时让位给技术栈条）：槽 1 已被槽盖扣合，故实线；另两槽虚线 */}
          {SLOT.xs.map((x, i) => (
            <div
              key={`slot-${i}`}
              style={{
                position: 'absolute',
                left: x,
                top: SLOT.y,
                width: SLOT.w,
                height: SLOT.h,
                boxSizing: 'border-box',
                border: `1px ${i === 1 || (i === 2 && frame >= 20) ? 'solid' : 'dashed'} ${
                  i === 1 ? FILM_COLORS.inkSoft : FILM_COLORS.hairline
                }`,
                opacity: 1 - merge,
              }}
            />
          ))}
          {/* 槽 2 的槽盖（承接 s10 尾帧，随合并退场） */}
          <div
            style={{
              position: 'absolute',
              left: SLOT.xs[1],
              top: SLOT.y,
              width: SLOT.w,
              height: 26,
              boxSizing: 'border-box',
              backgroundColor: FILM_COLORS.card,
              border: `1px solid ${FILM_COLORS.inkSoft}`,
              opacity: 1 - merge,
            }}
          />

          {/* 三枚朱砂藏印：合并后移到技术栈条上成一排 */}
          {SLOT.xs.map((x, i) => (
            <div
              key={`seal-${i}`}
              style={{
                position: 'absolute',
                left: lerp(x + SEAL.inset, 540 + i * 420 - SEAL.w / 2, merge),
                top: lerp(SEAL.top, BAR.y + BAR.h / 2 - 24, merge),
                width: SEAL.w,
                textAlign: 'center',
              }}
            >
              {i === 0 ? (
                <SealStamp text="DOCKER" size={48} start={-60} />
              ) : i === 1 ? (
                <SealStamp text="TYPESCRIPT" size={48} start={-60} />
              ) : (
                <SealStamp text="GITHUB ACTIONS" size={48} start={16} />
              )}
            </div>
          ))}

          {/* FL-01 / FL-02 流水线：node → build → deploy，三块逐块点亮，末块对拍 70 */}
          <div style={{ position: 'absolute', left: 360, top: 660, opacity: pipeOut }}>
            <FlowDiagram nodes={PIPE} start={30} width={1200} nodeSize={110} />
          </div>

          {/* 承接态：s10 的代码卡（退场） */}
          <div
            style={{
              position: 'absolute',
              left: 240,
              top: 676 + 40 * codeOut,
              width: 1440,
              height: 216,
              boxSizing: 'border-box',
              backgroundColor: FILM_COLORS.card,
              border: `1px solid ${FILM_COLORS.hairline}`,
              opacity: 1 - codeOut,
            }}
          />
        </div>
      </AbsoluteFill>
    </ShotShell>
  );
};

export default S11;