/* 镜 12 · Act 3 重启与复燃 · 全局帧 [1980,2200) · 220f */
import type { FC } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { GRADES, writeFade } from '../motion-tokens';

const serif = fontFamilies.serif;

/* 宣言信纸 · 逐行落墨（原 ShotManifestoA；【坐标保真】原镜断点以幕局部帧求值——原片窗口起点即已全部完成，交付态为静态全文；
   本镜 frame = useCurrentFrame() + 180（幕局部）复现原渲染；复活逐行落墨动画属内容变更，另立 change。
   逐字核对非幕局部帧（若为幕局部则落在镜 11 窗口内成死代码），维持不变；镜尾帧交接态：信纸三行已全文显形） */
const ShotManifestoA: FC = () => {
  const frame = useCurrentFrame() + 180; // 幕局部帧保真（见头注释）
  const lines = ['两天重新读了一下过去写过的博客，', '才发现我已经很久没有继续写博客了。', '……这样不好。'];
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ width: 880, background: colors.paperDeep, borderRadius: 10, padding: '48px 60px', transform: 'rotate(-0.8deg)' }}>
          {lines.map((l, i) => (
            <p key={i} style={{ ...writeFade(frame, 14 + i * 46), fontFamily: serif, fontSize: 30, color: colors.ink, margin: '20px 0' }}>
              {l}
            </p>
          ))}
        </div>
      </AbsoluteFill>
      {/* 幕级调色 veil（grade-seal-red · screen 0.1，Act3 全幕常量，跨镜拆分归入各镜，层级在内容之上） */}
      <AbsoluteFill style={{ background: GRADES[2].lut.color, mixBlendMode: 'screen', opacity: 0.1 }} />
    </AbsoluteFill>
  );
};

export default ShotManifestoA;
