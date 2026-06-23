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
