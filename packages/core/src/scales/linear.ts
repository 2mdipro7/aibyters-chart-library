export interface LinearScaleOptions {
  domain: [number, number];
  range: [number, number];
  nice?: boolean;
}

export interface LinearScale {
  (value: number): number;
  invert: (px: number) => number;
  domain: () => [number, number];
  range: () => [number, number];
  ticks: (count?: number) => number[];
}

/** Rounds a domain outward to "nice" tick boundaries (d3-compatible behaviour, no dependency). */
export function niceDomain([lo, hi]: [number, number], count = 6): [number, number] {
  if (lo === hi) return [lo - 1, hi + 1];
  const step = tickStep(lo, hi, count);
  return [Math.floor(lo / step) * step, Math.ceil(hi / step) * step];
}

export function tickStep(lo: number, hi: number, count = 6): number {
  const span = Math.abs(hi - lo);
  const raw = span / Math.max(1, count);
  const pow = Math.pow(10, Math.floor(Math.log10(raw)));
  const err = raw / pow;
  const factor = err >= 7.07 ? 10 : err >= 3.16 ? 5 : err >= 1.41 ? 2 : 1;
  return factor * pow;
}

export function linearTicks(lo: number, hi: number, count = 6): number[] {
  if (!Number.isFinite(lo) || !Number.isFinite(hi)) return [];
  if (lo === hi) return [lo];
  const step = tickStep(lo, hi, count);
  const start = Math.ceil(Math.min(lo, hi) / step);
  const end = Math.floor(Math.max(lo, hi) / step);
  const out: number[] = [];
  for (let i = start; i <= end; i++) out.push(Number((i * step).toPrecision(12)));
  return out;
}

export function createLinearScale({ domain, range, nice = true }: LinearScaleOptions): LinearScale {
  const d: [number, number] = nice ? niceDomain(domain) : [...domain];
  const [d0, d1] = d;
  const [r0, r1] = range;
  const span = d1 - d0 || 1;
  const scale = ((v: number) => r0 + ((v - d0) / span) * (r1 - r0)) as LinearScale;
  scale.invert = (px: number) => d0 + ((px - r0) / ((r1 - r0) || 1)) * span;
  scale.domain = () => d;
  scale.range = () => range;
  scale.ticks = (count = 6) => linearTicks(d0, d1, count);
  return scale;
}
