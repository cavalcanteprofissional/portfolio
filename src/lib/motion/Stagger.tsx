import { forwardRef } from 'react';
import { motion } from 'motion/react';
import type { Variants } from 'motion/react';
import { staggerChild, staggerContainer } from './variants';
import { STAGGER, VIEWPORT } from './tokens';

interface StaggerProps {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  delayChildren?: number;
  amount?: number;
}

interface StaggerItemProps {
  children: React.ReactNode;
  className?: string;
  variants?: Variants;
}

export const Stagger = forwardRef<HTMLDivElement, StaggerProps>(
  function Stagger(
    { children, className, stagger = STAGGER.child, delayChildren = 0, amount },
    ref
  ) {
    return (
      <motion.div
        ref={ref}
        className={className}
        initial="hidden"
        whileInView="show"
        viewport={amount !== undefined ? { ...VIEWPORT, amount } : VIEWPORT}
        variants={staggerContainer(stagger, delayChildren)}
      >
        {children}
      </motion.div>
    );
  }
);

export function StaggerItem({ children, className, variants = staggerChild() }: StaggerItemProps) {
  return (
    <motion.div className={className} variants={variants}>
      {children}
    </motion.div>
  );
}
