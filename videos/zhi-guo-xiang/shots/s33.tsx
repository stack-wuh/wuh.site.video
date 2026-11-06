/* S33 · 案头：笔已搁在笔架上 210f
 *
 * v11 §3.11（用户意见 16「那支毛笔是什么鬼，去掉，整张图重新设计」）：
 * v10 把 p-brush（一支怼在镜头前的大毛笔）当底图，用户判为素材错误。本镜整张重做：
 *   · 底图换案头纸面 `p-paper-lamp`（public/zhi-guo-xiang/paper/：暗木案、左侧油灯、展开的纸、右端卷轴）——
 *     **画面里没有任何笔**，连笔架上的笔都不画：只留「笔已放下」的意思（字停在行尾）；
 *   · 纸面第五行停在「霞」前：进度 15/17，第 15 个字「和」落满、第 16 个「霞」一字未落；
 *   · 灯焰跳动 + 光晕呼吸（d-lamp.tsx LampFlame，焰心 (112,220) 是底图实测的灯焰位置）；
 *   · 纸角被穿堂风掀起两次（d-desk.tsx PaperFlap，纸角吃光 + 纸沿外侧一线柔影，34–70f / 112–148f，不用几何裁切）；
 *   · 湿墨高光在灯下慢慢变干（d-desk.tsx WetInkSheen，210f 内 0.5 → 0.05 慢慢收）；
 *   · 转场归 ShotShell，本镜不做镜内全屏淡入淡出。
 * 与 S34 同机位同光位：同一张纸、同一组 InkPaper 参数（DESK_TEXT 一处定义两镜共用），
 * 推镜到 1.04 收住，S34 从 1.04 接着推。 */
import type { FC } from 'react';
import { useCurrentFrame } from 'remotion';
import { Slide } from '../components/SceneKit';
import { InkPaper, POEM_COLS } from '../components/InkPaper';
import { LampFlame } from '../components/d-lamp';
import { DESK_LAST_CHAR, DESK_TEXT, PaperFlap, WetInkSheen } from '../components/d-desk';

const S33: FC = () => {
  const f = useCurrentFrame();
  return (
    <Slide zoom={[1.0, 1.04]} warm={0.02}>
      <InkPaper
        base="p-paper-lamp"
        lines={[POEM_COLS[6], POEM_COLS[7]]}
        progress={DESK_TEXT.progress}
        size={DESK_TEXT.size}
        right={DESK_TEXT.right}
        top={DESK_TEXT.top}
      >
        <LampFlame frame={f} at={{ x: 112, y: 220 }} size={32} />
        <PaperFlap frame={f} lifts={[[34, 70], [112, 148]]} />
        <WetInkSheen frame={f} from={0} to={210} at={{ x: DESK_LAST_CHAR.x, y: DESK_LAST_CHAR.y - 170 }} w={210} h={720} />
      </InkPaper>
    </Slide>
  );
};

export default S33;