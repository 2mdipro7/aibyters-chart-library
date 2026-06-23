import React from "react";

export interface FilterBarProps {
  children: React.ReactNode;
  className?: string;
}

export function FilterBar({ children, className = "" }: FilterBarProps) {
  return (
    <div className={`flex flex-wrap items-center gap-4 py-3 px-4 bg-[var(--vi-color-surface-elevated)] rounded-lg shadow-sm border border-[var(--vi-color-surface-borderLight)] ${className}`}>
      {children}
    </div>
  );
}
