import type { FC } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { ShotShell } from '../components/ShotShell';
import { DataLabel, Meta } from '../components/Type';
import { FILM_COLORS, FONTS, draw, fmtInt, progress, roll, springP, SP } from '../motion-tokens';

/**
 * s18 · 同日 7 个初始化提交（80f，1930–2010）
 * LAY-10 终端窗收成一条细横线（8f，行号随之退去）→ 线上落下 7 枚墨点（EN-04，错 4f，首枚 = 当晚 17:25）
 * → 七点连成短弧（INK-02，15f）＋ 弧下 mono「7 COMMITS · 同一天」（NUM-01 微滚）。
 * 落定 2000 = 镜内 70f（快段，尾 10f 交接给 s19 的 2025 空格带）。
 * 数据：materials v4 §二 — 2024-12-08 当晚 17:25→20:57 连打 7 个提交。
 * 注：7 枚 commit hash 缩写不在 materials/data.ts 中（未采），为避免伪造改用提交序 01–07 + 首末时刻。
 */

const WIN_X = 370;
const WIN_W = 1180;
const LINE_Y = 507;
const DOTS = 7;
const X0 = 470;
const XSTEP = 152;

/** 弧上第 i 点（二次弧，中央最高 34px） */
const dotX = (i: number): number => X0 + i * XSTEP;
const dotY = (i: number): number => LINE_Y - 34 * (1 - ((i - 3) / 3) ** 2);

/** 七点短弧路径：M 首点 Q 控制点 末点 */
const ARC_CTRL_Y = LINE_Y - 68;

const S18: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  /* LAY-10：窗收成细线（0–8f），行号与内容同步退去 */
  const collapse = progress(frame, 0, 8);
  const arcP = progress(frame, 48, 15);
  const labelIn = progress(frame, 56, 10);

  return (
    <ShotShell act="ACT 02 · 沉默">
      <AbsoluteFill>
        <div style={{ position: 'absolute', left: 120, top: 236 }}>
          <DataLabel size={14}>SAME DAY · 2024-12-08</DataLabel>
        </div>

        {/* 终端窗残影 → 细线（scaleY → 0.006，origin 中线） */}
        <div
          style={{
            position: 'absolute',
            left: WIN_X,
            top: LINE_Y - 215,
            width: WIN_W,
            height: 430,
            boxSizing: 'border-box',
            backgroundColor: FILM_COLORS.card,
            border: `1px solid ${FILM_COLORS.hairline}`,
            transform: `scaleY(${Math.max(0.006, 1 - collapse)})`,
            transformOrigin: 'center center',
          }}
        >
          {[0, 1, 2, 3, 4].map((r) => (
            <div
              key={r}
              style={{
                position: 'absolute',
                left: 70,
                top: 60 + r * 54,
                width: 620 - r * 46,
                height: 10,
                backgroundColor: FILM_COLORS.paperDeep,
                opacity: 0.9,
              }}
            />
          ))}
        </div>

        {/* 七点短弧（INK-02：点先落后连弧） */}
        <svg
          style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080 }}
          viewBox="0 0 1920 1080"
          fill="none"
        >
          <path
            d={`M ${dotX(0)} ${dotY(0)} Q ${(dotX(0) + dotX(6)) / 2} ${ARC_CTRL_Y} ${dotX(6)} ${dotY(6)}`}
            stroke={FILM_COLORS.ink}
            strokeWidth={1.5}
            strokeLinecap="round"
            {...draw(arcP)}
          />
        </svg>

        {/* 7 枚墨点（EN-04 落定 + 4f squash）+ 提交序 */}
        {Array.from({ length: DOTS }, (_, i) => {
          const at = 14 + i * 4;
          const sp = springP(frame, fps, at, SP.dotDrop);
          const squash = progress(frame, at + 8, 4);
          const y = dotY(i) - 28 * (1 - sp);
          return (
            <div key={`dot-${i}`} style={{ position: 'absolute', left: dotX(i) - 8, top: y - 8, width: 16, height: 16 }}>
              <div
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  backgroundColor: i === 0 || i === DOTS - 1 ? FILM_COLORS.ink : FILM_COLORS.inkSoft,
                  transform: `scale(${1 + 0.1 * (1 - squash)}, ${1 - 0.1 * (1 - squash)})`,
                }}
              />
              <Meta
                size={12}
                style={{
                  position: 'absolute',
                  left: -22,
                  top: -34,
                  width: 60,
                  textAlign: 'center',
                  opacity: progress(frame, at + 6, 6),
                }}
              >
                {String(i + 1).padStart(2, '0')}
              </Meta>
            </div>
          );
        })}

        {/* 首末时刻（materials：17:25 → 20:57） */}
        <Meta size={12} style={{ position: 'absolute', left: dotX(0) - 16, top: LINE_Y + 22, opacity: labelIn }}>
          17:25
        </Meta>
        <Meta size={12} style={{ position: 'absolute', left: dotX(6) - 16, top: LINE_Y + 22, opacity: labelIn }}>
          20:57
        </Meta>

        {/* 弧下 mono：7 COMMITS · 同一天（NUM-01 微滚） */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: LINE_Y + 66,
            width: 1920,
            textAlign: 'center',
            fontFamily: FONTS.mono,
            fontSize: 26,
            letterSpacing: '0.14em',
            color: FILM_COLORS.ink,
            fontVariantNumeric: 'tabular-nums',
            opacity: labelIn,
          }}
        >
          {`${fmtInt(roll(frame, 48, 20, 0, DOTS))} COMMITS · 同一天`}
        </div>
      </AbsoluteFill>
    </ShotShell>
  );
};

export default S18;