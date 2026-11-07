/* S19 · 崖边空了（240f · 入「墨洇」）
 *
 * v12 分镜 Act 5：崖边空了；雾里一道下坠的身影（极小），衣摆翻起。底图 `p-cliff` + 代码。
 *
 * 取舍（本轮最硬的规矩）：**不用代码画人**。所以「一道下坠的身影」不画身子、不画头，
 * 改成**一滴墨坠进谷底**——极小的一粒墨心 + 一线被风拉长的墨尾，从崖口落向云海，
 * 74f 时没入雾里。抽帧读作「有东西下去了」，不会读出一个贴纸人。
 * 另外两件事都在云上：云比 S18 急（他刚跳下去）、崖风把雾面压低。
 * 镜头：大远固定，1.0 → 1.03（几乎不动，让画面自己往下坠）。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { ShotScene } from '../components/e-scene';
import { Caption } from '../components/Caption';
import { CloudDrift } from '../components/f-clouddrift';
import { DustField } from '../components/DustField';
import { CLAMP, CURVES } from '../motion-tokens';

/** 墨滴路径：断肠崖口（量自 p-cliff：崖顶小峰右缘外侧 ≈ 800, 548）→ 云海（806, 936）。
 *  必须落在崖壁**外**的白云里：落在深色的崖面上会看不见（第一版抽帧就是这个问题）。 */
const FALL = { x0: 800, y0: 548, x1: 806, y1: 936 };

/** 本镜时长（manifest durationFrames——ShotScene 用它算推拉进度，不读 useVideoConfig） */
const TOTAL = 240;

const S20: FC = () => {
  const f = useCurrentFrame();
  const T0 = Math.round(TOTAL * 0.1);
  const T1 = Math.round(TOTAL * 0.52);
  /* 水平匀速、竖直二次方——自由落体；cinEaseIn 让「起跳那一下」慢、越落越快 */
  const k = interpolate(f, [T0, T1], [0, 1], { ...CLAMP, easing: CURVES.cineEaseIn });
  const x = FALL.x0 + (FALL.x1 - FALL.x0) * k;
  const y = FALL.y0 + (FALL.y1 - FALL.y0) * k * k;
  /* 没入雾的最后 8f 淡掉（雾吃墨，不是凭空消失） */
  const visible = f >= T0 && f <= T1 ? 1 - interpolate(f, [T1 - 8, T1], [0, 1], CLAMP) : 0;
  const tail = 26 + 46 * k;

  return (
    <ShotScene name="p-cliff" total={TOTAL} frame={f} zoom={[1.0, 1.03]} dim={0.03}>
      <CloudDrift seed="s20-cloud" count={7} intensity={1} band={[0.3, 0.99]} speed={0.5} dark={0.085} />

      {/* 下坠的一滴墨：墨尾在上、墨心在下，都在云海后面（multiply 压进雾里） */}
      {visible > 0.01 ? (
        <AbsoluteFill style={{ pointerEvents: 'none' }}>
          <div
            style={{
              position: 'absolute',
              left: x - 1.6,
              top: y - tail,
              width: 3.2,
              height: tail,
              background: `linear-gradient(180deg, transparent 0%, ${colors.ink} 90%)`,
              opacity: 0.5 * visible,
              filter: 'blur(2px)',
              mixBlendMode: 'multiply',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: x - 2.4,
              top: y - 2.4,
              width: 4.8,
              height: 4.8,
              borderRadius: 3,
              background: colors.ink,
              opacity: 0.74 * visible,
              filter: 'blur(1px)',
              mixBlendMode: 'multiply',
            }}
          />
        </AbsoluteFill>
      ) : null}

      <DustField act={5} count={26} seedBase="s20-wind" wind={-12} />
      <Caption cue="s19" tone="ink" />
    </ShotScene>
  );
};

export default S20;