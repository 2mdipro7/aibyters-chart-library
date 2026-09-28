import React from "react";

export interface FilterBarProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function FilterBar({ children, className = "", style }: FilterBarProps) {
  return (
    <div
      className={`vi-filter-bar ${className}`.trim()}
      role="toolbar"
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: 12,
        padding: "10px 14px",
        background: "var(--vi-color-surface-elevated, #fff)",
        border: "1px solid var(--vi-color-surface-borderLight, #f1f5f9)",
        borderRadius: "var(--vi-radius-md, 8px)",
        boxShadow: "var(--vi-shadow-sm, none)",
        minWidth: 0,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
