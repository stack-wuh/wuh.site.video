/* S29 · 茶馆 · 醒木落下（210f · 入「硬切」）
 *
 * v12 分镜 Act 6：茶馆，说书人醒木落下，茶烟散开；她坐在最外圈，背向镜头。底图 `p-teahouse`。
 * 人物全在底图里（说书人侧后、满屋过客背影、左下最小那个背影是她）；代码只做这间屋子的空气：
 *   · 同一间屋子的窗光与茶烟（c-teahouse 的 ROOM 唯一真值，与 S20/S24 同源）；
 *   · 醒木落下那一下（84f，留一条可与混音对齐的帧）：画面轻震 2px（30f 内停）+
 *     接触点一记淡墨 + 一记暖光脉冲 + 茶烟被震散一下；
 *   · 光柱里的浮尘。
 * 无代码人物 → 无纯黑剪影风险；入硬切，动作从第 0 帧成立。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { CLAMP } from '../motion-tokens';
import { Scene } from '../components/SceneKit';
import { Caption } from '../components/Caption';
import { DustField } from '../components/DustField';
import { InkBloom } from '../components/InkBloom';
import { RoomVignette, SoundPulse, TeaRoomLight } from '../components/c-teahouse';

/** 醒木位置（量自 p-teahouse：说书人案上那截深木块 ≈ (1205, 552)）。 */
const GAVEL = { x: 1205, y: 552, r: 200 };
/** 醒木落点：210f 里第 84f（4 拍多一点，后面留足余韵）。 */
const HIT = 84;

const S29: FC = () => {
  const f = useCurrentFrame();
  const since = f - HIT;

  /* 落下前 1px 提气（14f）+ 落下后阻尼回摆（振幅 2px、30f 内停）；只震画面层，不震字幕 */
  const preLift = interpolate(f, [HIT - 14, HIT - 2], [0, -1], CLAMP);
  const decay = since >= 0 ? Math.exp(-since / 6.5) : 0;
  const shake = since >= 0 && since < 30 ? 1.9 * decay : 0;
  const sx = Math.sin((since / 2.3) * Math.PI) * shake;
  const sy = Math.cos((since / 2.3) * Math.PI) * shake * 0.55 + preLift;

  /* 那一声的两层回执：暖光脉冲（快起慢收）+ 茶烟被震散 */
  const pulse = since >= 0 && since < 36 ? Math.exp(-since / 8) : 0;
  const scatter = since >= 0 && since < 28 ? interpolate(since, [0, 6, 28], [0, 1, 0], CLAMP) : 0;

  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', inset: -10, transform: `translate(${sx}px, ${sy}px)` }}>
        <Scene name="p-teahouse" zoom={[1.0, 1.038]} driftX={[0, -6]} dim={0.02} warm={0.05}>
          {/* 同一间屋子：窗光 + 茶烟（本镜整幅不裁，锚点用 ROOM 原值） */}
          <TeaRoomLight intensity={0.55 + 0.1 * pulse} scatter={scatter} smokeDrift={-4} />
          {/* 醒木落下：案上接触点一记暖光 + 一记淡墨 */}
          <SoundPulse pulse={pulse} at={GAVEL} />
          {since >= 0 ? (
            <InkBloom
              progress={interpolate(since, [0, 8], [0.3, 1], CLAMP)}
              at={GAVEL}
              color={colors.ink}
              opacity={0.38 * (1 - interpolate(since, [4, 26], [0, 1], CLAMP))}
              blur={2}
            />
          ) : null}
          <DustField act={6} count={30} seedBase="s29-room" wind={4} />
          <RoomVignette />
        </Scene>
      </div>
      <Caption cue="s29" tone="ink" />
    </AbsoluteFill>
  );
};

export default S29;