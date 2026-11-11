/* S58 · Act 8 此刻 · 局部帧 [0,118) · 118f · 绝对 7732–7850
 *
 * V2 深空数据流重构（2026-11-11）：工具枝 shadow-dev-cli 琥珀墨线生长
 * （6–34 原窗口）；标签改线框数据卡（14 落位即现，标识不滚）：
 * 2026-09-16 · 158 commits · v1.9.0；plan 与 execute 两枚步骤牌先后落章
 * （36 / 66 原窗口，sealStamp 落定动效），planHash 一行小字确认后落盘
 * （84 ✓ tick = 本镜唯一朱红·手作签名）+ 落盘轻震（84 paperShake）；
 * 俯拍微距机位不动。转场：入「切」，出「切」。字幕安全窗：start≥12、end≤106。
 * 尾帧：枝 4 双牌落定。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { sealStamp, sealTilt, writeFade } from '../../../brand/motion';
import { FILM_COLORS2, glowText, paperShake, treeGrow } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { Caption } from '../components/Caption';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';

/** 枝 4（真长度由 evolvePath 计算，不再猜 800） */
const B4_D = 'M 895 600 C 830 520 760 470 640 445';

const S58: FC = () => {
  const frame = useCurrentFrame();
  const b4 = treeGrow(frame, 6, 34, B4_D);
  const shake = paperShake(frame, 84, 1.6, 9);
  const cam = { scale: 1.05, x: 0, y: interpolate(frame, [0, 30], [0, 20], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }), rot: 0 };

  return (
    <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep }}>
      <CameraRig cam={cam}>
        <AbsoluteFill>
          <DeepSpace seed="s58v2" stars={50} grid horizon />
          {/* 树骨架 + 枝 1–3（常驻，琥珀墨）+ 枝 4（下垂工具枝，生长） */}
          <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            <path d="M 910 520 C 900 640 880 760 850 880" fill="none" stroke="rgba(212,163,115,0.16)" strokeWidth={18} />
            <path d="M 910 520 C 900 640 880 760 850 880" fill="none" stroke={FILM_COLORS2.data} strokeWidth={9} opacity={0.92} />
            <path d="M 880 660 C 700 620 520 600 300 620" fill="none" stroke="rgba(212,163,115,0.14)" strokeWidth={12} />
            <path d="M 880 660 C 700 620 520 600 300 620" fill="none" stroke={FILM_COLORS2.data} strokeWidth={4.5} opacity={0.88} />
            <path d="M 880 700 C 1060 700 1240 720 1420 700" fill="none" stroke="rgba(212,163,115,0.14)" strokeWidth={12} />
            <path d="M 880 700 C 1060 700 1240 720 1420 700" fill="none" stroke={FILM_COLORS2.data} strokeWidth={4.5} opacity={0.88} />
            <path d="M 890 620 C 980 520 1090 460 1230 430" fill="none" stroke="rgba(212,163,115,0.14)" strokeWidth={11} />
            <path d="M 890 620 C 980 520 1090 460 1230 430" fill="none" stroke={FILM_COLORS2.data} strokeWidth={4} opacity={0.88} />
            <path d={B4_D} fill="none" stroke="rgba(212,163,115,0.14)" strokeWidth={11} {...b4.stroke} />
            <path d={B4_D} fill="none" stroke={FILM_COLORS2.data} strokeWidth={4} {...b4.stroke} opacity={0.88} />
          </svg>

          {/* 枝 4 标签卡（线框数据卡） */}
          <div style={{ position: 'absolute', left: 360, top: 330, ...writeFade(frame, 14) }}>
            <div
              style={{
                background: FILM_COLORS2.panel,
                border: `1px solid ${FILM_COLORS2.dataDim}`,
                borderRadius: 8,
                padding: '18px 26px',
                boxShadow: `0 0 26px rgba(212,163,115,0.16), 0 16px 44px rgba(0,0,0,0.55)`,
              }}
            >
              <div style={{ fontFamily: fontFamilies.mono, fontSize: 22, color: FILM_COLORS2.paperWhite, ...glowText(FILM_COLORS2.data, 0.2) }}>shadow-dev-cli</div>
              <div style={{ fontFamily: fontFamilies.mono, fontSize: 15, color: FILM_COLORS2.textMuted, marginTop: 8 }}>2026-09-16 · 158 commits · v1.9.0</div>
            </div>
          </div>

          {/* plan 牌（36 落章落定） */}
          <div style={{ position: 'absolute', left: 330, top: 520, ...sealStamp(frame, 36, 30, sealTilt('s58-plan')) }}>
            <div
              style={{
                width: 330,
                height: 130,
                borderRadius: 8,
                background: FILM_COLORS2.panel,
                border: `1px solid ${FILM_COLORS2.dataDim}`,
                boxShadow: `0 0 24px rgba(212,163,115,0.14), 0 16px 40px rgba(0,0,0,0.55)`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <span style={{ fontFamily: fontFamilies.mono, fontSize: 30, color: FILM_COLORS2.paperWhite, opacity: 0.9 }}>plan</span>
              <span style={{ fontFamily: fontFamilies.mono, fontSize: 13, color: FILM_COLORS2.textMuted, opacity: 0.85 }}>planHash ✓ 确认后执行</span>
            </div>
          </div>
          {/* execute 牌（66 落章落定） */}
          <div style={{ position: 'absolute', left: 720, top: 520, ...sealStamp(frame, 66, 30, sealTilt('s58-exec')) }}>
            <div
              style={{
                width: 330,
                height: 130,
                borderRadius: 8,
                background: FILM_COLORS2.panel,
                border: `1px solid ${FILM_COLORS2.dataDim}`,
                boxShadow: `0 0 24px rgba(212,163,115,0.14), 0 16px 40px rgba(0,0,0,0.55)`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <span style={{ fontFamily: fontFamilies.mono, fontSize: 30, color: FILM_COLORS2.paperWhite, opacity: 0.9 }}>execute</span>
              <span style={{ fontFamily: fontFamilies.mono, fontSize: 13, color: FILM_COLORS2.textMuted, opacity: 0.85 }}>{frame >= 84 ? 'planHash ✓ 已落盘' : '等待确认…'}</span>
            </div>
          </div>
          {/* planHash 确认行（84 落盘 + 轻震；✓ 朱红 = 本镜唯一手作签名） */}
          <div style={{ position: 'absolute', left: 380, top: 690, ...writeFade(frame, 84), ...shake }}>
            <span style={{ fontFamily: fontFamilies.mono, fontSize: 16, color: FILM_COLORS2.gold, opacity: 0.9 }}>
              planHash bb96c4de… <span style={{ color: FILM_COLORS2.sealRed, textShadow: `0 0 10px rgba(122,31,22,0.4)` }}>✓</span> 落盘
            </span>
          </div>
        </AbsoluteFill>
      </CameraRig>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 300, backgroundImage: `linear-gradient(180deg, transparent, ${FILM_COLORS2.spaceDeep})`, opacity: 0.2 }} />
      <HudChrome label="wuh.site · GRAPH" readout="BRANCH 4 · CLI" />
      <Grade2 id="GR2-08" />
      <Caption text="方法又长成一把工具：plan → execute，确定性地落盘。" appearAt={14} />
    </AbsoluteFill>
  );
};

export default S58;
