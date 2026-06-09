/**
 * Animation Presets for Family Wealth Custodians
 * All animations follow "Executive Movement" philosophy:
 * - Smooth, purposeful motion (300-800ms)
 * - No bouncing or elastic easing
 * - Professional, subtle entrance/exit
 */

// Easing Functions
export const easing = {
  inOutCubic: [0.645, 0.045, 0.355, 1],
  outQuad: [0.25, 0.46, 0.45, 0.94],
  inOutQuart: [0.77, 0, 0.175, 1],
  outCubic: [0.215, 0.61, 0.355, 1],
};

// Page Transitions
export const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: easing.inOutCubic,
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.3,
      ease: 'easeInOutQuad',
    },
  },
};

// Section Reveals (on scroll into view)
export const sectionVariants = {
  initial: { opacity: 0, y: 40 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: easing.inOutQuart,
    },
  },
};

// Staggered Container (for lists, grids)
export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

// Staggered Item
export const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: easing.outCubic,
    },
  },
};

// Button Hover
export const buttonHoverVariants = {
  hover: {
    backgroundColor: '#2D3E4F', // slate-charcoal
    boxShadow: '0 4px 16px rgba(26, 35, 50, 0.16)',
    transition: { duration: 0.2 },
  },
  tap: {
    boxShadow: '0 1px 4px rgba(26, 35, 50, 0.2)',
    transition: { duration: 0.1 },
  },
};

// Card Elevation
export const cardHoverVariants = {
  hover: {
    y: -8,
    boxShadow: '0 4px 12px rgba(26, 35, 50, 0.08)',
    transition: { duration: 0.3 },
  },
};

// Modal/Overlay
export const modalVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: easing.outCubic,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.2 },
  },
};

export const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

// Input Focus
export const inputFocusVariants = {
  focus: {
    boxShadow: '0 0 0 3px rgba(90, 122, 138, 0.1)',
    transition: { duration: 0.2 },
  },
};

// Loading Skeleton
export const skeletonVariants = {
  animate: {
    opacity: [0.5, 1, 0.5],
    transition: { duration: 2, repeat: Infinity },
  },
};

// Success State
export const checkmarkVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.4 },
  },
};

// Error Message Reveal
export const errorVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: {
    opacity: 1,
    height: 'auto',
    transition: { duration: 0.3 },
  },
};

// Utility: Check if user prefers reduced motion
export const getPrefersReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Animation config that respects prefers-reduced-motion
export const getAnimationConfig = (duration: number = 0.6) => {
  const prefersReduced = getPrefersReducedMotion();
  return prefersReduced ? { duration: 0 } : { duration };
};
