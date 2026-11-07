/* s40 · 最后一版，只比第一版多了一件事：她的事，是真的。（255f · 8.5s，Act 8 终·执念）
 *
 * 素材镜：M8 片尾念念段（母带 270–278.5s，`seg-v12-ending-v1`，8.5s = 255f）
 * + 全镜缓推近 scale 1 → 1.06（MO-EASE-INOUT；s34 例外条款：素材镜允许缓推）。
 * 缩放包在视频外层，scale ≥ 1 不露底；不调色（素材镜纪律，保母带原貌）。
 * 转场：入「切」/ 出「墨洇」（下一镜 s41 inbound）。字幕窗 [12,223]（255 − 墨 20 − 12）。
 */
import type { CSSProperties, FC } from 'react';
import { AbsoluteFill, interpolate, OffthreadVideo, staticFile, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { Caption } from '../components/Caption';
import { CLAMP, MO_EASE } from '../motion-tokens';

const TOTAL = 255;
const VIDEO: CSSProperties = { width: '100%', height: '100%', objectFit: 'cover' };
const SEG_SRC = 'making-of-zhi-guo-xiang/segments/seg-v12-ending-v1.mp4';

const S40: FC = () => {
  const f = useCurrentFrame();
  /* 全镜缓推近（MO-EASE-INOUT，1 → 1.06） */
  const push = interpolate(f, [0, TOTAL - 1], [1, 1.06], { ...CLAMP, easing: MO_EASE.inout });

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <AbsoluteFill style={{ transform: `scale(${push})` }}>
        <OffthreadVideo src={staticFile(SEG_SRC)} startFrom={0} endAt={TOTAL} style={VIDEO} />
      </AbsoluteFill>

      <Caption
        text="最后一版，只比第一版多了一件事：她的事，是真的。"
        start={12}
        end={223}
        duration={TOTAL}
        inSide={0}
        outSide={20}
      />
    </AbsoluteFill>
  );
};

export default S40;
