/* S09 · Act 2 旧屋 · 局部帧 [0,204) · 204f · 绝对 1140–1344
 *
 * V3 批次 A 重做（2026-11-12 六门验收 + 审计返工单 · 审计重定义：《搬山计划》金句 =
 * kineticChars 逐字，s29 同款）：
 * 【承接】首帧承接 s08 尾帧交出的「Docker/Nginx 双牌并亮 + 设计稿沉底」——遮罩揭开
 *         （0–14 spaceDeep + 推界光缝），手艺换装完毕，该动笔写宣言了。
 * 【触发】主动作 = 「工位」「生活」两块数据堆推上同一张桌面（30–70 原窗），竖排标题
 *         《搬山计划》kineticChars 逐字钉落（62 起 4f/字，末字 80=绝对 1220=拍61 对音落定，
 *         絕不动），随后宣言三行逐字弹入（100/130/160 原窗起点，step 2.5f/字）。
 * 【展开】逐拍帧表（局部帧，fps=30）：
 *   [0–14]    遮罩入场（spaceDeep 揭开 + 推界琥珀光缝；handheld('s09-cam',1.2)）；
 *   [30–70]   左「工位」右「生活」两块线框数据堆推向画心并排（push 位移，工作与生活同桌）；
 *   [62–80]   竖排标题《搬山计划》kineticChars 逐字（serif 64 paperWhite，末字 80=拍61 落定）；
 *   [100–122] 宣言 L1『除了工作就是工作，』kineticChars（step 2.5f/字）；
 *   [130–160] L2『是时候做出一点点改变了，』kineticChars；
 *   [160–175] L3『去玩生活去』kineticChars，落定辉光呼吸（token 自带）；
 *   [184–204] 桌角笔电数据窗掀盖、琥珀屏光微亮（184–196 原窗）——尾帧交接态。
 * 【交接】尾帧 = 宣言落定、桌角笔电掀盖屏幕微亮（manifest endFrameDesc：宣言落定，桌角
 *         一台合着的笔电被掀开、屏幕微亮）→ 交 s10「TypeScript 重写」的代码数据件。
 * 意义一句话：两摞生活与工作被推上同一张桌，一篇《搬山计划》逐字立誓——把山搬开。
 * 时间轴零改动：204f / 遮罩 0–14 / 推移 30–70 / 标题末字 80（对音）/ 宣言 100/130/160 / 笔电 184–204 / Caption（appearAt 104 · bottom 110）原样。
 * 转场：入「纸翻」出「切」→ ShotShell 光晕呼吸，镜文件零工作。字幕安全窗：start≥104（Caption bottom 110）、end≤192。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { CURVES } from '../../../brand/motion';
import { FILM_COLORS2, dataCurtain, handheld, kineticChars } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { Caption } from '../components/Caption';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';

const TOTAL = 204;
const TITLE_LAND = 80; // 标题末字落定 = 绝对 1220 = 拍61（对音，絕不动）
const KINETIC_STEP = 2.5; // 宣言逐字步进（s29 同款）
/** 宣言原文原样；start = 原文件 write-fade 窗（100/130/160 原样承接为 kinetic 锚点） */
const QUOTE_LINES = [
  { text: '『除了工作就是工作，', start: 100 },
  { text: '是时候做出一点点改变了，', start: 130 },
  { text: '去玩生活去』', start: 160 },
];

const S09: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const hh = handheld('s09-cam', frame, 1.2);
  const drop = interpolate(frame, [0, 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  const cam = {
    scale: interpolate(frame, [0, TOTAL], [1.1, 1.02], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }),
    x: hh.dx,
    y: interpolate(frame, [18, 60], [0, 40], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }) + hh.dy,
    rot: hh.rot,
  };
  // 两摞数据堆推移（30–70）：左堆右移、右堆左移，到画心并排
  const push = interpolate(frame, [30, 70], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  // 竖排标题逐字（62 起 4f/字 → 末字 80=拍61 落定）
  const titleChars = kineticChars('搬山计划', frame, 62, 4, fps, 0.55);
  // 笔电数据窗掀盖、屏光微亮（184–204，尾帧交接）
  const laptop = interpolate(frame, [184, TOTAL], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  const rain = dataCurtain('s09-rain', frame, 6, 100);

  return (
    <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep }}>
      <DeepSpace seed="s09v2" stars={42} grid />
      {/* 数字雨帘（背景氛围层） */}
      <AbsoluteFill>
        {rain.map((c, i) => (
          <span key={`rain-${i}`} style={{ position: 'absolute', left: `${c.x}%`, top: c.y, fontFamily: fontFamilies.mono, fontSize: 14, color: FILM_COLORS2.dataDim, opacity: c.o, fontVariantNumeric: 'tabular-nums' }}>
            {c.text}
          </span>
        ))}
      </AbsoluteFill>
      <CameraRig cam={cam}>
        <AbsoluteFill>
          {/* 左：工位数据堆（右移到画心） */}
          <div style={{ position: 'absolute', left: 300 + push * 190, top: 420, width: 300 }}>
            <div style={{ position: 'absolute', left: 0, top: 0, width: 280, height: 200, borderRadius: 8, background: FILM_COLORS2.panel, border: `1px solid ${FILM_COLORS2.line}`, boxShadow: `0 0 24px rgba(212,163,115,0.1), 0 14px 30px rgba(0,0,0,0.45)` }}>
              {[0, 1, 2].map((i) => (
                <div key={`wrow-${i}`} style={{ position: 'absolute', left: 24, top: 34 + i * 44, width: 200 - i * 30, height: 10, background: FILM_COLORS2.paperWhite, opacity: 0.2 }} />
              ))}
              <span style={{ position: 'absolute', right: 20, bottom: 16, fontFamily: fontFamilies.mono, fontSize: 12, letterSpacing: '0.24em', color: FILM_COLORS2.dataDim }}>WORK · ISSUES</span>
            </div>
            <span style={{ position: 'absolute', left: 20, top: -40, fontFamily: fontFamilies.mono, fontSize: 16, color: FILM_COLORS2.textMuted, letterSpacing: '0.3em' }}>工 位</span>
          </div>

          {/* 右：生活数据堆（左移到画心） */}
          <div style={{ position: 'absolute', left: 1300 - push * 190, top: 420, width: 320 }}>
            <div style={{ position: 'absolute', left: 30, top: 0, width: 250, height: 200, borderRadius: 8, background: FILM_COLORS2.panel, border: `1px solid ${FILM_COLORS2.line}`, boxShadow: `0 0 24px rgba(212,163,115,0.1), 0 14px 30px rgba(0,0,0,0.45)` }}>
              <div style={{ position: 'absolute', left: 24, top: 30, width: 24, height: 24, borderRadius: 12, background: FILM_COLORS2.gold, opacity: 0.5, boxShadow: `0 0 16px 4px rgba(233,217,174,0.3)` }} />
              {[0, 1].map((i) => (
                <div key={`lrow-${i}`} style={{ position: 'absolute', left: 66, top: 36 + i * 24, width: 140 - i * 40, height: 9, background: FILM_COLORS2.paperWhite, opacity: 0.2 }} />
              ))}
              {/* 呼吸光点一线（原茶盏热气的数据版） */}
              <div style={{ position: 'absolute', right: 30, bottom: 22, width: 2, height: 40, background: `linear-gradient(180deg, transparent, ${FILM_COLORS2.data})`, opacity: 0.4 + Math.sin(frame / 30) * 0.12 }} />
              <span style={{ position: 'absolute', left: 24, bottom: 16, fontFamily: fontFamilies.mono, fontSize: 12, letterSpacing: '0.24em', color: FILM_COLORS2.dataDim }}>LIFE · MOMENTS</span>
            </div>
            <span style={{ position: 'absolute', left: 50, top: -40, fontFamily: fontFamilies.mono, fontSize: 16, color: FILM_COLORS2.textMuted, letterSpacing: '0.3em' }}>生 活</span>
          </div>

          {/* 竖排标题《搬山计划》（kineticChars 62 起 4f/字，末字 80=拍61 落定） */}
          <div
            style={{
              position: 'absolute',
              left: 790,
              top: 130,
              writingMode: 'vertical-rl',
              fontFamily: fontFamilies.serif,
              fontSize: 64,
              color: FILM_COLORS2.paperWhite,
              letterSpacing: '0.28em',
            }}
          >
            {titleChars.map((k, i) => (
              <span key={`t-${i}`} style={k.style}>
                {k.ch}
              </span>
            ))}
          </div>

          {/* 宣言金句 kineticChars 逐字（100/130/160 原窗起点，step 2.5f/字） */}
          <div style={{ position: 'absolute', left: 460, top: 660, zIndex: 30 }}>
            {QUOTE_LINES.map((line, i) => (
              <div key={`q-${i}`} style={{ marginBottom: 14, minHeight: 42 }}>
                {kineticChars(line.text, frame, line.start, KINETIC_STEP, fps, 0.5).map((k, ci) => (
                  <span
                    key={`qc-${ci}`}
                    style={{
                      ...k.style,
                      fontFamily: fontFamilies.serif,
                      fontSize: 42,
                      color: FILM_COLORS2.paperWhite,
                      opacity: Math.min(0.94, Number(k.style.opacity ?? 1)),
                    }}
                  >
                    {k.ch}
                  </span>
                ))}
              </div>
            ))}
          </div>

          {/* 桌角笔电数据窗掀盖（184–204，琥珀屏光微亮——尾帧交接态） */}
          <div style={{ position: 'absolute', left: 1280, top: 700, width: 380, height: 160, opacity: interpolate(frame, [184, 196], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>
            <div style={{ position: 'absolute', left: 20, top: 0, width: 340, height: 10, borderRadius: 3, background: FILM_COLORS2.line, opacity: 0.9, transform: `perspective(800px) rotateX(${(1 - laptop) * -70}deg)`, transformOrigin: 'bottom center', boxShadow: `0 0 12px rgba(212,163,115,0.25)` }} />
            <div style={{ position: 'absolute', left: 0, top: 10, width: 380, height: 12, borderRadius: 4, background: FILM_COLORS2.panel, border: `1px solid ${FILM_COLORS2.line}` }} />
            {frame >= 196 ? <div style={{ position: 'absolute', left: 30, top: -74, width: 320, height: 84, background: FILM_COLORS2.data, opacity: laptop * 0.14, filter: 'blur(12px)' }} /> : null}
          </div>
        </AbsoluteFill>
      </CameraRig>

      {/* 遮罩入场（0–14 承接语汇；spaceDeep 揭开 + 推界琥珀光缝） */}
      {frame < 15 ? (
        <>
          <AbsoluteFill style={{ pointerEvents: 'none', background: FILM_COLORS2.spaceDeep, clipPath: `inset(0 0 ${(1 - drop) * 100}% 0)` }} />
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: `${(1 - drop) * 100}%`,
              height: 3,
              background: FILM_COLORS2.data,
              opacity: 0.7,
              boxShadow: `0 0 20px 6px rgba(212,163,115,0.4)`,
              pointerEvents: 'none',
            }}
          />
        </>
      ) : null}

      <HudChrome label="wuh.site · PLAN" readout={frame >= TITLE_LAND ? 'MAY 2021 · 搬山计划' : 'DESK · WORK+LIFE'} />
      <Grade2 id="GR2-02" />
      <Caption text="五月，他写《搬山计划》：『除了工作就是工作，是时候做出一点点改变了，去玩生活去』" appearAt={104} bottom={110} />
    </AbsoluteFill>
  );
};

export default S09;
