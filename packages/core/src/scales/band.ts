export interface BandScaleOptions {
  domain: string[];
  range: [number, number];
  padding?: number;
  paddingInner?: number;
  paddingOuter?: number;
}

export interface BandScale {
  (value: string): number | undefined;
  bandwidth: () => number;
  step: () => number;
  domain: () => string[];
  range: () => [number, number];
}

/** Ordinal band scale (d3 semantics, no dependency). */
export function createBandScale({ domain, range, padding = 0.1, paddingInner, paddingOuter }: BandScaleOptions): BandScale {
  const pi = paddingInner ?? padding;
  const po = paddingOuter ?? padding;
  const [r0, r1] = range;
  const n = domain.length;
  const width = r1 - r0;
  const step = n > 0 ? width / Math.max(1, n - pi + 2 * po) : 0;
  const bandwidth = step * (1 - pi);
  const start = r0 + step * po;
  const index = new Map(domain.map((d, i) => [d, i]));
  const scale = ((v: string) => {
    const i = index.get(v);
    return i === undefined ? undefined : start + i * step;
  }) as BandScale;
  scale.bandwidth = () => bandwidth;
  scale.step = () => step;
  scale.domain = () => domain;
  scale.range = () => range;
  return scale;
}
