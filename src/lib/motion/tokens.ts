import type { ViewportOptions } from 'motion/react';

export const EASE = [0.16, 1, 0.3, 1] as const;

export const DURATION = {
  fast: 0.3,
  base: 0.5,
  slow: 0.7,
  focus: 0.9,
} as const;

export const VIEWPORT: ViewportOptions = { once: true, amount: 0.2 };

export const STAGGER = {
  row: 0.1,
  card: 0.08,
  child: 0.05,
} as const;

export const BOOT_TIMELINE = {
  overlay: 0.05,
  nav: 0.05,
  mainFocus: 0.05,
  hero: 0.1,
  heroChildren: 0.08,
  stats: 0.4,
  footer: 0.4,
} as const;

export const FOCUS_BLUR = 'blur(8px)';
export const FOCUS_SCALE = 1.03;
