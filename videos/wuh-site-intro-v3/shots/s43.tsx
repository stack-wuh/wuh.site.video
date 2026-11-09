/* S43 · Act 6 入院 · 局部帧 [0,112) · 112f · 绝对 5674–5786
 *
 * 漫游末卡 + 面板收束：/topics 卡（S11）回正面落定（0–26），页中字写完（6–46）；
 * 联系钤印 22px 落定 66=绝对 5740=拍287 对音（入院唯一重音，6f + 轻震）；
 * 八块全亮 litSet={01–08}、扫描线加速一次（98–104）；
 * 面板整体收束成一张纸页边缘（100–112）——屋子看完了，门在身后合上。
 * 转场：入「切」，出「切」（尾帧纸页交镜 44 纸翻）。
 * 字幕安全窗：start≥12。
 */
import type { FC } from 'react';
import { AbsoluteFill, Img, interpolate, useCurrentFrame } from 'remotion';
import { staticFile } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, sealStamp, sealTilt, writeFade } from '../../../brand/motion';
import { ConsolePanel } from '../components/ConsolePanel';
import { Caption } from '../components/Caption';
import { DustField } from '../components/DustField';
import { Grade } from '../components/Grade';
import { paperShake } from '../motion-tokens';
import { PaperGrain } from '../components/PaperGrain';

const TOTAL = 112;
const SEAL_AT = 66; // = 绝对 5740 = 拍287
const FOLD_AT = 100; // 面板收束成纸页边缘

const S43: FC = () => {
  const frame = useCurrentFrame();
  const shake = paperShake(frame, SEAL_AT, 1.6, 8);
  // 末卡回正落定
  const settle = interpolate(frame, [0, 26], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  // 面板收束成纸页边缘（100–112）：整体缩为右缘一道纸页
  const fold = interpolate(frame, [FOLD_AT, TOTAL], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      {frame < FOLD_AT ? (
        <>
          {/* 末卡 /topics（S11 卡面回正） */}
          <div style={{ position: 'absolute', left: 480, top: 170, width: 960, height: 600, borderRadius: 10, overflow: 'hidden', border: `1px solid ${colors.hairline}`, boxShadow: '0 30px 90px rgba(0,0,0,0.5)', opacity: settle, transform: `scale(${0.96 + settle * 0.04})` }}>
            <Img src={staticFile('wuh-site-intro-v3/site/s11-topics-v1.png')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <AbsoluteFill style={{ background: colors.bg, opacity: 0.2 }} />
            {/* 页中字写完（6–46） */}
            {[0, 1, 2].map((r) => (
              <div key={r} style={{ position: 'absolute', left: 70, top: 400 + r * 52, width: 700, height: 30 }}>
                <div style={{ width: `${interpolate(frame, [6 + r * 12, 30 + r * 12], [0, 100], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}%`, height: 15, background: colors.paper, opacity: 0.55 }} />
              </div>
            ))}
            <span style={{ position: 'absolute', left: 70, bottom: 30, fontFamily: fontFamilies.mono, fontSize: 15, color: colors.paper, opacity: 0.7, letterSpacing: '0.2em' }}>话题 · /TOPICS</span>
            {/* 联系钤印（入院唯一重音） */}
            <div style={{ position: 'absolute', right: 90, bottom: 60, ...sealStamp(frame, SEAL_AT, 30, sealTilt('s43-contact')) }}>
              <div style={{ width: 150, height: 150, borderRadius: 8, background: colors.seal, opacity: 0.92, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: fontFamilies.serif, fontSize: 40, color: colors.paper }}>联系</span>
              </div>
            </div>
          </div>
          {shake.transform ? <AbsoluteFill style={shake} /> : null}
        </>
      ) : (
        <>
          {/* 八块全亮面板 + 扫描线加速一次 */}
          <ConsolePanel lit={8} active={8} panelIn={1} scanBoost={interpolate(frame, [98, 104, 110], [0, 1, 0.4], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })} />
          {/* 面板整体收束成纸页边缘 */}
          <div
            style={{
              position: 'absolute',
              right: interpolate(fold, [0, 1], [0, 1650]),
              top: 120,
              bottom: 120,
              width: 270,
              background: colors.paper,
              borderLeft: `2px solid ${colors.paperMuted}`,
              boxShadow: '-24px 0 60px rgba(0,0,0,0.45)',
              opacity: 0.96,
            }}
          />
          {/* 朱红晕光 */}
          <AbsoluteFill style={{ background: `radial-gradient(circle at 30% 55%, rgba(201,111,74,0.15), transparent 55%)`, opacity: fold, pointerEvents: 'none' }} />
        </>
      )}
      <DustField act={6} count={8} seedBase="s43" />
      <PaperGrain opacity={0.05} />
      <Grade id="GR-03" />
      <Caption text="代码写诗，工具作画。" appearAt={14} />
    </AbsoluteFill>
  );
};

export default S43;
