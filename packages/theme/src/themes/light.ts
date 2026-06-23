import { colors, typography, spacing, radius, shadow, animation } from "@aibyters/tokens";
import { flattenTokens } from "../tokens-to-css";

// We invert the surface and text colors for the light theme, 
// while keeping the base slate palette intact.
const lightColors = {
  ...colors,
  surface: {
    background: colors.slate[50],
    elevated: "#ffffff",
    card: "#ffffff",
    cardHover: colors.slate[50],
    border: colors.slate[200],
    borderLight: colors.slate[100],
    overlay: "rgba(255,255,255,0.6)",
  },
  text: {
    primary: colors.slate[900],
    secondary: colors.slate[600],
    muted: colors.slate[500],
    inverse: colors.slate[50],
  },
};

export const lightThemeVars = flattenTokens({
  color: lightColors,
  font: typography.fontFamily,
  text: typography.fontSize,
  weight: typography.fontWeight,
  leading: typography.lineHeight,
  space: spacing,
  radius,
  shadow: {
    ...shadow,
    glow: "0 0 20px rgba(99,102,241,0.25)", // stronger glow for light mode
    card: shadow.sm,
  },
  anim: animation,
});
