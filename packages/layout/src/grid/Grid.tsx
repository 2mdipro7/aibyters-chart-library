import React from "react";

export interface GridProps {
  children: React.ReactNode;
  /** Maximum number of columns on wide screens. */
  columns?: 1 | 2 | 3 | 4 | 6 | 12;
  /** Minimum width of a column before the grid drops a column. Default 320px. */
  minColumnWidth?: number;
  gap?: "sm" | "md" | "lg";
  className?: string;
  style?: React.CSSProperties;
}

const GAP = { sm: 12, md: 20, lg: 28 } as const;

/**
 * Responsive dashboard grid. Fits as many `minColumnWidth`-wide columns as the container
 * allows, capped at `columns`, so the same markup lays out correctly on phones, tablets,
 * laptops and wall displays without media queries in the host app.
 */
export function Grid({ children, columns = 3, minColumnWidth = 320, gap = "md", className, style }: GridProps) {
  const g = GAP[gap];
  return (
    <div
      className={`vi-grid ${className ?? ""}`.trim()}
      style={{
        display: "grid",
        gap: g,
        gridTemplateColumns: `repeat(auto-fit, minmax(min(100%, max(${minColumnWidth}px, calc((100% - ${(columns - 1) * g}px) / ${columns}))), 1fr))`,
        alignItems: "stretch",
        minWidth: 0,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export interface GridItemProps {
  children: React.ReactNode;
  colSpan?: number;
  rowSpan?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function GridItem({ children, colSpan = 1, rowSpan = 1, className, style }: GridItemProps) {
  return (
    <div
      className={`vi-grid-item ${className ?? ""}`.trim()}
      style={{
        // `span N` collapses gracefully when fewer than N columns exist.
        gridColumn: `span ${colSpan}`,
        gridRow: `span ${rowSpan}`,
        minWidth: 0,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
