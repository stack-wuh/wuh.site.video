/* S13 · Act 3 第一行 · 局部帧 [0,180) · 180f · 绝对 1962–2142
 *
 * V2 暖黑数据流重写（2026-11-11 品牌暖黑科技）：「灰纸暖句」改写为「档案页金句 kinetic」——
 * 深色档案卡上金句逐字浮出（衬线大字，write-fade 12+i*3.3 原节奏；「每一天…」起
 * 透琥珀数据色+辉光，WARM_FROM=17 原位）；数据读数行「现 1,160 阅读」★DAT-01 微滚
 * （118–138，落定 138=绝对 2100=拍105 静默；量滚，「热度榜 #6」标识落位即现 138–150）；
 * 右下极小字「#37 · 2022」（标识）；末 30f 档案页右下角掀起（交接态语义：暖句整句停住+掀角）。
 * 转场：入「切」，出「切」。cam scale 1.05 原样。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { CURVES, writeFade } from '../../../brand/motion';
import { FILM_COLORS2, glowText, numRoll, ROLL_DUR } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { Caption } from '../components/Caption';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';

const TOTAL = 180;
const WARM_FROM = 17; // 「每一天…」半句起的字符位（琥珀数据色起点）

const S13: FC = () => {
  const frame = useCurrentFrame();
  const cam = { scale: 1.05, x: 0, y: 0, rot: 0 };
  // 逐字浮出：全句 44 字符，12f 起每字 3.3f
  const captionText = '2022 年 2 月，他写《2022 年度总结》：『不要停步不前，每一天都要做出一点改变。』';
  // ★DAT-01 微滚（118–138 落定=拍105）
  const views = Math.round(numRoll(frame, 118, ROLL_DUR.micro, 1100, 1160));
  const cornerIn = writeFade(frame, 118);
  // 末 30f 档案页掀起一角（150–180）
  const corner = interpolate(frame, [150, TOTAL], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });

  return (
    <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep }}>
      <DeepSpace seed="s13v2" stars={54} grid />
      <CameraRig cam={cam}>
        <AbsoluteFill>
          {/* 深色档案卡（承接上镜整版） */}
          <div style={{ position: 'absolute', left: 170, top: 90, right: 170, bottom: 90, borderRadius: 8, background: FILM_COLORS2.panel, border: `1px solid ${FILM_COLORS2.grid}`, boxShadow: `0 24px 60px rgba(0,0,0,0.55)`, overflow: 'hidden' }}>
            <div style={{ position: 'absolute', left: 50, top: 40, fontFamily: fontFamilies.mono, fontSize: 20, color: FILM_COLORS2.textMuted, fontVariantNumeric: 'tabular-nums' }}>2022-02-08</div>
            <div style={{ position: 'absolute', left: 50, right: 50, top: 110, height: 1, background: FILM_COLORS2.line, opacity: 0.6 }} />
            {/* 金句逐字浮出（衬线大字；「每一天…」起琥珀数据色+辉光） */}
            <div style={{ position: 'absolute', left: 90, right: 90, top: 220 }}>
              {captionText.split('').map((ch, i) => {
                const warm = i >= WARM_FROM;
                return (
                  <span
                    key={i}
                    style={{
                      ...writeFade(frame, 12 + i * 3.3),
                      display: 'inline-block',
                      fontFamily: fontFamilies.serif,
                      fontSize: 44,
                      lineHeight: 1.8,
                      color: warm ? FILM_COLORS2.data : FILM_COLORS2.paperWhite,
                      ...(warm ? glowText(FILM_COLORS2.data, 0.3) : {}),
                      whiteSpace: 'pre',
                    }}
                  >
                    {ch}
                  </span>
                );
              })}
            </div>
            {/* 右下极小字出处（标识） */}
            <div style={{ position: 'absolute', right: 60, bottom: 44, fontFamily: fontFamilies.mono, fontSize: 15, color: FILM_COLORS2.textMuted, opacity: 0.7 }}>#37 · 2022</div>
            {/* 数据读数行：现 1,160 阅读 · 热度榜 #6（量滚 + 标识落位即现） */}
            <div style={{ position: 'absolute', left: 60, bottom: 44, ...cornerIn, display: 'flex', alignItems: 'baseline' }}>
              <span style={{ fontFamily: fontFamilies.mono, fontSize: 17, color: FILM_COLORS2.textMuted, fontVariantNumeric: 'tabular-nums' }}>现 {views.toLocaleString('en-US')} 阅读</span>
              <span style={{ fontFamily: fontFamilies.mono, fontSize: 17, color: FILM_COLORS2.gold, opacity: interpolate(frame, [138, 150], [0, 0.9], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}> · 热度榜 #6</span>
            </div>
            {/* 末 30f 掀角（右下角翻起：深色折面 + 琥珀折痕光） */}
            <div
              style={{
                position: 'absolute',
                right: 0,
                bottom: 0,
                width: 200,
                height: 160,
                background: FILM_COLORS2.spaceDeep,
                opacity: corner,
                clipPath: `polygon(100% 0, 100% 100%, 0 100%)`,
                transform: `rotate(${corner * 0.5}deg)`,
              }}
            />
            <div
              style={{
                position: 'absolute',
                right: 0,
                bottom: 0,
                width: 200,
                height: 160,
                background: `linear-gradient(315deg, rgba(212,163,115,0.24), rgba(212,163,115,0.04))`,
                opacity: corner,
                clipPath: `polygon(100% 0, 0 100%, 100% 100%)`,
                boxShadow: `-6px -6px 18px rgba(0,0,0,0.35)`,
              }}
            />
          </div>
        </AbsoluteFill>
      </CameraRig>
      <HudChrome label="wuh.site · POST #37" readout={frame >= 138 ? 'READS 1,160' : '2022 · WARM-UP'} />
      <Grade2 id="GR2-03" />
      <Caption text="2022 年 2 月，他写《2022 年度总结》：『不要停步不前，每一天都要做出一点改变。』" appearAt={14} />
    </AbsoluteFill>
  );
};

export default S13;
