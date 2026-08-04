import type { Variants } from 'motion/react';
import { EASE, DURATION, FOCUS_BLUR, FOCUS_SCALE, STAGGER } from './tokens';

type Direction = 'up' | 'down' | 'left' | 'right' | 'none';

const distance = (dir: Direction, amount: number) => {
  switch (dir) {
    case 'up':
      return { y: amount };
    case 'down':
      return { y: -amount };
    case 'left':
      return { x: amount };
    case 'right':
      return { x: -amount };
    default:
      return {};
  }
};

export const fadeUp = (amount = 24, delay = 0): Variants => ({
  hidden: { opacity: 0, y: amount },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.base, ease: EASE, delay },
  },
});

export const fadeIn = (delay = 0): Variants => ({
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: DURATION.fast, ease: EASE, delay },
  },
});

export const scaleIn = (delay = 0): Variants => ({
  hidden: { opacity: 0, scale: 0.8 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: DURATION.base, ease: EASE, delay },
  },
});

export const slideFrom = (dir: Direction, amount = 40, delay = 0): Variants => ({
  hidden: { opacity: 0, ...distance(dir, amount) },
  show: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: { duration: DURATION.slow, ease: EASE, delay },
  },
});

export const focusReveal = (delay = 0): Variants => ({
  hidden: { opacity: 0, scale: FOCUS_SCALE, filter: FOCUS_BLUR },
  show: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: DURATION.focus, ease: EASE, delay },
  },
});

export const staggerContainer = (
  stagger: number = STAGGER.child,
  delayChildren: number = 0
): Variants => ({
  hidden: {},
  show: {
    transition: { staggerChildren: stagger, delayChildren },
  },
});

export const staggerChild = (amount = 20): Variants => ({
  hidden: { opacity: 0, y: amount },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.base, ease: EASE },
  },
});
