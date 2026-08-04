import { useMemo } from 'react';
import { motion } from 'motion/react';
import type { Variants, ViewportOptions } from 'motion/react';
import { fadeIn, focusReveal, scaleIn, slideFrom } from './variants';
import { VIEWPORT } from './tokens';

type Direction = 'up' | 'down' | 'left' | 'right' | 'none';

const motionElements = {
  div: motion.div,
  section: motion.section,
  p: motion.p,
  h2: motion.h2,
  h3: motion.h3,
  span: motion.span,
  li: motion.li,
  a: motion.a,
  ul: motion.ul,
} as const;

type ElementTag = keyof typeof motionElements;

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  as?: ElementTag;
  direction?: Direction;
  distance?: number;
  delay?: number;
  blur?: boolean;
  scale?: boolean;
  amount?: number;
  viewport?: ViewportOptions;
}

export function Reveal({
  children,
  className,
  as = 'div',
  direction = 'up',
  distance = 24,
  delay = 0,
  blur = false,
  scale = false,
  amount,
  viewport = VIEWPORT,
}: RevealProps) {
  const variants = useMemo<Variants>(() => {
    if (blur) return focusReveal(delay);
    if (scale) return scaleIn(delay);
    if (direction === 'none') return fadeIn(delay);
    return slideFrom(direction, distance, delay);
  }, [blur, scale, direction, distance, delay]);

  const MotionTag = motionElements[as];
  const vp: ViewportOptions = amount !== undefined ? { ...viewport, amount } : viewport;

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={vp}
      variants={variants}
    >
      {children}
    </MotionTag>
  );
}
