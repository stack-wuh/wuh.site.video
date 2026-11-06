/* S02 · 纸正面：前四行旧墨，第五行只剩「其」 210f
 * v10 §五：墨团不再写死——把 InkPaper 接成「逐列落笔」：progress 0.35→1（前两列已带旧墨，
 * 后面几列在镜内一列列写出来，末段减速，收在 150f），墨团到末段才洇开（blot 0→0.55，150→188f），
 * 落点在最后一列「其」旁的纸面上。只改参数，不动文案、底图与时长。
 * 出镜转场：s02 的 out = s03 的 page（18f），192f 起画面被纸色擦走——写字与洇墨都收在 192f 之前。 */
import type { FC } from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { Slide } from '../components/SceneKit';
import { InkPaper, POEM_COLS } from '../components/InkPaper';
import { CLAMP, CURVES } from '../motion-tokens';

/* 末列的「其」在画面上的位置（1920×1080 基准）：
 * 列右边距 = 14% + 6 × 54 × 1.5 = 268.8 + 486 = 754.8 → 右缘 x ≈ 1165，字心 x ≈ 1138；
 * 纵向起点 9% = 97.2，首字中心 y ≈ 128。
 * 墨团落在它左下方一点（不压字）：x 1020 / y 200 / 基准半径 150。 */
const BLOT_AT = { x: 1020, y: 200, r: 150 };

const S02: FC = () => {
  const f = useCurrentFrame();
  const progress = interpolate(f, [0, 150], [0.35, 1], { ...CLAMP, easing: CURVES.cineEaseInOut });
  const blot = interpolate(f, [150, 188], [0, 0.55], CLAMP);
  return (
    <Slide zoom={[1.0, 1.035]} driftY={[0, 26]} dim={0.03}>
      <InkPaper
        base="p-paper-close-dusk"
        lines={[...POEM_COLS.slice(0, 6), '其']}
        progress={progress}
        size={54}
        right="14%"
        top="9%"
        blot={blot}
        blotAt={BLOT_AT}
      />
    </Slide>
  );
};

export default S02;
