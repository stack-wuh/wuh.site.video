import type { FC } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { KineticLine } from '../components/KineticLine';
import { ShotShell } from '../components/ShotShell';
import { Meta } from '../components/Type';
import { QUOTES } from '../data';
import { EASE, FILM_COLORS, GRID, progress, springIn } from '../motion-tokens';

/** 落款出处取自 data.ts QUOTES[3]（《重启计划》#155 · 2026-06-21） */
const SIGN = QUOTES[3];

/**
 * 引语三行 —— 逐字取 storyboard s27 文案列：
 * 「一周后，他写下《重启计划》：每周一篇，无限进步。」
 * 首字「一」走 TX-04 首字下沉（3.35em 朱红），其余接 TX-01（2f/字）。
 */
const LINES = ['一周后，他写下《重启计划》：', '每周一篇，', '无限进步。'] as const;
/** 三行的局部帧起点：按 2f/字 + 标点顿 2f 连续排（末字 60f 起笔、68f 显影完，落定 70 拍）。 */
const LINE_START = [6, 38, 50] as const;


/**
 * s27 · 《重启计划》引语（110f，2830–2940）
 * LAY-14 朱红细框扩成整页版心（20f）→ TX-04 首字「一」下沉 → TX-01 三行逐字入画
 * → EN-01 落款右下（70 落定）→ CAM-02 微推 2%（尾 40f 仍在动，禁静止超 12f）。
 * 尾帧：引语三行全显 + 落款静止（交 s28 页面上移）。
 */
const S27: FC = () => {
  const frame = useCurrentFrame();

  // LAY-14：细框（760,380,400,320）→ 版心（120,150,1680,780），20f cineEaseInOut
  const ex = progress(frame, 0, 20, EASE.inOut);
  const box = {
    left: 760 + (GRID.margin - 760) * ex,
    top: 380 + (150 - 380) * ex,
    width: 400 + (GRID.content - 400) * ex,
    height: 320 + (780 - 320) * ex,
  };

  // 落款 EN-01（70 落定）；落款下朱红 hairline 76→88 拉出
  const sign = springIn(frame, 30, 70);
  const signRule = progress(frame, 76, 12, EASE.out);

  // CAM-02 微推 2%（60→110）：尾帧不静止
  const push = 1 + 0.02 * progress(frame, 60, 50, EASE.inOut);

  return (
    <ShotShell act="ACT 03 · 重启">
      <AbsoluteFill>
        <div style={{ position: 'absolute', inset: 0, transform: `scale(${push})`, transformOrigin: 'center center' }}>
          {/* LAY-14 朱红细框（s26 交出的那一枚）扩成整页版心 */}
          <div
            style={{
              position: 'absolute',
              left: box.left,
              top: box.top,
              width: box.width,
              height: box.height,
              border: `1px solid ${FILM_COLORS.vermillion}`,
              opacity: 0.9,
              boxSizing: 'border-box',
            }}
          />

          {/* 引语三行：首行带首字下沉，2/3 行按首字宽悬挂缩进 */}
          <div style={{ position: 'absolute', left: GRID.margin + 72, top: 210, width: GRID.content - 144 }}>
            <KineticLine
              text={LINES[0]}
              start={LINE_START[0]}
              framesPerChar={2}
              size={64}
              weight={400}
              lineHeight={1.45}
            />
            <div style={{ marginLeft: 0, marginTop: 22 }}>
              <KineticLine text={LINES[1]} start={LINE_START[1]} framesPerChar={2} size={64} lineHeight={1.45} />
              <KineticLine text={LINES[2]} start={LINE_START[2]} framesPerChar={2} size={64} lineHeight={1.45} />
            </div>
          </div>

          {/* 落款（EN-01；mono 右下） */}
          <div style={{ position: 'absolute', right: GRID.margin + 72, top: 848 }}>
            <div style={sign}>
              <Meta size={20}>{`${SIGN.source} · ${SIGN.date}`}</Meta>
              <div
                style={{
                  marginTop: 10,
                  marginLeft: 'auto',
                  width: 260 * signRule,
                  height: 1,
                  backgroundColor: FILM_COLORS.vermillion,
                  opacity: 0.85,
                }}
              />
            </div>
          </div>

          {/* 版心右下角一枚 8px 朱红小方点：引语页的页脚签名位（确定性微旋，不抢主体） */}
          <div
            style={{
              position: 'absolute',
              left: box.left + box.width - 18,
              top: box.top + box.height - 18,
              width: 8,
              height: 8,
              backgroundColor: FILM_COLORS.vermillion,
              opacity: 0.75,
              transform: 'rotate(45deg)',
            }}
          />
        </div>
      </AbsoluteFill>
    </ShotShell>
  );
};

export default S27;