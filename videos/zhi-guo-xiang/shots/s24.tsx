/* S24 · 同一间茶馆·另一机位（210f）—— v11 §3.7 / 用户意见 12：「这画面意义是什么」
 *
 * v10 这一镜是一间茶棚 + 一碗茶的空镜，无人、无事件。v11 改成**过肩近景 + 一个事件**：
 *   前景：左下那组近景过客的肩背当框（底图自带：离镜头最近的那个大背影），右缘再过一层淡虚焦；
 *   中景：她那一桌、那只碗——**碗满 → 半 → 空**（三口茶），90f 锣响把这最后一口收住；
 *   落点：放下碗，一手的手指搭在碗沿停住（≥20f），只剩水汽。
 *
 * 与 S20 同一间屋子、同一张底图：这里只是**裁近到左下她那桌**（CROP 与 S20 的整幅同源），
 * 暖赭值/茶烟锚点/暗角一律来自 c-teahouse 的 ROOM 常量，茶烟锚点按同一台摄影机位移换算到屏幕。
 * 碗与手由 c-teabowl 画（物如刀刻）；人物在底图里——**不出现纯黑剪影**。
 *
 * 转场：入「切」（承接 S23 童谣的硬切）、出「切」（接下镜 S25 同机位掌心特写）。无字幕。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { CLAMP } from '../motion-tokens';
import { Scene } from '../components/SceneKit';
import { DustField } from '../components/DustField';
import { TeaBowl } from '../components/c-teabowl';
import { BokehShoulders, ROOM, RoomVignette, SoundPulse, TeaRoomLight } from '../components/c-teahouse';

/** 裁近取景：窗宽 = 1920/zoom，正好贴住底图左边缘（x0=0）与下边缘——不露纸底。
 *  zoom 1.75：左下那组近景过客当框，她与她的碗落在中景。 */
const CROP = { x: 548, y: 772, zoom: 1.75 };
/** 世界点 → 屏幕点：与 Scene 的 `scale(s) translate(960-cropX, 540-cropY)` 同式 */
const toScreen = (p: { x: number; y: number }) => ({
  x: 960 + CROP.zoom * (p.x - CROP.x),
  y: 540 + CROP.zoom * (p.y - CROP.y),
});
/** 她桌上那只素茶碗（与 S20 同一只，量自底图 ≈ (346, 904)，碗口直径 ≈62px）。 */
const BOWL_WORLD = { x: 330, y: 918 };
const BOWL_SCREEN = toScreen(BOWL_WORLD);
/** 代码碗比底图那只大 12%：盖住它，同时读作「离镜头更近的那只碗」。 */
const BOWL_SCALE = (62 / 184) * CROP.zoom * 1.02;
/** 茶烟锚点按同一台摄影机位移换算（同一壶水、同一间屋子） */
const SMOKE_SCREEN = ROOM.smoke.map((a) => ({ ...a, x: toScreen(a).x, y: toScreen(a).y, r: a.r * CROP.zoom }));

/** 锣：90f（混音点）。 */
const GONG = 90;
/** 落碗：最后一口之后把碗放回桌面。 */
const SET_DOWN = 104;

const S24: FC = () => {
  const f = useCurrentFrame();

  /* ─── 三口茶：抬杯—倾—落。茶面每口掉一档，第三口见底 ─── */
  const sipLift = (a: number, b: number) => {
    if (f < a || f > b) return 0;
    return interpolate(f, [a, a + 5, b - 6, b], [0, 1, 1, 0], CLAMP);
  };
  const liftPx = 9 * Math.max(sipLift(26, 44), sipLift(50, 66), sipLift(72, 88));
  const tilt = -8 * Math.max(sipLift(26, 44), sipLift(50, 66), sipLift(72, 88));
  /* 茶面：满 → 七分 → 四分 → 见底（只在倾杯时下降，其余时间静着） */
  const level = interpolate(
    f,
    [0, 26, 44, 50, 66, 72, 88, 150, 210],
    [1, 1, 0.72, 0.72, 0.42, 0.42, 0.08, 0.06, 0.05],
    CLAMP,
  );

  /* ─── 锣：画面 1.4px 轻震（本镜无字幕，纯画面回执）+ 茶面涟漪 + 水汽一激 ─── */
  const sinceGong = f - GONG;
  const gongDecay = sinceGong >= 0 ? Math.exp(-sinceGong / 6) : 0;
  const shake = sinceGong >= 0 && sinceGong < 26 ? 1.4 * gongDecay : 0;
  const sx = Math.sin((sinceGong / 2.3) * Math.PI) * shake;
  const sy = Math.cos((sinceGong / 2.3) * Math.PI) * shake * 0.6;
  const gongPulse = sinceGong >= 0 && sinceGong < 34 ? Math.exp(-sinceGong / 8) : 0;
  /* 落碗：碗底碰到桌面的第二记（更小、更短） */
  const sinceSet = f - SET_DOWN;
  const setPulse = sinceSet >= 0 && sinceSet < 20 ? Math.exp(-sinceSet / 5) : 0;
  const ripple = Math.max(
    sinceGong >= 0 && sinceGong < 30 ? Math.exp(-sinceGong / 9) : 0,
    sinceSet >= 0 && sinceSet < 18 ? Math.exp(-sinceSet / 5) : 0,
  );

  /* 手：她伸手取碗 → 握 → 落碗后两指搭在碗沿停住（20f 之后一直停着） */
  const hand = interpolate(f, [8, 26], [0, 1], CLAMP);
  const rest = interpolate(f, [SET_DOWN + 2, SET_DOWN + 20], [0, 1], CLAMP);
  const steam = 0.5 + 0.16 * Math.sin((f / 120) * Math.PI * 2) + 0.3 * gongPulse + 0.16 * setPulse;

  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', inset: -10, transform: `translate(${sx}px, ${sy}px)` }}>
        <Scene
          name="p-teahouse"
          zoom={[CROP.zoom, CROP.zoom + 0.03]}
          driftX={[960 - CROP.x, 960 - CROP.x - 5]}
          driftY={[540 - CROP.y, 540 - CROP.y + 3]}
          dim={0.02}
          warm={0.05}
        >
          {/* 茶烟：同一壶水（锚点随摄影机位移换算；窗光交给底图自带的光柱，不再叠代码光柱） */}
          <TeaRoomLight anchors={SMOKE_SCREEN} intensity={0} smokeScale={1.1} smokeDrift={-5} scatter={0} />
          {/* 她那只碗：满—半—空，就是这一镜的钟 */}
          <TeaBowl
            at={BOWL_SCREEN}
            scale={BOWL_SCALE}
            level={level}
            tilt={tilt}
            lift={liftPx / BOWL_SCALE}
            ripple={ripple}
            fingers={hand}
            rest={rest}
            steam={steam}
          />
          {/* 锣声的两层回执：碗沿一记暖光（近）、街口一记冷光（远） */}
          <SoundPulse pulse={gongPulse} at={{ x: BOWL_SCREEN.x, y: BOWL_SCREEN.y, r: 150 }} />
          <SoundPulse pulse={gongPulse} at={{ x: 1860, y: 300, r: 260 }} cool />
          <DustField act={4} count={26} seedBase="s24-room" wind={5} />
          {/* 前景虚焦框：左下过客肩背（底图里那个最近的背影）+ 右缘一截说书人 */}
          <BokehShoulders variant="patron" strength={0.55} />
          <BokehShoulders variant="storyteller" strength={0.3} />
          <RoomVignette />
        </Scene>
      </div>
    </AbsoluteFill>
  );
};

export default S24;