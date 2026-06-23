import { describe, it, expect } from "vitest";
import { formatCurrency, formatPercent, formatCompactNumber, formatDelta } from "../formatters";

describe("Formatters", () => {
  it("formats currency", () => {
    expect(formatCurrency(1250000)).toBe("$1.25M");
    expect(formatCurrency(1500)).toBe("$1.5K");
    expect(formatCurrency(500)).toBe("$500");
  });

  it("formats percent", () => {
    expect(formatPercent(0.275)).toBe("27.5%");
    expect(formatPercent(1)).toBe("100%");
  });

  it("formats compact number", () => {
    expect(formatCompactNumber(1250000)).toBe("1.25M");
    expect(formatCompactNumber(1500)).toBe("1.5K");
  });

  it("formats delta", () => {
    expect(formatDelta(0.275)).toBe("+27.5%");
    expect(formatDelta(-0.032)).toBe("−3.2%");
    expect(formatDelta(0)).toBe("0%");
  });
});
