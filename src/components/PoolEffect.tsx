import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { useMouseStore } from '../stores/mouseStore';

interface PoolEffectProps {
  intense?: boolean;
}

const INTENSE_SIZE = 864;
const NORMAL_SIZE = 288;

const intenseRadius =
  'radial-gradient(circle at 50% 50%, hsl(var(--primary) / 0.90) 0%, hsl(var(--primary) / 0.36) 30%, transparent 60%)';
const normalRadius =
  'radial-gradient(circle at 50% 50%, hsl(var(--primary) / 0.30) 0%, hsl(var(--primary) / 0.12) 30%, transparent 55%)';

export function PoolEffect({ intense = false }: PoolEffectProps) {
  const glowRef = useRef<HTMLDivElement>(null);
  const [settling, setSettling] = useState(false);

  useEffect(() => {
    const timers: number[] = [];
    if (intense) {
      timers.push(window.setTimeout(() => setSettling(false), 0));
    } else {
      timers.push(window.setTimeout(() => setSettling(true), 0));
      timers.push(window.setTimeout(() => setSettling(false), 600));
    }
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [intense]);

  useEffect(() => {
    const mouse = { x: 0.5, y: 0.5 };
    const smooth = { x: 0.5, y: 0.5 };
    const el = glowRef.current;
    if (!el) return;

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX / window.innerWidth;
      mouse.y = e.clientY / window.innerHeight;
    };

    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      mouse.x = t.clientX / window.innerWidth;
      mouse.y = t.clientY / window.innerHeight;
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchmove', onTouchMove, { passive: true });

    let rafId: number;

    const tick = () => {
      smooth.x += (mouse.x - smooth.x) * 0.08;
      smooth.y += (mouse.y - smooth.y) * 0.08;
      el.style.left = `${smooth.x * 100}%`;
      el.style.top = `${smooth.y * 100}%`;
      useMouseStore.getState().set(smooth.x, smooth.y);
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
    };
  }, []);

  const elevated = intense || settling;

  return (
    <div
      className={`fixed inset-0 pointer-events-none overflow-hidden ${
        elevated ? 'z-[65]' : 'z-0'
      }`}
    >
      <div
        ref={glowRef}
        className="absolute -translate-x-1/2 -translate-y-1/2"
        style={{ left: '50%', top: '50%', width: INTENSE_SIZE, height: INTENSE_SIZE }}
      >
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ background: intenseRadius, filter: 'blur(60px)' }}
          initial={false}
          animate={{ opacity: intense ? 1 : 0 }}
          transition={{ duration: 0.6 }}
        />
        <motion.div
          className="absolute rounded-full"
          style={{
            left: '50%',
            top: '50%',
            width: NORMAL_SIZE,
            height: NORMAL_SIZE,
            background: normalRadius,
            filter: 'blur(25px)',
          }}
          initial={false}
          animate={{ opacity: intense ? 0 : 1, x: '-50%', y: '-50%' }}
          transition={{ duration: 0.6 }}
        />
      </div>
    </div>
  );
}
