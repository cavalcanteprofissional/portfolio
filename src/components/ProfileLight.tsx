import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { tgpu } from 'typegpu';
import type { TgpuRoot } from 'typegpu';
import { d } from 'typegpu';
import { useConsentStore } from '../stores/consentStore';
import { DepthRelightingRenderer, defaultRelightingSettings } from '../lib/typegpu/renderer';
import { DepthInferencePlan } from '../lib/typegpu/inference/depthart';
import { parseDepthBundle } from '../lib/typegpu/inference/bundle';
import { fetchModel, modelVariant, RECOMMENDED_MODEL } from '../lib/typegpu/model-store';
import { createLightController } from '../lib/typegpu/light-control';
import { MONO_FONT, BG_DARK_HSL } from '../lib/constants';

interface ProfileLightProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

const NEON_CYCLE_SPEED = 0.0008;

function neonColor(time: number): [number, number, number] {
  const hue = 210 + Math.sin(time * NEON_CYCLE_SPEED) * 40;
  const s = 0.85;
  const l = 0.55;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (hue < 60) { r = c; g = x; }
  else if (hue < 120) { r = x; g = c; }
  else if (hue < 180) { g = c; b = x; }
  else if (hue < 240) { g = x; b = c; }
  else if (hue < 300) { r = x; b = c; }
  else { r = c; b = x; }
  return [r + m, g + m, b + m];
}

const BOOT_LINES = [
  'POST... OK',
  'WebGPU driver loaded',
  'Depth estimation model',
  '  downloading ~13MB...',
];

export function ProfileLight({
  src,
  alt,
  className = '',
  width = 352,
  height = 384,
}: ProfileLightProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<TgpuRoot | null>(null);
  const rendererRef = useRef<DepthRelightingRenderer | null>(null);
  const planRef = useRef<DepthInferencePlan | null>(null);
  const lightRef = useRef(createLightController());
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef(performance.now());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [hasWebGPU, setHasWebGPU] = useState(true);
  const photoBitmapRef = useRef<ImageBitmap | null>(null);
  const hoveringRef = useRef(false);
  const mousePosRef = useRef({ x: 0.5, y: 0.5 });
  const consent = useConsentStore((s) => s.consent);

  useEffect(() => {
    if (!('gpu' in navigator)) {
      setHasWebGPU(false);
      return;
    }
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onEnter = () => { hoveringRef.current = true; };
    const onLeave = () => { hoveringRef.current = false; };
    const onWheel = (e: WheelEvent) => {
      if (!hoveringRef.current) return;
      e.preventDefault();
      lightRef.current.updateFromWheel(e.deltaY);
    };
    const onMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      mousePosRef.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      };
    };
    const onTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;
      const rect = el.getBoundingClientRect();
      mousePosRef.current = {
        x: (touch.clientX - rect.left) / rect.width,
        y: (touch.clientY - rect.top) / rect.height,
      };
    };

    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mouseleave', onLeave);
    el.addEventListener('wheel', onWheel, { passive: false });
    el.addEventListener('mousemove', onMouseMove);
    el.addEventListener('touchmove', onTouchMove, { passive: true });

    return () => {
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('mouseleave', onLeave);
      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('mousemove', onMouseMove);
      el.removeEventListener('touchmove', onTouchMove);
    };
  }, []);

  const initPipeline = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasWebGPU) return;

    let root: TgpuRoot | undefined;
    try {
      root = await tgpu.init({
        device: { optionalFeatures: ['shader-f16'] },
      });
      rootRef.current = root;

      const renderer = new DepthRelightingRenderer(root, canvas);
      await renderer.initAsync();
      rendererRef.current = renderer;

      const hasF16 = root.device.features.has('shader-f16');
      const variant = modelVariant(RECOMMENDED_MODEL, hasF16);
      if (!variant) {
        setError(true);
        return;
      }

      const response = await fetch(src);
      const blob = await response.blob();
      const bitmap = await createImageBitmap(blob);
      photoBitmapRef.current = bitmap;

      const modelBytes = await fetchModel(variant, new AbortController().signal);
      const bundle = parseDepthBundle(modelBytes);
      const plan = new DepthInferencePlan(root, bundle);
      await plan.initAsync();
      planRef.current = plan;

      renderer.attach(plan);
      renderer.syncSize();
      renderer.update({
        lightPosition: lightRef.current.lightPosition,
        lightZ: lightRef.current.lightZ,
        lightColor: [...defaultRelightingSettings.lightColor],
        mirror: false,
      });

      setLoading(false);
    } catch (err) {
      console.error('ProfileLight init failed:', err);
      setError(true);
      setLoading(false);
    }
  }, [src, hasWebGPU]);

  useEffect(() => {
    if (hasWebGPU && consent === true) {
      initPipeline();
    }
    return () => {
      cancelAnimationFrame(rafRef.current);
      planRef.current?.destroy();
      rendererRef.current?.destroy();
      rootRef.current?.destroy();
      photoBitmapRef.current?.close();
    };
  }, [initPipeline, hasWebGPU, consent]);

  useEffect(() => {
    const el = containerRef.current;
    const r = rendererRef.current;
    if (!el || !r || loading || error) return;
    const ro = new ResizeObserver(() => {
      r.syncSize();
      r.resetHistory();
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [loading, error]);

  useEffect(() => {
    if (!rendererRef.current || !photoBitmapRef.current || loading || error) return;

    let visible = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0.1 },
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    const loop = () => {
      if (!visible || !rendererRef.current || !photoBitmapRef.current) {
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      const hovering = hoveringRef.current;

      if (hovering) {
        const mp = mousePosRef.current;
        lightRef.current.updateFromMouse(mp.x, mp.y);
      } else {
        lightRef.current.orbitTick();
      }
      lightRef.current.tick();

      const color = neonColor(performance.now() - startTimeRef.current);

      rendererRef.current.update({
        lightPosition: lightRef.current.lightPosition,
        lightZ: lightRef.current.lightZ,
        lightColor: color,
      });

      const source = new VideoFrame(photoBitmapRef.current, {
        timestamp: performance.now() * 1000,
      });
      try {
        rendererRef.current.render(
          { source, uvTransform: d.mat2x2f.identity(), swapAxes: false },
          { skipDepth: false },
        );
      } finally {
        source.close();
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      observer.disconnect();
    };
  }, [loading, error]);

  if (!hasWebGPU || error || consent !== true) {
    return (
      <div ref={containerRef} className={`relative ${className}`} style={{ width, height }}>
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading="eager"
          className="glow-hover w-full h-full object-cover rounded-2xl"
        />
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`profile-light-container ${className}`} style={{ width, height }}>
      <canvas
        ref={canvasRef}
        className="profile-light-canvas pointer-events-none"
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '1rem',
        }}
      />
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl overflow-hidden"
            style={{ backgroundColor: BG_DARK_HSL }}
          >
            <div className="absolute inset-0 boot-scanlines opacity-30 pointer-events-none" aria-hidden="true" />
            <div className="relative z-10 px-4" style={{ fontFamily: MONO_FONT }}>
              {BOOT_LINES.map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.4, duration: 0.2 }}
                  className="text-[10px] sm:text-xs text-primary/80 whitespace-pre"
                >
                  {line}
                  {i === BOOT_LINES.length - 1 && (
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ repeat: Infinity, duration: 0.6, ease: 'linear' }}
                      className="inline-block w-[0.5em] h-[1em] bg-primary/70 align-text-bottom ml-px"
                      aria-hidden="true"
                    />
                  )}
                </motion.div>
              ))}
              <div className="mt-3 flex items-center gap-2">
                <div className="w-24 h-1 rounded-full bg-white/10 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-primary/70"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 3, ease: 'easeInOut', repeat: Infinity }}
                  />
                </div>
                <span className="text-[10px] text-primary/60">loading</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
