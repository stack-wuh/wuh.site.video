import type { FC } from 'react';
import { AbsoluteFill, interpolateColors, useCurrentFrame, useVideoConfig } from 'remotion';
import { KineticLine } from '../components/KineticLine';
import { SealStamp } from '../components/SealStamp';
import { ShotShell } from '../components/ShotShell';
import { DropCap, Meta } from '../components/Type';
import { QUOTES, SERIES } from '../data';
import { CURVES, FILM_COLORS, FONTS, SP, progress, springIn, springP } from '../motion-tokens';

const YEAR_2021 = SERIES.yearly_writing_2019_2026[2].year;

/** 《搬山计划》#30 · 2021-05-07（文案与出处逐字取自 data.ts QUOTES[0]） */
const QUOTE = QUOTES[0];
const CAP = Array.from(QUOTE.text)[0];
const REST = Array.from(QUOTE.text).slice(1).join('') + '。';

/** 承接 s11 尾帧的技术栈条（120,150,1680×120 / card 底）→ GR-07 退成 paperDeep 底纹 */
const BAR_FROM = { y: 150, h: 120 } as const;
const BAR_TO = { y: 90, h: 40 } as const;
const SEAL_LEFT = (i: number) => 390 + i * 420;
const SEAL_TEXT = ['DOCKER', 'TYPESCRIPT', 'GITHUB ACTIONS'] as const;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const COL = { x: 600, y: 276, w: 720 } as const;

/**
 * s12 · 搬山计划（140f，1230–1370）
 * 承接 s11 技术栈条 → GR-07 退成 paperDeep 底纹 → TX-04 首字「除」下沉 3.35em 朱红（springPop 1.12→1）
 * + TX-01 其余 27 字逐行入画（2f/字）→ EN-01 落款 mono 右下「《搬山计划》#30 · 2021-05-07」。
 * 主落定 70（引语全显，全片 1300 · 拍 65）。
 * 尾帧：引语四行全显、首字朱红、落款右下、纸面静止 → 交 s13 上移退出。
 */
const S12: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  /* GR-07 技术栈条退成底纹（0–20，只做空间让位不重新入场） */
  const retire = progress(frame, 0, 20, CURVES.cineEaseInOut);
  const barBg = interpolateColors(retire, [0, 1], [FILM_COLORS.card, FILM_COLORS.paperDeep]);
  const barBorder = interpolateColors(retire, [0, 1], [FILM_COLORS.inkSoft, FILM_COLORS.hairline]);
  /* 藏印退场（0–14） */
  const sealOut = 1 - progress(frame, 0, 14, CURVES.cineEaseOut);
  /* TX-04 首字下沉：scale 1.12 → 1（springPop 压实） */
  const capS = springP(frame, fps, 2, SP.springPop);
  /* EN-01 落款入位（100 起，40f 内到位） */
  const credit = springIn(frame, fps, 100);

  return (
    <ShotShell act="ACT 01 · 起点">
      <AbsoluteFill>
        {/* 承接态：s11 尾帧的三槽技术栈条 → 退成 paperDeep 底纹 */}
        <div
          style={{
            position: 'absolute',
            left: 120,
            top: lerp(BAR_FROM.y, BAR_TO.y, retire),
            width: 1680,
            height: lerp(BAR_FROM.h, BAR_TO.h, retire),
            boxSizing: 'border-box',
            backgroundColor: barBg,
            border: `1px solid ${barBorder}`,
            opacity: lerp(1, 0.35, retire),
          }}
        />
        {/* 2021 节点（承 s11 尾帧，随条退休） */}
        <div
          style={{
            position: 'absolute',
            left: 195,
            top: lerp(205, 105, retire),
            width: 10,
            height: 10,
            borderRadius: '50%',
            backgroundColor: FILM_COLORS.accent,
            opacity: sealOut,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 160,
            top: lerp(228, 128, retire),
            width: 80,
            opacity: sealOut,
          }}
        >
          <Meta size={20} style={{ textAlign: 'center' }} color={FILM_COLORS.inkSoft}>
            {YEAR_2021}
          </Meta>
        </div>
        {SEAL_TEXT.map((text, i) => (
          <div
            key={text}
            style={{
              position: 'absolute',
              left: SEAL_LEFT(i),
              top: lerp(186, 128, retire),
              width: 300,
              textAlign: 'center',
              opacity: sealOut,
            }}
          >
            <SealStamp text={text} size={48} start={-60} />
          </div>
        ))}

        {/* TX-04 + TX-01：引语（首字下沉，其余逐行入画，全显 70） */}
        <div style={{ position: 'absolute', left: COL.x, top: COL.y, width: COL.w }}>
          <DropCap
            char={CAP}
            size={72}
            style={{ transform: `scale(${1.12 - 0.12 * capS})`, transformOrigin: 'left top' }}
          />
          <KineticLine text={REST} start={6} framesPerChar={2} size={72} lineHeight={1.55} />
        </div>

        {/* EN-01 落款 mono 右下 */}
        <div style={{ position: 'absolute', right: 120, bottom: 150, textAlign: 'right', ...credit }}>
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
          <div
            style={{ marginTop: 14, marginLeft: 'auto', width: 320, height: 1, backgroundColor: FILM_COLORS.hairline }}
          />
        </div>
      </AbsoluteFill>
    </ShotShell>
  );
};

export default S12;