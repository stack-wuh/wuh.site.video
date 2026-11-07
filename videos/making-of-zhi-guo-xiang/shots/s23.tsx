/* s23 · 删完，总长一秒没变。（120f · 4.0s，Act 5 · 定场卡）
 *
 * 帧数卡（覆盖矩阵 s23 行：MO-CARD-RISE · MO-NUM-SLAM 双数同滚同停 · 中缝划痕）：黑场（colors.bg）上
 * 两行大数字「9060f」「9060f」对置（删前 v11 / 删后 v12，总长一帧不差）。**MO-NUM-SLAM（凡量必滚）**：
 * 两数从 0 同步滚动（10–50f，MO-EASE-OUT 收尾），50f 同帧冲线相等——「一秒没变」的对比句自带动作；
 * 落定帧 1.05→1 回弹（slamPop），中缝**竖向划痕**在落定后 52f「划」进来：4f 错位抖动（上下两段各自
 * 横移错位 + 中间碎屑，random(seed+frame) 确定性），56f 起对齐定格成一道留有细缝的刻痕（删的那一刀）。
 * 数字行入场 MO_CARD.riseFrames（12f 上浮淡入）两行错 8f 递进；58f 后全画面静止，末帧定格。
 * 交接态：入 cut（承接 s22 对切），出 cut（黑场数字定格交 s24 直放镜）。
 */
import type { FC, CSSProperties } from 'react';
import { AbsoluteFill, interpolate, random, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CLAMP, MO_CARD, MO_EASE, MO_NUM } from '../motion-tokens';
import { Caption } from '../components/Caption';

const DURATION = 120;
const ROLL_FROM = 10;
const ROLL_TO = ROLL_FROM + MO_NUM.slamFrames; // 50f 双数同帧落定
const SCRATCH_AT = 52; // 落定后划下那一刀
const SCRATCH_JITTER = 4; // 错位抖动 4f

/** 数字行入场：MO-CARD-RISE（12f 上浮淡入） */
const rise = (frame: number, at: number) => {
  const p = interpolate(frame, [at, at + MO_CARD.riseFrames], [0, 1], { ...CLAMP, easing: MO_EASE.out });
  return { opacity: p, transform: `translateY(${((1 - p) * MO_CARD.riseShiftPx).toFixed(2)}px)` };
};

const NumberRow: FC<{ label: string; at: number }> = ({ label, at }) => {
  const frame = useCurrentFrame();
  // MO-NUM-SLAM：0→9060 同步滚动 + 落定回弹（两行共用同一滚窗，冲线即相等）
  const value = Math.round(interpolate(frame, [ROLL_FROM, ROLL_TO], [0, 9060], { ...CLAMP, easing: MO_EASE.out }));
  const pop = interpolate(frame, [ROLL_TO, ROLL_TO + 8], [1 + MO_NUM.slamPop, 1], { ...CLAMP, easing: MO_EASE.out });
  return (
    <div style={{ textAlign: 'center', ...rise(frame, at) }}>
      <div
        style={{
          fontFamily: fontFamilies.mono,
          fontSize: 168,
          fontWeight: 600,
          letterSpacing: 6,
          color: colors.paper,
          lineHeight: 1,
          fontVariantNumeric: 'tabular-nums',
          transform: `scale(${pop.toFixed(3)})`,
        }}
      >
        {value}f
      </div>
      <div style={{ marginTop: 20, fontFamily: fontFamilies.mono, fontSize: 24, letterSpacing: 8, color: colors.muted }}>{label}</div>
    </div>
  );
};

const S23: FC = () => {
  const frame = useCurrentFrame();
  // 划痕错位抖动：34–37f 内上下段各自横移 + 中间碎屑翻飞，38f 起对齐成一道带细缝的刻痕
  const jitter = frame >= SCRATCH_AT && frame < SCRATCH_AT + SCRATCH_JITTER;
  const segOpacity = jitter ? 0.55 + random(`s23-scr-o${frame}`) * 0.4 : 0.72;
  const offTop = jitter ? (random(`s23-scr-a${frame}`) - 0.5) * 14 : 0;
  const offBottom = jitter ? (random(`s23-scr-b${frame}`) - 0.5) * 14 : 0;
  const offShard = jitter ? (random(`s23-scr-c${frame}`) - 0.5) * 22 : 0;
  const shardOpacity = jitter ? 0.4 + random(`s23-scr-d${frame}`) * 0.5 : 0;
  const seg = (top: number, height: number, x: number): CSSProperties => ({
    position: 'absolute',
    top,
    left: `calc(50% + ${x.toFixed(2)}px)`,
    width: 2,
    height,
    marginLeft: -1,
    borderRadius: 1,
    background: colors.paper,
    opacity: segOpacity,
  });
  return (
    <AbsoluteFill style={{ background: colors.bg, justifyContent: 'center', rowGap: 64 }}>
      <NumberRow label="删前 · v11" at={8} />
      <NumberRow label="删后 · v12" at={16} />
      {/* 中缝竖向划痕：细纸色线，过两行数字的中轴线（纸色线压在纸色数字上不可见，只在黑底上显形） */}
      {frame >= SCRATCH_AT ? (
        <AbsoluteFill style={{ pointerEvents: 'none' }}>
          <div style={seg(200, 300, offTop)} />
          <div style={{ ...seg(480, 60, offShard), opacity: shardOpacity }} />
          <div style={seg(512, 368, offBottom)} />
        </AbsoluteFill>
      ) : null}
      <Caption text="删完，总长一秒没变。" start={12} end={108} duration={DURATION} inSide={0} outSide={0} />
    </AbsoluteFill>
  );
};

export default S23;
