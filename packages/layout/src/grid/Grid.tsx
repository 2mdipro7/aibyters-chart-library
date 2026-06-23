import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// In a real project we'd rely on a generic util for this
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface GridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4 | 6 | 12;
  gap?: "sm" | "md" | "lg";
  className?: string;
}

export function Grid({ children, columns = 3, gap = "md", className }: GridProps) {
  const gapClass = {
    sm: "gap-3",
    md: "gap-6",
    lg: "gap-8"
  }[gap];

  // Map to Tailwind grid columns dynamically or pre-compiled classes
  // We'll use inline styles for the column count to be reliable without full TW compilation
  return (
    <div 
      className={cn("grid", gapClass, className)}
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
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
}

export function GridItem({ children, colSpan = 1, rowSpan = 1, className }: GridItemProps) {
  return (
    <div 
      className={cn(className)}
      style={{
        gridColumn: `span ${colSpan} / span ${colSpan}`,
        gridRow: `span ${rowSpan} / span ${rowSpan}`
      }}
    >
      {children}
    </div>
  );
}
