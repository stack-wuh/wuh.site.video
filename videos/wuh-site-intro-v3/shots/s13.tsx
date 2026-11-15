import type { FC } from 'react';
import {
  AbsoluteFill,
  interpolateColors,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { KineticLine } from '../components/KineticLine';
import { ShotShell } from '../components/ShotShell';
import { DropCap, Meta } from '../components/Type';
import { QUOTES, SERIES } from '../data';
import { CURVES, FILM_COLORS, FONTS, SP, clamp01, progress, springP } from '../motion-tokens';

const YEAR_2021 = SERIES.yearly_writing_2019_2026[2].year;
const LAST_MONTH = `${YEAR_2021}-12`;

/** 承接 s12 尾帧的引语页 */
const QUOTE = QUOTES[0];
const CAP = Array.from(QUOTE.text)[0];
const REST = Array.from(QUOTE.text).slice(1).join('') + '。';
const COL = { x: 600, y: 276, w: 720 } as const;

/** 承接 s12 尾帧的技术栈条底纹（120, 90, 1680×40）→ 收拢成短轴 */
const BAR = { x: 120, y: 90, w: 1680, h: 40 } as const;
const AXIS = { x: 1400, y: 208, w: 160, h: 3 } as const;
/** 墨点落点（右下沿） */
const DOT_END = { x: AXIS.x + AXIS.w, y: 860 } as const;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * s13 · 2021 收束（130f，1370–1500）
 * 承接 s12 引语页 → LAY-12 整页上移出画 → INK-01 rail 反向收拢成一条短轴
 * → EN-04 墨点自 2021-12 节点落到右下沿（落定 70）→ FX-04 右缘 1px accent 暖边亮起（80–92，常亮）。
 * CAM-03 后拉 1→0.96。
 * 主落定 70（墨点停右下、暖边待亮，全片 1440 · 拍 72）。
 * 尾帧：短轴 + 2021 末墨点停在右下、暖色竖边在右缘 → 交 s14 暖边展开整幅。
 */
const S13: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  /* LAY-12 引语页上移出画（0–26，cinEaseIn） */
  const pageOut = progress(frame, 0, 26, CURVES.cineEaseIn);
  /* INK-01 rail 反向收拢成短轴（20–44） */
  const contract = progress(frame, 20, 24, CURVES.cineEaseInOut);
  /* EN-04 墨点下坠（46–70，落定 70） */
  const fall = progress(frame, 46, 24, CURVES.cineEaseIn);
  const landS = clamp01(springP(frame, fps, 68, SP.dotDrop));
  const squash = progress(frame, 70, 4, CURVES.cineEaseOut);
  const bloom = progress(frame, 70, 10, CURVES.cineEaseOut);
  /* FX-04 右缘暖边（80–92，之后常亮） */
  const edge = progress(frame, 80, 12, CURVES.cineEaseOut);
  /* CAM-03 后拉 1 → 0.96（0–110，贯穿到镜尾；暖边在变换之外，不受后拉影响） */
  const pull = 1 - 0.04 * progress(frame, 0, 110, CURVES.cineEaseInOut);

  const axisY = lerp(BAR.y, AXIS.y, contract);
  const dotY = lerp(AXIS.y, DOT_END.y, fall) + (1 - landS) * -18;
  const dotX = lerp(BAR.x + BAR.w, DOT_END.x, contract);

  return (
    <ShotShell act="ACT 01 · 起点">
      <AbsoluteFill>
        <div style={{ position: 'absolute', inset: 0, transform: `scale(${pull})`, transformOrigin: 'center center' }}>
          {/* 承接态：s12 引语页整页上移出画 */}
          <div style={{ position: 'absolute', inset: 0, transform: `translateY(${-1040 * pageOut}px)` }}>
            <div style={{ position: 'absolute', left: COL.x, top: COL.y, width: COL.w }}>
              <DropCap char={CAP} size={72} style={{ transform: 'scale(1)', transformOrigin: 'left top' }} />
              <KineticLine text={REST} start={-60} framesPerChar={2} size={72} lineHeight={1.55} />
            </div>
            <div style={{ position: 'absolute', right: 120, bottom: 150, textAlign: 'right' }}>
              <div
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 22,
                  letterSpacing: '0.14em',
                  color: FILM_COLORS.inkSoft,
                }}
              >
                {`${QUOTE.source} · ${QUOTE.date}`}
              </div>
              <div style={{ marginTop: 14, marginLeft: 'auto', width: 320, height: 1, backgroundColor: FILM_COLORS.hairline }} />
            </div>
          </div>

          {/* INK-01 rail 反向收拢成短轴 */}
          <div
            style={{
              position: 'absolute',
              left: lerp(BAR.x, AXIS.x, contract),
              top: axisY - lerp(BAR.h, AXIS.h, contract) / 2,
              width: lerp(BAR.w, AXIS.w, contract),
              height: lerp(BAR.h, AXIS.h, contract),
              backgroundColor: interpolateColors(contract, [0, 1], [FILM_COLORS.paperDeep, FILM_COLORS.ink]),
              opacity: lerp(0.35, 1, contract),
            }}
          />
          {/* 2021-12 刻度标签（短轴末端即节点） */}
          <div style={{ position: 'absolute', left: AXIS.x - 20, top: AXIS.y - 34, width: 200, opacity: contract }}>
            <Meta size={16} color={FILM_COLORS.muted}>
              {LAST_MONTH}
            </Meta>
          </div>

          {/* INK-06 纸晕（落点洇开） */}
          <div
            style={{
              position: 'absolute',
              left: dotX - 22,
              top: DOT_END.y - 22,
              width: 44,
              height: 44,
              borderRadius: '50%',
              border: `1px solid ${FILM_COLORS.accent}`,
              opacity: (1 - bloom) * 0.35,
            }}
          />
          {/* EN-04 墨点：自 2021-12 落到右下沿 */}
          <div
            style={{
              position: 'absolute',
              left: dotX - 6,
              top: dotY - 6,
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: FILM_COLORS.ink,
              transform: `scale(${1 + 0.04 * (1 - squash)}, ${0.92 + 0.08 * squash})`,
            }}
          />

        </div>

        {/* FX-04 右缘 1px accent 暖色竖边（2022 的纸缘）。放在后拉变换之外——暖边必须严丝合缝贴住画幅右缘 */}
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 540 - 540 * edge,
            width: 1.5,
            height: 1080 * edge,
            backgroundColor: FILM_COLORS.accent,
          }}
        />
      </AbsoluteFill>
    </ShotShell>
  );
};

export default S13;