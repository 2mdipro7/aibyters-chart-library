import React, { createContext, useContext, useMemo, useRef } from "react";
import { useContainerSize } from "@aibyters/core";

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

/** Number of columns the enclosing Grid currently renders (1 outside a Grid). */
const GridColumnsContext = createContext(1);
export function useGridColumns(): number {
  return useContext(GridColumnsContext);
}

/**
 * Responsive dashboard grid. Fits as many `minColumnWidth`-wide columns as the container
 * allows, capped at `columns`, so the same markup lays out correctly on phones, tablets,
 * laptops and wall displays without media queries in the host app. Items that span more
 * columns than currently exist are clamped, never overflowing.
 */
export function Grid({ children, columns = 3, minColumnWidth = 320, gap = "md", className, style }: GridProps) {
  const g = GAP[gap];
  const ref = useRef<HTMLDivElement>(null);
  const { width } = useContainerSize(ref);
  const cols = useMemo(() => {
    if (!width) return columns;
    return Math.max(1, Math.min(columns, Math.floor((width + g) / (minColumnWidth + g))));
  }, [width, columns, minColumnWidth, g]);
  return (
    <GridColumnsContext.Provider value={cols}>
      <div
        ref={ref}
        className={`vi-grid ${className ?? ""}`.trim()}
        style={{
          display: "grid",
          gap: g,
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          alignItems: "stretch",
          minWidth: 0,
          ...style,
        }}
      >
        {children}
      </div>
    </GridColumnsContext.Provider>
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
  const cols = useGridColumns();
  const span = Math.max(1, Math.min(colSpan, cols));
  return (
    <div
      className={`vi-grid-item ${className ?? ""}`.trim()}
      style={{
        gridColumn: `span ${span}`,
        gridRow: `span ${rowSpan}`,
        minWidth: 0,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
