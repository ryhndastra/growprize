import type { Transition } from 'motion/react';

// kurva elegan bertipe out untuk kemunculan panel. masuk cepat, tenang di ujung.
export const EASE_OUT_PANEL: [number, number, number, number] = [0.16, 1, 0.3, 1];

// transisi panel dropdown: fade plus geser y kecil, hanya transform dan opacity.
export const PANEL_TRANSITION: Transition = {
  duration: 0.16,
  ease: EASE_OUT_PANEL,
};

// offset vertikal kecil untuk panel yang jatuh dari pemicunya.
export const PANEL_OFFSET_Y = 6;
