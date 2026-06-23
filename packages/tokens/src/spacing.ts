export const spacing = {
  0: "0",
  0.5: "0.125rem",
  1: "0.25rem",
  1.5: "0.375rem",
  2: "0.5rem",
  3: "0.75rem",
  4: "1rem",
  5: "1.25rem",
  6: "1.5rem",
  8: "2rem",
  10: "2.5rem",
  12: "3rem",
  16: "4rem",
} as const;

export const radius = {
  none: "0",
  sm: "0.375rem", // 6px
  md: "0.5rem", // 8px
  lg: "0.75rem", // 12px
  xl: "1rem", // 16px
  "2xl": "1.25rem", // 20px
  full: "9999px",
} as const;

export const shadow = {
  none: "none",
  sm: "0 1px 2px rgba(0,0,0,0.3)",
  md: "0 4px 6px -1px rgba(0,0,0,0.3)",
  lg: "0 10px 15px -3px rgba(0,0,0,0.3)",
  xl: "0 20px 25px -5px rgba(0,0,0,0.3)",
  glow: "0 0 20px rgba(99,102,241,0.15)", // accent-500 with 15% opacity
  card: "0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3)",
} as const;
