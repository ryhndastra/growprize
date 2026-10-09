import { useEffect, useRef } from 'react';
import { animate, useReducedMotion } from 'motion/react';

// animasikan angka saldo dengan menulis langsung ke node teks lewat ref,
// jadi tidak ada re-render react tiap frame dan tidak ada layout thrash.
// saat reduced motion aktif, nilai langsung dipasang tanpa animasi.
export function useAnimatedNumber(value: number, format: (next: number) => string) {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const previousRef = useRef(value);
  const formatRef = useRef(format);
  const reduceMotion = useReducedMotion();

  formatRef.current = format;

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;

    const from = previousRef.current;
    const to = value;
    previousRef.current = value;

    if (reduceMotion || !Number.isFinite(from) || !Number.isFinite(to) || from === to) {
      node.textContent = formatRef.current(to);
      return;
    }

    const controls = animate(from, to, {
      duration: 0.5,
      ease: 'easeOut',
      onUpdate: (latest) => {
        node.textContent = formatRef.current(latest);
      },
    });

    return () => controls.stop();
  }, [value, reduceMotion]);

  return nodeRef;
}
