import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface RevealOnceProps {
  children: ReactNode;
  // jeda kecil untuk mengurutkan kemunculan tanpa terasa lambat.
  delay?: number;
  className?: string;
}

// reveal sekali saat mount untuk menuntun mata ke header, bukan loop abadi.
// hanya transform dan opacity yang bergerak, dan reduced motion mematikannya.
export function RevealOnce({ children, delay = 0, className }: RevealOnceProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { duration: 0.4, delay, ease: [0.16, 1, 0.3, 1] }
      }
    >
      {children}
    </motion.div>
  );
}
