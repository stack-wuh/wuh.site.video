/* S43 · Act 6 入院 · 局部帧 [0,112) · 112f · 绝对 5674–5786
 *
 * V2 深空数据流重构（2026-11-11）：漫游末卡 + 收束——/topics 卡（S11）降级为
 * 证据快闪辉光小窗、回正面落定（0–26 原窗口），页中数据行写完（6–46 原节奏）；
 * 联系钤印（手作签名·本镜唯一朱红）22px→150px 落定 66=绝对 5740=拍287 对音
 * （入院唯一重音，6f + 轻震）；扫描线加速一次（98–104 原窗口，改走独立辉光扫线）；
 * 100–112 漫游路线 01–08 数据行全亮、纸页边缘自右缘滑至左缘立起（fold 原窗口）
 * ——屋子看完了，门在身后合上（原 ConsolePanel 退役，改走 HUD 数据行口径）。
 * 转场：入「切」，出「切」（尾帧纸页交镜 44 推窗）。
 * 字幕安全窗：start≥12。
 * 尾帧：朱红晕光+纸页边缘（交接态：面板收束成纸页，交推窗）。
 */
import type { FC } from 'react';
import { AbsoluteFill, Img, interpolate, useCurrentFrame } from 'remotion';
import { staticFile } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { CURVES, sealStamp, sealTilt } from '../../../brand/motion';
import { Caption } from '../components/Caption';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';
import { FILM_COLORS2, paperShake } from '../motion-tokens';

const TOTAL = 112;
const SEAL_AT = 66; // = 绝对 5740 = 拍287
const FOLD_AT = 100; // 路线全亮 + 纸页边缘收束
/** 漫游路线 01–08（与 s30–s38 面板八块同口径，只报编号不造名目） */
const ROUTES = ['01', '02', '03', '04', '05', '06', '07', '08'];

const S43: FC = () => {
  const frame = useCurrentFrame();
  const shake = paperShake(frame, SEAL_AT, 1.6, 8);
  // 末卡回正落定
  const settle = interpolate(frame, [0, 26], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  // 面板收束成纸页边缘（100–112）：整体缩为左缘一道纸页
  const fold = interpolate(frame, [FOLD_AT, TOTAL], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });

  return (
    <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep }}>
      <DeepSpace seed="s43v2" stars={56} grid horizon />

      {frame < FOLD_AT ? (
        <>
          {/* 证据快闪：末卡 /topics（S11 卡面回正落定） */}
          <div
            style={{
              position: 'absolute',
              left: 480,
              top: 170,
              width: 960,
              height: 600,
              borderRadius: 10,
              overflow: 'hidden',
              border: `1px solid ${FILM_COLORS2.dataDim}`,
              boxShadow: `0 0 44px rgba(212,163,115,0.22), 0 24px 60px rgba(0,0,0,0.65)`,
              opacity: settle,
              transform: `scale(${0.96 + settle * 0.04})`,
              zIndex: 28,
            }}
          >
            <Img src={staticFile('wuh-site-intro-v3/site/s11-topics-v1.png')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <AbsoluteFill style={{ background: FILM_COLORS2.space, opacity: 0.2 }} />
            {/* 页中数据行写完（6–46 原节奏） */}
            {[0, 1, 2].map((r) => (
              <div key={r} style={{ position: 'absolute', left: 70, top: 400 + r * 52, width: 700, height: 30 }}>
                <div
                  style={{
                    width: `${interpolate(frame, [6 + r * 12, 30 + r * 12], [0, 100], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}%`,
                    height: 15,
                    background: FILM_COLORS2.data,
                    opacity: 0.5,
                    boxShadow: `0 0 8px rgba(212,163,115,0.3)`,
                  }}
                />
              </div>
            ))}
            <span style={{ position: 'absolute', left: 70, bottom: 30, fontFamily: fontFamilies.mono, fontSize: 15, color: FILM_COLORS2.paperWhite, opacity: 0.7, letterSpacing: '0.2em' }}>话题 · /TOPICS</span>
            {/* 联系钤印（入院唯一重音·手作签名） */}
            <div style={{ position: 'absolute', right: 90, bottom: 60, ...sealStamp(frame, SEAL_AT, 30, sealTilt('s43-contact')) }}>
              <div style={{ width: 150, height: 150, borderRadius: 8, background: FILM_COLORS2.sealRed, opacity: 0.92, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 26px rgba(122,31,22,0.45)` }}>
                <span style={{ fontFamily: fontFamilies.serif, fontSize: 40, color: FILM_COLORS2.paperWhite }}>联系</span>
              </div>
            </div>
          </div>
          {shake.transform ? <AbsoluteFill style={shake} /> : null}
        </>
      ) : (
        <>
          {/* 漫游路线 01–08 数据行全亮（「八块全亮」的 HUD 版） */}
          <div style={{ position: 'absolute', left: 760, top: 300, width: 400, zIndex: 26 }}>
            {ROUTES.map((r, i) => (
              <div key={r} style={{ display: 'flex', alignItems: 'baseline', gap: 18, marginBottom: 10 }}>
                <span style={{ fontFamily: fontFamilies.mono, fontSize: 15, color: FILM_COLORS2.data, width: 34, fontVariantNumeric: 'tabular-nums' }}>{r}</span>
                <div
                  style={{
                    flex: 1,
                    height: 8,
                    borderRadius: 4,
                    background: `linear-gradient(90deg, ${FILM_COLORS2.dataDim}, ${FILM_COLORS2.data})`,
                    boxShadow: `0 0 10px rgba(212,163,115,0.3)`,
                    opacity: 0.9 - i * 0.03,
                  }}
                />
              </div>
            ))}
          </div>
          {/* 扫描线加速一次（98–104 原窗口） */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: '46%',
              height: 2,
              background: `linear-gradient(90deg, transparent, rgba(212,163,115,0.55), transparent)`,
              opacity: interpolate(frame, [98, 104, 110], [0, 1, 0.4], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
              zIndex: 27,
            }}
          />
          {/* 面板整体收束成纸页边缘（100–112 原窗口：自右缘滑至左缘立起，交接 s44） */}
          <div
            style={{
              position: 'absolute',
              right: interpolate(fold, [0, 1], [0, 1650]),
              top: 120,
              bottom: 120,
              width: 270,
              background: FILM_COLORS2.paperWhite,
              borderLeft: `2px solid ${FILM_COLORS2.dataDim}`,
              boxShadow: '-24px 0 60px rgba(0,0,0,0.55)',
              opacity: 0.96,
              zIndex: 29,
            }}
          />
          {/* 朱红晕光 */}
          <AbsoluteFill style={{ background: `radial-gradient(circle at 30% 55%, rgba(122,31,22,0.22), transparent 55%)`, opacity: fold, pointerEvents: 'none' }} />
        </>
      )}

      <HudChrome label="wuh.site · ROAM" readout="05/05 · /TOPICS" />
      <Grade2 id="GR2-06" />
      <Caption text="代码写诗，工具作画。" appearAt={14} />
    </AbsoluteFill>
  );
};

export default S43;
