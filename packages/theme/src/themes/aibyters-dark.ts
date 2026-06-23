import { colors, typography, spacing, radius, shadow, animation } from "@aibyters/tokens";
import { flattenTokens } from "../tokens-to-css";

// Optional AI Byters brand override
// Uses the dark theme as a base, but injects brand greens
const aibytersColors = {
  ...colors,
  accent: {
    ...colors.accent,
    400: "#C5EEB5", // light green
    500: "#009B57", // primary brand green
    600: "#03481E", // dark green
    900: "#0E2419", // darkest green
  },
  surface: {
    background: "#0E2419", // brand darkest green as background
    elevated: "#03481E", 
    card: "#03481E",
    cardHover: "#009B57",
    border: "#009B57",
    borderLight: "#C5EEB5",
    overlay: "rgba(14,36,25,0.8)",
  },
  chart: [
    "#009B57", // primary green
    "#C5EEB5", // light green
    "#03481E", // dark green
    ...colors.chart.slice(3) // fallback to standard chart colors
  ]
};

export const aibytersDarkThemeVars = flattenTokens({
  color: aibytersColors,
  font: typography.fontFamily,
  text: typography.fontSize,
  weight: typography.fontWeight,
  leading: typography.lineHeight,
  space: spacing,
  radius,
  shadow: {
    ...shadow,
    glow: "0 0 20px rgba(0,155,87,0.15)", // brand green glow
  },
  anim: animation,
});
