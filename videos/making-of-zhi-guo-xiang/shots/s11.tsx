/* s11 · 五十两个任务同时跑，一次全绿。（180f · 6.0s，Act 3）
 *
 * CI 矩阵动画（MO-GRID-LIGHT）：52 个方块 13×4，波次点亮——每列一波（waveStep 6f，
 * 列内逐格错 1f「逐个变绿」），单格绿变 greenFrames 4f。色板无绿：以 paperDeep（未点亮）
 * → ink（点亮）的墨纸对比表达「全绿」，✓ 用琥珀 accent。末格（右下）为 assemble 格：
 * 全场点亮后单发起跳（缩 1.4→1 砸定）+ 一圈墨环扩散，格下 mono 标签「assemble」；
 * 随后整片汇拢（gap 14→0，MO-EASE-INOUT）收格成一块整墨——52 个任务拼成一部片。
 * 头行 run 号（标识不滚）+ 点亮计数 MO-NUM-ROLL：0→51 平滑滚随波次、52 随 assemble 砸定（凡量必滚）。
 * 转场：入「切」/ 出「切」。字幕窗 [12,168]。
 */
import type { CSSProperties, FC } from 'react';
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { Caption } from '../components/Caption';
import { CLAMP, MO_EASE, MO_GRID, writeFade } from '../motion-tokens';

const TOTAL = 180;
const COLS = 13;
const ROWS = 4;
const CELL = 64;
const GAP0 = 14;
const ASSEMBLE_AT = 96; // 末格（assemble）单发起跳
const GATHER_AT = 112; // 汇拢收格起
const GATHER_FRAMES = 32;

/** token hex → rgba（禁内联 hex，明暗差从 brand/tokens 派生） */
const alpha = (hex: string, a: number): string => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
};

/** 52 格各自的点亮起始帧：列波次（每波 6f）× 列内逐格错 1f；末格 (12,3) 是 assemble，单独起跳 */
const cellStart = (col: number, row: number): number =>
  col === COLS - 1 && row === ROWS - 1 ? ASSEMBLE_AT : col * MO_GRID.waveStep + row;

const cellBox = (col: number, row: number, g: number): CSSProperties => ({
  position: 'absolute',
  left: col * (CELL + g),
  top: row * (CELL + g),
  width: CELL,
  height: CELL,
});

const S11: FC = () => {
  const f = useCurrentFrame();

  /* 汇拢收格：格子间距与圆角一起收，52 块墨合成一整块 */
  const g = interpolate(f, [GATHER_AT, GATHER_AT + GATHER_FRAMES], [GAP0, 0], { ...CLAMP, easing: MO_EASE.inout });
  const radius = interpolate(f, [GATHER_AT, GATHER_AT + GATHER_FRAMES], [8, 2], { ...CLAMP, easing: MO_EASE.inout });
  const gw = COLS * CELL + (COLS - 1) * g;
  const gh = ROWS * CELL + (ROWS - 1) * g;

  let lit = 0;
  for (let col = 0; col < COLS; col++) {
    for (let row = 0; row < ROWS; row++) {
      if (f >= cellStart(col, row)) lit += 1;
    }
  }
  const allDone = lit === COLS * ROWS;

  /* MO-NUM-ROLL：计数平滑滚动随波次（0→51），assemble 格砸定时补到 52 */
  const lastWave = cellStart(COLS - 2, 0);
  const rolled = Math.round(
    interpolate(f, [MO_GRID.waveStep, lastWave], [0, COLS * ROWS - 1], { ...CLAMP, easing: MO_EASE.out }),
  );
  const shown = f >= ASSEMBLE_AT ? COLS * ROWS : Math.min(rolled, lit);

  /* 末格起跳（96→104 砸定）+ 墨环扩散 + 格下标签 */
  const asmPop = interpolate(f, [ASSEMBLE_AT, ASSEMBLE_AT + 8], [1.4, 1], {
    ...CLAMP,
    easing: Easing.in(Easing.cubic),
  });
  const ringP = interpolate(f, [ASSEMBLE_AT + 8, ASSEMBLE_AT + 20], [0, 1], CLAMP);
  const asmLabel = interpolate(f, [ASSEMBLE_AT, ASSEMBLE_AT + 4], [0, 1], { ...CLAMP, easing: MO_EASE.out });

  const header = writeFade(f, 0);

  return (
    <AbsoluteFill style={{ background: colors.paper }}>
      <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        {/* 头行：run 号 + 点亮计数（数字随波次翻动） */}
        <div
          style={{
            width: COLS * CELL + (COLS - 1) * GAP0,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            fontFamily: fontFamilies.mono,
            fontSize: 18,
            letterSpacing: 1,
            color: alpha(colors.ink, 0.65),
            ...header,
          }}
        >
          <span>run 41270162934</span>
          <span style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ color: colors.ink }}>{String(shown).padStart(2, '0')} / 52</span>
            {allDone ? <span style={{ color: colors.accent, fontSize: 20 }}>✓</span> : null}
          </span>
        </div>

        {/* 网格（容器随汇拢变窄变小，flex 居中 → 52 格向中缝聚拢） */}
        <div style={{ position: 'relative', width: gw, height: gh, marginTop: 30 }}>
          {Array.from({ length: COLS * ROWS }, (_, i) => {
            const col = i % COLS;
            const row = Math.floor(i / COLS);
            const start = cellStart(col, row);
            const isAsm = col === COLS - 1 && row === ROWS - 1;
            const p = interpolate(f, [start, start + MO_GRID.greenFrames], [0, 1], { ...CLAMP, easing: MO_EASE.out });
            return p <= 0 ? (
              <div
                key={i}
                style={{
                  ...cellBox(col, row, g),
                  borderRadius: radius,
                  background: colors.paperDeep,
                  border: `1px solid ${alpha(colors.ink, 0.18)}`,
                }}
              />
            ) : (
              <div
                key={i}
                style={{
                  ...cellBox(col, row, g),
                  borderRadius: radius,
                  background: colors.ink,
                  opacity: p,
                  transform: isAsm ? `scale(${asmPop})` : undefined,
                }}
              />
            );
          })}

          {/* assemble 墨环：砸定一圈扩散收格 */}
          {ringP > 0 && ringP < 1 ? (
            <div
              style={{
                ...cellBox(COLS - 1, ROWS - 1, g),
                borderRadius: radius,
                border: `2px solid ${colors.ink}`,
                opacity: 0.5 * (1 - ringP),
                transform: `scale(${1 + ringP * 0.8})`,
              }}
            />
          ) : null}

          {/* 末格标签：assemble（跟随末格移动） */}
          <div
            style={{
              position: 'absolute',
              left: (COLS - 1) * (CELL + g),
              top: gh + 12,
              width: CELL,
              textAlign: 'center',
              fontFamily: fontFamilies.mono,
              fontSize: 15,
              letterSpacing: 2,
              color: alpha(colors.ink, 0.8),
              opacity: asmLabel,
            }}
          >
            assemble
          </div>
        </div>
      </AbsoluteFill>

      <Caption text="五十两个任务同时跑，一次全绿。" start={12} end={168} duration={TOTAL} inSide={0} outSide={0} />
    </AbsoluteFill>
  );
};

export default S11;
