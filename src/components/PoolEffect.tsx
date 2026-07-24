import { useEffect, useRef } from 'react';

export function PoolEffect() {
  const glowRef = useRef<HTMLDivElement>(null);

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
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div
        ref={glowRef}
        className="absolute w-72 h-72 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          left: '50%',
          top: '50%',
          background:
            'radial-gradient(circle at 50% 50%, hsl(var(--primary) / 0.30) 0%, hsl(var(--primary) / 0.12) 30%, transparent 55%)',
          filter: 'blur(25px)',
        }}
      />
    </div>
  );
}