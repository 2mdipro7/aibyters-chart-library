import { scaleLinear } from "d3-scale";

export interface LinearScaleOptions {
  domain: [number, number];
  range: [number, number];
  nice?: boolean;
}

export function createLinearScale({ domain, range, nice = true }: LinearScaleOptions) {
  const scale = scaleLinear().domain(domain).range(range);
  if (nice) {
    scale.nice();
  }
  return scale;
}
