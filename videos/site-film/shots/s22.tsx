/* 镜 22 · Act 4 产品巡礼 · 全局帧 [3480,3630) · 150f */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, GRADES, inkRise } from '../motion-tokens';
import { CameraRig, ParallaxLayer } from '../components/CameraRig';
import type { CamState } from '../components/CameraRig';
import { DustField } from '../components/DustField';

const serif = fontFamilies.serif;

const fade = (f: number, at: number) =>
  interpolate(f, [at, at + 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

/* 音乐年轮：年份刻度带 orbit-drift（按角距缩放缩淡）+ 巨型年份水印 6% 视差（dof-parallax），
   cam-orbit 环绕弧线；真实年度最爱（wuh.site /api/music 八年歌单播放之最，2026-10-25 抓取）；出场 tr-vinyl-swap（rotate −120° 交叉溶解 镜局部 131–150）
   （原 Act4 镜 22，幕局部 680–830 → 镜局部 0–150；const f = frame - 680 换算为 const f = frame） */
const YEAR_FAVS: Array<[string, string, string]> = [
  ['2018', '诱惑的街 (Live)', '林志炫'],
  ['2019', '腻味', '金玟岐'],
  ['2020', '少年不凡', '刘美麟'],
  ['2021', '风月缠绵（金风玉露变奏）', '陈致逸'],
  ['2022', '归期', '钱润玉'],
  ['2023', '爱意 (金风玉露变奏)', '陈致逸'],
  ['2024', '爱意 (金风玉露变奏)', '陈致逸'],
  ['2025', '爱意 (金风玉露变奏)', '陈致逸'],
];

const ShotYearRing: FC = () => {
  const frame = useCurrentFrame();
  const grade = GRADES[3];
  const f = frame; // 0–150
  // 聚焦 4 个代表年 × 每年 32f（约 1.1s，看清为止）；环形刻度仍展示全部 8 年
  const FEATURED: Array<[string, string, string]> = [
    ['2018', '诱惑的街 (Live)', '林志炫'],
    ['2021', '风月缠绵（金风玉露变奏）', '陈致逸'],
    ['2022', '归期', '钱润玉'],
    ['2025', '爱意 (金风玉露变奏)', '陈致逸'],
  ];
  const active = Math.min(Math.floor(f / 32), FEATURED.length - 1); // 每 32f 一年
  const winStart = active * 32;
  const [selYear, selSong, selArtist] = FEATURED[active];
  const songIn = interpolate(f - winStart, [0, 8, 24, 32], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const swap = interpolate(f, [131, 150], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const cam: CamState = { scale: 1, x: Math.sin(f / 40) * 60, y: 0, rot: Math.sin(f / 50) * 1.2 };
  return (
    <AbsoluteFill>
      <DustField act={4} />
      <AbsoluteFill>
        <CameraRig cam={cam}>
          {/* 巨型年份水印（远层视差，随选中年轮换） */}
          <ParallaxLayer depth={0.4} cam={cam} blurBase={1}>
            <p style={{ ...inkRise(f, 10), position: 'absolute', left: '50%', top: '38%', transform: 'translate(-50%,-50%)', fontFamily: serif, fontSize: 210, color: colors.paper, opacity: 0.06, margin: 0 }}>{selYear}</p>
          </ParallaxLayer>
          <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ position: 'relative', width: 900, height: 420, transform: `rotate(${-swap * 120}deg)`, opacity: 1 - swap }}>
              {YEAR_FAVS.map(([y], i) => {
                const theta = (i / YEAR_FAVS.length) * Math.PI * 2 - Math.PI / 2 + f * 0.003;
                const front = (Math.sin(theta) + 1) / 2; // 0 远 → 1 近
                const sel = y === selYear;
                return (
                  <p key={y} style={{ position: 'absolute', left: 450 + Math.cos(theta) * 380, top: 210 + Math.sin(theta) * 150, transform: `translate(-50%,-50%) scale(${sel ? 1.5 : 0.6 + front * 0.5})`, fontFamily: serif, fontSize: sel ? 64 : 34, color: sel ? colors.accent : colors.paper, opacity: sel ? 1 : 0.25 + front * 0.35, margin: 0 }}>{y}</p>
                );
              })}
            </div>
            {/* 选中年的真实最爱 */}
            <p style={{ position: 'absolute', bottom: 178, width: '100%', textAlign: 'center', fontFamily: serif, fontSize: 30, color: colors.accent, opacity: songIn * (1 - swap), margin: 0 }}>
              《{selSong}》 — {selArtist}
            </p>
          </AbsoluteFill>
        </CameraRig>
        <p style={{ position: 'absolute', bottom: 100, width: '100%', textAlign: 'center', fontFamily: serif, fontSize: 32, color: colors.paper, opacity: fade(f, 24) * (1 - swap) }}>时间的年轮，刻着每一年的歌</p>
      </AbsoluteFill>
      {/* 幕级调色 overlay（原 Act4 全屏层分解入镜）：grade-warm-gold LUT + 雾光 */}
      <AbsoluteFill style={{ background: grade.lut.color, mixBlendMode: grade.lut.blend, opacity: grade.lut.opacity }} />
      <AbsoluteFill style={{ background: grade.veil.color, mixBlendMode: grade.veil.blend, opacity: grade.veil.opacity }} />
    </AbsoluteFill>
  );
};

export default ShotYearRing;
