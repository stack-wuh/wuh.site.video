/* v12 · 3D 水墨舞台：把 three.js 的一次渲染包成 Remotion 的一帧
 *
 * 为什么不用 @react-three/fiber：这里只需要「每帧同步渲染一次并交给截图」，
 * 手写 three 更可控，也少一层依赖。渲染管线的三 pass：
 *   ① beauty：正式材质（水墨 InkMaterial）
 *   ② normal：MeshNormalMaterial 覆盖渲染（给描边用）
 *   ③ composite：体积雾 + 描边 + 墨晕 + 纸纹（inkPost.ts）
 *
 * 用法：
 *   <InkStage build={({ scene, camera, matcap, paper }) => (frame) => { ...animate... }} />
 */
import type { FC } from 'react';
import { useLayoutEffect, useRef, useState } from 'react';
import { AbsoluteFill, continueRender, delayRender, staticFile, useCurrentFrame } from 'remotion';
import * as THREE from 'three';
import { makeInkPost } from './inkPost';
import { proceduralMatcap, proceduralPaper } from './inkShader';

export type InkStageCtx = {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  matcap: THREE.Texture;
  paper: THREE.Texture;
  /** 已加载好的场景贴图（AI 出的），缺失时给程序化兜底 */
  tex: Record<string, THREE.Texture>;
};

export type InkStageProps = {
  /** 每帧调用的动画函数；返回的 update 会在本帧渲染前执行 */
  build: (ctx: InkStageCtx) => (frame: number) => void;
  /** 需要在初始化时加载的贴图（public 下的路径，如 /zhi-guo-xiang/three/ink-matcap.png） */
  textures?: string[];
  fogDensity?: number;
  fogHeight?: number;
  edgeStrength?: number;
  bleed?: number;
  vignette?: number;
  background?: string;
};

const texLoader = new THREE.TextureLoader();

export const InkStage: FC<InkStageProps> = ({
  build,
  textures = [],
  fogDensity = 0.035,
  fogHeight = 2.2,
  edgeStrength = 0.9,
  bleed = 0.7,
  vignette = 0.85,
  background,
}) => {
  const frame = useCurrentFrame();
  const holder = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const updateRef = useRef<((f: number) => void) | null>(null);
  const postRef = useRef<THREE.ShaderMaterial | null>(null);
  const beautyRef = useRef<THREE.WebGLRenderTarget | null>(null);
  const normalRef = useRef<THREE.WebGLRenderTarget | null>(null);
  const quadRef = useRef<THREE.Mesh | null>(null);
  const [ready, setReady] = useState(false);
  const [handle] = useState(() => delayRender('ink-3d-stage'));

  /* ── 初始化（只做一次）── */
  useLayoutEffect(() => {
    const el = holder.current;
    if (!el || rendererRef.current) return;
    const W = 1920;
    const H = 1080;
    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false, preserveDrawingBuffer: true });
    renderer.setPixelRatio(1);
    renderer.setSize(W, H, false);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    const canvas = renderer.domElement;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    el.appendChild(canvas);
    canvasRef.current = canvas;
    rendererRef.current = renderer;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(background ?? '#f5f0e8');
    const camera = new THREE.PerspectiveCamera(38, W / H, 0.5, 400);
    camera.position.set(0, 10, 26);
    camera.lookAt(0, 5, 0);

    const depthTex = new THREE.DepthTexture(W, H, THREE.UnsignedIntType);
    depthTex.format = THREE.DepthFormat;
    const beauty = new THREE.WebGLRenderTarget(W, H, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      depthTexture: depthTex,
      depthBuffer: true,
    });
    const normal = new THREE.WebGLRenderTarget(W, H, { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter });
    beautyRef.current = beauty;
    normalRef.current = normal;

    const sceneRefObj = scene;
    sceneRef.current = sceneRefObj;
    cameraRef.current = camera;

    /* 贴图：AI 出的优先；任何一张缺失都退回程序化兜底，管线不因缺图而挂 */
    const matcap0 = proceduralMatcap(256);
    const paper0 = proceduralPaper(512);
    const loaded: Record<string, THREE.Texture> = {};
    let pending = textures.length;
    const start = () => {
      const ctx: InkStageCtx = { renderer, scene, camera, matcap: loaded.matcap ?? matcap0, paper: loaded.paper ?? paper0, tex: loaded };
      const post = makeInkPost({
        beauty: beauty.texture,
        depth: depthTex,
        normal: normal.texture,
        paper: ctx.paper,
      });
      post.uniforms.uFogDensity.value = fogDensity;
      post.uniforms.uFogHeight.value = fogHeight;
      post.uniforms.uEdgeStrength.value = edgeStrength;
      post.uniforms.uBleed.value = bleed;
      post.uniforms.uVignette.value = vignette;
      post.uniforms.uResolution.value.set(W, H);
      post.uniforms.uPaperScale.value.set(7.5, 4.2);
      post.uniforms.uPaper.value = proceduralPaper(512);
      postRef.current = post;

      const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), post);
      quad.frustumCulled = false;
      quadRef.current = quad;
      updateRef.current = build(ctx);
      setReady(true);
      continueRender(handle);
    };
    if (!pending) start();
    textures.forEach((path) => {
      texLoader.load(
        staticFile(path),
        (t) => {
          t.colorSpace = THREE.SRGBColorSpace;
          t.wrapS = t.wrapT = THREE.RepeatWrapping;
          const key = path.split('/').pop()!.replace(/\.(png|jpg)$/, '');
          loaded[key] = t;
          pending -= 1;
          if (pending === 0) start();
        },
        undefined,
        () => {
          pending -= 1;
          if (pending === 0) start();
        },
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── 每帧渲染（同步，在 Remotion 截图前完成）── */
  useLayoutEffect(() => {
    if (!ready) return;
    const renderer = rendererRef.current!;
    const scene = sceneRef.current!;
    const camera = cameraRef.current!;
    const beauty = beautyRef.current!;
    const normal = normalRef.current!;
    const post = postRef.current!;
    const quad = quadRef.current!;

    updateRef.current?.(frame);

    // ① beauty
    renderer.setRenderTarget(beauty);
    renderer.clear();
    renderer.render(scene, camera);

    // ② normal
    const prevOverride = scene.overrideMaterial;
    scene.overrideMaterial = new THREE.MeshNormalMaterial();
    renderer.setRenderTarget(normal);
    renderer.clear();
    renderer.render(scene, camera);
    scene.overrideMaterial = prevOverride;

    // ③ composite
    post.uniforms.uTime.value = frame / 30;
    post.uniforms.uCameraPos.value.copy(camera.position);
    renderer.setRenderTarget(null);
    renderer.render(quadScene(quad), orthoCam());
  }, [frame, ready, quadRef, postRef]);

  return (
    <AbsoluteFill ref={holder} style={{ width: '100%', height: '100%' }}>
      {ready ? null : <AbsoluteFill style={{ background: background ?? '#f5f0e8' }} />}
    </AbsoluteFill>
  );
};

/* 合成用的正交小场景（常量，避免每帧新建） */
let _qScene: THREE.Scene | null = null;
let _oCam: THREE.OrthographicCamera | null = null;
const quadScene = (quad: THREE.Mesh): THREE.Scene => {
  if (!_qScene) {
    _qScene = new THREE.Scene();
    _qScene.add(quad);
  }
  return _qScene;
};
const orthoCam = (): THREE.OrthographicCamera => {
  if (!_oCam) _oCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  return _oCam;
};