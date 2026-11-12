/* S40 · Act 6 入院 · 局部帧 [0,60) · 60f · 绝对 5494–5554
 *
 * V3 内容本体化重做（2026-11-12 审计返工单：漫游连击 2/5 —— /music 页数据件主场）：
 * 网站截图全删（页面快照零引用，§3 全片禁截图），主角 = DATA.playsAi 播放大数字
 * + 黑胶微缩件。与 s39–s43 同一巡礼快切连拍，共享巡礼轨道（Rail 八块面板，亮块/光标逐镜推进：
 * 本镜 01–07 亮、光标驻 08 位 0.2；s41→0.5；s42→0.8；s43 点亮第 8 块收官）。
 * 编排四问：
 *  承接：首帧 = s39 交出的「漫游中·卡 1 过」——漫游动势不停，光标演员自右缘扫入延续横向漫游；
 *  触发：光标演员（琥珀光点）第 8f 点击画面中心 → 播放大数字受命开滚、黑胶微缩件受命入场（点击=主动作）；
 *  展开：帧级节奏表（见下）——bigNum 滚动落定（SLAM+辉光 token 自带）→ 落定瞬间 shockwave 双环
 *        + sparkBurst 金粒 + sheenSweep 金光 → 黑胶微缩件 springIn 弹入（vinylSpin 匀速+唱臂 needleSettle）；
 *  交接：尾帧整组随漫游横向余速缓移（/music 卡过、/guestbook 卡入场在即），黑胶转不停=微动不断。
 * 逐拍帧表（fps=30）：
 *  [0–8]   光标自右缘 (1780,840) 疾扫至 (960,330)；Rail 亮块 01–07 / 光标 08（0.2 位）；
 *  [8]     点击 ripple（点燃主角）；
 *  [8–42]  bigNum 0→7,920（DATA.playsAi）滚动 34f，落定 42；
 *  [42]    落定瞬间：shockwave 琥珀双环 + sparkBurst('s40-burst') 金粒 + sheenSweep(42,12)；
 *  [42–58] HUD readout ROLLING… → 7,920 PLAYS；黑胶微缩件 springIn(44) 弹入（位移入场）；
 *  [52–60] 尾帧交接：整组 translateX 余速 -26px，黑胶 vinylSpin 转不停。
 * 时间轴零改动：60f / 无字幕（漫游连击）/ endFrameDesc「/music 卡过、/guestbook 卡入场在即」语义原样；
 * 无 <Sequence>；random(seed) only；springIn fps 取 useVideoConfig；色板只用 FILM_COLORS2 族。
 * 转场：入「切」，出「切」。镜内文字最低点 y≈790 < 930（bottom 150px 安全线之上）。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { CURVES } from '../../../brand/motion';
import {
  bigNum,
  FILM_COLORS2,
  fmtNum,
  glowText,
  handheld,
  inkCursor,
  needleSettle,
  sheenSweep,
  shockwave,
  sparkBurst,
  springIn,
  vinylSpin,
} from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';

const TOTAL = 60;
const ROLL_START = 8;
const ROLL_DUR = 34;
const LAND_AT = ROLL_START + ROLL_DUR; // 42
const CLAMP = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const RAIL_PITCH = 74;
const CURSOR_FROM = { x: 1780, y: 840 };
const CURSOR_TO = { x: 960, y: 330 };

/** V2 模块轨道（巡礼共享语言，与 s37/s38 同款式）——交接态语义同 s30 */
const Rail: FC<{ lit: number; at: number; cursorP: number; frame: number }> = ({ lit, at, cursorP, frame }) => (
  <div style={{ position: 'absolute', left: '50%', top: 92, width: 582, marginLeft: -291, zIndex: 26 }}>
    <div style={{ display: 'flex', gap: 10 }}>
      {Array.from({ length: 8 }).map((_v, i) => {
        const n = i + 1;
        const on = n <= lit;
        const active = n === at && on;
        return (
          <div key={n} style={{ width: 64 }}>
            <div
              style={{
                textAlign: 'center',
                fontFamily: fontFamilies.mono,
                fontSize: 13,
                letterSpacing: '0.18em',
                color: on ? FILM_COLORS2.data : n === at ? FILM_COLORS2.gold : FILM_COLORS2.textMuted,
                opacity: on ? 0.95 : n === at ? 0.9 : 0.5,
                ...(active ? glowText(FILM_COLORS2.data, 0.4 + 0.15 * Math.sin(frame / 6)) : {}),
              }}
            >
              {String(n).padStart(2, '0')}
            </div>
            <div style={{ marginTop: 6, height: 3, borderRadius: 2, background: on ? FILM_COLORS2.data : FILM_COLORS2.line, boxShadow: on ? `0 0 8px rgba(212,163,115,${active ? 0.4 + 0.2 * Math.sin(frame / 6) : 0.45})` : 'none', opacity: on ? 1 : 0.5 }} />
          </div>
        );
      })}
    </div>
    {at > lit ? (
      <div style={{ position: 'absolute', top: 14, left: (at - 1) * RAIL_PITCH - 14 + cursorP * 8, width: 0, height: 0, borderTop: '5px solid transparent', borderBottom: '5px solid transparent', borderLeft: `7px solid ${FILM_COLORS2.gold}`, opacity: 0.9, filter: 'drop-shadow(0 0 6px rgba(212,163,115,0.6))' }} />
    ) : null}
  </div>
);

const S40: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  /* 主角大数字（8–42 滚动） */
  const hero = bigNum(frame, ROLL_START, ROLL_DUR, 0, 7920);
  /* 落定瞬间（42）：琥珀双环 + 金粒 */
  const wave = shockwave(frame, LAND_AT, '212,163,115');
  const burst = sparkBurst('s40-burst', frame, LAND_AT, 16, true);
  /* 光标演员：0–8 自右缘疾扫，8 点击 ripple，18–26 退场 */
  const cursor = inkCursor(frame, CURSOR_FROM, CURSOR_TO, 0, 8, 8);
  const dotOpacity = typeof cursor.dot.opacity === 'number' ? cursor.dot.opacity : 1;
  const cursorFade = interpolate(frame, [18, 26], [1, 0], CLAMP);
  /* 黑胶微缩件（44 弹入）：唱臂微摆 + 盘面匀速转 */
  const vinylIn = springIn(frame, 44, fps, 15, 190, 0.8);
  const armDeg = 18 + needleSettle(frame, 44, 2);
  /* 尾帧交接：整组横向余速（52–60） */
  const drift = interpolate(frame, [52, TOTAL], [0, -26], CLAMP);
  /* CameraRig：缓推 + handheld 微动不断 */
  const shake = handheld('s40-cam', frame, 0.8);
  const cam = {
    scale: interpolate(frame, [0, TOTAL], [1.04, 1.02], { ...CLAMP, easing: CURVES.cineEaseInOut }),
    x: shake.dx,
    y: shake.dy,
    rot: shake.rot,
  };

  return (
    <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep }}>
      <DeepSpace seed="s40v2" stars={52} grid horizon />
      <CameraRig cam={cam}>
        <AbsoluteFill>
          <div style={{ position: 'absolute', inset: 0, transform: `translateX(${drift}px)`, zIndex: 28 }}>
            {/* 小标键位 */}
            <div style={{ position: 'absolute', left: 0, right: 0, top: 150, textAlign: 'center', zIndex: 30, ...glowText(FILM_COLORS2.textMuted, 0.12) }}>
              <span style={{ fontFamily: fontFamilies.mono, fontSize: 15, letterSpacing: '0.4em', color: FILM_COLORS2.textMuted }}>ROAM · /MUSIC · PLAYS</span>
            </div>

            {/* 主角：全屏大数字 0→7,920（8–42 滚动；42 落定 SLAM 辉光 + 金光扫过） */}
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 200,
                textAlign: 'center',
                zIndex: 30,
                fontFamily: fontFamilies.mono,
                fontSize: 240,
                fontWeight: 700,
                lineHeight: 1.05,
                color: FILM_COLORS2.data,
                fontVariantNumeric: 'tabular-nums',
                letterSpacing: '0.02em',
                opacity: interpolate(frame, [ROLL_START, ROLL_START + 12], [0, 1], CLAMP),
                transform: `translateY(${interpolate(frame, [ROLL_START, ROLL_START + 14], [-18, 0], CLAMP)}px) scale(${hero.slam})`,
                ...glowText(FILM_COLORS2.data, hero.glow),
              }}
            >
              {hero.text}
              <div style={sheenSweep(frame, LAND_AT, 12)} />
            </div>
            <div style={{ position: 'absolute', left: 0, right: 0, top: 470, textAlign: 'center', zIndex: 30 }}>
              <span style={{ fontFamily: fontFamilies.mono, fontSize: 18, letterSpacing: '0.5em', color: FILM_COLORS2.textMuted, opacity: interpolate(frame, [LAND_AT, LAND_AT + 10], [0, 0.9], CLAMP) }}>次播放 · 八年年度歌单</span>
            </div>

            {/* 落定瞬间（42）：双环 + 金粒锚在大数字视觉中心（top 200+132≈332，水平居中） */}
            {frame >= LAND_AT ? (
              <div style={{ position: 'absolute', left: '50%', top: 332, width: 0, height: 0, zIndex: 30, pointerEvents: 'none' }}>
                {wave ? <div style={wave.ring1} /> : null}
                {wave ? <div style={wave.ring2} /> : null}
                {burst.map((p, i) => (
                  <div key={i} style={p.style} />
                ))}
              </div>
            ) : null}

            {/* 黑胶微缩件（44 springIn 弹入；vinylSpin 匀速转 + 唱臂 needleSettle 微摆） */}
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: 530,
                width: 190,
                height: 190,
                marginLeft: -95,
                zIndex: 29,
                opacity: Math.min(1, vinylIn * 1.5),
                transform: `translateY(${(1 - vinylIn) * 34}px) scale(${0.9 + vinylIn * 0.1})`,
              }}
            >
              <div style={{ position: 'absolute', inset: 0, borderRadius: 95, border: `1.5px solid ${FILM_COLORS2.line}`, background: FILM_COLORS2.panel, boxShadow: `0 0 26px rgba(212,163,115,0.16)` }} />
              {[74, 54, 36].map((r, i) => (
                <div key={r} style={{ position: 'absolute', left: 95 - r, top: 95 - r, width: r * 2, height: r * 2, borderRadius: r, border: `1px solid ${FILM_COLORS2.grid}`, opacity: 0.55 - i * 0.12 }} />
              ))}
              {/* 旋转层：盘面高光点随盘匀速转（FN-26 vinylSpin 物理匀速例外） */}
              <div style={{ position: 'absolute', inset: 0, transform: `rotate(${vinylSpin(frame)}deg)` }}>
                <div style={{ position: 'absolute', left: 95 - 3, top: 14, width: 6, height: 6, borderRadius: 3, background: FILM_COLORS2.data, boxShadow: `0 0 8px rgba(212,163,115,0.6)` }} />
              </div>
              <div style={{ position: 'absolute', left: 88, top: 88, width: 14, height: 14, borderRadius: 7, background: FILM_COLORS2.gold, boxShadow: `0 0 10px rgba(233,217,174,0.55)` }} />
              {/* 唱臂（右上枢轴） */}
              <div style={{ position: 'absolute', right: 10, top: 8, width: 4, height: 118, borderRadius: 2, background: FILM_COLORS2.dataDim, transformOrigin: 'top center', transform: `rotate(${armDeg}deg)`, boxShadow: `0 0 8px rgba(212,163,115,0.3)` }} />
            </div>
          </div>

          {/* 光标演员（0–26）：疾扫 + 点击 ripple 点燃主角 */}
          <div style={{ ...cursor.dot, opacity: dotOpacity * cursorFade, zIndex: 33 }} />
          {frame >= 8 && cursor.ripple < 1 ? (
            <div
              style={{
                position: 'absolute',
                left: CURSOR_TO.x - (10 + cursor.ripple * 46),
                top: CURSOR_TO.y - (10 + cursor.ripple * 46),
                width: 20 + cursor.ripple * 92,
                height: 20 + cursor.ripple * 92,
                borderRadius: '50%',
                border: `2px solid ${FILM_COLORS2.data}`,
                opacity: (1 - cursor.ripple) * 0.7,
                zIndex: 33,
              }}
            />
          ) : null}
        </AbsoluteFill>
      </CameraRig>

      <Rail lit={7} at={8} cursorP={0.2} frame={frame} />
      <HudChrome label="wuh.site · ROAM" readout={frame >= LAND_AT ? `02/05 · /MUSIC · ${fmtNum(7920)} PLAYS` : '02/05 · /MUSIC · ROLLING…'} />
      <Grade2 id="GR2-06" />
    </AbsoluteFill>
  );
};

export default S40;
