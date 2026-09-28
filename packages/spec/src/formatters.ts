export function formatCurrency(value: number, currencyCode: string = "USD", locale: string = "en-US"): string {
  if (typeof currencyCode !== "string") currencyCode = "USD";
  if (typeof locale !== "string") locale = "en-US";
  if (value >= 1000000) {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currencyCode,
      maximumFractionDigits: 2,
    }).format(value / 1000000) + "M";
  }
  if (value >= 1000) {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currencyCode,
      maximumFractionDigits: 1,
    }).format(value / 1000) + "K";
  }
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencyCode,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPercent(value: number, locale: string = "en-US"): string {
  if (typeof locale !== "string") locale = "en-US";
  return new Intl.NumberFormat(locale, {
    style: "percent",
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatCompactNumber(value: number, locale: string = "en-US"): string {
  if (typeof locale !== "string") locale = "en-US";
  return new Intl.NumberFormat(locale, {
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatDate(value: Date | string | number, format: string = "default", locale: string = "en-US"): string {
  if (typeof format !== "string") format = "default";
  if (typeof locale !== "string") locale = "en-US";
  const d = new Date(value);
  if (format === "MMM YYYY") {
    return new Intl.DateTimeFormat(locale, { month: "short", year: "numeric" }).format(d);
  }
  if (format === "MMM D") {
    return new Intl.DateTimeFormat(locale, { month: "short", day: "numeric" }).format(d);
  }
  return new Intl.DateTimeFormat(locale).format(d);
}

export function formatDelta(value: number, locale: string = "en-US"): string {
  if (typeof locale !== "string") locale = "en-US";
  const formatted = new Intl.NumberFormat(locale, {
    style: "percent",
    maximumFractionDigits: 1,
  }).format(Math.abs(value));
  
  if (value > 0) return `+${formatted}`;
  if (value < 0) return `−${formatted}`; // proper minus sign
  return formatted;
}

export type ValueFormat = "number" | "count" | "currency" | "percent" | "compact";

export interface FormatOptions {
  locale?: string;
  currency?: string;
  /** Maximum fraction digits. */
  decimals?: number;
  /** Use compact notation (1.2M) above this absolute value. Default 100000 for "number", never for "count". */
  compactFrom?: number;
}

/**
 * Formats a value for display in a KPI or label. Unlike `formatCompactNumber`, small counts keep
 * every digit (8,999 stays 8,999, never "9K"), and compaction only kicks in above `compactFrom`.
 */
export function formatValue(value: number, format: ValueFormat = "number", opts: FormatOptions = {}): string {
  const { locale = "en-US", currency = "USD", decimals } = opts;
  if (!Number.isFinite(value)) return "—";
  const abs = Math.abs(value);
  switch (format) {
    case "percent":
      return new Intl.NumberFormat(locale, { style: "percent", maximumFractionDigits: decimals ?? 1 }).format(value);
    case "count":
      return new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(value);
    case "compact":
      return new Intl.NumberFormat(locale, { notation: "compact", compactDisplay: "short", maximumFractionDigits: decimals ?? 1 }).format(value);
    case "currency": {
      const from = opts.compactFrom ?? 1_000_000;
      if (abs >= from) return new Intl.NumberFormat(locale, { style: "currency", currency, notation: "compact", compactDisplay: "short", maximumFractionDigits: decimals ?? 1 }).format(value);
      return new Intl.NumberFormat(locale, { style: "currency", currency, maximumFractionDigits: decimals ?? (abs < 100 ? 2 : 0) }).format(value);
    }
    default: {
      const from = opts.compactFrom ?? 100_000;
      if (abs >= from) return new Intl.NumberFormat(locale, { notation: "compact", compactDisplay: "short", maximumFractionDigits: decimals ?? 1 }).format(value);
      return new Intl.NumberFormat(locale, { maximumFractionDigits: decimals ?? (Number.isInteger(value) ? 0 : 2) }).format(value);
    }
  }
}

/** Returns a formatter function bound to a format, for chart `valueFormatter` props. */
export function makeFormatter(format: ValueFormat, opts?: FormatOptions): (value: number) => string {
  return (v: number) => formatValue(v, format, opts);
}
