import { scaleBand } from "d3-scale";

export interface BandScaleOptions {
  domain: string[];
  range: [number, number];
  padding?: number;
  paddingInner?: number;
  paddingOuter?: number;
}

export function createBandScale({ 
  domain, 
  range, 
  padding = 0.1,
  paddingInner,
  paddingOuter
}: BandScaleOptions) {
  const scale = scaleBand().domain(domain).range(range);
  
  if (paddingInner !== undefined || paddingOuter !== undefined) {
    if (paddingInner !== undefined) scale.paddingInner(paddingInner);
    if (paddingOuter !== undefined) scale.paddingOuter(paddingOuter);
  } else {
    scale.padding(padding);
  }
  
  return scale;
}
