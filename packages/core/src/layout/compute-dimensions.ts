export interface Margins {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export function computeInnerDimensions(
  width: number, 
  height: number, 
  margins: Margins
) {
  const innerWidth = Math.max(0, width - margins.left - margins.right);
  const innerHeight = Math.max(0, height - margins.top - margins.bottom);
  
  return { innerWidth, innerHeight };
}
