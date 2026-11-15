import type { FC } from 'react';
import { AbsoluteFill, interpolateColors, useCurrentFrame } from 'remotion';
import { KineticLine } from '../components/KineticLine';
import { ShotShell } from '../components/ShotShell';
import { DataLabel, Kicker, Meta } from '../components/Type';
import { CURVES, FILM_COLORS, FONTS, GRID, clamp01, progress, springP } from '../motion-tokens';

/**
 * s46 · CI 三节点（100f，4700–4800 ｜ 主落定 80f）
 * LAY-10：Mongo 窗收成一条细线（8f，线留作流水线基线）；FL-02：BUILD → TEST → DEPLOY 自左点亮
 * （墨色块 + 2px 朱红勾边——**禁绿**，分镜「转绿」一律按本口径实现）；每节点上方落一枚 mono 时间戳；
 * FL-01：三节点连线对拍 80。
 * 尾帧：三节点全亮、时间戳在节点上方 → s47 版本雨。
 */

const RAIL_Y = 690;
const NODE_W = 240;
const NODE_H = 140;
const NODE_TOP = RAIL_Y - NODE_H / 2; // 620
const NODE_X = [GRID.margin, 840, 1560];
const STAGES = ['BUILD', 'TEST', 'DEPLOY'] as const;
/** 三段时间戳（CI 节拍示意；本片无 CI 时长数据，只作节点状态标记，不构成数据承诺） */
const STAMPS = ['00:04', '01:12', '02:40'] as const;

const S46: FC = () => {
  const frame = useCurrentFrame();

  /* LAY-10：窗收成细线（0–8f，origin bottom → 线留在 RAIL_Y） */
  const collapse = progress(frame, 0, 8, CURVES.cineEaseIn);
  const lineGrow = progress(frame, 6, 22, CURVES.cineEaseInOut);

  /* CAM-01 沿节点右移 */
  const truck = -20 * progress(frame, 24, 56, CURVES.cineEaseInOut);

  return (
    <ShotShell act="ACT 05 · 方法">
      <AbsoluteFill>
        <div style={{ position: 'absolute', left: GRID.margin, top: 118 }}>
          <Kicker>第 05 节 · 流水线</Kicker>
        </div>
        <div style={{ position: 'absolute', right: GRID.margin, top: 118, textAlign: 'right' }}>
          <DataLabel size={18}>CI · 3 STAGES</DataLabel>
          <Meta size={12} style={{ marginTop: 8 }}>
            ON EVERY PUSH
          </Meta>
        </div>

        <div style={{ position: 'absolute', inset: 0, transform: `translateX(${truck}px)` }}>
          {/* 上镜窗口收成细线（基线保留） */}
          <div
            style={{
              position: 'absolute',
              left: GRID.margin,
              top: 270,
              width: 1120,
              height: 440,
              boxSizing: 'border-box',
              border: `1px solid ${FILM_COLORS.ink}`,
              backgroundColor: FILM_COLORS.card,
              opacity: (1 - collapse) * 0.55,
              transform: `scaleY(${Math.max(0.008, 1 - collapse)})`,
              transformOrigin: 'center bottom',
            }}
          />

          {/* 流水线基线（保留为下一动作的落点） */}
          <div
            style={{
              position: 'absolute',
              left: GRID.margin,
              top: RAIL_Y,
              width: GRID.content * lineGrow,
              height: 1.5,
              backgroundColor: FILM_COLORS.ink,
              opacity: 0.5,
            }}
          />

          {/* 连接线（FL-01：节点处接力描画，末段对拍 80） */}
          {[0, 1].map((i) => {
            const p = progress(frame, 34 + i * 20, 26, CURVES.cineEaseInOut);
            const x0 = NODE_X[i] + NODE_W;
            const x1 = NODE_X[i + 1];
            return (
              <div key={`link-${i}`}>
                <div
                  style={{
                    position: 'absolute',
                    left: x0,
                    top: RAIL_Y - 1,
                    width: (x1 - x0) * p,
                    height: 2,
                    backgroundColor: FILM_COLORS.ink,
                    opacity: 0.85,
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    left: x0 + (x1 - x0) * p - 2,
                    top: RAIL_Y - 5,
                    width: 7,
                    height: 7,
                    backgroundColor: FILM_COLORS.ink,
                    transform: 'rotate(45deg)',
                    opacity: p > 0.98 ? 0.85 : 0,
                  }}
                />
              </div>
            );
          })}

          {STAGES.map((label, i) => {
            const rise = springP(frame, 30, 8 + i * 2, { damping: 26, stiffness: 160, mass: 1 });
            const lit = progress(frame, 26 + i * 18, 6, CURVES.cineEaseOut);
            const stamp = progress(frame, 32 + i * 18, 8);
            return (
              <div key={label}>
                {/* mono 时间戳（节点上方） */}
                <div style={{ position: 'absolute', left: NODE_X[i], top: NODE_TOP - 56, width: NODE_W, textAlign: 'center', opacity: stamp }}>
                  <Meta size={14} style={{ letterSpacing: '0.24em' }}>
                    {STAMPS[i]}
                  </Meta>
                  <div style={{ margin: '8px auto 0', width: 1, height: 16, backgroundColor: FILM_COLORS.hairline }} />
                </div>

                {/* 节点：墨色块 + 朱红勾边（点亮后） */}
                <div
                  style={{
                    position: 'absolute',
                    left: NODE_X[i],
                    top: NODE_TOP,
                    width: NODE_W,
                    height: NODE_H,
                    boxSizing: 'border-box',
                    border: `1px solid ${interpolateColors(lit, [0, 1], [FILM_COLORS.hairline, FILM_COLORS.vermillion])}`,
                    backgroundColor: interpolateColors(lit, [0, 1], [FILM_COLORS.paperDeep, FILM_COLORS.ink]),
                    opacity: clamp01(rise),
                    transform: `scaleY(${0.02 + 0.98 * clamp01(rise)})`,
                    transformOrigin: 'center bottom',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: FONTS.mono,
                      fontSize: 26,
                      letterSpacing: '0.22em',
                      color: interpolateColors(lit, [0, 1], [FILM_COLORS.inkSoft, FILM_COLORS.paper]),
                    }}
                  >
                    {label}
                  </div>
                </div>

                {/* 节点序号 */}
                <div style={{ position: 'absolute', left: NODE_X[i], top: NODE_TOP + NODE_H + 20, width: NODE_W, textAlign: 'center' }}>
                  <Meta size={12}>{`0${i + 1}`}</Meta>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ position: 'absolute', left: GRID.margin, bottom: 108, width: 1500 }}>
          <KineticLine text="一次提交，自动构建、测试、部署。" start={20} framesPerChar={2} size={48} />
          <div style={{ marginTop: 16, height: 1, width: 320, backgroundColor: FILM_COLORS.hairline }} />
        </div>
      </AbsoluteFill>
    </ShotShell>
  );
};

export default S46;