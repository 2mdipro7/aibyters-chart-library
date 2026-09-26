import type { FieldMeta } from "@aibyters/spec";

export interface FormatOptions {
  /** Shown before currency values, e.g. "৳" or "$". Absent: the number alone. */
  currencySymbol?: string;
  /** BCP 47 locale for digit grouping, e.g. "en-US" (1,234,567) or "en-IN" (12,34,567). */
  locale?: string;
}

interface NumberOptions extends FormatOptions {
  /** Shorten large values: 12,500 becomes 12.5K. Meant for axes and tooltips, not tables. */
  compact?: boolean;
  /** Fixed number of decimals; by default integers get none and other values get two. */
  decimals?: number;
}

const DEFAULT_LOCALE = "en-US";

function digits(value: number, locale: string, decimals?: number): string {
  const places = decimals ?? (Number.isInteger(value) ? 0 : 2);
  return new Intl.NumberFormat(locale, { minimumFractionDigits: places, maximumFractionDigits: places }).format(value);
}

function compact(value: number, locale: string): string {
  return new Intl.NumberFormat(locale, { notation: "compact", compactDisplay: "short", maximumFractionDigits: 1 }).format(value);
}

/** 1234.5 -> "1,234.50"; with compact, 12500 -> "12.5K". Non-numbers come back as an em dash. */
export function formatNumber(value: unknown, options: NumberOptions = {}): string {
  if (typeof value !== "number" || !Number.isFinite(value)) return "—";
  const locale = options.locale ?? DEFAULT_LOCALE;
  const sign = value < 0 ? "−" : "";
  const abs = Math.abs(value);
  const body = options.compact && abs >= 1000 ? compact(abs, locale) : digits(abs, locale, options.decimals);
  return `${sign}${body}`;
}

/** Like formatNumber with the currency symbol in front: -1234.5 -> "−৳1,234.50". */
export function formatMoney(value: unknown, options: NumberOptions = {}): string {
  if (typeof value !== "number" || !Number.isFinite(value)) return "—";
  const symbol = options.currencySymbol ?? "";
  const text = formatNumber(value, options);
  return text.startsWith("−") ? `−${symbol}${text.slice(1)}` : `${symbol}${text}`;
}

/** Percent points as stored: 45.25 -> "45.3%". */
export function formatPercentPoints(value: unknown, options: FormatOptions = {}): string {
  if (typeof value !== "number" || !Number.isFinite(value)) return "—";
  return `${formatNumber(value, { ...options, decimals: 1 })}%`;
}

/** One cell of a DataFrame, shown the way its field asks for ("currency", "percent", "integer", dates). */
export function formatCell(value: unknown, field?: FieldMeta, options: FormatOptions = {}): string {
  if (value === null || value === undefined || value === "") return "—";
  const locale = options.locale ?? DEFAULT_LOCALE;
  if (typeof value === "number") {
    switch (field?.format) {
      case "currency":
        return formatMoney(value, options);
      case "percent":
        return formatPercentPoints(value, options);
      case "integer":
        return formatNumber(Math.round(value), { ...options, decimals: 0 });
      default:
        return formatNumber(value, options);
    }
  }
  if (value instanceof Date) return value.toLocaleDateString(locale);
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return String(value);
}

/** Axis and tooltip formatter for a set of measures: compact, with the symbol when every measure is money. */
export function axisFormatter(fields: (FieldMeta | undefined)[], options: FormatOptions = {}): (value: number) => string {
  const known = fields.filter((f): f is FieldMeta => Boolean(f));
  const allMoney = known.length > 0 && known.every((f) => f.format === "currency");
  const allPercent = known.length > 0 && known.every((f) => f.format === "percent");
  return (value: number) => {
    if (allPercent) return formatPercentPoints(value, options);
    if (allMoney) return formatMoney(value, { ...options, compact: true });
    return formatNumber(value, { ...options, compact: true });
  };
}
