export const colors = {
  // === NEUTRAL BASE PALETTE (Slate) ===
  slate: {
    50: "#f8fafc",
    100: "#f1f5f9",
    200: "#e2e8f0",
    300: "#cbd5e1",
    400: "#94a3b8",
    500: "#64748b",
    600: "#475569",
    700: "#334155",
    800: "#1e293b",
    900: "#0f172a",
    950: "#020617",
  },

  // === ACCENT PALETTE (Indigo — professional, neutral) ===
  accent: {
    50: "#eef2ff",
    100: "#e0e7ff",
    200: "#c7d2fe",
    300: "#a5b4fc",
    400: "#818cf8",
    500: "#6366f1",
    600: "#4f46e5",
    700: "#4338ca",
    800: "#3730a3",
    900: "#312e81",
  },

  // === SEMANTIC COLORS ===
  positive: { light: "#dcfce7", main: "#22c55e", dark: "#166534" },
  warning: { light: "#fef9c3", main: "#eab308", dark: "#854d0e" },
  critical: { light: "#fee2e2", main: "#ef4444", dark: "#991b1b" },
  info: { light: "#dbeafe", main: "#3b82f6", dark: "#1e40af" },

  // === CHART PALETTE (8-color accessible) ===
  chart: [
    "#6366f1", // indigo
    "#06b6d4", // cyan
    "#22c55e", // green
    "#f59e0b", // amber
    "#ef4444", // red
    "#a855f7", // purple
    "#ec4899", // pink
    "#14b8a6", // teal
  ],

  // === SURFACE (Dark theme default mapping source) ===
  surface: {
    background: "#0f172a", // slate-900
    elevated: "#1e293b", // slate-800
    card: "#1e293b", // slate-800
    cardHover: "#334155", // slate-700
    border: "#334155", // slate-700
    borderLight: "#475569", // slate-600
    grid: "#334155", // chart gridlines (dark)
    overlay: "rgba(0,0,0,0.6)",
  },

  // === TEXT ===
  text: {
    primary: "#f8fafc", // slate-50
    secondary: "#94a3b8", // slate-400
    tertiary: "#64748b", // slate-500 (alias kept for hosts that already use it)
    muted: "#64748b", // slate-500
    inverse: "#0f172a", // slate-900
  },

  // === SEMANTIC ALIASES (stable names for host overrides) ===
  semantic: {
    success: "#22c55e",
    warning: "#eab308",
    danger: "#ef4444",
    info: "#3b82f6",
  },

  /** Primary brand colour used for single-series marks, focus rings and selected states. */
  primary: "#6366f1",
} as const;

/**
 * Sequential and diverging ramps for heatmaps, choropleths and matrices.
 * Ordered light -> dark (sequential) and negative -> neutral -> positive (diverging).
 */
export const colorRamps = {
  sequential: ["#eef2ff", "#c7d2fe", "#a5b4fc", "#818cf8", "#6366f1", "#4f46e5", "#3730a3"],
  diverging: ["#ef4444", "#f59e0b", "#e2e8f0", "#22c55e", "#15803d"],
  heat: ["#fef3c7", "#fde68a", "#f59e0b", "#ea580c", "#b91c1c"],
} as const;
