/* s25 · AI 画她的正脸，四轮全崩成动漫脸。（240f · 8.0s，Act 5 · 生图翻车卡 · 审-修-锁故事的证据镜）
 *
 * 覆盖矩阵 s22c 行：MO-CARD-RISE · MO-TYPE-WRITER + MO-X-STAMP×4 · 末叉定格。
 * 纸底证据板：标题「动漫先验 · 四轮实证」MO-CARD-RISE 入；四张缩略卡 2×2 排布，每张是**代码画的
 * 「动漫脸马赛克」**（7×6 网格色块 random(seed) 拼贴：结构底稿 hair/skin/eye/blush/mouth + 逐格崩坏
 * 替换，四卡四种崩法——禁真实人脸，零生图）。卡落定后一枚红叉（colors.seal 粗笔 X）按 MO_X_STAMP
 * （hits 4 / gap 12 / scaleFrom 1.6 / hitFrames 6）逐张砸落（58/70/82/94f，每卡落定 +18f），
 * 末张红叉定格收全卡。
 * 交接态：入 cut（承接 s24 直放），出 cut（证据板定格交 s26 对照卡）。
 */
import type { FC, CSSProperties } from 'react';
import { AbsoluteFill, interpolate, random, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CLAMP, MO_CARD, MO_EASE, MO_X_STAMP } from '../motion-tokens';
import { Caption } from '../components/Caption';

/** token hex → rgba 派生（明暗差用 rgba(tokens)，禁内联色值） */
const rgba = (hex: string, a: number): string => {
  const h = hex.replace('#', '');
  return `rgba(${parseInt(h.slice(0, 2), 16)}, ${parseInt(h.slice(2, 4), 16)}, ${parseInt(h.slice(4, 6), 16)}, ${a})`;
};

const DURATION = 240;
const TITLE_AT = 12;
/** 四卡入场节拍：卡 i 于 40+i*12 起浮（MO-CARD-RISE），+12f 落定，+18f 红叉砸落 → 叉距恰为 MO_X_STAMP.gap */
const CARD_AT = 40;

/* 马赛克「动漫脸」结构底稿（7×6）：H 发 / S 肤 / E 眼 / B 腮 / M 嘴；四卡各配一个崩坏概率 */
const FACE_MAP = ['HHHHHHH', 'HHHHHHH', 'SEESEES', 'SEESEES', 'SBSSSBS', 'SSSMSSS'] as const;
const COLS = 7;
const ROWS = FACE_MAP.length;
const CELL = 44;
const GAP = 2;
const PAD = 14;
const CARD_W = COLS * CELL + (COLS - 1) * GAP + PAD * 2;
const CARD_H = ROWS * CELL + (ROWS - 1) * GAP + PAD * 2;
const CATCHLIGHT = new Set(['2-1', '2-4']); // 眼块内上角一枚纸色反光像素（动漫眼高光）
const CORRUPT_POOL = [colors.ink, colors.accent, colors.seal, colors.bg, colors.paper, colors.muted];
const CORRUPT_P = [0.16, 0.3, 0.22, 0.42];

const cellStyle = (idx: number, r: number, c: number, ch: string): { color: string; opacity: number; catchlight: boolean } => {
  const corrupt = random(`s25-${idx}-cor-${r}-${c}`) < CORRUPT_P[idx];
  let color: string;
  if (corrupt) {
    color = CORRUPT_POOL[Math.floor(random(`s25-${idx}-pick-${r}-${c}`) * CORRUPT_POOL.length)];
  } else if (ch === 'H') {
    color = random(`s25-${idx}-h-${r}-${c}`) < 0.14 ? colors.bg : colors.ink;
  } else if (ch === 'S') {
    color = colors.accent;
  } else if (ch === 'E') {
    color = colors.ink;
  } else if (ch === 'B') {
    color = rgba(colors.seal, 0.5);
  } else {
    color = colors.seal;
  }
  return { color, opacity: 0.86 + random(`s25-${idx}-op-${r}-${c}`) * 0.14, catchlight: !corrupt && ch === 'E' && CATCHLIGHT.has(`${r}-${c}`) };
};

const rise = (frame: number, at: number): CSSProperties => {
  const p = interpolate(frame, [at, at + MO_CARD.riseFrames], [0, 1], { ...CLAMP, easing: MO_EASE.out });
  return { opacity: p, transform: `translateY(${((1 - p) * MO_CARD.riseShiftPx).toFixed(2)}px)` };
};

const MosaicCard: FC<{ idx: number }> = ({ idx }) => {
  const frame = useCurrentFrame();
  const at = CARD_AT + idx * MO_X_STAMP.gap;
  const stampAt = at + 18;
  // MO-X-STAMP 红叉砸落：scaleFrom 1.6 → 1.0 / hitFrames 6 / MO-EASE-OUT
  const stampScale = interpolate(frame, [stampAt, stampAt + MO_X_STAMP.hitFrames], [MO_X_STAMP.scaleFrom, 1], {
    ...CLAMP,
    easing: MO_EASE.out,
  });
  const stampOpacity = interpolate(frame, [stampAt, stampAt + 2], [0, 1], CLAMP);
  const tilt = (random(`s25-x-rot-${idx}`) - 0.5) * 18;
  return (
    <div
      style={{
        position: 'relative',
        width: CARD_W,
        height: CARD_H,
        background: colors.paperDeep,
        borderRadius: 10,
        border: `1.5px solid ${rgba(colors.ink, 0.45)}`,
        boxShadow: `0 10px 24px ${rgba(colors.ink, 0.16)}`,
        padding: PAD,
        ...rise(frame, at),
      }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${COLS}, ${CELL}px)`, gridAutoRows: CELL, gap: GAP }}>
        {FACE_MAP.flatMap((row, r) =>
          row.split('').map((ch, c) => {
            const cell = cellStyle(idx, r, c, ch);
            return (
              <div key={`${r}-${c}`} style={{ background: cell.color, opacity: cell.opacity, position: 'relative' }}>
                {cell.catchlight ? (
                  <div style={{ position: 'absolute', top: 4, left: 4, width: CELL * 0.32, height: CELL * 0.32, background: colors.paper }} />
                ) : null}
              </div>
            );
          }),
        )}
      </div>
      {frame >= stampAt ? (
        <svg
          width={96}
          height={96}
          viewBox="0 0 96 96"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            marginLeft: -48,
            marginTop: -48,
            opacity: stampOpacity,
            transform: `rotate(${tilt.toFixed(2)}deg) scale(${stampScale.toFixed(4)})`,
          }}
        >
          <line x1={20} y1={20} x2={76} y2={76} stroke={colors.seal} strokeWidth={15} strokeLinecap="round" />
          <line x1={76} y1={20} x2={20} y2={76} stroke={colors.seal} strokeWidth={15} strokeLinecap="round" />
        </svg>
      ) : null}
    </div>
  );
};

const S25: FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: colors.paper }}>
      <div style={{ position: 'absolute', top: 96, left: 0, right: 0, textAlign: 'center', ...rise(frame, TITLE_AT) }}>
        <div style={{ fontFamily: fontFamilies.serif, fontSize: 52, fontWeight: 600, letterSpacing: 10, color: colors.ink }}>
          动漫先验 · 四轮实证
        </div>
        <div style={{ width: 68, height: 2, margin: '20px auto 0', background: rgba(colors.ink, 0.5) }} />
      </div>
      <div
        style={{
          position: 'absolute',
          top: 280,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'grid',
          gridTemplateColumns: `${CARD_W}px ${CARD_W}px`,
          gap: 44,
        }}
      >
        <MosaicCard idx={0} />
        <MosaicCard idx={1} />
        <MosaicCard idx={2} />
        <MosaicCard idx={3} />
      </div>
      <Caption text="AI 画她的正脸，四轮全崩成动漫脸。" start={12} end={228} duration={DURATION} inSide={0} outSide={0} />
    </AbsoluteFill>
  );
};

export default S25;
