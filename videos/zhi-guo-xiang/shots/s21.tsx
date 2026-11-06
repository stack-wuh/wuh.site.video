/* S21 · 求揭面：她举着唯一一枚金针；他抬手到面具为止，然后转身走出画面 210f
 * v10 §1.3 四段（act4 / 126–133s 不动）：
 *   0–45f    她站在雪径这头，右手举着金针；他背对，不动
 *   45–115f  只演一件事：他抬手，到面具为止（唯一的交接）
 *   115–165f 他转身，持续走出画面（走而不停）
 *   165–210f 给她的手：还举着，针已经不在了
 * 底图用 p-footprints 的远端（无人物、不联网生图）；人物两层全由代码剪影给：
 * 杨过 = YangGuoFigure 背影 + 空袖 + 面具形制；郭襄 = XiangFigure 侧后 + 举针。无字幕。 */
import type { FC } from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { Scene } from '../components/SceneKit';
import { DustField } from '../components/DustField';
import { XiangFigure, YangGuoFigure } from '../components/Figure';
import { CLAMP, CURVES } from '../motion-tokens';

const EASE = { ...CLAMP, easing: CURVES.cineEaseInOut };

/** 她：左前景，16 岁背影（双鬟、雪青斗篷），右手举针。v10 抽帧修正：缩小到 590 高、下移靠左，
 *  不再挡住雪径主体；暖青斗篷压成墨色剪影（brightness 0.34），与 S27 的黑剪影同族。 */
const HER = { left: 372, top: 458, width: 221, height: 590 };
/** 他：雪径尽头远影。身高 360（viewBox 120×360，1:1），脚点 (1115, 585)。 */
const HIM = { left: 1055, top: 225, width: 120, height: 360 };

const S21: FC = () => {
  const f = useCurrentFrame();
  /* 唯一交接：只抬手，不加侧头/停步；转身离开时手自然放下 */
  const raiseToMask = interpolate(f, [45, 115], [0, 1], EASE);
  const lower = interpolate(f, [120, 150], [0, 1], EASE);
  const raise = raiseToMask * (1 - lower);
  /* 转身：背影片横向压窄 + 略微侧转（不给脸）；随后沿山脊往上走、走进垭口雾里（不横移出画，
   *  底图右侧没有雪坡，旧版横移会读成悬空）。 */
  const turn = interpolate(f, [115, 132], [0, 1], EASE);
  const walk = interpolate(f, [120, 165], [0, 1], CLAMP);
  const vanish = interpolate(f, [130, 166], [1, 0], CLAMP);
  /* 针在她手里：他抬手回应后，那枚针就「用掉」了——145f 后手心空着 */
  const needle = interpolate(f, [112, 145], [1, 0], CLAMP);
  const herHem = Math.sin(f / 52) * 2.2;
  const herLift = Math.sin(f / 46) * 1.6;
  /* 沿雪径往上（左上）走：脚点 (1115,585) → (965,530)，身高 360→280，走进垭口雾里渐隐 */
  const himLeft = HIM.left - walk * 150;
  const himTop = HIM.top - walk * 55;
  const step = walk > 0 && walk < 1 ? Math.abs(Math.sin(f / 6)) * 2.6 : 0;

  return (
    <Scene name="p-footprints" zoom={[1, 1]} dim={0.03}>
      <DustField act={4} count={80} seedBase="s21-snow" wind={-16} />

      {/* 她：全程举着右手，只有衣摆与呼吸在动 */}
      <div
        style={{
          position: 'absolute',
          left: HER.left,
          top: HER.top + herLift,
          width: HER.width,
          height: HER.height,
          filter: 'brightness(0.34) saturate(0.65)',
        }}
      >
        <XiangFigure
          age="16"
          pose="stand"
          raise={1}
          needle={needle}
          flow={{ hem: herHem }}
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      {/* 他：背对不动 → 抬手到面具 → 转身走出画面 */}
      <div
        style={{
          position: 'absolute',
          left: himLeft,
          top: himTop - step,
          width: HIM.width,
          height: HIM.height,
          opacity: vanish,
          transform: `scale(${1 - 0.22 * walk}) scaleX(${1 - 0.24 * turn}) rotate(${-7 * turn}deg)`,
          transformOrigin: '50% 100%',
        }}
      >
        <YangGuoFigure raise={raise} mask={1} style={{ width: '100%', height: '100%' }} />
      </div>
    </Scene>
  );
};

export default S21;