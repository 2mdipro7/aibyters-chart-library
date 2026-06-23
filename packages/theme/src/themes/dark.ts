import { colors, typography, spacing, radius, shadow, animation } from "@aibyters/tokens";
import { flattenTokens } from "../tokens-to-css";

export const darkThemeVars = flattenTokens({
  color: colors,
  font: typography.fontFamily,
  text: typography.fontSize,
  weight: typography.fontWeight,
  leading: typography.lineHeight,
  space: spacing,
  radius,
  shadow,
  anim: animation,
});
