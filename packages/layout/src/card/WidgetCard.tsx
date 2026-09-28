import React, { useEffect, useRef, useState } from "react";
import { downloadCSV, downloadExcel } from "@aibyters/core";

export interface WidgetCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  headerAction?: React.ReactNode;
  /** Rendered below the body, e.g. sources or footnotes. */
  footer?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  /** "plain" removes the border, background, and padding so the widget can live inside a host card. */
  variant?: "card" | "plain";
  /** Data array for export functionality. If provided, export buttons appear. */
  exportData?: Record<string, any>[];
  /** Column keys to include in export. Defaults to all keys from first data row. */
  exportColumns?: string[];
  /** Heading level for the title, for correct document outline in the host page. Default 3. */
  headingLevel?: 2 | 3 | 4 | 5;
  /** Removes the header entirely (title is still exposed to assistive tech via aria-label). */
  hideHeader?: boolean;
  id?: string;
}

/*
 * All styling is inline or scoped to `.vi-*` classes defined in @aibyters/theme.
 * The library must never rely on a host's Tailwind (or any utility CSS) being configured
 * to scan node_modules; that was the root cause of cards rendering unstyled in other apps.
 */
const styles = {
  card: {
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
    borderRadius: "var(--vi-radius-lg, 12px)",
    background: "var(--vi-color-surface-card, #fff)",
    border: "1px solid var(--vi-color-surface-border, #e2e8f0)",
    boxShadow: "var(--vi-shadow-card, none)",
    color: "var(--vi-color-text-primary, #0f172a)",
    fontFamily: "var(--vi-font-body, system-ui, sans-serif)",
    overflow: "hidden",
    boxSizing: "border-box",
    height: "100%",
  } as React.CSSProperties,
  plain: {
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
    color: "var(--vi-color-text-primary, #0f172a)",
    fontFamily: "var(--vi-font-body, system-ui, sans-serif)",
    boxSizing: "border-box",
  } as React.CSSProperties,
  header: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
    padding: "14px 16px 12px",
    borderBottom: "1px solid var(--vi-color-surface-borderLight, #f1f5f9)",
  } as React.CSSProperties,
  headerPlain: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
    padding: "0 0 10px",
  } as React.CSSProperties,
  title: {
    margin: 0,
    fontSize: "var(--vi-text-base, 15px)",
    fontWeight: 600,
    lineHeight: 1.3,
    fontFamily: "var(--vi-font-heading, inherit)",
    color: "var(--vi-color-text-primary, #0f172a)",
    overflowWrap: "anywhere",
  } as React.CSSProperties,
  description: {
    margin: "3px 0 0",
    fontSize: "var(--vi-text-sm, 13px)",
    lineHeight: 1.4,
    color: "var(--vi-color-text-secondary, #64748b)",
  } as React.CSSProperties,
  body: {
    flex: "1 1 auto",
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
    minHeight: 0,
    padding: 16,
    position: "relative",
  } as React.CSSProperties,
  bodyPlain: {
    flex: "1 1 auto",
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
    minHeight: 0,
    position: "relative",
  } as React.CSSProperties,
  footer: {
    padding: "8px 16px 12px",
    fontSize: 12,
    color: "var(--vi-color-text-muted, #94a3b8)",
    borderTop: "1px solid var(--vi-color-surface-borderLight, #f1f5f9)",
  } as React.CSSProperties,
};

function ExportMenu({ data, columns, title }: { data: Record<string, any>[]; columns?: string[]; title: string }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKey);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  const btn: React.CSSProperties = {
    background: "none",
    border: "1px solid var(--vi-color-surface-border, #e2e8f0)",
    borderRadius: "var(--vi-radius-md, 8px)",
    padding: "6px 10px",
    minHeight: 32,
    cursor: "pointer",
    color: "var(--vi-color-text-secondary, #64748b)",
    fontSize: 12,
    font: "inherit",
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
  };

  return (
    <div ref={menuRef} style={{ position: "relative", display: "inline-block" }}>
      <button type="button" onClick={() => setOpen(!open)} aria-haspopup="menu" aria-expanded={open} title="Export data" style={btn} className="vi-export-button">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        Export
      </button>
      {open && (
        <div
          role="menu"
          style={{
            position: "absolute",
            right: 0,
            top: "calc(100% + 4px)",
            background: "var(--vi-color-surface-card, #fff)",
            border: "1px solid var(--vi-color-surface-border, #e2e8f0)",
            borderRadius: "var(--vi-radius-md, 8px)",
            boxShadow: "var(--vi-shadow-lg, 0 10px 15px -3px rgba(0,0,0,0.2))",
            zIndex: 50,
            minWidth: 150,
            overflow: "hidden",
          }}
        >
          <ExportMenuItem label="Download CSV" onClick={() => { downloadCSV(data, title, columns); setOpen(false); }} />
          <ExportMenuItem label="Download Excel" onClick={() => { downloadExcel(data, title, columns); setOpen(false); }} />
        </div>
      )}
    </div>
  );
}

function ExportMenuItem({ label, onClick }: { label: string; onClick: () => void }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "block",
        width: "100%",
        padding: "10px 12px",
        background: hover ? "var(--vi-color-surface-cardHover, #f8fafc)" : "none",
        border: "none",
        color: hover ? "var(--vi-color-text-primary, #0f172a)" : "var(--vi-color-text-secondary, #64748b)",
        fontSize: 13,
        font: "inherit",
        cursor: "pointer",
        textAlign: "left",
      }}
    >
      {label}
    </button>
  );
}

export function WidgetCard({
  title,
  description,
  children,
  headerAction,
  footer,
  className = "",
  style,
  variant = "card",
  exportData,
  exportColumns,
  headingLevel = 3,
  hideHeader = false,
  id,
}: WidgetCardProps) {
  const Heading = `h${headingLevel}` as keyof JSX.IntrinsicElements;
  const plain = variant === "plain";
  const showExport = exportData && exportData.length > 0;
  return (
    <section
      id={id}
      className={`vi-widget-card ${plain ? "vi-widget-card--plain" : ""} ${className}`.trim()}
      style={{ ...(plain ? styles.plain : styles.card), ...style }}
      aria-label={hideHeader ? title : undefined}
    >
      {!hideHeader && (
        <div className="vi-widget-card__header" style={plain ? styles.headerPlain : styles.header}>
          <div style={{ minWidth: 0, flex: "1 1 auto" }}>
            <Heading style={styles.title}>{title}</Heading>
            {description && <p style={styles.description}>{description}</p>}
          </div>
          {(showExport || headerAction) && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, flex: "none" }}>
              {showExport && <ExportMenu data={exportData!} columns={exportColumns} title={title} />}
              {headerAction}
            </div>
          )}
        </div>
      )}
      <div className="vi-widget-card__body" style={plain ? styles.bodyPlain : styles.body}>
        {children}
      </div>
      {footer && <div className="vi-widget-card__footer" style={plain ? { ...styles.footer, padding: "8px 0 0", borderTop: "none" } : styles.footer}>{footer}</div>}
    </section>
  );
}
