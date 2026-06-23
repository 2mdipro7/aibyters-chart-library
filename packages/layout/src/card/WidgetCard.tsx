import React, { useState, useRef, useEffect } from "react";
import { downloadCSV, downloadExcel } from "@aibyters/core";

export interface WidgetCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  headerAction?: React.ReactNode;
  className?: string;
  /** Data array for export functionality. If provided, export buttons appear. */
  exportData?: Record<string, any>[];
  /** Column keys to include in export. Defaults to all keys from first data row. */
  exportColumns?: string[];
}

function ExportMenu({ data, columns, title }: { data: Record<string, any>[]; columns?: string[]; title: string }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div ref={menuRef} style={{ position: "relative", display: "inline-block" }}>
      <button
        onClick={() => setOpen(!open)}
        title="Export data"
        style={{
          background: "none",
          border: "1px solid var(--vi-color-surface-border)",
          borderRadius: "var(--vi-radius-md)",
          padding: "4px 8px",
          cursor: "pointer",
          color: "var(--vi-color-text-secondary)",
          fontSize: "12px",
          display: "flex",
          alignItems: "center",
          gap: "4px",
          transition: "all 0.15s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "var(--vi-color-text-primary)";
          e.currentTarget.style.borderColor = "var(--vi-color-text-secondary)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "var(--vi-color-text-secondary)";
          e.currentTarget.style.borderColor = "var(--vi-color-surface-border)";
        }}
      >
        {/* Download icon (inline SVG to avoid lucide-react dependency) */}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        Export
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: "calc(100% + 4px)",
            background: "var(--vi-color-surface-card)",
            border: "1px solid var(--vi-color-surface-border)",
            borderRadius: "var(--vi-radius-md)",
            boxShadow: "var(--vi-shadow-lg)",
            zIndex: 50,
            minWidth: 140,
            overflow: "hidden",
          }}
        >
          <ExportMenuItem
            label="Download CSV"
            icon={
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            }
            onClick={() => {
              downloadCSV(data, title, columns);
              setOpen(false);
            }}
          />
          <ExportMenuItem
            label="Download Excel"
            icon={
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="3" y1="9" x2="21" y2="9" />
                <line x1="3" y1="15" x2="21" y2="15" />
                <line x1="9" y1="3" x2="9" y2="21" />
              </svg>
            }
            onClick={() => {
              downloadExcel(data, title, columns);
              setOpen(false);
            }}
          />
        </div>
      )}
    </div>
  );
}

function ExportMenuItem({ label, icon, onClick }: { label: string; icon: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        width: "100%",
        padding: "8px 12px",
        background: "none",
        border: "none",
        color: "var(--vi-color-text-secondary)",
        fontSize: "13px",
        cursor: "pointer",
        textAlign: "left",
        transition: "all 0.15s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "var(--vi-color-surface-cardHover)";
        e.currentTarget.style.color = "var(--vi-color-text-primary)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "none";
        e.currentTarget.style.color = "var(--vi-color-text-secondary)";
      }}
    >
      {icon}
      {label}
    </button>
  );
}

export function WidgetCard({
  title,
  description,
  children,
  headerAction,
  className = "",
  exportData,
  exportColumns,
}: WidgetCardProps) {
  return (
    <div 
      className={`flex flex-col rounded-xl overflow-hidden shadow-card transition-shadow hover:shadow-glow bg-[var(--vi-color-surface-card)] hover:bg-[var(--vi-color-surface-cardHover)] border border-[var(--vi-color-surface-border)] ${className}`}
    >
      <div className="flex items-center justify-between p-4 border-b border-[var(--vi-color-surface-borderLight)]">
        <div className="flex flex-col">
          <h3 className="m-0 text-base font-semibold text-[var(--vi-color-text-primary)]">
            {title}
          </h3>
          {description && (
            <p className="m-0 mt-1 text-sm text-[var(--vi-color-text-secondary)]">
              {description}
            </p>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {exportData && exportData.length > 0 && (
            <ExportMenu data={exportData} columns={exportColumns} title={title} />
          )}
          {headerAction && <div>{headerAction}</div>}
        </div>
      </div>
      <div className="flex-1 flex flex-col p-4 relative" style={{ minHeight: 150 }}>
        {children}
      </div>
    </div>
  );
}
