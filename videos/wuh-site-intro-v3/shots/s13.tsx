/* S13 · Act 3 第一行 · 局部帧 [0,180) · 180f · 绝对 1962–2142
 *
 * 暖句垫底：灰纸上暖句逐字浮出（衬线，逐字 write-fade），「每一天都要做出一点改变」
 * 半句处纸面透出一点暖金；右下极小字「#37 · 2022」（标识）；
 * 页面角落画面小字「现 1,160 阅读 · 热度榜 #6」——★DAT-01 微滚
 * （118–138，落定 138=绝对 2100=拍105 静默；量滚，「热度榜 #6」标识落位即现）
 * ——多年后，它仍在被读；末 30f 灰纸被掀起一角（画面动作，机位不动）。
 * 转场：入「切」，出「切」。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, writeFade } from '../../../brand/motion';
import { FILM_COLORS, numRoll, ROLL_DUR } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { Caption } from '../components/Caption';
import { DustField } from '../components/DustField';
import { Grade } from '../components/Grade';
import { PaperGrain } from '../components/PaperGrain';

const TOTAL = 180;
const WARM_FROM = 17; // 「每一天…」半句起的字符位（暖金起点）

const S13: FC = () => {
  const frame = useCurrentFrame();
  const cam = { scale: 1.05, x: 0, y: 0, rot: 0 };
  // 逐字浮出：全句 44 字符，12f 起每字 3.3f
  const captionText = '2022 年 2 月，他写《2022 年度总结》：『不要停步不前，每一天都要做出一点改变。』';
  // ★DAT-01 微滚（118–138 落定=拍105）
  const views = Math.round(numRoll(frame, 118, ROLL_DUR.micro, 1100, 1160));
  const cornerIn = writeFade(frame, 118);
  // 末 30f 灰纸掀起一角（150–180）
  const corner = interpolate(frame, [150, TOTAL], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <CameraRig cam={cam}>
        <AbsoluteFill>
          <DustField act={3} count={12} seedBase="s13" />
          {/* 灰纸（承接上镜整版） */}
          <div style={{ position: 'absolute', left: 170, top: 90, right: 170, bottom: 90, borderRadius: 6, background: colors.paper, border: `1px solid ${colors.paperMuted}`, overflow: 'hidden' }}>
            <div style={{ position: 'absolute', left: 50, top: 40, fontFamily: fontFamilies.mono, fontSize: 20, color: colors.muted, fontVariantNumeric: 'tabular-nums' }}>2022-02-08</div>
            <div style={{ position: 'absolute', left: 50, right: 50, top: 110, height: 1, background: colors.muted, opacity: 0.4 }} />
            {/* 暖句逐字浮出（衬线大字；「每一天…」起透暖金） */}
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
                      color: warm ? FILM_COLORS.lampAmber : colors.ink,
                      whiteSpace: 'pre',
                    }}
                  >
                    {ch}
                  </span>
                );
              })}
            </div>
            {/* 右下极小字出处（标识） */}
            <div style={{ position: 'absolute', right: 60, bottom: 44, fontFamily: fontFamilies.mono, fontSize: 15, color: colors.muted, opacity: 0.7 }}>#37 · 2022</div>
            {/* 页面角落画面小字：现 1,160 阅读 · 热度榜 #6（量滚 + 标识落位即现） */}
            <div style={{ position: 'absolute', left: 60, bottom: 44, ...cornerIn }}>
              <span style={{ fontFamily: fontFamilies.mono, fontSize: 17, color: colors.muted, fontVariantNumeric: 'tabular-nums' }}>
                现 {views.toLocaleString('en-US')} 阅读
              </span>
              <span style={{ fontFamily: fontFamilies.mono, fontSize: 17, color: colors.gold, opacity: interpolate(frame, [138, 150], [0, 0.9], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}> · 热度榜 #6</span>
            </div>
            {/* 末 30f 掀角（右下角翻起） */}
            <div
              style={{
                position: 'absolute',
                right: 0,
                bottom: 0,
                width: 200,
                height: 160,
                background: colors.bg,
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
                background: `linear-gradient(315deg, ${colors.paperDeep}, ${colors.paper})`,
                opacity: corner,
                clipPath: `polygon(100% 0, 0 100%, 100% 100%)`,
                boxShadow: '-6px -6px 18px rgba(0,0,0,0.14)',
              }}
            />
          </div>
        </AbsoluteFill>
      </CameraRig>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 300, backgroundImage: `linear-gradient(180deg, transparent, ${colors.bg})`, opacity: 0.22 }} />
      <PaperGrain opacity={0.07} />
      <Grade id="GR-05" />
      <Caption text="2022 年 2 月，他写《2022 年度总结》：『不要停步不前，每一天都要做出一点改变。』" appearAt={14} />
    </AbsoluteFill>
  );
};

export default S13;
